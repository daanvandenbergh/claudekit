> **Phase 10 - Threat model**
> **Consumes:** `PROFILE` (00), `SCOPE` (05).
> **Produces:** `SURFACE-REGISTER` - the risk-ranked (entrypoint x crown-jewel) list that is the
>   fan-out unit and the priority function for every downstream phase; and the `EGRESS` inventory (10.7).
> **Gate:** BLOCKING for Phase 40. Nothing downstream is prioritised until the register exists.
>   When `SCOPE` carries a scope hint, the register rows are restricted to the scoped subtree
>   (out-of-scope files are recorded in COVERAGE as `excluded: out-of-scope`, never as residue).

# Phase 10 - Threat model

The phase that makes this an audit and not a scan. A scanner asks "which rules matched?" and sorts
by rule id; an audit asks "what can an attacker do to this business, and how?" and sorts by that.
This phase builds the lens - and **it runs before any scanner result is ranked**, because
reachability from an entrypoint is what turns "RCE in a dev-only build script" into a Low and "RCE
in the request path" into a Critical.

Do not start by reading files in directory order. Start where an attacker touches the system.

## 10.1 Entrypoint inventory (enumerate EVERY door, THEN classify)

Enumerate every place a request reaches server code, framework-aware from `PROFILE`: HTTP route
handlers, server actions / RPC, GraphQL resolvers, **every webhook handler**, queue/job consumers,
cron ticks, CLI entrypoints, public package exports, deserialization sinks, and every model tool the
agent can call. **Enumerate first, then classify - never define a class by the control you expect it
to have.** A webhook is not "a handler with a signature check"; enumerate the handler, then check
whether it verifies a signature - an **unsigned webhook is a FINDING, not an omission that hides it
from the census.**

**Enumeration cross-check (blocks "complete"):** diff the derived entrypoint set against a mechanical
census - every route file, every `use server` / exported action, every framework handler export,
every registered tool. A residue (a door the framework mounts that the derived set missed) is a
coverage gap that blocks the "complete" verdict, exactly like the file residue in Phase 40.4. For a
vendor-wrapped model SDK, enumerate the prompt-construction (Boundary A) and output/tool-dispatch
(Boundary B) sites at the **wrapper's** call sites, not the raw SDK tokens - a grep for `chat.completions`
misses an adapter that renames it. Count the entrypoints; the count is part of the coverage claim.

## 10.2 Caller class per entrypoint (the trust boundary)

Assign each entrypoint a caller class: **anonymous internet · authenticated tenant user · staff /
admin · third-party webhook · internal cron · the LLM itself.** That last class is the one no
generic scanner models: a voice-agent / RAG / tool-call webhook is invoked by a model whose context
holds attacker-supplied content (a phone transcript, a scraped page, a DB field another user wrote),
so the effective caller is anyone who can reach that content. Name it here in one line; Phase 40's
AI lens prosecutes it.

## 10.3 Crown jewels, ranked by blast radius

Grep the data layer (`PROFILE`'s tenant key, money type, secret registry) for the assets worth
attacking: credentials & key material, PII, money / ledger, tenant-scoped data, admin capability,
the ability to spend (paid third-party APIs), and the tenant boundary itself. Rank by "what does an
attacker win if the one function guarding this is wrong."

## 10.4 The authn/authz model, in one paragraph

How identity is established, what the tenant key is, **where it is enforced** (a perimeter layer vs
per-query - this distinction is the whole ballgame for access control), and the privilege boundary
(tenant vs staff plane).

## 10.5 Attack-tree hypotheses for the top 3 jewels

Each root is a **claim to disprove in code** - a far sharper instruction to a Phase-40 worker than
"review access control": *"read another tenant's <crown jewel>", "make the platform pay for <paid
action> I did not buy", "escalate from tenant user to staff", "extract a secret".*

## 10.6 Emit the SURFACE-REGISTER

The artifact everything downstream keys on. Group entrypoints into **surfaces** (an entrypoint class
+ trust boundary + the sinks it reaches), each a row:

| Surface | Caller class | Reachable jewels | Blast radius | Priority | Severity floor |
|---------|--------------|------------------|--------------|----------|----------------|
| `<name>` | anonymous / authed / staff / webhook / LLM | PII / money / secrets / tenant | one record -> one tenant -> all tenants -> platform | P0/P1/P2/P3 | High / Critical |

Risk-rank the rows (`reachability x asset value x change-recency`). The register is then used three
ways: it is **Phase 40's fan-out unit** (one trace worker per P0/P1 surface, call-depth scaled to
the rank), it is the **triage priority** (an unreachable scanner hit is dropped with a stated
reason, never silently), and it sets **severity floors** (a finding on a P0 crown-jewel path cannot
be rated below its floor - the structural defence against the reviewer-bias downgrade).

Print the register in the report (`phases/60-report.md`) so the user can correct a wrong read - a
threat model the user cannot see is a threat model they cannot fix.

## 10.7 Egress inventory

The register inventories where attacker data comes IN; this inventories where sensitive data goes
OUT. Enumerate every outbound sink - vendor SDK calls, `fetch`/HTTP clients, message/email/SMS sends -
and for each record the **data class it carries** (PII, credentials, tenant data, money) and the
**trust boundary crossed** (which third party receives it). This is a first-class attack surface
(exfiltration, SSRF, subprocessor exposure) and the raw material for Phase 55's subprocessor map: feed
it to the SSRF and AI-surface lenses, and flag any vendor receiving data that is not on the project's
declared subprocessor list as an undocumented-subprocessor finding.

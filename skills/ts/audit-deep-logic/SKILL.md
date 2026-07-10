---
name: audit-deep-logic
description: Top-down, whole-system audit of a codebase's DEEP LOGIC - the bugs that live in the SEAMS between modules, not inside any one file. Finds contracts that drift across module boundaries, invariants enforced on one path but broken on a sibling path, cross-cutting responsibilities (deletion cascade, tenant-scope, idempotency, audit) that silently miss a member OR a sibling entrypoint that skips them, distributed/emergent state machines no single module owns, data whose meaning or unit changes as it crosses a boundary, shared resources (a rotatable secret, a clock, a config) one module relies on that another silently breaks, and architecture-as-built diverging from architecture-as-intended. Every finding is a concrete cross-file trace (two sites on opposite sides of a named seam) with a falsifiable failure scenario, never an architecture essay. Use when the user asks how the pieces fit together, whether the design holds together, for an architecture / system-level / system-wide / cross-module / cross-boundary / integration / end-to-end logic review, "does this system compose", "audit how the modules interact", or "find the bugs a file-by-file review misses". This is the whole-system counterpart to a per-module audit: reach for a single-module audit to harden ONE file/module line-by-line; reach for THIS to audit how modules interact as a system. Do not use it for a single-module security/quality pass, bare-string i18n coverage, over-engineering, or test gaps.
user-invokable: true
argument-hint: "[subsystem or boundary, optional - omit for the whole system] [--fix] [--out <path>]"
---

# audit-deep-logic

Most AI audits read one file at a time and get sharper the closer they zoom in. That zoom is
exactly why they miss the most expensive bugs: the ones where **every file is locally, provably
correct and the defect lives in the seam between them** - a writer and a reader that disagree on
units, a rule enforced on the dashboard path but not the webhook path, a new collection nobody
wired into the deletion cascade, a *second* entrypoint that tears a tenant down without running
the cleanup, a lifecycle spread across four modules that can reach a state none of them believes
is possible, a rotatable secret one module reuses to encrypt another module's data forever. No
amount of line-by-line reading finds these, because no single line is wrong. You have to hold two
distant sites in view at once and prove they cannot compose.

This skill audits that layer and only that layer. It is **stack-agnostic** (it learns the
project's real boundaries first, then audits against *those*) and **artifact-driven**: it builds
a finite inventory of the system's seams, then prosecutes each one to a concrete, falsifiable
finding or clears it. The discipline that keeps it honest, stated once: **a finding exists only
when both sides of the seam have been read in this session, no existing bridge already reconciles
them, and a single-module audit of either side could not have seen it.** Everything below serves
that sentence.

## Two failure modes, held in balance

This skill has to win on **two axes at once**, and they pull against each other:

- **Precision** - never invent a cross-module bug, never re-report a single-file bug, never let an
  architecture essay masquerade as a finding. The Phase-3 gate exists for this.
- **Recall** - actually find the real seam bugs. The whole reason a user reaches for this skill is
  the expensive bug a file-by-file pass missed; a beautifully-disciplined report that finds *none*
  of them has failed the user as surely as a hallucinated one.

The trap is to buy precision by narrowing until nothing survives - building a tidy inventory,
proving one well-chosen seam, and declaring victory while three real bugs sit in seams you never
enumerated. **Precision is a gate on each finding; recall is a duty over the whole inventory.**
Concretely: enumerate the inventory *widely* (this is where recall is won - see Phase 1's
responsibility register and the sibling-entrypoint hunt), then gate each candidate *strictly*
(Phase 3). Widen what enters; never lower the bar to pass. **Do not stop at the first admissible
finding** - a single finding is never a stopping condition; the pass ends only when every
enumerated seam has a verdict.

## The one scope rule (read before anything else)

**If a bug is provable by reading ONE file top to bottom, it is OUT OF SCOPE here.** It belongs to
a line-by-line module review (if the project has a single-module audit skill, hand it off;
otherwise note it for a single-module pass). This skill owns only defects that require **two or more sites held
together** to demonstrate *and* that a single-module audit is **structurally incapable** of
producing - because it never opens the other side of the seam, or because the defect is an
*absence* across a whole set (of stores, or of entrypoints) that no single file contains.

If you catch yourself reading files in directory order, or writing a finding you could prove from
one file, stop - you have collapsed back into file-by-file mode, which is the one failure this
skill exists to avoid.

## Inputs

Everything after the command is one raw string. Parse it in prose:
1. Extract `--fix` and `--out <path>` if present, then strip them. The remainder is an optional
   **subsystem or boundary** to scope to.
2. **Default is the whole system.** A path argument does **not** mean "read that module's files"
   (that is a single-module audit) - it means **"audit the seams AROUND that module"**: the
   contracts it exports and imports, the entrypoints that reach its data, the invariants it
   participates in. Scope narrows *which seams are in the inventory*, never the lens.
3. `--fix` is off by default - see Phase 5. Report-only is the default because a seam fix touches
   two or more modules and needs human architectural buy-in.
4. `--out <path>` is off by default. Without it, the Phase-4 report is emitted **inline in the
   response** and nothing is written to disk. Pass `--out <path>` only when you want a durable,
   committed report (e.g. for cross-session multi-pass convergence or a persistent accepted-risk
   ledger); the path is yours to choose - the skill never assumes `docs/architecture/`.

---

## Phase 0: System profile (agnostic slot resolution)

Before hunting seams, learn the system's real shape. Read, in priority order: (1) the project's
architecture/standards doc - `CLAUDE.md`, `README`, `ARCHITECTURE.md`, any ADRs - the canonical
statement of *intended* architecture; (2) the dependency manifest and config (`package.json`,
`go.mod`, `pyproject.toml`, `tsconfig` path aliases, build/deploy config) for the module system,
the data layer, and the process/deploy topology; (3) the actual directory tree and a few real
files at the boundaries, to confirm the layout instead of assuming it.

Resolve these **system-shaped** slots. Each is a *slot with an explicit N/A skip* - this is what
keeps the skill agnostic. If the project does not have one, record "N/A" and move on; never
import another architecture's shape.

- **Module inventory + public surface** of each module (its namespace / barrel / exported API).
- **Process, deploy, and trust boundaries** - client/server, edge/node, service splits, any
  *declared* future extraction line (e.g. "backend/ must lift out untouched"), and every trust
  boundary (auth, webhook, tool-call, queue). *N/A if a single-process monolith with one trust
  zone.*
- **Data model**: every persistent store/collection/table, **which module owns each**, the
  **cross-store reference graph** (which id in store A points at store B), and the **tenant key**
  *if multi-tenant*. *N/A tenant analysis if single-tenant.*
- **Every external entrypoint** that can reach a write: routes, webhooks, tool-calls, cron/jobs,
  event consumers, startup hooks, public namespace methods.
- **Destructive, lifecycle & spend operations** - the operations whose *correctness is a
  whole-system property*: everything that **deletes or deactivates a parent entity** (delete
  account, delete/leave org, remove member, cancel/downgrade a subscription), everything that
  **spends money or a metered external resource** (buys a number, places a paid API/LLM/telephony
  call, sends an SMS), and everything that **exposes tenant data**. For each, list **every
  entrypoint that can reach it** - because the recurring, expensive bug is a *second* entrypoint
  that performs the operation while skipping the cleanup, gate, or cascade the first one runs.
  *This slot is the recall fix; do not skip it.*
- **Global orchestration / wiring points**: startup/instrumentation, middleware, DI, auth hooks -
  the places that stitch modules together.
- **Declared cross-cutting registries / responsibilities** - anything that must be honored across
  a whole set. Note that each has a **two-part must-cover set**: (a) the **data members** it must
  touch (every tenant store the cascade must delete, every critical store a validator must guard)
  *and* (b) the **trigger members** - every entrypoint/operation that must invoke it (every way a
  tenant can be destroyed must run teardown; every spend path must check entitlement; every
  external ingress must dedupe). Record both parts. *Manual cascade N/A if the DB does referential
  cascades.*
- **Shared cross-module resources** - a resource whose *properties* one module owns but another
  depends on: a secret and its **rotation policy**, a clock and its **timezone/zone assumptions**,
  a config/flag and its **mutability**, a connection/pool, an id and its **encoding**. Note who
  sets the property and who silently assumes it never changes. *N/A if none shared.*

Three guardrails, non-negotiable:
- **Code is the adjudicator; the doc is the ceiling.** Use the architecture doc to raise
  precision, but if it is thin, stale, or contradicts the code, derive the real boundaries from
  the code and say so. Never trust a documented contract you have not seen the code honor.
- **The architecture doc plays a double role** here: it is both the precision ceiling *and* the
  *intended-architecture spec* you audit drift against (Phase 2, DL2). But **stale-doc-vs-newer-
  code drift with no reproducible failure trace is an Informational doc-sync note, never a
  finding** - and never audit against a textbook architecture (hexagonal, DDD, microservices) the
  project never adopted.
- **Never fall back to a baked-in default.** If a slot cannot be resolved from doc or code, state
  that and ask - do not import a convention from another repo.

Read `reference/method.md` now if this is your first run - it has the concrete enumeration
commands (grep recipes) for each slot and the map format.

---

## Phase 1: Build the seam inventory (the anti-collapse + context-honesty gate)

This phase is **mandatory and blocking**: no Phase 2 finding may be raised before the inventory
exists, and every finding must cite an entry in it. Building it is what forces the top-down lens -
you cannot find a seam bug in a seam you never drew. **This phase is also where recall is won or
lost**: a seam absent from the inventory is a bug that will never be found, so enumerate widely.

Two rules govern the artifact:

1. **The map is throwaway navigation, and every contract in it is UNVERIFIED.** Build it from
   signatures, registries, and the import graph - fast, wide, shallow. It tells you *where* to
   look; it never tells you *what is true*. A contract is only established by reading the body in
   Phase 2. A map built from signatures + docstrings, trusted as fact, is how you hallucinate a
   contract from a stale doc - do not do it. Persist it to the scratchpad, not as a committed
   oracle; on a re-run, a prior map may seed only the *seam list*, never supply a contract.

2. **The inventory is FINITE and COUNTABLE, and coverage is claimed over it alone.** Enumerate,
   explicitly:
   - every **entrypoint → sink** pair (each external entrypoint traced to the stores/effects it
     reaches);
   - every **store with more than one writer** (the shared-state seams);
   - every **cross-module / cross-boundary import edge**;
   - the **responsibility register** (below) - the highest-yield table;
   - every **shared cross-module resource** and the property each consumer assumes of it.

   Report the inventory's **size** ("N seams, M shared stores, K responsibilities, R shared
   resources") and, at the end, **which enumerated seams were NOT examined and why.** Coverage is
   over *this inventory*, never over "the system." **Never claim "whole-system coverage."** If the
   inventory cannot be built within the context budget, **say so loudly and narrow the scope**
   (audit one boundary at a time) - never silently sample a fraction and write a confident clean
   verdict. A silently-sampled "clean" on critical infrastructure is the worst possible output.

### The responsibility register (the recall engine)

For **each** cross-cutting responsibility from Phase 0, write one row with **both** halves of its
must-cover set and the actual coverage, so a gap surfaces as a set-difference on either axis:

```markdown
| responsibility | data members (must-touch) | trigger members (must-invoke) | actually covered | candidates = must − covered |
| teardown       | every tenant-owned store  | every op that destroys a tenant (delete-account, delete-org, remove-member, ...) | stores swept by onDelete; entrypoints wired to it | any store OR any destroy-op not covered |
| entitlement    | -                         | every spend path (each paid ingress/op) | paths that check the live-subscription predicate | any spend path with no check |
| idempotency    | each external-event ledger| every at-least-once ingress + each side effect on its path | ingresses with a unique-key ledger | any ingress/effect not deduped |
```

The **trigger-member column is the fix for the biggest recall miss**: it forces the question "what
are ALL the entrypoints/operations that must honor this responsibility?", so a **sibling entrypoint
that bypasses the cascade/gate** (e.g. an org-delete endpoint that skips the account-delete
cleanup) becomes a visible empty cell instead of an invisible assumption. **The sibling-entrypoint
hunt is mandatory**: for every responsibility, do not stop at the obvious trigger - grep for every
other way the same effect can be reached.

---

## Phase 2: Seam audit - the deep-logic lens families

Work the inventory, not the file tree, and work **all** of it. Each family below is a **named
cross-module failure mode + a mechanical probe that produces CANDIDATES + the body-level resolution
that turns a candidate into a finding or kills it + a severity floor.** The probes are grep/trace
one-liners (recipes in `reference/method.md`); the archetypes with their known false-positive traps
are in `reference/seam-catalog.md` - **scan that catalog first each run.** Codes are `DL*` so they
never collide with a single-module audit's own codes.

Families DL1-DL2 are things a single-module audit is *structurally incapable* of producing.
DL3-DL7 are cross-module seams that are admissible **only** when the finding shows neither
single-module pass could see it (both sides read, no bridge, single-module-invisible).

**DL1. Cross-cutting completeness (set-difference over a whole set - stores AND triggers).** A
responsibility that must cover *every* member of a set silently omits one. The set has **two axes**
(from the responsibility register): the **data members** it must touch, and the **trigger members**
- every entrypoint/operation that must invoke it. *Probe:* for each axis, build the must-cover set
and the actually-covered set independently and diff. *Data-axis example:* a tenant store the
deletion cascade never deletes. *Trigger-axis example (the classic miss):* a **sibling entrypoint**
that performs the destructive/spend/exposing operation while skipping the responsibility - a
second way to delete a tenant that runs no teardown, a spend path that checks no entitlement, an
ingress that hits no idempotency ledger. *Resolution (this probe false-positives easily):* the diff
yields **candidates, never findings**; open the enforcing body and rule out, for each candidate,
(a) covered-via-indirection (the cascade runs through a namespace accessor, not a literal
reference), (b) third-party-owned (a framework's own tables/endpoints it handles itself), (c)
documented retention/exemption (cite the doc/comment). Only a survivor is a finding. *Floor:*
orphaned PII/credential, an ungated destroy path, or a tenant-scope gap = **High/Critical.**

**DL2. Architecture-boundary drift (declared boundary, real trace).** The built code violates a
*declared* structural boundary in a way that will actually break something - a layer that must not
import another does; a module reached through its internals instead of its public surface; a
"thin" handler holding business logic; a store written outside its owning accessor, voiding a
chokepoint invariant. *Probe:* turn each declared boundary into a mechanical query and, for each
hit, **prove the concrete consequence.** *Resolution:* a hit with a demonstrated consequence is a
finding; a hit with no provable consequence is an Informational doc-sync note. *Floor:* a bypassed
tenant/idempotency chokepoint = **Critical**; a lift-blocking import = **High.**

**DL3. Seam contracts (producer/consumer drift).** Module A writes a value (DB field, return
value, message payload) that module B reads assuming a different **shape, unit, optionality, enum
domain, encoding, or error semantics.** Each side is internally consistent; the contradiction lives
only in the pairing. *Probe:* for each shared field/type, bucket every site into writers vs readers
and tabulate each site's assumed unit/shape/optionality/enum. *Resolution:* **open both bodies** and
confirm the write really produces X and the read really assumes Y *today*; **grep for an existing
bridge** (a conversion, a normalizer) and show its absence. Watch units especially - money scale
(cents vs major), tax meaning (gross vs net), time (seconds vs ms, UTC vs wall-clock), identifier
encoding. *Floor:* money/identifier/tenant-key drift = **Critical/High.**

**DL4. Trust-boundary & control asymmetry (alternate-path bypass, on reads, writes, AND
destroy/spend ops).** The same sink or the same operation is reached from several entrypoints that
establish identity/authorization/entitlement with different strength; the **weakest path defines
the real posture**, but each path reads locally fine. This lens applies not just to data reads/
writes but to **every destructive and spend operation** (see Phase 0). *Probe:* a fan-in matrix -
every caller/entrypoint of each shared sink or operation, tabulated as {identity source, per-object
authz, entitlement/gate, is the key attacker-influenceable}. *Resolution:* flag any row weaker than
its siblings over the same protected data or operation. **Sharpened intended-asymmetry rule:** the
"this is intended" exception excuses **only a missing *identity* control on a path that has a
legitimate alternate identity mechanism** (a webhook signed with a secret has no user session *by
design*). It **never** excuses a path that can **spend money, destroy data, or expose data with NO
gate of any kind** (no identity AND no entitlement AND no ownership AND no rate limit) - that is a
missing compensating control, which is a **finding**, not an "intended posture," and not a design
observation. *Floor:* cross-tenant read/write, or an ungated spend/destroy, via the weak path =
**Critical/High.**

**DL5. Distributed state, ordering & fail-open outcomes.** A lifecycle or a unit of work spans
modules with no single owner. Look for: a state one module makes terminal that another can
re-enter; a status two modules advance concurrently with no guard; an external mirror that goes
stale on a dropped/reordered/missed event with **no reconcile path**; a multi-store unit of work
with **no shared transaction**; an ingress whose only outcomes are "serve" and "serve-with-default"
with **no reject/decline outcome**, so it acts on every input; a decrypt/parse failure that is
**fatal on one path and silent on another**, especially when a status read (that does not decrypt)
still shows "healthy" while every operation 500s. *Probe:* grep every writer of the status/existence
field across modules and reconstruct the combined machine; for each at-least-once ingress replay a
duplicate/out-of-order/late delivery through the **entire** side-effect set; for each "resolve then
serve" ingress, check whether the unresolved/unentitled branch still produces a working, billable
result. *Resolution:* name the exact event order/interleaving/branch that breaks it, and confirm no
upstream guarantee already prevents it. *Floor:* lost update / double-charge / stale-entitlement /
always-serve-billable-fallback on money or state = **Critical/High.**

**DL6. Duplicate source of truth / duplicate rule.** The same fact or rule is computed/normalized
in two or more places that can diverge (an "is-entitled" predicate, a phone normalizer, a revenue
sum), or a spend/exposure consumer that should gate on the canonical value gates on none. *Probe:*
grep the rule's vocabulary across modules, collect every implementation, diff their edge behavior.
*Resolution:* a concrete input where the copies produce different results, or a named consumer that
skips the gate entirely. *Floor:* a spend/data-exposure path gating on none = **High.**

**DL7. Shared-resource / property coupling.** One module owns a resource's *property* and another
module silently depends on that property never changing - so a legitimate change in module A
quietly breaks module B, with no contract between them stating the dependency. The recurring cases:
a **rotatable secret reused as a KDF / encryption key** for another module's at-rest data (rotating
the secret - a documented, expected op - permanently bricks decryption, often with no re-encryption
path and a status UI that still shows "healthy"); a **clock/timezone** one module reasons in wall-
clock and another in UTC/server-local; a **mutable config/flag** an invariant silently rides on; an
**id encoding** or **connection/pool** assumption. *Probe:* for each shared resource from Phase 0,
find who *changes* its property (rotate, reconfigure, change zone) and who *assumes it is stable*;
grep crypto sites (`hkdf`/`pbkdf2`/`createCipheriv`/`encrypt`) for the source of their key material
and check whether that source has a rotation story and a re-encryption/versioning path. *Resolution:*
name the concrete change (rotate the shared session/auth secret) and the concrete break (every stored token
undecryptable → every affected operation fails, UI still green). *Floor:* a routine op that silently
and permanently breaks a core flow or strands data = **High/Critical.**

> **Why these are not just a wider-glob single-module audit** (state this in every DL3-DL7
> finding): a single-module pass reads one module's files and, at best, *guesses* at the other
> side of a seam. DL1/DL2 need the whole registry, the full entrypoint set, or a declared boundary
> that no one module holds. DL3-DL7 are admissible only with **both sides read in this session and
> a stated reason the single-module pass could not have seen it** (it never opens the sibling; the
> defect is an absence across a set; the illegal state is emergent across writers; the coupling is
> a dependency neither file names). If a finding fails that test, it is a single-module finding
> wearing a costume - drop it or hand it off.

---

## Phase 3: Falsification & verification gate (the anti-slop core)

Every candidate from Phase 2 must clear **all** of these to become an admissible finding. This is
where hallucinated architecture and essay-slop die. **Widen the funnel at Phase 1-2; never widen it
here** - the gate stays exactly this strict.

1. **Two-site rule.** Names two exact `file:line` sites on **opposite sides of one named seam**
   (writer/reader, path-A/path-B, the specific import line, or the property-setter/property-assumer).
   One site is not a seam.
2. **Both-sides-read rule.** **Both** bodies were opened in this session before the mismatch was
   asserted. An unread half is a **question logged for follow-up, never a finding.**
3. **Single-module-invisibility test.** Reading either file alone in full does **not** reveal the
   defect, **and** a single-module audit of either side is structurally incapable of producing it.
   State the reason it clears this in the finding.
4. **No-existing-bridge rule.** You grepped for and ruled out any existing conversion, compensating
   control, reconcile job, boot sync, accessor indirection, or upstream guarantee that already
   reconciles the seam - and **showed its absence.** Set-difference output (on either axis - stores
   or triggers) is candidates only, resolved by reading the body, never shipped raw.
5. **Concrete-trigger rule.** States a specific trigger - exact input, event/interleaving order,
   set-element, or resource change - and the resulting wrong outcome (wrong charge, cross-tenant
   row, orphaned doc, dead state, bricked flow), **reproducible in the current code and expressible
   as a failing test.** A candidate that clears this rule **is a finding** - even if the *fix* is a
   policy decision (serve during dunning? refuse?). **You may NOT demote a concrete-trigger
   candidate to a Design observation to keep the report tidy or to avoid a judgement call.**
   "Could theoretically diverge" with no concrete trigger is what belongs in observations - a
   provable wrong outcome never is.
6. **LIVE vs LATENT label.** **LIVE** = both sides exist and are reachable today. **LATENT** = an
   absent participant (a store with no cascade writer yet, a sibling entrypoint not built yet); a
   LATENT finding must name the exact set, the missing member, and the precise future condition
   that makes it bite.
7. **Dedup + accepted-risk.** Check each touched module's prior audit report (if any) and every
   deliberate-shortcut comment ("known deviations" ledgers, marker comments); do **not** re-report a
   documented, accepted cross-module race. For each finding that overlaps a module's own report,
   state why the single-module pass could not have caught the seam manifestation. Reporting an
   *already-tracked* gap is fine when it is the direct answer to the audit question - but label it
   as tracked, and it does **not** substitute for finding the *untracked* seams (do not stop there).

**Severity comes only from a demonstrated trace**, via `reference/severity.md` (and its anti-
downgrade rule: a seam bug touching money, tenant isolation, idempotency, data-lifecycle, or a core
flow is Critical/High, not Medium). A candidate with **no reproducible trace** gets **no severity**:
it moves to a capped, non-blocking **Design observations** section that never affects the verdict -
and that section **may not hold anything trace-backed**, so a real Critical can never be parked
there to look tidy.

**Verification for `--fix` only:** after applying a fix, run the project's build and test commands
(from Phase 0) and confirm green before the next fix. Report-only runs do not modify code.

---

## Phase 4: Report

Emit the report **inline in the response** by default. Only when `--out <path>` was passed, also
write it to that path (creating parent dirs if absent) - a **repo-level, whole-system** report,
distinct from any per-module audit file; version it by pass and append, never overwrite prior
passes. Within a single invocation the parent already carries prior-pass state in context and hands
it to each convergence sub-agent, so the file is needed only to persist that across separate
sessions - which is exactly what `--out` opts into.

```markdown
# System Deep-Logic Audit

**Last audit:** YYYY-MM-DD (Pass N) - scope: <whole system | subsystem>

## Seam inventory & coverage (Pass N)
- Inventory size: N entrypoint→sink seams, M multi-writer stores, K responsibilities, R shared resources.
- Responsibility register (data-axis + trigger-axis coverage) attached below.
- Examined: <list / count>.  Not examined this pass: <seam - why>.
- Coverage is claimed over this inventory only, not "the system."

## Findings (Pass N)   [numbered per family per pass, Critical-first]

### DL1.1 <title> (Critical, LIVE)
- **Seam:** `siteA.ts:LINE`  →  <the shared datum / registry axis / boundary / operation / resource>  →  `siteB.ts:LINE`
- **Defect:** <what the two sides disagree on / what the set omits (store or trigger) / what boundary or coupling is breached.>
- **Trigger → outcome:** <exact input / event order / missing member / resource change → the concrete wrong result.>
- **Why a single-module audit can't see this:** <the sibling is never opened / it is an absence across a set / emergent across writers / an unnamed cross-module dependency.>
- **No bridge:** <the conversion/reconcile/guard/re-encryption you looked for and did not find.>
- **Fix:** <the cross-module change; which modules it touches.>

## Design observations (non-blocking, un-severitied)
- <design opinions with NO reproducible trace - never affect the verdict. A provable wrong outcome does not belong here.>

## Cross-module accepted-risk ledger
- <accepted seam races, with rationale - so future passes do not re-litigate them.>

## Seam inventory (this pass)
<the Phase-1 artifact incl. the responsibility register, or a link to it.>
```

**Verdict** = the **worst unfixed severity**, one line. Any unfixed Critical or High = **do not
ship.** A clean pass says "No admissible findings in this pass over the N-seam inventory" and lists
what was examined - never "the system is clean."

---

## Phase 5: Fix workflow (only with `--fix`) and multi-pass convergence

**Fixing (only when `--fix` is set).** A seam fix changes two or more modules, so apply findings
**one at a time**, Critical-first: make the change, re-run build + tests, confirm green, then the
next. If a fix needs disproportionate cross-module refactoring relative to risk, record it under
"Assessed but not patched" with the reason. Never leave a Critical seam unpatched without saying so.

**Breadth within a single pass.** Even without multi-pass, a single pass must **prosecute every seam
in the inventory** - every responsibility-register row (both axes), every shared resource, every
multi-writer store. One admissible finding does not end the pass. If budget forces a stop, say which
seams are unprosecuted (do not imply they are clean).

**Multi-pass convergence.** A reviewer who just built the map is biased toward declaring it
complete. So **every pass after Pass 1 is run by a fresh sub-agent**, and the fan-out unit is the
**seam, not the file or the phase**: the parent hands each sub-agent the shared seam inventory plus
**one seam (or one responsibility-register row) to prosecute** and the full Phase-3 admissibility
rules; each returns admissible findings only; the parent merges and dedupes against the inventory.
Framing for every fresh pass: **"Assume the modules disagree with each other, and that some
responsibility is skipped by a sibling entrypoint. Find where."** A pass is clean only with zero
admissible Critical/High/Medium and zero new Low; **two consecutive clean passes are required to
stop**; any new Critical or High resets the counter.

---

## What this skill is NOT (keep the lane sharp)

- **Not a per-file / single-module line-by-line review** - that is a single-module audit's job;
  hand single-file bugs off.
- **Not** a security/quality pass (injection, input validation, secrets, XSS, style, perf), a
  bare-string i18n sweep, an over-engineering hunt, or an audit-tests pass - those are other
  skills' lanes. This skill owns **only** cross-module contract / invariant / boundary / lifecycle /
  coupling correctness.
- **Not** an architecture essay. No prose deliverable: every output row is a matrix cell with a
  verdict, or a numbered finding with a two-site trace and a concrete trigger. No box-drawing, no
  framework name-dropping, no formal tooling (TLA+, ArchUnit) introduced as part of the audit.

## Reference

- `reference/method.md` - the concrete enumeration commands for Phase 0/1 (grep recipes per slot,
  incl. the destructive/spend-op census and the sibling-entrypoint hunt), the map + responsibility-
  register + fan-in-matrix formats, the set-difference resolution procedure, and the context-budget
  rules. Read on first run.
- `reference/seam-catalog.md` - the recurring cross-module bug archetypes with their probes **and
  their known false-positive traps**. Scan first each run; grows per project as real seams are
  found.
- `reference/severity.md` - the severity model and the anti-downgrade rule. If the project has a
  sibling single-module audit skill with its own severity file, defer to that one instead so the
  two reports interoperate.

# Verification and admissibility

The protocol Phase 40 (emit gate) and Phase 50 (triage) both run. Its whole job is to cut noise
without ever destroying a real finding - and those two goals pull against each other, so the
mechanism below is designed so the catastrophic direction is *structurally unreachable*, not merely
discouraged.

## The one structural decision: the ledger is APPEND-ONLY

**Nothing in this pipeline has a delete verb.** A finding is created once and never removed.
Verification mutates exactly one field - `confidence` - and *appends* a refutation record. A stage
may downgrade a finding's confidence, re-rank it, or attach a refutation; it may never make it
vanish.

Why this and not a "keep only the confirmed ones" filter: the worst outcome this skill can produce
is a confident "no issues found" that silently dropped real bugs. That has already happened in this
ecosystem - a verification pass whose refuters were told *"default to refuted if uncertain"* came
back with an empty verified list and **threw away five genuine bugs**. That was only *possible*
because a stage had the power to remove rows. Take the delete verb away and the worst case becomes
five real bugs sitting in a visible `## Refuted` section, each with a named reason - a 60-second
human read, not a silent loss.

## `unproven` is not `refuted`

The single most important distinction in the file. *"I could not build the exploit trace"* is a
statement about the **agent**, not about the **code**. It resolves to `unproven`, never to
`refuted`, and **an `unproven` finding is reported at its full severity.** Only a positively
demonstrated compensating control (see R3) closes a question. Absence of proof is not proof of
safety.

## The emit bar (Phase 40 - what a candidate must carry to become a finding)

A candidate is written to the ledger only when it carries **all four**:

1. **A concrete failure scenario** - specific inputs -> the specific wrong outcome, reproducible in
   the *current* code. `"A caller POSTs {organizationId:{$ne:null}} to /api/x -> the Mongo filter
   matches another tenant's rows -> PII returned"`, not `"could be exploited"`. **No scenario = not
   a finding.** It is a note for the EXCLUDED register, never a finding.
2. **A source -> sink trace**, every hop a real `file:line` the agent OPENED this session. A
   data-flow finding names source and sink; a single-site finding (a hardcoded secret) names the one
   site and its reachability.
3. **The named missing or ineffective control** - the ownership filter, the sanitizer, the
   idempotency key, the quota gate - *shown absent* between source and sink, not asserted.
4. **Why it is exploitable** - reachability + attacker-control in one or two sentences (feeds the
   reachability check below). If any leg is unproven, say which and label the finding `unproven` -
   do not omit it.

A candidate that clears the bar is written **even if the fix is a policy call**. You may not demote
a concrete-trigger finding to "observation" to keep the report tidy.

## The reachability check (three gates, run per candidate)

Answer each; an unanswered gate resolves to `unproven`, **never** to `refuted`.

1. **Real path from an entrypoint?** Trace backward from the sink to an actual route handler,
   webhook, server action, cron, or job tick - not a function that merely *could* be called. Only a
   test caller, or dead code, drops it (or `unproven` if you cannot tell).
2. **Attacker-controlled input?** Taint must originate at a trust boundary the attacker controls (a
   JSON body, a transcript, a webhook payload, a URL param). Explicitly-trusted sources - env vars,
   CLI flags, values the org's own authenticated owner sets - are not attacker control.
3. **A compensating control on EVERY path?** A guard on *one* caller does not clear the finding if a
   *sibling* entrypoint reaches the same sink ungated - that is the "fails silently on a sibling
   path" class. Check the guard is on the actual path in the trace, and check every other path into
   that sink.

## Verification: three roles with opposed priors (never N identical refuters)

Spawn three agents with different jobs and deliberately opposite priors, **one finding (or one tight
cluster) per invocation** - never the whole list at once, because a list plus a "refute these" prompt
creates cleanup pressure.

| Role | Job | Prior | May output | May NOT output |
|---|---|---|---|---|
| **V1 exploit-builder** | build the source->sink->wrong-outcome trace | "this IS real" | a trace -> `confirmed`; `R4`, `R5` | any refutation that is an *absence* claim |
| **V2 control-mapper** | enumerate the fan-in matrix; what gate each path carries | neutral | `R3`, `R1`; **or a severity RAISE** (a sibling path lacks the gate) | `R2`, `R6` (not its lane) |
| **V3 context-checker** | the mechanical checks only | "this is noise" | `R2`, `R5`, `R6`, `R7` only | `R1`, `R3`, `R4`; **and zero power over a trace-backed finding** |

### Adjudication is mechanical, not a vote

```
V1 produced a trace, and no valid R3 rebuts it         -> confirmed   (V3 cannot cancel a trace)
V1 produced a trace, BUT V2 shows a control on EVERY
   path covering THIS input class (a valid R3)         -> unproven    (the trace ignored a real
                                                          guard; downgrade, do NOT auto-confirm and
                                                          do NOT auto-refute - a human resolves it)
V2 shows a control on EVERY path, naming the input
   class it covers (a valid R3, standing on its OWN
   every-path evidence)                                -> refuted (R3)
V3 mechanical refutation with evidence                 -> refuted
anything else, including disagreement                  -> unproven (REPORTED, full severity)
```

Two precedence rules the branches encode, both learned from a real gap:
- **A trace does not auto-win over a proven every-path control.** If V1 builds a trace that ignores a
  genuine control V2 shows on every path (covering this exact input class), the finding is `unproven`,
  not `confirmed` - otherwise a trace that overlooked a real Zod boundary becomes an unrefutable false
  positive no role can retire.
- **R3 stands on its own evidence, not on V1's failure.** A refutation must present the control on
  every fan-in path independently; "V1 could not build a trace" is a statement about the agent
  (`unproven`), never a precondition that licenses a refute.

**Evidence beats absence. A tie goes to the finding.** This one line is the inversion of *"default
to refuted if uncertain."*

## The closed refutation list (R1-R7)

A refutation is a **positive claim with evidence**. Anything not on this list is not a refutation.

- **R1 NOT-REACHABLE** - requires the **exhaustive** caller set plus the entrypoint census. "I didn't
  find a caller" without a closed set is `unproven`, not R1.
- **R2 DEV-ONLY** - the dependency/file is not in the shipped artifact; cite the lockfile `dev:`
  group or the build-output exclusion.
- **R3 COMPENSATING-CONTROL** - a control at `file:line`, present on **every** fan-in path, covering
  **this specific input class**. A `z.string()` stops NoSQL operator-smuggling; it does NOT stop XSS,
  an SSRF URL, or a path traversal - the refutation must name the class it neutralizes.
- **R4 NOT-ATTACKER-CONTROLLED** - the **enumerated** source set, every member a trusted origin.
- **R5 ALREADY-FIXED** - the current code/lockfile line that fixes it.
- **R6 RULE-MISFIRE** - the scanner rule id and what it actually matches (a name, not a sink).
- **R7 DUPLICATE** - merges into finding X, raising its confidence; never drops.

> **Not on the list, therefore NOT a refutation:** "unlikely", "probably fine", "would require an
> unusual setup", "we have defence in depth", "seems unreachable". Each of these -> the finding
> **stays**.

### The `wrong_if:` clause (the anti-hand-waving filter)

Every refutation carries a **`wrong_if:`** clause - the concrete observation that would overturn it:
*"wrong if any route handler imports scripts/seed.ts"*, *"wrong if renderTemplate's 2nd arg ever
receives a request value"*. **A verifier who cannot write the `wrong_if` cannot refute** - it returns
`unproven`. You cannot write a `wrong_if` for "seems unreachable", so this is a mechanical filter on
unfalsifiable prose.

## Two axes, never multiplied (the anti-catastrophe rule)

The five-zeroed-bugs catastrophe is caused by **multiplying severity by confidence**, so an
uncertain-but-Critical finding scores low and vanishes. So:

- **Severity = impact IF real. Confidence = how sure. They are independent fields.** A
  tenant-isolation bypass is Critical whether the agent is 95% or 55% sure - it is emitted at Critical
  *with the confidence stated* (`severity: Critical, confidence: 0.6, status: unproven`). **Never
  lower a severity because you are unsure - lower the confidence field and keep the severity.**
- **The emit threshold bends for severity.** Ordinary findings need high confidence to emit
  (>=~0.7-0.8, Anthropic's `/security-review` floor). The **severity-floor classes** - auth, tenant
  isolation, money, PII, and every project invariant from `claude/audit-security/rules.md` - emit at
  *moderate* confidence as `unproven` and escalate, and **may not be dropped for low confidence.**

The sweep (Phase 40) may emit at most `probable` - **only Phase 50's panel sets `confirmed`**, so a
finding never reaches the report `confirmed` without adjudication. Read the cells below as "emit at
this confidence; the panel may promote to `confirmed` later":

| | Low / Med impact | High / Critical impact (auth, tenant, money, PII, project invariant) |
|---|---|---|
| **High confidence (>=0.8)** | emit `probable` | emit `probable` |
| **Moderate (0.5-0.8)** | emit only if obvious and concrete (`probable`) | **emit `unproven`, escalate - do NOT drop** |
| **Low (<0.5)** | drop -> EXCLUDED register with reason | **emit `unproven`, cite the unresolved gate - do NOT drop** (there is no `needs-investigation` state; a High+ `unproven` blocks the verdict) |

The expected cost of a missed Critical dwarfs a triage cycle spent refuting one. This is the
deliberate divergence from a precision-first PR reviewer: it optimises a comment budget; we guard
silent-failure invariants.

## The EXCLUDED register (nothing is dropped silently)

Every candidate the sweep declines is logged - one line: `<location> - <REASON_CODE> - <one sentence>`.
Reason codes: `THEORETICAL_DOS`, `NO_ATTACKER_CONTROL`, `UNREACHABLE`, `COMPENSATING_CONTROL_PRESENT`
(cite it), `DEFENSE_IN_DEPTH`, `TEST_ONLY`, `OUT_OF_SCOPE_SCA`.

This is the bridge to the append-only ledger: it turns *"the sweep chose not to raise this"* from a
silent drop into an auditable, re-openable decision - the same accountability the ledger gives what it
*does* raise. **A candidate that matches a baseline exclusion BUT also matches a project invariant:
the invariant wins, it is kept.**

## The deterministic hallucination verifier (runs before a finding enters the ledger)

The dominant LLM failure here is an ungrounded `file:line` or a claim that contradicts the code
(*"SQL injection"* citing a file with no query). Catch it with checks that need **no model** - they
are file reads and grep:

1. **Location exists** - the cited `file` exists and has that `line`.
2. **Quote matches** - the verbatim snippet the finding quotes matches the bytes at that location.
3. **Symbols exist** - every function/variable named in the trace greps to a real hit; a zero-hit
   symbol is a hallucination signal.
4. **No contradiction** - the claimed vuln class is consistent with the cited code.

**A failed check is NOT a silent drop - the verifier has no delete verb either.** This is the one
place the append-only guarantee could leak, because it runs *before* the ledger. So on a mismatch:
first **re-ground** - grep the finding's `quote`/symbol elsewhere in the file (a stale citation is
usually a real bug whose code moved a line) and, if found, rewrite the `sites` line and keep the
finding. Only if it cannot be re-grounded does it go to the **EXCLUDED register with reason
`STALE_CITATION`** (a fabricated location) - never into a void. A location the agent did not read this
session may not be cited in the first place; go read it, or do not claim it.

## The over-refutation tripwire

If verification refutes **> 70% of High-or-above findings**, or **100% of any single tool's
findings**, the report prints **`VERIFICATION SUSPECT`** and the run **auto-re-invokes V1 alone** on
the refuted High+ set with: *"Assume each of these is real. Build the trace."* Cheap, automatic, and
aimed precisely at the historical failure.

## The verifier prompt (verbatim - the guardrails live here)

Hand this to every verification agent, unchanged:

> You are verifying ONE security finding. **You cannot delete it.** Your only outputs are: (a)
> evidence attached to it, (b) a confidence value, (c) at most one refutation from the closed list
> R1-R7, with `file:line` evidence and a `wrong_if:` clause.
>
> **If you are uncertain, you MUST return `unproven`. Uncertainty is NEVER a refutation.** An absence
> of proof that the bug is real is not proof that it is false.
>
> A refutation is a *positive claim with evidence*: "this dependency is not in the production bundle -
> here is the lockfile line", "every caller of this sink passes through the Zod schema at x.ts:41, and
> that schema rejects the operator objects this rule is about". A refutation is NOT: "seems
> unreachable", "unlikely to be exploitable", "probably already handled", "low risk in practice".
>
> **Calibration, from this project's history:** a verification pass that defaulted to
> refuted-when-uncertain **zeroed out five genuine bugs** and shipped an empty, confident, clean list.
> A false negative here is the worst outcome this skill can produce. A false positive costs the reader
> sixty seconds. **Bias accordingly: when the evidence is thin, the finding survives.**

## The report never says "clean"

`## Refuted (N)` is **always rendered**, sorted by original severity, one line each: title, source,
refutation code, evidence, `wrong_if`. Every finding keeps `base_severity` alongside `severity`, so a
refuted row still reads `was C`. An empty verified list can therefore never read as an all-clear - the
reader sees exactly what was considered and dismissed, and why. Any **High-or-above finding at
`unproven` confidence BLOCKS** - the skill may not ship on *"I couldn't prove it."*

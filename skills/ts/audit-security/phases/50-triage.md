> **Phase 50 - Triage and verification**
> **Consumes:** `LEDGER` (candidates from 20/30/40), `SURFACE-REGISTER` (10), `ATTEST` (20),
>   `claude/audit-security/accepted.md`, and the prior `state/` (fingerprints).
> **Produces:** `LEDGER` (admitted) - candidates adjudicated to `admitted` / `rejected`, severity
>   finalised. **Nothing is deleted.** Read `reference/verification.md` in full first.
> **Gate:** BLOCKING for Phase 60. **JOIN BARRIER:** does not start until Phase 20 has TERMINATED for
>   every required tool (an `ATTEST` row exists, success or NOT-RUN) - so under `--quick` (no Phase 40
>   to hold the barrier) triage can never run over an unfinished network scan and read "clean".

# Phase 50 - Triage and verification

The phase that must not destroy real findings. Raw candidates are mostly noise, and a report full of
false positives trains the user to ignore it - but the opposite failure is worse: a confident "all
clear" that dropped real bugs (in this ecosystem's own history, refuter agents told to "default to
refuted if uncertain" once zeroed out five genuine bugs). This phase is built against that failure.

## 50.0 Load prior state (suppression + killed-candidate memory)

Before adjudicating, hydrate from `claude/audit-security/state/` (`reference/orchestration.md`): the
prior ledger's `refuted` / `accepted-risk` fingerprints, and `memory.jsonl`'s killed candidates. A new
candidate whose `fingerprint` matches a killed one with an **unchanged `code_hash`** skips
re-litigation (pre-suppressed as a known FP, still counted); a **changed `code_hash`** re-opens it.
This is what makes re-runs converge instead of re-litigating the same false positive - and it never
suppresses a genuinely new finding, because the `code_hash` gate re-opens anything whose code moved.

## 50.1 The structural rule

**The ledger is APPEND-ONLY. Nothing in this phase has a delete verb.** Verification mutates exactly
one field - `confidence` - and appends a refutation record; a candidate becomes `admitted` or
`rejected`, and a `rejected` row is **kept** and rendered in the report's `## Refuted` section. That
single rule makes the catastrophe structurally unreachable: the worst case is five real bugs sitting
in a visible Refuted list, sorted by severity, each with a named reason - a 60-second human read, not
a silent loss.

**`unproven` is not `refuted`.** "I could not build a trace" is a statement about the agent, not the
code. `unproven` findings are **reported at full severity.**

## 50.2 The three-role panel (never N identical refuters)

Per candidate (or tight cluster), spawn three agents with opposed priors - `reference/verification.md`
has the full prompts and the anti-bias guardrails:
- **V1 exploit-builder** (prior: this IS real) - builds the source->sink trace; may never refute by
  absence. Produces `confirmed` (trace holds) or "no trace" -> `unproven`.
- **V2 control-mapper** (neutral) - the fan-in matrix: what gate does each path into the sink carry.
  May produce a compensating-control refutation only if the control is on **every** path and covers
  **this** input class; **may RAISE severity** when a sibling path lacks the gate the reviewed path has.
- **V3 context-checker** (prior: noise) - mechanical refutations only (dev-only, already-fixed,
  rule-misfire, duplicate). **Zero power over a trace-backed finding.**

Adjudication is mechanical, not a vote: V1's trace -> `confirmed` (V3 cannot cancel it); V1 no-trace
+ V2 shows a control on every path naming the class -> `refuted`; V3 mechanical refutation with
evidence -> `refuted`; **anything else, including disagreement -> `unproven`, reported.** Evidence
beats absence; a tie goes to the finding.

## 50.3 The closed refutation list and the wrong_if clause

A refutation must be on the closed list (R1-R7 in `reference/verification.md`) and carry a
**`wrong_if:`** clause - the concrete observation that would overturn it. "Unlikely", "probably
fine", "seems unreachable" are not on the list -> the finding stays. A verifier who cannot write a
`wrong_if` returns `unproven`, not `refuted`.

## 50.4 Apply per-surface floors, finalise severity, apply accepted risks

**This is the ONLY place the threat-model severity floors are applied, so it is where a `--quick` run
(Phase 40 skipped) gets them at all.** For each finding, map its sink `site` to a `SURFACE-REGISTER`
row: set the finding's `exposure` from that row's caller class (a scanner/invariant lead otherwise
carries only a vendor base and would default to E3 - a Critical-surface hit landing bland), and **lift
`severity` to that surface's floor before** the anti-downgrade rule runs. A finding on a P0
crown-jewel path can never be rated below its floor - that is the structural defence against the
reviewer-bias downgrade, and without this step it is inert on the daily path.

Then set final severity from `reference/severity.md` (vendor base + the highest applicable exposure
class + the anti-downgrade rule; the arithmetic printed). Apply `claude/audit-security/accepted.md`: a
suppression matches only when its `rule + path + enclosing-symbol` matches **and** the guarded code's
`code_hash` is unchanged - if the code changed, the suppression does not apply and the finding returns
tagged `[SUPPRESSION STALE]`. Suppressed findings are **counted** in the report, never invisible.

## 50.6 Cross-run remediation reconcile

Load the prior admitted findings by `fingerprint` (line-independent, `reference/finding-schema.md`).
Each becomes: `still-open` (fingerprint present, code_hash unchanged), `regressed` (a `fixed` one
reappears - **escalate one level**; a control that was there and got removed is worse than one never
there), or `fixed` (absent this run, its cited code changed). This feeds the report's "Since last
pass" section, and it means a Critical fixed three passes ago is re-checked for regression, not
forgotten. This phase's edits stay within `reference/verification.md` as fixed: there is no
`needs-investigation` state, the sweep emits at most `probable` (only this panel sets `confirmed`),
and the hallucination verifier re-grounds a stale citation or logs `STALE_CITATION` - it never
silently drops.

## 50.5 The over-refutation tripwire

If verification refutes **>70% of High-or-above findings**, or **100% of any one tool's findings**,
the run prints `VERIFICATION SUSPECT` and **automatically re-invokes V1 alone** on the refuted High+
set with "Assume each of these is real. Build the trace." Cheap, automatic, aimed exactly at the
historical failure. This never deletes a refutation - it can only revive a finding to `unproven`.

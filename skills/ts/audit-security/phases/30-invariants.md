> **Phase 30 - Project invariants**
> **Consumes:** `PROFILE`, `claude/audit-security/rules.md` (if present).
> **Produces:** `RULES-HITS` (candidates per rule) and `HEALTH` (the rule-health table).
> **Gate:** BLOCKING for Phase 40 (its per-surface RULES checks come from here). Read
>   `reference/rules-format.md` in full first.

# Phase 30 - Project invariants

No generic scanner will ever find a project's own silent bugs - "every query filters on the tenant
key", "a new collection goes in the deletion cascade or it orphans PII forever", "a value spliced
into a pipeline update must be literal-wrapped", "refund only what you can prove was never sent." All
exploitable, all silent, not one in any ruleset. This phase hunts the project's own invariants from
`claude/audit-security/rules.md`. The full format, worked example, and the `accepted.md` spec are in
`reference/rules-format.md`; the phase mechanics:

## 30.1 No rules file -> bootstrap (do not shrug and run gitleaks)

If `claude/audit-security/rules.md` is absent, offer to draft it. Evidence, in descending
credibility: **past audit reports** (a shipped bug is a proven invariant - the highest-quality
signal in the building), **git history** (the files with the most fix commits, and every revert - a
function fixed four times has an invariant nobody wrote down), **the existing test suite** (harvest
enforced invariants and write them pre-`graduated:`), `CLAUDE.md`, and **chokepoint archaeology** (a
`require*`/`resolve*`/`assert*` helper with many callers announces its own rule). Two admission bars:
the failure must be **silent** (if violating it reddens a test, it is already enforced) and it must
be **violable by code that does not exist yet.** **Show no proposed rule to the human until its hunt
has RUN and come back non-empty**, and present it with live numbers ("44 sites; 2 of them look wrong
to me right now"). Write only the rules the user keeps.

## 30.2 HUNT then VERDICT - one mechanism, not three

For each rule (all kinds - mechanical, dataflow, semantic):

1. **HUNT** - run the rule's fenced `hunt` block: one deliberately **over-broad** ripgrep that
   enumerates every site the rule is in play (the correct calls and the broken ones together). Its
   job is recall, not precision - false positives are fine, false negatives are fatal.
2. **VERDICT** - one sub-agent per rule reads that bounded candidate set (paths + lines; it never
   greps and never wanders) and adjudicates against the rule's `✗`/`✓` pair, which is handed to it
   verbatim as the few-shot. Findings enter the ledger as `source: invariant`, `status: lead`.

Do NOT generate Semgrep rules from the invariants - a subtly wrong generated rule returns zero
matches and looks exactly like a pass, which is the precise silent-failure this phase exists to hunt.

## 30.3 The vacuity guard - run BEFORE any verdict, report ABOVE the findings

The hunts run first, as a blocking step, and produce the **rule-health table** (`HEALTH`). For each
rule: did the hunt clear its `expect:` count floor, and did its named `witness:` file appear? A rule
whose hunt matches nothing, or whose witness is gone (the code moved or was renamed), is a **RULE
FAILURE** - reported above the findings, never counted as a pass. When a witness vanishes, offer a
repair ("witness `lib/client-ip.ts` is gone; `ClientIp.resolve` now lives at `net/client-ip.ts` -
update the rule?").

One hard law, enforced by `phases/60-report.md`: **the report may never print "0 findings" without
the site count beside it.** "0 findings / 0 sites hunted" must be impossible to mistake for "0
findings / 137 sites hunted."

## 30.4 Graduation (the nursery)

Each adjudicating agent answers one extra question: *did deciding any of these sites require reading
beyond the matched line?* If a rule was all-mechanical, **offer to write it into the project's own
test suite** - the rule's `expect:` floor lifts across verbatim as the generated test's vacuity
guard. The rule then carries `graduated: <test path>` and this phase skips it, while still verifying
each run that the test exists and still has a vacuity guard of its own (delete the test and the rule
un-graduates and comes back). Semantic rules never graduate, and that is the point. The graduation
rate is the honest metric of this phase.

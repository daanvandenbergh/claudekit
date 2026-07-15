# The finding record (the lingua franca)

Every phase that emits or reads a finding uses this one shape. It is what keeps the phases
decoupled: swap the scanner set, rewrite the LLM catalog, or change the report format, and nothing
else moves - because all of them speak only this record. The **ledger is append-only**: a phase
appends rows and may flip `status`/`confidence`/`severity` **in place**, but **no phase ever
deletes or rewrites another pass's row.** That single rule is what makes the five-zeroed-bugs
catastrophe structurally impossible.

## Fields

```yaml
id:         SEC-AC1.3          # <CHECK-CODE>.<n> - allocated by the producing phase, STABLE across passes
title:      "IDOR on booking cancel - client bookingId trusted without ownership check"
                              # the FAILURE, not the rule name ("... unvalidated", not "javascript.mongodb.taint")
check:      SEC-AC1           # the coded lens/rule it came from (reference/lenses.md, or a RULES id)
source:     llm-audit         # scanner:osv | scanner:gitleaks | scanner:semgrep | scanner:trivy | scanner:trufflehog | invariant | llm-audit
source_ref: "the vendor/rule id + link, so the reader can check us"
cwe:        CWE-639           # classification the report's Classification line needs (may be a list)
owasp:      "A01:2025"        # OWASP Top 10 (or API:API1:2023) category
asvs:       "V8.2.2"          # the ASVS 5.0 requirement id (optional)
cvss_vector: null             # optional CVSS v4.0 vector - secondary only (severity.md); never reorders
surface:    webhook-ingress   # the THREAT-MODEL surface this maps to (the Phase-40 fan-out unit)
severity:   Critical          # FLOOR when written by 40; FINAL after 50. Impact-if-real (reference/severity.md)
base_severity: "H (semgrep ERROR)"  # the vendor base kept forever, even when refuted (was-C stays readable)
severity_calc: "H + E4 (unauthenticated webhook, no gate) -> Critical"   # the printed arithmetic
confidence: unproven          # confirmed | probable | unproven | refuted - INDEPENDENT of severity; never blended
exposure:   E4                # E0-E5 (reference/severity.md); one-line reason in severity_calc
status:     candidate         # candidate -> admitted | rejected | fixed | accepted-risk | deferred
pass:       1                 # which pass produced it
live:       LIVE              # LIVE (reachable today) | LATENT (names the future condition that arms it)
fingerprint: "a91f3c8e"       # sha1(check + normalized_relpath(sink) + enclosing_symbol + normalized(quote))[:8]
                              #   - LINE-INDEPENDENT; the cross-run + dedupe + suppression key (unify w/ accepted.md)
first_seen: { commit: "a3f9c21", date: "2026-07-14" }   # for cross-run "since last pass" tracking
sites:                        # >=1; a data-flow finding needs BOTH source and sink
  - { file: "api/cancel.ts",     line: 42, role: source }   # client-supplied id enters
  - { file: "bookings/repo.ts",  line: 88, role: sink }     # reaches the query with no owner filter
quote: "collection.findOne({ _id: new ObjectId(id) })"      # the load-bearing line, VERBATIM from the sink site
failure_scenario: "POST /cancel with another tenant's bookingId -> cancels a booking the caller
                   does not own (cross-tenant write)"        # inputs -> wrong outcome. REQUIRED to be `confirmed`.
trace: "req.body.bookingId (api/cancel.ts:41) -> repo.cancel(id) (bookings/repo.ts:88) filter has no owner key"
no_bridge: "grepped bookings/* for an ownership/tenant predicate on this path; none between source and sink"
control:    "missing: ownership check keyed on the session principal before the write"  # the named absent/weak control
fix:        "add { organizationId } to the filter at the accessor chokepoint; take it from the session, never the body"
effort:     S                 # S (<30min) | M (<half day) | L (multi-day / needs design)
verification:                 # appended by Phase 50; each role's verdict + evidence + wrong_if
  - { role: V1, verdict: confirmed, evidence: "trace holds; reachable from the public POST", wrong_if: "..." }
```

## The three fields that make a finding real

A record is not `confirmed` without all three - they are the house's "named failure mode +
concrete probe" made mandatory:

1. **`failure_scenario`** - concrete inputs -> wrong outcome. "Could theoretically" is not a
   finding; without a scenario a candidate can be `unproven` and reported, never `confirmed`.
2. **`sites` + `trace`** - every hop a real `file:line` the agent OPENED this session (the
   anti-hallucination ground truth); a data-flow finding names source AND sink.
3. **`quote` + `no_bridge`** - the offending line quoted verbatim, and evidence that the guard
   which would make it safe is absent between source and sink.

## Status and confidence, kept separate

- **`confidence`** is set by the sweep (Phase 40) and adjudicated by the panel (Phase 50):
  `confirmed` (trace holds) / `probable` / `unproven` (a gate the agent could not resolve - **never
  a synonym for refuted**) / `refuted` (positively disproven from the closed R1-R7 list, with a
  `wrong_if`). `unproven` findings are **reported at full severity**.
- **`status`** is the lifecycle: `candidate` (written by 40) -> `admitted`/`rejected` (by 50) ->
  `fixed`/`accepted-risk`/`deferred` (by 70). A `rejected` row is **kept** (append-only) and
  rendered in the report's `## Refuted` section - an empty verified list can never read as an
  all-clear. `60-report.md` renders each `status` in its own words (an `admitted` row is `open` or
  `proposed`; a Tier-C leaked secret is `rotation-pending`) - the report vocabulary is a rendering of
  these canonical values, not a second set.
- **There is no `needs-investigation`.** A High-or-above finding the sweep could not resolve is
  `confidence: unproven` (`status: candidate`), which is reported at full severity and **blocks the
  ship verdict** - the same rule that covers every `unproven` High+. Do not invent a state outside
  these enums; a state the block rule does not name is how a real finding silently fails to block.

## The EXCLUDED register (the other half of honesty)

A candidate the sweep declines is not dropped - it is logged as a one-line register entry so triage
can audit and re-open the decision:

```
<file:line> - <REASON_CODE> - <one-sentence why>
```

Reason codes: `THEORETICAL_DOS`, `NO_ATTACKER_CONTROL`, `UNREACHABLE`, `COMPENSATING_CONTROL_PRESENT`
(cite it), `DEFENSE_IN_DEPTH`, `TEST_ONLY`, `OUT_OF_SCOPE_SCA`, `STALE_CITATION` (the deterministic
hallucination verifier could not ground the cited line - see below). A candidate that matches a
baseline exclusion **but also** a project invariant: the invariant wins, it is kept.

**The EXCLUDED register is the ONLY place a candidate may leave the pipeline without a ledger row.**
In particular, when the deterministic hallucination verifier (`reference/verification.md`) cannot
match a finding's `quote` to the bytes at its cited line, it must **re-ground** the finding by symbol
name, or, failing that, write a `STALE_CITATION` register entry - **never a silent drop.** A stale
citation is often a real bug whose code moved one line; destroying it silently is the exact
catastrophe the append-only ledger exists to prevent.

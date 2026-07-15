# Self-test and the recall canary (the trust backbone)

The scanners already carry a per-run canary (`reference/scanners.md`): a tool installed but running zero
rules scans everything and finds nothing, so before trusting it we prove it can still bite. The LLM sweep -
the skill's whole value over a diff review - had no such check: a degraded worker's "no findings" was
byte-for-byte identical to a clean repo. This file gives the sweep the **same dead-man's-switch discipline**,
plus an offline calibration harness that measures the skill version's real precision/recall.

## Two instruments, one fixture corpus

| | **Self-test (calibration)** | **Recall canary (in-run liveness)** |
|---|---|---|
| Question | "Does this SKILL VERSION catch what it claims?" | "Is THIS worker, THIS run actually looking?" |
| Runs | offline, when the skill changes (`--self-test`) | every pass of every real audit (Phase 0.6) |
| Measures | recall + precision + calibration vs ground truth | recall only - a kill/survive dead-man's-switch |
| Fails how | blocks the skill edit (the ratchet) | HARD STOP the audit run |
| Analogy | a full mutation-testing run of the skill's "suite" | one live mutant that must be killed each pass |

Both share ONE source of truth: `fixtures/manifest.yaml` + `fixtures/<id>/`. The self-test runs the whole
skill against the corpus offline; the recall canary transplants a rotating subset of the SAME fixtures into
the live target and checks they are re-found. This is mutation testing - seed a known fault; a surviving
mutant (un-found canary) proves a hole in the detector, not clean code.

---

## Instrument 1 - the recall canary (in-run, every audit)

### Phase 0.6 - arm the recall canary (runs after scope snapshot in 00.3, before any sweep)

Ordering is load-bearing: scope is snapshotted first so canary files never appear in the report's "Audit
Scope", and the plant must exist before a worker reads the tree.

1. **Select the armed set deterministically.** `seed = sha1(target_commit + skill_version)`. From
   `manifest.yaml` pick the lenses to arm: default **3 of the silent-failure lenses, rotated by seed**;
   **always** add any lens whose failure mode is present in scope (arm the idempotency canary if scope has a
   webhook; the authz canary if it has sibling server-actions); for a pre-release gate, arm all 8.
2. **Plant.** Copy each chosen fixture into a scratch overlay of the target tree under a marker path the
   RECONCILER knows but the WORKER is never told: `.audit-scratch/<seedhash>/...`, plus a per-file marker
   comment stripped from what the worker sees. The discovery workers now see the canary files as ordinary
   repo code. (The plant lives in an ignored, never-imported, never-executed path - it cannot alter the
   target's behaviour or its tests.)
3. **Record** the armed set + each fixture's expected fingerprint (below) in run state (`state/run.json`).

### Canary reconcile - after EVERY sweep pass, before dedup/severity/fix

The **reconciler** is a trusted step, NOT a discovery worker: it holds the manifest; the worker does not (so
the worker cannot study to the test).

- Match this pass's union of findings against the armed canary fingerprints. For each armed lens: **killed**
  (re-found) or **survived**.
- **Any armed canary the pass union did not kill -> HARD STOP.** Emit the `COVERAGE UNPROVEN` block (below),
  discard the pass's coverage claim, and re-run the pass with a fresh worker. **Two consecutive survivals of
  the same lens -> abort the audit** and tell the user the instrument is failing; do NOT emit a "clean"
  verdict. This is exactly the scanner-canary failure escalation, now on the sweep.
- **Strip every canary-path finding** before it flows to dedup, severity, Phase 70, and the report. Canary
  files are self-contained inert modules, so ANY finding in a canary path is either the plant or a false
  positive - both stripped, neither reaches the user.
- **Release gate:** assert **0 canary fingerprints survive into the emitted report** (belt-and-suspenders
  against contamination).

### Why this cannot contaminate the real report
Plant lives in an ignored scratch path (never imported/executed); injected AFTER 00.3 snapshots the real file
list (absent from "Audit Scope"); the reconciler (not the worker) owns the manifest and the strip step;
findings/fix/report all operate on the post-strip set; a final 0-canary assertion is the release gate.

---

## Instrument 2 - the self-test (offline, on skill change)

`--self-test` runs Phase S against `fixtures/` and emits a scorecard INSTEAD of auditing a target.
Maintainer-only; run it whenever the skill's phases, lenses, or verification change. Because we own the
ground truth, all metrics are exact.

### Metrics
- **Recall (primary)** = caught / planted, per lens and overall. Weighted above precision on purpose: in a
  security audit a missed vuln is worse than a false alarm.
- **Precision** = (reported findings matching a plant, or a genuine bug in the fixture) / all reported. The
  `traps[]` in each fixture make the denominator honest - a report that flags a trap is a precision miss.
- **Severity calibration** = fraction of caught plants assigned >= their `severity_floor` (under- AND
  over-rating both count) - guards the habitual downgrade `severity.md` already warns about.
- **Confirmed calibration** = of the findings the skill labelled `confirmed`, what fraction are actually real?
  A reliability check (two bins: confirmed / suspected, and their true rate). Catches BOTH failure
  directions: over-confidence, AND the adversarial-refuter bias in project memory ("default to refuted zeroed
  out 5 real bugs" - a refuter wrongly marking real plants refuted shows here as recall loss).

### The ratchet (pass bar - a skill edit that regresses is blocked)
- Union over K runs must catch **8/8** (a lens the union still misses = the skill genuinely can't see it).
- Per-run recall **>= 7/8 AND no lens at 0 AND precision >= the prior version AND no lens below its last
  checkpoint.** Any lens dropping below its `manifest.version` checkpoint blocks the skill edit.

---

## Determinism (why two runs converge, and how the canary stays reliable)

LLM sweeps are non-deterministic and variable-naming-sensitive. Handle it, don't pretend it away:

- **Stable fingerprint:** `fp = sha1(f"{lens}::{norm(path)}::{sink_anchor}")[:8]` - keyed on the stable
  symbol/sink, NEVER the line number (drifts on edits) and NEVER the prose (varies per run). This is the same
  `fingerprint` field `reference/finding-schema.md` and `accepted.md` use - one key for dedupe, cross-run
  comparison, the multi-run union, and the canary kill test. A canary "kills" iff its expected fp appears.
- **Recall via multi-run UNION** (`--runs N`): union the sweep's findings across N runs; recall rises
  monotonically with N. The audit's real recall is the union's; the canary must be killed by the union AND
  tracked per-pass (per-pass = liveness).
- **Precision via CONSENSUS:** a finding from 1/N workers = `suspected`; from a majority = `confirmed`
  (feeds the confidence label). Consensus RANKS, it never DELETES - dropping a 1-of-N finding is the
  five-zeroed-bugs failure. Union for the set, agreement for the ordering.
- **Seeded partitions:** partition scope across workers by `hash(path, seed)` (cheap union of different
  files), but OVERLAP the canary-bearing files so >=2 workers independently see each armed canary (needed for
  a per-lens consensus on the kill). `seed = skill_version + target_commit` -> identical re-partition on
  re-run = reproducible coverage (the prose is not, and that is fine).
- **Regression:** on unchanged code, two runs need fingerprint-set Jaccard >= threshold AND an identical
  canary-kill set. A canary killed last run that survives this run = instrument regression -> HARD STOP.

---

## The honest report wording (this is the trust backbone)

The dishonesty to kill is a bare "clean." "We found nothing" is meaningful only paired with the demonstrated
sensitivity of the instrument that found nothing. So every clean verdict cites recall.

**Confidence & coverage block (every run):**
> **Coverage & confidence.** This pass armed recall canaries for: `<lenses>` - all killed (N/N), so the sweep
> is proven live on these lenses THIS run. Other lenses rely on this skill version's self-test recall:
> **overall 0.NN** (per-lens breakdown). A clean pass therefore means: no finding survived a sweep whose
> measured sensitivity on planted bugs of these kinds is ~0.NN - NOT "the code is safe." Weakest lens:
> `<lens>` (0.NN) - treat a clean result there as low-confidence.

**HARD-STOP block (a survived canary):**
> **WARNING - COVERAGE UNPROVEN: instrument liveness check failed.** The `<lens>` recall canary was planted
> and the sweep did not re-find it. The worker was degraded or not looking; its "no findings" is not
> trustworthy. This pass's coverage claim is discarded and the pass re-run with a fresh worker. No "clean"
> verdict is emitted while a canary is dead.

**Amended verdict** (replaces the bare "worst unfixed severity"):
> Verdict = worst-unfixed-severity, qualified by coverage. `No unfixed High+ - canaries N/N live - self-test
> recall 0.NN` -> **PASS (measured)**. Any armed canary dead -> **UNVERIFIED - re-run**, never PASS. A clean
> report with a dead canary is a lie the skill must refuse to tell.

---

## Benchmark corpora (context, not the gate)

The skill's OWN shipped fixtures are the authoritative gate: they map 1:1 to the lenses and cannot leak into
training data. Periodically cross-check against a slice of external corpora to guard against the fixtures
over-fitting the skill - but do NOT make any of these the primary gate, they are each flawed:
- **Usable, source-only:** SecurityEval (small smoke), SVEN (manually vetted -> precision), RealVuln
  (26 repos, 676 vulns + 120 FP-traps, ranked by F3 - the model for the vuln+trap fixture shape), the
  hint-removed white-box adaptation of the XBOW web benchmarks.
- **Caveated:** OWASP Benchmark + CyberSecEval (synthetic, gameable via superficial cues - a sanity floor
  only); Juliet/SARD (synthetic, template-matchable); PrimeVul (label-noisy, hard).
- **Out of scope (need a live target):** CVE-Bench, CyberGym (grade a running exploit, not source reasoning).

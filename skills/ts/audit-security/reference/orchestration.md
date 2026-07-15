# Orchestration - reliability and scale

The skill already has the honesty spine: the Phase-40 coverage matrix (`residue = manifest -
union(files_touched)`, blocks the `complete` verdict, spawns mop-up), the append-only ledger + the
EXCLUDED register, the per-tool-version canary, the exit-code table, and a verdict vocabulary that
cannot say "clean". This file is **additive** - it does not rebuild any of that. It makes the run
**durable, deterministically partitioned, resumable, and honest under a budget**, by doing three
things: persist the state that today lives only in-context, give the file manifest a **total
ownership function**, and wire three existing honesty mechanisms (residue, append-only ledger,
`code_hash` staleness) to three new triggers (a budget floor, a dead worker, an unchanged baseline).

## The persisted state dir

`claude/audit-security/state/` - gitignored (add it to the consumer's `.gitignore`). Every phase
reaches it only through these artifacts, same one-way rule the phases already obey.

| File | Holds | Notes |
|------|-------|-------|
| `manifest.json` | the coverage matrix, persisted: one row per in-scope file - `{ path, owner, status, code_hash }` | `status` in `traced \| swept \| skimmed \| excluded \| pending`. This IS Phase 40.4's matrix, on disk. |
| `ledger.jsonl` | the append-only findings (existing `finding-schema.md` shape, one per line) | never rewritten; a re-run appends. |
| `memory.jsonl` | killed candidates (EXCLUDED entries) + explored `source->sink` chains, keyed by `fingerprint + code_hash` | the reuse cache; invalidated on any code change (below). |
| `canary.json` | canary result per `<tool>@<version>` | the existing per-version canary, moved off in-context so it survives runs (~3s only on a new version). |
| `run.json` | `pass`, baseline commit, budget tier reached, the worker-status table, the partition seed | the resume/attestation record. |

`code_hash` = `sha1` of the file's normalized bytes (whitespace collapsed). It is the single
staleness key: a cache entry, a suppression, or a carried-forward finding is valid only while the
`code_hash` of its cited lines is unchanged. **Never trust anything across a code change.**

## Total file-ownership partition (one owner per file)

The fan-out unit stays the **attack surface** (a file-scoped worker can't see a cross-file IDOR).
Underneath it, `owner(file)` makes mop-up, resume, and honest partials principled instead of ad hoc:

```
owner(file) =
  claimants = surfaces whose import/grep closure from the SURFACE-REGISTER includes file
  if claimants:  argmin(claimants, by (priority_rank, surface_name))   # deterministic tie-break
  else:          "unclaimed"  -> sharded: shard = hash(relpath) mod ceil(|unclaimed| / shard_size)
```

Total, pure, deterministic over `(manifest, SURFACE-REGISTER, seed)`. Every file has **exactly one**
owner for accounting, even when several surfaces *read* it for tracing. So `union(files_touched)` is
reconstructable, mop-up covers exactly the `unclaimed` shards, and a resumed run reproduces the same
shards. Cap files-per-worker at the context budget (context past ~50k tokens measurably rots); split
a big surface into ordered sub-shards; process shards in `SURFACE-REGISTER` risk-rank order.

## `--resume` and the `pending` state

`pending` = an owned shard this run has not reached (budget out, worker died, interrupted). **Any
owned `pending` shard forces verdict `INCOMPLETE`** - never a thin clean report. `--resume` reads
`manifest.json`, skips files whose `code_hash` is unchanged and `status` is terminal, and re-audits
`changed` + `pending`. Resume from where it was, do not restart.

## `--since <ref>` - incremental / CI mode (orthogonal to `--quick`)

`--quick` is **shallow-but-wide** (drops the Phase-40 sweep + ASVS, still whole-repo). `--since` is
**deep-but-narrow** (full depth, shrinks the sweep's *denominator*). They compose. Default baseline =
the last run's commit in `run.json`.

- **Dirty set** = `git diff --name-only <ref>` UNION the reverse-dependency closure of the changed
  files (a changed helper reaches its callers - reachability, not just the touched line).
- **Carry-forward (the honesty core).** Load `ledger.jsonl`; **every `open | admitted | unproven`
  finding at High+ is re-injected regardless of whether its file is in the diff.** Re-run the
  deterministic hallucination verifier: unchanged bytes -> `still-open`, re-surfaced; changed bytes
  -> re-audited, **never auto-closed**. An unfixed Critical/High can never hide behind "its file
  wasn't in this diff."
- **Scanners still run whole-repo** (osv + gitleaks-history are inherently global and cheap).
  `--since` narrows only the LLM sweep.
- **Coverage honesty.** Denominator = dirty set + carried-forward set; the verdict qualifies
  `INCOMPLETE over the M-file diff` unless a full baseline pass exists in state. A green incremental
  run is never a whole-repo bill of health.

## Polyglot repos - no language silently skipped

- Phase 00 emits `LANGUAGES` = the marker set UNION a **file-extension histogram over the manifest**
  (so a lone `.py` in a Node repo is detected even with no lockfile).
- Per language, the coverage/ATTEST table records: which semgrep lang-pack ran + its canary result
  (pack absent -> `none - LLM-lens only`, never a silent skip), the `sinks-and-sources` entry used
  (`derived` if the language was not in the catalog), and **`% of that language's files touched`**.
- **A language with a nonzero file count and a 0% coverage row is residue that blocks `complete`** -
  same mechanism as file residue, so "no language silently skipped" is enforced structurally.

## Determinism

- **Stable `fingerprint`** (on the finding record) = `sha1(check + normalized_relpath +
  enclosing_symbol + normalized(quote))` - **line-number-independent**, so it survives edits above
  it. This is the ONE key used for dedupe, cross-run comparison, the multi-run union, and the
  suppression match in `accepted.md` - unify them, do not keep three.
- **Fixed partition seed** - `owner(file)` is pure over `(manifest, SURFACE-REGISTER, seed)`; default
  `seed = short commit sha`, override `--seed`. Two runs at one commit shard identically, so COVERAGE
  is reproducible (the LLM prose is not, and that is fine).
- **Multi-run union for recall** (`--runs N`, nice): LLM sweeps vary run-to-run; run the sweep N
  times and **union by fingerprint** - the union maximizes recall, the skill's whole bias. Overlap
  the canary-bearing files across workers so >=2 independently see each armed canary.
- **Agreement for precision, as a RANK never a filter**: attach "found in k of N runs" to each
  fingerprint; it feeds `confidence` and sort order. It **never deletes** - dropping a 1-of-N finding
  is precisely the five-zeroed-bugs failure, and self-consistency masks self-consistent errors. Union
  for the set, agreement for the ordering.

## Budget - a named floor, a depth tier, never "clean" on a shallow run

`--budget <tokens|tier>`. The orchestrator spends **top-down the SURFACE-REGISTER risk rank** -
deepest tracing on P0, shallower as it depletes; the budget also caps worker count (unbounded
parallelism explodes coordination overhead without accuracy).

**The irreducible floor - ALWAYS runs, regardless of budget:** (a) full manifest + partition (the
denominator), (b) all deterministic scanners + canaries, (c) the invariant/RULES hunt, (d) **one**
full trace pass over every P0/P1 surface, (e) the cross-cutting lens set, (f) mop-up until residue is
empty-or-explained. **Below the floor the run HALTS as `INCOMPLETE`** - it does not emit a thin clean
report.

**Depth-tier vocabulary, stamped on the verdict:** `T0` scanners + invariants (`--quick`) / `T1`
floor: one trace pass, top surfaces / `T2` full: multi-pass to two-clean. A T0/T1 run may never print
`NO BLOCKING FINDINGS` without the tier qualifier.

## Failure handling - a dead worker is a `pending` shard, not a clean one

Residue catches files *no* worker touched; this catches a worker that touched files then died.

- **Worker completion attestation.** A worker's `files_touched[]` count toward residue **only if it
  returned `status: complete`** (surface traced to its sinks). A worker that errors, stalls, or
  returns nothing is `failed | timeout`; its owned files revert to `pending` -> residue -> blocks
  `complete`.
- **The dispatched set is the denominator.** `run.json` holds the dispatched-shard table; every shard
  must return a terminal record (`complete | failed | timeout | excluded`) before finalize, or the
  run is `INCOMPLETE`. No "no news is good news" - the scanner law, at worker granularity.
- **Retry-once, resume not restart** (nice): re-dispatch a failed shard once, fresh worker, same
  seed; still-failing -> `pending`, reported. The retry skips chains already in `memory.jsonl`, so it
  is cheap.

## Caching (all `code_hash`-gated)

- **Canary** - persisted per `<tool>@<version>` in `canary.json`; survives across runs.
- **Scanner output** - run once at repo root, JSON persisted as `SCANNER-HITS` tagged with the commit
  sha; a resume/`--since` run reuses it when the scanned inputs are unchanged.
- **Killed-candidate memory** (must-have for `--since` honesty) - the EXCLUDED register persisted to
  `memory.jsonl` keyed by `fingerprint + code_hash`. On re-run a candidate matching a killed
  fingerprint with **unchanged** `code_hash` skips re-litigation; **changed** `code_hash` re-opens
  it. This is Phase 50's suppression-staleness rule generalized to the whole killed set.
- **Explored-chain memory** (nice) - persist `(source@site -> sink@site -> verdict, code_hash per
  hop)`; a worker checks memory before re-walking a chain. Invalidate on any hop's `code_hash` change.

**The one caveat that makes all of this safe: every cache entry is keyed on the `code_hash` of its
cited lines, and any change invalidates it.** A cache that survives a code change is how a fixed bug
reads as still-broken, or a newly-broken chain reads as still-safe.

## Must-have vs nice

- **Must-have (reliability + honesty):** the `state/` dir; `owner(file)` + the seed; the `pending`
  state and the `INCOMPLETE` verdict; `--resume`; `--since` carry-forward of unfixed High+; the
  per-language 0%-blocks-complete row; the stable `fingerprint`; the always-runs floor + depth-tier
  verdict; worker completion attestation; killed-candidate memory with the `code_hash` gate. These
  stop a partial run reading as clean - the skill's cardinal sin.
- **Nice (speed):** `--runs N` union, retry-once, explored-chain memory, scanner-output reuse across
  runs, `--shard-size` / `--max-workers`. None changes what the report may claim.

## What NOT to add

Do not build a new coverage engine, a new ledger, a new severity/confidence model, a new canary
system, or a new fan-out unit - all present and correct. The whole design is: **persist the state
that lives in-context, give the manifest a total ownership function, and wire residue + the
append-only ledger + `code_hash` staleness to three new triggers (budget floor, dead worker,
unchanged-since-baseline).** One new reference file; the rest are small edits to the coverage phase
and the verdict.

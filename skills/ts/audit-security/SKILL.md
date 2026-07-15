---
name: audit-security
description: A project-agnostic, WHOLE-PROJECT security audit - the "subscribe to a security firm" skill. It runs the real scanners (osv-scanner for dependency CVEs, gitleaks for secrets in the working tree AND full git history, semgrep for SAST, trivy for IaC), then performs its OWN LLM-driven whole-repository security review (a full local sweep, NOT a git-diff/PR lens - it replaces Anthropic's diff-scoped /security-review), builds a threat model so findings are ranked by what is actually worth attacking, hunts the project's OWN silent-failure invariants from a user-authored file, and adversarially triages every candidate so the report is real bugs, not scanner noise. Report-only by default; --fix is opt-in and tiered. Use when the user wants a security audit, security review, vulnerability scan, secret scan, dependency/CVE check, penetration-test-style code review, threat model, OWASP/ASVS/CWE assessment, or to "harden"/"security-check"/"is this safe to ship" a whole codebase. Whole-project, not module-scoped (that is /audit); security-only, not general logic (that is /audit-deep-logic). Takes an optional scope to narrow the deep review, plus --fix, --quick, --no-history, --verify-secrets, --out <path>.
user-invokable: true
argument-hint: "[scope] [--fix] [--quick] [--no-history] [--out <path>] [--verify-secrets]"
---

# audit-security

A whole-project security engagement that adapts to whatever project it runs in. It ties four
things no single tool does together, behind one analyst: the real scanners, a threat model, the
project's own invariants, and an LLM whole-repo review it prompts itself - then it **decides which
candidates are real.** It is **stack-agnostic** (it learns the project first, Phase 0) and
**report-only by default** (`--fix` opts in). This SKILL.md is a **dispatcher**: it parses the
input, states the laws every phase obeys, and runs each phase by reading its own file **in full** -
that file is the spec. Read the phase file before you run it.

## The two laws (every phase obeys them)

> **1. A scanner produces CANDIDATES, never findings.** A finding is a candidate traced to a
> reachable entrypoint, with attacker-controlled input, and a named consequence. Everything else is
> noise - and a report full of noise trains the reader to ignore the one line that mattered.
>
> **2. A scan that did not run must never read as a scan that found nothing.** A missing scanner, a
> ruleset that failed to load, a file no agent opened, an empty rule-hunt - each looks identical to
> "clean." Every phase declares what it covered; a silent partial scan presented as a full one is
> the cardinal sin of this skill.

## Scope: the WORKING TREE, not a commit (local-first)

The review reads the code **on disk** - your working tree, uncommitted edits included - not a
committed snapshot: fix something, re-run, and the audit sees the fix before you commit. The SAST,
the invariant hunt, and the LLM sweep all read the filesystem. **The one deliberate exception is the
secret scan**, which additionally covers **full git history by default** (gitleaks `git`), because a
committed-then-deleted credential is still live in every clone and is the highest-value leak an
audit finds. `--no-history` opts out of the history half. Anthropic's `/security-review` is NOT used
(it is committed-diff-only and cannot do a local whole-repo sweep - Phase 40 is our own).

## What this skill is NOT (keep the lane sharp)

- Not a per-module hardening pass - that is `/audit` (this is whole-project and security-only).
- Not a cross-module logic review - that is `/audit-deep-logic` (this borrows its seam discipline).
- Not a test-coverage skill - that is `/audit-tests`.
- Not a DAST / live-traffic tool - it sees only committed and working-tree code, runs no traffic.
- **Not a certificate.** A report with no blocking findings is not a statement that the project is
  secure. The honesty clause (`phases/60-report.md`) ships verbatim, every run.

## Inputs

Everything after `/audit-security` arrives as one raw string. Parse it in prose:

1. Extract the flags below and strip them; the remainder is an optional **scope hint** (a path,
   area, or subsystem). It narrows the Phase-40 deep review: when present, the `SURFACE-REGISTER`
   (Phase 10) and the Phase-40 file manifest are **both restricted to the scoped subtree**, and
   out-of-scope files are recorded in COVERAGE as `excluded: out-of-scope` (never counted as
   residue). The scanners, the secret scan, and the invariant hunt still see the whole repo. Default
   scope: the whole project.
2. **`--fix`** - opt in to the tiered remediation policy (`phases/70-fix.md`). Off by default
   (report-only). It is audit-wide. **Sub-agents in Phases 05-50 are READ-ONLY - no file is modified
   before Phase 70**; `--fix` changes only what Phase 70 does.
3. **`--quick`** - run Phases 00, 10, 20, 30, 50, 60 only: scanners + invariants + triage + report.
   Skips the Phase-40 LLM fan-out and the ASVS net. **This is depth tier T0** (`reference/orchestration.md`),
   and it therefore does NOT assess access-control, business-logic, AI-surface, workflow-bypass or
   OAuth-state - the classes that need the sweep. The coverage table MUST stamp it "QUICK (T0) - LLM
   sweep + ASVS net NOT run; these vuln classes are NOT assessed" so a quick pass never reads as a
   full one. Recommended cadence: full run weekly, and on any auth / money / tenant / AI diff.
4. **`--since <ref>`** - incremental mode (`reference/orchestration.md`): deep-audit only the code
   changed since `<ref>` (default: the last run's commit) plus its reverse-dependency closure -
   **but every unfixed High+ finding from the prior ledger is carried forward and re-surfaced**, so a
   Critical can never hide behind "its file was not in this diff." Orthogonal to `--quick`; scanners
   still run whole-repo.
5. **`--resume`** - resume an interrupted run from `claude/audit-security/state/` (skip files whose
   `code_hash` is unchanged, re-audit `changed` + `pending`).
6. **`--budget <tier|tokens>`** - cap spend; the orchestrator spends top-down the risk rank and
   stamps the depth tier reached (T0/T1/T2) on the verdict. Below the always-runs floor
   (`reference/orchestration.md`) the run HALTS `INCOMPLETE`, never a thin clean report.
7. **`--no-history`** - skip the gitleaks full-history secret pass (working-tree scan still runs).
8. **`--verify-secrets`** - opt in to TruffleHog live-verification of a candidate secret. **Off by
   default and it must stay off:** verification authenticates to the vendor with the candidate
   credential - a real privacy egress the user must choose, not us.
9. **`--deep`** - add the noisier semgrep packs (`p/security-audit`, `p/default`) to the SAST sweep.
10. **`--out <path>`** - persist the report to `<path>` (creating parent dirs). Off by default: the
    report is emitted **inline**. Never assume a report path.
11. **`--self-test`** - maintainer-only: run the calibration harness (`reference/self-test.md`)
    against `fixtures/` and emit a precision/recall scorecard instead of auditing a target. Used when
    the skill itself changes.

## The phases (read each file in full before running it)

| # | Phase file | Consumes | Produces | Gate |
|---|------------|----------|----------|------|
| 00 | `phases/00-profile.md`      | -                                           | PROFILE, ATTEST (seeded) | **blocking, hard-halt on a missing scanner**; also arms the recall canary (0.6) |
| 05 | `phases/05-scope.md`        | PROFILE                                     | SCOPE                | blocking - risk appetite, compliance regime, exclusions, egress consent |
| 10 | `phases/10-threat-model.md` | PROFILE, SCOPE                              | SURFACE-REGISTER     | blocking (40) |
| 20 | `phases/20-scanners.md`     | PROFILE, ATTEST                             | SCANNER-HITS + ATTEST (filled) | non-blocking*; **but is a JOIN BARRIER for 50** |
| 30 | `phases/30-invariants.md`   | PROFILE                                     | RULES-HITS + HEALTH  | blocking (40) |
| 40 | `phases/40-llm-audit.md`    | PROFILE, SCOPE, SURFACE-REGISTER, RULES-HITS, SCANNER-HITS | LEDGER (candidates) + COVERAGE | blocking (50); skipped by `--quick` |
| 50 | `phases/50-triage.md`       | LEDGER (candidates), **SURFACE-REGISTER**, ATTEST | LEDGER (admitted)    | blocking (60) |
| 55 | `phases/55-compliance.md`   | SCOPE, LEDGER (admitted)                    | COMPLIANCE + PII-INVENTORY | N/A unless a regime is set in SCOPE |
| 60 | `phases/60-report.md`       | LEDGER (admitted), COVERAGE, ATTEST, HEALTH, COMPLIANCE | REPORT       | - |
| 70 | `phases/70-fix.md`          | LEDGER (admitted), PROFILE                  | FIXES + LEDGER (status updated) | only with `--fix` |

`*` Phase 40 may start on surfaces Phase 20 has not covered, but must fold every SCANNER-HIT before
it declares a surface converged. **The join barrier:** Phase 50 does not start until Phase 20 has
TERMINATED for every required tool (an ATTEST row exists, success or NOT-RUN) - so under `--quick`
(no Phase 40) triage can never run over an unfinished network scan and read "clean".

**SCANNER-HITS and RULES-HITS are not separate stores - they are row-sets in the one append-only
ledger**, tagged by `source:` (`scanner:*` / `invariant`); the ledger is their union. Phase 40 appends
`llm-audit` rows; Phase 50 adjudicates the union. This matters most under `--quick`, where Phase 40 -
the apparent LEDGER producer - never runs, yet the scanner + invariant rows still form a ledger to
triage.

**The contract that keeps phases decoupled:** every phase reads and writes findings in the single
shape of `reference/finding-schema.md`, and resolves severity only through `reference/severity.md`.
A phase reaches another phase **only through the named artifact above** - never into its prose or
its steps. That one-way rule is what lets any phase be revised in isolation.

## Reference

- `reference/severity.md` - the one severity scale, the E0-E5 exposure modifier, the anti-downgrade rule.
- `reference/finding-schema.md` - the one finding record every phase emits + the EXCLUDED register.
- `reference/scanners.md` - per-tool install, exact CLI, JSON shape, the EXIT-CODE table, the canary probe.
- `reference/lenses.md` - the per-class review procedures the LLM sweep carries (access-control, injection, web, secrets/crypto, business-logic, AI-surface, supply-chain).
- `reference/sinks-and-sources.md` - the per-ecosystem dangerous-API catalog the sweep keys on.
- `reference/verification.md` - the append-only ledger, the 3-role panel, the R1-R7 refutation list, the emit matrix.
- `reference/rules-format.md` - the `claude/audit-security/rules.md` spec, the vacuity guard, graduation, bootstrap.
- `reference/asvs.md` + `reference/asvs-5.0.0.flat.json` - the ASVS 5.0 completeness net (pinned data, never fetched).
- `reference/cloud-lenses.md` - the SEC-CLOUD family (K8s / IaC / serverless / container), marker-gated; N/A-not-a-finding when no infra is committed.
- `reference/orchestration.md` - persisted `state/`, the file-ownership partition, `--resume`/`--since`, depth tiers, worker attestation, caching. The reliability + scale anchor.
- `reference/self-test.md` (+ `fixtures/`) - the calibration harness and the in-run **recall canary** (the false-negative dead-man's-switch for the LLM sweep).
- `reference/compliance-map.md` - the DP1-DP10 data-protection lens, the PII inventory, and the check-to-control map (evidences vs cannot-attest). Never claims compliance.
- `reference/standards-coverage-map.md` - the ADOPT/REJECT standards table + the OpenCRE cross-map + the finding-tag scheme.
- `reference/supply-chain-heuristics.md` - the native-builder allowlist, the reachability-downgrade rule, the dependency-confusion/typosquat/license matrix.

The host project maintains its own invariants in `claude/audit-security/rules.md`; `claude-rules.md`
(sibling to this file) is the `@`-import that makes maintaining it a standing obligation. Run state
lives in `claude/audit-security/state/` (gitignored); accepted risks in `claude/audit-security/accepted.md`.

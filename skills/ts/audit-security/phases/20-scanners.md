> **Phase 20 - Automated sweep**
> **Consumes:** `PROFILE`, the **seeded `ATTEST` rows** (00).
> **Produces:** `SCANNER-HITS` (candidates, tagged `status: lead`) and `ATTEST` (the seeded rows,
>   now filled with the scan-time columns - not a fresh artifact).
> **Gate:** non-blocking - may run in parallel with Phase 40 - but it is a **JOIN BARRIER for Phase 50**:
>   Phase 50 does not start until Phase 20 has TERMINATED for every required tool (an `ATTEST` row exists,
>   success or NOT-RUN). This matters under `--quick`, where Phase 40 does not provide the barrier - without
>   it, triage could run over an unfinished network scan (osv.dev is a network call) and read "clean". Every
>   hit is a CANDIDATE (Law 1), never a finding, until Phase 50 admits it. Read `reference/scanners.md` in full first.

# Phase 20 - Automated sweep

The mechanical breadth pass. Fan out the scanners (one sub-agent per tool, in parallel), parse each
into the `reference/finding-schema.md` shape tagged `source: scanner:<tool>` and `status: lead`, and
hand the leads to Phase 40 (to confirm or refute per surface) and Phase 50 (to triage). The scanners
find *known patterns at scale*; they do not conclude - a hit is a lead to verify, and their value is
recall over the mechanical classes, freeing the LLM sweep for the judgment-heavy ones.

Everything about invocation, JSON shape, exit codes and noise control is in `reference/scanners.md`.
The phase-level rules that must hold:

- **osv-scanner** (dependency CVEs) - `scan source -r --show-all-vulns --format=json` (`--show-all-vulns`,
  not `--all-vulns` which errors). **Exit 128 (no lockfiles) and 129 (API failed) are NOT clean** - they are
  "did not run" and go to `ATTEST` as such, never to the report as "no vulnerabilities". Rank on
  `groups[].max_severity` with an explicit Unknown tier; pull the fix from `...ranges[].events[].fixed`;
  label dev-only via `dependency_groups`.
- **gitleaks** (secrets) - **run `dir` (working tree) AND `git` (full history) by default**; `--no-history`
  skips the history half. A history leak and a working-tree-only leak are two different findings with
  two different fixes (rotate-first-scrub-second vs gitignore-and-rotate-if-pushed) - keep them apart.
  `--verify-secrets` adds a TruffleHog live-verification pass (off by default; it egresses the secret).
- **semgrep** (SAST) - the curated pack set (`p/ci` + `p/owasp-top-ten` + `p/secrets` + the detected
  language pack; `--deep` adds the noisy `p/security-audit`). Run `--json --metrics=off --oss-only`.
  **Assert `rules_run > 0`** or the pack scanned nothing. Report only the `vuln` + HIGH-confidence
  band as leads; the rest is a counted appendix, never a list. The free CLI is intrafile-only - state
  that ceiling; the cross-file taint it cannot do is exactly Phase 40's job.
- **trivy** (IaC/config) - only if IaC markers exist; `--ignore-unfixed` on any image scan or it is
  pure noise.

**The reachability gate** (cuts the most dependency-CVE noise). Each osv finding gets
`reachable: yes | no | unknown`. osv's own call-analysis covers **Go / Rust / Java only** - for npm and
Python it is an **LLM lens** (resolve the advisory's affected symbol, then trace whether the code
actually calls it). Reachability is a **DOWNGRADE modifier only** - never an auto-suppress, never below
Info, and a still-listed unreachable CVE keeps its "not reached because ..." note. A dev-only CVE
(`dependency_groups: [dev]`) drops two levels before any reasoning. Full rules:
`reference/supply-chain-heuristics.md`.

**Opt-in supply-chain depth** (detail in `reference/scanners.md`, briefly here): SBOM + VEX
(`syft ... cyclonedx-json`, VEX encoding the reachability verdicts - a SOC 2 artifact); `osv-scanner
--licenses` (AGPL in a runtime dep is the one that matters for a proprietary SaaS); `npm audit
signatures` (a failed registry signature = Critical; missing provenance is NOT a finding); the
transitive install-script sweep (de-noised by the native-builder allowlist in
`reference/supply-chain-heuristics.md`); and the lockfile registry-consistency check (an internal name
resolvable from the public registry = dependency confusion, Critical). The ledger can also be exported
as **SARIF v2.1.0** for GitHub code-scanning / ASPM interop.

**Attestation is mandatory.** For each tool, write an `ATTEST` row: version, ran (with the pack set),
files/packages scanned, exit code, emitted count, canary pass/fail. `phases/60-report.md` prints
these at the top of the report. A tool whose canary failed is reported as failed, not clean - and per
Phase 00 a *required* scanner that cannot run should already have halted the run.

Do not dedupe or finalise severity here. Assign the vendor base (`reference/severity.md`) as the
floor and pass the leads on.

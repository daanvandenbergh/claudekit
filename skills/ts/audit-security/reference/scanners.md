# Scanner operating manual

The deterministic-lead layer. `phases/20-scanners.md` runs these; this file is how. Every scanner
here is FREE, offline-capable, and project-agnostic. The skill never installs one itself - a missing
required scanner is a HARD STOP (see the gate in `phases/00-profile.md`), never a silent skip.

**The one law this file exists to enforce:** a scan that did not run must never read as a scan that
found nothing. `0 findings AND 0 scanned = FAILED, not clean`. Every tool below is wired so "clean",
"findings", and "did not run" are three distinguishable states - because for every one of them, the
default failure looks exactly like success.

---

## The default set

`brew install osv-scanner gitleaks semgrep` - three tools, one line, every repo. `trivy` is the
conditional fourth, auto-enabled ONLY when IaC markers exist (see the marker table). Docker is the
universal fallback for any tool `brew` can't reach (`docker run --rm -v "$PWD:/src" <image> ...`).

Dropped on purpose: every native SCA tool (`npm audit`, `pip-audit`, `govulncheck`, `cargo-audit`) -
osv-scanner subsumes them and even vendors govulncheck. `checkov` - trivy covers the same ground as a
static binary with no Python venv. No supply-chain/typosquat scanner - no free offline cross-ecosystem
one exists; osv-scanner's `MAL-` advisories give the known-malware slice for free, and a half-built one
is worse than an honest gap.

---

## The exit-code table (read this first - it is Law 2 made concrete)

| Tool | Clean | Findings | **Did NOT run (never "clean")** |
|------|-------|----------|---------------------------------|
| osv-scanner | `0` | `1` | **`128` = no lockfiles found** · **`129` = osv.dev API failed** · `127` = tool error · `130` = interrupted (SIGINT) |
| gitleaks | `0` | `1` by default - **ambiguous** | Run with **`--exit-code 2`**: then `2` = findings, `1` = real error, `0` = clean |
| semgrep | `0` (findings unless `--error`) | `1` with `--error` | **`2` = crashed** · `4`/`5`/`7`/`8` = broken config (parse the JSON, do not trust the code alone) |
| trufflehog | `0` | **`183` only with `--fail`** | `1` = error |
| trivy | `0` | `0` unless `--exit-code 1` | non-zero from `--exit-code` collides with error - check `SchemaVersion` present in the JSON |

- **osv `128` is the trap:** a `package.json` with no lockfile returns "no package sources found" and a
  naive runner prints a clean dependency audit. `129` is a network failure against osv.dev. Neither may
  reach the report as "no vulnerabilities". Treat both as `did not run`.
- **Always parse the JSON, never trust the exit code alone** - semgrep `0` means "ran", not "found
  nothing"; a `4`/`5`/`7`/`8` means it never loaded your rules, which must not read as "no findings".

---

## The canary probe (the only thing that catches a tool running zero rules)

A scanner installed but running an empty ruleset scans everything and finds nothing - byte-for-byte
identical to a clean scan, and no exit code reveals it. So before trusting any run, prove each tool can
still bite: run it against a known-bad synthetic input in the scratchpad and assert it fires.

- **semgrep** against `eval(req.body.x)` (or the detected language's RCE one-liner) - must emit >=1.
- **gitleaks** against a file holding a fake AWS key (`AKIA` + 16 chars) - must emit >=1.
- **osv-scanner** against the project's own lockfile - must parse >=1 package (`results[].packages` non-empty),
  else it saw nothing to scan.
- **trivy config** against a one-line bad Dockerfile (`FROM x`\n`USER root`) - must emit >=1.

Cache the canary result per tool VERSION (`<tool> --version`); it re-runs once per version, ~3s, not per
audit. A failed canary is a HARD STOP with the reason - a tool that cannot do its job halts, it does not
produce a clean row.

---

## osv-scanner (dependency CVEs, every ecosystem)

```
osv-scanner scan source -r --show-all-vulns --format=json .   > osv.json ; rc=$?
```

- **`--show-all-vulns` is MANDATORY** (the flag is `--show-all-vulns`, added in osv-scanner v2.1.0 - NOT
  `--all-vulns`, which errors "unknown flag" and silently breaks the whole dependency scan). Without it,
  vulnerabilities osv tags **"unimportant"** (a Debian-style downgrade tag) are hidden from the default
  output while still sitting in the JSON, so the scan lies by omission. (This is a separate axis from *call
  analysis* / "uncalled", which is opt-in and off by default - see the reachability note below.)
- **JSON, not SARIF.** SARIF drops the CVSS score entirely (`level: "warning"` for everything) and buries
  the fixed version as prose inside `help.markdown`. The native JSON gives it structurally.
- **Fields that matter:**
  - severity: `results[].packages[].groups[].max_severity` - a STRING, and **often empty** (many Go/npm
    advisories carry no CVSS vector). An empty score is an explicit **Unknown tier**, never sorted silently
    to the bottom.
  - fixed version: `vulnerabilities[].affected[].ranges[].events[].fixed` - the single most actionable line
    the skill prints ("bump lodash 4.17.20 -> 4.17.21"). Not a top-level field; dig for it.
  - dev vs prod: `dependency_groups` (`["dev"]` etc). A dev-only CVE caps at Low (see `severity.md` E0).
  - **direct vs transitive: NOT in the output.** If the skill needs it, join against the manifest itself,
    and say so - never pretend the data is there.
- **Noise control:** `osv-scanner.toml` `[[IgnoredVulns]]` with an `id`, a `reason`, and an `ignoreUntil`
  date. Note the config does NOT cascade to child dirs; use `--config <path>` for one global file.
- **SAFETY:** never enable Rust call analysis on an untrusted repo - it compiles the project and runs
  `build.rs` (arbitrary code execution). `osv-scanner fix` likewise can trigger package-manager scripts;
  it is the `phases/70-fix.md` "Confirm" tier, never silent.
- Offline: `--offline-vulnerabilities --download-offline-databases` for the vuln DB; license scanning and
  Maven transitive resolution then go dark (report the degradation).

## gitleaks (secrets - working tree AND full history, by default)

```
gitleaks dir . --exit-code 2 --redact --report-format json --report-path /dev/stdout   # working tree
gitleaks git . --exit-code 2 --redact --report-format json --report-path /dev/stdout   # full history
```

- **Run BOTH, every time.** `dir` walks the *filesystem*, **ignores `.gitignore` entirely**, and catches
  the present-but-gitignored `.env` (the most common real leak, and one that lives on disk). `git` walks
  the *full commit history* and is the only way to find a secret committed then deleted - still live in
  every clone, fork and cache. `--no-history` skips the `git` half for an air-gapped or speed-bound run;
  the coverage table then states that history was NOT examined.
- `--exit-code 2` de-ambiguates: `2` = leaks, `1` = a real gitleaks error (default `1` means both).
- `--redact`, or the report itself contains the live secret.
- **Two different findings, two different fixes:** a secret in the working tree but NOT in history is *not
  yet leaked* - gitignore it, rotate only if it ever reached a remote. A secret **in history** is
  compromised the moment it hit a remote - rotate first, scrub second. Never conflate them.
- **Suppression: the GLOBAL fingerprint `file:rule:line`**, appended to `.gitleaksignore` with a `# reason:`
  line - never the commit-scoped `commit:file:rule:line` form, which silently stops matching after a
  history rewrite and lets an accepted false positive quietly return.
- ~222 built-in rules (AWS/Stripe/Twilio/GCP/private-key/generic-entropy). Gap to close: no MongoDB/DB
  connection-string rule - so a `mongodb+srv://user:pass@...` committed then deleted is caught by NEITHER
  gitleaks-builtin NOR the working-tree-only LLM secrets lens (a real seam). Ship this custom rule in a
  `.gitleaks.toml` (`[extend]` with `useDefault = true`) so history is covered:
  ```toml
  [[rules]]
  id = "connection-string-with-creds"
  description = "DB/broker URI with embedded credentials"
  regex = '''(?i)\b(mongodb(\+srv)?|postgres(ql)?|mysql|rediss?|amqp)://[^\s:@/]+:[^\s:@/]+@'''
  keywords = ["mongodb", "postgres", "mysql", "redis", "amqp"]
  ```
- History scans on a big repo take minutes: set `--max-target-megabytes` and bound with a shell `timeout`;
  emit "scanning N commits..." before you start so the user is not staring at nothing.

**TruffleHog (opt-in `--verify-secrets` only).** TruffleHog's edge is *verification* - it authenticates
the candidate against the vendor's API to prove it is LIVE. That is the highest-value signal there is (a
verified-live key is a five-alarm fire) AND a real privacy decision: it transmits the candidate secret to a
third party and shows up in that vendor's audit log, possibly against a customer's production key sitting in
a local `.env`. So it is OFF by default; the user opts in. `trufflehog git file://. --results=verified
--json --fail` and `trufflehog filesystem . --results=verified --json --fail` (`--fail` -> exit `183` on
find; JSONL, one object per line; `Raw` is the un-redacted secret - redact before writing any artifact).

## semgrep (SAST - the pattern layer under the LLM sweep)

```
semgrep scan --config=p/ci --config=p/owasp-top-ten --config=p/secrets \
  --config=p/<detected-lang> [--config=p/<detected-framework>] \
  --json --metrics=off --oss-only --max-memory 4000 --timeout 10 \
  --exclude='*.min.js'  > semgrep.json ; rc=$?
```

- **Curated packs, not "p/security-audit and hope".** High-signal core: `p/ci` (every rule
  `confidence: HIGH`) + `p/owasp-top-ten` (zero LOW-confidence rules) + `p/secrets`, plus the
  detected-language pack. `p/security-audit` and `p/default` carry the whole noisy LOW-confidence tail
  (`p/security-audit` is ~60-80% "a human should look at this", not "this is a bug") - quarantine them
  behind `--deep`.
- **Assert `rules_run > 0`.** `p/nextjs`, `p/nestjs`, `p/php-laravel`, `p/security-headers` return **zero
  rules to an unauthenticated user** (they are entirely Pro rules) - pointing a scan at one "succeeds",
  scans nothing, and reports clean. Never select those in the default set, and canary-check every pack.
- **Never `--config=auto`** - it phones home (logs in with your project URL) and is non-reproducible
  run-to-run. Do your own language detection (the marker table) and pass explicit packs.
- `--metrics=off --oss-only` - source code is NOT uploaded when running local packs; only `semgrep ci` with
  a login sends findings, and the skill never uses it. State this to the user, they will ask.
- **The honest ceiling: the free CLI is intrafile-only.** Cross-file taint is a paid feature. Real
  injection bugs cross files - which is exactly why the LLM sweep's dedicated cross-file taint pass
  (`phases/40-llm-audit.md`) is not optional garnish but the thing that covers this blind spot. State it in
  the report's limitations.
- **Ranking (cut the noise yourself, in JSON post-processing):**
  `score = severity x confidence x (likelihood + impact)` from `extra.severity` and
  `extra.metadata.{confidence,likelihood,impact}`. Report only the `subcategory: vuln` + `confidence: HIGH`
  band as findings; everything else is a COUNTED appendix, never a list. "6 high-confidence vulnerabilities
  and 334 informational observations" is the truth; "340 issues" is a lie of framing.
- `extra.metadata.cwe`/`.owasp` are ARRAYS of long strings - regex out `CWE-\d+` / `A\d{2}:20\d\d` yourself.
  `fingerprint`/`metavars` only populate when logged in - build your own dedupe key
  `sha1(check_id + path + normalized(extra.lines))`.
- Check `errors[]` and `paths.skipped[]`: rules that blew `--timeout` are silently dropped and land there.
  A "clean" scan where 300 files timed out is NOT clean - disclose it as a coverage gap.

## trivy (IaC + containers - conditional, marker-gated)

```
trivy config . --format json --exit-code 0 > trivy.json           # Terraform/K8s/Dockerfile/CFN
trivy image --ignore-unfixed <image> --format json > trivy-img.json  # only with --images, only if you build it
```

- **Runs ONLY if IaC markers exist** (see table). A pure library repo pays nothing.
- `--ignore-unfixed` on image scans, or you report 340 Debian CVEs in a base image you do not control -
  pure noise that trains the reader to ignore the tool.
- Absorbs tfsec/defsec policies; built-in Dockerfile/K8s/Terraform/CloudFormation/Helm coverage.

---

## Supply-chain depth (reachability, SBOM/VEX, provenance, license)

The scanners above match KNOWN CVEs and secrets. This layer is what the best commercial SCA adds - and
most of it, for npm/Python, is an LLM lens, not a flag.

- **Reachability gate (the biggest noise cut).** osv-scanner's `--call-analysis` is **Go/Rust/Java only -
  NOT npm/Python**. For those ecosystems, reachability is an LLM lens: read the advisory's affected
  symbol, grep for its import in `src/`, judge whether that symbol is invoked on a path from an entrypoint,
  and tag each osv finding `reachable: yes | no | unknown`. **Unreachable is a DOWNGRADE modifier only** -
  never auto-suppress, never drop below Info, and dev-only deps get `severity.md` E0 (cap Low). Dynamic
  `import()`/reflection defeat static reachability, so an "unreachable" verdict is advisory context for the
  human, never an auto-close. `// ponytail: LLM judgment, not a call graph - the ceiling is stated, not hidden.`
- **SBOM + VEX (SOC 2 artifact, opt-in).** osv-scanner *consumes* SBOMs but does not emit one - use syft:
  `syft . -o cyclonedx-json=sbom.cdx.json`. Then emit a VEX doc that encodes the reachability verdicts as
  `not_affected: code_not_reachable` justifications - the exact artifact an auditor or downstream consumer
  wants, and near-free once reachability exists.
- **License compliance.** `osv-scanner --licenses` (summary) or `--licenses="MIT,Apache-2.0,ISC,BSD-3-Clause,0BSD"`
  (allowlist -> violations). Needs network (deps.dev), incompatible with `--offline`. The one that matters
  for a proprietary hosted SaaS is **AGPL in a RUNTIME dep = High** (its network-use clause is the copyleft
  a SaaS cannot dodge by not shipping a binary); GPL runtime = Medium; dev-only GPL = Low; permissive = Info.
- **Provenance / integrity.** `npm audit signatures` verifies registry ECDSA signatures + Sigstore
  provenance. **A failed registry signature = Critical** (tampered tarball). **Missing provenance is NOT a
  finding** - it is spotty across the long tail; presence-and-verified is a plus, absence is Info.
- **Malicious-package / typosquat heuristics** (osv `MAL-` catches only KNOWN malware). The ~5-line
  transitive install-script sweep - flag `preinstall`/`install`/`postinstall` in transitive deps (exclude
  `prepare`/`prepublish`: they do NOT run on a published-registry tarball, only git/local installs), filter
  against the native-builder allowlist in `reference/supply-chain-heuristics.md`, and read any flagged
  script for `child_process`/network/obfuscation. An unexpected `postinstall` doing network I/O = Critical.
  Plus: lockfile registry consistency (`grep -oE '"resolved": "https?://[^/]+' <lockfile> | sort -u` - a
  single foreign registry = High; an internal name resolving from public npm = Critical dependency-confusion)
  and name-similarity to popular packages (the LLM knows the ecosystem - no offline DB needed).

## SARIF export (interop, optional)

The ledger can be serialized to **SARIF v2.1.0** so findings drop into GitHub code-scanning / an ASPM.
SARIF `level` is only error/warning/note/none, so carry the real severity in
`properties["security-severity"]` (CVSS-string convention) - never let the flattened `level` become the
rating of record. This is an OUTPUT adapter; the ledger's own shape (`reference/finding-schema.md`) stays
authoritative.

---

## Stack detection (cheap - one `find` at depth ~3, marker presence is enough)

| Marker | Ecosystem | Scanners |
|--------|-----------|----------|
| `package-lock.json` / `pnpm-lock.yaml` / `yarn.lock` / `bun.lock` | Node/TS | osv, semgrep(+ts/js/react/express/nodejs) |
| `package.json` **only** (no lock) | Node/TS | semgrep + **warn: no lockfile, SCA skipped** |
| `poetry.lock` / `Pipfile.lock` / `uv.lock` / `pdm.lock` / `requirements*.txt` | Python | osv, semgrep(+python/django/flask) |
| `go.mod` (+ `go.sum`) | Go | osv, semgrep(+golang) |
| `Cargo.lock` | Rust | osv, semgrep(+rust) |
| `pom.xml` / `gradle.lockfile` | Java/Kotlin | osv, semgrep(+java/findsecbugs) |
| `Gemfile.lock` | Ruby | osv, semgrep(+ruby/ruby-on-rails-xss) |
| `composer.lock` | PHP | osv, semgrep(+php) |
| `packages.lock.json` / `*.csproj` | .NET | osv, semgrep(+csharp) |
| `*.tf` / `.terraform.lock.hcl` | Terraform | **trivy config** (+ semgrep terraform) |
| `*.yaml` w/ `apiVersion:`+`kind:` / `Chart.yaml` | K8s/Helm | **trivy config** |
| `Dockerfile` / `Containerfile` / `compose.y*ml` | Container | **trivy config** (+ `trivy image` only if `--images`) |
| `.github/workflows/*.yml` | CI | semgrep `p/github-actions` |
| **always** | - | **gitleaks (dir + git)** |

Monorepo: collect ALL markers, union the scanner set, run each scanner ONCE at the repo root (all three
recurse) - never fan out per package. Prune `node_modules`/`vendor`/`.venv`/`target`/`dist` from the
detection walk, but NOT from gitleaks - it needs `.git`.

---

Sources verified: 2026-07-14 (osv-scanner v2.3.x, gitleaks v8, semgrep 1.8x, trivy; against each tool's
current docs and `--help`).

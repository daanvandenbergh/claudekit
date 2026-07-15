> **Phase 00 - Profile and the tooling gate**
> **Consumes:** the repo (working tree), the standards doc, the manifests.
> **Produces:** `PROFILE` (resolved project tokens), `LANGUAGES` (per-language coverage seed), and
>   the **seeded `ATTEST` rows** (one per required scanner; Phase 20 fills the scan-time columns).
> **Gate:** BLOCKING for the whole run. A missing required scanner is a HARD HALT, not a degraded run.
>   Also arms the recall canary (00.6) before any discovery sweep.

# Phase 00 - Profile and the tooling gate

Two jobs: learn the project so every downstream check is *this project's*, and prove the scanners
can actually run before promising a security verdict.

## 00.1 Build the project profile

Before anything, learn the conventions. Read, in priority order: (1) the standards doc - `CLAUDE.md`
/ `AGENTS.md` / `README` and anything they point to; (2) the manifest(s) (`package.json`,
`pyproject.toml`/`requirements*.txt`, `go.mod`, `Cargo.toml`, `pom.xml`/`build.gradle`, `Gemfile`,
`composer.json`, `*.csproj`) for the build/test/dev commands and the deps that reveal the validator,
test runner, logger, DB driver, auth library; (3) the real directory tree and a few source files.

Resolve only the slots the checks reference: **stack + language(s)**, **build / test / dev
commands**, **entrypoint style** (routes, server actions, RPC, webhooks, cron, CLI), **auth /
identity mechanism**, **tenant-scope key** (`organizationId` / `uid` / `tenantId`), **money
representation**, **validation library**, **logger + log shape**, **secret-loading mechanism**
(env module, the secret-var registry if one exists), **DB / index / accessor conventions**, **deploy
topology** (Docker / CI / IaC present?), **test layout**. The SEC-AUTH lens also needs the
`<trustedIpResolver>`, `<kdf>`, `<sessionStore>`, and `<credentialChangeChokepoint>` tokens - resolve
them here.

**Detect `LANGUAGES`** = the marker-file set UNION a file-extension histogram over the manifest
(`reference/orchestration.md`), so a `.py` script in a Node repo is seen even with no lockfile. Every
detected language gets a scanner-selection + a coverage row downstream; a language with a nonzero file
count and 0% coverage is residue that blocks "complete" - no language is silently skipped.

Two guardrails, non-negotiable:
- **Code is the adjudicator, the doc is the ceiling.** Use the standards doc to raise precision; if
  it is thin or contradicts the code, say so and derive the convention from the code itself (grep
  the actual auth guard, the actual tenant field, the actual money type).
- **Never fall back to a baked-in default.** If a slot cannot be determined, state that and ask -
  never import another project's convention.

## 00.2 Detect the ecosystem and the applicable scanners

From the marker files (the table in `reference/scanners.md`): which lockfiles/manifests exist ->
which ecosystems -> which scanners apply. **Required by default: osv-scanner, gitleaks, semgrep.**
`trivy` is **required only if** IaC markers are present (`*.tf`, K8s YAML, `Dockerfile`); then its
absence is also a hard stop. Note what the working tree contains (a `Dockerfile`, `.github/workflows/`,
`*.tf`) so Phase 40's supply-chain lens knows whether it is in scope or N/A.

## 00.3 The tooling gate - hard-halt, do not degrade

Per required scanner, the three checks from `reference/scanners.md`: **presence + version**, **exit
code AND scanned-count together** (0 findings with 0 scanned = FAILED, not clean), and **the canary
probe** (run it against a known-bad synthetic input to catch a tool that is installed but running
zero rules - e.g. semgrep with a ruleset that failed to download, or a Pro-only pack that returns
nothing to an unauthenticated user; assert `rules_run > 0`).

**A missing or non-functional required scanner HALTS the run.** Do not proceed with a blind spot and
a caveat. Inform which tool is missing, print the exact install command, and stop with a failure
status:

```
X audit-security cannot run: required scanner not installed.

  missing:  gitleaks   (secret detection)
  install:  brew install gitleaks
            # or: https://github.com/gitleaks/gitleaks#installing

  All required scanners must be present so this audit cannot silently skip a class of finding.
  Install the tool above and re-run.
```

**The skill never installs a scanner itself** (that would be running unknown software on the user's
behalf). The only things that are *not* a hard stop: an empty branch (nothing to review is a true
"nothing to do"), and an optional lens that is genuinely N/A (recorded as N/A, never as passed).

**Seed the `ATTEST` rows here** - one per required scanner, carrying the gate-time facts (version,
canary pass/fail). Phase 20 fills the scan-time columns (scanned count, exit code, emitted count) into
the same rows, and `phases/60-report.md` prints the one combined ATTEST table at the top of the
report. There is no separate `TOOLING` artifact - a gate result that never reached the report would be
a silent loss of the very check that authorised the run. Every required scanner that could not run
means the run does not start.

## 00.4 Load prior state

Read `claude/audit-security/rules.md` (the project invariants - Phase 30 uses it; if absent, Phase
30 offers to bootstrap it), `claude/audit-security/accepted.md` (accepted risks / proven false
positives - Phase 50 applies them), and `claude/audit-security/state/` if resuming or running
`--since` (`reference/orchestration.md`). If `--out <path>` was given and a prior report exists there,
read it only for the pass number and the trend, never as a "these areas are clean" filter.

## 00.6 Arm the recall canary (before any discovery sweep)

The scanners and the invariant hunt each have a canary; the LLM sweep - the skill's whole edge over a
diff review - had none, so a degraded worker's "no findings" was indistinguishable from clean code.
Close that here. Full protocol: `reference/self-test.md`.

Deterministically pick the canary subset: `seed = sha1(target_commit + skill_version)`; arm 3
silent-failure lenses rotated by the seed, and **always** arm any lens whose failure mode is present
in scope (a webhook in the tree arms the idempotency canary; sibling server-actions arm the authz
canary); a pre-release gate (`--self-test`-adjacent) arms all 8. Copy each chosen fixture from
`fixtures/` into a scratch overlay at `.audit-scratch/<seedhash>/` under a marker the **reconciler**
knows but the **worker is never told**. Record the armed set + expected fingerprints in run state. The
Phase-40 workers now see the canary files as ordinary repo code; after every sweep pass the reconciler
matches findings against the armed fingerprints - **any armed canary not re-found is a HARD STOP**
(`COVERAGE UNPROVEN`), and every canary-path finding is stripped before the ledger. Both live in Phase
40; the arming lives here so the plant exists before the first worker reads the tree and after 00.1
snapshots the real file list (so canary files never appear in the report's scope).

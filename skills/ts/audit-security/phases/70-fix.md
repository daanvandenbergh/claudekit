> **Phase 70 - Remediation**
> **Consumes:** `LEDGER` (admitted), `PROFILE`.
> **Produces:** `FIXES` - applied changes, each re-verified. **Runs only with `--fix`.**

# Phase 70 - Remediation

Report-only is the default; this phase runs only under `--fix`. Severity says how bad the hole is;
the **tier** says how dangerous the *fix* is - orthogonal. A leaked Critical key is human-only; a Low
unpinned action is auto. Fix Critical-first, and **a fix is not a fix until its own probe goes
red->green.**

## The tiered policy

| Tier | Examples | Policy |
|------|----------|--------|
| **A - Safe (auto under `--fix`)** | Bump a vulnerable dep to its minimum fixed version within a semver-compatible range; pin an unpinned GitHub Action to a commit SHA; add `.gitignore` entries + a gitleaks pre-commit hook; remove a committed build artifact. | Apply, then prove it: re-run the exact probe that flagged it, and the project's build + full test suite. **If the project has no test suite, Tier A collapses into Tier B** - git is not proof, a green suite is. |
| **B - Behavioral, fail-closed (propose diff, apply on confirm)** | Add missing input validation at a trust boundary with the project's own validator; parameterize a query / escape an output / confine a resolved path to a base dir; add a missing ownership/tenant check **by copying the guard a sibling route already uses**; tighten CI `permissions:`; add a rate limit / size cap. | Show the exact diff; apply only on explicit approval. Permitted only because each fails *closed* (worst case: a legit flow breaks loudly and tests catch it). A fix that could fail *open* is never Tier B. |
| **C - Human-only (NEVER auto, even under `--fix`)** | A leaked credential; any rewrite of auth/authz/session/crypto logic; CORS policy; a tenant-scoping refactor; anything on a payment/ledger path; a dependency major bump; IaC touching a live environment; any git-history rewrite. | Output a runbook, never a diff. A plausible-looking wrong auth patch is worse than a documented hole, because now the report says "fixed." |
| **D - Advisory, off-repo** | Revoke the key in the provider console; close the public bucket; rotate the CI secret; enable 2FA on the org. | Surface with a next step; **never reported as "fixed"** - there is no repo artifact to change or verify. |

## The leaked-secret runbook (the case the tiers exist for)

**The skill CANNOT fix a leaked credential and must not pretend to.** Deleting the line does not
revoke the key - it is still live, still in git history, still in every clone, fork, and CI cache. So:
assume it is already compromised (public-repo keys are scraped in under a minute); **rotate/revoke at
the provider now** (identify the provider from the prefix where possible and give its key-page URL);
check the provider's audit log for use since the first-seen commit date (the skill supplies the exact
date from `git log -S`); only then remove from code and move to the secret manager; and note that
history rewriting does not un-leak a public repo. Under `--fix` the one mechanical thing done here is
Tier A (`.gitignore` + the hook); the finding stays **`rotation-pending` / UNFIXED** and is **never**
auto-closed by gitleaks going green. While any `rotation-pending` exists, the verdict is do-not-ship.

## The NEVER list (verbatim)

- Never delete a secret from a file and call the finding fixed.
- Never rewrite or relax auth, authz, crypto, or session logic automatically.
- Never rewrite git history, force-push, or run `filter-repo`/BFG on the user's behalf.
- Never run `npm audit fix --force` or any silent-major-bump command.
- **Never suppress a finding with `# nosec` / `// nosemgrep` / `.semgrepignore` / a gitleaks
  allowlist to make the report green.** That is hiding, not fixing - banned outright.
- Never disable a scanner, narrow its config, or exclude a path to make the report pass.
- Never validate or exfiltrate a discovered credential against the live provider (unless `--verify-secrets`).
- Never touch a live environment, prod IaC, or a real secret store.

## The validation loop (the agent-harness edge over a SaaS scanner)

A SaaS scanner can only *propose* a patch; this skill is in the repo with the project's own build and
test commands, so it **proves** each one before presenting it. Per Tier-A/B fix:

```
apply the fix  ->  run the project's typecheck  ->  run the relevant test(s)
   -> green?  keep it, attach the build/test evidence to the finding
   -> red?    read the failure, re-attempt (bounded to N tries), then re-run
   -> still red after N?  revert the edit (git checkout that file) and downgrade the
                          finding to `proposed` with the failure noted - never leave the tree broken
```

Only a fix that stays green is presented as applied. For each fix, **generate or point at a regression
test** that fails on the vulnerable behaviour and passes once fixed (reuse the project's own test
layout, or the `/audit-tests` skill) - so the patch ships with the proof that it holds, and the audit
leaves the codebase with a test it did not have. Tier-C/D are never auto-applied, so they never enter
this loop; they ship as a runbook.

## Retest, then re-report

After the pass, re-run the scanners and the project's tests. A fix that has not been re-verified is a
claim. Update each finding's status (`fixed (pass N)` / `rotation-pending` / `proposed`), append the
result to the ledger (never overwrite a prior row), and re-emit the report so the verdict reflects
what was actually patched and proven.

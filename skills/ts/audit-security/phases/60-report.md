> **Phase 60 - Report**
> **Consumes:** `LEDGER` (admitted), `COVERAGE`, `ATTEST` (20), `HEALTH` (30), `SURFACE-REGISTER` (10),
>   `COMPLIANCE` (55, if a regime was set), the recall-canary + self-test results (`reference/self-test.md`).
> **Produces:** `REPORT` - inline by default; also written to `--out <path>` if given (never assumes a path).

# Phase 60 - Report

An inverted pyramid: an exec reads the top, an engineer reads the rest. It reads like a professional
firm's deliverable because it is structured like one - coverage before findings, findings before
fixes, and an honesty clause that is load-bearing, not decoration. The spine that makes the trust
claim honest: **"audit everything" is delivered by ACCOUNTING for everything** - every domain the
audit touches resolves to one of three labels, so a silent gap is impossible:

- **VERIFIED** (from code) - a committed artifact pins the fact and the audit read it. Cites `file:line`.
- **FLAGGED** (needs a prod/human check) - the code requires or implies a runtime/prod/process fact it
  cannot prove. Stated as expected-value -> why-unverifiable -> the exact check to run, with a
  "worst case if wrong" note. Goes to the manual-follow-up checklist.
- **OUT-OF-SCOPE** (structurally invisible) - no committed artifact and code cannot imply it; named,
  with the assessment type that owns it (pentest / cloud-config review / vendor DD / ops).

## Structure

```markdown
# Security Audit - <project> - <YYYY-MM-DD> (Pass N)

**Scope:** <whole project | scope hint>  ·  **Mode:** report-only | --fix | --quick  ·
**Depth tier:** T0 | T1 | T2  ·  **Commit:** <sha> + <N> uncommitted files (dirty)

## 0. Scope & limitations   <- PTES-style preamble, FIRST
[One paragraph: this is a source-code + committed-config review; it does NOT observe the running
 system, cloud/dashboard config, network edge, or org process. List the assessment types NOT
 performed (DAST/pentest, cloud-config/CIS review, vendor DD, DR test). Then the per-domain coverage
 ledger: each domain (infra, runtime env, logging/detection, backup/DR, subprocessors, secrets
 posture, client) marked VERIFIED / FLAGGED / OUT-OF-SCOPE.]

## 1. Coverage & method
[The ATTEST table: per scanner - version, ran (+pack set), scanned count, exit, emitted, canary.
 The HEALTH table: per invariant rule - sites hunted, witness ok/stale, pass/fail.
 The COVERAGE block: % of SURFACE-REGISTER rows at tier `traced` (the load-bearing denominator, NOT
 % files touched), per-tier file counts (traced/swept/skimmed/excluded/pending), a per-LANGUAGE row,
 and every gap named (a NOT-RUN scanner, a semgrep timeout, --quick skipping the sweep + ASVS net,
 --no-history skipping the secret-history pass, files excluded and why).
 The CONFIDENCE block: the recall-canary result (armed lenses, N/N killed) + this skill version's
 self-test recall - so a clean pass CITES the instrument's measured sensitivity, never a bare "clean".]

**Coverage claim:** over the N-surface inventory and the M-file manifest - NOT over "the project".

## 2. Verdict            [ONE line, from the fixed vocabulary in 60.2, stamped with the depth tier.]

## 3. Executive summary   [<= 1 page, plain language, zero jargon - the 3 things that matter and the
                           week's next steps. Compare to the prior pass if there is one.]

## 4. Threat model         [the SURFACE-REGISTER + crown jewels + trust boundaries + the EGRESS map.]

## 5. Findings             [by severity, Critical first, numbered per severity. Each finding: 60.3.]

## 6. Since last pass      [still-open / regressed (escalated) / fixed, from Phase 50.6. Omit on pass 1.]

## 7. Refuted (N)          [ALWAYS rendered, sorted by base severity descending. One line each: title,
                            source, refutation code, evidence, wrong_if. `was C (base H)` stays readable.]

## 8. Raw ledger           [per source: `semgrep: 41 emitted -> 38 refuted -> 3 reported`. Over-refutation
                            visible at a glance. The EXCLUDED register counts by reason code.]

## 9. Manual follow-up checklist   [FIRST-CLASS section, auto-populated from every FLAGGED + OUT-OF-SCOPE
                            item + the O1-O7 deployment-posture checks (60.5). Each: what to check, where,
                            expected value, worst case if wrong. Grouped by owner (ops / business / infra).]

## 10. Compliance signal   [ONLY if SCOPE set a regime. Renders COMPLIANCE (55). "Compliance signal - NOT
                            a compliance claim." Never says "compliant/certified".]

## 11. What is done well    [genuine strengths - the controls that ARE correct. Tells the team what NOT to regress.]

## 12. Accepted risks / suppressions   [each with its reason and the wrong_if, reprinted every run.]

## 13. Limitations         [the honesty clause, verbatim - 60.4.]

## Appendix. Standards coverage   [which lenses ran; findings tagged CWE / Top10 / API / WSTG / CAPEC
                            via reference/standards-coverage-map.md; ASVS Pass/Fail/N-A/Not-Assessable matrix.]
```

## 60.5 The deployment-posture checks (O1-O7, the code-verifiable "everything")

A repo-wide pass that feeds sections 0 and 9: **O1** committed-config inventory (infra configured only
in a dashboard is un-reviewable - flag it); **O2** env-contract completeness (every secret var in the
secret-registry + `.env.example` + the validated schema; boot-guards present) with "is it set in
prod?" flagged; **O3** security-event log coverage (every auth/authz/admin/PII-access/export event
routes through the one audit trail - SEC-LOG); **O4** deletion-cascade completeness (every PII store
in the cascade - the orphaned-PII diff); **O5** subprocessor data-flow map reconciled against the
declared list (a code-used vendor not declared is a finding); **O6** secret-hygiene in-tree + history;
**O7** client-surface detection (mobile/desktop present or explicit N/A). Each emits its unverifiable
siblings (rotation cadence, at-rest encryption enabled, backup tested) to the checklist.

## 60.2 The verdict vocabulary (no word a partial or over-refuted scan can reach)

Exactly three forms, each **stamped with the depth tier reached** (T0/T1/T2, `reference/orchestration.md`)
and **qualified by the unverified surface**. **Never "clean", never "secure", never "no issues found."**

```
DO NOT SHIP (worst unfixed: <severity>) · tier <T> · <N> flagged + <M> out-of-scope
NO BLOCKING FINDINGS over the N-finding ledger; all required sources attested · tier <T>
   · NOT a clean bill of health: <N> items flagged for human check, <M> out of scope
INCOMPLETE - <tool/phase/canary> did not run. This report makes NO statement about <domain>.
```

Verdict rules: the verdict is the **worst unfixed severity**, qualified by coverage - and a green code
verdict with flagged/out-of-scope items is **never "secure"**, it is "no blocking findings in what the
source can prove." **Any High-or-above finding at `unproven` confidence BLOCKS** - the skill may not
ship on "I couldn't prove it." A `--quick` run (tier T0), any run below the always-runs floor, any run
with a NOT-RUN required source, and **any run where a recall canary survived** is `INCOMPLETE`. And -
the one hard formatting law - the report may **never print "0 findings" without the site/scan count
beside it** ("0 findings / 0 sites hunted" must be impossible to mistake for "0 findings / 137 sites
hunted"), and **never a bare "clean" without citing the recall canary + self-test sensitivity**.

## 60.3 A finding (the commercial-grade record)

```markdown
### C1. <title - the failure, not the rule name> (Critical) · <id>
- **Severity:** Critical  ·  **Confidence:** confirmed | probable | unproven  ·  **Calc:** H + E4 -> Critical
- **Classification:** CWE-xxx · OWASP A0x:2025 · ASVS Vx.y.z
- **Source:** <scanner / invariant / llm-audit> (<rule/CVE id + link>)
- **Where:** `file:line` (source) -> `file:line` (sink) · surface: <name>
- **Attack:** <the concrete failure scenario - inputs -> wrong outcome, reproducible in current code>
- **Trace:** <source -> hops -> sink, each a real call site>
- **Business impact:** <in the business's words, not the CVE's>
- **Fix:** <the concrete change, file + what> · **Effort:** S/M/L
- **Status:** open | proposed (report-only) | fixed (pass N) | rotation-pending
```

## 60.4 The honesty clause (ships verbatim, every run)

> **This was a source-code-led review, not a penetration test.** It read only the code on disk at the
> stated commit; it did not exercise the running application, its runtime configuration, its
> infrastructure, its cloud IAM, or any third-party service configuration held outside this repo. **It
> ran no live traffic** - no DAST, no fuzzing, no exploitation. Except where a finding is marked
> `Validated (PoC)`, every exploitability claim is reasoned from reading the code, not proven by
> executing it. The free SAST engine **cannot follow taint across file boundaries**; the LLM sweep
> covers that class but is subject to false negatives (its measured sensitivity is stated in the
> coverage block). ASVS "Not-Assessable" requirements were not verified - they need artifacts outside
> the source. Dependency findings lag disclosure: the absence of a known CVE is not evidence a
> dependency is safe; typosquatting and dependency-confusion were assessed by heuristics
> (`reference/supply-chain-heuristics.md`), but **malicious-package behaviour beyond osv's known-malware
> (`MAL-`) advisories was not**. Credentialed database URIs in git history ARE covered (a custom
> gitleaks rule); a secret only in the working tree is *not yet leaked* and is a separate, lower
> finding. **Absence of evidence is not evidence of absence: a report with no blocking findings is not
> a certificate, an attestation, or a clean bill of health, and must not be represented as one.** No
> ASVS, SOC 2, PCI, or GDPR compliance is claimed or implied - the compliance section (if present) is
> evidence toward controls, never a verdict on them.

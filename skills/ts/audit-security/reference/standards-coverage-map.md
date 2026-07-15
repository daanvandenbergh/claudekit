# Standards coverage map

The auditable completeness argument, in one place: which security standards this skill works through,
which it deliberately does not, and how findings are tagged. Loaded by Phase 40 (which standards spine
the lens sweep + ASVS net cover) and Phase 60 (the "Standards coverage" report appendix).

## The one rule that retires every "should I build mapping X" question

**Resolve any cross-standard link through OpenCRE, never a hand-maintained matrix.** OpenCRE
(`https://opencre.org/`, the OWASP Common Requirement Enumeration) already links Top 10 <-> ASVS <->
Proactive Controls <-> WSTG <-> CWE <-> CAPEC <-> NIST 800-53 <-> SSDF <-> ISO 27001/27002 at the
requirement level. A finding's CWE is the join key; OpenCRE gives the rest.

Note: **ASVS 5.0 deliberately dropped its per-requirement CWE mapping** (the OWASP team judged the
links imprecise and pushed all cross-mapping to OpenCRE). Do not try to reconstruct an ASVS<->CWE
table by hand - go through OpenCRE. The one map still worth using directly: each OWASP Top 10 category
ships its own "Mapped CWEs" list, and MITRE maintains CWE->CAPEC.

## The verdict table

| Standard | Source-checklist? | Verdict | Role in the skill |
|---|---|---|---|
| **OWASP ASVS 5.0** | yes, levelled requirements | **ADOPT** | the Phase-40 completeness NET (`reference/asvs.md`); default L2 |
| **OWASP Top 10 2025** | risk categories | **ADOPT** | per-finding `Top10:A##` tag; lens families map 1:1 |
| **OWASP API Security Top 10 2023** | 10 named risks, object-granular | **ADOPT** | SEC-AC (BOLA/BFLA) + SEC-API tags `API:API#:2023` |
| **OWASP WSTG** | concrete test cases | **ADOPT** | the business-logic + session + client test cases as SEC-BL/SEC-AUTH/SEC-CLIENT probes; `WSTG-####-##` tag |
| **OWASP Proactive Controls 2024 (C1-C10)** | positive controls | **ADOPT (light)** | a "is the defense present?" pass folded into the report as a coverage checkbox |
| **CWE Top 25 2025** | weakness taxonomy | **ADOPT** | per-finding `CWE-###` tag; "scan for these first" bite-list |
| **OpenCRE** | linking graph | **ADOPT** | the cross-map engine (this file's governing rule) |
| **MITRE CAPEC** | attack patterns, CWE-linked | **ADOPT (light)** | optional per-finding `CAPEC-###` derived from the CWE |
| **NIST SSDF (SP 800-218)** | PW group code-relevant | **ADOPT (PW only)** | the audit run itself is evidence of PW.7/PW.8; skip PO/PS/RV (org process) |
| **PCI-DSS / SOC 2 / ISO 27001** | thin code-verifiable slice | **ADOPT as an evidence TAG** | `evidence: SOC2 CC6.1 / PCI 6.2.4 / ISO A.8.28` via `reference/compliance-map.md` - never a compliance claim |
| **MITRE ATT&CK** | post-exploitation TTPs | **REJECT** as a coverage model | wrong altitude for source findings; CAPEC covers app-layer |
| **OWASP SAMM / DSOMM** | org/pipeline maturity | **REJECT** | a code audit cannot verify org maturity |
| **PTES** | pentest engagement method | **REJECT** as coverage (borrow the report shape only) | its exploitation phases do not apply to a static pass |
| **OWASP MASVS** | mobile | **CONDITIONAL** | one-line stub; activate only if a React Native / native client appears |
| **CIS Benchmarks** | config hardening | **CONDITIONAL** | only against committed IaC/deploy config the skill reads (see SEC-CLOUD) |

## Finding tags (optional fields on the finding record)

`cwe: CWE-###` · `owasp: A0#:2025` · `api: API#:2023` · `wstg: WSTG-####-##` · `capec: CAPEC-###` ·
`evidence: SOC2 CC#.# / PCI Req# / ISO A.#.##`. The CWE is mandatory-if-known (it is the OpenCRE join
key); the rest are derived from it via OpenCRE and are optional. Never invent a mapping the model is
unsure of - an absent tag is better than a wrong one.

## The "Standards coverage" report appendix

Phase 60 prints, in one paragraph, which lens families ran and which standard each covers, so the
completeness claim is auditable: *"This assessment ran SEC-AC/AUTH/INJ/WEB/CLIENT/API/SEC/BL/AI/SUP/
LOG/ERR (OWASP Top 10 2025 A01-A10 + API Top 10 2023) and the ASVS 5.0 L2 net over 17 chapters. Not
run: MASVS (no mobile client), CIS (no committed infra). Cross-standard tags resolved via OpenCRE."

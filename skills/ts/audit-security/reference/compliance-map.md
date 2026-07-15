# Compliance mapping + data-protection lens

Loaded by Phase 55 (compliance mapping) and the `DP*` data-protection sub-lens of Phase 40. It turns
the audit's code findings into **evidence toward** named controls - never into a compliance verdict.

## The honesty line (non-negotiable, read before anything else)

- **Code shows PRESENCE and WIRING; org / infra / legal shows VALIDITY and OPERATION.** A source pass
  can prove "this field reaches a log call" or "this collection is not in the deletion cascade." It
  cannot prove a DPA was signed, that Atlas at-rest encryption is enabled, that a retention period is
  lawful, or that access is reviewed quarterly. Those are emitted **only** in the `Code CANNOT attest`
  column, never as a pass.
- **NEVER output "compliant", "certified", or "SOC 2 compliant".** SOC 2 is a CPA attestation, not a
  tool output; GDPR/PCI/HIPAA status depends on controls this pass cannot inspect. The skill produces
  *evidence toward* a control, never a verdict on it.
- **Absence of a finding is NOT a pass.** A control the code cannot see is `CANNOT-ATTEST`, not green -
  the same discipline the skill applies to "the previous pass found nothing."
- **Every green cell carries its `file:line`.** No evidence, no signal.

**Status vocabulary** (deliberately not "compliant / non-compliant"):
`PASS-signal` · `GAP (DPn)` · `CODE-PRESENT / PROCESS-UNVERIFIED` · `SCOPE-MINIMIZED` · `N/A` ·
`CANNOT-ATTEST`.

---

## The `DP*` data-protection lens (a Phase-1 sub-lens; every DP finding also writes a PII-inventory row)

Each check = named failure mode + concrete Probe + severity Floor. Resolve `<logger>`, `<redactor>`,
`<tenantKey>`, `COLLECTION_NAMES`, the cascade functions, and the declared subprocessor list from
`PROFILE` before probing.

- **DP1. PII/PHI in logs or errors** (CWE-532; GDPR Art.32; SOC2 CC7.2; HIPAA 164.312(b)). Probe:
  for each personal-data field, trace to every `<logger>` / thrown-error / response site; confirm the
  redactor covers PII, not just secrets; strip token-bearing URLs before logging. Floor: **High** (PHI/
  special-category = Critical).
- **DP2. PII in the client bundle / over-fetched to the browser** (CWE-540; GDPR Art.5(1)(c)). Probe:
  server->client prop boundaries and API responses carrying PII the UI never renders. Floor: **High**.
- **DP3. PII to a third party without a documented basis** (GDPR Art.28,30(1)(d); SOC2 CC9.2). Probe:
  enumerate outbound egress boundaries; diff recipients against the declared subprocessor allowlist; a
  vendor receiving PII that is NOT on the list is a finding (DPA is an org artifact -> `TODO.md`).
  Floor: **High**.
- **DP4. Missing encryption in transit / at rest for regulated data** (GDPR Art.32(1)(a); PCI Req 3/4;
  HIPAA 164.312(e)). Probe: `http://` egress, TLS-optional clients. At-rest is infra (Atlas) -> mark
  `CANNOT-ATTEST`, do not false-pass. Floor: **High** (PAN/PHI in transit unencrypted = Critical).
- **DP5. Missing retention/deletion - orphaned PII** (GDPR Art.5(1)(e),17; SOC2 CC6.5). Probe: the
  set-difference of `COLLECTION_NAMES` against both cascade functions; any PII-bearing collection in
  one and absent from the other, or ephemeral PII with no TTL. Floor: **High**.
- **DP6. Over-broad collection (minimization)** (GDPR Art.5(1)(c),25(2)). Probe: a personal-data field
  ingested/validated at a boundary but read by no downstream code. Floor: **Medium** (business
  necessity is judgment -> note, do not over-claim).
- **DP7. Secrets/PII in URLs, caches, or analytics** (GDPR Art.32). Probe: PII/tokens in query
  strings, path segments, cache keys, or analytics payloads; confirm URL identifiers are opaque.
  Floor: **High**.
- **DP8. Special-category / payment data handling** (GDPR Art.9,25; PCI). Probe: health/biometric/
  precise-location/financial data, and free-text channels (transcripts, notes) that can *carry*
  Art.9 data treated as ordinary; confirm payment scope-minimization (no PAN server-side). Floor:
  **High**; PAN server-side = Critical.
- **DP9. Breach-detection logging gap** (GDPR Art.33 detectability; SOC2 CC7.2/7.3; HIPAA 164.312(b)).
  Probe: a security-relevant action (auth event, role change, data export, staff access to tenant PII)
  that writes no audit row. Floor: **Medium/High**. (Overlaps SEC-LOG1 - report once.)
- **DP10. Legal-basis / consent gate absent where the code implies one** (GDPR Art.6,7). Probe: a
  processing path gated on consent/opt-in elsewhere but not here (marketing vs transactional SMS); a
  tracker set before a consent signal. Code shows a coded gate is missing, not that a basis is legally
  valid. Floor: **Medium**.

---

## The PII-inventory artifact (Phase 55 emits it; the technical half of a GDPR Art.30 ROPA)

Honestly a *"Record of Processing (technical half) - code-derived"*, not a finished ROPA. Three tables,
every row cited to `file:line`.

**Table 1 - Data-element register.** One row per personal-data field:
`| Element | Category | Special-cat? (Art.9/PCI/PHI) | Enters at | Stored in (collection) | Encrypted/hashed at rest? | In deletion cascade? | Evidence |`

**Table 2 - Subprocessor egress map.** One row per external recipient (Art.30(1)(d)-(e)):
`| Recipient | What PII leaves | Call site | Documented basis in code? | Third country? |` -
reconcile against the declared subprocessor list; an egress to a vendor **not** on that list is DP3.

**Table 3 - Deletion / retention coverage matrix** (the orphaned-PII detector):
`| Collection | Holds PII? | onDeleteOrg | onDeleteUser | TTL index | Verdict |` - the mechanical form
of the "new collection goes in the cascade or it orphans PII forever" invariant.

---

## The check-id -> control map

One row per check; a framework column cites the control number so a finding can be tagged with it. Cross-
standard links are resolved via **OpenCRE** (`reference/standards-coverage-map.md`), never a hand-kept
matrix. **The two right-hand columns are mandatory and never merged.**

| Check | Failure it detects | SOC 2 (TSC) | PCI-DSS 4.0 | GDPR | HIPAA 164.312 | Code EVIDENCES | Code CANNOT attest |
|---|---|---|---|---|---|---|---|
| SEC-AC1/2 authz | IDOR / BFLA | CC6.1, CC6.3 | Req 7 | Art.32(1)(b) | (a)(1) Access Control | a per-object check exists at `file:line` | provisioning/deprovisioning process (CC6.2) |
| SEC-AC tenant | cross-tenant read | CC6.1 | Req 7 | Art.5(1)(f),32 | Access Control | tenant filter present | - |
| SEC-AUTH* | broken authn/session | CC6.1 | Req 8 | Art.32 | (a)(2) / (d) | KDF, lockout, session lifecycle in code | MFA operated org-wide, credential rotation |
| SEC-SEC5/6 | secret/PII leak | CC6.1, CC6.6 | Req 3.3, 8 | Art.32 | Transmission / Audit | no secret in bundle/logs | - |
| SEC-BL2 idempotency | double-charge | CC7.1 | - | Art.5(1)(d) | (c)(1) Integrity | dedup on a unique key | - |
| SEC-LOG* / DP9 | no audit trail | CC7.2, CC7.3 | Req 10 | Art.33 | (b) Audit Controls | security events recorded | 24/7 monitoring, IR execution, retention duration |
| DP1 | PII/PHI logged | CC6.1 | Req 3.3/3.4 | Art.5(1)(c),32 | (b) | field reaches log unredacted | - |
| DP3 | undoc. egress | CC9.2 | - | Art.28,30(1)(d) | - | the egress exists in code | a DPA/BAA exists (org) |
| DP4 | no TLS / no at-rest | CC6.7 | Req 4.2, 3.4/3.5 | Art.32(1)(a) | (e); (a)(2)(iv) | TLS enforced in code | at-rest DB encryption enabled at the provider (infra) |
| DP5 | orphaned PII | CC6.5 | Req 3.2 | Art.5(1)(e),17 | - | purge path exists / is missing | that the retention *duration* is lawful |
| DP6 | over-collection | - | Req 3.2 | Art.5(1)(c),25(2) | - | field collected and unused | business necessity (judgment) |

Rules: **list a framework's row only when its data class is present** (HIPAA rows stay dormant until PHI
is detected; PCI collapses to `SCOPE-MINIMIZED - no PAN in codebase` when card data never touches the
server - itself the most valuable code-verifiable PCI finding). **Never phrase a finding as "fails ISO
27001"** - the audit produces evidence *for* a control, it does not audit the framework.

## The report section: "Compliance signal (NOT a compliance claim)"

Appended by Phase 60 after the security findings, only when a compliance regime was set in Phase 05
(else the whole section is `N/A`, stated). Structure: a one-line disclaimer (*"NOT a statement of
compliance"*), the DP findings this pass, a `Control signal by framework` table (control · signal ·
evidence file:line), then **"What this pass CANNOT attest"** listing the org/process/infra items -
legal basis and consent records, DPAs/BAAs, at-rest encryption, retention lawfulness, personnel and
physical security, IR execution, and the SOC 2 opinion itself.

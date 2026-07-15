> **Phase 55 - Compliance mapping and PII inventory**
> **Consumes:** `SCOPE` (the regime, from 05), `LEDGER` (admitted, from 50).
> **Produces:** `COMPLIANCE` (a control-signal rollup) + `PII-INVENTORY` (the code-derived data map).
> **Gate:** runs only when `SCOPE` names a regime; otherwise a stated N/A, never a silent skip.
>   Full spec: `reference/compliance-map.md`. Read it in full first.

# Phase 55 - Compliance mapping and PII inventory

A commercial audit that touches PII or money should say what its findings mean for the regime the
project answers to - **as evidence, never as a verdict.** This phase does two things, both grounded
in `reference/compliance-map.md`, and both governed by one line: **the skill never outputs
"compliant" / "certified" / "SOC 2 compliant".** Code shows *presence and wiring*; organizational,
contractual, and infrastructural validity are outside a source review and are marked so.

## 55.1 The PII inventory (the code-derived record of processing)

Build the three tables in `reference/compliance-map.md` from the project's real chokepoints (the
data layer, the deletion cascades, the log redactor, the outbound vendor calls):

1. **Data-element register** - each personal-data field: category, special-category flag (health /
   biometric / precise-location / financial - watch free-text channels like transcripts that carry
   Article-9 data the schema never declared), where it enters, where it is stored, whether it is
   hashed/encrypted at rest, whether it is in the deletion cascade. Every row cites `file:line`.
2. **Subprocessor egress map** - each external recipient, what PII leaves, the call site, and whether
   the recipient is on the project's declared subprocessor list. **A network egress to a vendor not on
   that list is a finding** (an undocumented subprocessor).
3. **Deletion / retention coverage matrix** - diff `COLLECTION_NAMES` (or the project's collection
   registry) against the cascade functions; a PII-bearing store present in one and absent from the
   other is orphaned-PII (`DP5`, High).

The `DP1-DP10` data-protection lens (`reference/compliance-map.md`) runs here and its findings enter
the ledger like any other.

## 55.2 The compliance signal (not a claim)

For the named regime, map the ledger's findings and the PII inventory to the specific
code-verifiable controls (`reference/compliance-map.md` has the check-to-control table with the two
mandatory columns: **Code EVIDENCES** and **Code CANNOT attest**). Emit `COMPLIANCE` as a control
rollup using the honest status vocabulary - `PASS-signal`, `GAP (DPn)`, `CODE-PRESENT /
PROCESS-UNVERIFIED`, `SCOPE-MINIMIZED`, `N/A`, `CANNOT-ATTEST` - never "compliant/non-compliant".
Every green cell carries `file:line`; **absence of a finding is `CANNOT-ATTEST`, not a pass.**
`phases/60-report.md` renders this as the "Compliance signal (NOT a compliance claim)" section, which
lists what the code evidences and, separately and loudly, what only an organizational/infrastructural
review can answer.

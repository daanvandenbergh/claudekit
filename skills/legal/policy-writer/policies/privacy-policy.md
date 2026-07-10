# Runbook: privacy policy

> Governs privacy-policy runs. Generic to any project; all project facts come from Phase 2
> investigation and the project memory store. Procedure generalized from a production-proven
> project runbook on 2026-07-05.

## Purpose and applicability

Every product that processes personal data needs a privacy policy; this is the default
policy every project gets first. The policy must be complete (everything the code does is
disclosed), accurate (nothing is claimed that the code does not do), and compliant with the
jurisdictions the memory store scopes (GDPR disclosure duties are the baseline bar; widen per
`references/jurisdictions-us.md` / `references/jurisdictions-global-mena.md` when the memory store
says users are there).

## Mode detection specifics

Read the policy page/document found in Phase 1. A short "preliminary summary", a template
with placeholders, or a missing page -> CREATE. A full policy -> VERIFY-AND-UPDATE: audit
every claim against the Phase 2 inventory; change only what is incorrect, incomplete, or
stale.

## Investigation focus (extends the standard Phase 2 team)

Point the standard agents at, and add agents for, whichever of these the project has:

1. **Account and auth data** - what the auth system stores (users, sessions, tokens,
   audit/security logs incl. IP addresses and user agents, lockout and rate-limit data) and
   every cookie it sets.
2. **Domain data** - the product's own records about people: which fields, and critically
   WHOSE data each record is - the customer's own data (the business is usually controller)
   vs data the customer's business holds about ITS customers (the business is usually
   processor). This fork drives the whole policy structure.
3. **Media and communications data** - recordings, transcripts, uploads, messages: what is
   received, what is persisted, what stays only at an external platform.
4. **Billing data** - what the payment integration stores locally (ids, status, display
   fragments) vs what stays at the payment provider; whether the provider is merchant of
   record.
5. **Retention and deletion** - every TTL, cascade delete, cleanup job, and account-deletion
   path; these become the retention table and the erasure-rights section.
6. **Vendors, transfers, telemetry** - all subprocessors actually wired in (including
   env-var-only ones - active until the user says otherwise), where each processes data
   (verify each vendor's current transfer mechanism live), any analytics/tracking on the
   site (if none, the policy says so), and what the logger writes (verify any PII-redaction
   claim before making it).

Also read the project's TODO/roadmap docs for PLANNED processing - planned-but-unshipped
features never enter the policy as current processing; record them in the memory store instead.

## Drafting non-negotiables

- **Dual role, stated plainly, when it exists**: controller for the customers' account and
  billing data; processor for data handled on the customers' behalf. Must stay consistent
  with the terms and DPA documents - read them; never contradict them; patch them only where
  they contradict verified facts.
- **Purposes + legal basis table**: one lawful basis per purpose, assigned via
  `references/legal-bases-gdpr.md` (Art 6 library, validity conditions, LIA test).
- **Retention table from actual TTLs found in Phase 2** - no invented numbers, ever. Judge
  the found numbers against `references/retention-periods-cnil.md` doctrine and flag
  outliers to the user instead of silently normalizing them.
- **Recipients/subprocessors = exactly the Phase 2 vendor list**, each with its transfer
  safeguard (adequacy/SCCs/DPF - verify the current mechanism live, per vendor).
- **Data-subject rights** with response commitments from
  `references/dpa-review-and-dsr-ops.md`, a concrete exercise channel (the memory store's contact),
  and the right to complain to a supervisory authority. Use
  `references/data-subject-rights-cnil.md` for the rights themselves.
- **High-sensitivity processing gets its own section** (call recordings, precise location,
  health, biometrics, children's data): what, why, retention, and who bears any
  notification/consent duty - cross-reference `references/call-recording-consent-eu.md` and
  `references/sector-and-special-products.md` as applicable. Sector overlays are flagged for
  counsel, not drafted around.
- **Cookies section reflects the verified cookie inventory** and never contradicts the
  cookie policy (if one exists, reference it).
- **Mandatory-disclosure completeness** via the Art 13/14 checklist in
  `references/jurisdictions-eu-uk.md` (direct vs indirect collection fork), plus the
  jurisdiction packs the memory store scopes in. US scope adds the CCPA/CPRA mandatory links and
  notice-at-collection per `references/jurisdictions-us.md`.
- **Plain language** per `references/structure-clauses-and-craft.md`; "Last updated" date;
  entity identity from the memory store or `[[PLACEHOLDER: ...]]` - never invented.

## Required structure

Use the 16-section backbone in `references/structure-clauses-and-craft.md` with the
conditional template `assets/template-privacy-policy.md` as the skeleton (French docx
structural precedent: `assets/template-politique-confidentialite.docx`); on a first run,
drive scoping with `references/intake-questionnaire.md` (jurisdiction-first: compute the
applicable-law set before drafting a single clause; store the answers in the memory store).

## Verification specifics (extends Phase 4)

- Every claimed data category maps to backend evidence; every backend personal-data flow
  maps to a policy statement. The classic drift class: the policy claims a data practice
  (e.g. call recording) whose code is absent - remember an external platform may still be
  doing it (env-var-only vendor rule): resolve with the user, do not just delete the claim.
- Retention numbers re-checked against the actual TTL/config values.
- The Art 13/14 checklist walked line by line; the 12-point QA gate in
  `references/edge-cases-failure-modes-qa.md` passed.
- Consistency with the cookie policy, terms, and DPA pages.

## Ask the user (never invent)

- Entity identity (legal name, form, registration number, address) and the privacy contact -
  check the memory store first.
- Whether a DPO exists / is required.
- Processing scope of every env-var-only or externally-configured platform (what does the
  platform actually record/retain - the repo cannot show this).
- Any transfer mechanism or vendor region the repo/config cannot determine.

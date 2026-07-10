# Runbook: terms of service

> Governs terms-of-service runs. Generic to any project; all project facts come from Phase 2
> investigation and the project memory store. Substance lives in
> `references/terms-of-service-standards.md` (EU-focused, US divergences flagged).

## Purpose and applicability

Every product with users needs terms; a SaaS needs them before it charges anyone. Unlike the
privacy policy (disclosure duties), terms are a CONTRACT: wrong terms are unenforceable or
unfair-term-void rather than non-compliant, and several clauses are business decisions no
agent may make alone (caps, governing law, SLA numbers) - those are drafted as structured
`[[PLACEHOLDER: ...]]` choices for the operator and counsel.

## Mode detection specifics

Terms page/document missing or stub -> CREATE. Present -> VERIFY-AND-UPDATE: check each
clause against the verified product reality (billing model, trial mechanics, deletion
behavior, AI features) and the current legal standards in the reference; never restyle
validated legal wording.

## Investigation focus (extends the standard Phase 2 team)

- **Billing reality**: the actual payment integration - subscription lifecycle, trials and
  their length, renewal/cancelation mechanics as implemented, and critically whether a
  merchant of record sits in the middle (payment-provider mode/config in code). The billing
  section must describe what the code does, not a generic subscription story.
- **Account lifecycle**: signup, suspension, deletion paths (what termination actually
  triggers - links to the deletion cascade found by the retention agent).
- **AI features**: what the product's AI actually produces for users and what its failure
  modes are - drives the AI-output disclaimer scope.
- **The B2B/B2C fork facts**: who can actually sign up (org-only? consumer-reachable?) -
  determines whether EU consumer regimes attach (reference section 2, incl. the
  nominally-B2B traps).
- **Sibling documents**: privacy policy, DPA, imprint - the terms must reference, not
  duplicate or contradict them.
- **DSA triggers**: does the product host content shown to others, run a recommender/feed,
  show ads, or let third parties sell to consumers, while serving the EU? That fixes the DSA
  tier and the ToS duties it forces (see `references/digital-services-act-eu.md`).

## Drafting non-negotiables

Draft from `references/terms-of-service-standards.md`:

- **Full essential clause set** (reference section 1) - acceptance, account, license +
  restrictions, acceptable use, customer data ownership + license-back, IP, fees/billing,
  term/termination + effects, warranties/disclaimers, liability, indemnities, changes to
  terms, assignment, governing law/disputes, severability - each with the reference's
  pitfall notes applied.
- **B2C regimes honored when they attach** (reference section 2): UCTD greylist screen over
  every clause, withdrawal-right mechanics for digital services, no blacklisted terms;
  B2B-only products state the business-use restriction explicitly.
- **Merchant-of-record wording** (reference section 3) when one exists: the MoR is the
  seller of record for the purchase; the billing section points to the MoR's buyer terms
  for the sale/tax/refund layer and does not double-claim the sale.
- **AI-output clauses** (reference section 4): accuracy disclaimer, human-review
  expectation, usage restrictions - scoped to the actual AI features found, and hooked to
  the AI-transparency disclosure rather than restating the AI Act.
- **DSA duties when the product hosts UGC / a feed / ads / a marketplace and serves the EU**
  (`references/digital-services-act-eu.md`): the ToS must carry the Art 14
  content-moderation/restrictions clause and the Art 27 recommender-parameters clause, and
  point to the Art 16 notice / Art 17 statement-of-reasons routes; ad-identification (Art 26)
  and the Art 28 minors regime attach for online platforms; a marketplace adds Art 30 KYBC.
  Run the tier triage first; flag any VLOP duties to counsel. Kept separate from GDPR — do not merge.
- **SLA structure only, numbers never** (reference section 5): any uptime %, credit
  schedule, or support window is `[[PLACEHOLDER: ...]]` for the operator.
- **Enforceable change mechanics** (reference section 6): advance notice for material
  changes, no naked "we may change these at any time".
- **Counsel-decision placeholders, never invented**: liability caps, indemnity scope,
  governing law + forum (B2C forum clauses are a known trap - reference UNRESOLVED list),
  arbitration/class-waiver (US).
- Identity, contact, and role statements consistent with the memory store and sibling documents.

## Required structure

The reference's clause set in its section-1 order, adapted to what the product actually has
(no SLA section for a product with no SLA; no consumer-withdrawal section for a verified
B2B-only product - but record WHY in the memory store). Close with the drafter's decision
checklist (reference, end) before handing to verification.

## Verification specifics (extends Phase 4)

- Clause-by-clause against the verified product reality: billing described == billing
  implemented; termination effects == actual deletion/export behavior; AI disclaimers cover
  the shipped AI surface.
- UCTD greylist screen re-run by a fresh verifier if any B2C exposure exists.
- All placeholders present, none silently resolved; sibling-document consistency
  (privacy/DPA/imprint references resolve and agree).
- No stale legal artifacts (the reference flags current traps - e.g. defunct EU ODR-platform
  references; verify any such link/claim live at run time).

## Ask the user (never invent)

- Entity identity + governing law and forum preference.
- Liability cap position, indemnity scope, arbitration stance (counsel decisions).
- SLA commitments and support windows, trial/refund policy where not encoded.
- Whether consumers can actually reach the product (if the code cannot prove B2B-only).

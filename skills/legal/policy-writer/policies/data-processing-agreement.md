# Runbook: data processing agreement (DPA)

> Governs DPA runs: the customer-facing DPA document a processor-side business offers its
> customers, plus any public data-processing/subprocessors page backing it. Generic to any
> project; all project facts come from Phase 2 investigation and the project memory store.

## Purpose and applicability

A business that processes personal data ON BEHALF OF its customers (any B2B SaaS whose
product touches its customers' customers - their users, callers, patients, buyers) is a GDPR
processor and its customers will demand an Art 28 DPA; a "DPA available on request" claim on
a website is a promise this runbook must back with a real document. Deliverables, as the
project needs them: the DPA document itself, its annexes, and the public subprocessors /
data-processing page (which must match the DPA exactly).

## Mode detection specifics

Three artifacts to check (memory store first, then repo): a public data-processing/subprocessors
page; an actual DPA document (repo, docs dir, or linked asset); annex content. Any missing
artifact is CREATE for that artifact. A page claiming "DPA on request" with no DPA document
behind it is a drift finding, not a complete state.

## Investigation focus (extends the standard Phase 2 team)

- **Roles first**: confirm from the domain-data inventory which processing is
  on-behalf-of-customers (processor scope - goes IN the DPA) vs the business's own
  (controller scope - stays in the privacy policy). The DPA covers only the former.
- **Subprocessor list = the Phase 2 vendor sweep**, including env-var-only vendors confirmed
  active with the user. For each: what personal data reaches it, processing location/region
  (from config where visible, else ask), and its transfer mechanism (verify live per vendor:
  adequacy / DPF certification status / SCCs).
- **TOMs from reality**: derive Annex II from the security measures actually found in the
  code and infra (encryption in transit/at rest, access control, tenant isolation, audit
  logging, backups, deletion cascades). Honest-TOMs rule: only measures actually in place -
  an overstated TOM is a contractual misrepresentation.
- **Deletion/return capability**: what the code can actually do at contract end (account
  deletion cascade, export paths) - the DPA may only promise what is implemented or
  user-confirmed as operationally possible.

## Drafting non-negotiables

Draft from `references/dpa-drafting-standards.md` (clause-by-clause Art 28(3)(a)-(h) with
verbatim statutory anchors) cross-checked against the checklist in
`references/dpa-review-and-dsr-ops.md` (review checklist inverted into requirements):

- **Every Art 28(3)(a)-(h) element present** - documented-instructions clause,
  confidentiality, Art 32 security, sub-processing conditions, DSR assistance, breach and
  DPIA assistance, deletion-or-return, audit rights.
- **Sub-processor model chosen explicitly** (general authorization + public list + notice
  period is the SaaS norm): the notice period is a business decision - ask the user, do not
  pick silently (no authoritative norm exists; see the reference's UNRESOLVED list).
- **Consider the Art 28 SCCs (2021/915) as the base text** - adopting them verbatim is the
  lowest-risk route; distinguish them from the transfer SCCs (2021/914), which are only
  needed for third-country transfers without adequacy. Both primary texts are in
  `assets/sources/` (scc-art28-2021-915.pdf, scc-transfers-2021-914.pdf).
- **Transfers resolved per vendor** with the current mechanism, re-verified live at drafting
  time (DPF status is under active litigation - the reference flags this; never assume last
  run's answer).
- **Annex I from the live inventory** (subject matter, duration, nature/purpose, data
  categories, data-subject categories - the Phase 2 fact tables ARE this annex).
  **Annex II from the honest TOMs.**
- **Breach notification timeline** consistent with what the business can operationally meet
  and with what the privacy policy / terms claim (typical contracted windows and the 72-hour
  regulatory backstop are covered in the reference).
- UK/Swiss addenda only if the memory store scopes those markets (reference sections 8-9).
- The public subprocessors page lists exactly the DPA's subprocessor list - one source of
  truth, no divergence.

## Required structure

Parties/roles and precedence over the main agreement; definitions; processing scope +
documented instructions; confidentiality; security (Annex II pointer); sub-processing model
+ list location + change mechanics; DSR assistance; breach + DPIA assistance;
deletion/return at end; audit; transfers; liability (align with the main agreement - flag
caps to counsel); term; Annex I (processing description), Annex II (TOMs), Annex III
(subprocessor list). Use the drafter's final checklist in
`references/dpa-drafting-standards.md` section 10 before handing to verification.

## Verification specifics (extends Phase 4)

- Walk Art 28(3)(a)-(h): every element maps to a clause; every clause maps to an element or
  a justified addition.
- Annex I categories == Phase 2 data inventory; Annex III == vendor sweep; Annex II == found
  security posture (refuters hunt for overstated TOMs specifically).
- Transfer mechanism per subprocessor re-verified live.
- Consistency: privacy policy's processor-role section, terms' references to the DPA, and
  the public page all agree with the DPA.

## Ask the user (never invent)

- Entity identity + signature block details; the customer-notice channel for subprocessor
  changes and its notice period.
- Processing regions for vendors whose config does not show them; retention windows at
  external platforms.
- Whether audits beyond third-party reports (SOC 2 etc.) are operationally acceptable.
- Liability caps / indemnity positions (counsel territory - placeholder, never invent).

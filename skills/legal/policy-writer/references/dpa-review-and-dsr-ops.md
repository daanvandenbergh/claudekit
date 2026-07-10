# DPA review checklist and data-subject-request operations

> Provenance: extracted from the `compliance-anthropic` skill (author Anthropic, Apache-2.0, version 2026.01.30) on 2026-07-05; regulation-overview and regulatory-monitoring sections dropped (covered by the jurisdiction references).
> Read when: reviewing or drafting a DPA (pair with `dpa-drafting-standards.md`), or designing a policy's data-subject-rights section and its exercise channel.
> Timelines and mechanisms below are verified by the skill's currency process; if the Verified line is stale, re-check against live sources before relying on a number.
> Verified: 2026-07-09 against live sources (DSR timelines GDPR/CCPA/LGPD + DUAA stop-the-clock re-derived, all unchanged). Re-verify if older than 12 months.

## DPA review checklist

When reviewing (or drafting - invert each check into a requirement) a Data Processing
Agreement, verify (GDPR article checks below verified against the official text
[Source: https://eur-lex.europa.eu/eli/reg/2016/679/oj, accessed 2026-07-05]):

### Required elements (GDPR Article 28)

- [ ] **Subject matter and duration**: clearly defined scope and term of processing
- [ ] **Nature and purpose**: specific description of what processing will occur and why
- [ ] **Type of personal data**: categories of personal data being processed
- [ ] **Categories of data subjects**: whose personal data is being processed
- [ ] **Controller obligations and rights**: controller's instructions and oversight rights

### Processor obligations

- [ ] **Process only on documented instructions** (with the exception for legal requirements)
- [ ] **Confidentiality**: personnel authorized to process have committed to confidentiality
- [ ] **Security measures**: appropriate technical and organizational measures described
      (Article 32 reference)
- [ ] **Sub-processor requirements**:
  - [ ] written authorization requirement (general or specific)
  - [ ] if general authorization: notification of changes with opportunity to object
  - [ ] sub-processors bound by the same obligations via written agreement
  - [ ] processor remains liable for sub-processor performance
- [ ] **Data subject rights assistance**: processor will assist the controller in responding
      to data-subject requests
- [ ] **Security and breach assistance**: processor will assist with security obligations,
      breach notification, DPIAs, and prior consultation
- [ ] **Deletion or return**: on termination, delete or return all personal data (at the
      controller's choice) and delete existing copies unless legal retention is required
- [ ] **Audit rights**: controller may conduct audits and inspections (or accept third-party
      audit reports)
- [ ] **Breach notification**: processor notifies the controller of personal-data breaches
      without undue delay (commonly contracted at 24-48 hours; must enable the controller to
      meet the 72-hour regulatory deadline)

### International transfers

- [ ] **Transfer mechanism identified**: SCCs, adequacy decision, BCRs, or another valid
      mechanism
- [ ] **SCCs version**: current EU SCCs (the June 2021 set, Commission Implementing
      Decision (EU) 2021/914) if applicable - still the current set as of 2026-07-05; an
      additional set for importers directly subject to the GDPR is under development but
      not adopted [Source: https://commission.europa.eu/law/law-topic/data-protection/international-dimension-data-protection/standard-contractual-clauses-scc_en, accessed 2026-07-05]
- [ ] **Correct module**: appropriate SCC module selected (C2P, C2C, P2P, P2C)
- [ ] **Transfer impact assessment**: completed for transfers to countries without adequacy
- [ ] **Supplementary measures**: technical, organizational, or contractual measures for
      gaps found in the transfer impact assessment
- [ ] **UK addendum**: if UK personal data is in scope, the UK International Data Transfer
      Addendum is included - still current as of 2026-07-05; the ICO plans to update the IDTA
      and Addendum in the course of 2026 for the Data (Use and Access) Act 2025 and says to
      continue using the current versions until then
      [Source: https://ico.org.uk/for-organisations/uk-gdpr-guidance-and-resources/international-transfers/appropriate-safeguards/what-are-standard-data-protection-clauses-the-uk-idta-and-the-addendum/, accessed 2026-07-05]

### Practical considerations

- [ ] **Liability**: DPA liability provisions align with (or do not conflict with) the main
      services agreement
- [ ] **Termination alignment**: the DPA term aligns with the services agreement
- [ ] **Data locations**: processing locations specified and acceptable
- [ ] **Security standards**: specific standards or certifications required where warranted
      (SOC 2, ISO 27001, ...)
- [ ] **Insurance**: adequate coverage for data-processing activities

### Common DPA issues

| Issue | Risk | Standard position |
|---|---|---|
| Blanket sub-processor authorization without notification | Loss of control over the processing chain | Require notification with a right to object |
| Breach-notification timeline > 72 hours | May prevent timely regulatory notification | Require notification within 24-48 hours |
| No audit rights (or only via third-party reports) | Cannot verify compliance | Accept SOC 2 Type II + right to audit upon cause |
| Data-deletion timeline not specified | Data retained indefinitely | Require deletion within 30-90 days of termination |
| No processing locations specified | Data could be processed anywhere | Require disclosure of processing locations |
| Outdated SCCs | Invalid transfer mechanism | Require the current EU SCCs (2021 set) |

## Data-subject-request handling

Use this to design a policy's rights section and the exercise channel it promises. What a
policy promises here becomes an operational commitment - only promise what the business can
actually execute.

### Request intake

1. **Identify the request type**: access; rectification; erasure; restriction; portability
   (structured, machine-readable); objection; opt-out of sale/sharing (CCPA/CPRA); limit use
   of sensitive personal information (CPRA).
2. **Identify the applicable regulation(s)**: where is the data subject located; which laws
   apply given the business's presence and activities; which timelines follow.
3. **Verify identity**: reasonable measures proportionate to the data's sensitivity; do not
   demand excessive documentation.
4. **Log the request**: date received, type, requester identity, applicable regulation,
   response deadline, assigned handler.

### Response timelines

| Regulation | Initial acknowledgment | Substantive response | Extension |
|---|---|---|---|
| GDPR | Not specified (best practice: promptly) | 1 month | +2 months (with notice) |
| CCPA/CPRA | 10 business days | 45 calendar days | +45 days (with notice) |
| UK GDPR | Not specified (best practice: promptly) | 1 month | +2 months (with notice); the clock pauses while awaiting clarification of the request (Data (Use and Access) Act 2025) |
| LGPD | Not specified | Confirmation of processing / access: immediately in simplified format, or within 15 days for the complete-format declaration (Art 19); no statutory deadline for the other Art 18 rights (deadlines deferred to regulation, Art 18 s.5) | None specified in the law |

Timelines verified against the primary texts, all accessed 2026-07-05: GDPR Art 12(3)
[Source: https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX%3A02016R0679-20160504];
CCPA/CPRA - Cal. Civ. Code s.1798.130(a)(2) (45 days, one +45 extension with notice)
[Source: https://leginfo.legislature.ca.gov/faces/codes_displaySection.xhtml?lawCode=CIV&sectionNum=1798.130]
and 11 CCR s.7021 (10-business-day confirmation of receipt; unchanged in the regulations
effective 2026-01-01) [Source: https://www.law.cornell.edu/regulations/california/11-CCR-7021];
UK GDPR - ICO guide to subject access
[Source: https://ico.org.uk/for-organisations/uk-gdpr-guidance-and-resources/subject-access-requests/a-guide-to-subject-access/];
LGPD Art 19, Lei 13.709/2018
[Source: https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/l13709.htm].

### Exemptions and exceptions

Check before fulfilling: establishment/defense of legal claims; legal obligations requiring
retention; public interest or official authority; freedom of expression and information (for
erasure); archiving in the public interest or scientific/historical research. Organization
considerations: litigation hold (held data cannot be deleted); regulatory retention periods
(financial, employment records); third-party rights adversely affected by fulfillment.

### Response process

1. Gather all personal data of the requester across systems.
2. Apply exemptions and document the basis.
3. Fulfill the request, or explain why it cannot be fulfilled in whole or part.
4. If denying (in whole or part): cite the specific legal basis.
5. Inform the requester of the right to complain to the supervisory authority.
6. Document the response; retain records of the request and response.

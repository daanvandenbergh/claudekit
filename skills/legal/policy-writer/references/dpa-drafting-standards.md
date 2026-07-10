# DPA Drafting Standards - GDPR Art 28 Data Processing Agreement (Processor-Side SaaS)

> Verified: 2026-07-09 against live sources (Art 28/32/33/82, SCC Decisions 2021/914 & 2021/915, EU-US DPF/Latombe re-derived and unchanged; ICO IDTA/Addendum UNVERIFIED flag resolved — DUAA Part 5 in force 5 Feb 2026). Re-verify if older than 12 months.
> Provenance: authored for policy-writer from live web research; all citations inline.

Scope: how a SaaS provider acting as a **processor** drafts the Data Processing Agreement (DPA)
it offers to its business customers (the **controllers**). Each section states the rule, its source,
and the clause the drafter must therefore produce. Drafting guidance for a lawyer-reviewed draft,
not legal advice. Local PDF copies of both Commission SCC decisions are stored at
`assets/sources/scc-art28-2021-915.pdf` and `assets/sources/scc-transfers-2021-914.pdf`.

## 1. Threshold rules before drafting

| Rule (verbatim from the consolidated GDPR text) | Drafting consequence |
|---|---|
| Processing by a processor "shall be governed by a contract or other legal act under Union or Member State law, that is binding on the processor with regard to the controller and that sets out the subject-matter and duration of the processing, the nature and purpose of the processing, the type of personal data and categories of data subjects and the obligations and rights of the controller" (Art 28(3) chapeau) | The DPA must exist, bind the processor, and contain a processing description covering all six chapeau elements (usually via annex - section 6). |
| "The contract or the other legal act ... shall be in writing, including in electronic form" (Art 28(9)) | Click-through / online-accepted DPAs are valid. State how the DPA is executed and its order of precedence against the main services agreement. |
| "If a processor infringes this Regulation by determining the purposes and means of processing, the processor shall be considered to be a controller in respect of that processing" (Art 28(10)) | Keep the instructions clause tight. Any provider-own-purpose processing (e.g. product analytics on account data) is controller activity - cover it in the privacy policy, never smuggle it into the DPA. |

[Source: https://eur-lex.europa.eu/legal-content/EN/TXT/HTML/?uri=CELEX:02016R0679-20160504, accessed 2026-07-05]

## 2. Art 28(3)(a)-(h): mandatory clause content

Each row quotes the statutory obligation verbatim from the consolidated GDPR text on EUR-Lex
[Source: https://eur-lex.europa.eu/legal-content/EN/TXT/HTML/?uri=CELEX:02016R0679-20160504, accessed 2026-07-05]
and states the clause the DPA must contain. A DPA missing any element is non-compliant regardless of quality elsewhere.

| Art | Statutory obligation (verbatim) | Required clause |
|---|---|---|
| 28(3)(a) | "processes the personal data only on documented instructions from the controller, including with regard to transfers of personal data to a third country or an international organisation, unless required to do so by Union or Member State law to which the processor is subject; in such a case, the processor shall inform the controller of that legal requirement before processing, unless that law prohibits such information on important grounds of public interest" | Instructions clause: the DPA + services agreement + the controller's configuration of the product ARE the documented instructions; explicitly cover international transfers as instruction-bound; include the legal-compulsion carve-out with the prior-information duty. |
| 28(3)(b) | "ensures that persons authorised to process the personal data have committed themselves to confidentiality or are under an appropriate statutory obligation of confidentiality" | Personnel clause: all staff/contractors with access bound by written or statutory confidentiality; access on a need-to-know basis. |
| 28(3)(c) | "takes all measures required pursuant to Article 32" | Security clause referencing Art 32 and the TOMs annex (section 6); permit TOM updates only where overall security is not degraded. |
| 28(3)(d) | "respects the conditions referred to in paragraphs 2 and 4 for engaging another processor" | Sub-processor clause implementing the chosen authorization model + flow-down (section 3). |
| 28(3)(e) | "taking into account the nature of the processing, assists the controller by appropriate technical and organisational measures, insofar as this is possible, for the fulfilment of the controller's obligation to respond to requests for exercising the data subject's rights laid down in Chapter III" | Data-subject-rights assistance clause: forward requests received directly without answering; provide tooling (access, export, deletion, correction) or reasonable manual assistance. The "insofar as this is possible" limiter is statutory; cost allocation for excessive assistance is a lawful contractual choice. |
| 28(3)(f) | "assists the controller in ensuring compliance with the obligations pursuant to Articles 32 to 36 taking into account the nature of processing and the information available to the processor" | Assistance clause covering security (32), breach notification (33-34), DPIAs (35), prior consultation (36) - scoped by the two statutory limiters ("nature of processing", "information available"). |
| 28(3)(g) | "at the choice of the controller, deletes or returns all the personal data to the controller after the end of the provision of services relating to processing, and deletes existing copies unless Union or Member State law requires storage of the personal data" | Deletion-or-return clause (section 7.1). The controller's CHOICE must be preserved - a delete-only clause with no return/export option does not satisfy (g). |
| 28(3)(h) | "makes available to the controller all information necessary to demonstrate compliance with the obligations laid down in this Article and allow for and contribute to audits, including inspections, conducted by the controller or another auditor mandated by the controller" | Audit clause (section 7.2). Both limbs mandatory: information provision AND audits/inspections, including by a controller-mandated auditor. |
| 28(3) final subpara | "With regard to point (h) of the first subparagraph, the processor shall immediately inform the controller if, in its opinion, an instruction infringes this Regulation or other Union or Member State data protection provisions." | Add an infringing-instructions notice sentence; customary to pair it with a right to suspend the affected processing pending clarification. |

## 3. Sub-processors: Art 28(2) and 28(4)

Statute [Source: https://eur-lex.europa.eu/legal-content/EN/TXT/HTML/?uri=CELEX:02016R0679-20160504, accessed 2026-07-05]:

- Art 28(2): "The processor shall not engage another processor without prior specific or general written
  authorisation of the controller. In the case of general written authorisation, the processor shall inform
  the controller of any intended changes concerning the addition or replacement of other processors, thereby
  giving the controller the opportunity to object to such changes."
- Art 28(4): "the same data protection obligations as set out in the contract ... between the controller and
  the processor ... shall be imposed on that other processor by way of a contract", and "where that other
  processor fails to fulfil its data protection obligations, the initial processor shall remain fully liable
  to the controller for the performance of that other processor's obligations."

Authorization model fork (mirrored as the two options in Clause 7.7 of the Art 28 SCCs - Option 1 prior
specific authorisation vs Option 2 general written authorisation of an agreed list with advance written
notice of changes and time to object
[Source: https://eur-lex.europa.eu/legal-content/EN/TXT/HTML/?uri=CELEX:32021D0915, accessed 2026-07-05]):

| Model | When to use | Clause mechanics |
|---|---|---|
| **General written authorisation** (SaaS standard) | Multi-tenant SaaS - per-customer approval of each vendor is unworkable | (1) Controller authorizes the sub-processors on a named list up front; (2) list is public (URL in the DPA) with name, function, processing location; (3) advance notice of additions/replacements via a subscribable mechanism; (4) objection right within the notice window on reasonable data-protection grounds; (5) if unresolved, controller may terminate the affected services - the pragmatic standard remedy, since the statute requires only the "opportunity to object". |
| **Specific authorisation** | Bespoke/enterprise or high-sensitivity deals | Each sub-processor engaged only after prior written approval of that specific vendor. Rare in self-serve SaaS. |

Standard public-list drafting pattern: the DPA names the sub-processor page URL and incorporates it as the
authorized list; the drafting agent derives the entries from the codebase/infrastructure investigation -
never invent entries. The Commission's Art 28 SCCs leave the notice period blank for the parties to fix
("at least [TIME PERIOD] in advance", Clause 7.7 Option 2)
[Source: https://eur-lex.europa.eu/legal-content/EN/TXT/HTML/?uri=CELEX:32021D0915, accessed 2026-07-05];
14-30 days is market convention, not a statutory number - the drafter picks a period the business can honor.

Flow-down clause: every sub-processor must be bound by written terms imposing "the same data protection
obligations" as the DPA (Art 28(4)), and the provider remains fully liable for its sub-processors'
performance. Do not water "same obligations" down to "materially similar" without flagging it to the user.

## 4. The Art 28 SCCs - Implementing Decision (EU) 2021/915

Commission Implementing Decision (EU) 2021/915 of 4 June 2021 adopted standard contractual clauses between
controllers and processors under Art 28(7) GDPR and Art 29(7) of Regulation (EU) 2018/1725. Use is
voluntary: parties "may choose to negotiate an individual contract ... or to use ... standard contractual
clauses adopted by the Commission". Clause map: 1 purpose and scope; 2 invariability of the Clauses
(parties may not modify them, only complete/update the annexes and select options); 3 interpretation;
4 hierarchy; 5 optional docking clause; 6 description of processing(s); 7 obligations of the parties -
7.1 documented instructions (with the infringing-instruction notice), 7.4 security per the TOMs annex,
7.6 documentation and compliance including audits "at reasonable intervals or if there are indications of
non-compliance" (may include on-site inspections; results available to the supervisory authority on
request), 7.7 sub-processors (two options, section 3); 8 assistance to the controller; 9 notification of
personal data breach ("without undue delay", with the nature of the breach, affected categories and
approximate numbers, likely consequences, and measures taken or proposed); 10 non-compliance and
termination, including end-of-services deletion or return with certification of deletion (Clause 10(d)).
Annexes: I list of parties; II description of the processing; III technical and organisational measures;
IV list of sub-processors.
[Source: https://eur-lex.europa.eu/legal-content/EN/TXT/HTML/?uri=CELEX:32021D0915, accessed 2026-07-05]

Adopt-verbatim vs bespoke fork:
- **Verbatim 2021/915**: Commission-blessed content and zero negotiation surface, but the invariability
  clause blocks softening audit terms or embedding liability caps in the clauses - commercial terms must sit
  in the main agreement. Only the annexes and marked options are fillable.
- **Bespoke DPA** (the dominant SaaS pattern): free to integrate commercial terms (liability caps, audit
  logistics, fee-bearing assistance) - lawful because the Art 28 contract may be based "in whole or in part"
  on standard contractual clauses (Art 28(6))
  [Source: https://eur-lex.europa.eu/legal-content/EN/TXT/HTML/?uri=CELEX:02016R0679-20160504, accessed 2026-07-05] -
  but the drafter must independently satisfy every Art 28(3)(a)-(h) element. Use the clause map above as the
  completeness checklist; a bespoke DPA gets no presumption of compliance.

## 5. Distinguish: the transfer SCCs - Implementing Decision (EU) 2021/914

A different instrument for a different problem. Implementing Decision (EU) 2021/914 of 4 June 2021 adopted
SCCs providing appropriate safeguards for transfers to third countries, i.e. to an importer "whose
processing of the data is not subject to that Regulation" - the Art 46(2)(c) GDPR mechanism ("standard data
protection clauses adopted by the Commission") available "in the absence of a decision pursuant to
Article 45(3)" (adequacy).
[Source: https://eur-lex.europa.eu/legal-content/EN/TXT/HTML/?uri=CELEX:32021D0914, accessed 2026-07-05]
[Source: https://eur-lex.europa.eu/legal-content/EN/TXT/HTML/?uri=CELEX:02016R0679-20160504, accessed 2026-07-05]

| Feature | Content |
|---|---|
| Modules | Module One controller-to-controller (C2C); Module Two controller-to-processor (C2P); Module Three processor-to-processor (P2P); Module Four processor-to-controller (P2C). A SaaS processor exporting to a third-country sub-processor signs **Module Three**; its controller-customer exporting directly to a third-country provider signs **Module Two**. |
| Art 28 dual function | Per Article 1(2) and Recital 9, Modules Two and Three "also allow to fulfil the requirements of Article 28(3) and (4)" - no separate Art 28 contract is needed for a leg governed by them. |
| Docking clause | Clause 7 (optional): "An entity that is not a Party to these Clauses may, with the agreement of the Parties, accede to these Clauses at any time, either as a data exporter or as a data importer, by completing the Appendix and signing Annex I.A." |
| Annexes | Annex I.A parties; I.B description of transfer; I.C competent supervisory authority; Annex II TOMs; Annex III sub-processor list (Modules Two/Three). |
| Old SCCs | Decisions 2001/497/EC and 2010/87/EU repealed effective 27 September 2021; existing contracts had to transition by 27 December 2022. Any DPA still referencing the old SCCs is defective. |

[Source: https://eur-lex.europa.eu/legal-content/EN/TXT/HTML/?uri=CELEX:32021D0914, accessed 2026-07-05]
[Source: https://commission.europa.eu/law/law-topic/data-protection/international-dimension-data-protection/new-standard-contractual-clauses-questions-and-answers-overview_en, accessed 2026-07-05]

**When is a transfer addendum needed at all?** Decision fork for the drafter:

1. **All processing and sub-processors in the EEA (or adequacy countries)** - no transfer SCCs; the DPA
   states processing locations and that any transfer outside requires a valid Chapter V mechanism.
2. **US recipients certified under the EU-US Data Privacy Framework** - covered by the Commission's adequacy
   decision adopted 10 July 2023; certified US companies may receive EU personal data without additional
   safeguards
   [Source: https://commission.europa.eu/law/law-topic/data-protection/international-dimension-data-protection/eu-us-data-transfers_en, accessed 2026-07-05].
   Status: the General Court dismissed the Latombe annulment action on 3 September 2025; an appeal is
   pending before the CJEU (Case C-703/25 P) as of mid-2026
   [Source: https://iapp.org/news/a/european-general-court-dismisses-latombe-challenge-upholds-eu-us-data-privacy-framework, accessed 2026-07-05].
   Drafting duty: verify each named US vendor's certification on the official DPF list, re-verify DPF
   validity at drafting time, and include an SCC fallback clause (SCCs spring into effect if the adequacy
   decision is invalidated).
3. **Other third-country sub-processors without adequacy** - 2021/914 Module Three between provider and
   sub-processor plus a transfer risk assessment; the DPA discloses this and the public sub-processor list
   shows locations.
4. **Importer already directly subject to GDPR (Art 3(2))** - the 2021/914 SCCs cannot be used: the
   Commission Q&A answers "No" because they "would duplicate and, in part, deviate from the obligations that
   already follow directly from the GDPR"; the Commission "is in the process of developing an additional set
   of SCCs" for this scenario - not confirmed adopted as of 2026-07-05, re-verify before drafting
   [Source: https://commission.europa.eu/law/law-topic/data-protection/international-dimension-data-protection/new-standard-contractual-clauses-questions-and-answers-overview_en, accessed 2026-07-05].

## 6. Annex drafting

### Annex I - description of processing (satisfies the Art 28(3) chapeau; maps to 2021/915 Annex II and 2021/914 Annex I.B)

Fill every field concretely FROM THE CODEBASE INVESTIGATION, never from boilerplate:

| Field | Convention |
|---|---|
| Subject matter | The service itself, named ("provision of the ... platform") |
| Duration | Term of the main agreement plus the post-termination deletion window |
| Nature and purpose | The concrete operations tied to product features (hosting, storage, transmission, transcription, scheduling, analysis...) |
| Types of personal data | Enumerated from the actual data models (name, phone, email, recordings, ...); if no Art 9 special categories are processed, say so and prohibit their submission |
| Categories of data subjects | E.g. the controller's customers, end users, employees, callers |

Vague descriptions ("various business data") fail the Art 28(3) chapeau specification duty.

### Annex II - TOMs aligned to Art 32

Art 32(1): "the controller and the processor shall implement appropriate technical and organisational
measures to ensure a level of security appropriate to the risk, including inter alia as appropriate:
(a) the pseudonymisation and encryption of personal data; (b) the ability to ensure the ongoing
confidentiality, integrity, availability and resilience of processing systems and services; (c) the ability
to restore the availability and access to personal data in a timely manner in the event of a physical or
technical incident; (d) a process for regularly testing, assessing and evaluating the effectiveness of
technical and organisational measures for ensuring the security of the processing."
[Source: https://eur-lex.europa.eu/legal-content/EN/TXT/HTML/?uri=CELEX:02016R0679-20160504, accessed 2026-07-05]

Honest-TOMs rule (binding on the drafting agent): list ONLY measures actually in place, derived from the
codebase and infrastructure (encryption in transit/at rest as actually configured, access-control model,
tenant isolation, logging, backups, deletion procedures, hosting-provider attestations that actually
exist). The TOMs annex is a contractual representation - an aspirational entry ("annual penetration tests",
"ISO 27001 certified" when untrue) is a breach-in-waiting and evidence of Art 32 non-compliance. Structure
entries under the four Art 32(1) heads plus organisational measures; where a conventional measure is
absent, omit it and surface the gap to the operator, never silently include it.

## 7. Exit, audit, breach, liability

### 7.1 Deletion or return at end of services (Art 28(3)(g))

The clause must: give the controller the choice (return/export in machine-readable form and/or delete, then
delete existing copies); carve out retention required by Union/Member State law (quote-track the statute);
set a concrete deletion window (30-90 days is market convention, not statute) that covers backups on their
rotation cycle (disclose the cycle); offer written certification of deletion, mirroring 2021/915 Clause
10(d) [Source: https://eur-lex.europa.eu/legal-content/EN/TXT/HTML/?uri=CELEX:32021D0915, accessed 2026-07-05].

### 7.2 Audit and inspection (Art 28(3)(h))

Both limbs are mandatory (quote in section 2) - a "reports only, no inspections" clause is non-compliant.
Standard audit-burden compromises, defensible because (h) fixes the right, not its logistics, and
consistent with 2021/915 Clause 7.6 ("at reasonable intervals or if there are indications of
non-compliance", on-site inspections "where appropriate ... with reasonable notice")
[Source: https://eur-lex.europa.eu/legal-content/EN/TXT/HTML/?uri=CELEX:32021D0915, accessed 2026-07-05]:
- Tier 1: compliance information, questionnaires, and existing third-party audit reports/certifications
  (SOC 2, ISO 27001 - only if they actually exist) satisfy routine audits.
- Tier 2: on-site/remote inspection where Tier 1 is insufficient or after a breach/indication of
  non-compliance - reasonable prior written notice (30 days customary), at most once per year absent cause,
  business hours, confidentiality, no access to other tenants' data, each party bears its own costs.
- Controller-mandated third-party auditors are permitted (the statute says so) but may be required to be
  independent and not a competitor. Audit rights must never be made illusory through prohibitive fees.

### 7.3 Personal data breach notification

Statutory baseline
[Source: https://eur-lex.europa.eu/legal-content/EN/TXT/HTML/?uri=CELEX:02016R0679-20160504, accessed 2026-07-05]:
- Art 33(2): "The processor shall notify the controller without undue delay after becoming aware of a
  personal data breach." No fixed hour-count for processors in the statute.
- Art 33(1) (context - the controller's duty the DPA supports): the controller notifies the supervisory
  authority "without undue delay and, where feasible, not later than 72 hours after having become aware of
  it", unless the breach is "unlikely to result in a risk to the rights and freedoms of natural persons".

Drafting: restate Art 33(2) as the floor; if a numeric window is wanted, 24-72 hours after awareness is
market convention (a contractual choice, not a statutory processor deadline) - controllers push for speed
because of their own 72-hour clock; never promise a window the incident process cannot meet. Include the
Art 33(3)-shaped content list (nature of the breach, categories and approximate numbers of data subjects
and records, likely consequences, measures taken or proposed), phased notification where facts are
incomplete, and cooperation with the controller's Art 33-34 duties - mirroring 2021/915 Clause 9
[Source: https://eur-lex.europa.eu/legal-content/EN/TXT/HTML/?uri=CELEX:32021D0915, accessed 2026-07-05].

### 7.4 Liability allocation

Statutory backdrop the DPA cannot contract away against data subjects (Art 82): "Any person who has
suffered material or non-material damage as a result of an infringement of this Regulation shall have the
right to receive compensation from the controller or processor"; a processor is liable "only where it has
not complied with obligations of this Regulation specifically directed to processors or where it has acted
outside or contrary to lawful instructions of the controller" (Art 82(2)); co-responsible parties are each
"liable for the entire damage" toward the data subject (Art 82(4)), with inter-party recourse for "that
part of the compensation corresponding to their part of responsibility" (Art 82(5)).
[Source: https://eur-lex.europa.eu/legal-content/EN/TXT/HTML/?uri=CELEX:02016R0679-20160504, accessed 2026-07-05]

Drafting norms (market convention, freely negotiable between the parties only): tie DPA liability to the
main agreement's cap, commonly with an elevated super-cap or carve-out for data-protection breaches; a
mutual indemnity following the Art 82(2) fault line (each party bears what its own non-compliance caused)
is the clean allocation; the processor remains fully liable for its sub-processors (Art 28(4), section 3).
Flag any clause purporting to limit data subjects' own Art 82 claims as ineffective - those rights are
statutory. Under verbatim 2021/915 the invariability clause blocks caps inside the clauses themselves - put
commercial liability terms in the main agreement.

## 8. UK addendum

For restricted transfers under UK GDPR the ICO has issued two standard data protection clauses: the
**International Data Transfer Agreement (IDTA)** (standalone) and the **International Data Transfer
Addendum to the EU Commission SCCs (UK Addendum)**. "The EU SCCs are not valid on their own for restricted
transfers under the UK GDPR. However, using the Addendum lets you rely on the EU SCCs for your restricted
transfers under the UK GDPR." A transfer risk assessment (TRA) is also required. Both instruments were
laid before Parliament under s119A of the Data Protection Act 2018 on 2 February 2022.
[Source: https://ico.org.uk/for-organisations/uk-gdpr-guidance-and-resources/international-transfers/appropriate-safeguards/what-are-standard-data-protection-clauses-the-uk-idta-and-the-addendum/, accessed 2026-07-05]
They came into force on 21 March 2022; legacy EU SCCs could not be used for new UK contracts after
21 September 2022 and existing contracts had to transition by 21 March 2024 (secondary corroboration:
[Source: https://www.activemind.uk/guides/idta/, accessed 2026-07-05]).

Drafting duty: where the DPA's transfer annex uses the 2021/914 EU SCCs and UK-origin data is in scope,
attach the UK Addendum (the standard SaaS route for mixed EEA+UK customer bases) rather than a parallel
IDTA. The ICO signals the IDTA/Addendum may be updated to reflect the Data (Use and Access) Act - check the
ICO page for the current template version before finalizing.
[Source: https://ico.org.uk/for-organisations/uk-gdpr-guidance-and-resources/international-transfers/appropriate-safeguards/what-are-standard-data-protection-clauses-the-uk-idta-and-the-addendum/, accessed 2026-07-05]

## 9. Swiss addendum

On 27 August 2021 the Swiss FDPIC recognized the EU transfer SCCs (2021/914) as a valid basis for transfers
from Switzerland to countries without adequate protection, provided necessary adaptations are made for
Swiss law: designate the competent Swiss supervisory authority (the FDPIC), adapt governing law and place
of jurisdiction, and ensure references to EU member states do not prevent data subjects in Switzerland from
enforcing their rights at their place of habitual residence. Legacy instruments could not be newly agreed
after 27 September 2021 (transition ended 31 December 2022).
[Source: https://www.edoeb.admin.ch/en/27082021-the-transfer-of-personal-data-to-a-country-with-an-inadequate-level-of-data-protection-based-on-recognised-standard-contractual-clauses-and-model-contracts, accessed 2026-07-05]

Drafting duty: where Swiss-origin data is in scope, add a short Swiss Addendum applying those adaptations
to the EU SCCs (the standard SaaS pattern is one combined UK + Swiss addendum section). For US recipients,
Switzerland's adequacy recognition of the Swiss-US Data Privacy Framework entered into force on
15 September 2024 - Swiss data may flow to Swiss-US-DPF-certified companies without further safeguards.
[Source: https://www.commerce.gov/news/press-releases/2024/09/secretary-raimondo-statement-swiss-us-data-privacy-framework, accessed 2026-07-05]

## 10. Drafter's final checklist

1. Every Art 28(3)(a)-(h) element present, plus the infringing-instructions sentence and all six chapeau
   items (section 2).
2. No controller-purpose processing hidden inside the DPA (Art 28(10), section 1).
3. Sub-processor model chosen; public list URL + notice period + objection remedy + flow-down + full
   liability stated (section 3).
4. Verbatim 2021/915 vs bespoke decision made and recorded (section 4).
5. Transfer analysis done per destination: adequacy (incl. live DPF status) / correct 2021/914 module /
   Art 3(2) gap / UK Addendum / Swiss adaptations, with a DPF fallback clause and no old-SCC references
   (sections 5, 8, 9).
6. Annexes populated from the codebase investigation only; TOMs honest; unknowns escalated to the operator
   (section 6).
7. Deletion window, audit tiers, and breach window all deliverable by the actual organization; every
   market-convention number labeled as a contractual choice, never presented as statutory (section 7).
8. Output marked as a draft for lawyer review, not legal advice.

## UNRESOLVED

- Commission's additional SCC set for data importers directly subject to GDPR (Art 3(2)): announced as "in
  the process of developing" in the Commission Q&A; not confirmed adopted as of 2026-07-05 - re-verify on
  the Commission SCC pages before drafting a transfer annex for that scenario.
- EU-US DPF: CJEU appeal in Latombe (Case C-703/25 P) pending as of mid-2026 with no hearing date found -
  re-verify DPF validity before every DPA issuance.
- Post-Data (Use and Access) Act 2025 revisions to the ICO IDTA/UK Addendum: RESOLVED 2026-07-09. DUAA 2025
  Part 5 (data-protection provisions) came into force **5 February 2026** (SI 2026/82), moving the exporter's
  transfer test from "essentially equivalent" to "not materially lower"; transfer agreements entered into
  before 5 February 2026 are preserved by transitional provisions. The ICO states the current IDTA and
  Addendum remain valid and should continue to be used, with updates expected during 2026 [Sources:
  legislation.gov.uk DUAA 2025 c.18 Part 5 + SI 2026/82; ICO international-transfers guidance. Confidence
  medium on the ICO template-currency statement (ico.org.uk blocks automated retrieval) — re-check the ICO
  page for the current template version at drafting time].
- UK extension to the EU-US DPF ("UK-US Data Bridge") was not verified in this pass - verify live before
  relying on it for UK-to-US transfers.
- UK in-force and legacy-transition dates (21 March 2022; 21 September 2022; 21 March 2024) confirmed from
  a reputable secondary source only (activemind.uk), because ico.org.uk blocked automated retrieval of the
  underlying documents; the s119A laying date of 2 February 2022 is confirmed from the ICO itself.
- Detailed FDPIC list of Swiss adaptations sits in an FDPIC PDF not parsed during this research; the
  adaptation summary in section 9 reflects the FDPIC web page only.
- Numeric conventions (sub-processor notice 14-30 days, breach window 24-72 hours, deletion window 30-90
  days) have no authoritative source by nature - they are labeled inline as market convention and must be
  set with the operator.

## Sources

- https://eur-lex.europa.eu/legal-content/EN/TXT/HTML/?uri=CELEX:02016R0679-20160504 (GDPR consolidated text: Arts 28, 32, 33, 46, 82)
- https://eur-lex.europa.eu/legal-content/EN/TXT/HTML/?uri=CELEX:32021D0915 (Implementing Decision (EU) 2021/915 - Art 28 SCCs; local PDF: assets/sources/scc-art28-2021-915.pdf)
- https://eur-lex.europa.eu/legal-content/EN/TXT/HTML/?uri=CELEX:32021D0914 (Implementing Decision (EU) 2021/914 - transfer SCCs; local PDF: assets/sources/scc-transfers-2021-914.pdf)
- https://commission.europa.eu/law/law-topic/data-protection/international-dimension-data-protection/new-standard-contractual-clauses-questions-and-answers-overview_en (Commission SCC Q&A)
- https://commission.europa.eu/law/law-topic/data-protection/international-dimension-data-protection/eu-us-data-transfers_en (EU-US DPF adequacy)
- https://iapp.org/news/a/european-general-court-dismisses-latombe-challenge-upholds-eu-us-data-privacy-framework (Latombe judgment and pending appeal - secondary corroboration)
- https://ico.org.uk/for-organisations/uk-gdpr-guidance-and-resources/international-transfers/appropriate-safeguards/what-are-standard-data-protection-clauses-the-uk-idta-and-the-addendum/ (ICO: IDTA and UK Addendum)
- https://www.activemind.uk/guides/idta/ (UK in-force and transition dates - secondary corroboration)
- https://www.edoeb.admin.ch/en/27082021-the-transfer-of-personal-data-to-a-country-with-an-inadequate-level-of-data-protection-based-on-recognised-standard-contractual-clauses-and-model-contracts (FDPIC recognition of EU SCCs with Swiss adaptations)
- https://www.commerce.gov/news/press-releases/2024/09/secretary-raimondo-statement-swiss-us-data-privacy-framework (Swiss-US DPF effective date)

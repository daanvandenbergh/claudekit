# EU AI Act Transparency Duties for Conversational and Voice AI (Article 50)

> Verified: 2026-07-09 against live sources (Art 50 duties/dates re-confirmed verbatim against the
> bundled OJ PDF; the high-risk phase-in dates are SUPERSEDED by the adopted AI Digital Omnibus — see §3).
> Re-verify if older than 12 months.
> Provenance: authored for policy-writer from live web research; all citations inline.

Instructional reference for drafting AI-transparency disclosures for businesses that ship AI
systems interacting with people - chatbots, voice agents that answer or place phone calls, and
AI that generates follow-up texts. Grounded in Regulation (EU) 2024/1689 (the "AI Act"),
Official Journal L, 12.7.2024, ELI: http://data.europa.eu/eli/reg/2024/1689/oj. All article
quotes below were verified verbatim against the official OJ PDF
[Source: https://eur-lex.europa.eu/legal-content/EN/TXT/PDF/?uri=OJ:L_202401689, accessed 2026-07-05]
(local copy: `assets/sources/eu-ai-act-2024-1689.pdf`; HTML version:
[Source: https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32024R1689, accessed 2026-07-05]).

## 1. The instrument

- Regulation (EU) 2024/1689, published OJ L, 12.7.2024. Entered into force on the twentieth day
  following publication (Article 113, first sentence), i.e. 1 August 2024 - corroborated by
  Article 97(2), which counts a delegation period "from 1 August 2024"
  [Source: https://eur-lex.europa.eu/legal-content/EN/TXT/PDF/?uri=OJ:L_202401689, accessed 2026-07-05].
- Article 50 sits in Chapter IV, "Transparency obligations for providers and deployers of
  certain AI systems". These duties apply regardless of risk class - they are additional to,
  not instead of, the high-risk regime (Article 50(6)).
- Drafter note: the open-source exemption does NOT rescue Article 50 systems. Article 2(12)
  excludes free and open-source AI systems from the Regulation "unless they are placed on the
  market or put into service as high-risk AI systems or as an AI system that falls under
  Article 5 or 50"
  [Source: https://eur-lex.europa.eu/legal-content/EN/TXT/PDF/?uri=OJ:L_202401689, accessed 2026-07-05].

## 2. Article 50 - the duties, verbatim anchors, and what the drafter must do

All quotes verified against the OJ PDF, pages 82-83
[Source: https://eur-lex.europa.eu/legal-content/EN/TXT/PDF/?uri=OJ:L_202401689, accessed 2026-07-05].

| Para | Who | Duty (anchored to exact text) | Drafter action |
|------|-----|-------------------------------|----------------|
| 50(1) | Provider | AI systems "intended to interact directly with natural persons" must be "designed and developed in such a way that the natural persons concerned are informed that they are interacting with an AI system, unless this is obvious from the point of view of a natural person who is reasonably well-informed, observant and circumspect, taking into account the circumstances and the context of use". Law-enforcement carve-out exists. | The product must disclose AI-ness by design. The policy/disclosure page must state that users are informed they interact with AI and where/how (see section 8). Do not rely on the "obvious" exception for phone calls - a caller cannot see an interface, so AI-ness is not obvious. |
| 50(2) | Provider | Providers of AI systems "including general-purpose AI systems, generating synthetic audio, image, video or text content, shall ensure that the outputs of the AI system are marked in a machine-readable format and detectable as artificially generated or manipulated", with solutions "effective, interoperable, robust and reliable as far as this is technically feasible, taking into account the specificities and limitations of various types of content, the costs of implementation and the generally acknowledged state of the art". Exception: systems performing "an assistive function for standard editing" or that "do not substantially alter the input data provided by the deployer or the semantics thereof". | If the product generates synthetic audio (a cloned/synthetic voice) or text (AI-written SMS/emails), the provider must implement machine-readable marking so far as technically feasible, and the disclosure page should describe the marking approach honestly (including feasibility limits for plain-text SMS). |
| 50(3) | Deployer | "Deployers of an emotion recognition system or a biometric categorisation system shall inform the natural persons exposed thereto of the operation of the system" and process personal data per GDPR / Regulation 2018/1725 / Directive 2016/680. | Decision fork: if the voice product runs sentiment/emotion analysis on callers, the deployer must inform exposed persons - and Annex III 1(c) makes emotion recognition HIGH-RISK (see section 6). If no emotion recognition, say nothing; do not import this clause needlessly. |
| 50(4) sub 1 | Deployer | Deployers of an AI system that "generates or manipulates image, audio or video content constituting a deep fake, shall disclose that the content has been artificially generated or manipulated". Attenuated regime for evidently artistic/creative/satirical works. | Rarely relevant to service bots; include only if the product produces realistic depictions of real people/events. |
| 50(4) sub 2 | Deployer | Deployers of AI that "generates or manipulates text which is published with the purpose of informing the public on matters of public interest shall disclose that the text has been artificially generated or manipulated", unless human review plus editorial responsibility applies. | Customer follow-up texts (booking confirmations, review requests) are NOT "informing the public on matters of public interest" - this sub-duty normally does not apply to them. Flag it only for AI-written public content (e.g. AI-authored blog/news). |
| 50(5) | Both | Information under 50(1)-(4) must be "provided to the natural persons concerned in a clear and distinguishable manner at the latest at the time of the first interaction or exposure" and "shall conform to the applicable accessibility requirements". | Disclosure must be up-front (first interaction), clear, distinguishable, accessible. Burying it in terms or a privacy policy alone does NOT satisfy 50(5) (confirmed by the Commission's draft guidelines - see section 7). |
| 50(6) | Both | Paragraphs 1-4 "shall not affect the requirements and obligations set out in Chapter III" and are "without prejudice to other transparency obligations laid down in Union or national law". | Art 50 disclosure never replaces GDPR notices, consumer law, or national call-recording rules. Cross-reference, never merge-and-delete. |
| 50(7) | AI Office / Commission | The AI Office "shall encourage and facilitate the drawing up of codes of practice at Union level" for detection/labelling of AI-generated content; the Commission may approve them by implementing act or impose common rules. | Explains the Code of Practice in section 7; cite it as the compliance vehicle for 50(2)/(4). |

## 3. When Article 50 applies (Article 113, verified verbatim)

Article 113: the Regulation "shall apply from 2 August 2026", with staged exceptions
[Source: https://eur-lex.europa.eu/legal-content/EN/TXT/PDF/?uri=OJ:L_202401689, accessed 2026-07-05]:

| Date | What applies | Relevance |
|------|--------------|-----------|
| 1 Aug 2024 | Entry into force (20 days after OJ publication of 12.7.2024) | Clock starts. |
| 2 Feb 2025 | "Chapters I and II" - i.e. Article 4 AI literacy + Article 5 prohibitions | Already in force: staff AI-literacy measures and the ban on manipulative/exploitative AI (Article 5(1)(a)-(b)) apply NOW to providers and deployers. |
| 2 Aug 2025 | Chapter III Section 4, Chapter V (GPAI), Chapter VII, Chapter XII (penalties) and Article 78, except Article 101 | GPAI-model duties and the penalties chapter already apply. |
| 2 Aug 2026 | Everything else, including Chapter IV = ARTICLE 50 | Art 50 transparency duties become enforceable 2 August 2026. |
| ~~2 Aug 2027~~ **SUPERSEDED** | Article 6(1) high-risk classification (Annex I products) and corresponding obligations | Date moved by the AI Digital Omnibus — see note below. Not relevant to a standalone software voice agent either way. |

> **SUPERSEDED — high-risk phase-in dates moved (recorded 2026-07-09).** The original Regulation
> (EU) 2024/1689, Art 113(c), set Annex I embedded high-risk (Art 6(1)) to apply from **2 August
> 2027** (verbatim in the bundled OJ PDF, still the citation of record for the original text). The
> **AI Digital Omnibus** amending Art 113 — Commission proposal COM(2025) 836 final (CELEX
> 52025PC0836), adopted by the European Parliament on **16 June 2026** and given final Council green
> light on **29 June 2026** — reschedules high-risk application to: **Annex III stand-alone high-risk
> → 2 December 2027**, and **Annex I embedded high-risk (Art 6(1)) → 2 August 2028**
> (support-measure-conditional backstops). As of 2026-07-09 the amending Regulation is **adopted but
> not yet published in the OJ** (entry into force on the third day after publication) — re-verify the
> OJ text for the exact numbering before citing. **Article 50 transparency (2 Aug 2026, above) is NOT
> changed by the Omnibus.** [Sources: Council press release 29 Jun 2026, consilium.europa.eu; EP
> plenary vote 16 Jun 2026, europarl.europa.eu; COM(2025) 836 final. Verified 2026-07-09.]

Article 4 (verbatim): providers and deployers "shall take measures to ensure, to their best
extent, a sufficient level of AI literacy of their staff and other persons dealing with the
operation and use of AI systems on their behalf"
[Source: https://eur-lex.europa.eu/legal-content/EN/TXT/PDF/?uri=OJ:L_202401689, accessed 2026-07-05].
Drafter action: an internal AI-use or staff-training statement can evidence this; it is a duty
on the business, not a public-policy clause.

## 4. Provider vs deployer for a SaaS conversational-AI product

Definitions (Article 3, verified verbatim)
[Source: https://eur-lex.europa.eu/legal-content/EN/TXT/PDF/?uri=OJ:L_202401689, accessed 2026-07-05]:
- Article 3(3) "provider": develops an AI system (or has it developed) "and places it on the
  market or puts the AI system into service under its own name or trademark, whether for
  payment or free of charge".
- Article 3(4) "deployer": "a natural or legal person ... using an AI system under its
  authority except where the AI system is used in the course of a personal non-professional
  activity".

Allocation for the common SaaS pattern (vendor builds a voice/chat agent; business customers
deploy it toward THEIR end customers):

| Actor | AI Act role | Art 50 duties |
|-------|-------------|---------------|
| SaaS vendor selling the agent under its own name | Provider | 50(1) design-level disclosure; 50(2) machine-readable marking of synthetic audio/text outputs. |
| Business customer using the agent on its phone line / site | Deployer | 50(3) if emotion recognition is enabled; 50(4) if deepfakes/public-interest text; plus, practically, ensuring the provider's built-in disclosure is not disabled or undermined. |
| Vendor that also runs the agent for its own sales line | Provider AND deployer | Both columns. |

What the provider should contractually pass through to deployers (drafting duties for the
vendor's terms/DPA and deployer-facing documentation):
- An obligation not to disable, suppress or misrepresent the built-in AI disclosure
  (protects the provider's 50(1) compliance and the deployer's own exposure under 99(4)(e)/(g)).
- Documentation of the marking technique used for synthetic outputs (50(2)) so deployers can
  meet their own labelling duties and preserve marks downstream - the Commission's draft
  guidelines note that platforms transmitting third-party content should preserve upstream
  marks/labels [Source: https://www.globalpolicywatch.com/2026/05/10-takeaways-european-commission-draft-guidelines-on-ai-transparency-under-the-eu-ai-act/, accessed 2026-07-05].
- A feature flag + written warning where emotion/sentiment analysis exists: enabling it
  triggers deployer duties under 50(3) and the high-risk regime via Annex III 1(c).
- A statement of which party is provider and which is deployer, in plain terms.
- An AI-literacy note (Article 4 applies to deployers too).

## 5. Penalties for Article 50 breaches (Article 99, verified verbatim)

[Source: https://eur-lex.europa.eu/legal-content/EN/TXT/PDF/?uri=OJ:L_202401689, accessed 2026-07-05]

| Provision breached | Fine ceiling |
|--------------------|-------------|
| Article 5 prohibited practices (Art 99(3)) | Up to EUR 35 000 000 or 7 % of total worldwide annual turnover, whichever is HIGHER |
| "transparency obligations for providers and deployers pursuant to Article 50" (Art 99(4)(g)); also provider duties under Art 16 (99(4)(a)) and deployer duties under Art 26 (99(4)(e)) | Up to EUR 15 000 000 or 3 % of total worldwide annual turnover, whichever is HIGHER |
| Supplying incorrect, incomplete or misleading information to authorities (Art 99(5)) | Up to EUR 7 500 000 or 1 % of total worldwide annual turnover, whichever is HIGHER |
| SMEs including start-ups (Art 99(6)) | Each fine capped at the percentage or amount above, "whichever thereof is LOWER" |

Member States lay down the actual penalty rules and may add warnings and non-monetary measures
(Art 99(1)); enforcement is national. Do not state a single "the fine is X" - state the ceiling
and that national authorities decide per Art 99(7) factors.

## 6. Risk-classification sanity check (Annex III, verified against the OJ text)

A customer-service chatbot or appointment-booking voice agent is NOT, as such, listed in
Annex III (high-risk AI systems referred to in Article 6(2)). Annex III covers: biometrics;
critical infrastructure; education; employment; access to essential private/public services;
law enforcement; migration; justice/democratic processes
[Source: https://eur-lex.europa.eu/legal-content/EN/TXT/PDF/?uri=OJ:L_202401689, accessed 2026-07-05].
The drafter MUST still run this check per product; the traps for conversational AI:

| Annex III point | Trap for a voice/chat agent |
|-----------------|------------------------------|
| 1(c) emotion recognition | Sentiment/emotion analysis of callers makes the system high-risk AND triggers Art 50(3) deployer disclosure. |
| 4 employment | Using the agent to screen/interview job candidates is high-risk. |
| 5(b) creditworthiness | Any credit-scoring of natural persons is high-risk. |
| 5(d) emergency calls | Systems "intended to evaluate and classify emergency calls by natural persons or to be used to dispatch, or to establish priority in the dispatching of, emergency first response services, including by police, firefighters and medical aid" are high-risk. Commercial "emergency" tradesperson callouts are not emergency first response services, but flag any product routing 112-type calls. |
| Article 5 (prohibitions, in force since 2 Feb 2025) | The agent must not use "purposefully manipulative or deceptive techniques" materially distorting behaviour causing significant harm (Art 5(1)(a)) - relevant to undisclosed persuasive bots. |

If a check lands in Annex III, the policy work changes category entirely (Chapter III duties:
risk management, logging, human oversight, conformity assessment, registration) - escalate,
do not just draft a disclosure.

## 7. Commission guidance, codes of practice, standards - status as of 2026-07-05

- Article 96(1)(d) obliges the Commission to develop guidelines on "the practical
  implementation of transparency obligations laid down in Article 50"
  [Source: https://eur-lex.europa.eu/legal-content/EN/TXT/PDF/?uri=OJ:L_202401689, accessed 2026-07-05].
- DRAFT Commission Guidelines on Article 50 published 8 May 2026; targeted stakeholder
  consultation ran to 3 June 2026; final guidelines NOT yet adopted as of 2026-07-05
  [Source: https://digital-strategy.ec.europa.eu/en/library/draft-guidelines-implementation-transparency-obligations-certain-ai-systems-under-article-50-ai-act, accessed 2026-07-05].
- Code of Practice on marking and labelling of AI-generated content (the Art 50(7) vehicle):
  final version published 10 June 2026 after the closing plenary; as of the accessed date it is
  "currently undergoing an adequacy assessment by the Commission and the AI Board". Adherence
  is voluntary; signatories can rely on its measures to demonstrate compliance with the
  labelling/detection rules; non-signatories must demonstrate adequacy to market surveillance
  authorities themselves. It has two sections: provider marking/detection duties and deployer
  labelling of deepfakes/manipulated material, and the EU created a set of icons deployers may
  use [Source: https://digital-strategy.ec.europa.eu/en/policies/code-practice-ai-generated-content, accessed 2026-07-05].
- Substance of the draft guidelines relevant to drafting (corroborating law-firm analysis):
  chatbots in online helpdesks are an example REQUIRING disclosure; the "obvious" test uses an
  average-consumer benchmark considering vulnerable groups and digital literacy; disclosures
  buried in terms/conditions or layered menus do not comply with 50(5); format may be written,
  standardised icons, oral, or combinations; no single marking technique currently satisfies
  50(2) alone, so providers should combine techniques
  [Source: https://www.globalpolicywatch.com/2026/05/10-takeaways-european-commission-draft-guidelines-on-ai-transparency-under-the-eu-ai-act/, accessed 2026-07-05].
- Harmonised standards: no Article 50-specific harmonised standard (Art 40) was identified in
  live research as of 2026-07-05; the Code of Practice is currently the operative compliance
  vehicle for 50(2)/(4). Treat the standards landscape as UNVERIFIED/evolving and re-check.

## 8. Practical disclosure patterns the drafter can adapt

State each pattern in the business's AI-transparency disclosure AND ensure the product
actually behaves this way (the policy must describe reality, not aspiration):

| Surface | Pattern satisfying 50(1)+50(5) |
|---------|--------------------------------|
| Outbound/inbound voice agent | Spoken announcement in the opening utterance of every call, before substantive conversation: the assistant identifies itself as an AI/virtual assistant acting for the named business. First interaction, oral, clear - matches 50(5) timing and the draft guidelines' acceptance of oral format. |
| Chatbot / web widget | Persistent visible label on the chat surface (e.g. "AI assistant") plus an AI statement in the first message. A one-time interstitial that disappears is weaker than a persistent label; never rely on terms-page text alone (non-compliant per the draft guidelines). |
| AI-generated follow-up texts (SMS/email confirmations, review requests) | 50(2) machine-readable marking applies to the provider "as far as this is technically feasible, taking into account the specificities and limitations of various types of content" - plain SMS has no metadata channel, so document the feasibility limit and add a human-readable line (e.g. "Sent by [business]'s AI assistant") as good practice; email supports headers/footers. 50(4) sub 2 (public-interest text) does not normally apply to private customer messages. |
| Escalation to humans | State clearly when/how a caller is transferred to a human, and that the human side is not AI - it keeps the disclosure honest and distinguishable. |

Intersection with other notices (do not duplicate - cross-reference):
- GDPR Article 13 requires the controller's identity, purposes and related information at the
  time personal data are collected from the data subject, in clear and plain language
  [Source: https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32016R0679, accessed 2026-07-05].
  A voice agent collecting caller details therefore stacks THREE first-contact notices: the
  Art 50(1) AI disclosure, the GDPR-required privacy notice (short oral layer + link/reference
  to the full policy), and - where calls are recorded - the recording notice. Keep the opening
  announcement short by layering: disclose AI + recording orally, point to the privacy policy
  for the rest.
- Call-recording consent/notice rules per Member State: see `references/call-recording-consent-eu.md`
  (do not restate them here).
- Art 50(6): the AI disclosure never substitutes for those notices.

## 9. Drafting checklist for an AI-transparency disclosure

1. Name the AI systems in scope (voice agent, chatbot, text generation) and their operator
   roles (provider/deployer per section 4).
2. State the disclosure mechanics per surface (section 8) - verified against the actual product.
3. State the synthetic-content marking approach and its technical-feasibility limits (50(2)).
4. Emotion recognition: include the 50(3) notice ONLY if the feature exists; if it exists,
   escalate to the high-risk track (section 6).
5. Cross-reference the privacy policy (GDPR Arts 13/14) and call-recording notices.
6. Date the disclosure and note Art 50 applies from 2 August 2026.
7. For a SaaS provider: mirror the pass-through duties (section 4) in customer terms/DPA.

## UNRESOLVED

- Final (adopted) Commission Guidelines on Article 50 did not exist as of 2026-07-05; only the
  8 May 2026 draft (consultation closed 3 June 2026). Re-check before relying on draft positions.
- The 10 June 2026 Code of Practice on marking/labelling of AI-generated content was still
  undergoing the Commission/AI Board adequacy assessment as of 2026-07-05; its formal approval
  status must be re-verified.
- No Article 50-specific harmonised standard was identified as of 2026-07-05; UNVERIFIED whether
  CEN/CENELEC deliverables covering Art 50 marking/detection have since been cited in the OJEU.
- National penalty implementations (Art 99(1)-(2) leaves rules to Member States) are not covered
  here; per-country enforcement specifics need country research when relevant.

## Sources

- https://eur-lex.europa.eu/legal-content/EN/TXT/PDF/?uri=OJ:L_202401689 (Regulation (EU) 2024/1689, official OJ PDF; local copy assets/sources/eu-ai-act-2024-1689.pdf)
- https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32024R1689 (Regulation (EU) 2024/1689, EUR-Lex HTML)
- https://digital-strategy.ec.europa.eu/en/library/draft-guidelines-implementation-transparency-obligations-certain-ai-systems-under-article-50-ai-act (Commission draft Article 50 guidelines, 8 May 2026)
- https://digital-strategy.ec.europa.eu/en/policies/code-practice-ai-generated-content (Code of Practice on marking and labelling of AI-generated content)
- https://www.globalpolicywatch.com/2026/05/10-takeaways-european-commission-draft-guidelines-on-ai-transparency-under-the-eu-ai-act/ (Covington analysis of the draft guidelines - corroboration only)
- https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32016R0679 (GDPR, EUR-Lex)

# Digital Services Act — Terms, Contact-Point, Advertising, Recommender, Minors and Marketplace Duties (Regulation (EU) 2022/2065)

> Verified: 2026-07-09 against the official OJ text (EUR-Lex CELEX 32022R2065) and the European
> Commission's DSA pages. Re-verify if older than 12 months.
> Provenance: authored for policy-writer 2026-07-09 from primary sources — Regulation (EU) 2022/2065,
> OJ L 277, 27.10.2022, p. 1; ELI http://data.europa.eu/eli/reg/2022/2065/oj — plus EC DSA pages; all
> citations inline. Article headings 11-17, 24-28, 30-31 and Arts 33(1), 52(3), 74(1) verified verbatim.
> Read when: a product hosts user content / runs a feed or recommender / shows ads / lets third parties
> sell to consumers, and the ToS, ad UI, contact/imprint block or marketplace onboarding may owe DSA
> duties. Pair with `terms-of-service-standards.md` (Art 14 T&C content, Art 27 recommenders) and
> `imprint-requirements-eu.md` (Arts 11-13 contact points + non-EU legal representative).

Scope note: This pack covers only the DSA obligations that a privacy/terms/imprint run must SURFACE in
published text or a scope warning. It is project-agnostic. The DSA is not data-protection law - do not
merge its duties into the GDPR/ePrivacy analysis; they stack on top.

## 1. The instrument and why a policy run needs it

The DSA is a horizontal EU Regulation - directly applicable, no transposition, one text across all 27
Member States. It regulates "intermediary services" (services that transmit or store third-party
information), NOT the data-protection layer. If the product hosts ANY user-supplied content (comments,
reviews, profiles, uploads, listings, messages shown to others), runs a feed/recommender, shows ads, or
lets third parties sell to consumers, the DSA almost certainly bites and its duties land in the Terms &
Conditions, the ad UI, the contact/imprint block, and (for marketplaces) the seller-onboarding flow.

- **Entry into force:** 16 November 2022 (twentieth day after publication in OJ L 277 of 27.10.2022;
  confirmed by Commission press release IP/22/6906). Confidence: high.
- **General application:** from **17 February 2024** for all in-scope providers (Article 93). Very large
  online platforms/search engines (VLOPs/VLOSEs) were bound earlier - four months after their individual
  Commission designation (first designations 25 April 2023). Confidence: high (Art 93 application date
  corroborated across multiple europa.eu pages; the exact Art 93 sentence was not machine-quotable on this
  pass - flagged in UNRESOLVED).

## 2. Scope triage - decide the tier BEFORE drafting (Article 3 definitions, Chapter III structure)

Obligations are cumulative by tier. Work out which rung the product is on:

1. **Intermediary service** (mere conduit / caching / hosting) - Art 3 definitions. Owes the Section 1
   baseline: Arts 11, 12, 13, 14, 15.
2. **Hosting service** (stores information provided by, and at the request of, a recipient) - adds Arts
   16, 17. A SaaS that stores any user content the user can retrieve/share is a hosting service.
3. **Online platform** (a hosting service that, at a recipient's request, stores AND disseminates
   information to the public) - adds the Section 3 duties: Arts 20-28 (notably 24 transparency reports,
   25 dark patterns, 26 ad transparency, 27 recommenders, 28 minors). A comment section, public profiles,
   a review wall, a social feed, or a public marketplace = online platform.
4. **Marketplace** (online platform allowing consumers to conclude distance contracts with traders) -
   adds Arts 30-32 (trader traceability / KYBC, compliance by design, right to information).
5. **VLOP/VLOSE** - an online platform/search engine with **more than 45 million average monthly active
   recipients in the Union** (Art 33(1) - i.e. reaching or exceeding **10 % of the Union population**),
   once designated by the Commission. Adds Chapter III Section 5 systemic-risk duties. Rare for a typical
   SaaS; flag, do not draft.

Small-scale carve-out: providers that qualify as **micro or small enterprises** (Commission Recommendation
2003/361/EC) are exempt from the additional online-platform obligations of Section 3, unless they are
designated VLOPs (Art 19). They still owe the Section 1 baseline and (if hosting) Arts 16-17. Verify the
exact Article 19 wording at draft time (flagged in UNRESOLVED).

## 3. What each duty forces into the published text

Article headings below are verbatim from the OJ text (verified 2026-07-09). The "drafter action" is the
obligation, stated conservatively.

- **Art 11 "Point of contact for authorities"** - a single electronic point of contact for Member-State
  authorities / Commission / Board. Drafter action: publish a contact channel; may reuse the imprint block.
- **Art 12 "Point of contact for recipients of the service"** - a point of contact allowing users to
  communicate directly and rapidly, by electronic means and in a user-friendly manner. Drafter action: a
  monitored user-facing contact (not only a no-reply); state it in ToS/help.
- **Art 13 "Legal representative"** - providers not established in the EU that offer services in the EU
  must designate, in writing, a legal/natural person as legal representative in a Member State where they
  offer services. Drafter action: name the EU legal representative. NOTE this stacks with, and is distinct
  from, the imprint/Impressum and GDPR Art 27 representative - three different appointments; do not
  conflate. (Cross-ref the imprint pack.)
- **Art 14 "Terms and conditions"** - the ToS must include information on any restrictions imposed on the
  use of the service in respect of user content, including on content-moderation policies, procedures,
  measures and tools (incl. algorithmic decision-making and human review) and the internal
  complaint-handling system; drafted in clear, plain, intelligible, user-friendly and unambiguous
  language and publicly available. Providers acting on restrictions must do so diligently, objectively and
  proportionately. Services primarily directed at, or predominantly used by, minors must explain
  conditions and restrictions in a way minors can understand (verify Art 14(3) pinpoint). Drafter action:
  this is the single most load-bearing DSA clause for a ToS run.
- **Art 15 "Transparency reporting obligations for providers of intermediary services"** - publish, at
  least annually, a machine-readable content-moderation report. Drafter action: flag as an operational
  duty; ToS may point to where the report lives.
- **Art 16 "Notice and action mechanisms"** (hosting) - a mechanism for anyone to notify allegedly illegal
  content. Drafter action: describe the notice mechanism in ToS/help.
- **Art 17 "Statement of reasons"** (hosting) - give affected users a clear, specific statement of reasons
  for any restriction (removal, disabling, demotion, account suspension) with redress info. Drafter action:
  reference the statement-of-reasons and complaint routes in ToS.
- **Art 24 "Transparency reporting obligations for providers of online platforms"** - extra reporting
  (disputes, suspensions, average monthly active recipients published at least every 6 months - Art 24(2)).
  Drafter action: operational/flag.
- **Art 25 "Online interface design and organisation"** - the dark-patterns prohibition: must not
  design/organise/operate interfaces in a way that deceives, manipulates, or materially distorts/impairs
  recipients' ability to make free and informed decisions. Drafter action: constrain consent/cancellation/
  UI design; note it interacts with the cookie-consent UI in the ePrivacy/CNIL packs.
- **Art 26 "Advertising on online platforms"** - each ad must be clearly identifiable as an ad, in real
  time, disclosing on whose behalf it is shown, who paid, and the main parameters used to determine the
  recipient (with a way to change them). No advertising based on profiling using special-category data
  (verify Art 26(3) pinpoint). Drafter action: ad-disclosure UI + privacy-policy targeting disclosure.
- **Art 27 "Recommender systems"** - set out in the ToS, in plain language, the main parameters of any
  recommender system and any options to modify/influence them. Drafter action: a dedicated ToS/privacy
  clause on ranking/feed logic.
- **Art 28 "Online protection of minors"** - platforms accessible to minors must put in place appropriate,
  proportionate measures for a high level of privacy, safety and security of minors; no ads based on
  profiling using minors' personal data (verify Art 28(2) pinpoint). Drafter action: minors clause;
  cross-ref the children's-products sector pack and GDPR Art 8 age of consent.
- **Art 30 "Traceability of traders"** (marketplaces) - "Know Your Business Customer": obtain and verify
  trader identity data (name, address, contact, ID/registration, payment account, self-certification)
  before allowing the trader to sell. Drafter action: seller-onboarding requirement + display of trader
  identity to consumers.
- **Art 31 "Compliance by design and by default"** (marketplaces) - design the interface so traders can
  meet pre-contractual/product-safety info duties.

## 4. Penalties (verified verbatim)

- **Art 52(3)** - Member States set penalties; the maximum fine for an infringement of an obligation under
  the Regulation is **"up to 6 % of the annual worldwide turnover of the provider"** of the intermediary
  service concerned. Maximum fine for supplying incorrect/incomplete/misleading information, failure to
  reply/rectify, or failure to submit to inspection: up to 1 % of annual income/worldwide turnover
  (Art 52(4) - verify pinpoint). Confidence: high.
- **Art 74(1)** - for VLOPs/VLOSEs the Commission may impose fines **"up to 6 % of the total worldwide
  annual turnover"** of the provider in the preceding financial year. Periodic penalty payments up to 5 %
  of average daily worldwide turnover (Art 76 - verify pinpoint). Confidence: high.

## 5. Drafter checklist

1. Does the product host any third-party/user content shown to others, run a feed/recommender, show ads,
   or host consumer-to-trader sales? If no on all - DSA likely not engaged; note it and stop.
2. Fix the tier (hosting / online platform / marketplace / VLOP) using Section 2 above.
3. Confirm micro/small-enterprise status (Art 19) - if it holds and no VLOP designation, drop the
   Section-3 platform duties but keep Arts 11-17.
4. ToS must carry: Art 14 content-moderation/restrictions clause in plain language; Art 27
   recommender-parameters clause; pointers to Art 16 notice and Art 17 statement-of-reasons/complaint routes.
5. Contact/imprint block must carry: Art 12 user point of contact, Art 11 authority point of contact, and
   (non-EU providers) the Art 13 legal representative - kept distinct from the GDPR Art 27 rep and the
   Impressum.
6. Ad UI + privacy policy: Art 26 ad-identification and targeting-parameter disclosure; Art 25 no dark
   patterns.
7. If minors can access: Art 28 minors clause; no minor-profiling ads.
8. If a marketplace: Art 30 trader-verification (KYBC) in seller onboarding; Art 31 compliance-by-design.
9. Flag VLOP/systemic-risk duties (Arts 33-43) as out of scope for drafting - route to counsel if designated.

## UNRESOLVED (verify pinpoint sub-articles against the OJ text at draft time)

- Exact Art 93 sentence ("It shall apply from 17 February 2024") - date corroborated across europa.eu but
  the verbatim sentence was not machine-quotable this pass. Confidence: high on the date, medium on the
  verbatim wording.
- Art 14(3) minors-language duty; Art 19 micro/small-enterprise exemption scope; Art 26(3)
  special-category-ad ban; Art 28(2) minor-profiling-ad ban; Art 52(4)/Art 76 secondary penalty figures -
  each described from the Regulation's structure; confirm the exact paragraph number and wording before
  publishing citations.
- Enforcement/designation state (which services are designated VLOPs/VLOSEs) is a fast-mover - re-check the
  Commission's VLOP list at run time. Confidence: low on any specific designation.

## Sources

- Regulation (EU) 2022/2065 (Digital Services Act), OJ L 277, 27.10.2022 - EUR-Lex CELEX 32022R2065, ELI
  http://data.europa.eu/eli/reg/2022/2065/oj (accessed 2026-07-09). Article headings 11-17, 24-28, 30-31
  verified verbatim; Arts 33(1), 52(3), 74(1) verified verbatim.
- European Commission, "Digital Services Act package" -
  https://digital-strategy.ec.europa.eu/en/policies/digital-services-act-package (accessed 2026-07-09).
- European Commission, "DSA: Very large online platforms and search engines" -
  https://digital-strategy.ec.europa.eu/en/policies/dsa-vlops (accessed 2026-07-09).
- European Commission press release IP/22/6906, "DSA: landmark rules for online platforms enter into
  force" - https://ec.europa.eu/commission/presscorner/detail/en/ip_22_6906 (accessed 2026-07-09).

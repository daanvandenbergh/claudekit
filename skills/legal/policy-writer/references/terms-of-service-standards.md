# Terms of Service Standards for SaaS (EU-focused, with US divergences)

> Verified: 2026-07-09 against live sources (CRD Recital 17 dual-purpose test confirmed verbatim; CA AB 2863 citation upgraded to the primary Cal. leginfo text; EU consumer-law backbone re-derived, all unchanged). Re-verify if older than 12 months.
> Provenance: authored for policy-writer from live web research; all citations inline.

Instructional reference for drafting Terms of Service (ToS) for a SaaS business. States each rule,
its source, and what the drafter must therefore do. Everything here is drafting guidance for a
lawyer-reviewed document, not legal advice. Never invent numbers (uptime, caps, fees, notice
periods): every business-decision figure goes in as a `[PLACEHOLDER]` flagged for the operator.

## 1. Essential clause set for SaaS ToS

Every SaaS ToS needs the clauses below. "Must do" is the clause's job; "pitfalls" are the known
drafting failures.

| Clause | What it must do | Known pitfalls |
|---|---|---|
| Acceptance / formation | State how the contract forms (clicking "I agree" at signup, signing an order form) and who may accept (authority to bind a company). | Browsewrap (terms only linked in a footer) is routinely unenforceable in the US; courts require reasonably conspicuous notice plus an affirmative act of assent - use clickwrap [Source: https://www.goodwinlaw.com/en/insights/publications/2022/08/08_10-recent-court-decisions-shed-light, accessed 2026-07-05]. In the EU B2C, the order button itself must be labelled with words like "order with obligation to pay" (CRD Art 8(2)) [Source: https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:02011L0083-20220528, accessed 2026-07-05]. |
| Account terms | Eligibility (age, business use), credential security, responsibility for activity under the account, accuracy of registration data. | Silence on who owns an account created by an employee for an employer; no suspension right for credential compromise. |
| Subscription license + restrictions | Grant a limited, non-exclusive, non-transferable, revocable right to access the service for the term; prohibit resale, sublicensing, scraping, reverse engineering, benchmarking-for-competitors. | Granting "a license to the software" when SaaS is access, not a copy; forgetting seat/usage limits as license conditions (so overuse is breach, not just a billing issue). |
| Acceptable use | Prohibit illegal content, abuse, security circumvention, spam, infringing use; reserve suspension for violations. | Suspension "at any time for any reason" is a UCTD greylist problem in B2C (Annex 1(f)-(g)) - tie suspension to defined triggers and notice [Source: https://eur-lex.europa.eu/legal-content/EN/TXT/HTML/?uri=CELEX:31993L0013, accessed 2026-07-05]. |
| Customer data ownership + license-back | Customer owns its data; the provider takes only the license needed to operate, secure, and improve the service; state what happens to data at termination (export window, deletion). | Overbroad license-back ("perpetual, irrevocable, for any purpose") destroys enterprise deals and collides with GDPR processor role; missing post-termination export/deletion terms. Data-protection detail belongs in the DPA, not the ToS - the ToS should incorporate the DPA by reference. |
| IP | Provider keeps the service, software, marks; customer keeps its data and content; feedback license (provider may use suggestions without obligation). | Vague "all IP belongs to provider" that accidentally sweeps in customer data or AI outputs. |
| Fees, billing, trials, renewals | Price, billing cycle, taxes (see MoR section), late payment, trial-to-paid conversion mechanics, renewal mechanics, refund/credit policy. | Auto-renewal traps: UCTD Annex 1(h) greylists auto-extension where the deadline for the consumer to object is unreasonably early [Source: https://eur-lex.europa.eu/legal-content/EN/TXT/HTML/?uri=CELEX:31993L0013, accessed 2026-07-05]. US: California's amended Automatic Renewal Law (AB 2863, Chapter 515, Statutes of 2024; amends Bus. & Prof. Code §§17601/17602; effective 2025-07-01) requires separate consent to the auto-renewal terms themselves and easy cancellation [Source (primary): Cal. leginfo AB-2863 (2023-2024), https://leginfo.legislature.ca.gov/faces/billNavClient.xhtml?bill_id=202320240AB2863, accessed 2026-07-09]. The FTC's federal "Click-to-Cancel" (Negative Option) Rule was vacated by the Eighth Circuit on 2025-07-08 on procedural grounds, but ROSCA and state laws still apply - do not cite the FTC rule as in force [Source: https://www.mayerbrown.com/en/insights/publications/2025/07/click-to-cancelled-eighth-circuit-vacates-federal-trade-commissions-revised-negative-option-rule, accessed 2026-07-05; local copy: assets/sources/custom-communications-v-ftc-8th-cir-2025-243137P.pdf]. |
| Term, termination, effect | Initial term, renewal term, termination for convenience (with notice) and for cause (with cure period), what survives, data export window, no refund vs pro-rata refund policy. | One-sided termination (provider may terminate at will, customer may not) is UCTD Annex 1(f)/(g) territory in B2C; terminating an indefinite B2C contract without reasonable notice is greylisted (Annex 1(g)) [Source: https://eur-lex.europa.eu/legal-content/EN/TXT/HTML/?uri=CELEX:31993L0013, accessed 2026-07-05]. |
| Warranties + disclaimers | Limited warranty (service performs materially per documentation) plus disclaimer of implied warranties. | US: a merchantability disclaimer must mention merchantability and be conspicuous; fitness-for-purpose exclusion must be in conspicuous writing; "AS IS" works only where it plainly signals no implied warranty (UCC 2-316) - hence the ALL-CAPS convention [Source: https://www.law.cornell.edu/ucc/2/2-316, accessed 2026-07-05]. EU B2C: you cannot disclaim the Digital Content Directive's objective conformity requirements; deviations bind the consumer only if specifically accepted, and consumers cannot waive the directive's protections (DCD Arts 7-8, 22) [Source: https://eur-lex.europa.eu/eli/dir/2019/770/oj/eng, accessed 2026-07-05]. |
| Limitation of liability + caps | Exclude indirect/consequential damages; cap direct damages (commonly fees paid in the prior 12 months - a business decision, use `[LIABILITY_CAP]`); carve-outs for what cannot be limited. | Excluding liability for death/personal injury is blacklist-grade in the EU (UCTD Annex 1(a)) and unenforceable in Germany even B2B; German AGB control (BGB 305-310) applies the fairness test of s.307 to B2B standard terms, and courts void broad B2B liability exclusions (intent, gross negligence, cardinal duties) [Source: https://www.reuschlaw.de/en/news/exclusion-of-german-laws-on-general-terms-and-conditions/, accessed 2026-07-05]. Always include a "nothing limits what cannot lawfully be limited" savings clause. |
| Indemnities | Provider indemnifies for third-party IP claims about the service; customer indemnifies for its data/use violations. Standard procedure: notice, control of defense, cooperation. | Consumer indemnities are aggressive and likely unfair under UCTD Art 3 (significant imbalance) - drop or heavily narrow them in B2C [Source: https://eur-lex.europa.eu/legal-content/EN/TXT/HTML/?uri=CELEX:31993L0013, accessed 2026-07-05]. |
| Modification of terms | See section 6. | Unilateral change "at any time, effective immediately, continued use = consent" is UCTD Annex 1(j) greylisted in B2C [Source: https://eur-lex.europa.eu/legal-content/EN/TXT/HTML/?uri=CELEX:31993L0013, accessed 2026-07-05]. |
| Assignment | Customer may not assign without consent; provider may assign on merger/asset sale. | UCTD Annex 1(p) greylists transferring the provider's obligations where it may reduce the consumer's guarantees, without consumer agreement [Source: https://eur-lex.europa.eu/legal-content/EN/TXT/HTML/?uri=CELEX:31993L0013, accessed 2026-07-05]. |
| Governing law + dispute resolution | Choose a law and forum; B2B arbitration is fine if wanted. | B2C: a choice of law cannot deprive an EU consumer of the mandatory protections of their country of habitual residence when the business directs activities there (Rome I Art 6) - add wording preserving mandatory local consumer rights [Source: https://www.legislation.gov.uk/eur/2008/593/article/6, accessed 2026-07-05]. Forcing consumers into arbitration not covered by legal provisions is UCTD Annex 1(q) [Source: https://eur-lex.europa.eu/legal-content/EN/TXT/HTML/?uri=CELEX:31993L0013, accessed 2026-07-05]. Do NOT include the once-mandatory link to the EU ODR platform: Regulation (EU) 2024/3228 discontinued it (complaints ended 2025-03-20; Regulation 524/2013 repealed with effect from 2025-07-20), so the Art 14 link duty is gone - flag stale ODR links for removal [Source: https://eur-lex.europa.eu/eli/reg/2024/3228/oj/eng, accessed 2026-07-05]. |
| Severability | Invalid term is severed; rest survives. | In EU B2C an unfair term is simply "not binding on the consumer" and courts will not rewrite it down to the maximum lawful level (no blue-pencil rescue), so do not rely on severability to save over-reaching terms (UCTD Art 6) [Source: https://eur-lex.europa.eu/legal-content/EN/TXT/HTML/?uri=CELEX:31993L0013, accessed 2026-07-05]. |

## 2. The B2B vs B2C fork

First decision of any ToS draft: who is the counterparty? A "consumer" is any natural person
acting outside their trade, business or profession (UCTD Art 2(b)) [Source: https://eur-lex.europa.eu/legal-content/EN/TXT/HTML/?uri=CELEX:31993L0013, accessed 2026-07-05].

### Regimes that attach to B2C

| Regime | What it does to the ToS |
|---|---|
| Unfair Contract Terms Directive 93/13/EEC | Non-negotiated terms causing a significant imbalance contrary to good faith are not binding (Art 3, Art 6); terms must be in plain, intelligible language and ambiguity is read against the drafter (Art 5); the Annex greylists 17 term types - see the list below [Source: https://eur-lex.europa.eu/legal-content/EN/TXT/HTML/?uri=CELEX:31993L0013, accessed 2026-07-05]. |
| Consumer Rights Directive 2011/83/EU (consolidated, post-Omnibus) | Pre-contract information duties (Art 6: identity, total price incl. taxes, duration/termination conditions, digital functionality/compatibility, withdrawal conditions + model form per Art 6(1)(h)); 14-day withdrawal right (Art 9); "order with obligation to pay" button (Art 8(2)); Member States may impose language requirements on the contractual information (Art 6(7)) [Source: https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:02011L0083-20220528, accessed 2026-07-05]. |
| Omnibus Directive 2019/2161 | Adds penalties (for widespread infringements, fines whose maximum amount must be at least 4% of the trader's annual turnover in the Member State(s) concerned, amending both UCTD and CRD); extends the CRD to "free" contracts where the consumer provides personal data instead of a price (CRD Art 3(1a)); adds personalised-pricing disclosure (Art 6(1)(ea)); applicable since 2022-05-28 [Source: https://eur-lex.europa.eu/eli/dir/2019/2161/oj/eng, accessed 2026-07-05]. |
| Digital Content Directive 2019/770 | Conformity duties (subjective + objective, Arts 7-8), an updates duty (Art 8(2) security/conformity updates), remedies hierarchy (bring into conformity, price reduction, termination - Art 14), liability throughout the supply period for continuous services (Art 11), strict conditions on modifying the service (Art 19, see section 6), and no contracting out to the consumer's detriment (Art 22). Also applies where the consumer "pays" with personal data (Art 3) [Source: https://eur-lex.europa.eu/eli/dir/2019/770/oj/eng, accessed 2026-07-05]. |

### The UCTD Annex greylist (terms that "may be regarded as unfair")

Indicative, non-exhaustive; a listed term is not automatically void, but drafting into the list
invites challenge. Items 1(a)-(q): (a) excluding liability for death/personal injury; (b) limiting
consumer remedies for non-performance; (c) one-sided binding conditions; (d) keeping consumer
prepayments on cancellation without reciprocity; (e) disproportionate penalty sums; (f) seller-only
dissolution rights; (g) terminating open-ended contracts without reasonable notice; (h) auto-renewal
with an unreasonably early objection deadline; (i) binding the consumer to terms they had no real
opportunity to read; (j) unilateral term changes without a valid contract-stated reason; (k)
unilateral change of product/service characteristics; (l) price determined or raisable at delivery
without a right to cancel; (m) seller as sole interpreter of conformity/terms; (n) limiting
liability for agents' commitments; (o) requiring consumer performance despite seller
non-performance; (p) assigning the contract so guarantees may be reduced, without consent; (q)
excluding legal remedies or forcing non-statutory arbitration [Source: https://eur-lex.europa.eu/legal-content/EN/TXT/HTML/?uri=CELEX:31993L0013, accessed 2026-07-05].

Note: the UCTD is minimum harmonisation - several Member States convert this greylist into harder
national black/grey lists (e.g. Germany's BGB ss.308-309). Itemizing each national list is out of
scope here; flag `[NATIONAL_UNFAIR_TERMS_CHECK]` for the operator's main markets.

### Withdrawal rights for SaaS (the part drafters get wrong)

- A SaaS subscription is a digital service supplied continuously - the 14-day withdrawal right
  (CRD Art 9) applies to consumers.
- For services, the right is lost only when the service has been "fully performed", and (for paid
  contracts) only if performance began with the consumer's prior express consent and
  acknowledgement of losing the right (Art 16(a)). An ongoing subscription is not "fully performed"
  in 14 days, so: if the consumer requests immediate start and then withdraws, they owe a
  proportionate amount for what was provided up to withdrawal (Art 14(3)) [Source: https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:02011L0083-20220528, accessed 2026-07-05].
- The stricter "lose the right immediately on starting" rule is for digital CONTENT not on a
  tangible medium (one-off downloads/streams), and only with express consent + acknowledgement +
  confirmation (Art 16(m), Art 14(4)(b)) [Source: https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:02011L0083-20220528, accessed 2026-07-05].
- Drafter must therefore: include a withdrawal-information block + model withdrawal form reference,
  a checkout consent for immediate performance, and a proportionate-charge clause. Never draft
  "all sales final" for EU consumers.

### When a nominally-B2B SaaS still catches consumer rules

- Self-serve signup with no verification: sole traders and individuals signing up personally are
  consumers if acting outside their trade (UCTD Art 2(b)). A "Business use only" recital helps but
  does not convert a factual consumer into a business - if consumers can realistically subscribe,
  draft the B2C protections in or gate signup.
- Dual-purpose contracts (partly private, partly trade) are treated as consumer contracts where the
  trade purpose is not predominant — confirmed against **CRD Recital 17**: a person "should also be
  considered as a consumer" where a contract is "concluded for purposes partly within and partly
  outside the person's trade and the trade purpose is so limited as not to be predominant in the
  overall context of the contract" [Source: Directive 2011/83/EU Recital 17, EUR-Lex CELEX:32011L0083,
  accessed 2026-07-09].
- Germany: AGB content control applies to B2B standard terms too - s.307 BGB fairness/transparency
  review reaches business contracts, courts read the B2C clause catalogs (ss.308-309) into B2B
  review as indicia, and broad liability exclusions in B2B standard terms are routinely void.
  Choosing foreign law purely to escape AGB control is unreliable if German courts have
  jurisdiction [Source: https://www.reuschlaw.de/en/news/exclusion-of-german-laws-on-general-terms-and-conditions/, accessed 2026-07-05].
- Rome I Art 6: if the business directs activity at a consumer's Member State, a foreign
  choice-of-law clause cannot strip that consumer's home mandatory protections [Source: https://www.legislation.gov.uk/eur/2008/593/article/6, accessed 2026-07-05].

US divergence: no general unfairness review of B2C standard terms comparable to the UCTD; the fight
is over formation (conspicuous notice + affirmative assent) [Source: https://www.goodwinlaw.com/en/insights/publications/2022/08/08_10-recent-court-decisions-shed-light, accessed 2026-07-05]
and over sector rules (auto-renewal statutes, above). US B2C terms commonly add binding arbitration
plus class-action waivers; their enforceability is US-specific and was not verified this pass -
treat as `[US_ARBITRATION_DECISION]` for counsel.

## 3. Merchant-of-record (MoR) billing and how the ToS must be worded

When a MoR platform sells the subscription, there are TWO contracts and the ToS must say so:

1. The purchase/payment contract: customer <-> MoR (the MoR is the legal seller for the
   transaction, collects payment, calculates/collects/remits sales tax/VAT/GST, handles refunds and
   disputes).
2. The service/license contract: customer <-> the business (right to use the SaaS, acceptable use,
   data, liability - everything else in this file).

Evidence for the split:

- Stripe Managed Payments: "The customer sees Link as the merchant of record, and sees purchases as
  Sold through Link." Stripe/Link handles tax in 80+ countries, refunds (may issue within 60 days;
  may refund without approval if the business misses a 48-hour escalation response), disputes
  (submits evidence itself), and transaction-level support; statements show `LINK.COM*` plus the
  business descriptor; the checkout shows standardized Link payment terms and can additionally link
  the business's own ToS and privacy policy [Source: https://docs.stripe.com/payments/managed-payments/how-it-works, accessed 2026-07-05].
- Paddle: "Paddle is an authorised reseller of Products for Suppliers, which means you purchase the
  Product from Paddle", while "the Product is made available to you by the Supplier under the terms
  of their Supplier Agreement"; Paddle's Refund Policy governs refunds and EU/EEA statutory
  withdrawal handling, and Paddle collects tax [Source: https://www.paddle.com/legal/checkout-buyer-terms, accessed 2026-07-05].

What the drafter must therefore do in the business's own ToS:

| Rule | Wording duty |
|---|---|
| No double-claiming of the sale | Do not write "we sell you the subscription and collect payment" when a MoR is the seller of the transaction. Say: purchases are processed by `[MOR_NAME]` as merchant of record/reseller, and the purchase is subject to `[MOR_TERMS_LINK]`. |
| Billing section points to MoR terms | Payment methods, receipts, statement descriptors, currency, and payment support are the MoR's; link the MoR's buyer terms and refund policy instead of restating them (they change without notice to you). |
| Taxes | State that applicable sales tax/VAT/GST is calculated, collected, and remitted by the MoR - do not promise tax handling the business no longer performs. |
| Refunds and withdrawal | Align the ToS refund language with the MoR's actual policy (e.g. Stripe may issue refunds within 60 days; Paddle's Refund Policy implements EU withdrawal). A stricter "no refunds" clause in the business ToS that the MoR will not honor is a misrepresentation. |
| Support split | Transaction-level support (payment, refund, subscription billing) goes to the MoR; product-level support stays with the business - state both channels. |
| Precedence | Add a conflict clause: for the purchase transaction, the MoR's terms prevail; for use of the service, the business's ToS prevails. |
| Provider-required text | Some MoRs require their buyer terms to be appended/referenced in the business's own terms or order forms (Paddle does for invoicing) - check the MoR's integration requirements [Source: https://www.paddle.com/legal/checkout-buyer-terms, accessed 2026-07-05]. |

Ordinary Stripe (non-MoR, business as merchant) is the opposite fork: the business IS the seller,
must own tax, refunds, and disputes in its ToS. Detect which fork the codebase actually uses before
drafting.

## 4. AI-service terms

For SaaS whose features include AI/LLM output, add an AI section. Market practice (verifiable
example - a major model provider's commercial terms):

- Output ownership: assign the provider's interest in outputs to the customer ("assigns to
  Customer its right, title and interest (if any) in and to Outputs").
- Accuracy disclaimer: outputs "should not be relied upon without independently checking their
  accuracy, as they may be false, incomplete, misleading"; service provided AS IS.
- Competition restriction: no use of the service/outputs "to build a competing product or
  service, including to train competing AI models".
- Training commitment: state whether customer content trains models ("may not train models on
  Customer Content from Services" is the B2B default expectation).
  [Source: https://www.anthropic.com/legal/commercial-terms, accessed 2026-07-05]

Drafting duties:

- Output disclaimer: outputs are probabilistic, may be inaccurate, are not professional (legal,
  medical, financial) advice, and require human review before reliance. For B2C, remember this
  disclaimer cannot override DCD objective conformity or be used to hollow out remedies (DCD
  Arts 8, 22) [Source: https://eur-lex.europa.eu/eli/dir/2019/770/oj/eng, accessed 2026-07-05].
- Usage restrictions: no attempts to extract training data or system prompts, no unlawful
  automated decision-making about individuals, no use of outputs to train competing models.
- Training-data/usage-rights clause is a decision fork for the operator: (a) no training on
  customer content (B2B default), or (b) training permitted with disclosure - if (b) and personal
  data is involved, the privacy policy and DPA must say so too; never let the ToS silently claim
  broader rights than the privacy documents disclose.
- Upstream flow-down: if the business builds on a model provider's API, mirror the upstream usage
  restrictions in its own ToS so customers cannot put the business in breach.
- AI-transparency hook: Regulation (EU) 2024/1689 (the AI Act) imposes transparency duties for AI
  systems that interact with natural persons and for synthetic content [Source: https://eur-lex.europa.eu/eli/reg/2024/1689/oj/eng, accessed 2026-07-05].
  Do not restate it in the ToS; add a short "AI disclosure" cross-reference and rely on the
  dedicated AI-transparency reference file for the substantive duties.

## 5. SLA / availability clauses

Common enforceable structure (live example - a major cloud SLA):

- Uptime commitment as a monthly uptime percentage, possibly tiered (e.g. that provider commits
  99.99% region-level / 99.5% instance-level).
- Service credits scale with the miss (that provider: 10% credit below the commitment down to
  99.0%, 30% below 99.0%, 100% below 95.0%).
- Credits are "your sole and exclusive remedies ... for any unavailability".
- Exclusions: factors outside the provider's control, customer acts/omissions, customer
  equipment/software, legitimate suspension.
- Claim procedure: customer must claim within a window with logs/evidence.
  [Source: https://aws.amazon.com/compute/sla/, accessed 2026-07-05]

Drafting rules:

- NEVER invent uptime numbers, credit percentages, or claim windows - they are pure business
  decisions. Emit `[UPTIME_PCT]`, `[CREDIT_SCHEDULE]`, `[CLAIM_WINDOW_DAYS]` placeholders and flag
  them for the operator.
- If the business offers no SLA, say so expressly ("service provided without availability
  commitment") rather than staying silent - silence plus marketing uptime claims invites conformity
  arguments under DCD objective conformity for B2C (Art 8) [Source: https://eur-lex.europa.eu/eli/dir/2019/770/oj/eng, accessed 2026-07-05].
- "Sole and exclusive remedy" wording for credits is standard B2B; in B2C it must not exclude the
  statutory remedies hierarchy (DCD Art 14: conformity, price reduction, termination) [Source: https://eur-lex.europa.eu/eli/dir/2019/770/oj/eng, accessed 2026-07-05].
- Scheduled maintenance windows belong in the exclusions, with advance-notice wording.

## 6. Update / change-notification mechanics that are enforceable

Two different things change: (a) the TERMS, (b) the SERVICE. Draft both.

Changing the terms:

- EU B2C: "we may change these terms at any time, continued use = acceptance" maps straight onto
  UCTD Annex 1(i)-(j) (binding the consumer to terms they could not read; unilateral change without
  a valid reason specified in the contract) [Source: https://eur-lex.europa.eu/legal-content/EN/TXT/HTML/?uri=CELEX:31993L0013, accessed 2026-07-05].
  Draft instead: enumerated valid reasons for changes (legal compliance, new features, security,
  cost changes), advance notice on a durable medium (email) of `[TERMS_NOTICE_DAYS]`, and a free
  termination right before material changes take effect. Pure silence-as-consent for changes
  adverse to the consumer is high-risk; for material adverse changes prefer express re-acceptance.
- US: enforceability again turns on notice + assent - courts refuse to bind users to amended terms
  they had no reasonable notice of, so email notice plus a dated changelog is the defensible
  pattern [Source: https://www.goodwinlaw.com/en/insights/publications/2022/08/08_10-recent-court-decisions-shed-light, accessed 2026-07-05].
- Version hygiene (both markets): every version carries an effective date; prior versions stay
  archived and retrievable; the acceptance record (who accepted which version when) is retained.

Changing the service (B2C, continuously supplied digital service): DCD Art 19 allows modification
beyond what is needed to maintain conformity only if ALL of: the contract states a valid reason for
such modification, no additional cost to the consumer, clear and comprehensible information about
the modification, and - where the change adversely impacts access/use more than minorly - advance
notice on a durable medium plus a right to terminate free of charge within 30 days [Source: https://eur-lex.europa.eu/eli/dir/2019/770/oj/eng, accessed 2026-07-05].
Drafter must therefore put the "valid reasons for service changes" list INTO the ToS now; it cannot
be invoked later if the contract never stated it.

## Drafter's decision checklist

1. B2B only, B2C only, or mixed? If consumers can factually subscribe, include the B2C blocks
   (withdrawal, unfair-terms-safe drafting, DCD conformity/modification, no forced arbitration).
2. Who is the merchant of record? MoR fork (section 3) vs own-merchant fork.
3. AI features? Add section 4 clauses + AI-disclosure cross-reference.
4. SLA promised anywhere (site, sales deck)? Align section 5; placeholders for all numbers.
5. Terms/service change mechanics per section 6, with the valid-reasons list written in.
6. Remove stale boilerplate: EU ODR platform links (defunct since 2025-07-20) [Source: https://eur-lex.europa.eu/eli/reg/2024/3228/oj/eng, accessed 2026-07-05].
7. Every business decision (caps, fees, notice days, uptime) as a flagged `[PLACEHOLDER]`.

## UNRESOLVED

- CRD Recital 17 dual-purpose ("trade purpose not predominant") consumer test: RESOLVED 2026-07-09 —
  confirmed verbatim from Directive 2011/83/EU Recital 17 (see the B2C-scope bullet in §on consumer contracts above).
- Brussels I recast (Regulation 1215/2012) consumer jurisdiction rules (consumer may sue at home;
  business must sue consumer at the consumer's domicile) not verified this pass - verify before
  drafting a B2C exclusive-forum clause.
- US arbitration + class-action waiver enforceability (FAA line of cases) not verified this pass -
  flag as `[US_ARBITRATION_DECISION]` for counsel.
- AI Act Article 50: regulation confirmed live, but the article-level text was not retrieved here -
  the AI-transparency reference file owns that verification.
- National unfair-terms black/grey lists (e.g. exact contents of Germany's BGB ss.308-309, French
  clauses noires/grises) not itemized from primary text - per-market check required.
- Which Stripe/Link legal entity is merchant of record per customer region: not stated in the
  consulted docs page - confirm in Stripe's Managed Payments legal terms if the draft must name it.

## Sources

- https://eur-lex.europa.eu/legal-content/EN/TXT/HTML/?uri=CELEX:31993L0013
- https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:02011L0083-20220528
- https://eur-lex.europa.eu/eli/dir/2019/770/oj/eng
- https://eur-lex.europa.eu/eli/dir/2019/2161/oj/eng
- https://eur-lex.europa.eu/eli/reg/2024/3228/oj/eng
- https://eur-lex.europa.eu/eli/reg/2024/1689/oj/eng
- https://www.legislation.gov.uk/eur/2008/593/article/6
- https://docs.stripe.com/payments/managed-payments/how-it-works
- https://www.paddle.com/legal/checkout-buyer-terms
- https://www.law.cornell.edu/ucc/2/2-316
- https://aws.amazon.com/compute/sla/
- https://www.anthropic.com/legal/commercial-terms
- https://www.goodwinlaw.com/en/insights/publications/2022/08/08_10-recent-court-decisions-shed-light
- https://www.reuschlaw.de/en/news/exclusion-of-german-laws-on-general-terms-and-conditions/
- https://www.mayerbrown.com/en/insights/publications/2025/07/click-to-cancelled-eighth-circuit-vacates-federal-trade-commissions-revised-negative-option-rule
- https://www.cooley.com/news/insight/2025/2025-06-04-california-automatic-renewal-law-amendments-take-effect-on-july-1-2025

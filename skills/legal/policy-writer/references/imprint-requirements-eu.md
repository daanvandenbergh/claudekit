# Imprint / Impressum / Legal Notice: Provider-Identification Duties in Europe

> Verified: 2026-07-09 against live sources (France LCEN Art 6→1-1/1-2 SREN renumbering, FR EUR 375,000 legal-person multiplier, and NL 3:15f sanction route re-derived from Légifrance/wetten.overheid.nl; German/EU set unchanged). Re-verify if older than 12 months.
> Provenance: authored for policy-writer from live web research; all citations inline.

This file tells a policy-drafting agent when a business needs an imprint (also called
Impressum, legal notice, mentions legales, aviso legal, colofon), exactly which fields each
jurisdiction requires, where the page must sit, and what to ask the user. Every field of an
imprint is business-registry data - none of it can be discovered in a codebase, so this is
an ask-the-user document from start to finish.

---

## 1. The common EU root: e-Commerce Directive 2000/31/EC, Art 5

Article 5 of Directive 2000/31/EC obliges every "information society service" provider to
render the following "easily, directly and permanently accessible" to recipients and
authorities [Source: https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32000L0031, accessed 2026-07-05]:

| # | Art 5(1) item | Required when |
|---|---------------|---------------|
| a | Name of the service provider | Always |
| b | Geographic address of establishment | Always |
| c | Contact details "including his electronic mail address" allowing rapid, direct, effective contact | Always |
| d | Trade register (or similar) + registration number | If registered |
| e | Particulars of the relevant supervisory authority | If the activity needs an authorisation |
| f | Professional body, professional title + member state that granted it, reference to the applicable professional rules and how to access them | Regulated professions |
| g | VAT identification number | If the activity is subject to VAT |

Art 5(2): where the service refers to prices, they must be indicated clearly and
unambiguously, stating whether tax and delivery costs are included
[Source: https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32000L0031, accessed 2026-07-05].

Two more articles matter for the analysis below (same source):
- **Art 3 (country of origin):** a provider established in a member state follows that
  state's rules within the "coordinated field", and other member states "may not, for
  reasons falling within the coordinated field, restrict the freedom to provide
  information society services from another Member State".
- **Art 20:** member states set their own sanctions, which must be "effective,
  proportionate and dissuasive" - so penalties differ per country (see tables below).

Drafter consequence: every EU/EEA member state has a national statute implementing Art 5.
The Art 5 field list is the minimum everywhere; Germany, Austria and France add more.

---

## 2. Germany in depth (the strictest regime in practice)

### 2.1 The governing statute is now the DDG, not the TMG

- The Telemediengesetz (TMG) ceased to be in force on 14 May 2024 and was replaced by the
  Digitale-Dienste-Gesetz (DDG); the Impressum duty moved from TMG s.5 to DDG s.5 with
  "no substantive changes" ("keine inhaltlichen Aenderungen") - only "Telemedien" became
  "digitale Dienste" [Source: https://www.ihk-bonn.de/recht-und-steuern/recht/aktuelles/das-digitale-dienste-gesetz-ersetzt-das-telemediengesetz, accessed 2026-07-05].
- The DDG was enacted as part of the DSA implementation act of 6 May 2024, published in
  BGBl. 2024 I Nr. 149 (issued 13 May 2024) [Source: https://www.recht.bund.de/bgbl/1/2024/149/regelungstext.pdf?__blob=publicationFile&v=1, accessed 2026-07-05].
- Current consolidated text of DDG s.5 "Allgemeine Informationspflichten":
  [Source: https://www.gesetze-im-internet.de/ddg/__5.html, accessed 2026-07-05].
  A copy of the official DDG PDF is stored at `assets/sources/ddg-germany.pdf`
  [Source: https://www.gesetze-im-internet.de/ddg/DDG.pdf, accessed 2026-07-05].

Drafter consequence: NEVER cite "s.5 TMG" in a German imprint. Cite "s.5 DDG" (and s.18
MStV where relevant). The IHK warns that citing the repealed law can itself attract
Abmahnungen [Source: https://www.ihk-bonn.de/recht-und-steuern/recht/aktuelles/das-digitale-dienste-gesetz-ersetzt-das-telemediengesetz, accessed 2026-07-05].

### 2.2 Who is caught

DDG s.5(1) applies to providers of "geschaeftsmaessige, in der Regel gegen Entgelt
angebotene digitale Dienste" - business-like digital services normally provided for
remuneration [Source: https://www.gesetze-im-internet.de/ddg/__5.html, accessed 2026-07-05].
In practice this catches essentially every commercial website, app, SaaS and shop; ad
monetisation or lead generation suffices for business-like character. Purely private,
non-commercial pages are outside s.5 (but may still be caught by s.18(1) MStV, below).

### 2.3 Required fields (DDG s.5(1) nos. 1-8, verbatim-verified)

[Source: https://www.gesetze-im-internet.de/ddg/__5.html, accessed 2026-07-05]

| No. | Field |
|-----|-------|
| 1 | Name and address of establishment; for legal persons additionally the legal form and the authorised representative(s); if statements about company capital are made, the share/registered capital and any outstanding contributions |
| 2 | Details enabling fast electronic contact and direct communication, "einschliesslich der Adresse fuer die elektronische Post" (email is mandatory) |
| 3 | Supervisory authority, where the activity requires official authorisation |
| 4 | Trade register (Handelsregister or similar) and registration number |
| 5 | For regulated professions: chamber, statutory professional title + state that granted it, applicable professional rules and how to access them |
| 6 | VAT ID (USt-IdNr., s.27a UStG) or business identification number (W-IdNr., s.139c AO), where held |
| 7 | For AG, KGaA, GmbH in winding-up or liquidation: a statement of that fact |
| 8 | For audiovisual media service providers: the member state of establishment and the competent regulatory/supervisory authorities |

### 2.4 Accessibility standard and the two-click practice

The statutory standard: the information must be "leicht erkennbar und unmittelbar
erreichbar" and kept "staendig verfuegbar" - easily recognisable, directly reachable,
permanently available [Source: https://www.gesetze-im-internet.de/ddg/__5.html, accessed 2026-07-05].
The Bundesgerichtshof held (under the predecessor norms) that provider identification
reachable via two links ("Kontakt" then "Impressum") can satisfy easy recognisability and
direct reachability - the "two-click rule"; the labels "Kontakt" and "Impressum" are
recognised by average users (BGH, judgment of 20.07.2006, I ZR 228/03)
[Source: http://juris.bundesgerichtshof.de/cgi-bin/rechtsprechung/document.py?Gericht=bgh&Art=en&nr=37635&pos=0&anz=1, accessed 2026-07-05].

Drafter consequence: a persistent footer link labelled "Impressum" (or "Legal Notice" on
an English UI) on EVERY page, at most two clicks from anywhere, never behind login,
paywall, or script-only rendering.

### 2.5 Country-of-origin principle and its limits (DDG s.3)

- Providers established in Germany follow German law even when serving other member
  states; conversely, digital services offered in Germany by providers established in
  ANOTHER member state enjoy free movement (subject to listed exceptions) - DDG s.3(1)-(2)
  [Source: https://www.gesetze-im-internet.de/ddg/__3.html, accessed 2026-07-05].
- This privilege exists only inside the scope of Directives 2000/31/EC and 2010/13/EU,
  i.e. for EU/EEA-established providers. A provider established OUTSIDE the EU cannot
  invoke it; the DDG's scope provision (s.1) contains no territorial carve-out for
  foreign providers serving the German market
  [Source: https://www.gesetze-im-internet.de/ddg/__1.html, accessed 2026-07-05].
- Practical targeting analysis for non-EU providers (German-language UI, German customers,
  delivery/marketing into Germany, .de domain, EUR pricing): treat DDG s.5 as applicable.
  This mirrors the explicit statutory targeting rule Spain wrote into LSSI Art 4 (s.6
  below). UNVERIFIED: no single German court decision on non-EU targeting was
  individually verified for this file - treat as settled enforcement practice, not cited
  case law.

### 2.6 Consequences of a missing or defective Impressum

- **Fine:** an Impressum violation (information "nicht, nicht richtig oder nicht
  vollstaendig verfuegbar") is an Ordnungswidrigkeit under DDG s.33(2) no.1, punishable
  by a fine of up to EUR 50,000 (s.33(6))
  [Source: https://www.gesetze-im-internet.de/ddg/__33.html, accessed 2026-07-05].
- **Abmahnung (the real-world risk):** competitors and qualified associations send
  cease-and-desist letters over defective imprints under unfair-competition law (UWG),
  with costs and contractual penalties attached; even citing the repealed TMG can trigger
  one [Source: https://www.ihk-bonn.de/recht-und-steuern/recht/aktuelles/das-digitale-dienste-gesetz-ersetzt-das-telemediengesetz, accessed 2026-07-05].
  In Germany the Abmahnung is far more likely than an official fine - draft accordingly.

### 2.7 Journalistic-editorial content: s.18 MStV (additional, on top of DDG s.5)

[Source: https://www.gesetze-bayern.de/Content/Document/MStV-18, accessed 2026-07-05]

- **s.18(1):** ALL telemedia not serving exclusively personal or family purposes must
  keep name and address available, easily recognisable and directly reachable; legal
  persons must also name the authorised representative. (This catches even
  non-commercial sites that s.5 DDG misses.)
- **s.18(2):** telemedia with journalistic-editorial content (blog with news character,
  online magazine, editorial content sections) must ADDITIONALLY name a responsible
  person (Verantwortlicher) with name and address. That person must: (1) have permanent
  residence in Germany (staendiger Aufenthalt im Inland), (2) not have lost eligibility
  for public office by court ruling, (3) have unrestricted legal capacity, and (4) be
  subject to unrestricted criminal prosecution.

Drafter fork: if the site has a blog/news section, add the line
"Verantwortlich im Sinne von s.18 Abs. 2 MStV: [name], [address]" - and confirm with the
user that the named person is Germany-resident.

---

## 3. Austria

### 3.1 ECG s.5 - general information duties

A service provider must keep at least the following "leicht und unmittelbar zugaenglich"
(easily and directly accessible) at all times: (1) name or company name; (2) geographic
address of establishment; (3) rapid-contact details including electronic mail address;
(4) Firmenbuch number and Firmenbuch court, if any; (5) competent supervisory authority,
where the activity is supervised; (6) for trade- or profession-regulated providers: the
chamber/professional body, professional title + state that granted it, and a reference to
the applicable rules and access to them; (7) VAT (UID) number, if any. Prices, where
shown, must be legible and unambiguous as to gross/net and shipping (ECG s.5(2))
[Source: https://www.ris.bka.gv.at/NormDokument.wxe?Abfrage=Bundesnormen&Gesetzesnummer=20001703&Paragraf=5, accessed 2026-07-05].

Breach is a Verwaltungsuebertretung with a fine of up to EUR 3,000 (ECG s.26(1) no.1)
[Source: https://www.ris.bka.gv.at/NormDokument.wxe?Abfrage=Bundesnormen&Gesetzesnummer=20001703&Paragraf=26, accessed 2026-07-05].

### 3.2 Mediengesetz s.25 - Offenlegung (disclosure), applies to every website

Every media owner of a periodical medium - and expressly every website - must publish the
s.25(2)-(4) disclosures; "Auf einer Website sind diese Angaben staendig leicht und
unmittelbar auffindbar zur Verfuegung zu stellen", and an ECG service provider may present
them together with the ECG s.5 information
[Source: https://www.ris.bka.gv.at/NormDokument.wxe?Abfrage=Bundesnormen&Gesetzesnummer=10000719&Paragraf=25, accessed 2026-07-05]. Same source for the following:

- **Full disclosure (s.25(2)-(4)):** media owner's name/company, business purpose
  (Unternehmensgegenstand), seat/residence, authorised representatives, supervisory board
  members if any; ownership, shareholding and voting-right structure including silent
  participations, trusts, foundations (founder + beneficiaries), associations (board +
  purpose); cross-media holdings (s.25(3)); and a declaration of the medium's fundamental
  editorial direction (Blattlinie, s.25(4)).
- **Small-website relief (s.25(5)):** a website whose content does not go beyond
  presenting the owner's personal life or the owner's own business (no content apt to
  influence public opinion) discloses ONLY name/company, business purpose where
  applicable, and seat/residence; s.25(3) and (4) do not apply. This is the normal case
  for a company site or SaaS product page.

Breach of the s.25 disclosure duty carries an administrative fine of up to EUR 20,000
(MedienG s.27(1) no.1)
[Source: https://www.ris.bka.gv.at/NormDokument.wxe?Abfrage=Bundesnormen&Gesetzesnummer=10000719&Paragraf=27, accessed 2026-07-05].

Drafter fork for Austria: ordinary business site -> combined page with ECG s.5 fields +
small-website Offenlegung (name, business purpose, seat). Site with editorial/news
content influencing public opinion -> full s.25(2)-(4) disclosure including ownership
structure and Blattlinie. Ask the user which applies.

---

## 4. Other member states and the UK - comparative table

| Jurisdiction | Statute | Required beyond/around the Art 5 EU set | Penalty (verified) |
|---|---|---|---|
| Spain | LSSI-CE (Ley 34/2002) Art 10 | Art 5 set, plus: tax ID (NIF), prior-authorisation data, professional title/homologation, codes of conduct adhered to and how to consult them; duty satisfied by publishing on the website itself (Art 10.2) [Source: https://www.boe.es/buscar/act.php?id=BOE-A-2002-13758, accessed 2026-07-05] | Minor infringement: fine up to EUR 30,000; serious: EUR 30,001-150,000 (Arts 38.4(b), 39.1) [same source] |
| France | LCEN (Loi 2004-575), Art **1-1** (identification, en vigueur 23 May 2024) + Art **1-2** (penalties) — the SREN law (Loi 2024-449 du 21 mai 2024) moved these out of the former Art 6 III; Art 6 now governs intermediary/hosting services [Source: Légifrance Art 1-1 LCEN https://www.legifrance.gouv.fr/loda/article_lc/LEGIARTI000049568614, en vigueur 23/05/2024, accessed 2026-07-09] | Editor identification: natural persons - name, forenames, address, phone, RCS number; companies - denomination, registered office, phone, RCS/RM number, share capital; the "directeur de la publication" must be named; host's name, address and phone must be given; non-professional editors may stay anonymous by publishing only the host's details [Source: https://entreprendre.service-public.gouv.fr/vosdroits/F31228, accessed 2026-07-05; law text: https://www.legifrance.gouv.fr/loda/id/JORFTEXT000000801164, accessed 2026-07-05] | Natural persons: 1 year imprisonment and EUR 75,000 fine; **legal persons: EUR 375,000** ("le quintuple", Code pénal Art 131-38, applied to the Art 1-2 offence) [Sources: service-public https://entreprendre.service-public.gouv.fr/vosdroits/F31228; Code pénal Art 131-38 https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000006417334, accessed 2026-07-09] |
| Italy | D.lgs. 70/2003 Art 7 | Art 5 set, plus: REA/business-register number, partita IVA, clear price indication, and Art 7(1)(i) permitted-activity/licence-contract details; information must be kept updated (Art 7(2)) [Source: https://www.normattiva.it/uri-res/N2Ls?urn:nir:stato:decreto.legislativo:2003;70~art7!vig=, accessed 2026-07-05] | Administrative fine EUR 103 - EUR 10,000, doubled for serious cases or recidivism (Art 21) [Source: https://www.normattiva.it/uri-res/N2Ls?urn:nir:stato:decreto.legislativo:2003;70~art21!vig=, accessed 2026-07-05] |
| Netherlands | Burgerlijk Wetboek Art 3:15d | Art 5 set, "gemakkelijk, rechtstreeks en permanent toegankelijk": identity + establishment address, rapid-contact details incl. email, trade-register number (KvK), supervisory authority, regulated-profession details, btw-identificatienummer; clear price indication (3:15d lid 2) [Source: https://wetten.overheid.nl/jci1.3:c:BWBR0005291&boek=3&titeldeel=1&afdeling=1A&artikel=15d, accessed 2026-07-05] | Breach of Art 3:15d is detected as an **economic offence**: Art 3:15f BW appoints Belastingdienst/FIOD-ECD officers to detect (opsporing) violations of arts 15d/15e; penalties run via the **Wet op de economische delicten** plus civil/consumer enforcement — no administrative fine sits in the BW itself [Source: https://wetten.overheid.nl/BWBR0005291 art 3:15f, geldend 2025-07-01, accessed 2026-07-09] |
| United Kingdom | E-Commerce (EC Directive) Regs 2002 reg 6; Companies Act 2006 s.82 + Trading Disclosures Regs 2015 (SI 2015/17) regs 24-25; Provision of Services Regs 2009 reg 8 | Reg 6: the full Art 5 set "easily, directly and permanently accessible" [Source: https://www.legislation.gov.uk/uksi/2002/2013/regulation/6/made, accessed 2026-07-05]. Companies must additionally show on their websites: registered name (reg 24), part of the UK of registration, registered number, registered office address; share capital, if mentioned, as paid-up (reg 25) [Source: https://www.legislation.gov.uk/uksi/2015/17/regulation/25/made, accessed 2026-07-05; enabling power: https://www.legislation.gov.uk/ukpga/2006/46/section/82, accessed 2026-07-05]. Service providers must also give legal status/form, T&Cs, applicable-law clauses, after-sales guarantees (PoS Regs 2009 reg 8) [Source: https://www.legislation.gov.uk/uksi/2009/2999/regulation/8/made, accessed 2026-07-05] | Trading Disclosures breach is a criminal offence (SI 2015/17 reg 28) [Source: https://www.legislation.gov.uk/uksi/2015/17/contents/made, accessed 2026-07-05]; fine level not verified here |

Note (UK): the 2002 and 2009 instruments were verified in their "as made" versions;
post-Brexit amendments to their current revised text were not individually checked -
re-verify the revised versions before relying on fine detail.

---

## 5. Extraterritorial reach - who needs the page

1. **EU-established business serving other EU states:** the country-of-origin principle
   (Art 3 ECD; DDG s.3 in Germany) means it primarily follows its HOME state's imprint
   statute - but since Art 5 is harmonised, the field set is near-identical everywhere;
   carrying the fullest applicable set (usually the German one) satisfies all.
2. **Non-EU business serving an EU market:** no country-of-origin privilege. Spain makes
   the targeting rule explicit: providers established outside the EU/EEA "que dirijan sus
   servicios especificamente al territorio espanol" are subject to the LSSI's obligations
   (Art 4) [Source: https://www.boe.es/buscar/act.php?id=BOE-A-2002-13758, accessed 2026-07-05].
   Germany reaches the same result through the DDG's unrestricted scope (s.2.5 above).
   Targeting indicators: local language, local currency, local TLD, marketing or delivery
   into the market, local phone numbers.
3. **Safe-harbor recommendation for the drafter:** if the business serves the German or
   Austrian market at all, carry a full Impressum page; the marginal cost is one page and
   it simultaneously satisfies every other EU state's Art 5 duty plus the UK company
   disclosures. If the business demonstrably does NOT target DE/AT (English-only, no EU
   marketing), the imprint is not mandatory - record that decision in the policy memory store
   with its reasoning.

---

## 6. What the drafting agent must collect (all ask-the-user; none of it is in code)

Ask for every applicable item; mark the jurisdiction that forces it:

| Field | Needed for |
|---|---|
| Legal name + legal form (GmbH, Ltd, SAS, BV...) | All |
| Geographic address of establishment (a real street address, not a PO box) | All |
| Email address (mandatory, verbatim in DDG s.5(1) no.2 / Art 5(1)(c)) | All |
| Phone number | France (mandatory); DE/AT recommended for "rapid contact" |
| Authorised representative(s) / managing director names | DE (legal persons), AT, MStV s.18(1) |
| Trade register + registration number (HRB, Firmenbuch, KvK, RCS, Companies House) | All, if registered |
| Part of UK of registration + registered office | UK companies |
| VAT ID (USt-IdNr./UID/btw-id/partita IVA) or W-IdNr./NIF | All, if held |
| Supervisory authority + licence particulars | Licensed activities (finance, insurance, crafts requiring permits...) |
| Regulated profession: chamber, title, granting state, professional rules link | Regulated professions |
| Share/registered capital (+ outstanding contributions) | DE if capital is mentioned; FR companies; UK if capital shown |
| Liquidation/winding-up status | DE AG/KGaA/GmbH in liquidation |
| Journalistic-editorial content? -> Verantwortlicher name + address (Germany-resident) | DE, MStV s.18(2) |
| Editorial/opinion-forming content? -> full Offenlegung: ownership structure, Blattlinie | AT, MedienG s.25(2)-(4) |
| Directeur de la publication + hosting provider name/address/phone | FR |
| Audiovisual media service? -> sitting member state + regulator | DE, DDG s.5(1) no.8 |
| Which markets does the business target (languages, currencies, marketing)? | Drives the s.5 applicability fork |

Decision forks the drafter must run: (a) targets DE or AT? -> full Impressum;
(b) journalistic content? -> add MStV s.18(2) / full MedienG s.25 blocks;
(c) regulated profession or licensed activity? -> add authority/chamber block;
(d) France targeted? -> add directeur de la publication + host block;
(e) UK company? -> add registered number/office/part-of-UK block.

## 7. Page placement requirements

- One dedicated page, linked from a persistent footer on EVERY page of the site or app -
  reachable within at most two clicks from anywhere (BGH I ZR 228/03, s.2.4 above).
- Use an established link label: "Impressum" (German UI), "Legal Notice" / "Imprint"
  (English UI), "Mentions legales" (French UI), "Aviso legal" (Spanish UI). The label must
  be recognisable as leading to provider identification (same BGH source).
- Permanently available: no login wall, no paywall, no geo-block for the target market,
  not rendered only by JavaScript that can fail, readable on mobile.
- The imprint may share a page with the Austrian Offenlegung (expressly permitted by
  MedienG s.25(1)) but should be a page separate from the privacy policy.
- Keep it current: Italy's Art 7(2) makes updating an express duty; a stale imprint is a
  defective imprint everywhere (fines/Abmahnung attach to "incorrect or incomplete").

## UNRESOLVED

- France: RESOLVED (re-verified 2026-07-09). The SREN law (Loi 2024-449 du 21 mai 2024) moved the
  editor-identification duties from the former LCEN Art 6 III to **Art 1-1** (en vigueur 23 May 2024)
  and the penalties to **Art 1-2**; Art 6 now governs intermediary/hosting services. The legal-person
  fine of **EUR 375,000** is confirmed = 5 × EUR 75,000 ("le quintuple", Code pénal Art 131-38).
  [Légifrance Art 1-1 LEGIARTI000049568614; Code pénal Art 131-38 LEGIARTI000006417334]
- Germany: no individual court decision on applying DDG s.5 to non-EU providers targeting
  Germany was verified; the targeting analysis rests on the statute's scope and the
  Spanish statutory analogue.
- Germany: whether the Impressum duty extends to a business's social-media profiles and
  app-store listings (widely followed practice) was not verified from a citable source.
- Netherlands: RESOLVED (2026-07-09) — breach of BW 3:15d is an economic offence detected under
  Art 3:15f BW (Belastingdienst/FIOD-ECD), penalties via the Wet op de economische delicten plus
  civil/consumer enforcement; no administrative fine sits in the BW itself.
- Italy: the separate duty to show the partita IVA on the website homepage under Art 35
  DPR 633/1972 (VAT code) was not verified and is omitted from the table.
- UK: current revised (post-Brexit-amendment) texts of the 2002 and 2009 Regulations and
  the fine level for the SI 2015/17 reg 28 offence were not verified.

## Sources

- https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32000L0031
- https://www.gesetze-im-internet.de/ddg/__1.html
- https://www.gesetze-im-internet.de/ddg/__3.html
- https://www.gesetze-im-internet.de/ddg/__5.html
- https://www.gesetze-im-internet.de/ddg/__33.html
- https://www.gesetze-im-internet.de/ddg/DDG.pdf
- https://www.recht.bund.de/bgbl/1/2024/149/regelungstext.pdf?__blob=publicationFile&v=1
- https://www.ihk-bonn.de/recht-und-steuern/recht/aktuelles/das-digitale-dienste-gesetz-ersetzt-das-telemediengesetz
- http://juris.bundesgerichtshof.de/cgi-bin/rechtsprechung/document.py?Gericht=bgh&Art=en&nr=37635&pos=0&anz=1
- https://www.gesetze-bayern.de/Content/Document/MStV-18
- https://www.ris.bka.gv.at/NormDokument.wxe?Abfrage=Bundesnormen&Gesetzesnummer=20001703&Paragraf=5
- https://www.ris.bka.gv.at/NormDokument.wxe?Abfrage=Bundesnormen&Gesetzesnummer=20001703&Paragraf=26
- https://www.ris.bka.gv.at/NormDokument.wxe?Abfrage=Bundesnormen&Gesetzesnummer=10000719&Paragraf=25
- https://www.ris.bka.gv.at/NormDokument.wxe?Abfrage=Bundesnormen&Gesetzesnummer=10000719&Paragraf=27
- https://www.boe.es/buscar/act.php?id=BOE-A-2002-13758
- https://entreprendre.service-public.gouv.fr/vosdroits/F31228
- https://www.legifrance.gouv.fr/loda/id/JORFTEXT000000801164
- https://www.normattiva.it/uri-res/N2Ls?urn:nir:stato:decreto.legislativo:2003;70~art7!vig=
- https://www.normattiva.it/uri-res/N2Ls?urn:nir:stato:decreto.legislativo:2003;70~art21!vig=
- https://wetten.overheid.nl/jci1.3:c:BWBR0005291&boek=3&titeldeel=1&afdeling=1A&artikel=15d
- https://www.legislation.gov.uk/uksi/2002/2013/regulation/6/made
- https://www.legislation.gov.uk/uksi/2009/2999/regulation/8/made
- https://www.legislation.gov.uk/ukpga/2006/46/section/82
- https://www.legislation.gov.uk/uksi/2015/17/contents/made
- https://www.legislation.gov.uk/uksi/2015/17/regulation/25/made

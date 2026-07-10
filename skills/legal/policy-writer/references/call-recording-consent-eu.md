# Call Recording and Transcription Consent in the EU and UK

> Verified: 2026-07-05 against live sources. Re-verify if older than 12 months.
> Provenance: authored for policy-writer from live web research; all citations inline.

Instructional reference for drafting policies and notices for a SaaS voice-agent provider and
for the businesses deploying it. Recording or transcribing a business phone call in Europe sits
under TWO stacked legal layers: (1) GDPR (uniform, data-protection duties) and (2) national
implementations of the ePrivacy Directive plus national criminal/telecom law (divergent - this
is where "one-party vs all-party consent" lives). A drafter must satisfy BOTH layers for every
country the deployer takes calls in. Local PDF copies: `assets/sources/eprivacy-directive-2002-58-consolidated.pdf`,
`assets/sources/edpb-guidelines-02-2021-virtual-voice-assistants.pdf`.

## 1. The GDPR layer

### 1.1 Recording a call is processing personal data
A voice recording of an identifiable caller is personal data; recording, transcribing, storing
and analysing it are all "processing". Voice is NOT automatically special-category biometric
data: under GDPR Art 4(14) biometric data requires "specific technical processing" enabling
unique identification, and Recital 51 confirms data of this kind is special category "only when
processed through a specific technical means allowing the unique identification or
authentication of a natural person" [Source: https://eur-lex.europa.eu/eli/reg/2016/679/oj/eng, accessed 2026-07-05].
The EDPB applies exactly this reasoning to voice: speech recognition that processes WHAT is said
is ordinary personal data; speaker identification/verification (WHO is speaking) is biometric,
special-category, and requires explicit consent under Art 9 [Source: https://www.edpb.europa.eu/system/files/2021-07/edpb_guidelines_202102_on_vva_v2.0_adopted_en.pdf, accessed 2026-07-05].

**Drafter rule:** if the product does not do voiceprint identification, the policy must say so
plainly ("we do not use your voice to identify you biometrically") and the analysis stays under
Art 6. If it ever adds speaker verification, that feature needs Art 9 explicit consent and its
own disclosure - a hard decision fork.

### 1.2 Lawful bases realistically available (Art 6)
| Basis | When it works for call recording | Regulator support |
|---|---|---|
| Legitimate interest, Art 6(1)(f) | Quality assurance, service documentation, dispute evidence; requires balancing test (LIA), notice, and an Art 21 objection route | Italian Garante approved recording + transcription + analysis of inbound customer calls on a balancing-of-interests basis, not consent (decision of 18 April 2018, docweb 8987133) [Source: https://www.garanteprivacy.it/home/docweb/-/docweb-display/docweb/8987133, accessed 2026-07-05] |
| Contract, Art 6(1)(b) | Recording/transcript strictly needed to perform the service the caller asked for (e.g. capturing the appointment request details) | EDPB accepts contract necessity for processing voice data to execute the user's request [Source: https://www.edpb.europa.eu/system/files/2021-07/edpb_guidelines_202102_on_vva_v2.0_adopted_en.pdf, accessed 2026-07-05] |
| Consent, Art 6(1)(a) | Needed where national ePrivacy/criminal law demands all-party consent (see table), or for non-necessary purposes (marketing analytics, AI training) | Must be freely given: offer a real alternative (unrecorded line / human callback), otherwise "continue = consent" fails GDPR consent standards |

Under legitimate interest the caller keeps the Art 21(1) right to object "on grounds relating
to his or her particular situation" [Source: https://eur-lex.europa.eu/eli/reg/2016/679/oj/eng, accessed 2026-07-05];
CNIL requires that callers be told of the objection right early enough to exercise it before
the conversation ends [Source: https://www.cnil.fr/fr/lecoute-et-lenregistrement-des-appels-sur-le-lieu-de-travail, accessed 2026-07-05].

### 1.3 Art 13 information duties at the start of the call
Art 13(1)-(2) requires, at the time data is collected: controller identity, purposes, legal
basis, recipients, retention, and data-subject rights [Source: https://eur-lex.europa.eu/eli/reg/2016/679/oj/eng, accessed 2026-07-05].
Regulators converge on a LAYERED model for phone calls:
- **Layer 1 (spoken, at call start, before recording begins):** that the call is recorded/
  transcribed, by whom, for what purpose, and how to object. CNIL: oral notice at the start of
  the conversation covering existence, purpose and right to object [Source: https://www.cnil.fr/fr/lecoute-et-lenregistrement-des-appels-sur-le-lieu-de-travail, accessed 2026-07-05].
  Garante: concise notice at call initiation referring to the detailed notice on the website
  [Source: https://www.garanteprivacy.it/home/docweb/-/docweb-display/docweb/8987133, accessed 2026-07-05].
  ICO: "You must tell these people that you are recording the call and why. A recorded message
  is good practice." [Source: https://ico.org.uk/for-organisations/uk-gdpr-guidance-and-resources/employment/monitoring-workers/specific-data-protection-considerations-for-different-ways-or-methods-of-monitoring-workers/, accessed 2026-07-05].
- **Layer 2 (full privacy notice):** retention periods, rights, recipients, complaint route -
  delivered via the website privacy policy, a link sent by SMS/email, or contract documents
  (CNIL, Garante and ICO all accept this split; ICO suggests emailing the privacy information
  or linking to it, same sources as above).

**Drafter rule:** the deployer's privacy policy MUST contain the Layer-2 detail for calls
(recording + transcription purposes, basis, retention, processor disclosure), and the drafter
must output the Layer-1 spoken announcement alongside the policy - they are one compliance unit.

### 1.4 Retention limitation
Art 5(1)(e): keep identifiable data "no longer than is necessary" for the purposes
[Source: https://eur-lex.europa.eu/eli/reg/2016/679/oj/eng, accessed 2026-07-05]. Regulator anchors:
- CNIL: max 6 months for quality/training recordings; analysis documents up to 1 year
  [Source: https://www.cnil.fr/fr/lecoute-et-lenregistrement-des-appels-sur-le-lieu-de-travail, accessed 2026-07-05].
- CNIL also bars permanent/systematic 100% recording for quality purposes - prefer sampling or
  agent-triggered recording (same source).
- EDPB (voice assistants): delete voice data promptly once the request is executed unless a
  separate legal basis justifies keeping it [Source: https://www.edpb.europa.eu/system/files/2021-07/edpb_guidelines_202102_on_vva_v2.0_adopted_en.pdf, accessed 2026-07-05].
- Garante: differentiated retention per purpose, plus sampling caps (max 20% of daily calls
  recorded per team, max 3% audited) in the 2018 decision [Source: https://www.garanteprivacy.it/home/docweb/-/docweb-display/docweb/8987133, accessed 2026-07-05].

**Drafter rule:** the policy must state a concrete retention period per artefact (audio,
transcript, analytics) and the period must be defensible against these anchors. "As long as
necessary" alone is not acceptable drafting for recordings.

## 2. The ePrivacy layer (where national divergence lives)

Directive 2002/58/EC Art 5(1) (consolidated version of 19 December 2009) obliges member states
to "prohibit listening, tapping, storage or other kinds of interception or surveillance of
communications ... by persons other than users, without the consent of the users concerned".
Art 5(2) carves out "any legally authorised recording of communications ... in the course of
lawful business practice for the purpose of providing evidence of a commercial transaction or
of any other business communication" [Source: https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:02002L0058-20091219, accessed 2026-07-05;
local copy assets/sources/eprivacy-directive-2002-58-consolidated.pdf].

Because Art 5 is implemented through national telecom and criminal statutes, the practical
consent/notification standard differs per country - that is what the table below captures.
A voice-agent platform recording calls is a "person other than the users" in the Art 5(1)
sense when it stores the conversation for the business, so it operates inside whatever
national authorisation or consent rule applies.

## 3. Member-state table

Confidence: HIGH = primary statute/regulator source consulted; MEDIUM = official but indirect,
or regulator position assembled from government/secondary sources; UNVERIFIED = no solid source
found - do not rely without local counsel.

| Country | Standard for recording a business call | Source(s) | Confidence |
|---|---|---|---|
| Germany | Strictest regime: s.201 StGB criminalises recording "the non-publicly spoken word of another" onto a sound carrier without authorisation, and using/sharing such recordings - up to 3 years imprisonment or a fine [Source: https://www.gesetze-im-internet.de/stgb/__201.html, accessed 2026-07-05]. Effectively all-party consent. Practice treats a clear start-of-call announcement plus the caller continuing as authorisation, and employee-side recording additionally needs works-council involvement (s.87(1)(6) BetrVG) - both from secondary sources, statute itself does not spell this out [Source: https://www.recordinglaw.com/world-laws/world-recording-laws/germany-recording-laws/, accessed 2026-07-05] | Statute primary; consent-by-continuation practice UNVERIFIED against primary | HIGH (offence), MEDIUM (announcement practice) |
| France | No blanket consent requirement, but mandatory oral notice at call start (existence, purpose, right to object) plus Layer-2 detail elsewhere; objection right must be usable before the call ends; permanent/systematic recording of all calls prohibited for quality purposes; retention max 6 months (analyses 1 year) [Source: https://www.cnil.fr/fr/lecoute-et-lenregistrement-des-appels-sur-le-lieu-de-travail, accessed 2026-07-05] | CNIL (regulator) | HIGH |
| Netherlands | Notification at call start plus stated purposes; consent not required where recording is necessary for contract performance or covered by legitimate interest; caller can demand access/replay | ACM ConsuWijzer (government consumer authority) [Source: https://consument.acm.nl/telefonische-verkoop/overeenkomst-geldig/regels-telefoongesprek-opnemen-en-opname-beluisteren, accessed 2026-07-05]; Dutch central government AVG register entry for customer-call recording [Source: https://avgregisterrijksoverheid.nl/verwerkingen/opnemen-en-terugluisteren-van-telefoongesprekken-klantcontact, accessed 2026-07-05]. No dedicated AP customer-call guidance located | MEDIUM |
| Spain | Duty to inform at call start: business identity, purpose, and how to object/revoke; objections must be honoured immediately; AEPD expects marketing calls to be recorded precisely to evidence compliance; layered notice model per LOPDGDD (first layer orally, rest via easy access) [Source: https://www.aepd.es/preguntas-frecuentes/5-publicidad-no-deseada/FAQ-0507-como-se-garantizan-mis-derechos-de-proteccion-de-datos-cuando-recibo-una-llamada, accessed 2026-07-05] | AEPD (regulator FAQ) | MEDIUM-HIGH |
| Italy | Legitimate interest accepted for recording, transcribing and analysing inbound customer calls; concise oral notice at call start referring to full website notice; sampling caps (20% recorded / 3% audited per team); union agreement required where employees are monitored (Art 4, Law 300/1970) [Source: https://www.garanteprivacy.it/home/docweb/-/docweb-display/docweb/8987133, accessed 2026-07-05] | Garante decision 18 Apr 2018, docweb 8987133 | HIGH |
| Poland | UODO enforces that audio recording needs a valid Art 6 basis and rejects stretched "legal obligation" claims (fine + shutdown order in decision on audio surveillance) [Source: https://uodo.gov.pl/en/553/1346, accessed 2026-07-05]; call-centre recording analysed as ordinary GDPR processing with purpose-bound retention [Source: https://hrlaw.pl/en/articles/recording-call-centre-employees-phone-calls-and-data-protection-legislation, accessed 2026-07-05]. Criminal-law treatment of participant recording (Art 267 Penal Code) not confirmed from a primary source | UODO decision + secondary | MEDIUM; criminal layer UNVERIFIED |
| Austria | s.120 StGB criminalises using a recording device to capture another's non-public utterance NOT intended for the recorder's knowledge, and separately criminalises giving a recording of another's non-public utterance to third parties or publishing it without the speaker's consent (up to 1 year / 720 daily rates) [Source: https://www.jusline.at/gesetz/stgb/paragraf/120, accessed 2026-07-05]. A call participant recording a conversation addressed to them is not squarely within the capture offence, but disclosure without consent is - so obtain announced consent anyway. GDPR layer: contract-evidence recording only where no milder means exists (Austrian practice) [Source: https://www.dataprotect.at/2022/05/11/die-aufzeichnung-von-telefongespr%C3%A4chen-zum-zwecke-des-nachweises-des-vertragsabschlusses/, accessed 2026-07-05] | Statute reprint + secondary | MEDIUM-HIGH |
| Belgium | Art 124 Electronic Communications Act: taking knowledge of electronic communications in principle requires consent of all participants; exceptions include recording for evidence of a business transaction and call-centre quality monitoring - but with MANDATORY prior notification of all participants (purpose and storage duration) [Source: https://www.gegevensbeschermingsautoriteit.be/burger/thema-s/privacy-op-de-werkplek/toezicht-van-de-werkgever/professionele-telefoongesprekken, accessed 2026-07-05] | GBA/APD (regulator) | HIGH |
| Ireland | No dedicated DPC call-recording guidance located in live search; GDPR duties (basis, start-of-call notice, retention) apply as baseline. Secondary sources describe Ireland as permissive for participant recording under the interception statute while requiring informed notice for business recording - UNVERIFIED from primary sources [Source: https://www.recordinglaw.com/world-laws/world-recording-laws/ireland-recording-laws/, accessed 2026-07-05] | Secondary only | UNVERIFIED - flag for local counsel |
| United Kingdom | Interception without lawful authority is an offence (s.3 Investigatory Powers Act 2016); the Investigatory Powers (Interception by Businesses etc. for Monitoring and Record-keeping Purposes) Regulations 2018, SI 2018/356, authorise business recording for monitoring/record-keeping [Source: https://www.legislation.gov.uk/uksi/2018/356/contents/made, accessed 2026-07-05], carrying forward the "all reasonable efforts to inform system users" condition from the 2000 Lawful Business Practice Regulations (condition wording not confirmed from the 2018 instrument text itself). ICO: you must tell external callers that you record and why; recorded announcement is good practice; remaining privacy information may follow by link/email [Source: https://ico.org.uk/for-organisations/uk-gdpr-guidance-and-resources/employment/monitoring-workers/specific-data-protection-considerations-for-different-ways-or-methods-of-monitoring-workers/, accessed 2026-07-05] | Legislation.gov.uk + ICO | HIGH (duty), MEDIUM (exact SI condition wording) |

**Drafter rule:** when the deployer operates in Germany, Austria or Belgium, default to
announced all-party-consent behaviour (announcement + explicit continue-or-opt-out) - not just
notification. Elsewhere in the table, notification + legitimate interest with an objection
route is the defensible default. Never let a policy claim a single pan-EU rule.

## 4. Duty allocation: deployer vs voice-agent provider

- **The deploying business is the controller.** It decides that calls are answered by an agent,
  whether they are recorded/transcribed, for which purposes, and how long data is kept. Art 13
  duties and the lawful-basis choice are the controller's.
- **The SaaS voice-agent provider is a processor** (Art 28): it records, transcribes and stores
  on documented instructions. The DPA between them must list call audio, transcripts, caller
  phone numbers and any extracted details as processed data, plus sub-processors (telephony,
  speech-to-text, LLM vendors).
- **Delivery of the notice happens inside the call, so only the platform can physically play
  it.** The controller owes the duty; the processor must make discharge of it possible. The
  provider must therefore make configurable, and the drafter must document in the DPA/product
  policy that these controls exist and that configuring them correctly is the controller's
  responsibility:
  - a pre-recording announcement that plays BEFORE recording/transcription starts (ICO: recorded
    message is good practice; CNIL/Garante/GBA: notice before or at start - sources in sections
    1.3 and 3);
  - per-region defaults (strict announced-consent script for DE/AT/BE; notification script
    elsewhere);
  - an opt-out path: a way to continue unrecorded, reach a human, or use another channel -
    required for GDPR consent to be valid and for CNIL-style objection rights;
  - configurable retention (per-artefact: audio, transcript, analytics) with automatic deletion;
  - a link/SMS/email mechanism for the Layer-2 privacy notice.

## 5. AI-agent nuance

- **The caller is talking TO an AI.** Disclosure that the interlocutor is a machine is an EU AI
  Act transparency duty, separate from recording consent - see `references/ai-act-transparency.md`
  (do not duplicate its content here). Practically, one opening announcement must carry BOTH
  disclosures (AI + recording), so script patterns below combine them.
- **Transcription-only setups (no audio retained).** Still fully GDPR-regulated: the transcript
  is personal data and the audio is processed transiently, so Art 13 notice, lawful basis and
  retention duties are unchanged. What MAY change is the national criminal layer: offences like
  s.201 StGB attach to recording "onto a sound carrier" [Source: https://www.gesetze-im-internet.de/stgb/__201.html, accessed 2026-07-05],
  and whether live transcription without stored audio falls outside them is unsettled analysis,
  not sourced law - UNVERIFIED, flag for counsel; do not draft a policy that promises
  transcription-only avoids consent duties. ePrivacy Art 5(1) covers "listening, tapping,
  storage or other kinds of interception or surveillance", which reaches live machine listening
  even without storage [Source: https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:02002L0058-20091219, accessed 2026-07-05].
  Announce transcription exactly as you would announce recording.
- **Voicemail-drop / message-taking.** A caller invited to "leave a message after the tone" knows
  a recording is being made, but Art 13 duties still apply: the greeting must identify the
  business, state that the message is recorded (and AI-processed, if it is), and point to the
  full notice. Retention limits apply to voicemail audio and transcripts the same as to calls.

## 6. Announcement script patterns

Patterns to ADAPT per deployment - not legal boilerplate. Bind each blank to the controller's
actual configuration; never ship a script mentioning purposes the deployer has not configured.

- **Notification pattern (FR/IT/ES/NL/UK-style, legitimate interest):**
  "You are speaking with [business]'s automated assistant. This call is recorded and transcribed
  for [appointment handling and service quality]. For details and your privacy rights, including
  how to object, visit [URL] or say 'no recording' at any time."
- **Announced-consent pattern (DE/AT/BE-style, all-party consent):**
  "You are speaking with [business]'s automated assistant. To document your request, this call
  will be recorded and transcribed. If you agree, please continue. If not, say 'no recording'
  [and you will be transferred to a human / we will take only your callback number]."
- **Objection/opt-out branch (all regions):** on opt-out, recording and transcription stop (or
  never start), and the system offers the configured fallback (human callback, unrecorded
  minimal-data mode). CNIL requires the objection to be exercisable before the call ends
  [Source: https://www.cnil.fr/fr/lecoute-et-lenregistrement-des-appels-sur-le-lieu-de-travail, accessed 2026-07-05].
- **Voicemail greeting pattern:** "You have reached [business]. Your message will be recorded
  and processed by our automated assistant to arrange a callback. Privacy information: [URL]."

## 7. Drafter decision forks (checklist)

1. Which countries does the deployer take calls in? -> pick per-country script class from the
   table (announced consent vs notification).
2. Audio retained, transcript-only, or both? -> policy must name each artefact and its retention.
3. Any speaker identification/voiceprint feature? -> Art 9 explicit consent block required;
   otherwise state plainly that no biometric identification occurs.
4. Lawful basis per purpose: contract (fulfilling the caller's request), legitimate interest
   (quality/evidence - LIA on file, objection route), consent (strict countries, AI training,
   marketing analytics).
5. Opt-out path configured? If not, consent-based scripts are invalid - escalate to the deployer.
6. Employee side: agents' own calls monitored? -> works council (DE), union agreement (IT),
   employee notice (all) - separate from caller-facing drafting but must be flagged.
7. Cross-reference the AI-disclosure duty from `references/ai-act-transparency.md` into the same
   opening announcement.

## UNRESOLVED

- Ireland: no primary DPC guidance on call recording located; the one-party-consent reading of
  the Interception of Postal Packets and Telecommunications Messages (Regulation) Act 1993 for
  participant recording is UNVERIFIED (secondary sources only).
- Poland: criminal exposure of participant recording (Art 267 Penal Code) not verified from a
  primary source; no dedicated UODO customer-call guidance found.
- Netherlands: no current Autoriteit Persoonsgegevens page specific to customer-call recording
  located; position rests on government consumer-authority and central-government register
  sources.
- UK: the exact notification condition wording of SI 2018/356 (successor to reg 3(2)(c) of the
  2000 Lawful Business Practice Regulations) was not confirmed from the instrument's full text,
  only its existence and title.
- Germany/Austria: the "announcement + continuing the call = valid authorisation under criminal
  law" practice is supported by secondary sources only; primary confirmation (case law) not
  located.
- Whether live transcription without audio retention falls outside national recording offences
  (e.g. s.201 StGB "sound carrier") is unsettled; treat as if the offence applies.

## Sources

- https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:02002L0058-20091219
- https://eur-lex.europa.eu/eli/reg/2016/679/oj/eng
- https://www.edpb.europa.eu/system/files/2021-07/edpb_guidelines_202102_on_vva_v2.0_adopted_en.pdf
- https://www.gesetze-im-internet.de/stgb/__201.html
- https://www.recordinglaw.com/world-laws/world-recording-laws/germany-recording-laws/
- https://www.cnil.fr/fr/lecoute-et-lenregistrement-des-appels-sur-le-lieu-de-travail
- https://consument.acm.nl/telefonische-verkoop/overeenkomst-geldig/regels-telefoongesprek-opnemen-en-opname-beluisteren
- https://avgregisterrijksoverheid.nl/verwerkingen/opnemen-en-terugluisteren-van-telefoongesprekken-klantcontact
- https://www.aepd.es/preguntas-frecuentes/5-publicidad-no-deseada/FAQ-0507-como-se-garantizan-mis-derechos-de-proteccion-de-datos-cuando-recibo-una-llamada
- https://www.garanteprivacy.it/home/docweb/-/docweb-display/docweb/8987133
- https://uodo.gov.pl/en/553/1346
- https://hrlaw.pl/en/articles/recording-call-centre-employees-phone-calls-and-data-protection-legislation
- https://www.jusline.at/gesetz/stgb/paragraf/120
- https://www.dataprotect.at/2022/05/11/die-aufzeichnung-von-telefongespr%C3%A4chen-zum-zwecke-des-nachweises-des-vertragsabschlusses/
- https://www.gegevensbeschermingsautoriteit.be/burger/thema-s/privacy-op-de-werkplek/toezicht-van-de-werkgever/professionele-telefoongesprekken
- https://www.recordinglaw.com/world-laws/world-recording-laws/ireland-recording-laws/
- https://www.legislation.gov.uk/uksi/2018/356/contents/made
- https://ico.org.uk/for-organisations/uk-gdpr-guidance-and-resources/employment/monitoring-workers/specific-data-protection-considerations-for-different-ways-or-methods-of-monitoring-workers/

# Runbook: AI-transparency disclosure

> Governs AI-disclosure runs: the duties that attach when a product's AI interacts with
> people - website/policy disclosure text, in-product disclosure surfaces, and the
> provider-to-deployer pass-throughs. Substance lives in `references/ai-act-transparency.md`
> (EU AI Act Art 50, verbatim-verified) and `references/call-recording-consent-eu.md`
> (recording/transcription duties, which usually co-occur for voice AI).

## Purpose and applicability

Applies to any product whose AI interacts with natural persons (chatbots, voice agents,
AI-generated outreach) or generates synthetic content. EU AI Act Article 50 transparency
duties apply from 2 Aug 2026 (verified against Art 113); before that date this policy is
preparation with a hard deadline, after it an obligation. This runbook produces, as the
product needs them: a public AI-transparency statement (or section in existing policies),
in-product disclosure copy (voice announcements, chat labels, content marking), and - for
B2B products whose CUSTOMERS deploy the AI toward THEIR users - the deployer-facing guidance
and contractual pass-throughs.

## Mode detection specifics

Three surfaces to check: public disclosure text (site/policies), in-product disclosure
(agent config, first-message templates, UI labels - often configured on an EXTERNAL platform
and invisible to the repo: ask), and deployer guidance/contract clauses (for B2B). Missing
surface -> CREATE for that surface; present -> verify wording against the reference's
verbatim duty anchors.

## Investigation focus (extends the standard Phase 2 team)

- **Map the AI surfaces**: which features have AI talking to or generating content for
  people; which are provider-operated vs customer-deployed.
- **Role split per Art 50** (reference section 4): the business building/selling the AI
  system = provider (Art 50(1): design so people are informed, unless obvious); its
  customers deploying it toward their own users = deployers (Art 50(4) duties for certain
  content; recording notices under the call-recording reference). What each must do, and
  what the provider must expose to deployers (configurable announcements, marking,
  documentation).
- **In-product disclosure reality**: where the first-interaction disclosure actually lives
  (voice-agent opening line, chat UI label, email/SMS marking) - platform config counts as
  product behavior; if it lives at an env-var-only vendor, ask the user for the actual
  config and record it in the memory store.
- **Synthetic-content outputs** (Art 50(2)): does the product generate audio/text sent
  onward (voicemail drops, follow-up messages)? Marking duties attach (reference section 2).
- **Recording/transcription co-occurrence**: voice AI almost always records/transcribes -
  run the `references/call-recording-consent-eu.md` decision forks (member-state table, duty
  allocation, announcement patterns) alongside Art 50; one opening announcement usually has
  to do both jobs.

## Drafting non-negotiables

- **Verbatim duty anchors** from `references/ai-act-transparency.md` section 2 - never
  paraphrase the obligation looser than the text; the primary OJ PDF is at
  `assets/sources/eu-ai-act-2024-1689.pdf` for anything load-bearing.
- **Risk-classification sanity check** (reference section 6): confirm the product is not
  high-risk under Annex III (the reference's trap table lists the look-alikes); record the
  conclusion + reasoning in the memory store. High-risk suspicion -> stop and flag for counsel,
  do not draft around it.
- **Disclosure patterns per surface** (reference section 8): voice = disclosure in the
  OPENING announcement (clear, distinguishable, at first interaction, accessible - Art
  50(5)); chat = persistent label; generated messages = marking. Combine with the recording
  notice per the call-recording reference's script patterns; language(s) of disclosure =
  the languages the AI actually serves (from the memory store/product).
- **Provider pass-throughs for B2B** (reference section 4): what the deployer-facing docs
  and the terms/DPA must give customers (announcement configurability, marking, usage
  constraints); cross-reference the terms runbook rather than duplicating clauses.
- **Penalties stated only from the verified Art 99 figures** (reference section 5), if
  stated at all.
- **Guidance status is time-sensitive** (reference section 7 + UNRESOLVED): Commission Art
  50 guidance and the marking Code of Practice were not final as of the reference's
  Verified date - re-verify live before relying on draft positions.
- GDPR layering: the AI disclosure does not replace Art 13 notice duties or the privacy
  policy - it cross-references them (reference's GDPR-layering section).

## Required structure (public statement)

What the AI does and where people encounter it; the fact that users are interacting with AI
and how they are told in-product; synthetic-content marking practice; human-escalation path
if one exists (never claim one that does not); provider/deployer role explanation for B2B;
recording/transcription cross-reference to the privacy policy; contact; last-updated date.

## Verification specifics (extends Phase 4)

- Every claimed disclosure surface verified to actually carry the disclosure (in-repo
  config, or user-confirmed platform config recorded in the memory store with its wording).
- Duty-anchor walk: each Art 50 paragraph either satisfied, N/A with reasoning, or open
  blocker; the Art 113 date claim and classification conclusion re-checked.
- Recording-notice consistency with the privacy policy and the member-state duties for the
  markets actually served.
- For B2B: deployer guidance exists and the terms/DPA actually carry the pass-throughs.

## Ask the user (never invent)

- The actual in-product disclosure/announcement config wherever it lives outside the repo
  (voice-platform first message, recording toggle, regional defaults) - verbatim wording.
- Which markets/languages the AI serves, if the memory store is ambiguous.
- Whether a human-escalation path exists operationally.
- Deployer-customer contractual posture (who signs what) for the pass-through clauses.

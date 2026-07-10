# Runbook: cookie policy

> Governs cookie-policy runs: the policy page AND the consent decision (banner, or a
> documented exemption from needing one). Generic to any project; all project facts come
> from Phase 2 investigation and the project memory store. Procedure generalized from a
> production-proven project runbook on 2026-07-05.

## Purpose and accuracy bar

Deliver a cookie policy where every cookie listed exists, every cookie that exists is
listed, and every regulatory claim (durations, exemptions, banner rules) is cited from the
CNIL references (`references/cookies-cnil.md`, `references/legal-bases-cookies-cnil.md`,
`references/retention-periods-cnil.md`, primary PDFs in `assets/sources/`) - never from
memory. CNIL doctrine is the strictest-EU bar; output language and phrasing ("your
supervisory authority") come from the memory store.

## Mode detection specifics

Expected page found in Phase 1 (or memory store). Missing -> CREATE: build the page matching the
project's existing legal pages in style/layout, and add the navigation/footer link alongside
the other legal links. Present -> VERIFY-AND-UPDATE: diff every claim against the fresh
inventory; bump the update date only if content changed.

## Investigation focus (extends the standard Phase 2 team)

Four hunters, launched together, each read-only and no-spawn:

1. **First-party** - everything the app itself sets: auth/session cookie config (names,
   attributes, lifetimes resolved from ACTUAL config, not guesses), any
   `document.cookie`/`Set-Cookie` usage, plus localStorage/sessionStorage/IndexedDB - these
   are trackers under ePrivacy and belong in the policy too.
2. **Third-party scripts** - anything letting a third party set cookies or fingerprint:
   dependencies, every layout/page for script/iframe/embed tags, analytics SDKs, chat
   widgets, runtime web fonts, payment SDKs (WHERE do they load: public pages or
   authed-only?), any embedded video/social. For each hit: which routes, before or after
   authentication, and which cookies the vendor documents it sets (fetch the vendor's cookie
   documentation).
3. **Infra/edge** - cookies set outside app code: CDN/proxy (bot management, challenges),
   hosting platform, middleware/headers config. Anything unknowable from the repo goes on
   the ask-the-user list.
4. **Legal surface** - does the cookie page exist; what do the OTHER policies currently
   claim about cookies (they must not contradict this one); is the nav link present; any
   consent banner/CMP component anywhere.

Reconcile into ONE inventory table: cookie/tracker name, who sets it, first seen on which
route, authed or public, purpose, lifetime, category (strictly necessary / analytics /
functionality / advertising / social), consent required yes/no, and a source citation for
the categorization. Ambiguous categorizations (e.g. a payment provider's fraud-prevention
cookie: necessary-for-the-service vs consent-required) are researched against the CNIL
references and the vendor's own documentation, decided explicitly, and recorded in the
memory store with reasoning - never silently assumed.

## The banner decision (a decision, not a default)

- **Only strictly-necessary cookies exist** -> NO consent banner is required (ePrivacy
  exemption; confirm the reasoning in `references/legal-bases-cookies-cnil.md`). Do NOT
  build one - a banner asking consent for nothing is itself misleading. The policy page +
  nav link satisfy the information duty. Record the decision AND its premise in the memory store,
  and re-verify the premise every run.
- **Any non-essential cookie/tracker present** (analytics, marketing pixels, embeds, a
  widget, a payment SDK on PUBLIC pages) -> a compliant banner is mandatory BEFORE that
  tracker fires: equal-prominence Accept/Reject (Reject is not a dark-pattern link), nothing
  non-essential set before an explicit choice, granular per-category toggles, consent stored
  in a first-party cookie with the lifetime the CNIL references prescribe, a persistent way
  to reopen preferences (e.g. a footer "Cookie settings" link), shown on every entry route.
  Gate every non-essential script on stored consent state - blocking must be real, not
  cosmetic. Skeletons in `references/implementation-snippets.md`; consent-validity rules in
  `references/legal-bases-cookies-cnil.md`. New gating logic gets unit tests per the
  project's conventions.
- Each run, explicitly check whether anything landed since the last run that flips the
  decision (the memory store's Known state lists the premise to re-test).

## Required structure

Per the CNIL-derived skeleton (`references/cookies-cnil.md`; docx template
`assets/template-politique-cookies.docx` as structural precedent - translate meaning to the
memory store's output language, keep the section coverage): what cookies/trackers are; who places
them (entity identity from the memory store); the full inventory table; the
necessary-vs-consent-required split; how to manage preferences (banner reopen link if one
exists + browser instructions); retention periods; update date; contact.

## Verification specifics (extends Phase 4)

- **Completeness**: the verifier re-derives the cookie inventory from scratch (fresh greps,
  without the Phase 2 output) and diffs against the policy table. In code but not policy, or
  in policy but not code = FAIL.
- **Legal**: every regulatory claim in the policy and banner checked against the CNIL
  references (read the primary PDFs in `assets/sources/` for anything load-bearing):
  durations, consent wording, exemption reasoning, refuse-as-easy-as-accept, no dark
  patterns. Cite the source for each verdict.
- **Consistency**: no other page (privacy, terms, marketing copy like "GDPR compliant"
  claims) may disagree with this policy about the same fact; actual auth/payment config
  values match what the policy states.
- If a banner exists: verify in a real browser (per the project's conventions) that no
  non-essential cookie is set before consent and that Reject actually blocks.

## Ask the user (never invent)

- Entity identity for the "who places cookies" section - check the memory store first.
- Which edge/CDN features are enabled on the live zone (cookies invisible to the repo).
- Confirmation of any vendor-cookie ambiguity the references cannot settle.

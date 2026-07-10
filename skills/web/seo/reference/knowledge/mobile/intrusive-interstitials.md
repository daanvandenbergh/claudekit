---
updated: 2026-07-09
source: https://developers.google.com/search/docs/appearance/avoid-intrusive-interstitials (primary; last updated 2025-12-10) ; https://searchengineland.com/guide/interstitials-and-dialogs (accessed 2026-07-09)
type: fact
tags: [mobile, interstitials, popups, page-experience, ranking]
---

# Intrusive interstitials demote mobile pages (with narrow exceptions)

Google demotes mobile pages whose main content is blocked on arrival from Search by an interstitial, and mobile-first indexing makes this a mobile-primary concern; a narrow set of legally-required, login-gate, and reasonably-sized dismissible banners is exempt.

## Facts
- The intrusive-interstitials demotion (launched Jan 10, 2017, still active in 2026) targets three patterns on mobile: (1) a popup covering main content immediately after arriving from Search; (2) a standalone interstitial the user must dismiss before reaching content; (3) a deceptive layout where an above-the-fold overlay pushes the real content below the fold. This three-pattern taxonomy comes from the **historical 2017 announcement / third-party synthesis** — Google's current official doc no longer enumerates it in that explicit form, now just saying "don't obscure the entire page with interstitials" and "don't redirect the user to a separate page for consent/input." The underlying 2017 ranking signal is still active. [2017 announcement][searchengineland][hobo]
- It applies to the page the user lands on from Search results; rules are far stricter on mobile than desktop, and mobile-first indexing means the mobile version is the version judged. [tba-berlin]
- Exempt (not penalized), split by provenance: (a) **Google's current doc explicitly exempts** only "mandatory interstitials" — legally/technically-required ones, its sole worked example being an **age gate** ("a casino site may need to show an age gate"); it also recommends platform Smart App Banners over full-page interstitials for app-install promotion (framed as the correct pattern, not an "exemption"). [google-primary] (b) The **broader list** — cookie/GDPR consent, login/paywall gates for non-indexable content, exit-intent popups, and small dismissible banners — is a **third-party (SearchEngineLand/industry) interpretation** extrapolated from the 2017 announcement and general page-experience guidance, NOT verbatim in the current official doc. These patterns are still low-risk in practice, but treat the broader list as secondary/interpretive, not directly Google-sourced. [searchengineland][smashing]
- Part of the broader page-experience signal set; the Dec 2025 and Feb 2026 core updates were reported to weight page experience (slow pages, high CLS, intrusive interstitials) more heavily — correlational, third-party analysis, not a Google-stated ranking weight. [clickrank][tba-berlin]

## Related
- [mobile-usability-signals](../mobile/mobile-usability-signals.md)
- [mobile-first-parity](../mobile/mobile-first-parity.md)

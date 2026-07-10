---
updated: 2026-07-09
source: https://developer.chrome.com/docs/lighthouse/seo/tap-targets (accessed 2026-07-09)
type: fact
tags: [mobile, usability, tap-targets, font-size, viewport, accessibility]
confidence: low
---

# Mobile usability: legible fonts, tap-target spacing, correct viewport

A mobile page should use legible font sizes, tap targets that are large enough and spaced apart to hit reliably, and a correctly configured viewport; the numeric thresholds come from Lighthouse/WCAG rather than a published Google ranking cutoff, so treat them as guidance not gospel.

## Facts
- Lighthouse "legible font sizes" audit passes when ≥60% of text (by character count) is ≥12px; common safe practice is ≥16px body / 14px captions / never below 12px. [chrome-lighthouse][greadme]
- Tap-target guidance clusters around a ≥44–48px CSS-pixel target with ≥8px spacing (WCAG 2.5.8 minimum target size is 24×24 CSS px; 44×44 is the AAA/comfortable size); these are accessibility rules, not an exact Google ranking threshold. [chrome-lighthouse][testparty][digitalgov]
- A correct viewport meta configuration is a prerequisite for all of the above (mechanics deferred → see metadata domain).
- Caveat: Google deprecated the standalone Mobile-Friendly Test tool and the Search Console Mobile Usability report (late 2023), so these criteria are no longer surfaced as a dedicated report — but they remain real usability/page-experience concerns and are still checkable via Lighthouse and manual device testing. [chrome-lighthouse]
- Single-sourced numeric thresholds here are rot-prone (tool defaults shift, WCAG revises) — verify against current Lighthouse/WCAG before citing a specific px value. [chrome-lighthouse]

## Related
- [mobile-first-parity](../mobile/mobile-first-parity.md)
- [intrusive-interstitials](../mobile/intrusive-interstitials.md)

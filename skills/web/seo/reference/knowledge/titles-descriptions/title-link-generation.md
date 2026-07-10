---
updated: 2026-07-09
source: https://developers.google.com/search/docs/appearance/title-link (accessed 2026-07-09)
type: fact
tags: [titles-descriptions, on-page, title, serp]
---

# How Google builds and rewrites the SERP title link

The title link is auto-generated — Google uses your <title> the majority of the time but replaces it when it is empty, stale, inaccurate, boilerplate, or duplicative, so quality of the title element (not its length) is the lever.

## Facts
- The title link is fully automated; Google draws from the <title> element, the main visible page title, heading elements (esp. <h1>), og:title, other large/prominent styled text, other page text, on-page anchor text, inbound links' anchor text, and WebSite structured data. [g-title-link]
- Google uses the page's own <title> element as the title link the majority of the time — ~87% since the Sept 2021 update (up from ~80%). [g-titles-2021]
- Google replaces the <title> for 7 specific reasons: (1) half-empty/missing title text, (2) obsolete/stale title not matching visible content, (3) inaccurate title, (4) micro-boilerplate (near-identical titles across similar pages lacking distinguishing detail), (5) no clear single main title (multiple equally prominent headings), (6) title language/writing-system mismatch vs page content, (7) redundant site-name repetition already shown separately. [g-title-link]
- Best practice per Google: give every page a title; write descriptive, concise, distinct text; avoid keyword stuffing; keep branding concise so it does not repeat across pages; make the main title visually prominent. [g-title-link]
- Vendor field data: aligning the <title> with the page H1 is the single biggest rewrite-reduction lever; Google was reported to have changed ~76% of title tags in Q1 2025. [sel-76]

## Related
- [title-uniqueness-duplication](../titles-descriptions/title-uniqueness-duplication.md)
- [thresholds](../foundations/thresholds.md)
- [meta-description-snippet-role](../titles-descriptions/meta-description-snippet-role.md)

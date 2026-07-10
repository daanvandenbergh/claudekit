---
updated: 2026-07-09
source: https://developer.x.com/en/docs/x-for-websites/cards/overview/markup (accessed 2026-07-09)
type: fact
tags: [social, twitter-cards, x, meta-tags, previews]
confidence: low
---

# Twitter/X Cards — card types, tags, and OG fallback

X needs one twitter:card declaration to pick the layout, but falls back to og:title/description/image for the content, so a single twitter:card tag on top of good OG is the minimal correct setup.

## Facts
- twitter:card values: summary (small square thumbnail), summary_large_image (full-width banner), plus app and player. [x-docs]
- Twitter/X tags use name=, not property= (unlike OG which uses property=): <meta name="twitter:card" content="summary_large_image">. [vendor]
- Content tags: twitter:title, twitter:description, twitter:image, twitter:image:alt, twitter:site (@account), twitter:creator. [x-docs]
- X FALLS BACK to og:* when twitter:* is absent: no twitter:title -> uses og:title; no twitter:image -> uses og:image. But the twitter:card tag itself is still required to choose the layout. [vendor]
- Practical minimal setup: complete OG tags + one twitter:card (summary_large_image) tag; do not duplicate every value. [vendor]
- twitter:image:alt caps around 420 chars; provide it for accessibility parity with og:image:alt. [vendor]
- X caches card images aggressively; force a refresh with the X/Twitter Card Validator after changing an image URL. [vendor]

## Related
- [open-graph](../social/open-graph.md)
- [og-image-specs](../social/og-image-specs.md)
- [preview-caching](../social/preview-caching.md)

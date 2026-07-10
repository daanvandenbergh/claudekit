---
updated: 2026-07-09
source: https://developers.facebook.com/docs/sharing/best-practices/ (accessed 2026-07-09)
type: reference
tags: [social, open-graph, twitter-cards, images, dimensions]
confidence: low
---

# Recommended social share-image dimensions and file limits

One 1200x630 (~1.91:1) JPG/PNG at an absolute HTTPS URL works across Facebook, X large card, LinkedIn, Slack, Discord, WhatsApp, and iMessage.

## Facts
- Recommended og:image: 1200x630 px, aspect ratio ~1.91:1 — the single size that serves Facebook, X summary_large_image, LinkedIn, Slack, Discord, WhatsApp, iMessage. [vendor]
- Facebook guidance: use images "at least 1080 pixels in width"; absolute minimum ~600 px wide. [fb-bp]
- Facebook display floor ~600x315; images below 200x200 are rejected. [vendor]
- Twitter/X summary_large_image: ~2:1 (also accepts 1200x675/16:9); min 300x157, max 4096x4096; file must be < 5 MB; formats JPG/PNG/WebP/GIF (first frame only). [vendor]
- Facebook file cap up to 8 MB, but keep under ~1 MB for fast fetch and to survive re-compression. [vendor]
- og:image URL must be ABSOLUTE and HTTPS (use og:image:secure_url); relative paths break unfurls. [fb-wm]
- Always set og:image:width/height so the preview lays out correctly on first share (before the image is fetched). [fb-wm]
- Keep headline/faces inside a center ~1080x600 safe zone; platforms crop edges differently. [vendor]

## Related
- [open-graph](../social/open-graph.md)
- [twitter-cards](../social/twitter-cards.md)

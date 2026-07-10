---
updated: 2026-07-09
source: https://developers.google.com/search/docs/crawling-indexing/sitemaps/image-sitemaps ; https://developers.google.com/search/docs/crawling-indexing/sitemaps/news-sitemap (accessed 2026-07-09)
type: reference
tags: [sitemaps, images, video, news, extensions, hreflang]
confidence: low
---

# Image, video, news (and hreflang) sitemap extensions

Google supports XML sitemap extensions that annotate URLs with image, video, and (Google News) news metadata; hreflang alternates can also be declared in the sitemap.

## Facts
- Image extension: only `<image:image>` (parent) and `<image:loc>` are documented as current/required, capped at up to **1,000 `<image:image>` tags per `<url>` entry**. Google has **REMOVED** `<image:caption>`, `<image:geo_location>`, `<image:title>`, and `<image:license>` from its docs — these sub-tags are deprecated and no longer processed; don't flag their absence, and flag their presence only as harmless cruft, not an error. Video extension (`video:video` with title, thumbnail, duration, etc.) lets a URL entry declare its media; both are optional and only help if the media matters for discovery. [Google Search Central]
- News sitemaps (`news:news`) are only for sites accepted into Google News and should contain URLs published in the last 2 days; required child tags are `<news:publication>` (wrapping `<news:name>` + `<news:language>`), `<news:publication_date>`, and `<news:title>`. A niche, not a default requirement. [Google Search Central]
- hreflang alternates can be expressed in the sitemap via `xhtml:link rel="alternate" hreflang=...` per URL — DEFER the hreflang rules and correctness checks to the `hreflang` domain folder. [Google Search Central]
- confidence: low only because the exact extension tag inventory rot-checks less often than the core facts above — the core (extensions exist for image/video/news) is stable and high-confidence; treat specific tag names as verify-on-use.

## Related
- [sitemap-url-eligibility](../sitemaps/sitemap-url-eligibility.md)

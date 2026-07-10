---
updated: 2026-07-09
source: https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap ; https://developers.google.com/search/docs/crawling-indexing/sitemaps/large-sitemaps (accessed 2026-07-09)
type: reference
tags: [sitemaps, sitemap-index, encoding, location]
---

# Sitemap file location, encoding, and index-file mechanics

A sitemap's own URL location scopes which URLs it may legitimately list, the file must be UTF-8 (gzip optional), and a sitemap INDEX file (distinct from a plain sitemap) has its own 50,000-entry cap plus a separate 500-index Search Console submission ceiling.

## Facts
- **Directory scope rule**: unless submitted through Search Console, a sitemap placed at `https://example.com/sub/sitemap.xml` can only be trusted for URLs at or below `/sub/` — Google will not credit it for URLs outside that path. Placing the sitemap at the site root avoids this limitation entirely. [Google Search Central, build-sitemap]
- The sitemap file **must be UTF-8 encoded**. [Google Search Central, build-sitemap]
- Sitemaps may be **gzip-compressed** (`.xml.gz`) to reduce transfer size; Google's own examples use this format. [Google Search Central, large-sitemaps]
- A **sitemap index file** is a distinct XML shape (root `<sitemapindex>`, repeated `<sitemap>` blocks each with `<loc>` and optional `<lastmod>`, namespace `http://www.sitemaps.org/schemas/sitemap/0.9`) used only to list *other* sitemap files, not URLs. [Google Search Central, large-sitemaps]
- A sitemap index file may contain **up to 50,000 `<loc>` (child-sitemap) entries** — this is the same cap already recorded in [thresholds](../foundations/thresholds.md) (which also debunks the "500 sitemaps per index" myth). Distinct from that: Search Console itself will accept **up to 500 sitemap-index files submitted per property** — a submission-count ceiling in the tool, not a per-index content limit. Don't conflate the two. [Google Search Central, large-sitemaps]

## Related
- [sitemap-url-eligibility](sitemap-url-eligibility.md)
- [thresholds](../foundations/thresholds.md)

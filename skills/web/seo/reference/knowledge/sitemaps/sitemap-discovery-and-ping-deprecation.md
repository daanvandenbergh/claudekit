---
updated: 2026-07-09
source: https://developers.google.com/search/blog/2023/06/sitemaps-lastmod-ping (accessed 2026-07-09)
type: fact
tags: [sitemaps, robots-txt, search-console, ping, indexnow, deprecation]
---

# Sitemap discovery and the death of ping endpoints

The unauthenticated HTTP sitemap "ping" endpoints were removed in 2023 (Google returns 404, Bing returns 410 Gone); submit sitemaps via a robots.txt `Sitemap:` directive plus Search Console / Bing Webmaster Tools, and use IndexNow for fast Bing/Yandex change notification.

## Facts
- Reference a sitemap from robots.txt by inserting `Sitemap: https://example.com/sitemap.xml` on its own line anywhere in the file; the URL must be absolute, and you may list multiple Sitemap: lines (no limit). [Google Search Central] (robots.txt spec itself → DEFER to robots-ai-crawlers/crawlability)
- Google DEPRECATED the sitemaps ping endpoint (`/ping?sitemap=`) in the June 2023 announcement; it stopped working ~6 months later (end of 2023) and now returns HTTP 404. Existing code hitting it causes no harm — just make no more changes. [Google Search Central blog 2023-06]
- Reason given: the vast majority of unauthenticated ping submissions were spam / not useful. [Google Search Central blog 2023-06]
- Bing likewise retired its XML sitemap ping (`bing.com/ping`), which now returns HTTP 410 Gone; Bing points sites to IndexNow instead for near-instant change notification. [Bing/IndexNow docs, vendor-corroborated]
- Correct 2026 discovery/submission stack: (1) robots.txt `Sitemap:` directive, (2) Google Search Console + Bing Webmaster Tools sitemaps report, (3) IndexNow for per-URL push to Bing/Yandex. No HTTP ping. [Google Search Central blog 2023-06]

## Related
- [thresholds](../foundations/thresholds.md)
- [sitemap-lastmod-and-ignored-tags](../sitemaps/sitemap-lastmod-and-ignored-tags.md)

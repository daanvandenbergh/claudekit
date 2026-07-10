---
updated: 2026-07-09
source: https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap (accessed 2026-07-09)
type: fact
tags: [sitemaps, lastmod, crawl-scheduling, changefreq, priority]
---

# lastmod correctness; changefreq and priority are ignored

<lastmod> feeds crawl scheduling but only if Google finds it consistently and verifiably accurate — so it must reflect genuine significant changes; <changefreq> and <priority> are ignored entirely.

## Facts
- "Google uses the <lastmod> value if it's consistently and verifiably (for example by comparing to the last modification of the page) accurate." A site that stamps every URL with today's date teaches Google to distrust and ignore lastmod. [Google Search Central]
- <lastmod> should reflect the last SIGNIFICANT update (main content, structured data, or links) in W3C Datetime / ISO 8601 form; cosmetic changes like a copyright-year bump do NOT count as significant. [Google Search Central]
- "Google ignores <priority> and <changefreq> values." — do not spend effort tuning them. [Google Search Central]
- lastmod is the primary in-sitemap signal Google now uses to schedule recrawls, which is why its accuracy matters more after the ping endpoint went away. [Google Search Central blog 2023-06]

## Related
- [sitemap-url-eligibility](../sitemaps/sitemap-url-eligibility.md)
- [sitemap-discovery-and-ping-deprecation](../sitemaps/sitemap-discovery-and-ping-deprecation.md)

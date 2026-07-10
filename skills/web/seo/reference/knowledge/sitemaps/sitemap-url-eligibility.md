---
updated: 2026-07-09
source: https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap (accessed 2026-07-09)
type: fact
tags: [sitemaps, canonical, indexation, crawlability]
---

# Which URLs belong in a sitemap

Include only the canonical, indexable, 200-status URL you want shown in search results; excluding non-canonical, noindex, redirecting, or robots-blocked URLs keeps the sitemap a clean discovery signal.

## Facts
- Put in the sitemap "the URLs you want to see in Google's search results" — i.e. the canonical version; Google generally displays canonical URLs and the sitemap is one signal that influences that choice. [Google Search Central]
- When the same content is reachable at several URLs, list only ONE preferred (canonical) URL, not every duplicate. [Google Search Central]
- Do NOT list URLs that are noindex, redirect (3xx), return 4xx/5xx, are canonicalised elsewhere, or are disallowed in robots.txt — mixing these in wastes crawl budget and dilutes the signal. Sitemaps should contain only 200-status, index-eligible URLs. [Google Search Central]
- A sitemap is a discovery/priority hint, not an indexing guarantee: presence does not force indexing, and absence does not prevent it. [Google Search Central]

## Related
- [thresholds](../foundations/thresholds.md)
- [sitemap-lastmod-and-ignored-tags](../sitemaps/sitemap-lastmod-and-ignored-tags.md)

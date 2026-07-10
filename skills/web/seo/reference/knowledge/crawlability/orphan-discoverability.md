---
updated: 2026-07-09
source: https://developers.google.com/search/docs/crawling-indexing/links-crawlable [google-links-crawlable] ; https://developers.google.com/search/docs/fundamentals/how-search-works (accessed 2026-07-09)
type: fact
tags: [crawlability, orphan-pages, internal-linking, discovery, crawl-depth]
---

# Orphan pages and how Google discovers URLs (Google, 2026)

Google's main discovery mechanism is following links from known pages, so a page with no internal links (orphan) may never be found unless a sitemap or external link points to it.

## Facts
- Google's **primary discovery** path is following links from already-known pages to new ones; a URL with no inbound internal link is an **orphan** and can be missed entirely. [google-links-crawlable]
- Orphans are only reachable via **XML sitemaps** or **external/backlinks** — otherwise crawl-time discovery never reaches them (sitemap mechanics deferred to the sitemaps sibling). [google-links-crawlable]
- Keep important pages within ~**3 clicks** of the homepage so link-following discovery reaches them (crawl-depth band lives in [thresholds]). [thresholds]
- A page's presence in a sitemap is a discovery *hint*, not a guarantee of crawl or index — internal links remain the strongest, most reliable discovery signal. [google-links-crawlable]

## Related
- sitemaps
- js-rendering
- [thresholds](../foundations/thresholds.md)
- [crawl-budget-and-server-health](../crawlability/crawl-budget-and-server-health.md)

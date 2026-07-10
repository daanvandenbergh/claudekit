---
updated: 2026-07-09
source: https://developers.google.com/search/docs/crawling-indexing/large-site-managing-crawl-budget ; https://developers.google.com/search/docs/crawling-indexing/http-network-errors (accessed 2026-07-09)
type: fact
tags: [crawlability, crawl-budget, server-response, http-status, ttfb]
confidence: low
---

# Crawl budget, and how server health governs it (Google, 2026)

Crawl budget is crawl-capacity-limit (raised by fast responses, lowered by slow ones and 5xx/429) times crawl-demand, and only large or fast-changing sites need to actively manage it.

## Facts
- **Crawl budget = crawl capacity limit × crawl demand.** Capacity limit = max parallel connections + delay between fetches Google will use; demand = Google's appetite, set by site size, update frequency, and page quality/popularity. [google-crawl-budget]
- **Server health directly steers the capacity limit**: fast responses over time raise it; slowdowns or server errors lower it and Google crawls less. (Ties to the ≤ 0.8s TTFB target in [thresholds].) [google-crawl-budget]
- **Who actually needs to manage crawl budget** (heuristic, rot-prone — verify): sites of ~**1,000,000+ pages** with moderate (weekly) change; ~**10,000+ pages** changing daily; or any site with many URLs stuck in "Discovered – currently not indexed." Google says if pages are crawled the same day they're published, you don't need the guide. [google-crawl-budget]
- **Budget wasters** Google names: faceted-nav/parameter URLs, session identifiers, on-site duplicates, soft 404s, hacked/spam/low-value pages, stale sitemaps, and long redirect chains. [google-crawl-budget]
- **HTTP status → crawl effect**: 2xx crawled/eligible; **4xx (except 429)** → URL not indexed, dropped if previously indexed; **5xx and 429** → Google temporarily **slows** crawling and, if persistent, drops URLs from the index; recovery is gradual once 2xx returns. [google-http-errors]
- **Soft 404** (a "not found"/empty page served as 200) wastes budget because Google keeps re-crawling it — return a real **404/410** for gone content. [google-http-errors]
- **Best practice**: for planned downtime/overload, return **503 or 429** (temporary) so URLs aren't dropped — never a 200 error page or a blanket robots block. [google-http-errors]

## Related
- [crawl-traps](../crawlability/crawl-traps.md)
- [googlebot-fetch-behavior](../crawlability/googlebot-fetch-behavior.md)
- [thresholds](../foundations/thresholds.md)
- urls-redirects

---
updated: 2026-07-09
source: https://developers.google.com/crawling/docs/troubleshooting/http-status-codes (accessed 2026-07-09)
type: fact
tags: [urls-redirects, indexation, crawlability, status-codes]
---

# HTTP status-code SEO meaning (how Googlebot handles each)

Googlebot interprets status codes as indexing signals — 200 passes content forward, 301/308 are strong canonical signals, 302/303/307 weak, 304 reuses cached content, 404/410 remove the URL, and 5xx/429 slow crawling then eventually drop the URL.

## Facts
- 200 — content passed to the next (indexing) step; indexing is still not guaranteed. Only 200 URLs should be in sitemaps/internal links. [http-status-codes]
- 301 (and 308, its equivalent) — used as a STRONG signal that the redirect target should be processed/canonical. [http-status-codes]
- 302 (and 307, its equivalent; 303 treated like 302) — used as a WEAK signal; the original URL is kept in the index. [http-status-codes]
- 304 Not Modified — Google reuses the content version from the last crawl (empty body); saves crawl budget by not re-fetching unchanged pages. [http-status-codes]
- 404 (Not Found) and 410 (Gone) — both tell Google the content doesn't exist; previously indexed URLs get removed, new ones aren't processed. 410 is a clearer/faster "permanently removed" signal; 404s get re-crawled at reducing frequency in case they return. [http-status-codes]
- 429 Too Many Requests — treated as a server-overload/server-error signal; triggers crawl-rate reduction (unlike other 4xx). [http-status-codes]
- 5xx (500/502/503) — crawlers temporarily slow down and ignore the content; already-indexed URLs are preserved but eventually dropped if the error persists; crawl rate recovers gradually after recovery. Use 503 for planned/temporary downtime, never 200/404. [http-status-codes]
- Status semantics per RFC 9110 (200/301/302/304/404/410/5xx) underlie these behaviors. [RFC 9110]

## Related
- [thresholds](../foundations/thresholds.md)
- [canonical-host-consolidation](../urls-redirects/canonical-host-consolidation.md)

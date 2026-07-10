---
updated: 2026-07-09
source: https://support.google.com/webmasters/answer/7440203 (accessed 2026-07-09)
type: reference
tags: [indexability, search-console, coverage, soft-404]
---

# Google Search Console index-coverage states and what each signals

The Page-indexing report's exclusion states are the audit's diagnosis vocabulary — "Discovered - currently not indexed" is a crawl-budget/capacity backlog (not yet fetched), "Crawled - currently not indexed" is a QUALITY verdict (fetched, judged not worth indexing), and "Soft 404" is a 200 response serving empty/"not found" content — each points to a different fix.

## Facts
- "Discovered - currently not indexed": Google found the URL but has NOT crawled it yet — typically it rescheduled the crawl to avoid overloading the site; signals crawl-budget/capacity or low perceived priority, not a page defect per se. [gsc-page-indexing]
- "Crawled - currently not indexed": Google crawled the page but chose not to index it — a content value/quality judgement; at scale this is the primary index-bloat / thin-content signal. [gsc-page-indexing]
- "Soft 404": the page returns a success (200) status while showing a user-facing "not found"/empty message — pollutes the index and wastes crawl; fix by returning a real 404/410 or restoring real content. [gsc-page-indexing]
- "Excluded by 'noindex' tag" / "URL blocked by robots.txt" are separate explicit states — the first means a `noindex` was seen and honored; the second means the crawl was blocked (see noindex-requires-crawlable). [gsc-page-indexing]

## Related
- [noindex-requires-crawlable](../indexability/noindex-requires-crawlable.md)
- [index-bloat-pruning](../indexability/index-bloat-pruning.md)
- crawlability

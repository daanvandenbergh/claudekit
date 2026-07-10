---
updated: 2026-07-09
source: https://developers.google.com/search/docs/crawling-indexing/block-indexing (accessed 2026-07-09)
type: procedure
tags: [indexability, index-bloat, thin-content, pruning]
confidence: low
---

# Diagnosing and pruning index bloat / thin low-value pages

"Index bloat" is a large tail of thin, duplicate, auto-generated, or parameter/faceted URLs that get crawled but judged not worth indexing — it wastes crawl budget and dilutes site quality signals, so the remedy is to consolidate or return real value where warranted and `noindex` (crawl-allowed) or 404/410 the genuinely valueless, not to blanket-noindex.

## Steps
1. A large "Crawled - currently not indexed" count is the diagnostic footprint of index bloat — Google fetched the URLs and declined to index on quality/value grounds. [gsc-page-indexing]
2. Common bloat sources: faceted/filter & sort parameter URLs, internal search-result pages, tag/archive paginated tails, session-ID URLs, boilerplate auto-generated pages, near-duplicate thin pages. ["index-bloat" is an SEO-community term, not a Google label — treat the taxonomy as community consensus, not a primary spec]
3. Remediation ladder: (1) improve/consolidate pages that could earn value; (2) for genuinely valueless pages serve `noindex` while keeping them crawlable so the directive is seen (see noindex-requires-crawlable); (3) return `410`/`404` for pages that should not exist. Robots.txt `Disallow` is crawl control, NOT de-indexing — it does not remove already-indexed URLs. [block-indexing]
4. Distinguish from duplicate consolidation: pick ONE tool per intent — `noindex` removes a page from the index; `rel=canonical` consolidates duplicates without removal (defer to canonicalization). [robots-meta-tag]

## Related
- [index-coverage-states](../indexability/index-coverage-states.md)
- [noindex-requires-crawlable](../indexability/noindex-requires-crawlable.md)
- canonicalization
- crawlability

---
updated: 2026-07-09
source: https://developers.google.com/search/blog/2013/04/5-common-mistakes-with-relcanonical (accessed 2026-07-09)
type: reference
tags: [canonicalization, mistakes, audit, pagination, soft-404]
---

# Common canonical mistakes that break consolidation

The canonical failures that silently split or destroy ranking signals: pointing to a non-200 / non-preferred / noindexed target, canonicalizing paginated pages to page 1, declaring multiple canonicals, and insufficient content overlap.

## Facts
- Canonical to a non-existent/broken target — must point to a live 200 URL with real content, "not a 404, or worse, a soft 404." A canonical to a redirect adds a hop and dilutes the signal; resolve to the final URL. [google-5mistakes]
- Canonical to a `noindex` or robots.txt-blocked page — self-contradictory: you consolidate onto a page told to leave the index; Google likely ignores it. [google-consolidate]
- Canonical to a non-preferred host/scheme — e.g. http instead of https, or `www` vs non-`www` that itself 301s elsewhere; the canonical must be the actual preferred origin or the whole cluster can canonicalize off-page (a base-URL misconfig can de-index the whole site). Host/scheme consolidation → see urls-redirects (deferred). [google-5mistakes][google-canonicalization]
- Paginated pages canonicalized to page 1 — wrong: pages 2..N are NOT duplicates of page 1, so their content "would result in ... not being indexed at all." Each paginated page should self-canonicalize. [google-5mistakes]
- Multiple `rel="canonical"` on one page — all are ignored (see canonical-placement-and-format). [google-5mistakes]
- Insufficient content overlap — "most of the main text content of a duplicate page" should also appear on the canonical; otherwise Google treats them as distinct and ignores the tag. [google-5mistakes]
- Conflicting signals across methods (canonical says A, sitemap lists B, redirect goes to C) weaken all of them — keep every consolidation signal pointing at one URL. [google-consolidate]

## Related
- [canonical-is-a-hint](../canonicalization/canonical-is-a-hint.md)
- [canonical-placement-and-format](../canonicalization/canonical-placement-and-format.md)
- [canonical-vs-301-vs-noindex](../canonicalization/canonical-vs-301-vs-noindex.md)

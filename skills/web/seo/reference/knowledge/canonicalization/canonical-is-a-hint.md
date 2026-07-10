---
updated: 2026-07-09
source: https://developers.google.com/search/docs/crawling-indexing/canonicalization (accessed 2026-07-09)
type: fact
tags: [canonicalization, rel-canonical, indexing, duplicate-content]
---

# rel=canonical is a hint, not a directive

Google treats `rel="canonical"` as a strong signal it can override — it clusters duplicate/near-duplicate URLs and independently selects the version it deems most representative.

## Facts
- Google defines canonicalization as "the process of selecting the representative –canonical– URL of a piece of content"; the canonical is "the URL of a page that Google chose as the most representative from a set of duplicate pages." [google-canonicalization]
- "indicating a canonical preference is a hint, not a rule" — Google may choose a different page as canonical "for various reasons." A page declaring `rel="canonical"` to itself or another URL does not force the outcome. [google-canonicalization]
- Signals Google weighs when clustering + choosing the canonical: HTTP vs HTTPS (prefers HTTPS), redirects, presence in a sitemap, and `rel="canonical"` annotations; it picks the version "objectively the most complete and useful for search users." [google-canonicalization]
- The canonical URL is crawled most often; grouped duplicates are crawled less to reduce load — so a wrong canonical also starves the real page of crawl attention. [google-canonicalization]
- Search Console's "Duplicate, Google chose different canonical than user" is this override surfacing, not necessarily a bug — it means declared vs selected canonical disagree; investigate signal conflicts rather than just re-asserting the tag. [google-canonicalization]
- Self-referencing canonical on an original page is a recommended best practice (disambiguates params/tracking variants) but is NOT strictly required — a page with no canonical is still eligible; Google will self-select. It is Tier-A safe to add precisely because it only restates the page's own URL. [google-consolidate]

## Related
- [canonical-vs-301-vs-noindex](../canonicalization/canonical-vs-301-vs-noindex.md)
- [canonical-placement-and-format](../canonicalization/canonical-placement-and-format.md)
- [common-canonical-mistakes](../canonicalization/common-canonical-mistakes.md)

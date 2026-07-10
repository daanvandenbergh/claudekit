---
updated: 2026-07-09
source: https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls (accessed 2026-07-09)
type: procedure
tags: [canonicalization, rel-canonical, http-link-header, placement, pdf]
---

# Canonical placement and format rules

A `rel="canonical"` is honored only as exactly one absolute-URL annotation in the `<head>` (or as an HTTP `Link` header for non-HTML); in the `<body>`, duplicated, or as a fragment it is discarded.

## Steps
1. Accepted only if it appears in the `<head>` — "a rel=canonical designation in the body ... is disregarded." Place it as early in the head as possible so HTML-parsing quirks don't push it into an implicit body. [google-consolidate][google-5mistakes]
2. Exactly one per page: when more than one `rel="canonical"` is present "all rel=canonical links will be ignored" — a frequent failure when a CMS/SEO plugin injects its own on top of a hand-coded one. [google-5mistakes]
3. Use absolute URLs (`https://example.com/page`), not relative paths — relative is technically supported but error-prone and can be misresolved. [google-consolidate][google-5mistakes]
4. Non-HTML documents (e.g. PDFs) can't hold a `<link>`; return the canonical via an HTTP `Link:` response header — `Link: <https://example.com/file.pdf>; rel="canonical"` (web-search only). This is also a valid alternative for HTML. [google-consolidate]
5. URL fragments (`#section`) are generally not supported as canonical targets — specify the clean URL. [google-consolidate]
6. Canonical and `hreflang` interact (self-canonical per-locale, hreflang targets must match canonicals) → see hreflang domain (deferred). [google-consolidate]

## Related
- [canonical-is-a-hint](../canonicalization/canonical-is-a-hint.md)
- [common-canonical-mistakes](../canonicalization/common-canonical-mistakes.md)
- [canonical-vs-301-vs-noindex](../canonicalization/canonical-vs-301-vs-noindex.md)

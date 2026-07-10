---
updated: 2026-07-09
source: https://developers.google.com/search/docs/crawling-indexing/robots-meta-tag (accessed 2026-07-09)
type: fact
tags: [indexability, noindex, x-robots-tag, meta-robots]
---

# noindex has two delivery mechanisms; the audit must check both

`noindex` can arrive via a `<meta name="robots" content="noindex">` tag or an `X-Robots-Tag: noindex` HTTP response header, and the header is the only mechanism for non-HTML files — a noindex probe that reads only the HTML head misses header-level leaks and de-indexes silently.

## Facts
- Meta form: `<meta name="robots" content="noindex">` in the `<head>`; header form: `X-Robots-Tag: noindex` in the HTTP response — the two are equivalent and any rule usable in the meta tag is also valid in the header. [robots-meta-tag]
- The `X-Robots-Tag` header is the ONLY way to noindex non-HTML resources (PDF, image, video, other files) because they have no HTML `<head>`. [block-indexing]
- When both a meta tag and a header (or conflicting values) apply to one resource, the crawler obeys the MOST RESTRICTIVE combined directive — an `index` meta plus a `noindex` header ⇒ not indexed; neither source has priority. [robots-meta-tag]
- Target a single crawler by naming it: `<meta name="googlebot" content="noindex">` or header `X-Robots-Tag: googlebot: noindex`; an unnamed directive applies to all crawlers; values are case-insensitive. [robots-meta-tag]
- A seen `noindex` drops the page ENTIRELY from Google results regardless of inbound links; classic leak source is a staging `noindex` shipped to production. [block-indexing]
- GOTCHA: if `noindex` is present in the INITIAL server HTML, Google deprioritises rendering and may not run JS — so the "ship noindex then remove it via JavaScript once loaded" safety-net pattern can leave the page permanently de-indexed. If the page should be indexable, do not put `noindex` in the original response; toggle indexability server-side via the header instead. [sej-noindex-render-2025]

## Related
- [noindex-requires-crawlable](../indexability/noindex-requires-crawlable.md)
- [serving-directives-catalog](../indexability/serving-directives-catalog.md)
- canonicalization
- crawlability

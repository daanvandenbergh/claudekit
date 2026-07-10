---
updated: 2026-07-09
source: https://developers.google.com/search/docs/crawling-indexing/robots-meta-tag (accessed 2026-07-09)
type: reference
tags: [metadata, robots-meta, crawling, snippets]
---

# Robots meta tag directive catalog (2026)

`<meta name="robots">` and the `X-Robots-Tag` header share one directive catalog; positive directives are the default and unneeded, and the tag is only honored on a crawlable URL.

## Facts
- Syntax: `<meta name="robots" content="rule1, rule2">` in `<head>`; rule names/values are case-insensitive; combine rules comma-separated. [G-robots]
- Default when no tag is present (equivalently `content="all"` or `index, follow`): the page is eligible for indexing with a Google-chosen snippet length and image preview — so `index`/`follow` are no-ops and never need to be emitted. [G-robots]
- Currently-supported rules: `noindex`, `nofollow`, `none` (=`noindex,nofollow`), `nosnippet`, `max-snippet:[n]` (0 = no text snippet, -1 = no limit), `max-image-preview:[none|standard|large]`, `max-video-preview:[n]` seconds (0 = static image only, -1 = no limit), `notranslate`, `noimageindex`, `unavailable_after:[date]` (RFC 822 / ISO 8601), `indexifembedded` (only meaningful together with `noindex` when the page is embedded via iframe). [G-robots]
- Per-crawler targeting: replace `robots` with a crawler token, e.g. `<meta name="googlebot" content="nosnippet">` or `googlebot-news`; when multiple rules apply the most restrictive combination wins. [G-robots]
- `X-Robots-Tag` HTTP response header carries the identical catalog and is the only way to apply rules to non-HTML resources (PDF, images); it may be UA-scoped, e.g. `X-Robots-Tag: googlebot: noindex`. [G-robots]
- `data-nosnippet` HTML attribute (on `<span>`/`<div>`/`<section>`) excludes a specific text portion from the snippet without affecting indexing. [G-robots]
- No longer used / ignored by Google: `noarchive` and `nocache` (cached-page feature was removed in 2024) and `nositelinkssearchbox`. [G-robots]
- Crawl dependency: a `noindex`/`nofollow` in a meta tag or header is only obeyed if Google can crawl the URL — a `robots.txt` `Disallow` hides the tag, so the two must not both target the same URL (indexing behavior detailed in indexability). [G-robots]

## Related
- robots-directives
- indexability
- [dead-meta-tags](../metadata/dead-meta-tags.md)
- structured-data

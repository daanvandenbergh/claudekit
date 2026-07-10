---
updated: 2026-07-09
source: https://developers.google.com/search/docs/specialty/international/localized-versions (accessed 2026-07-09)
type: reference
tags: [hreflang, i18n, international, syntax, placement, language-codes]
---

# hreflang syntax, placement, and code format

An hreflang annotation is `rel="alternate" hreflang="<code>" href="<url>"` delivered by exactly one of three methods (head link / HTTP header / sitemap — pick one), where `<code>` is an ISO 639-1 language optionally plus an ISO 3166-1 alpha-2 region.

## Facts
- Three delivery methods, all equivalent to Google — choose ONE, do not mix (three implementations are just harder to maintain, no Search benefit): (1) HTML head `<link rel="alternate" hreflang="en-gb" href="https://example.com/uk/" />` (must be in `<head>`, well-formed); (2) HTTP `Link:` header `Link: <https://example.com/uk/>; rel="alternate"; hreflang="en-gb"` (for non-HTML like PDFs); (3) XML sitemap using `xmlns:xhtml="http://www.w3.org/1999/xhtml"` with `<xhtml:link rel="alternate" hreflang="en-gb" href="..."/>` child elements per `<url>`. Don't combine hreflang with other attributes (e.g. `media`) in a single `<link>` tag — each hreflang annotation should be its own clean `<link rel="alternate" hreflang=...>` tag, separate from any `media`/`type` attributes. (Overlaps the canonical-specific version of this rule — see hreflang-canonical on rel=canonical+hreflang combined tags being ignored.) [GSC-localized]
- Code = language only (`en`, `de`) OR language-dash-region (`en-gb`, `de-be`). Language MUST be ISO 639-1; region (optional) MUST be ISO 3166-1 alpha-2. Codes are case-insensitive. [GSC-localized]
- Script subtags are also valid: language+script codes (`zh-Hant` = Traditional Chinese, `zh-Hans` = Simplified Chinese), optionally plus a region (`zh-Hans-US`). [GSC-localized]
- Google does NOT use hreflang or the HTML `lang` attribute to detect a page's language — it determines language with its own algorithms independent of these tags. hreflang's only job is choosing which URL variant to SERVE to a matching user; it has zero influence on Google's language-detection or ranking. [GSC-localized, primary]
- You CANNOT specify a region code by itself — the first sub-tag is always the language; Google does not derive language from a country code (`be` = Belarusian language, NOT Belgium). [GSC-localized]
- Invalid codes Google ignores/rejects: `en-uk` (UK is reserved; correct is `en-gb`), `en-eu` / `en-un` (EU/UN are reserved alpha-2, not countries), `es-419` (UN M49 region, not ISO 3166-1 alpha-2 — unsupported). When the region part is a reserved/unassigned code Google ignores that part. [GSC-localized]
- Every `href` must be a fully-qualified absolute URL (with protocol/host) and must return `200 OK` — a target that 301/302-redirects or 404s drops that URL from the cluster. [GSC-localized; status-code specifics corroborated by 2026 SEO guides]

## Related
- [hreflang-reciprocity](../hreflang/hreflang-reciprocity.md)
- [hreflang-canonical](../hreflang/hreflang-canonical.md)
- [hreflang-common-errors](../hreflang/hreflang-common-errors.md)
- lang-attribute

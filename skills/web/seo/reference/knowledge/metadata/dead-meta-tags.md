---
updated: 2026-07-09
source: https://developers.google.com/search/blog/2009/09/google-does-not-use-keywords-meta-tag (accessed 2026-07-09)
type: fact
tags: [metadata, myths, meta-keywords, sitelinks-searchbox]
---

# Dead and irrelevant meta tags (do not flag)

`meta keywords` (ignored since 2009), `meta author`/`rating`, and sitelinks-searchbox markup carry no Google SEO value in 2026, so their absence is never a defect.

## Facts
- `<meta name="keywords">` has been ignored by Google for web ranking since 2009 and remains ignored in 2026; filling it is at best neutral and at worst exposes your keyword list to competitors. [G-keywords2009]
- `<meta name="author">`, `<meta name="rating">`, `<meta name="revisit-after">`, and `<meta name="generator">` are not Google ranking or rich-result signals — authorship/E-E-A-T comes from visible bylines and `Person`/`Organization` schema, not the author meta tag. [inference from G-keywords2009]
- Sitelinks search box was fully deprecated: Google retired it globally on 2024-11-21, so `WebSite` `SearchAction` markup and `<meta name="google" content="nositelinkssearchbox">` no longer do anything; leaving the markup in place causes no errors. [G-sitelinks2024]
- Auditor rule: a missing `meta keywords`/`author`/`rating` tag is NOT a finding — do not flag it (see 2026-seo-myths).

## Related
- [2026-seo-myths](../foundations/2026-seo-myths.md)
- [robots-meta-directives](../metadata/robots-meta-directives.md)

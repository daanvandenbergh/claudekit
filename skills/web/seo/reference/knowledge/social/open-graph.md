---
updated: 2026-07-09
source: https://ogp.me/ (accessed 2026-07-09)
type: fact
tags: [social, open-graph, meta-tags, previews]
---

# Open Graph required + optional properties for share-preview cards

A complete share card needs the four required OG properties plus og:description/og:site_name, and any og:image should carry an og:image:alt.

## Facts
- OG spec defines exactly four REQUIRED properties on every page: og:title, og:type, og:image, og:url. [ogp]
- Optional-but-expected for a rich card: og:description, og:site_name; og:locale for language. [ogp]
- og:type is usually "website" (or "article" for posts); global types are website/article/book/profile, custom types via CURIE namespaces. [ogp]
- Structured image sub-properties: og:image:secure_url, og:image:type, og:image:width, og:image:height, og:image:alt. [ogp]
- Spec rule: "If the page specifies an og:image it should specify og:image:alt"; alt is "A description of what is in the image (not a caption)". [ogp]
- og:url should be the canonical absolute URL of the object (aligns with the page's rel=canonical). [ogp]
- Audit stance: missing og:title/description/image/url = poor shares; fix by PROPAGATING from the existing <title>/meta description and page hero (that is an auto-fix, not generation). [defer: titles-descriptions]

## Related
- [og-image-specs](../social/og-image-specs.md)
- [twitter-cards](../social/twitter-cards.md)
- [preview-caching](../social/preview-caching.md)

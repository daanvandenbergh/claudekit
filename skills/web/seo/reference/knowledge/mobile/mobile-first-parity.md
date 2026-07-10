---
updated: 2026-07-09
source: https://developers.google.com/search/docs/crawling-indexing/mobile/mobile-sites-mobile-first-indexing (accessed 2026-07-09)
type: fact
tags: [mobile, mobile-first, parity, indexing, structured-data, metadata, internal-links]
---

# Mobile-first indexing: desktop↔mobile parity is the key audit check

Google crawls and indexes only the mobile rendering of a page, so anything present on desktop but missing on mobile — text, images, internal links, structured data, or metadata — is invisible to Search and must be caught as a parity gap.

## Facts
- Mobile-first indexing is universal: Google fully transitioned the last desktop-crawled sites to mobile crawling by July 5, 2024; the mobile version is now the primary (and only) version used for crawling, indexing, and ranking for 100% of sites. [digitalapplied][clickrank]
- If the mobile version has less content than desktop, Google only indexes what exists on mobile; desktop-exclusive content is not considered for ranking. [digitalapplied]
- Parity items Google explicitly requires to match across mobile and desktop: (1) the same primary content — accordions/tabs to hide it are fine, but don't lazy-load primary content on user interaction because Googlebot won't trigger it; (2) the same structured data (with mobile URLs used inside it); (3) equivalent `title` element and `meta description`; (4) the same `robots` meta tags — never a `noindex`/`nofollow` on mobile that isn't on desktop; (5) the same image `alt` text, and high-quality (not tiny/low-res) images. [google-mobile]
- Internal links present only in the desktop layout drop out of the link graph — mobile navigation/footers must expose the same internal links. [digitalapplied][clickrank]
- Audit approach: compare rendered mobile HTML against desktop for content, internal-link set, structured-data blocks, and head metadata; audit quarterly because parity gaps re-creep as new features ship. [digitalapplied]

## Related
- [responsive-recommended-pattern](../mobile/responsive-recommended-pattern.md)
- [mobile-usability-signals](../mobile/mobile-usability-signals.md)

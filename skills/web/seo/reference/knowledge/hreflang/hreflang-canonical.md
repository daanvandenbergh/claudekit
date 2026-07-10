---
updated: 2026-07-09
source: https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls (accessed 2026-07-09) ; https://developers.google.com/search/docs/specialty/international/managing-multi-regional-sites (accessed 2026-07-09)
type: fact
tags: [hreflang, i18n, canonical, indexation]
---

# hreflang and rel=canonical must agree per-locale

Every localized page must self-canonicalize (canonical → itself); pointing all locales' canonical to one master page tells Google the others are duplicates and destroys the hreflang cluster.

## Facts
- Google's official rule, quoted directly from the canonicalization doc: "If you're using hreflang elements, make sure to specify a canonical page in the same language, or the best possible substitute language if a canonical page doesn't exist for the same language." In the normal case this means self-canonical; only fall back to a different-language canonical when no true same-language version exists to canonicalize to. [GSC, primary — developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls]
- rel=canonical annotations that carry certain other attributes are IGNORED for canonicalization entirely — official quote: "rel=\"canonical\" annotations with hreflang, lang, media, and type attributes are not used for canonicalization." Never put an hreflang attribute on the same `<link>` tag as rel=canonical; they must be separate `<link>` elements or the canonical is dropped. [GSC, primary]
- FAILURE MODE: if canonical points away from the hreflang target (e.g. all locales canonical to the en-US or x-default page), Google treats the alternates as duplicates and drops them — hreflang for those URLs is ignored and regional visibility is lost. This is a top real-world cause of "hreflang silently not working." [clickrank; corroborates Mueller]; corroborated by GSC managing-multi-regional-sites: "pick a preferred version and use the rel=canonical element and hreflang tags to make sure that the correct language or regional URL is served to searchers." [GSC, primary]
- ORDER: canonical is resolved at indexing/dedup BEFORE hreflang clustering, so a wrong canonical pre-empts hreflang. Practical rule: fix canonical first, hreflang second. [clickrank — single secondary source, unconfirmed by GSC as of 2026-07-09, verify]
- Canonical mechanics themselves are out of scope here — see the canonicalization domain. This entry covers ONLY the hreflang↔canonical interaction. [defer: canonicalization]

## Related
- [hreflang-syntax](../hreflang/hreflang-syntax.md)
- [hreflang-reciprocity](../hreflang/hreflang-reciprocity.md)
- [hreflang-common-errors](../hreflang/hreflang-common-errors.md)

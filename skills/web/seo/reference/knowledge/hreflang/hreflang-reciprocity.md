---
updated: 2026-07-09
source: https://developers.google.com/search/docs/specialty/international/localized-versions (accessed 2026-07-09)
type: fact
tags: [hreflang, i18n, reciprocity, return-tags, x-default, self-referencing]
---

# hreflang reciprocity, self-reference, and x-default

hreflang only works when annotations are bidirectional — every page must list itself and every alternate, each alternate must point back, or Google ignores the tags; add one `x-default` for the unmatched-language fallback.

## Facts
- RECIPROCITY (return tags): "If two pages don't both point to each other, the tags will be ignored." If page X names Y as an alternate, Y must name X back; non-reciprocal tags are silently dropped. Rationale: stops another site from unilaterally declaring itself your alternate. This is the single most-failed hreflang rule. [GSC-localized]
- SELF-REFERENCING: each page must list ITSELF as one of the alternates ("Each language version must list itself as well as all other language versions"). A cluster of N locales = each page carries N (self + others) annotations, ideally identical across the cluster. [GSC-localized]
- x-default: `<link rel="alternate" href="https://example.com/" hreflang="x-default" />` — reserved value served when no listed language/region matches the user's browser settings. Designed for language-selector / global landing pages; the page's own language is irrelevant. Recommended (not strictly required) as the fallback for every cluster. [GSC-localized]
- Partial clusters are allowed: you may omit some languages on some pages; Google still honors the pairs that DO point to each other. Completeness is ideal, not mandatory. [GSC-localized]
- hreflang is a SIGNAL for which URL to SERVE to a given user, not a ranking boost and not a canonicalization/deduplication mechanism — it does not merge or hide duplicate pages. [GSC-localized]

## Related
- [hreflang-syntax](../hreflang/hreflang-syntax.md)
- [hreflang-canonical](../hreflang/hreflang-canonical.md)
- [hreflang-common-errors](../hreflang/hreflang-common-errors.md)

---
updated: 2026-07-09
source: https://developers.google.com/search/docs/specialty/international/localized-versions (accessed 2026-07-09)
type: fact
tags: [hreflang, i18n, errors, audit, checklist]
---

# Most common hreflang mistakes

The audit-worthy hreflang failures are almost always one of six: missing return/self tags, invalid codes, non-200 targets, mixed delivery methods, wrong canonical, or a missing x-default.

## Facts
- Missing return tag / missing self-reference — the #1 failure; breaks reciprocity so the whole annotation is ignored (see hreflang-reciprocity). [GSC-localized]
- Invalid or country-only codes — `en-uk`, `en-eu`, `es-419`, or a bare region code; these get ignored (see hreflang-syntax for the valid set). [GSC-localized]
- Targets that don't return 200 — hreflang URLs that redirect (301/302) or 404 drop out of the cluster; always point at the final, live, indexable URL. [GSC-localized; status specifics per 2026 SEO guides]
- Mixing delivery methods or duplicating clusters across head+sitemap+header — no benefit, and conflicting sets are harder to keep reciprocal; pick one. [GSC-localized]
- Canonical conflicting with hreflang — all locales canonicalized to one page (see hreflang-canonical). [Mueller, secondary]
- hreflang attribute stacked onto the same `<link>` tag as rel=canonical (or combined with media/type/lang attributes) — Google explicitly ignores rel=canonical annotations that carry those attributes for canonicalization purposes; always emit canonical and hreflang as separate, single-purpose `<link>` tags. [GSC, primary — developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls, accessed 2026-07-09]
- No x-default — no defined fallback for unmatched-language visitors; recommended for every cluster. [GSC-localized]
- Industry benchmark: 2026 SEO reports claim 60%+ of hreflang-using sites have at least one implementation error, missing return tags most common — directional only, treat the exact % as low-confidence marketing data. [SEO industry guides, 2026 — low confidence]

## Related
- [hreflang-syntax](../hreflang/hreflang-syntax.md)
- [hreflang-reciprocity](../hreflang/hreflang-reciprocity.md)
- [hreflang-canonical](../hreflang/hreflang-canonical.md)

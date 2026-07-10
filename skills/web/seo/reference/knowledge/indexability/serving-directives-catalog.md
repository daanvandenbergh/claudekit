---
updated: 2026-07-09
source: https://developers.google.com/search/docs/crawling-indexing/robots-meta-tag (accessed 2026-07-09)
type: reference
tags: [indexability, meta-robots, directives, snippet, noarchive]
---

# The 2026 robots serving-directive catalog (and the noarchive deprecation)

The robots meta / X-Robots-Tag directives split into indexing rules (`noindex`, `none`) and serving/preview rules (`nosnippet`, `max-snippet`, `max-image-preview`, `unavailable_after`, `noimageindex`, `indexifembedded`, `notranslate`) — and `noarchive` is now a historical no-op on Google, so its absence must never be flagged.

## Facts
- `none` is exactly equivalent to `noindex, nofollow`. [robots-meta-tag]
- `nosnippet`: no text snippet or video preview in results (a static thumbnail may still show). `max-snippet:[number]`: cap snippet length in characters — `0` equals `nosnippet`, `-1` lets Google pick the length. [robots-meta-tag]
- `max-image-preview:[setting]` with `none` | `standard` (default) | `large`; `max-video-preview:[number]` seconds, `0`=static image only, `-1`=no limit. [robots-meta-tag]
- `unavailable_after:[date]` drops the page from results after a date; `noimageindex` blocks image indexing on the page; `indexifembedded` lets an iframed page be indexed via its embedding page despite its own `noindex`; `notranslate` suppresses the translation offer. [robots-meta-tag]
- `noarchive` (and `nositelinkssearchbox`) are DEPRECATED / no longer used by Google — Google removed cached links and moved `noarchive` to the historical-reference section on 2 Oct 2024; existing tags need not be removed and other search engines may still honor them. Confidence: high on deprecation, but treat "which non-Google engines still honor it" as low-confidence. [sej-noarchive-2024]
- MYTH GUARD: do not flag a missing `noarchive` — it is a no-op on Google Search. [sej-noarchive-2024]

## Related
- [noindex-two-mechanisms](../indexability/noindex-two-mechanisms.md)
- titles-descriptions

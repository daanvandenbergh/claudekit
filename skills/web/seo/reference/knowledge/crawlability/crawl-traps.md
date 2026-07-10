---
updated: 2026-07-09
source: https://developers.google.com/search/docs/crawling-indexing/crawling-managing-faceted-navigation (accessed 2026-07-09)
type: procedure
tags: [crawlability, faceted-navigation, crawl-trap, url-parameters, infinite-space]
---

# Crawl traps — faceted navigation, parameters, and infinite spaces (Google, 2026)

Facet/parameter/calendar URLs multiply into near-infinite crawlable spaces that starve discovery of real pages, and the fix is to stop Google fetching them via robots.txt or URL fragments.

## Steps
1. Faceted navigation multiplies filter/sort parameters into an effectively **infinite URL space** (e.g. `?products=fish&color=radioactive_green&size=tiny`); each combination looks novel so crawlers must fetch it before learning it's useless, and that time is stolen from new, useful URLs. [google-faceted]
2. Other classic infinite spaces: **calendars** (endless next-month links), **session IDs**, and additive **sort/filter parameters** — all generate unbounded crawlable URLs. [google-faceted]
3. **Preferred control**: `robots.txt` disallow of the parameter pattern while allowing the canonical page — e.g. `Disallow: /*?*products=` plus `Allow: /*?products=all$`. [google-faceted]
4. **Alternative**: express facet state as a **URL fragment** (`#products=fish`) — Google generally doesn't crawl/index fragments, so the crawl space never expands. [google-faceted]
5. **Weaker/secondary** measures: `rel="canonical"` to the unfiltered URL and `rel="nofollow"` on filter links (only helps if applied consistently across the site). [google-faceted]
6. **Do NOT reach for `noindex` here**: if you also robots-Disallow the parameter URLs Google can't crawl them to see the noindex (see [robots-txt-semantics]). Pick blocking (robots/fragment) to save budget, OR crawlable+noindex to control indexing — not both on the same URL. [google-faceted]

## Related
- [robots-txt-semantics](../crawlability/robots-txt-semantics.md)
- [crawl-budget-and-server-health](../crawlability/crawl-budget-and-server-health.md)
- indexation

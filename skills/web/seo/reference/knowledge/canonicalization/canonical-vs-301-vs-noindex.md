---
updated: 2026-07-09
source: https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls (accessed 2026-07-09)
type: procedure
tags: [canonicalization, rel-canonical, 301-redirect, noindex, decision-matrix]
---

# Canonical vs 301 vs noindex — which consolidation tool when

Use a 301 to permanently retire a duplicate URL, `rel="canonical"` to consolidate signals while both URLs must stay reachable, and `noindex` only to remove a page from the index entirely — never to consolidate.

## Steps
1. Consolidation-signal strength (Google, strongest→weakest): 301/permanent redirect > `rel="canonical"` (link or HTTP header) > listing the URL in an XML sitemap (a weak signal). Methods stack and are more effective combined. [google-consolidate]
2. 301 redirect — use "when you want to get rid of existing duplicate pages"; the target becomes canonical. Strongest signal; but the old URL stops serving. Redirect mechanics/hops → see urls-redirects domain (deferred). [google-consolidate]
3. `rel="canonical"` — use when both/all duplicate URLs must remain independently reachable and returning 200: URL parameters, UTM/tracking-tagged URLs, session IDs, print/AMP variants, sort/filter facets, a canonical-original that duplicate landing paths point to. Maps unlimited duplicates to one preferred URL. [google-consolidate]
4. `noindex` (meta robots / `X-Robots-Tag`) — Google explicitly says do NOT use it for canonical selection within a site: it "completely blocks the page from Search" rather than consolidating signals onto the canonical. Use noindex only when a page should not be indexed at all. Indexing states → see indexability domain (deferred). [google-consolidate]
5. Do NOT use `robots.txt` `Disallow` or the URL-removal tool to consolidate: Google may still index disallowed URLs without content, and removal hides ALL versions of a URL from Search. [google-consolidate]
6. Reinforce whichever method you choose by linking internally to the canonical URL, not the duplicate. [google-consolidate]

## Related
- [canonical-is-a-hint](../canonicalization/canonical-is-a-hint.md)
- [canonical-placement-and-format](../canonicalization/canonical-placement-and-format.md)
- [common-canonical-mistakes](../canonicalization/common-canonical-mistakes.md)

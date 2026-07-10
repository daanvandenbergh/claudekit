---
updated: 2026-07-09
source: https://developers.google.com/search/docs/crawling-indexing/links-crawlable (accessed 2026-07-09)
type: fact
tags: [architecture, click-depth, orphan-pages, breadcrumbs, link-equity]
confidence: low
---

# Click depth, orphan pages & flat-vs-deep hierarchy

Important pages should sit within ~3 clicks of the homepage, no page you care about should be an orphan (zero inbound internal links), and a flatter hierarchy plus breadcrumb navigation spreads link equity and discovery to deeper pages.

## Facts
- Click depth: keep important pages reachable within ~3 clicks of the homepage (see foundations/thresholds crawl-depth). The "3 clicks" figure is a widely-cited HEURISTIC, not a Google-published threshold — treat as directional. [heuristic]
- Orphan page = a URL with zero inbound internal links. It contradicts Google's "every page you care about should have a link from at least one other page" and relies on sitemap/external links alone for discovery, so it receives little internal PageRank and ranks poorly. [google-links]
- Flat vs deep: a flatter architecture (fewer hops to any page) generally aids both crawl discovery and link-equity distribution; excessive nesting buries pages and starves them of internal PageRank. (Direction is sound; exact depth cutoffs are heuristics.) [heuristic]
- Link equity / PageRank flows through internal `<a href>` links, so structure and contextual linking — not just navigation menus — decide how authority reaches deep pages. [google-links]
- Breadcrumb NAVIGATION (visible trail) shortens click depth to parent categories and reinforces topical context; the BreadcrumbList JSON-LD recipe is a separate concern → see `structured-data`. [heuristic]

## Related
- [internal-linking](../architecture/internal-linking.md)
- [pillar-cluster](../architecture/pillar-cluster.md)
- [pagination](../architecture/pagination.md)

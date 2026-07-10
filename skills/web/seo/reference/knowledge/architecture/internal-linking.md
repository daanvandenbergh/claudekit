---
updated: 2026-07-09
source: https://developers.google.com/search/docs/crawling-indexing/links-crawlable ; https://developers.google.com/search/blog/2019/09/evolving-nofollow-new-ways-to-identify [google-nofollow-hint] (accessed 2026-07-09)
type: fact
tags: [architecture, internal-linking, anchor-text, crawlability]
---

# Internal links & anchor text — Google's crawlable-link rules

Google only follows an `<a>` element with an `href`; anchor text must be descriptive (never "click here"/"read more"), and every page you care about needs at least one inbound internal link.

## Facts
- Google can only crawl a link if it is an `<a>` HTML element WITH an `href` attribute. `<span href>`, `<a onclick="goto(...)">`, framework `routerLink` bindings, and JS-only handlers with no `href` are NOT reliably crawled. [google-links]
- "Good anchor text is descriptive, reasonably concise, and relevant to the page it's on and the page it links to." Generic anchors like "Click here" and "Read more" are too generic — avoid them. [google-links]
- Do NOT keyword-stuff anchor text, and space links apart with surrounding context rather than chaining several links back-to-back. (Repeating the same exact-match anchor sitewide is a smell.) [google-links]
- Do NOT nofollow internal links to "sculpt" PageRank toward priority pages — since 2019 (effective 2020-03-01) Google treats `rel="nofollow"` (and `sponsored`/`ugc`) as a HINT it can still choose to crawl and weigh, not a directive that reliably blocks link-equity flow; nofollow is meant for untrusted/paid/UGC links, not internal navigation. [google-nofollow-hint]
- "Every page you care about should have a link from at least one other page on your site." Link in context to related resources that help the reader. [google-links]
- Descriptive, keyword-relevant anchors help Google understand the target page BEFORE crawling it — the anchor is a topical signal for the destination, not just navigation. [google-links]

## Related
- [pagination](../architecture/pagination.md)
- [site-structure-depth](../architecture/site-structure-depth.md)
- [pillar-cluster](../architecture/pillar-cluster.md)

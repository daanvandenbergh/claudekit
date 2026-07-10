---
updated: 2026-07-09
source: https://developers.google.com/search/docs/crawling-indexing/robots/robots_txt (accessed 2026-07-09)
type: fact
tags: [crawlability, robots-txt, allow-disallow, indexation]
---

# robots.txt matching semantics and the indexing footgun (Google, 2026)

Google resolves Allow/Disallow by longest matching path (least-restrictive on ties), and a Disallow only stops crawling — never indexing — so it can never carry a noindex.

## Facts
- Conflict resolution: the crawler uses the rule with the **most specific (longest) path**; when path lengths tie (including wildcard conflicts), the **least restrictive** rule wins — i.e. Allow beats Disallow. [google-robots-spec]
- Wildcards: `*` matches 0+ of any character, `$` anchors the URL end; a trailing `*` is redundant (`/fish*` == `/fish`). Only `*` and `$` are supported — no regex. [google-robots-spec]
- Paths are **case-sensitive** (field/directive names are not); `/Page` and `/page` are different rules. [google-robots-spec]
- Exactly **one** group applies per crawler: the group whose user-agent token most specifically matches; all other groups are ignored (multiple matching groups for the same token are merged). [google-robots-spec]
- The file must sit at the **root** of each host+protocol+port (`https://ex.com/robots.txt` governs only that origin; a subdomain or http vs https needs its own file). [google-robots-spec]
- Google parses only the **first 500 KiB**; bytes beyond that are ignored — keep rules early in the file. [google-robots-spec]
- Google caches robots.txt for **up to 24h** (longer/shorter per `Cache-Control`). [google-robots-spec]
- **Disallow prevents crawling, not indexing**: a disallowed URL linked from elsewhere can still be indexed and shown *without a snippet* (Search Console "Indexed, though blocked by robots.txt"). robots.txt is a crawl-management tool, not a de-indexing tool. [google-robots-spec]
- **The footgun**: because a Disallowed page is never fetched, Google never sees its `noindex` meta/header — so combining Disallow + noindex leaves the URL indexable. To de-index, allow crawling and use `noindex` (`noindex` in robots.txt itself is unsupported). [google-block-indexing]

## Related
- robots-ai-crawlers
- indexation
- urls-redirects
- [thresholds](../foundations/thresholds.md)

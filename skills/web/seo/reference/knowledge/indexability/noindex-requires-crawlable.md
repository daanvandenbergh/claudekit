---
updated: 2026-07-09
source: https://developers.google.com/search/docs/crawling-indexing/block-indexing (accessed 2026-07-09)
type: fact
tags: [indexability, noindex, robots-txt, disallow, footgun]
---

# noindex only works if the page is crawlable — never Disallow a page you want de-indexed

For `noindex` to take effect Google must be able to fetch the page, so a URL blocked by robots.txt is never crawled, its `noindex` is never seen, and the URL can still surface in search — combining `Disallow` with `noindex` is a self-cancelling anti-pattern the audit must flag.

## Facts
- Google's exact rule: "For the `noindex` rule to be effective, the page or resource must not be blocked by a robots.txt file, and it has to be otherwise accessible to the crawler." [block-indexing]
- If blocked by robots.txt, "the crawler will never see the `noindex` rule, and the page can still appear in search results" (typically as a URL-only / no-snippet listing fed by external links). [block-indexing]
- Correct de-index procedure: ALLOW crawling + serve `noindex`, wait for a recrawl to drop the page, and only THEN optionally add a robots.txt `Disallow` — never `Disallow` first. [block-indexing]
- Audit signal: a URL that carries both `noindex` and a matching robots.txt `Disallow` is a contradiction — the `Disallow` wins on crawl, so the `noindex` intent fails.

## Related
- [noindex-two-mechanisms](../indexability/noindex-two-mechanisms.md)
- [index-coverage-states](../indexability/index-coverage-states.md)
- crawlability

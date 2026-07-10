---
updated: 2026-07-09
source: https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics (accessed 2026-07-09)
type: fact
tags: [js-rendering, rendering, googlebot, wrs, indexation]
---

# Google's JavaScript rendering pipeline — crawl, render queue, index

Googlebot crawls the raw HTTP response first, then queues the page for a separate deferred render by the Web Rendering Service before it can index anything JS injects.

## Facts
- Google processes JS in three sequential phases: crawling, rendering, indexing — and "Googlebot queues pages for both crawling and rendering." [gsc-basics]
- Phase 1 crawl: Googlebot fetches the URL, checks robots.txt, and parses links out of the raw HTTP-response HTML — before any JavaScript runs. Links only present after JS are not discovered in this phase. [gsc-basics]
- Phase 2 render: every page returning HTTP 200 (unless a robots noindex tag/header says otherwise) is queued for rendering; a headless Chromium executes the JS and the resulting rendered HTML is what gets indexed. [gsc-basics]
- The render is deferred, not immediate: "The page may stay on this queue for a few seconds, but it can take longer than that." Google gives no guaranteed timeline. [gsc-basics]
- The renderer is the Web Rendering Service (WRS) running an "evergreen" headless Chromium — the same build as current Chrome, auto-updated (evergreen since 2019). [gsc-basics]
- Hard rule: "if content isn't visible in the rendered HTML, Google won't be able to index it." Rendering is a prerequisite for indexing JS-generated content, not a guarantee. [gsc-basics]
- Caching caveat: WRS caches aggressively and may ignore cache headers, so it can render against stale JS/CSS. [gsc-basics]

## Related
- [render-parity](../js-rendering/render-parity.md)
- [framework-rendering-modes](../js-rendering/framework-rendering-modes.md)
- [extractability](../answer-engines/extractability.md)

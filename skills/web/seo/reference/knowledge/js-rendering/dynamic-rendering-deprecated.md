---
updated: 2026-07-09
source: https://developers.google.com/search/docs/crawling-indexing/javascript/dynamic-rendering (accessed 2026-07-09)
type: fact
tags: [js-rendering, dynamic-rendering, prerender, deprecated, ssr]
---

# Dynamic rendering is deprecated as a recommendation

Serving a separate prerendered HTML snapshot to crawlers by user-agent is officially a workaround Google no longer recommends; the durable fix is SSR, static rendering, or hydration.

## Facts
- Google's own docs (last updated 2025-12-10) state dynamic rendering "was a workaround and not a long-term solution for problems with JavaScript-generated content in search engines." [gsc-dynamic]
- Google recommends instead: "server-side rendering, static rendering, or hydration as a solution." [gsc-dynamic]
- Rationale: it "creates additional complexities and resource requirements" — and it is user-agent-based, so the bot list must be manually maintained as new (esp. AI) crawlers appear. [gsc-dynamic]
- Cloaking guardrail: if dynamic rendering is used at all, it must serve equivalent content to users and crawlers, or it violates Google's cloaking policy. [gsc-dynamic]
- Audit stance: flag dynamic-rendering/prerender-by-UA setups as legacy tech debt and recommend migrating the render mode, not as a fix to add. Never propose an "AI-only" hidden/cloaked variant (spam-policy violation — see extractability).

## Related
- [framework-rendering-modes](../js-rendering/framework-rendering-modes.md)
- [extractability](../answer-engines/extractability.md)
- robots-ai-crawlers

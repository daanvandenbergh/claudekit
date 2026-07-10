---
updated: 2026-07-09
source: https://web.dev/articles/rendering-on-the-web (accessed 2026-07-09)
type: fact
tags: [js-rendering, csr, ssr, ssg, isr, hydration, indexability]
---

# CSR vs SSR vs SSG/ISR vs hydration — indexability tradeoffs

Any mode that puts the primary content in the HTTP response (SSR, SSG, ISR) is indexation-safe; CSR-only relies on the deferred render and is the highest-risk pattern for both Google and non-rendering crawlers.

## Facts
- CSR (client-side rendering): app rendered in the browser via JS mutating the DOM; the initial HTML is an app shell with little/no content. Crawlers must render to see anything, so CSR-only content depends entirely on the deferred WRS render and is the highest-risk mode. [webdev-rot][gsc-basics]
- SSR (server-side rendering): server returns full HTML per request, then JS hydrates it. Content-complete on first response → crawler-safe and faster first paint. [webdev-rot]
- SSG / static rendering: full HTML generated at build time, served from CDN → content-complete, fastest TTFB, crawler-safe. ISR = SSG that regenerates pages in the background on an interval or on-demand (hybrid: static delivery, fresher data). [webdev-rot]
- Hydration/rehydration: "running client-side scripts to add application state and interactivity to server-rendered HTML" — it layers interactivity onto already-present content; it does NOT itself gate indexability because the content already shipped in the HTML. [webdev-rot]
- Cross-crawler consequence (do not duplicate — see extractability): most AI answer crawlers (GPTBot/ClaudeBot/PerplexityBot/OAI-SearchBot) do NOT execute JS; only Google (and Gemini via WRS) render. So CSR-only content is invisible to AI answer engines even when Google eventually indexes it → the fix is an SSR/SSG migration (architecture-class: flag, never auto). [webdev-rot]

## Related
- [extractability](../answer-engines/extractability.md)
- [rendering-pipeline](../js-rendering/rendering-pipeline.md)
- [dynamic-rendering-deprecated](../js-rendering/dynamic-rendering-deprecated.md)

---
updated: 2026-07-09
source: https://vercel.com/blog/the-rise-of-the-ai-crawler ; https://arxiv.org/abs/2501.09940 ; https://developers.google.com/search/docs/fundamentals/ai-optimization-guide ; re-verify each research run
type: fact
tags: [answer-engines, rendering, extraction, geo]
---

# Extractability — AI crawlers don't run JS, and they quote standalone passages

Two mechanics govern whether an answer engine can quote a page: it must be able to *read* the content
(raw HTML, no JS), and each passage must *stand alone* when lifted out of context. Both are the "why"
behind the Phase G / R1 checks — not style preferences.

## Facts
- **AI answer crawlers (except Google Gemini) do not execute JavaScript.** Vercel + MERJ analyzed 500M+
  GPTBot fetches: zero JS execution (GPTBot downloads JS ~11.5% of the time, ClaudeBot ~23.8%, but
  neither runs it — the file is read as text, not executed). Same for OAI-SearchBot, ChatGPT-User,
  ClaudeBot, Claude-SearchBot, PerplexityBot, Bytespider. Only Gemini renders JS (via Googlebot's WRS).
  [source]
- Consequence: content that exists only after client-side hydration (CSR React/Vue SPA data, prices,
  FAQ answers) is **absent** from what engines ingest. CSR-only is the highest-value AEO defect; the fix
  is an SSR/SSG migration (architecture — flag, never auto). Verify any AEO fix against the **raw/built
  HTML**, not the hydrated DOM — a fix present only in the DOM is a false pass.
- **Passage-level retrieval:** RAG splits a page into chunks (usually by heading) and scores each in
  isolation; a section is retrievable only if it is self-contained and semantically complete. A chunk
  that opens with an unresolved reference ("this", "it", "as above") or buries the answer after
  background loses when quoted alone. [arxiv 2501.09940]
- **Audit lens:** chunk each page by `##`/`###` and evaluate each chunk as if quoted out of context.
- **Structural levers (content edits — propose, never a silent rewrite; drafted from the page's OWN
  content, never invented):** lead each section with the direct answer; a concise TL;DR/answer block near
  the top of long or question-target pages; keep passages self-contained (resolve dangling openers);
  reflow inherently tabular/enumerable prose into a table/list/definition block (reflow only — add no
  new facts). LLMs disproportionately lift "what is X" definition leads, X-vs-Y tables, and lists.
  **Scope caveat:** this chunking/passage-self-containment guidance targets RAG-based third-party AI
  assistants (ChatGPT, Perplexity, Claude — per the Vercel/MERJ study and arxiv 2501.09940). It is NOT
  Google's own recommendation for ranking in AI Overviews/AI Mode — Google's official AI-optimization
  guide states verbatim "There's no requirement to break your content into tiny pieces for AI to
  better understand it" and "You don't need to write in a specific way just for generative AI search,"
  because those surfaces reuse Google's classic full-page index, not naive passage retrieval. Don't
  cite this lever as Google-endorsed for Google's AI features. [google-ai-optimization-guide]
- **Never cloak:** do not add `display:none` "AI-only" blocks or model-directed instructions — a
  spam-policy violation. Anything the skill touches must be equally visible and truthful to humans.

## Related
- [citeable-patterns](citeable-patterns.md)
- [render-parity](../js-rendering/render-parity.md)

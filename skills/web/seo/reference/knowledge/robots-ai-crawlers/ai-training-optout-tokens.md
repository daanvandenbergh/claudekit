---
updated: 2026-07-09
source: https://developers.google.com/crawling/docs/robots-txt/robots-txt-spec ; https://developers.google.com/crawling/docs/crawlers-fetchers/google-common-crawlers [GoogleSpec] (accessed 2026-07-09)
type: fact
tags: [robots-ai-crawlers, ai-crawlers, opt-out, google-extended, applebot-extended]
confidence: low
---

# AI-training opt-out tokens (Google-Extended / Applebot-Extended) — control signals, not bots

Some robots.txt tokens are pure opt-out SIGNALS attached to an existing crawler — they fetch nothing, log nothing, and disallowing them removes AI-training use WITHOUT touching search indexing or ranking.

## Facts
- `Google-Extended` is a control token only: it issues NO requests and does not crawl. `Disallow: Google-Extended` tells Google not to use already-crawled content to train Gemini/Vertex AI models AND ground Gemini Apps / Vertex AI Search answers — it controls FOUR uses per Google's crawler-fetcher reference: (1) Gemini Apps model training, (2) Vertex AI API for Gemini model training, (3) grounding in Gemini Apps, (4) grounding with Google Search on Vertex AI ("grounding" = retrieval-time RAG use, distinct from training-time weight updates; one token excludes both). It is SEPARATE from `Googlebot` — blocking it does NOT affect Google Search crawling, indexing, or ranking. [GoogleSpec]
- `Applebot-Extended` is the parallel Apple token: opts content out of training Apple Intelligence models. It is separate from `Applebot` — disallowing it does NOT remove the site from Apple/Siri search results. [Apple]
- Because these are signals on an existing crawler, they make NO HTTP requests and therefore never appear in server access logs even though they govern content USE — you cannot verify them by log inspection, only by the robots.txt directive being present.
- Design consequence: opting out of AI TRAINING (these tokens, plus `GPTBot`/`ClaudeBot`/`CCBot` etc.) is orthogonal to AI-SEARCH citation eligibility (`OAI-SearchBot`/`Claude-SearchBot`/`PerplexityBot`/`Googlebot`). A site can refuse training while staying fully citable — that is a common, coherent posture, not a misconfiguration.

## Related
- [ai-crawlers](../answer-engines/ai-crawlers.md)
- [ai-crawler-ua-catalog-2026](../robots-ai-crawlers/ai-crawler-ua-catalog-2026.md)
- [robots-txt-spec-rfc9309](../robots-ai-crawlers/robots-txt-spec-rfc9309.md)

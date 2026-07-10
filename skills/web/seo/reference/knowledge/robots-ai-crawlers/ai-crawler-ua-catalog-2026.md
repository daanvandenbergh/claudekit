---
updated: 2026-07-09
source: https://developers.openai.com/api/docs/bots (accessed 2026-07-09)
type: reference
tags: [robots-ai-crawlers, ai-crawlers, user-agents, geo, catalog]
confidence: low
---

# 2026 AI-crawler user-agent catalog — the canonical token → purpose registry

The exact robots.txt tokens and what each does in 2026; each vendor splits its bots so you allow/deny training, AI-search, and user-fetch INDEPENDENTLY — allowing one token never implies the others.

## Facts
- OpenAI (3 crawlers + 1 ads bot, each controlled independently in robots.txt): `GPTBot` = model TRAINING; `OAI-SearchBot` = builds the ChatGPT SEARCH index (opting out → "will not be shown in ChatGPT search answers"); `ChatGPT-User` = live USER-triggered fetch when someone asks ChatGPT about a page; `OAI-AdsBot` = validates ChatGPT ad landing pages (added to OpenAI's docs 2026). "Each setting is independent of the others." [OpenAI]
- Anthropic (3 crawlers, independent): `ClaudeBot` = model TRAINING; `Claude-SearchBot` = indexes/evaluates content quality to feed Claude's SEARCH/retrieval layer (NOT training); `Claude-User` = USER-triggered fetch when a person asks Claude to read a URL. Anthropic states all its bots "respect 'do not crawl' signals by honoring industry standard directives in robots.txt" — including Claude-User. [Anthropic]
- Perplexity (2 declared): `PerplexityBot` = builds Perplexity's SEARCH index (blocking removes Perplexity citation eligibility); `Perplexity-User` = live USER-triggered fetch. [Perplexity]
- AI-TRAINING OPT-OUT TOKENS (not crawlers — see separate entry): `Google-Extended` (opt out of Gemini/Vertex training; separate from `Googlebot`), `Applebot-Extended` (opt out of Apple Intelligence training; separate from `Applebot`). [GoogleSpec][Apple]
- Bulk/third-party training crawlers: `CCBot` = Common Crawl (its public dataset trained GPT-3/4, Llama, Mistral, etc.); `Bytespider` = ByteDance/TikTok training + platform crawl (reported aggressive, historically poor robots.txt compliance); `Meta-ExternalAgent` = Meta AI / Llama training + indexing; `Amazonbot` = Amazon (Alexa/AI). [Bytespider]
- INDEPENDENCE is the operative rule across every vendor: `GPTBot`-block does NOT block ChatGPT search; allowing `ClaudeBot` does NOT allow `Claude-SearchBot`. Always name the exact token AND the function — never "block AI" as a blanket. [OpenAI][Anthropic]
- Deprecated/legacy tokens still seen in the wild (flag but don't act on): `anthropic-ai`, `claude-web` (superseded by the ClaudeBot/Claude-User/Claude-SearchBot split). [Anthropic]
- Whether to allow or deny any of these is a BUSINESS/licensing decision (consent, bandwidth, citation value) — NEVER an audit defect. See answer-engines/ai-crawlers for the tier semantics and the never-auto-block/decision-log rule.

## Related
- [ai-crawlers](../answer-engines/ai-crawlers.md)
- [robots-txt-spec-rfc9309](../robots-ai-crawlers/robots-txt-spec-rfc9309.md)
- [ai-crawler-compliance-reality](../robots-ai-crawlers/ai-crawler-compliance-reality.md)
- [platform-behavior](../answer-engines/platform-behavior.md)

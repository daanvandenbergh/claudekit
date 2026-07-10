---
updated: 2026-07-09
source: https://developers.openai.com/api/docs/bots ; https://support.claude.com/en/articles/8896518-does-anthropic-crawl-data-from-the-web-and-how-can-site-owners-block-the-crawler ; https://nohacks.co/blog/ai-user-agents-landscape-2026 ; https://docs.perplexity.ai/docs/resources/perplexity-crawlers ; https://blog.cloudflare.com/perplexity-is-using-stealth-undeclared-crawlers-to-evade-website-no-crawl-directives/ ; re-verify each research run
type: reference
tags: [answer-engines, crawlers, robots, geo]
---

# AI crawler access — three user-agent tiers, and why blocking is a decision not a defect

AI bots split into three functional tiers with opposite AEO implications: blocking a *training* bot is
a legitimate consent choice, but blocking a *search/citation* bot removes the site from AI answers.
"Block AI" is ambiguous — always name the tier and the exact user-agent. Editing an AI allow/deny rule
is never an auto-fix (Tier C / flag-and-confirm); adding a `Sitemap:` line is the only robots edit with
no de-index risk (in the `/seo` checklist all robots.txt edits are batched as Tier C — see X2/X7).

## Facts
- **Training tier** (feeds model training; blocking is a consent/licensing choice, does NOT by itself
  remove citation eligibility): `GPTBot` (OpenAI), `ClaudeBot` (Anthropic), `CCBot` (Common Crawl),
  `Bytespider` (ByteDance), `Amazonbot`, `Meta-ExternalAgent`.
- **AI-search / retrieval tier** (builds the index the engine cites from; blocking KILLS AEO):
  `OAI-SearchBot` (ChatGPT search), `PerplexityBot`, `Claude-SearchBot`, `DuckAssistBot` (DuckDuckGo AI),
  `Bingbot` (feeds Microsoft Copilot). Google AI Overviews use the **main Google index** (Googlebot) —
  blocking Googlebot removes AIO eligibility too. [OpenAI/Anthropic bot docs] [Perplexity/vendor crawler lists]
- **User-triggered tier** (a user proxy when someone asks the assistant about a page): `ChatGPT-User`,
  `Perplexity-User`, `Claude-User`. robots.txt compliance DIVERGES by vendor, documented not just
  possible: OpenAI's bots doc explicitly does NOT guarantee compliance for `ChatGPT-User` ("because
  these actions are initiated by a user, robots.txt rules may not apply"); Anthropic's docs explicitly
  say `Claude-User` DOES honor robots.txt (covering ClaudeBot, Claude-User, and Claude-SearchBot);
  `Perplexity-User` shows the Cloudflare-documented stealth-fetch behavior. Don't promise a hard
  robots.txt block against `ChatGPT-User`/`Perplexity-User`; `Claude-User` is a documented exception.
  [OpenAI bots doc][Anthropic support][Cloudflare]
- **User-triggered fetches are not reliably blockable by robots.txt:** Cloudflare (Aug 2025) documented
  Perplexity using stealth/undeclared user-agents and rotating ASNs to fetch pages that block
  `PerplexityBot`; Perplexity disputes this, framing user-driven fetches as non-crawler. Audit take-away:
  state robots.txt posture, do NOT promise a hard block against user-triggered fetchers. [Cloudflare]
- **Opt-out tokens, not crawlers** (issue no requests; only signal training opt-out): `Google-Extended`,
  `Applebot-Extended`.
- **Deprecated tokens** (flag if present; do not act on them): `anthropic-ai`, `claude-web`.
- **Version tokens & a fourth OpenAI crawler (note):** OpenAI's live bots doc now enumerates FOUR
  crawlers with bumped version tokens — `GPTBot/1.4`, `OAI-SearchBot/1.4`, `ChatGPT-User/1.0` — plus a
  new `OAI-AdsBot/1.0` that validates the safety of pages submitted as ads on ChatGPT. `OAI-AdsBot` is
  neither training nor citation-index — an ads-safety validator, not an AEO lever. [OpenAI bots doc]
- **The footgun to surface prominently:** a `Disallow` (or broad `Disallow: /`) that hits a *search*
  bot or Googlebot on indexable routes removes citation eligibility — distinguish it from a deliberate
  *training* block, which is a decision. Data point (EMERGING): one study saw ~0.003 vs ~0.417 ChatGPT
  citations per Google ranking for blocked vs allowed sites.
- **Traffic weight (EMERGING, confidence: low):** OpenAI's three crawlers are ~58% of AI-bot traffic and
  OpenAI ~tripled its crawl volume YoY — reinforces that blocking OpenAI's search/user tier is the
  highest-cost AEO block. Directional, not a threshold. [Vercel/Botify]
- **Never auto-unblock or auto-block.** Report posture, explain the three tiers + the legal/licensing
  dimension, confirm intent, and record the decision in `claude/seo/decisions.md` so it isn't re-flagged.

## Related
- [extractability](extractability.md)
- [robots-txt-semantics](../crawlability/robots-txt-semantics.md)

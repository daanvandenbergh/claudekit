---
updated: 2026-07-09
source: https://discoveredlabs.com/blog/ai-citation-patterns-how-chatgpt-claude-and-perplexity-choose-sources ; https://everything-pr.com/ai-platform-citation-source-index-2026 ; re-verify each research run
type: fact
tags: [answer-engines, platforms, geo]
confidence: low
---

# How the engines differ — sourcing behavior, and why on-page work has an off-site ceiling

The major answer engines pull from different indexes and favor different source types, so no single
on-page change wins everywhere and outcomes are probabilistic. Report per-engine readiness as advisory;
never promise a citation, and phrase engine behavior as "reported/observed", never "the algorithm
does X". Exact percentages are single-vendor and EMERGING — cite direction, not magnitude.

## Facts
- **ChatGPT** — leans encyclopedic/reference (Wikipedia-heavy) over a Bing-derived index; `OAI-SearchBot`
  builds its search index, `ChatGPT-User` fetches on demand.
- **Perplexity** — continuous crawl leaning on community sources (Reddit) and YouTube; cites many
  sources per answer; `PerplexityBot` indexes, `Perplexity-User` fetches.
- **Google AI Overviews** — draw from the **main Google index** (so classic indexability still gates
  eligibility); Gemini can render JS via Googlebot's WRS (the one JS-rendering exception).
- **Claude** — `Claude-SearchBot` builds the retrieval index; `ClaudeBot` is training.
- **Microsoft Copilot** — sources via the Bing index (`Bingbot`).
- **Divergence:** ChatGPT and Perplexity share only ~11% of cited domains across large citation samples
  — ~71% of sources appear on a single platform; a ~680M-citation synthesis (Aug 2024-Apr 2026)
  corroborates this at ~12% domain overlap across three engines with ~71% of cited sources
  single-platform, so divergence is widening, not converging. Citation-worthiness therefore has a large
  **off-site** component (Wikipedia/Wikidata, Reddit/G2, digital PR) the repo can't edit — surface it as
  advisory so owners don't expect on-page edits alone to win.
- **Per-engine source-type skew (EMERGING, direction only — never a magnitude promise):**
  reported/observed top-citation skews — ChatGPT toward Wikipedia (~48% of top citations), Perplexity
  toward Reddit (~47%) and citing ~8 sources per answer, Google AI Overviews toward YouTube (~23%),
  Claude toward independent blogs (~44%). Sharpens the per-engine reads above; treat every figure as
  observed, not guaranteed. [everything-pr citation source index]
- **Audit output:** a short per-engine citation-readiness read (what helps/blocks each) plus the honest
  statement that placement can't be guaranteed.

## Related
- [entity-signals](entity-signals.md)
- [ai-referral-measurement](ai-referral-measurement.md)

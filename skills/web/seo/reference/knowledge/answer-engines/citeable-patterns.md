---
updated: 2026-07-09
source: https://arxiv.org/abs/2311.09735 (GEO, ACM SIGKDD 2024) ; https://ahrefs.com/blog/ ; https://ahrefs.com/blog/ai-overview-citations-top-10/ ; https://www.brightedge.com/resources/weekly-ai-search-insights/rank-overlap-after-16-months-of-aio ; re-verify each research run
type: fact
tags: [answer-engines, content, citations, geo]
---

# Citeable patterns — what actually earns an AI citation (peer-reviewed, not vendor hype)

The one rigorous anchor is the Princeton/Georgia Tech GEO paper (KDD 2024). Treat its DIRECTION as
established and its exact percentages as approximate; anything more precise in vendor blogs is
emerging/speculative. These are content improvements — flag and recommend, never fabricate a stat,
quote, or citation.

## Facts
- **Top boosts (GEO paper, ~10k queries, 9 tactics):** adding **statistics**, **direct quotations**
  from named sources, and **citations** to authoritative sources — headline "up to ~40%" citation-
  visibility lift, domain-dependent. Inline citations to credible sources are the single biggest lever.
  [arxiv 2311.09735]
- **Keyword stuffing did NOT help** and Google's May-2026 spam policy treats AI-answer manipulation as
  spam — so never inject keywords or chase density. (See the myths entry.)
- **Question-shaped headings:** phrase a section heading as the user's question; when proposing a
  rewrite, **preserve the old anchor id** (or add an alias) so in-page TOCs and external deep links
  don't break.
- **One-sentence definitions:** a "X is Y" definitional lead for the core term is preferentially quoted.
- **Named-expert quotes** where one genuinely fits (never invented).
- **Unsourced quantitative claims** ("studies show", bare percentages with no link) are a missed lever
  and a credibility risk — flag them for the author to source; never auto-insert a citation URL.
- **Rank decoupling (EMERGING magnitudes, robust direction):** the share of AI-Overview citations
  coming from the query's own top-10 organic results fell from ~76% (Jul 2025) to ~54% (BrightEdge, Oct
  2025), and by Feb 2026 the top-10 overlap sits in a ~17% (BrightEdge) to ~38% (Ahrefs) band —
  methodologies differ, so cite the RANGE, not a point. Ahrefs' distribution: ~38% of AIO citations from
  the top 10, ~31% from positions 11-100, ~31% from outside the top 100 (i.e. ~62-83% come from outside
  the organic top 10). "Just rank #1" is no longer sufficient; passage-level extractability and topical
  coverage matter. Direction robust; magnitudes emerging/low. [Ahrefs] [BrightEdge]

## Related
- [extractability](extractability.md)
- [entity-signals](entity-signals.md)
- [foundations/2026-seo-myths](../foundations/2026-seo-myths.md) (keyword density, word count, hand-added JSON-LD)

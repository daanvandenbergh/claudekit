---
updated: 2026-07-09
source: https://developers.google.com/search/docs/appearance/snippet (accessed 2026-07-09)
type: fact
tags: [titles-descriptions, on-page, meta-description, snippet, ctr]
---

# Meta description's role — snippet/CTR lever, not a ranking factor

The meta description does not rank a page; it is one candidate source for the SERP snippet, which Google generates primarily from on-page content and swaps to the description only when the description describes the page better for that query.

## Facts
- Google states snippets are "primarily created from the page content itself," and it uses the meta description "if it might give users a more accurate description of the page than content taken directly from the page." [g-snippet]
- The meta description is not a ranking factor (Google's snippet guidance frames it purely as snippet/description quality, not ranking); its value is click-through rate and, secondarily, as an AI-preview snippet source. [g-snippet]
- Because snippets are query-dependent and body-derived, the same page can show different snippets for different queries; a weak/missing description does not block a snippet — Google synthesizes one from the body. [g-snippet]
- Best practice per Google: write a unique, accurate description per page (never one identical/similar description site-wide, never a keyword list); for large database-driven sites, programmatic generation of descriptions from real page data "can be appropriate and are encouraged." [g-snippet]
- Fix constraint for audits: generate descriptions only by summarizing the page's own visible body — invent no price/shipping/feature claims not on the page. [g-snippet]
- Snippet-suppression/length directives (nosnippet, max-snippet:[number], data-nosnippet) are meta-robots controls — see metadata domain, do not duplicate here. [g-snippet]

## Related
- [thresholds](../foundations/thresholds.md)
- [title-link-generation](../titles-descriptions/title-link-generation.md)

---
updated: 2026-07-09
source: https://developers.google.com/search/docs/appearance/structured-data/sd-policies ; schema.org ; re-verify each research run
type: reference
tags: [answer-engines, entities, structured-data, eeat, geo]
---

# Entity & authority signals for AI citation — real identity only, never fabricated

AI engines resolve and trust *entities* (the org, the author) and weight firsthand expertise. The
levers are real, but every field — an author name, a credential, a `sameAs` URL, a Wikidata id, a date
— is a factual claim the audit must never invent. Extends structured-data D4 (`sameAs`) with the
AI-citation angle; the visible-content rule (D3) governs everything here.

## Facts
- **Organization/WebSite `sameAs`:** link the brand entity to its canonical knowledge-graph nodes
  (Wikidata, Wikipedia, LinkedIn, Crunchbase, official social). Wiring **known, real** profiles is
  Tier A; unknown ones are flag, never guessed.
- **Author identity:** a visible byline + `Person` schema with `sameAs` to LinkedIn/ORCID/Wikidata
  correlates with higher AI-Overview citation on expertise/YMYL topics. Wire an **existing** author name
  into a byline/`author` schema (Tier A); **never fabricate** a name, jobTitle, credential, or `sameAs`
  URL (writing bios / claiming experience is human-authored — flag). Every `sameAs` must resolve 2xx and
  be user-supplied.
- **Canonical entity-name consistency:** grep site *prose* for brand/product-name variants (casing,
  spacing, legal suffix) and propose normalizing to one canonical form — prose only, excluding code
  identifiers/package/class names.
- **About/entity page:** a canonical `/about` entity page anchors the organization for knowledge-graph
  alignment.
- **The visible-content rule is absolute:** structured data may only assert values visibly rendered on
  the page (Google sd-policies) — a mismatch risks a spammy-structured-markup manual action. Gate every
  emitted/kept schema property on a substring check against the rendered text. FAQPage may only wrap
  Q&A a human already authored and that is visible (its Google rich result is retired — add for
  extraction, not a rich result).
- **Off-site ceiling:** much citation-worthiness lives off the site (Wikipedia/Wikidata presence,
  Reddit/G2 mentions) and cannot be edited in the repo — surface these as advisory, not fixes.
- **Entity authority > domain authority (EMERGING, confidence: low):** 2026 GEO commentary converges on
  entity authority — a resolved, consistently-referenced identity — outweighing raw domain authority or
  keyword rank as the axis for AI citation. Directional framing that reinforces the `sameAs`/entity-name
  guidance above; not a separate lever. [2026 GEO commentary]

## Related
- [citeable-patterns](citeable-patterns.md)
- [platform-behavior](platform-behavior.md)
- [structured-data-visible-content-policy](../structured-data/structured-data-visible-content-policy.md)

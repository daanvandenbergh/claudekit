---
updated: 2026-07-09
source: https://support.google.com/business/answer/7091 (accessed 2026-07-09)
type: fact
tags: [local, nap, citations, consistency, trust]
---

# NAP consistency and citations — the local trust foundation

A single, byte-consistent Name/Address/Phone (NAP) rendered on the site (footer, contact, location pages) and matching third-party citations/directories is the baseline trust signal for local ranking — foundational but no longer a dominant lever.

## Facts
- **NAP consistency is the in-repo lever.** Grep the site for the business name, address, and phone; flag variants (abbreviations, suite formatting, phone punctuation, legacy addresses) and normalize to one canonical form that matches the GBP exactly. This is the same canonical-entity-name discipline as `answer-engines/entity-signals`, applied to postal identity.
- **Citations** = the business's NAP listed on third-party directories (Apple Maps, Bing Places, Yelp, industry/niche and local directories). They are largely off-site; the audit surfaces consistency/coverage as advisory, not a repo fix.
- Emit NAP once in the page prose (visible), then mirror it in `LocalBusiness` JSON-LD (see `localbusiness-schema-signal`) so the machine-readable value equals the rendered value — the visible-content rule from structured-data D3 applies.
- Quality over quantity: a few authoritative/niche citations outweigh many low-value directory listings; consistency and authority matter more than raw count. (Vendor specifics — e.g. "2.4× more reputable", "10–15× weight for authoritative directories" — are single-source marketing stats, **confidence: low**; use as direction, not thresholds.) [brightlocal.com/learn/google-local-algorithm-and-ranking-factors]

## Related
- [gbp-local-pack](../local/gbp-local-pack.md)
- [localbusiness-schema-signal](../local/localbusiness-schema-signal.md)

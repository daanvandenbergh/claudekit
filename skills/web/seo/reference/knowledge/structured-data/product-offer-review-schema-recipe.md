---
updated: 2026-07-09
source: https://developers.google.com/search/docs/appearance/structured-data/product-snippet (accessed 2026-07-09)
type: procedure
tags: [structured-data, product, offer, aggregaterating, review, merchant-listing]
---

# Product + Offer + AggregateRating / Review JSON-LD recipe

A product snippet requires name plus at least one of offers, review, or aggregateRating; merchant-listing eligibility additionally requires priceCurrency and offer availability.

## Steps
1. Product snippet required: name PLUS at least one of offers, review, or aggregateRating. [Google product-snippet doc]
2. Offer: price (or priceSpecification.price) is required; priceCurrency is recommended for product snippets but REQUIRED for merchant-listing experiences; add availability (schema.org ItemAvailability, e.g. InStock/OutOfStock) for merchant listings. [Google product-snippet doc]
3. AggregateRating: provide ratingValue plus a count (ratingCount or reviewCount); Review: provide reviewRating (with ratingValue) and author (a valid Person or Team name). [Google product-snippet / Review-snippet doc]
4. Product snippet (non-purchasable) vs merchant listing (purchasable): supplying the merchant-listing required fields also makes the page eligible for product snippets; pairing on-page structured data with a Merchant Center feed maximizes eligibility. [Google product doc]
5. Review markup must be genuine, user-visible reviews — business-authored or fabricated star ratings can trigger a manual action (see structured-data-visible-content-policy). [Google sd-policies]

## Related
- [structured-data-visible-content-policy](../structured-data/structured-data-visible-content-policy.md)
- [rich-results-eligibility-2026](../structured-data/rich-results-eligibility-2026.md)

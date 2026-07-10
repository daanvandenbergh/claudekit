---
updated: 2026-07-09
source: https://developers.google.com/search/docs/appearance/structured-data/local-business (accessed 2026-07-09)
type: reference
tags: [local, structured-data, localbusiness, schema, geo, openinghours]
---

# LocalBusiness structured data — a supporting signal, not the lever

`LocalBusiness` JSON-LD makes the site's NAP, geo, hours, and phone machine-readable and reinforces the same entity Google knows from the GBP — but it is a supporting/eligibility signal; the ranking lever remains the GBP and reviews, so absent markup on a local page is a real gap, present markup is not a ranking shortcut.

## Facts
- Google requires only **name** + **address** (PostalAddress: street, locality, region, postalCode, country). Recommended and worth emitting when the value is on the page: **geo** (latitude/longitude, ≥5 decimal places), **telephone** (primary contact, with country/area code), **openingHoursSpecification** (array; seasonal hours via `validFrom`/`validThrough`), plus `url`, `priceRange`, `image`. [developers.google.com/search/docs/appearance/structured-data/local-business]
- Every emitted property must equal visible page content (structured-data D3 visible-content rule); the `LocalBusiness` @type should be the most specific subtype that fits (e.g. `Restaurant`, `Dentist`) — see schema.org/LocalBusiness. [schema.org/LocalBusiness]
- Google treats structured data as one input and "does not guarantee" a feature will show — the doc makes **no** claim that markup outranks GBP. Frame it as reinforcement of NAP + eligibility, not a lever. [developers.google.com/search/docs/appearance/structured-data/local-business]
- **Full recipe / required-props / department-nesting deferred to `structured-data`** — this entry only fixes local's stance: markup is supporting, GBP is primary.

## Related
- [nap-citations](../local/nap-citations.md)
- [gbp-local-pack](../local/gbp-local-pack.md)

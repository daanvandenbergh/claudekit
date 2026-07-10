---
updated: 2026-07-09
source: https://support.google.com/business/answer/2853879 (accessed 2026-07-09)
type: reference
tags: [local, gbp, service-area, schema, nap]
---

# Service-area businesses — hide the address, don't fake a storefront

A service-area business (SAB) — one that visits or delivers to customers rather than serving them at its own premises (plumber, cleaner, mobile mechanic, home contractor) — must NOT publish a fake/residential storefront address; it should hide the address on its Google Business Profile and declare a service area instead, and the audit should treat a missing `address` differently for these sites than for a storefront business.

## Facts
- Google's guidance: "You should only choose to not show your address if your business is a service-area business... A service-area business is one that visits or delivers to customers directly but doesn't serve customers at their business address, such as cleaning services or plumbers... If you're a service-area business, you should hide your business address from customers." [support.google.com/business/answer/2853879]
- On the GBP itself, an SAB removes/hides its street address and instead defines **up to 20 service areas** (by city, postal code, or other area); if none is set, Google chooses a default local area. [support.google.com/business/answer/2853879]
- **Structured-data stance:** Google's own `LocalBusiness` structured-data doc (see `localbusiness-schema-signal`) lists `address` as required and gives no documented exception or `areaServed` alternative for SABs — treat a missing `address` on an SAB page as unresolved/advisory, not a clean pass, since Google has not published an official SAB schema pattern. [developers.google.com/search/docs/appearance/structured-data/local-business, accessed 2026-07-09]
- Schema.org itself is more permissive: `address` is optional at the spec level, and `LocalBusiness` (via `Organization`) has an `areaServed` property (`AdministrativeArea`/`GeoShape`/`Place`/`Text`) for exactly this "serves a region, no public storefront" case — usable in JSON-LD even though Google's own doc doesn't formally endorse it as an `address` substitute. [schema.org/LocalBusiness, accessed 2026-07-09]
- Audit implication: before flagging a local page for a missing/incomplete street address, first determine whether the business is a storefront or a service-area business (check GBP category / page copy for "we come to you" language) — an SAB legitimately has no public address to emit, and an audit that demands one is asking for a policy violation (a fake address).

## Related
- [localbusiness-schema-signal](localbusiness-schema-signal.md)
- [gbp-local-pack](gbp-local-pack.md)
- [nap-citations](nap-citations.md)

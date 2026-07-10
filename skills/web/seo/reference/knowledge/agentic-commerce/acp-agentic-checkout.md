---
updated: 2026-07-09
source: https://developers.openai.com/commerce/guides/key-concepts ; https://developers.openai.com/commerce/specs/checkout ; https://openai.com/index/buy-it-in-chatgpt/ (accessed 2026-07-09)
type: reference
tags: [agentic-commerce, acp, checkout, product-feed, openai, stripe]
confidence: low
---

# ACP (Agentic Commerce Protocol) — checkout as an API, not a page

OpenAI's ChatGPT "Buy it in ChatGPT" / Instant Checkout (launched 2026-02-16, US Plus/Pro/Free users) is powered by the Agentic Commerce Protocol (ACP), an open standard co-developed by OpenAI and Stripe (Apache 2.0). A merchant participates by exposing a structured PRODUCT FEED plus a REST checkout API — the rendered HTML page and its Product/Offer JSON-LD are not what the agent transacts against.

## Facts
- **Product feed** (separate artifact from on-page JSON-LD): a secure, regularly-refreshed CSV or JSON feed of identifiers, descriptions, pricing, inventory, media and fulfillment options that OpenAI ingests to surface products in ChatGPT search/shopping — required fields drive accurate price/availability, recommended fields (e.g. reviews) affect ranking within ChatGPT's results. [developers.openai.com/commerce/guides/key-concepts]
- **Agentic Checkout Spec**: the merchant must implement 5 HTTPS REST endpoints — `POST /checkout_sessions` (create), `POST /checkout_sessions/{id}` (update), `POST /checkout_sessions/{id}/complete` (finalize), `POST /checkout_sessions/{id}/cancel`, `GET /checkout_sessions/{id}` (retrieve). Every request/response carries `Authorization` (Bearer), `Idempotency-Key`, `Request-Id`, `Signature` (base64 HMAC), `Timestamp` (RFC 3339), `API-Version`; responses require `id`, `status` (not_ready_for_payment / ready_for_payment / completed / canceled), `currency` (ISO 4217), `line_items`, `totals`, `fulfillment_options`, `messages`, `links` (ToS/privacy). [developers.openai.com/commerce/specs/checkout]
- **Payment**: via the Delegated Payment Spec, OpenAI shares payment details with the merchant/its PSP without OpenAI becoming the merchant of record; Stripe's Shared Payment Token is the first compatible implementation. The merchant still owns tax calculation, fulfillment decisioning and fraud/risk on its own systems. [developers.openai.com/commerce/guides/key-concepts]
- **Adoption (2026 snapshot, fast-moving)**: Etsy sellers live at launch; 1M+ Shopify merchants (Glossier, SKIMS, Spanx, Vuori) rolling out; PayPal's ACP server bringing many more small merchants onto the protocol during 2026. [openai.com/index/buy-it-in-chatgpt]
- **Relationship to structured-data**: ACP's product feed is feed-based (like a Google Merchant Center feed), not the page's Product/Offer/AggregateRating JSON-LD covered in `structured-data/product-offer-review-schema-recipe.md` — the two are complementary, not substitutes; an audit should treat ACP feed presence/correctness as a separate check from on-page schema.

## Related
- [ap2-agent-payments-protocol](ap2-agent-payments-protocol.md)
- [product-offer-review-schema-recipe](../structured-data/product-offer-review-schema-recipe.md) (on-page schema is a separate, complementary artifact)

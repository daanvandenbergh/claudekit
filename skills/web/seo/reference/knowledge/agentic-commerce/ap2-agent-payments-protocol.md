---
updated: 2026-07-09
source: https://cloud.google.com/blog/products/ai-machine-learning/announcing-agents-to-payments-ap2-protocol ; https://ap2-protocol.org/ ; https://github.com/google-agentic-commerce/AP2 (accessed 2026-07-09)
type: reference
tags: [agentic-commerce, ap2, payments, mandates, google]
confidence: low
---

# AP2 (Agent Payments Protocol) — the trust/authorization layer under agent purchases

AP2 is Google's open standard (announced 2025-09-16, 60+ launch partners incl. Mastercard, PayPal, Coinbase, American Express, Salesforce) for authorizing an AI agent to transact on a user's behalf. It is a different layer than ACP: ACP is the merchant-facing checkout/product-feed API; AP2 is the cryptographic trust model that can sit underneath ACP (or any other checkout protocol).

## Facts
- **Three signed Mandates**, carried as W3C Verifiable Credentials: an **Intent Mandate** (what the user authorized the agent to buy), a **Cart Mandate** (what the agent actually assembled/priced), and a **Payment Mandate** (what the merchant/network will charge) — each cryptographically signed so a merchant/issuer can verify the purchase matches the user's real authorization. [cloud.google.com/blog … ap2-protocol]
- AP2 treats stablecoin rails as first-class alongside cards and bank transfers, unlike ACP which is card/PSP-centric via Stripe. [ap2-protocol.org]
- **ACP and AP2 compose, not compete**: an ACP-via-Stripe transaction can also flow through AP2 when the underlying card network supports it; both interoperate with x402 (a separate agent-payment rail). Treat all three as layers of one emerging stack, not rival standards to pick between. [industry synthesis, 2026]
- Audit relevance: neither protocol is something a content/marketing site implements today unless it sells products; flag AP2/ACP readiness only for e-commerce sites, and treat any recommendation to adopt either as a business/engineering decision (Tier C, flag-and-confirm), never an auto-fix — both require a real payment/fulfillment backend, not a markup change.

## Related
- [acp-agentic-checkout](acp-agentic-checkout.md)

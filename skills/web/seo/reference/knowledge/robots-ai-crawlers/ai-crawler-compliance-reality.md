---
updated: 2026-07-09
source: https://blog.cloudflare.com/perplexity-is-using-stealth-undeclared-crawlers-to-evade-website-no-crawl-directives/ ; https://docs.perplexity.ai/docs/resources/perplexity-crawlers (accessed 2026-07-09)
type: fact
tags: [robots-ai-crawlers, ai-crawlers, robots-txt, compliance, enforcement]
confidence: low
---

# robots.txt is advisory, not enforcement — who honors it, who doesn't, in 2026

robots.txt only works on crawlers that CHOOSE to obey it; user-triggered agents explicitly may not, vendors disagree on this, and blocking a determined crawler needs IP/WAF/edge enforcement, not just a Disallow line.

## Facts
- robots.txt is VOLUNTARY. It expresses a preference; enforcement is on the crawler. A `Disallow` is not access control — sensitive content needs auth/edge blocking, not robots.txt (which is public and even advertises the paths you hide). [RFC9309]
- USER-TRIGGERED agents diverge by vendor: OpenAI says of `ChatGPT-User` that "because these actions are initiated by a user, robots.txt rules may NOT apply" — whereas Anthropic says `Claude-User` DOES honor robots.txt. Same functional tier, opposite compliance stance — never assume "user-triggered = ignores robots.txt" uniformly. [OpenAI][Anthropic]
- Enforcement gap in the wild (2025): Cloudflare found Perplexity STEALTH-CRAWLING sites that had blocked `PerplexityBot`/`Perplexity-User` in both robots.txt and WAF — rotating IPs/ASNs and posing as a generic Chrome-on-Mac browser UA. Cloudflare de-listed Perplexity as a verified bot and added heuristics to block it. Perplexity disputed this, framing it as user-initiated assistant fetches, not crawling. [Cloudflare]
- Perplexity's OWN docs state `Perplexity-User` "generally ignores robots.txt rules since 'a user requested the fetch'" — Perplexity officially documents the SAME user-triggered-bypasses-robots.txt stance as OpenAI's `ChatGPT-User`, not just the disputed stealth `PerplexityBot` behavior above. `PerplexityBot` (the declared search-indexing crawler) is documented as respecting robots.txt; the non-compliance is specific to `Perplexity-User`. [Perplexity]
- `Bytespider` (ByteDance) is repeatedly reported as aggressive and inconsistent with robots.txt — high request rates, large bandwidth, weak compliance. Treat a robots.txt block of it as best-effort. [Bytespider]
- Practical consequence: to actually STOP a non-compliant AI crawler you need server/edge enforcement (WAF, verified-bot allowlists, per-UA IP verification), not a robots.txt line. robots.txt only reliably controls the well-behaved (OpenAI, Anthropic, Googlebot). [Cloudflare][RFC9309]
- Verify a claimed bot before trusting its UA: OpenAI/Anthropic/Google publish IP ranges and reverse-DNS for their crawlers — a matching UA string alone is trivially spoofable. [OpenAI]

## Related
- [ai-crawlers](../answer-engines/ai-crawlers.md)
- [ai-crawler-ua-catalog-2026](../robots-ai-crawlers/ai-crawler-ua-catalog-2026.md)
- crawlability

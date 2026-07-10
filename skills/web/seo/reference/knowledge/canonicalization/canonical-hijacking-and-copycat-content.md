---
updated: 2026-07-09
source: https://developers.google.com/search/docs/crawling-indexing/canonicalization-troubleshooting [google-canon-troubleshoot] (accessed 2026-07-09)
type: fact
tags: [canonicalization, security, syndication]
---

# Canonical hijacking via malicious code/misconfigured servers, and copycat/scraper sites

A site's canonical selection can be hijacked by attacker-injected redirects/canonical tags or by server misconfiguration — distinct from the self-inflicted mistakes in common-canonical-mistakes — and scraped/copycat sites republishing your content require a takedown, not a canonicalization fix.

## Facts
- Google's dedicated canonicalization-troubleshooting page (last updated 2025-12-18) lists causes of canonicalization problems beyond ordinary tagging mistakes: language variants missing hreflang, CMS/plugin-injected wrong canonicals, misconfigured servers serving one domain's content for another's requests, malicious hacking, syndicated content, and copycat websites. [google-canon-troubleshoot]
- Malicious hacking: "Some attacks introduce code that returns an HTTP 3xx redirect or inserts a cross-domain rel=\"canonical\" link annotation" — Google's algorithms can then select the attacker's malicious URL as canonical over the legitimate page. An audit that finds an unexplained cross-domain canonical or unexpected 3xx should treat it as a possible compromise indicator, not just a config bug. [google-canon-troubleshoot]
- CMS/plugin double-canonicalization: some CMSes or SEO plugins "can make incorrect use of canonicalization techniques to point to undesired URLs" — check the actually-rendered `<head>` in browser dev tools (not just the CMS setting) and contact the CMS/plugin vendor if it's wrong. [google-canon-troubleshoot]
- Misconfigured servers can cause unexpected cross-domain URL/canonical selection, e.g. a server answering requests for other.example with example.com's content — a hosting/DNS/vhost issue, not a tagging issue. [google-canon-troubleshoot]
- Copycat websites: external sites can host your content without permission with no canonicalization fix available on your side; the remedy is a DMCA takedown filing or contacting the hosting provider directly — this is an off-site legal/administrative remedy, not something rel=canonical or noindex resolves. [google-canon-troubleshoot]

## Related
- [common-canonical-mistakes](common-canonical-mistakes.md)
- [cross-domain-canonical](cross-domain-canonical.md)
- [canonical-is-a-hint](canonical-is-a-hint.md)

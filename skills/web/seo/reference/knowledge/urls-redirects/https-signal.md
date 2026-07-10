---
updated: 2026-07-09
source: https://developers.google.com/search/blog/2014/08/https-as-ranking-signal (accessed 2026-07-09)
type: fact
tags: [urls-redirects, https, ranking-signal, page-experience]
confidence: low
---

# HTTPS as an SEO signal

HTTPS is a real but lightweight ranking signal, now folded into page-experience, and Google prefers the HTTPS version of a page as canonical — so serve the whole site over HTTPS and 301 http→https.

## Facts
- Google announced HTTPS as a ranking signal in 2014, describing it as "lightweight" — originally affecting <1% of global queries and outweighed by content quality. [https-as-ranking-signal]
- Google removed HTTPS from the explicit standalone ranking-signals list but it still contributes indirectly via page experience — it should not be ignored. [secondary synthesis]
- All-HTTPS pairs with host consolidation: 301-redirect http→https so one secure origin is canonical; Google prefers the HTTPS URL as canonical over an equivalent HTTP one. [see canonical-host-consolidation]
- Rot-prone: the "<1% of queries" figure dates to 2014 and Google's public framing of HTTPS weight has shifted (page-experience era); treat the magnitude as directional, not current.

## Related
- [canonical-host-consolidation](../urls-redirects/canonical-host-consolidation.md)
- [thresholds](../foundations/thresholds.md)

---
updated: 2026-07-09
source: https://web.dev/articles/ttfb (accessed 2026-07-09)
type: fact
tags: [core-web-vitals, ttfb, lcp, performance, server]
---

# TTFB (~≤ 0.8s) as an LCP input, not a Core Web Vital

Time to First Byte should aim for ≤ 0.8s at p75; it is not a Core Web Vital but precedes and gates LCP, so a slow TTFB caps how good LCP can be.

## Facts
- Most sites should target TTFB ≤ 0.8s (measured at the 75th percentile). [web.dev/ttfb]
- TTFB is explicitly NOT a Core Web Vital — meeting its band is not mandatory as long as it does not impede the metrics that are (chiefly LCP). [web.dev/ttfb]
- TTFB precedes FCP and LCP; improving it can indirectly improve LCP, but the strength of the link depends on architecture (server-rendered vs client-rendered). [web.dev/ttfb]
- DEFER: image optimization for LCP → media; JS/hydration cost → js-rendering; measurement tools (Lighthouse/PSI/CrUX API/Search Console) → measurement-tooling.

## Related
- [thresholds](../foundations/thresholds.md)
- [field-vs-lab-crux](../core-web-vitals/field-vs-lab-crux.md)

---
updated: 2026-07-09
source: https://developer.chrome.com/docs/crux/methodology/metrics (accessed 2026-07-09)
type: fact
tags: [core-web-vitals, crux, field-data, lab-data, lighthouse, measurement]
---

# Field (CrUX) vs lab data — field is what ranks

Google's page-experience assessment uses CrUX field data — real-Chrome-user measurements aggregated over a 28-day rolling window at the 75th percentile — not lab/synthetic Lighthouse scores, which are diagnostic-only.

## Facts
- CrUX = a 28-day rolling aggregate of real-user (opted-in Chrome) measurements, updated daily ~04:00 UTC; reported at the 75th percentile per metric. [developer.chrome.com/docs/crux/methodology/metrics]
- Percentile values are synthetically derived from coarse histogram buckets (100ms LCP, 25ms INP, 0.05 CLS) — a p75 does not mean a specific user hit that exact value. [developer.chrome.com/docs/crux/methodology/metrics]
- Lab tools (Lighthouse, PSI lab run) are single-environment synthetic loads: directional/diagnostic only and can diverge from field. Low-traffic URLs have insufficient CrUX samples and get NO field data — report their lab results as "not field-confirmed". [web.dev/articles/lab-and-field-data-differences]
- INP is field-only (needs real input); LCP and CLS exist in both lab and field, but only field values feed ranking. [web.dev/vitals]

## Related
- [thresholds](../foundations/thresholds.md)
- [ttfb-lcp-input](../core-web-vitals/ttfb-lcp-input.md)
- [page-experience-signal](../core-web-vitals/page-experience-signal.md)

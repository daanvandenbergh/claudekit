---
updated: 2026-07-09
source: https://web.dev/blog/inp-cwv-march-12 (accessed 2026-07-09)
type: fact
tags: [core-web-vitals, inp, fid, responsiveness]
---

# INP replaced FID (March 12, 2024)

Interaction to Next Paint (INP) became a stable Core Web Vital and replaced First Input Delay (FID) on 2024-03-12; FID is deprecated and no longer measured.

## Facts
- INP officially became a Core Web Vital and replaced FID on 2024-03-12. [web.dev/blog/inp-cwv-march-12]
- FID was removed from Search Console on the switch date; PSI/CrUX ran a ~6-month deprecation, and Chrome/CrUX support for FID ended 2024-09-09. [web.dev/blog/fid]
- INP measures the latency of all page interactions (not just the first); good ≤ 200ms at p75. It cannot be measured in a lab/synthetic run — it requires real user input, so INP has no Lighthouse lab value. [web.dev/vitals]

## Related
- [thresholds](../foundations/thresholds.md)
- [field-vs-lab-crux](../core-web-vitals/field-vs-lab-crux.md)

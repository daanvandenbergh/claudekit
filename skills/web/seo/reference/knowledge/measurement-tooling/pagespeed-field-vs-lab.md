---
updated: 2026-07-09
source: https://developers.google.com/speed/docs/insights/v5/about (accessed 2026-07-09)
type: fact
tags: [measurement-tooling, core-web-vitals, pagespeed, lighthouse, crux]
---

# PageSpeed Insights — field (CrUX) vs lab (Lighthouse), and which one counts

The Core Web Vitals assessment uses field data (CrUX) EXCLUSIVELY at the 75th percentile over a trailing 28 days; Lighthouse lab data is a repeatable diagnostic that is expected to differ from the field and does not by itself pass or fail CWV.

## Facts
- **PSI shows both:** field data from the **Chrome User Experience Report (CrUX)** — anonymized real Chrome-user data, trailing **28 days**, updated daily in PSI, reported at the **75th percentile** — and lab data from **Lighthouse** (simulated single load on a mid-tier Moto G4 + throttled mobile network, from a Google datacenter). [PSI-about]
- **The CWV assessment uses field data exclusively:** it requires the p75 of **INP, LCP, and CLS** to be "Good" to pass. A page with no CrUX data shows no assessment (insufficient real-user traffic). [PSI-about]
- **Lab ≠ field is normal, not a bug:** Lighthouse returns the same result every run in a fixed environment; field data is a distribution across real devices/networks. A perfect Lighthouse score does not guarantee good field CWV, and a poor lab score does not prove real users suffer — so never treat a Lighthouse number as the CWV verdict. [web.dev/lab-and-field]
- **Google Search Console's Core Web Vitals report is powered by CrUX (field), not Lighthouse** — same field-first basis as the CWV ranking signal. [PSI-about]
- Numeric Good/Needs-improvement/Poor thresholds are OUT OF SCOPE here → see foundations/thresholds.md and the core-web-vitals domain entry.

## Related
- core-web-vitals
- [thresholds](../foundations/thresholds.md)
- [gsc-verify-reports](../measurement-tooling/gsc-verify-reports.md)

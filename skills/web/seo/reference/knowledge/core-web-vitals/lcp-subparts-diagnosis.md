---
updated: 2026-07-09
source: https://developer.chrome.com/docs/crux/methodology/metrics (accessed 2026-07-09)
type: fact
tags: [core-web-vitals, lcp, crux, diagnostics]
---

# LCP subparts — diagnose LCP by phase, not just the total

CrUX (and PageSpeed Insights, which surfaces CrUX field data) breaks Largest Contentful Paint into four sequential subparts so a slow LCP can be attributed to a specific phase rather than treated as one opaque number.

## Facts
- The four LCP subparts are: Time to First Byte (server response wait), Resource Load Delay (delay before the browser starts fetching the LCP resource), Resource Load Duration (time spent fetching it), and Element Render Delay (time from resource-ready to actually painted). [developer.chrome.com/docs/crux/methodology/metrics]
- Load Delay and Load Duration only exist when the LCP element is an image/video resource; a text LCP element (e.g. an `<h1>`) only has two subparts — TTFB and Render Delay. [developer.chrome.com/docs/crux/methodology/metrics]
- Subparts were added to CrUX in Feb 2024 and expanded (image subparts + Round Trip Time) in the Feb 2025 CrUX update; each subpart is independently aggregated at p75 across page views, so the four subparts do NOT sum to the overall p75 LCP value — read them as relative importance, not an exact split. [developer.chrome.com/blog/crux-2025-02]
- PageSpeed Insights surfaces this breakdown under its field-data ("Discover what your real users are experiencing") section, distinct from the lab-only Lighthouse diagnostics section. [developer.chrome.com/docs/crux/guides/pagespeed-insights]
- Audit use: when LCP fails its threshold, use the subpart breakdown to target the fix — slow TTFB → server/CDN work (see ttfb-lcp-input.md); slow Load Delay → render-blocking resources or late resource discovery; slow Load Duration → unoptimized/uncompressed asset or missing CDN; slow Render Delay → main-thread blocking JS/hydration cost (see ../js-rendering/).

## Related links
- [ttfb-lcp-input](ttfb-lcp-input.md)
- [field-vs-lab-crux](field-vs-lab-crux.md)
- [pagespeed-field-vs-lab](../measurement-tooling/pagespeed-field-vs-lab.md)
- [image-perf](../media/image-perf.md)

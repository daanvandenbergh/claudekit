---
updated: 2026-07-09
source: web.dev/articles/vitals + Google Search Central (sitemaps, crawl) 2026 — build-sitemap https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap · 301-redirects https://developers.google.com/search/docs/crawling-indexing/301-redirects · http-status-codes https://developers.google.com/crawling/docs/troubleshooting/http-status-codes · title-link https://developers.google.com/search/docs/appearance/title-link; re-verify each research run
type: fact
tags: [core-web-vitals, thresholds, performance, crawlability]
---

# Dated SEO thresholds

The numeric bands the checklist restates inline. This is the dated, sourced home; the checklist
repeats a number only so a check is operable. Re-verify each research run — these move (INP replaced
FID in 2024).

## Facts
- **Core Web Vitals** (pass = 75th percentile of real-user **field** data, per URL group) — bands
  re-verified 2026-07-09 as unchanged ([web.dev/articles/vitals]; the circulating "Google tightened
  LCP to 2.0s in 2026" claim is **false**):
  - **LCP** — good ≤ 2.5s · needs-improvement 2.5-4s · poor > 4s. [web.dev/lcp]
  - **INP** — good ≤ 200ms · needs-improvement 200-500ms · poor > 500ms. Replaced FID as a Core Web
    Vital in **March 2024**. [web.dev/inp]
  - **CLS** — good ≤ 0.1 · needs-improvement 0.1-0.25 · poor > 0.25. [web.dev/cls]
  - Lab tools (Lighthouse/PSI) are **directional only**; low-traffic URLs have no CrUX field data —
    report lab results as "not field-confirmed". Field data lags ~28 days.
- **TTFB** — aim ≤ 0.8s as a supporting metric (feeds LCP). [web.dev/ttfb]
- **XML sitemap limits** — ≤ **50,000 URLs** and ≤ **50 MB uncompressed** per file (whichever is hit
  first); split with a **sitemap index**, which is itself capped at **50,000 child sitemaps / 50 MB** —
  the oft-cited "500 sitemaps per index" figure is a myth. (Re-verified 2026-07-09, Google Search
  Central build-sitemap.) [Google Search Central, sitemaps]
- **Redirects** — **1 hop is ideal; avoid chains** (no hard "≤2" rule) — "By default, Google's
  crawlers follow up to **10 redirect hops**" before flagging a redirect error and dropping the page
  (specific Google products may cap lower); no loops. [Google Search Central, http-status-codes]
  Permanent moves use **301** (or 308), not 302. [Google Search Central, 301-redirects]
- **Crawl depth** — important pages reachable within ~**3 clicks** of the homepage.
- **Title** — front-load the keyword; Google imposes **no length limit** and truncates the title link
  by **rendered pixel width** (~600px ≈ ~60 chars on desktop, varies with glyph widths), so the
  ~30-60 char figure is snippet *guidance*, not a pass/fail count (see [2026-seo-myths](2026-seo-myths.md)).
- **Meta description** — **no hard character cap** in the element; ~120-160 chars is the typical desktop
  snippet render (truncated by pixel width), not a limit. CTR/snippet copy, frequently rewritten by Google.
- **Social image** — ≥ 1200×630 for OG/Twitter large cards.

## Related
- [2026-seo-myths](2026-seo-myths.md)
- [field-vs-lab-crux](../core-web-vitals/field-vs-lab-crux.md)

---
updated: 2026-07-09
source: https://support.google.com/webmasters/answer/9012289 (accessed 2026-07-09)
type: procedure
tags: [measurement-tooling, google-search-console, indexation, verification]
---

# Google Search Console — which report verifies which SEO fact

For a single page use URL Inspection (Test Live URL = fresh Googlebot-Smartphone fetch + render); for site-wide index/coverage, robots, sitemaps, and query performance use the dedicated GSC reports — but all require verified-property access, so treat GSC as advisory evidence the audit reads, not an in-session fix it can apply.

## Steps
1. **URL Inspection tool** returns Google's own view of ONE URL from a verified property; default = Google-index (cached) status, **Test Live URL** triggers a fresh real-time fetch by Googlebot Smartphone, renders in current Chromium, and returns live index/render status. [GSC-help]
2. **View tested page** (available on a live test when status is "URL is available to Google" / "…but has issues") exposes the **rendered HTML, a screenshot, HTTP headers, JavaScript console output, and loaded page resources** — the way to confirm what Google actually rendered vs your raw HTML. [GSC-help]
3. **Page Indexing (Coverage) report** = site-wide index status grouped by reason (indexed / not indexed + cause); it is NOT for checking one specific URL — for a single URL use URL Inspection. **Performance report** = queries/clicks/impressions/CTR/position. **Sitemaps report** = submitted-sitemap status/discovered URLs. **robots.txt report** = the robots.txt files Google found for the top 20 hosts, last-crawl time, warnings/errors, with a request-recrawl button. [GSC-help]
4. **Request Indexing** via URL Inspection is capped at roughly **~10–12 URLs/day/property** (Google does not publish the exact number; it varies by account/site) — a rot-prone, unofficial figure. [alevdigital, unofficial]
5. GSC needs a **verified property**, so its data is evidence the audit READS/reports; verifiable-in-repo signals (served HTML title/description/canonical, robots directives, JSON-LD, raw-HTML primary content, sitemap well-formedness) still feed the pass/fail verdict — GSC index outcomes are advisory. (See ai-referral-measurement for the verifiable-vs-advisory split.)

## Related
- [ai-referral-measurement](../answer-engines/ai-referral-measurement.md)
- [pagespeed-field-vs-lab](../measurement-tooling/pagespeed-field-vs-lab.md)
- [structured-data-validators](../measurement-tooling/structured-data-validators.md)
- [retired-seo-tools](../measurement-tooling/retired-seo-tools.md)

---
updated: 2026-07-09
source: https://searchengineland.com/google-officially-drops-mobile-usability-report-mobile-friendly-test-tool-and-mobile-friendly-test-api-435377 ; https://searchengineland.com/google-search-console-adds-robots-txt-report-434708 (accessed 2026-07-09)
type: fact
tags: [measurement-tooling, deprecated, verification, do-not-recommend]
confidence: low
---

# Retired Google SEO tools — do not point the audit at dead tools

The standalone robots.txt Tester and the Mobile-Friendly Test / Mobile Usability report (and its API) have been removed — the audit must route those checks to their live replacements instead of recommending dead URLs.

## Facts
- **Standalone robots.txt Tester: removed.** Announced ~November 2023 and replaced by the **robots.txt report inside Search Console** (top-20 hosts, last-crawl, warnings/errors, request-recrawl). Do not send users to the old tester URL. [SearchEngineLand, seroundtable]
- **Mobile-Friendly Test: retired.** The Mobile-Friendly Test tool, the Mobile-Friendly Test **API**, and the **Mobile Usability report** were deprecated as of **1 December 2023** and fully removed thereafter — mobile-first is universal, so a standalone mobile test is redundant. For rendering/responsiveness checks use **PageSpeed Insights** / URL Inspection's live-render view instead. [SearchEngineLand]
- Also retired earlier: the **Structured Data Testing Tool** (→ Schema Markup Validator, see structured-data-validators). These are rot-prone availability facts — re-verify each research run before the audit cites any external testing URL.

## Related
- [gsc-verify-reports](../measurement-tooling/gsc-verify-reports.md)
- [structured-data-validators](../measurement-tooling/structured-data-validators.md)
- [pagespeed-field-vs-lab](../measurement-tooling/pagespeed-field-vs-lab.md)

---
updated: 2026-07-09
source: https://support.google.com/webmasters/answer/16984139?hl=en ; https://support.google.com/webmasters/answer/16983858?hl=en ; https://developers.google.com/search/blog/2026/06/gen-ai-performance-reports (accessed 2026-07-09)
type: fact
tags: [measurement-tooling, gsc, generative-ai, ai-overviews, discover]
---

# Search Console — Generative AI performance reports (Search + Discover)

Google Search Console shipped new, separate 'Generative AI performance' reports for Search and for Discover (announced 3 June 2026) that show IMPRESSIONS ONLY inside AI Overviews / AI Mode (Search report) and generative-AI Discover surfaces — no clicks, no CTR, no average position, and no query-level breakdown, so it cannot answer "why did this page get cited" the way the classic Performance report answers "why did this page rank."

## Facts
- **Two separate reports**, not a tab on the existing Performance report: Generative AI performance report (Search) covers AI Overviews + AI Mode impressions; Generative AI performance report (Discover) covers generative-AI Discover surfaces. Both exclude experimental Search Labs features. [Google Search Console Help]
- **Dimensions available:** Pages (grouped by final URL after redirects), Countries, Dates (daily/weekly/monthly, Pacific Time), and Devices (desktop/tablet/mobile — Search report only). Standard GSC constraints apply (1,000-row limit per dimension); newest data may be preliminary (shown dotted) and property-level chart totals can differ from page-level table totals. [Google Search Console Help]
- **No click/CTR/position/query data at launch** — Google states it is "continuing to work with website owners to understand what insights... would be most helpful," i.e. more metrics may be added later; treat the current impressions-only shape as a snapshot, not a ceiling. [Google Search Central Blog, 2026-06]
- **Rollout is partial, not universal:** as of access date, limited to a subset of website owners/properties (reported as UK-based properties initially), gated on property eligibility and sufficient AI-feature impressions; a site with real AI-Overview citations may still show nothing if it isn't in the rollout cohort — do not treat an empty/missing report as proof of zero AI visibility. [Google Search Console Help]
- **A companion opt-out control** now lets a site owner exclude their content from generative AI features (AI Overviews / AI Mode / AI Overviews-in-Discover) via Search Console settings, without penalizing classic web-search ranking; Google began honoring this opt-out 17 June 2026. A site that has opted out will show no data in this report. [Google Search Central Blog, 2026-06]
- Positioning vs the existing GSC advisory-evidence model: like the classic Performance report, this is verified-property, Google-side evidence the audit READS/reports — never something it fixes in-repo. It complements, and should be cross-referenced from, ai-referral-measurement's verifiable-setup-vs-advisory-outcome split (this report is Google's own first-party version of that advisory signal, specifically for AI Overviews/AI Mode/Discover rather than third-party AI assistants like ChatGPT/Perplexity/Copilot).

## Related links
- [gsc-verify-reports](gsc-verify-reports.md)
- [../answer-engines/ai-referral-measurement.md](../answer-engines/ai-referral-measurement.md)
- [../answer-engines/platform-behavior.md](../answer-engines/platform-behavior.md)

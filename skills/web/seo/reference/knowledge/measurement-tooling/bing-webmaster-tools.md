---
updated: 2026-07-09
source: https://www.bing.com/webmasters/help/URL-Inspection-55a30305 ; https://blogs.bing.com/webmaster/June-2025/Start-Using-Bing-Webmaster-Tools-to-Improve-Your-Site-Visibility ; https://blogs.bing.com/webmaster/February-2026/Introducing-AI-Performance-in-Bing-Webmaster-Tools-Public-Preview ; https://blogs.bing.com/search/June-2026/New-AI-Visibility-Insights-in-Bing-Webmaster-Tools-Intents-Topics-Citation-Share-Compare (accessed 2026-07-09)
type: reference
tags: [measurement-tooling, bing, indexnow, verification, geo]
confidence: low
---

# Bing Webmaster Tools — the non-Google verifier surface

Bing Webmaster Tools is the second verified-property source: URL Inspection for Bing index/crawl/markup status, Site Scan for a full-site audit, IndexNow for instant push submission, plus a 2026 public-preview AI Performance report for Copilot/AI-summary citation counts — all advisory evidence, not in-repo verifiable.

## Facts
- **URL Inspection** (formerly Fetch as Bingbot) reports a URL's index status, crawlability, HTTP response, blocked resources, and markup errors, with a request-indexing option. [Bing-help]
- **Site Scan** runs a full-site audit ("Start new scan") listing detected SEO issues site-wide. [Bing docs]
- **IndexNow** lets a site instantly notify Bing (and participating engines) of add/update/delete; Bing validates and queues the URL, typically crawled within ~24h. It is a submission protocol, not a verifier — presence of an IndexNow key/endpoint is repo-verifiable, crawl outcome is not.
- **AI Performance report (public preview, launched 9 Feb 2026; expanded June 2026):** shows citations across Microsoft Copilot, Bing AI-generated summaries, and select partner integrations. Core metrics: Total Citations, Average Cited Pages (unique URLs/day), Grounding Queries (sampled query phrases, not exhaustive), Page-level Citation Activity, and Visibility Trends over time. The June-2026 expansion added Intents, Topics, Citation Share, and Compare views. It measures citation frequency, not ranking/prominence within a response, and can't isolate Copilot citations from Bing AI-summary citations. Still preview-stage and rot-prone — re-verify each research run; cross-link ai-referral-measurement for the verifiable-setup-vs-advisory-outcome rule.

## Related
- [ai-referral-measurement](../answer-engines/ai-referral-measurement.md)
- [gsc-verify-reports](../measurement-tooling/gsc-verify-reports.md)
- [platform-behavior](../answer-engines/platform-behavior.md)

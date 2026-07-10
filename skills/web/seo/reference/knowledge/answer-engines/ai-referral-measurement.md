---
updated: 2026-07-09
source: https://organikpi.com/blog/technical-seo/ga4-ai-search-referral-attribution/ ; https://searchengineland.com/chatgpt-ai-referral-traffic-sessions-data-481630 ; https://www.semrush.com/blog/ga4-adds-ai-assistant-channel/ ; https://support.google.com/analytics ; re-verify each research run
type: fact
tags: [answer-engines, measurement, analytics, geo]
---

# Measuring AI referrals — setup is verifiable, outcomes are not

Whether a site gets cited, its share-of-voice, and AI-referral traffic are non-deterministic, engine-
specific, drift weekly, and are structurally lossy to attribute. The audit can verify the *setup*
(a channel group / referrer regex is present) but never the *outcome* — keep referral/citation results
advisory and out of the pass/fail verdict. Never claim the audit increased citations or traffic.

## Facts
- **GA4 native "AI Assistant" channel** officially shipped 2026-05-13; as of Jun 2026 its default channel
  group recognizes FIVE sources — ChatGPT, Gemini, Deepseek, Copilot, Grok — and NOTABLY excludes
  Perplexity (still bucketed as Referral). It isn't retroactive and counts AI-Overview clicks as ordinary
  Google organic; **in-app ChatGPT sends no referrer** (dark traffic). [SearchEngineLand] [Semrush]
- **Dark traffic (widened estimate):** Statcounter (Mar 2026) puts ~35-70% of AI-referral sessions
  arriving with NO referrer — in-app browsers strip referrers, copy-paste and native apps send none — so
  they bucket as Direct. AI-Overview clicks remain counted as ordinary Google organic (a routing
  decision, unfixable in GA4). [Statcounter]
- **Reliable method:** a custom channel group with a referrer regex over the AI host list —
  `chatgpt.com`, `claude.ai`, `perplexity.ai`, `gemini.google.com`, `copilot.microsoft.com`,
  `deepseek.com`, `grok.com`, plus other AI hosts. The audit verifies the config CONTAINS the channel
  group/regex (setup); traffic OUTCOMES are not repo-verifiable. [organikpi]
- **Verifiable in-repo (feeds the verdict):** JSON-LD parses + required props; schema matches visible
  content; title/description/canonical in the served HTML; robots permits the intended bots; primary
  content in the raw HTML; sitemap well-formed. **Advisory (excluded from verdict):** citation frequency,
  share-of-voice, AI-referral traffic.
- **Core Web Vitals is correlational for AEO, not a confirmed citation factor** — the real mechanism is
  that AI crawlers run on ~1-5s timeouts, so slow raw HTML risks being skipped. Report perf with the
  crawler-timeout rationale, never as a causal citation lever. (Thresholds live in `foundations/thresholds.md`.)
- **Conversion context (confidence: low, advisory):** AI-sourced sessions reportedly convert at ~4.4x the
  Google-organic rate (Adobe) — motivates attribution setup but is an OUTCOME; keep advisory and never
  claim the audit produced it. [Adobe]

## Related
- [platform-behavior](platform-behavior.md)
- [foundations/thresholds](../foundations/thresholds.md)
- measurement-tooling

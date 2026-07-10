---
updated: 2026-07-09
source: https://developers.google.com/search/blog/2009/12/handling-legitimate-cross-domain (accessed 2026-07-09) ; https://developers.google.com/search/docs/crawling-indexing/canonicalization-troubleshooting [google-canon-troubleshoot] (accessed 2026-07-09)
type: fact
tags: [canonicalization, cross-domain, syndication, news]
---

# Cross-domain canonical — supported, but discouraged for syndication

Google technically honors a `rel="canonical"` pointing to another domain, but as of its 2022–2023 guidance it no longer recommends cross-domain canonicals for syndicated content, advising the syndication partner to `noindex` instead.

## Facts
- Cross-domain `rel="canonical"` has been supported since Dec 2009 for legitimate cross-site duplication (e.g. you republish your own content on another domain and want the original credited). [google-crossdomain-2009]
- Shift: around May 2022 Google removed cross-domain-canonical guidance from its canonicalization docs and (clarified May 2023) now recommends AGAINST cross-domain canonical for syndicated content — syndicated copies are "often very different," so the partner should block indexing (`noindex`) rather than canonicalize to you. [google-consolidate]
- News/syndication (primary-sourced): Google's canonicalization-troubleshooting doc (updated 2025-12-18) has a dedicated "Syndicated content" section stating directly: "The canonical link element is not recommended for those who want to avoid duplication by syndication partners, because the pages are often very different... The most effective solution is for partners to block indexing of your content." It points to the "Avoid article duplication in Google News" guide for more detail. [google-canon-troubleshoot]

## Related
- [canonical-vs-301-vs-noindex](../canonicalization/canonical-vs-301-vs-noindex.md)
- [common-canonical-mistakes](../canonicalization/common-canonical-mistakes.md)

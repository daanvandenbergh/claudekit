---
updated: 2026-07-09
source: https://developers.google.com/search/docs/crawling-indexing/url-structure (accessed 2026-07-09)
type: fact
tags: [urls-redirects, on-page, url-structure]
---

# URL design for SEO — readable, stable, lowercase, hyphenated

Google wants simple human-readable URLs: hyphens (not underscores) between words, one consistent case, descriptive words over ID numbers, and no session IDs.

## Facts
- Use hyphens (`-`), not underscores (`_`), to separate words in URLs — helps users and search engines identify concepts/word boundaries. [url-structure]
- URLs are case-sensitive: Google treats `/APPLE` and `/apple` as distinct URLs with their own content — pick one case (conventionally lowercase) and apply it consistently. [url-structure]
- Use readable descriptive words, not long ID numbers: prefer `example.com/wiki/Aviation` over `example.com/index.php?topic=42&area=3a5ebc944f41daa6f849f730f1`. [url-structure]
- Avoid session IDs in URLs; use cookies instead — session IDs (e.g. `sessionid=6EE2BF1AF6A3...`) spawn many URL variants pointing to identical content. [url-structure]
- Encode per IETF STD 66 (RFC 3986): percent-encode reserved and non-ASCII characters; UTF-8 for non-ASCII. Keep the overall structure simple and logically organized for humans. [url-structure]
- Changing live URLs is a de-index risk (needs 301s + updated internal links/sitemap); URL-design fixes are safest applied to new URLs only, not retrofitted to established ones.

## Related
- [thresholds](../foundations/thresholds.md)
- [canonical-host-consolidation](../urls-redirects/canonical-host-consolidation.md)

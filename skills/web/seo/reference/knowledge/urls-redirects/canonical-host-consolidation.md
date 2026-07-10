---
updated: 2026-07-09
source: https://developers.google.com/search/blog/2010/04/to-slash-or-not-to-slash (accessed 2026-07-09)
type: procedure
tags: [urls-redirects, indexation, canonicalization, duplicate-content]
---

# Single canonical host, scheme, and trailing-slash consolidation

Every host/scheme/trailing-slash variant is a distinct URL to Google, so choose one canonical form (www vs non-www, https, one slash policy) that returns 200 and 301-redirect all other variants to it.

## Steps
1. Google treats each URL separately and equally: `example.com/foo` and `example.com/foo/` (and www vs non-www, http vs https) are distinct URLs and may legitimately hold different content. [to-slash-or-not-to-slash]
2. If duplicate variants each return 200 with the same content, consolidate: pick one preferred version, use it in internal links and the sitemap (exclude the duplicate), and 301-redirect the duplicate to it (or use rel=canonical → see canonicalization). [to-slash-or-not-to-slash]
3. Trailing-slash policy must be consistent site-wide; the choice itself is neutral for ranking, but inconsistency creates duplicate-content/crawl waste. [to-slash-or-not-to-slash]
4. Exception: the root URL `https://example.com` equals `https://example.com/` and cannot be redirected to/from a slash variant. [to-slash-or-not-to-slash]
5. Practical probe: request each variant (http/https, www/non-www, with/without slash) and confirm exactly one returns 200 and the rest 301 to it. rel=canonical tag itself is deferred to the canonicalization domain.

## Related
- [https-signal](../urls-redirects/https-signal.md)
- [thresholds](../foundations/thresholds.md)
- [status-code-seo-meaning](../urls-redirects/status-code-seo-meaning.md)

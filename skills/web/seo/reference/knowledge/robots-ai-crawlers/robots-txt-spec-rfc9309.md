---
updated: 2026-07-09
source: https://www.rfc-editor.org/rfc/rfc9309.html (accessed 2026-07-09)
type: reference
tags: [robots-ai-crawlers, robots-txt, rfc9309, crawlability, spec]
---

# robots.txt spec (RFC 9309 + Google interpretation) — how a rule actually resolves

robots.txt is a per-user-agent grouped rule file where the single longest path-match wins (Allow breaks ties), it uses only * and $ wildcards, caps at 500 KiB, and controls CRAWLING not INDEXING — a disallowed URL can still be indexed URL-only without a snippet.

## Facts
- robots.txt lives at the host root (`/robots.txt`), is per origin (scheme+host+port), and is standardized by RFC 9309 (the Robots Exclusion Protocol, published 2022; the de-facto rules Google/Bing already followed). [RFC9309]
- The file is a list of GROUPS. Each group is one or more `User-agent:` lines followed by `Allow:` / `Disallow:` rules. A crawler obeys exactly ONE group — the one whose user-agent token is the MOST SPECIFIC match for its own name; it does not merge multiple groups. [RFC9309][GoogleSpec]
- User-agent matching: field name is case-INSENSITIVE, the token is matched case-insensitively as a substring/prefix, version numbers are ignored (`googlebot/1.2` and `googlebot*` both reduce to `googlebot`), and `User-agent: *` is the fallback group used only when no named group matches. [GoogleSpec]
- PRECEDENCE (the fact people get wrong): order in the file does NOT matter. For a given URL, the rule with the longest matching path (most path octets) wins. On an exact-length tie between an Allow and a Disallow, the LEAST restrictive rule wins — i.e. Allow beats Disallow. [RFC9309][GoogleSpec]
- Only two wildcards exist: `*` = 0-or-more of any character, `$` = end of URL. There is no regex. Path values are case-SENSITIVE (unlike field names) and must start with `/`. [GoogleSpec]
- Size limit: Google enforces 500 kibibytes (512,000 bytes); bytes past that are ignored. RFC 9309 tells crawlers to parse "at least 500 kibibytes." [GoogleSpec][RFC9309]
- CRAWLING vs INDEXING (load-bearing): robots.txt only stops FETCHING. A `Disallow`-ed URL can still be INDEXED (URL shown in results without a snippet) if linked elsewhere. To keep a page OUT of the index you need `noindex` (meta robots / `X-Robots-Tag`) on a page that is NOT disallowed — because a blocked page's `noindex` is never seen. `Disallow` and `noindex` are not interchangeable. [GoogleSpec]
- Unsupported/obsolete lines: `Crawl-delay` is not part of RFC 9309 and is ignored by Google (Bing/Yandex historically honored it); `Sitemap:` is host-level (not tied to any group) and the only robots.txt line with zero de-index risk to add. [GoogleSpec][RFC9309]
- A 5xx or unreachable robots.txt makes compliant crawlers treat the whole site as disallowed (fail-closed); a 404/empty file means everything is allowed. [GoogleSpec]

## Related
- [ai-crawlers](../answer-engines/ai-crawlers.md)
- [ai-crawler-ua-catalog-2026](../robots-ai-crawlers/ai-crawler-ua-catalog-2026.md)
- crawlability
- indexation

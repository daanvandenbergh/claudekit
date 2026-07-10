---
updated: 2026-07-09
source: https://developers.google.com/search/docs/crawling-indexing/301-redirects (accessed 2026-07-09)
type: fact
tags: [metadata, meta-refresh, redirects]
---

# Meta refresh redirects — avoid, use a server-side 301

Google reads meta refresh (instant = permanent, timed = temporary) but ranks server-side redirects highest, so a permanent move should use a 301, not a meta refresh.

## Facts
- Google interprets an instant `<meta http-equiv="refresh" content="0; url=...">` as a permanent redirect (like 301/308) and a delayed one (content="N; ...", N>0) as a temporary redirect (like 302/307). [G-redirects]
- Google's stated preference order by interpretation fidelity: server-side redirect (highest) > meta refresh > JavaScript redirect (last resort); use a permanent server-side redirect whenever possible for permanent moves. [G-redirects]
- Timed meta refresh is also poor UX/accessibility (content changes under the user without action), reinforcing "prefer a 301." [G-redirects]

## Related
- redirects-status
- [robots-meta-directives](../metadata/robots-meta-directives.md)

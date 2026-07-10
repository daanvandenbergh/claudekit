---
updated: 2026-07-09
source: https://developers.google.com/search/docs/crawling-indexing/googlebot ; https://developers.google.com/search/docs/crawling-indexing/verifying-googlebot (accessed 2026-07-09)
type: fact
tags: [crawlability, googlebot, fetch-limit, http2, verification]
confidence: low
---

# Googlebot fetch behavior — byte cap, HTTP/2, and verification (Google, 2026)

Googlebot fetches only the first slice of a file (currently documented as 2 MB HTML/text, 64 MB PDF), may crawl over HTTP/2, and impostors are verified by reverse DNS plus Google's published IP ranges.

## Facts
- **Fetch cap (ROT-PRONE, recently changed)**: Google's 2026 Googlebot doc states it crawls the first **2 MB of a supported (HTML/text) file** and the first **64 MB of a PDF**, measured on **uncompressed** data — down from the long-standing **15 MB** HTML figure. Content past the cap is ignored for indexing, so put critical markup/content and structured data high in the HTML. [google-googlebot]
- Referenced sub-resources (CSS, JS, images, video) are **fetched separately** and do NOT count against the HTML byte cap. [google-googlebot]
- Googlebot may crawl over **HTTP/2** for eligible sites (h2-capable + net resource savings); it carries **no ranking or crawl-frequency benefit**, and a site can opt out by returning **421** to h2 requests. [google-http2]
- Default politeness: for most sites Googlebot fetches no more than about **once every few seconds** on average; crawl rate auto-adjusts to server health. [google-googlebot]
- Googlebot generally crawls from **US IPs** (timezone Pacific) but can be geo-distributed. [google-googlebot]
- **Verify a claimed Googlebot** (UA strings are spoofable) by **reverse-DNS** on the source IP resolving to `googlebot.com`/`google.com` (then forward-confirm), or by matching Google's **published IP-range JSON** — never trust the user-agent alone before blocking. [google-verify]

## Related
- [crawl-budget-and-server-health](../crawlability/crawl-budget-and-server-health.md)
- js-rendering
- robots-ai-crawlers

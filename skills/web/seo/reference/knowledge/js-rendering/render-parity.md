---
updated: 2026-07-09
source: https://support.google.com/webmasters/answer/9012289 (accessed 2026-07-09)
type: procedure
tags: [js-rendering, parity, rendered-dom, indexation, audit]
---

# Render parity — raw HTML vs rendered DOM, and how to check it

The audit question is whether title/H1/canonical/robots/hreflang/primary-content/internal-links survive into the HTML Googlebot renders; anything missing there is missing from the index.

## Steps
1. Render parity = the post-JS HTML Googlebot renders contains the same indexable content, links, meta, and structured data as (ideally) the raw server HTML. A gap means crawl signals are lost.
2. Two distinct artifacts to compare: (1) raw HTML = server response = browser "View Source" (Ctrl+U); (2) rendered DOM = state after JS executes. Google indexes the rendered DOM, but the pre-JS raw HTML is what determines first-wave link discovery and what non-rendering crawlers see. [gsc-basics]
3. Diagnostic of record: GSC URL Inspection → "Test Live URL" → "View Tested Page" → HTML tab shows the rendered HTML Googlebot produced. Search that rendered HTML for the H1, primary copy, canonical link, robots meta, hreflang, and JSON-LD `<script>`; anything absent is not indexed. [gsc-inspect]
4. Audit lens: a fix (meta, content, link) that appears only in the browser's live/inspected DOM but NOT in the rendered-HTML test is a FALSE PASS. Validate every rendering-sensitive fix against rendered/built HTML, not `document.querySelector` in devtools.
5. Parity failure modes to grep for: content/links injected only on user interaction, lazy-loaded content behind events, internal links rendered client-side (SPA routers) with no `<a href>` in raw HTML, canonical/meta set via JS.

## Related
- [rendering-pipeline](../js-rendering/rendering-pipeline.md)
- [framework-rendering-modes](../js-rendering/framework-rendering-modes.md)
- [extractability](../answer-engines/extractability.md)

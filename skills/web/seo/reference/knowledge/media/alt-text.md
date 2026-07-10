---
updated: 2026-07-09
source: https://developers.google.com/search/docs/appearance/google-images (accessed 2026-07-09)
type: procedure
tags: [media, images, accessibility, alt-text, on-page]
confidence: low
---

# Image alt text — descriptive for content, empty for decoration

Every contentful `<img>` needs descriptive `alt` (Google's top image-context signal and an accessibility requirement); purely decorative images take `alt=""` so screen readers and the image index skip them.

## Steps
1. Alt text is the primary attribute Google uses to understand an image's subject AND the accessibility fallback for users who can't see it — the two purposes coincide, so one good `alt` serves both. [google-images]
2. Google's guidance: "focus on creating useful, information-rich content that uses keywords appropriately and is in context"; avoid keyword-stuffing alt. Google's doc shows FOUR tiers, not two: Bad — missing alt entirely (`<img src="puppy.jpg">`) or keyword-stuffed; "Better" (acceptable, not optimal) — a short generic term like `alt="puppy"`; Best — specific + descriptive like `alt="Dalmatian puppy playing fetch"`. A bare generic alt is an improvable middle tier, NOT an outright defect like missing/stuffed. [google-images]
3. Purely decorative images (spacers, background flourishes, icons duplicating adjacent text) MUST use `alt=""` (present but empty) — a screen reader then skips them; a missing `alt` attribute is NOT the same and is a defect. [google-images]
4. Practical alt heuristic seen across 2026 guides: describe only what is clearly visible, ~50–125 chars, no "image of/picture of" prefix (redundant — the AT already announces it's an image). [confidence: low — aggregated 2026 blog consensus, not a Google numeric spec]
5. Never overwrite an existing meaningful `alt`; if the subject can't be grounded from the visible image, flag for a human rather than guess.

## Related
- [image-sitemap](../media/image-sitemap.md)
- [image-perf](../media/image-perf.md)

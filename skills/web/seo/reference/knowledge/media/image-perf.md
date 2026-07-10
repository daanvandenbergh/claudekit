---
updated: 2026-07-09
source: https://developers.google.com/search/docs/appearance/google-images (accessed 2026-07-09); https://www.sitepoint.com/image-optimization-for-core-web-vitals-in-2026-what-actually-moves-the-needle/ (accessed 2026-07-09)
type: procedure
tags: [media, images, performance, cls, formats, responsive, lazy-loading]
confidence: low
---

# Image performance — formats, dimensions, lazy-loading, responsive

Serve AVIF/WebP over JPEG/PNG, set explicit `width`/`height` (or CSS `aspect-ratio`) to reserve space, `loading="lazy"` only below the fold (never the LCP image), and `srcset`/`sizes` so each viewport downloads a right-sized file.

## Steps
1. Google Search supports these image formats in `<img src>`: BMP, GIF, JPEG, PNG, WebP, SVG, and AVIF (plus data URIs). So next-gen AVIF/WebP are fully indexable — no SEO penalty for dropping JPEG/PNG. [google-images]
2. WebP ~25–35% smaller than JPEG at equal quality (universal browser support, fast encode → the safe single-format default); AVIF adds ~another 20–25% on top of WebP for photos but encodes ~10–20x slower. Use `<picture>` with AVIF→WebP→JPEG fallback sources. [confidence: low — web.dev-adjacent 2026 consensus, percentages are approximate/rot-prone]
3. Give every `<img>` explicit `width` and `height` attributes (or reserve the box with CSS `aspect-ratio`): the browser reserves layout space before the image loads, preventing the layout shift that drives CLS. Read the real file to get true intrinsic dimensions. [sitepoint-2026] (CLS threshold → core-web-vitals)
4. `loading="lazy"` on below-the-fold images defers their fetch; but NEVER lazy-load the LCP / above-the-fold hero — lazy-loading the LCP image measurably delays it (reported p75 shift ~364ms→~720ms in one 2026 analysis). Eager (default) above the fold, lazy below. [confidence: low — single aggregated source] (LCP image → core-web-vitals)
5. `srcset` (candidate widths) + `sizes` (layout hint) let the browser pick a right-sized variant per device, cutting ~70–90% of image bytes on phones vs shipping desktop-sized images. Generate variants in the build step / image CDN, not by hand. Always keep a plain `src` fallback for crawlers/browsers that ignore `srcset`. [google-images; sitepoint-2026]

## Related
- [alt-text](../media/alt-text.md)
- [image-sitemap](../media/image-sitemap.md)

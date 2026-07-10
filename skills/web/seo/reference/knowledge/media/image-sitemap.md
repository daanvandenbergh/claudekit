---
updated: 2026-07-09
source: https://developers.google.com/search/docs/appearance/google-images (accessed 2026-07-09)
type: reference
tags: [media, images, sitemap, discovery, filenames, indexation]
---

# Image discovery — sitemaps, filenames, surrounding text

Help Google find and interpret images via image sitemaps (which may point at CDN/other-domain URLs), short descriptive hyphen-separated filenames, and relevant surrounding page text.

## Facts
- Submit an image sitemap to surface images Google might not otherwise discover. Unlike page sitemaps, `<image:loc>` MAY contain URLs on OTHER domains — this is how you list CDN-hosted images; verify CDN ownership in Search Console. [google-images]
- Filenames should be "short, but descriptive": `my-new-black-kitten.jpg` beats `IMG00023.JPG`. Separate words with hyphens `-` (not underscores/spaces) — Google treats hyphens as word separators. [google-images]
- Google derives an image's subject from the page it sits on: nearby text, captions, and the image title. Place images next to topically relevant copy on a topically aligned page; use HTML `<img>`, not CSS `background-image`, for content images (CSS images aren't indexed for Google Images). [google-images]
- Nominate a page's preferred/representative image via schema.org `primaryImageOfPage` (or a `mainEntity` ImageObject) or the `og:image` meta tag; pick a relevant high-res image, avoid logos and extreme aspect ratios. (ImageObject/structured-data recipe → structured-data)

## Related
- [alt-text](../media/alt-text.md)
- [image-perf](../media/image-perf.md)

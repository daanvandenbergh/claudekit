---
updated: 2026-07-09
source: https://developers.google.com/search/docs/appearance/video (accessed 2026-07-09)
type: fact
tags: [media, video, indexation, thumbnails, key-moments]
confidence: low
---

# Video SEO basics — indexability, thumbnails, key moments

For a video to be eligible in Search it must live on an indexable watch page whose streaming file Google can fetch, carry a valid stable thumbnail, and ideally expose key moments; VideoObject is the structured-data hook.

## Facts
- The watch page must be indexed (not robots.txt/`noindex`-blocked, not paywalled without paywall markup), and Google must be allowed to fetch the video's streaming file URL — both the page host and the streaming server need enough crawl capacity. A well-performing watch page is a prerequisite for the video being indexed. [google-video]
- Thumbnail requirements: minimum 60x30 px (larger preferred); allowed formats BMP/GIF/JPEG/PNG/WebP/SVG/AVIF; at least 80% of pixels must have an alpha value > 250; served from a stable, Googlebot-accessible URL. [google-video]
- Provide distinct `thumbnailUrl`, `name`, and `description` per video via VideoObject markup — this is the structured-data hook that governs video rich-result appearance. (Full VideoObject recipe → structured-data)
- Key moments: mark segment timestamps explicitly with `Clip` structured data, or let Google auto-detect them via `SeekToAction` (supported languages only). [google-video]
- Video sitemaps let you submit videos in bulk with `<video:content_loc>` / `<video:player_loc>` / `<video:thumbnail_loc>` (and region `<video:restriction>`). Google's video docs do NOT mandate transcripts/captions; treat a transcript as an indexable-text and accessibility signal (gives crawlers/answer-engines quotable copy), not a hard Search requirement. [google-video; confidence: low — transcript-as-signal is inference, not a stated Google rule]

## Related
- [image-sitemap](../media/image-sitemap.md)

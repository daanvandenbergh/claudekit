---
updated: 2026-07-09
source: https://developer.mozilla.org/en-US/docs/Web/HTML/Viewport_meta_tag (accessed 2026-07-09)
type: fact
tags: [metadata, charset, viewport, lang, dir, mobile-first, accessibility]
---

# Charset, viewport, and html lang/dir correctness

Four boilerplate declarations — `<meta charset="utf-8">`, a responsive viewport that still allows zoom, `<html lang>`, and `dir` — must be present and correct on every template.

## Facts
- `<meta charset="utf-8">`: utf-8 is the only conformant document encoding; the element must be serialized entirely within the first 1024 bytes of the document, so it must be the first child of `<head>`. [WHATWG]
- Responsive baseline viewport is exactly `<meta name="viewport" content="width=device-width, initial-scale=1">`; its absence breaks mobile rendering and harms mobile-first indexing. [MDN-viewport]
- Accessibility: do not disable zoom via `user-scalable=no` or a low `maximum-scale` — WCAG 1.4.4 requires at least 2x zoom (5x is best practice), so a viewport that blocks zoom is an accessibility defect, not just an SEO one. [MDN-viewport][WCAG144]
- `<html lang="...">` takes a single BCP 47 language tag (e.g. `en`, `en-US`); it drives screen-reader pronunciation and language targeting and belongs on the root `<html>` element. [MDN-lang]
- `dir` on `<html>` sets base text direction — `ltr` (default for LTR scripts), `rtl` (Arabic/Hebrew), or `auto`; set `rtl` for RTL languages so layout and punctuation render correctly. [MDN-dir]
- These are one-time per-template declarations; multi-locale `lang` matching and `hreflang` clustering are the i18n domain's concern.

## Related
- mobile-first
- lang-attribute
- hreflang

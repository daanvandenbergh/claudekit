---
updated: 2026-07-09
source: framework docs (Next/Astro/Hugo/etc.); observed conventions; re-verify each research run
type: procedure
tags: [phase-0, stack-detection, head-mechanism]
---

# Stack signals — detect the generator and resolve the SEO surface (Phase 0.2)

SEO signals are *emitted*, not written as literal tags — so grepping source for `<title>` finds
nothing on a framework site and false-flags a correct one. Detect the generator, then resolve four
slots: **head mechanism** (where head tags are injected), **config surfaces** (robots/sitemap/
redirects/canonical-base-URL), **content corpus** (where per-page title/description live), and the
**build output dir** (excluded as an edit target). Assess against rendered output; write fixes to
**source**.

## Detection → head mechanism → config → output

| Signal | Generator | Head mechanism (edit here) | Config surfaces | Output dir (exclude) |
|---|---|---|---|---|
| `package.json` has `next` | Next.js | Metadata API (`app/**/page.tsx` `metadata`/`generateMetadata`) or `next/head` | `next.config.*` (redirects/headers), `app/robots.*`, `app/sitemap.*`, `metadataBase` | `.next`, `out` |
| `astro.config.*` | Astro | base layout `<head>`; `@astrojs/sitemap`; `<meta>` in layout | `astro.config` `site`, `public/robots.txt`, sitemap integration | `dist` |
| `hugo.toml`/`config.toml`+`archetypes/` | Hugo | `layouts/partials/head.html`, `layouts/_default/baseof.html` | `config` `baseURL`, `static/robots.txt`, sitemap template | `public` |
| `.eleventy.js`/`eleventy.config.*` | Eleventy | `_includes` layout `<head>` | plugin/config, `robots.txt` passthrough | `_site` |
| `gatsby-config.*` | Gatsby | `gatsby-plugin-react-helmet` / `Head` API | `gatsby-config` siteMetadata, sitemap/robots plugins | `public` |
| `nuxt.config.*` | Nuxt | `useHead`/`app.head` | `nuxt.config` `site`, `@nuxtjs/sitemap`/`robots` | `.output`, `dist` |
| `svelte.config.*` + `@sveltejs/kit` | SvelteKit | `<svelte:head>` in layouts/pages | `svelte.config`, `src/routes/robots.txt`, `sitemap.xml` route | `build`, `.svelte-kit` |
| `package.json` has `react-router` (v7+) or `@remix-run/*` | Remix / React Router v7 | per-route `meta` export (`app/routes/*.tsx` — a function returning an array of meta descriptors; a descriptor with `tagName: "link"` renders `<link>` tags, e.g. canonical) | resource routes for robots/sitemap, e.g. `app/routes/robots[.]txt.ts` and `app/routes/sitemap[.]xml.ts` (loaders that return the file — no built-in generator, unlike Astro/Next), `react-router.config.ts` | `build` |
| `_config.yml` + `Gemfile` | Jekyll | `_layouts/default.html` `<head>`; `jekyll-seo-tag` | `_config.yml` `url`, `robots.txt`, `jekyll-sitemap` | `_site` |
| `wp-config.php`, `wp-content/themes/` | WordPress | `header.php` `wp_head()`; Yoast/RankMath/AIOSEO settings | plugin settings, `.htaccess`, plugin-generated sitemap | (server-rendered; no static dir) |
| `Gemfile` + `app/views/` | Rails | `app/views/layouts/application.html.erb` `<head>`, `content_for(:title)` | `config/routes.rb` redirects, `public/robots.txt`, sitemap gem | (server-rendered) |
| bare `*.html`, no package manifest | Static HTML | the `<head>` of each file / a shared include | `robots.txt`, `sitemap.xml` in root | (source is output) |

## Procedure
1. Match the strongest signal above; if several or none match, **ask** — never assume a default.
2. Record the head mechanism, config surfaces, content corpus, and output dir for the run.
3. If the head/canonical/robots is produced by an SEO plugin (Yoast/RankMath/`jekyll-seo-tag`/
   `@astrojs/sitemap`), fixes go through the **plugin's config**, not by hand-adding tags it emits —
   and don't flag as "missing" what the plugin renders (check the rendered output first).
4. Exclude the output dir from all edits; fixes land in source templates/config/content.

## Related
- [thresholds](thresholds.md)

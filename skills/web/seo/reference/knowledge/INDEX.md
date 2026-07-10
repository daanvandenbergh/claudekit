# seo knowledge store
> The `/seo` skill's research corpus: dated SEO facts, thresholds, schema recipes, and stack-detection
> signals that `reference/checklist.md` cites for depth. A `/memory-store`-managed Markdown store.
> Read by the **audit** (on demand, for a check's evidence/provenance); written and consolidated only
> by the **research-dev-only** / **optimize-research-dev-only** modes.

## How to use
Read this index → map your query to a domain → grep the domain folder + likely synonyms → read the
top hits → check each entry's `Verified:`/`updated` date before trusting a fast-moving fact. The
checklist's inline probe/recipe is enough to *run* a check; come here for the threshold's source, a
full schema recipe, or an edge case.

## Status: POPULATED — research pass 2026-07-09
The full per-domain corpus is now generated (`/seo research-dev-only`, 2026-07-09): 99 atomic entries
across the 22 domains below, each primary-sourced (Google Search Central / web.dev / schema.org / RFC /
official platform docs) with an access date; fast-moving facts carry `confidence: low`. A second
2026-07-09 refresh pass re-verified every entry in place and added the `agentic-commerce/` domain. Sections are ordered
by audit impact (indexation-integrity first). `reference/checklist.md` cites these entries by
`Depth:` pointer; re-verify any fast-mover against its `source` before trusting it.

## foundations
- [2026-seo-myths](foundations/2026-seo-myths.md) — the checks the audit must NOT flag (llms.txt,
  FAQ/HowTo rich results now fully removed, word count, keyword density, exact char counts, hand-added
  JSON-LD as a GEO lever) · fact · updated: 2026-07-09
- [thresholds](foundations/thresholds.md) — the dated numeric bands the checklist restates (Core Web
  Vitals, TTFB, sitemap 50k/50MB, redirect hops, crawl depth, pixel-width title/meta guidance) with
  sources · fact · updated: 2026-07-09
- [stack-signals](foundations/stack-signals.md) — generator → head-mechanism → config-surfaces →
  output-dir detection table for Phase 0 · procedure · updated: 2026-07-09

## indexability
- [noindex-two-mechanisms](indexability/noindex-two-mechanisms.md) — noindex is delivered by `<meta name="robots">` OR the `X-Robots-Tag` HTTP header — audit BOTH on every page. · fact · updated: 2026-07-09
- [noindex-requires-crawlable](indexability/noindex-requires-crawlable.md) — A `Disallow`ed page's `noindex` is never seen — robots.txt block + noindex is self-defeating and can leave the URL indexed. · fact · updated: 2026-07-09
- [index-coverage-states](indexability/index-coverage-states.md) — GSC Page-indexing states — Discovered-not-indexed = not yet crawled (budget); Crawled-not-indexed = crawled but judged too low-value; Soft-404 = 200 with "not found" content. · reference · updated: 2026-07-09
- [serving-directives-catalog](indexability/serving-directives-catalog.md) — robots-directive catalog — none=noindex+nofollow; nosnippet; max-snippet:[n] (0=nosnippet, -1=uncapped); max-image-preview:[none|standard|large]; unavailable_after; indexifembedded; noarchive is DEPRECATED by Google. · reference · updated: 2026-07-09
- [index-bloat-pruning](indexability/index-bloat-pruning.md) — Prune index bloat — thin/duplicate/auto-generated & faceted URLs judged "crawled-not-indexed" dilute crawl; consolidate or `noindex`, don't mass-noindex blindly. · procedure · updated: 2026-07-09

## canonicalization
- [canonical-is-a-hint](canonicalization/canonical-is-a-hint.md) — rel=canonical is a strong hint, not a directive — Google clusters duplicates and may pick a different canonical than you declared · fact · updated: 2026-07-09
- [canonical-vs-301-vs-noindex](canonicalization/canonical-vs-301-vs-noindex.md) — decision matrix — 301 to remove a dup, rel=canonical to keep both live, noindex to drop from index (never for consolidation) · procedure · updated: 2026-07-09
- [canonical-placement-and-format](canonicalization/canonical-placement-and-format.md) — canonical must be one absolute URL in <head> only (body ignored); use HTTP Link header for non-HTML like PDFs · procedure · updated: 2026-07-09
- [cross-domain-canonical](canonicalization/cross-domain-canonical.md) — cross-domain canonical is technically supported but Google (since 2022) no longer recommends it for syndicated content — use noindex on the partner · fact · updated: 2026-07-09
- [common-canonical-mistakes](canonicalization/common-canonical-mistakes.md) — canonical-to-a-redirect/404/noindex/non-preferred-host, paginated-to-page-1, multiple canonicals, thin overlap — the failure catalogue an audit flags · reference · updated: 2026-07-09
- [canonical-hijacking-and-copycat-content](canonicalization/canonical-hijacking-and-copycat-content.md) — attacker-injected 3xx/cross-domain canonical, CMS/plugin mis-canonicalization, misconfigured cross-domain servers, and copycat/scraper sites (DMCA, not a canonical fix) · fact · updated: 2026-07-09

## urls-redirects
- [url-design](urls-redirects/url-design.md) — Readable stable URLs — lowercase (URLs are case-sensitive), hyphens not underscores, descriptive words, no session IDs. · fact · updated: 2026-07-09
- [status-code-seo-meaning](urls-redirects/status-code-seo-meaning.md) — How Googlebot reads each HTTP status for SEO — 200 index-eligible, 301 strong vs 302 weak, 304 reuse cache, 404/410 drop, 5xx/429 slow then drop. · fact · updated: 2026-07-09
- [canonical-host-consolidation](urls-redirects/canonical-host-consolidation.md) — One canonical host+scheme+slash-policy — pick www-or-not, http→https, trailing-slash-or-not; 301 all variants to the single 200 origin. · procedure · updated: 2026-07-09
- [https-signal](urls-redirects/https-signal.md) — HTTPS is a lightweight ranking signal and part of page experience; HTTPS is preferred as canonical over an HTTP duplicate. · fact · updated: 2026-07-09

## crawlability
- [robots-txt-semantics](crawlability/robots-txt-semantics.md) — robots.txt rule matching — longest-path/least-restrictive resolution, `*`/`$` wildcards, case-sensitive paths, single most-specific UA group, root-only, 500 KiB cap, 24h cache, and Disallow ≠ de-index · fact · updated: 2026-07-09
- [crawl-budget-and-server-health](crawlability/crawl-budget-and-server-health.md) — crawl budget = capacity limit (driven by server speed/5xx/429) × demand; who must care (~1M+ pages weekly, ~10k+ daily, or lots of "Discovered–not indexed"); 4xx drops, 5xx/429 throttle · fact · updated: 2026-07-09
- [crawl-traps](crawlability/crawl-traps.md) — faceted nav / URL params / calendars generate near-infinite URL spaces; block with robots.txt parameter Disallow or `#`-fragments (NOT noindex, since disallowed pages are never crawled) · procedure · updated: 2026-07-09
- [orphan-discoverability](crawlability/orphan-discoverability.md) — Google's primary discovery is following links; orphan pages (no internal links) rely on sitemaps/external links and may never be found; keep key pages ≤3 clicks deep · fact · updated: 2026-07-09
- [googlebot-fetch-behavior](crawlability/googlebot-fetch-behavior.md) — Googlebot fetch cap (2026: first 2 MB HTML/text, 64 MB PDF, uncompressed; resources fetched separately), crawls over HTTP/2 (opt-out via 421), US-Pacific IPs, verify via reverse-DNS + published IP ranges · fact · updated: 2026-07-09

## robots-ai-crawlers
- [robots-txt-spec-rfc9309](robots-ai-crawlers/robots-txt-spec-rfc9309.md) — RFC 9309 robots.txt mechanics — group records, UA matching, longest-match Allow/Disallow precedence, * and $ wildcards, 500 KiB limit, controls crawling NOT indexing · reference · updated: 2026-07-09
- [ai-crawler-ua-catalog-2026](robots-ai-crawlers/ai-crawler-ua-catalog-2026.md) — 2026 AI-crawler user-agent token registry — exact names + what each does (OpenAI, Anthropic, Perplexity, Google-Extended, Applebot-Extended, Bytespider, CCBot, Meta) · reference · updated: 2026-07-09
- [ai-crawler-compliance-reality](robots-ai-crawlers/ai-crawler-compliance-reality.md) — robots.txt is voluntary — user-triggered agents may ignore it, vendors diverge (ChatGPT-User vs Claude-User), and some crawlers evade blocks entirely (Perplexity stealth, Bytespider) · fact · updated: 2026-07-09
- [ai-training-optout-tokens](robots-ai-crawlers/ai-training-optout-tokens.md) — Google-Extended and Applebot-Extended are robots.txt CONTROL TOKENS, not crawlers — they make zero HTTP requests, never appear in logs, and disallowing them never affects search ranking · fact · updated: 2026-07-09

## sitemaps
- [sitemap-url-eligibility](sitemaps/sitemap-url-eligibility.md) — A sitemap must list only canonical, indexable, 200-status URLs you want in search — not noindex, redirects, or blocked pages. · fact · updated: 2026-07-09
- [sitemap-lastmod-and-ignored-tags](sitemaps/sitemap-lastmod-and-ignored-tags.md) — Google uses <lastmod> only if it is consistently and verifiably accurate; <changefreq> and <priority> are ignored outright. · fact · updated: 2026-07-09
- [sitemap-discovery-and-ping-deprecation](sitemaps/sitemap-discovery-and-ping-deprecation.md) — HTTP sitemap ping is dead (Google 404, Bing 410 since 2023); discover via robots.txt Sitemap: directive + Search Console, use IndexNow for Bing. · fact · updated: 2026-07-09
- [sitemap-media-and-extensions](sitemaps/sitemap-media-and-extensions.md) — XML sitemap extensions exist for images (image:image/image:loc only, ≤1,000 per URL — image:caption/geo_location/title/license are REMOVED), video, and news; hreflang alternates also ride in the sitemap. · reference · updated: 2026-07-09
- [sitemap-location-and-index-format](sitemaps/sitemap-location-and-index-format.md) — A sitemap's directory placement scopes which URLs it covers (root = safest), file must be UTF-8 (gzip OK), and a sitemap-index file caps at 50,000 child-sitemap entries with a separate 500-index-per-property Search Console submission ceiling. · reference · updated: 2026-07-09

## js-rendering
- [rendering-pipeline](js-rendering/rendering-pipeline.md) — Googlebot processes JS in three phases (crawl → render queue → index); WRS renders later with evergreen headless Chromium, and the render can lag. · fact · updated: 2026-07-09
- [render-parity](js-rendering/render-parity.md) — Verify the primary content/links/meta live in the RENDERED HTML (not just the hydrated live DOM) — compare raw view-source against Googlebot's rendered output. · procedure · updated: 2026-07-09
- [framework-rendering-modes](js-rendering/framework-rendering-modes.md) — CSR ships an empty shell (worst indexability); SSR/SSG/ISR ship content-complete HTML (safe); hydration adds interactivity on top of server HTML. · fact · updated: 2026-07-09
- [dynamic-rendering-deprecated](js-rendering/dynamic-rendering-deprecated.md) — Google no longer recommends dynamic rendering (serving prerendered HTML to bots) — it calls it a workaround, not a long-term solution; use SSR/static/hydration instead. · fact · updated: 2026-07-09

## mobile
- [mobile-first-parity](mobile/mobile-first-parity.md) — Google indexes the MOBILE version exclusively — desktop-only content, links, structured data, or metadata is effectively unindexed; parity is the audit check. · fact · updated: 2026-07-09
- [responsive-recommended-pattern](mobile/responsive-recommended-pattern.md) — Google recommends responsive web design (one URL, one HTML source) as the easiest mobile-first pattern; it sidesteps most parity failures. · reference · updated: 2026-07-09
- [mobile-usability-signals](mobile/mobile-usability-signals.md) — Legible font sizes, adequately sized/spaced tap targets, and a correct viewport are the mobile-usability basics; the specific px thresholds are accessibility-derived, not hard Google ranking cutoffs. · fact · updated: 2026-07-09
- [intrusive-interstitials](mobile/intrusive-interstitials.md) — Popups/interstitials that block main content on arrival from Search demote mobile rankings; legal, login-gate, and small dismissible banners are exempt. · fact · updated: 2026-07-09

## metadata
- [robots-meta-directives](metadata/robots-meta-directives.md) — The full Google robots `<meta>` / `X-Robots-Tag` directive catalog, syntax, per-crawler targeting, defaults, and what is no longer used. · reference · updated: 2026-07-09
- [document-declaration-meta](metadata/document-declaration-meta.md) — The document-level technical declarations an auditor checks once per template — utf-8 charset, responsive viewport, and `<html lang>`/`dir` — with correct values. · fact · updated: 2026-07-09
- [dead-meta-tags](metadata/dead-meta-tags.md) — Meta tags Google ignores — keywords, author, rating, and the deprecated sitelinks-searchbox markup — that must NOT be flagged as missing. · fact · updated: 2026-07-09
- [meta-refresh-vs-301](metadata/meta-refresh-vs-301.md) — How Google interprets meta-refresh redirects and why a server-side 301 is preferred over them. · fact · updated: 2026-07-09

## titles-descriptions
- [title-link-generation](titles-descriptions/title-link-generation.md) — Google generates the SERP title link from multiple sources and rewrites the <title> for 7 named reasons; fix the cause, not the length. · fact · updated: 2026-07-09
- [title-uniqueness-duplication](titles-descriptions/title-uniqueness-duplication.md) — Flag missing/empty/duplicate/generic titles; every page needs one unique, descriptive <title> derived from its own content. · procedure · updated: 2026-07-09
- [meta-description-snippet-role](titles-descriptions/meta-description-snippet-role.md) — Meta description is a CTR/snippet lever, not a ranking factor; Google builds snippets mostly from body content and only uses the description when it describes the page better. · fact · updated: 2026-07-09

## architecture
- [internal-linking](architecture/internal-linking.md) — Internal links must be crawlable <a href> with descriptive anchor text; every page you care about needs ≥1 inbound internal link. · fact · updated: 2026-07-09
- [pagination](architecture/pagination.md) — rel=next/prev is DEAD (unused by Google since 2019) — paginate with crawlable <a href> sequential links, unique canonical per page, never fragments. · fact · updated: 2026-07-09
- [site-structure-depth](architecture/site-structure-depth.md) — Keep important pages ≤~3 clicks from home; orphan pages (zero inbound internal links) get poor discovery/ranking; flatter hierarchies distribute link equity better. · fact · updated: 2026-07-09
- [pillar-cluster](architecture/pillar-cluster.md) — Topical hub/pillar-and-cluster structure — one pillar page links to every cluster page and each cluster links back and to siblings — is the 2026-favoured internal-link topology for topical authority. · fact · updated: 2026-07-09

## media
- [alt-text](media/alt-text.md) — descriptive alt on contentful images (both a11y and image-search context) vs alt="" on purely decorative ones · procedure · updated: 2026-07-09
- [image-perf](media/image-perf.md) — next-gen formats + explicit width/height + lazy below-fold (never LCP) + srcset/sizes — the four image-perf levers · procedure · updated: 2026-07-09
- [image-sitemap](media/image-sitemap.md) — image discovery — image sitemaps (cross-domain image:loc for CDNs), descriptive hyphenated filenames, on-page surrounding text, preferred image · reference · updated: 2026-07-09
- [video-seo](media/video-seo.md) — video SEO basics — indexable watch page, crawlable streaming URL, valid stable thumbnail, key-moments markup; transcripts as content signal · fact · updated: 2026-07-09

## structured-data
- [rich-results-eligibility-2026](structured-data/rich-results-eligibility-2026.md) — Which Schema.org types still earn Google rich results in 2026 vs the removed ones (FAQ, HowTo, June-2025 batch) · fact · updated: 2026-07-09
- [structured-data-visible-content-policy](structured-data/structured-data-visible-content-policy.md) — Google's structured-data rules — markup must match visible content, JSON-LD preferred, mismatch risks a manual action, validate with two tools · fact · updated: 2026-07-09
- [article-schema-recipe](structured-data/article-schema-recipe.md) — Article/NewsArticle/BlogPosting JSON-LD — no required props, recommended headline/image/datePublished/author · procedure · updated: 2026-07-09
- [product-offer-review-schema-recipe](structured-data/product-offer-review-schema-recipe.md) — Product JSON-LD — name + one of offers/review/aggregateRating; Offer needs price(+priceCurrency), AggregateRating needs ratingValue+count, Review needs rating+author · procedure · updated: 2026-07-09
- [breadcrumb-organization-schema-recipe](structured-data/breadcrumb-organization-schema-recipe.md) — BreadcrumbList JSON-LD (itemListElement/position/name/item) and Organization JSON-LD (name/url/logo, no required props) recipes · procedure · updated: 2026-07-09
- [event-schema-recipe](structured-data/event-schema-recipe.md) — Event JSON-LD — required name/startDate/location(+address); recommended endDate/eventStatus/offers/performer/organizer/image · procedure · updated: 2026-07-09
- [recipe-video-schema-recipe](structured-data/recipe-video-schema-recipe.md) — Recipe JSON-LD (required name/image; carousel needs ItemList) and VideoObject JSON-LD (required name/description/thumbnailUrl/uploadDate) · procedure · updated: 2026-07-09

## social
- [open-graph](social/open-graph.md) — The 4 required OG properties (og:title/type/image/url), the common optional set, and the og:image:alt rule. · fact · updated: 2026-07-09
- [twitter-cards](social/twitter-cards.md) — twitter:card summary vs summary_large_image, the twitter:* tags, and X's fallback to og:* tags. · fact · updated: 2026-07-09
- [og-image-specs](social/og-image-specs.md) — Recommended share-image dimensions (1200x630, ~1.91:1), min/max sizes, file-size caps, absolute-HTTPS rule. · reference · updated: 2026-07-09
- [preview-caching](social/preview-caching.md) — How Slack/Discord/LinkedIn/Facebook/X/iMessage fetch and cache previews + which debuggers force a re-fetch. · reference · updated: 2026-07-09

## hreflang
- [hreflang-syntax](hreflang/hreflang-syntax.md) — hreflang annotation syntax, the three placement methods (pick ONE), and valid ISO language+region code format · reference · updated: 2026-07-09
- [hreflang-reciprocity](hreflang/hreflang-reciprocity.md) — reciprocity/return-tag rule (missing return tag = whole annotation ignored) + self-referencing + x-default · fact · updated: 2026-07-09
- [hreflang-canonical](hreflang/hreflang-canonical.md) — each locale must self-canonical; canonicalizing all locales to one master URL collapses the hreflang cluster · fact · updated: 2026-07-09
- [hreflang-common-errors](hreflang/hreflang-common-errors.md) — the recurring hreflang mistakes an audit should probe (missing return tag, no self-ref, bad codes, mixed methods, wrong canonical, non-200 targets) · fact · updated: 2026-07-09

## core-web-vitals
- [inp-replaced-fid](core-web-vitals/inp-replaced-fid.md) — INP replaced FID as the responsiveness Core Web Vital on 2024-03-12; FID is fully retired. · fact · updated: 2026-07-09
- [field-vs-lab-crux](core-web-vitals/field-vs-lab-crux.md) — Field data (CrUX, 28-day rolling, p75) is what Google ranks on; lab tools (Lighthouse/PSI lab) are directional only. · fact · updated: 2026-07-09
- [ttfb-lcp-input](core-web-vitals/ttfb-lcp-input.md) — TTFB ≤ 0.8s is a supporting metric that feeds LCP — it is NOT itself a Core Web Vital. · fact · updated: 2026-07-09
- [page-experience-signal](core-web-vitals/page-experience-signal.md) — Page experience (incl. CWV) is a minor, tie-breaker-class ranking signal — relevance and helpful content win first. · fact · updated: 2026-07-09
- [lcp-subparts-diagnosis](core-web-vitals/lcp-subparts-diagnosis.md) — CrUX/PSI break LCP into TTFB / resource-load-delay / resource-load-duration / element-render-delay so you can diagnose which phase is slow (Feb 2025 CrUX expansion) · fact · updated: 2026-07-09

## content-eeat
- [eeat-framework](content-eeat/eeat-framework.md) — E-E-A-T (Experience/Expertise/Authoritativeness/Trust) — Trust is the center; Experience added Dec 2022; YMYL scrutiny expanded Sept 2025 · fact · updated: 2026-07-09
- [helpful-people-first-content](content-eeat/helpful-people-first-content.md) — Helpful/"people-first" content folded into core ranking (Mar 2024, no longer a standalone HCU); self-assess with Who / How / Why · fact · updated: 2026-07-09
- [ai-content-quality-not-origin](content-eeat/ai-content-quality-not-origin.md) — Google judges content by quality/purpose, not by whether AI produced it — AI is not banned; mass low-value scaled output is the spam line · fact · updated: 2026-07-09
- [scaled-content-site-reputation-spam](content-eeat/scaled-content-site-reputation-spam.md) — The content-spam family — scaled content abuse, site-reputation abuse (Nov-2024 first-party clarification), doorway, thin affiliate, expired-domain, scraped/duplicate · reference · updated: 2026-07-09
- [freshness-and-authorship](content-eeat/freshness-and-authorship.md) — Freshness is only rewarded when genuine (recency-sensitive queries); author byline/credentials are E-E-A-T signals, not a mechanical bonus; date-faking risks demotion · fact · updated: 2026-07-09

## local
- [gbp-local-pack](local/gbp-local-pack.md) — The local pack ranks on relevance + distance + prominence, and the claimed Google Business Profile is the primary lever — off the site, not in the repo. · fact · updated: 2026-07-09
- [nap-citations](local/nap-citations.md) — One identical NAP (name/address/phone) across the site and third-party citations is the trust foundation for the local pack — necessary, not sufficient. · fact · updated: 2026-07-09
- [localbusiness-schema-signal](local/localbusiness-schema-signal.md) — LocalBusiness JSON-LD (name+address required; geo, telephone, openingHoursSpecification recommended) is a supporting signal that reinforces NAP — GBP is the ranking lever, not the markup. · reference · updated: 2026-07-09
- [multi-location-pages](local/multi-location-pages.md) — A multi-location business needs one indexable, uniquely-written page per physical location — never a city-swap template — each with its own NAP, hours, LocalBusiness schema, and GBP. · procedure · updated: 2026-07-09
- [service-area-business-address](local/service-area-business-address.md) — Service-area businesses (plumber/cleaner/mobile) hide the GBP address and declare a service area — a missing street address is legitimate for an SAB, not a defect; schema.org areaServed vs Google's required-address gap. · reference · updated: 2026-07-09

## answer-engines
- [ai-crawlers](answer-engines/ai-crawlers.md) — AI user-agent tiers (training / AI-search /
  user-triggered), the 2026 UA additions, and why allow/deny is a business decision, not a defect ·
  reference · updated: 2026-07-09
- [extractability](answer-engines/extractability.md) — AI crawlers don't run JS (raw-HTML substrate,
  CSR invisible) + passage-level extraction (answer-first, standalone chunks) · fact · updated: 2026-07-09
- [citeable-patterns](answer-engines/citeable-patterns.md) — the peer-reviewed GEO levers (stats /
  quotes / citations), question headings, definitions; rank decoupling trajectory · fact · updated: 2026-07-09
- [entity-signals](answer-engines/entity-signals.md) — Organization/author sameAs, entity-name
  consistency, the visible-content rule; real identity only, never fabricated · reference · updated: 2026-07-09
- [platform-behavior](answer-engines/platform-behavior.md) — how ChatGPT/Perplexity/AIO/Gemini/Claude/
  Copilot differ in sourcing; the off-site ceiling; cross-engine overlap + per-engine source skews ·
  fact · updated: 2026-07-09
- [ai-referral-measurement](answer-engines/ai-referral-measurement.md) — AI-referral attribution (GA4
  AI Assistant channel, verifiable setup vs advisory outcome); CWV is correlational, not causal · fact ·
  updated: 2026-07-09

## measurement-tooling
- [gsc-verify-reports](measurement-tooling/gsc-verify-reports.md) — Google Search Console verify surfaces — URL Inspection (live vs cached), Page Indexing, Performance, Sitemaps, robots.txt reports and which answers which question · procedure · updated: 2026-07-09
- [pagespeed-field-vs-lab](measurement-tooling/pagespeed-field-vs-lab.md) — PageSpeed Insights field data (CrUX, real users, 28-day p75, drives the CWV assessment) vs Lighthouse lab data (simulated, single run) — and why they diverge · fact · updated: 2026-07-09
- [structured-data-validators](measurement-tooling/structured-data-validators.md) — Rich Results Test (Google rich-result eligibility only) vs Schema Markup Validator / validator.schema.org (all schema.org types, generic validity) — use the right one · reference · updated: 2026-07-09
- [retired-seo-tools](measurement-tooling/retired-seo-tools.md) — Retired Google tools the audit must NOT recommend — standalone robots.txt Tester (gone, now the GSC robots.txt report), Mobile-Friendly Test + Mobile Usability report + API (retired) · fact · updated: 2026-07-09
- [bing-webmaster-tools](measurement-tooling/bing-webmaster-tools.md) — Bing Webmaster Tools verify surfaces — URL Inspection (ex Fetch as Bingbot), Site Scan audit, IndexNow instant submission, and the 2026 AI Performance (GEO) report public preview · reference · updated: 2026-07-09
- [gsc-generative-ai-performance-reports](measurement-tooling/gsc-generative-ai-performance-reports.md) — GSC's June-2026 impressions-only Generative AI performance reports (Search: AI Overviews/AI Mode; Discover) — no clicks/CTR/query data, partial rollout, opt-out control honored from 17 June 2026 · fact · updated: 2026-07-09

## agentic-commerce
- [acp-agentic-checkout](agentic-commerce/acp-agentic-checkout.md) — OpenAI/Stripe's Agentic Commerce Protocol (launched 2026-02-16) — the product-feed + 5-endpoint checkout-session REST spec a merchant implements so ChatGPT can complete a purchase in-chat · reference · updated: 2026-07-09
- [ap2-agent-payments-protocol](agentic-commerce/ap2-agent-payments-protocol.md) — Google/PayPal's Agent Payments Protocol (announced 2025-09-16) — signed Intent/Cart/Payment Mandates that authorize an AI agent to transact; composes with ACP rather than competing · reference · updated: 2026-07-09

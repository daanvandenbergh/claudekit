---
name: seo
description: Audit an entire website for SEO and auto-fix what it finds - crawlability, indexability, canonical/robots/sitemap/redirects/hreflang, titles and meta descriptions, headings, structured data (JSON-LD/Schema.org), Open Graph and Twitter/social cards, image alt, internal linking, Core Web Vitals, E-E-A-T content quality, and answer-engine / generative-engine optimization (AEO / GEO) for AI Overviews, ChatGPT, Perplexity, Gemini, Copilot, and Claude. Use whenever the user wants to audit, improve, fix, optimize, review, or check SEO or search ranking; research, find, or score keywords to target; asks "why isn't my site ranking / getting indexed / showing in Google", or about discoverability, meta tags, title/description, sitemap.xml, robots.txt, canonical URLs, noindex, redirects, structured data / rich results / schema, social preview cards, hreflang / multilingual SEO, page speed / Core Web Vitals; or about AEO / GEO / answer-engine / generative-engine optimization - "why doesn't ChatGPT / Perplexity / Gemini / Copilot cite us", getting cited by AI, showing up in AI answers / AI search / AI Overviews, or AI search visibility. Audits the ENTIRE site and AUTO-FIXES by default; the de-index-class of changes is always confirmed first, --scan reports without writing, --out persists the report, --force applies everything unattended. Works standalone on any stack (static HTML, Astro, Hugo, Eleventy, Next.js, Nuxt, SvelteKit, Gatsby, Jekyll, WordPress, Rails, etc.).
user-invokable: true
argument-hint: "[--scan] [--force] [--plan] [--out <path>] [--research-keywords] [scope]   ·   dev-only: --research-dev-only | --improve-research-dev-only"
---

# seo

An SEO audit that adapts to whatever project it runs in. It is **stack-agnostic**: it learns
where each site keeps its SEO signals first (Phase 0), then checks the *rendered* output against
state-of-the-art rules, fixes what is safe to fix, and emits a report. Its state-of-the-art
quality does not live in this file - it lives in **`reference/checklist.md`**, the operational
spine the audit walks top to bottom. This file is the **engine**; the checklist is the **content**.
Keeping them separate is what lets the research modes grow the SEO knowledge without ever touching
the machinery, and what keeps the audit's checks in lockstep with the researched evidence.

The single rule that keeps it sharp, borrowed from the sibling `/audit` skill: **every check = a
named failure mode + a concrete probe + a severity floor + a fix, adjudicated against what the site
actually *renders*, never against a source template the model guessed at.** "Check the title tag"
finds nothing. "Fetch the rendered `<head>`; a page with no `<title>`, a duplicate title, or a
title truncated past the SERP width loses its click-through and its ranking anchor (High); add one
in the project's resolved head mechanism and re-render to confirm" bites on any stack.

Two things make SEO different from a code audit, and both are safety-critical: **a wrong SEO fix can
silently de-index a live site or put words in the owner's mouth - with no build or test to catch it.**
So the guiding instinct is caution: **prefer a missed fix over a wrong one; when a fix's correctness
or safety is not certain from the page's own evidence, do not apply it - propose or flag it instead.**
Read the **Safety spine** below before running anything.

## Modes and dispatch

Everything after `/seo` arrives as one raw string. Parse it in prose. **Audit is the default mode -
it runs unless a mode flag (`--research-keywords`, or one of the two dev-only flags) is present.**
There is no `audit` keyword to type; a bare `/seo`, `/seo --scan`, or `/seo <path>` all run the audit.

| If the args contain… | Mode | What runs |
|---|---|---|
| *(no mode flag)* | **audit** (default) | Phases 0-6 below. Auto-fixes safe issues; **de-index-class changes are always confirmed**; `--scan` reports only. |
| `--research-keywords` | **research-keywords** | Scan the repo for candidate keywords → verify each via `claude-in-chrome` → merge a scored, ranked list into the consumer's `claude/seo/keywords.md` (idempotent). |
| `--research-dev-only` | **research** (DEV ONLY) | ~20 domain agents (one per topic) + 1 topic-coverage scout refresh `reference/knowledge/` via `/memory-store`, then regenerate `reference/checklist.md`. |
| `--improve-research-dev-only` | **improve** (DEV ONLY) | `/memory-store --optimize reference/knowledge` + checklist link reconciliation. |

If both dev flags are passed, run **research** then **improve** (research first, since improve
consolidates what research just filed). Everything in the args that is not a recognized flag
(`--scan` / `--plan` / `--force` / `--out` / `--research-keywords` / the two dev flags) is the audit
**scope hint**.

**`--research-keywords` is consumer-facing** — unlike the two `--…-dev-only` flags it writes only to
the consumer's own `claude/seo/keywords.md`, never to the skill, so it is safe to run in any install.

The two `--…-dev-only` flags are deliberately verbose and un-aliased: they mutate the skill's own
bundled research and must only ever run in the `@daanvandenbergh/claudekit` **source repo**,
never in a consumer install. A consumer will only ever run **audit**, and audit never writes to the
skill. Both dev modes STOP hard before doing anything if they detect they are running from inside
`node_modules/` or if `/memory-store` is not installed (see those sections).

### Audit flags

Extract and strip these first; the remaining text is an optional **scope hint**.

- `--scan` - **report only, zero writes anywhere.** Use to preview. Default is OFF (auto-fix is the
  default - see the Safety spine for exactly what "auto-fix" does and does not touch).
- `--plan` - list every finding and apply nothing until the user replies `approve` / `approve <ids>`.
  A middle ground between `--scan` and default.
- `--force` - apply **every** fix unattended, **including the de-index class, with no confirmation.**
  Dangerous (see the Safety spine). Only honor it if the user typed it; warn once before using it.
- `--out <path>` - persist the report to `<path>` (committed; drives pass-numbering across sessions).
  Default: the report is emitted **inline in the response** and nothing is written to disk.
- **scope hint** (positional) - a path, route, glob, or URL to narrow the audit. Default: the
  **entire site**.

---

## Safety spine — read before any fix

SEO is not code. A code audit fixes behind a build, a test suite, and git; a wrong fix fails loudly
and reverts cleanly. SEO has **no such safety net**. Two failure modes make aggressive auto-fixing
dangerous, so the audit is built around avoiding them:

**1. De-indexing is silent and slow to reverse.** A wrong `canonical`, a `Disallow:` in
`robots.txt`, a leaked `noindex`, a broken redirect, or a non-reciprocal `hreflang` can drop pages
from Google's index. Nothing errors. Traffic falls over *weeks*, and recovery waits on Google's
recrawl even after you revert the code. So the **de-index class** of changes is treated as
radioactive.

**2. Generated text can fabricate claims the site owner never made.** Auto-writing a meta
description, alt text, or JSON-LD value from thin air invents brand voice and, worse, facts -
a price, a rating, a credential. Markup that describes content not visible on the page is a Google
spam-policy violation that can trigger a manual action. So the audit **never fabricates**; it
grounds every generated value in what the page already shows, or it leaves a `[[NEEDS: ...]]`
placeholder for a human.

### The three fix tiers (this is decoupled from severity)

Severity says *how bad the problem is*; the tier says *how dangerous the fix is*. They are
orthogonal - a Critical de-index leak is **gated** (Tier C), while a Low missing `viewport` is
**auto** (Tier A). `reference/checklist.md` tags every check with its tier.

| Tier | What it covers | Default behavior | `--scan` | `--force` |
|---|---|---|---|---|
| **A — Safe** | Mechanical or derived-from-the-page: add missing `viewport`/`charset`/`lang`, a **self**-referencing canonical on a canonical-original page, image `width`/`height` read from the file, `alt=""` on decorative images, OG/Twitter tags propagated from an existing title/description, JSON-LD fields 1:1 with visible content, `loading="lazy"` below the fold, normalizing internal links to their final URL. | **Apply automatically.** | Report | Apply |
| **B — Generated** | A value must be written (missing meta description, missing alt on a contentful image, a suggested title rewrite). Generated **only** from the page's own visible content; ungroundable → `[[NEEDS: ...]]` placeholder, never an invention. | **Propose the exact text; apply on confirm.** Applied values are listed under "generated - verify". Be conservative: when unsure, propose rather than write. | Report + proposed text | Apply (still grounded) |
| **C — De-index** | Anything touching indexation or asserting facts: `robots.txt`, `meta robots`/`X-Robots-Tag`, **retargeting** an existing canonical, redirects, `hreflang` clusters, sitemap regeneration, host/scheme (www/https) changes, fact-bearing schema (price/rating/review/offer). | **Never silent.** Aggregate into one **before → after confirm batch** at the end; apply only what the user approves. | Report | Apply **with an explicit de-indexing warning** |

Three rules hold in every tier, and the first governs the other two:

- **When in doubt, don't — conservative is the default.** A fix is applied only when its correctness
  *and* its safety are clear from the page's own evidence. Any uncertainty - an ambiguous canonical
  target, a value you would have to guess, a change whose blast radius you cannot bound - **downgrades
  the fix to propose (Tier B) or flag**, never a silent write. A fix you skipped is a one-line
  follow-up in the report; a wrong fix pushed to a live site is lost traffic the owner discovers weeks
  later. The whole tier system exists to keep the audit from breaking things - when the tiers leave
  any doubt, resolve it toward *not writing*.
- **Never overwrite human-authored copy.** A non-empty title / description / alt / H1 is a human
  decision. Auto-fix only *fills a gap* or *repairs broken markup*. A length or quality problem on
  existing copy is report-and-propose, never a silent rewrite and never a force-truncation (that
  mangles meaning).
- **Every fix is idempotent.** "Add a canonical" first checks one is absent, so re-runs and
  multi-pass never double-apply or duplicate a tag.

### Defects vs. decisions

Some "findings" are deliberate strategy, and auto-fixing them breaks the site: an intentional
`noindex` on staging / thank-you / filtered pages, `rel="sponsored"`/`"ugc"` on paid or
user-generated links (correct, not a defect), AI crawlers the owner chose to block, a disallowed
admin path, a settled www-vs-non-www choice. These are **flag-and-confirm-intent**, never
auto-changed. Phase 0 reads the project's decisions log so a choice confirmed once is not re-flagged
forever.

### Scope — what the audit edits vs. what it only advises

The audit edits only what exists as a **repo artifact**. A whole class of ranking factors lives
**outside the repo** and has no file to fix — the audit **detects and recommends these, never edits
them, and never reports them as "fixed"**: there is nothing in-tree to write and nothing to verify a
fix against, the same reason it refuses to fabricate. They are **advisory-only** — surfaced with their
evidence and a concrete recommended next step, grouped in the report under *Advisory — off-repo*, and
never auto-applied nor gated for edit-approval (there is no edit to approve).

- **Off-page / authority** — backlinks, link building, digital PR, brand mentions, third-party
  `sameAs` / entity presence. No repo artifact exists for any of it.
- **Local / listings** — Google Business Profile, NAP citations, review platforms.
- **Hosting / infrastructure performance** — TTFB, CDN, cache-control / compression / HTTP-2 set at
  the server or platform layer, not in tracked source. *Contrast:* page-speed problems that **are** in
  the repo — unsized images, render-blocking assets in the head partial, a missing `loading="lazy"`,
  an oversized bundle — stay normal Tier A/B fixes; only the infra layer is advisory.
- **Off-site reputation** — third-party reviews, social profiles, Wikipedia / Wikidata.

This mirrors the fix tiers but asks the prior question: the tiers bound *how dangerous an edit is*;
this bounds *whether there is an edit at all*. When there is no repo artifact, the answer is
**inform, don't edit** — surface it, recommend the next step, and move on.

---

## AUDIT mode

### Phase 0 — Profile, surface, capabilities, decisions

Before checking anything, learn the ground truth. Four sub-steps, none skippable.

**0.1 Preconditions.** Confirm `reference/checklist.md` exists (it ships with the package). If it is
missing, **STOP** - the install is incomplete; do not fall back to auditing from model memory,
because the shipped, dated checklist *is* the state-of-the-art guarantee. Audit mode invokes
**no** `/memory-store` and no sibling skill - it only reads `reference/` with `Read`/`Grep` - so a
consumer never needs anything beyond this skill installed.

**0.2 Stack profile — where do SEO signals live?** In a framework project the title, meta, canonical,
robots directives, and JSON-LD are *emitted*, not written as literal tags - so grepping the source
for `<title>` finds nothing and would false-flag a correct site. Detect the generator and resolve
the **head mechanism** (the one shared place head tags are injected) and the **config surfaces**.
Read `reference/knowledge/foundations/stack-signals.md` for the detection table. Resolve, per this project:
generator; head mechanism (e.g. Next Metadata API / `next/head`, Astro layout `<head>`,
`react-helmet`, Hugo `layouts/partials/head.html`, WordPress `wp_head()`/Yoast, ERB/Liquid layout);
`robots.txt` + sitemap source (or the generator config that emits them); redirect config
(`_redirects` / `.htaccess` / `vercel.json` / `next.config`); canonical base-URL config; where
per-page title/description live (frontmatter / content dir); and the **build output dir**
(`dist`/`_site`/`public`/`.next`) - which is **excluded as an edit target**. Findings are assessed
against rendered output; **fixes always land in source**, never in build output. As `/audit` says:
never fall back to a baked-in default - if a slot can't be determined, ask.

**0.3 Render surface + capabilities.** Most SEO facts (final title, canonical, status code, injected
schema, CWV) exist only in the *rendered* response. Acquire a render surface, cheapest first: (1) an
existing build output dir; (2) a startable dev/preview server (honor the project's rule on starting
servers - if it says ask, ask); (3) a live/preview URL the user provides. Then probe capabilities
once: `command -v node npx curl`, a headless browser or the `web-perf` skill (for CWV), and whether
a public URL is reachable. Record which **evidence tiers** are available:
- **Tier 0 — static** (files + `grep`/`Read` + a `node`/`curl` one-liner): always available; carries
  most checks and *every* auto-fix.
- **Tier 1 — rendered** (browser / dev-server / Lighthouse): CSR detection, mobile, layout/CLS.
- **Tier 2 — live** (public URL + network): CWV field data (PageSpeed/CrUX), live link/redirect
  crawl, HTML validation.

Because AI answer crawlers (except Gemini) don't run JS, capture the **raw/pre-JS HTML** (a no-JS
`curl`/fetch of each route) as a first-class artifact alongside the rendered DOM — it is the substrate
the render-parity (R1) and answer-engine (G1) checks diff against, and what every AEO fix is verified
against.

If a tier is unavailable, its checks are reported **"deferred - needs <renderer/live URL>"**, never
as "pass". If no render surface at all can be obtained, run Tier 0 against source and mark every
render-dependent finding **"source-level, unverified against render"**. Never adjudicate an SEO fact
from template source alone and call it clean.

**0.4 Decisions log.** Read `claude/seo/decisions.md` in the consumer's project if it exists. It
records the site's intentional choices (suppressions) and the owner's prior approvals/rejections of
de-index-class fixes, each dated. Suppress anything it covers - do not re-flag a confirmed intentional
choice, and **never re-propose a fix the owner already rejected.** New decisions are appended in
Phase 5.

### Phase 1 — Enumerate the site

Build the URL / page set, cheapest first: the site's own `sitemap.xml` → the framework's file-based
routing → a crawl of a running server from the homepage to depth 3 → a glob of content/HTML files.
Group pages into **template classes** (home, listing, article/post, product, legal, 404). Deep-audit
one representative page per class (template issues repeat identically) **plus** a cheap whole-corpus
pass that extracts just `<title>` / `<meta description>` / `canonical` from every page for the
inherently-sitewide checks (duplicate / missing). Auditing every URL with the full battery on a large
site is cost with no marginal signal - say so if you sample, and report the class → representative
mapping.

### Phase 2 — Walk the checklist

**Read `reference/checklist.md` and walk it top to bottom.** It is ordered by impact: the de-index
(indexation-integrity) class first, then crawlability, rendering/mobile, on-page/semantic, media,
structured data, social, hreflang, Core Web Vitals, content/E-E-A-T, and answer-engine optimization.
Each entry gives you the failure mode, a stack-agnostic probe, a severity floor, a fix tier, a fix
recipe, and a verify step. Run **every** check against every in-scope template class (or once
site-wide where the check is site-wide). A check that is genuinely N/A (no i18n → `hreflang`) is a
**one-line documented skip**, never a silent omission - a category switched off is exactly where a
real issue hides. When a check needs deeper detail (a schema recipe, a threshold's source and date,
an edge case), read the cited `reference/knowledge/<domain>/<slug>.md` entry. Do not audit from
memory when the checklist cites a knowledge file - the dated evidence is the point.

### Phase 3 — Fix

**Caution first - the goal is to improve the site without breaking it.** When a fix's correctness or
safety is uncertain, downgrade it to propose/flag rather than apply. Then apply fixes per the
**Safety spine**: Tier A automatically (only where the value is unambiguous); Tier B proposed-then-applied (grounded,
listed for verification); Tier C aggregated into the end-of-run confirm batch (or applied
immediately only under `--force`, with the warning). Honor `--scan` (write nothing), `--plan` (gate
everything), and the decisions log (skip suppressed/rejected items). Fix at the **root**: an issue
on 500 pages that traces to one shared head partial is **one** edit, not 500 - classify each finding
as template-level (fix once) or per-page (fix per page) and report the affected-page count.

### Phase 4 — Verify (build-free)

Never block on a build - many SEO stacks can't build in the audit environment. Verify each fix by
re-running the exact probe that flagged it and showing before → after: reparse the edited file (one
well-formed tag; JSON-LD passes `JSON.parse`); re-run the specific probe (it now passes and a re-run
won't double-apply); if a render surface exists, re-render the affected URL and confirm the tag is in
the rendered `<head>` (catches wrong-layer edits on JS frameworks). For an **AEO / render-parity** fix
(R1 / G1) verify against the **raw no-JS fetch** of the route, not the hydrated DOM — content that
appears only after client-side hydration is invisible to AI answer crawlers (all except Gemini), so a
DOM-only pass is a false AEO win. Then resolve any touched
redirect / canonical / `hreflang` target to a live `200` (not a redirect, not a 404). For Core Web
Vitals you cannot prove an in-session field win - verify the **lab** proxy improved (Lighthouse
LCP/CLS/TBT) and mark **"field confirmation pending ~28d CrUX"**. Never claim a ranking improvement, and
never promise or measure an AI citation as a fix result — citation frequency and AI-referral traffic
stay advisory, out of the verdict; the audit proves source/lab correctness, not SERP or answer-engine
outcomes.

### Phase 5 — Report

Emit inline by default; write to `--out <path>` only if given (committed - it then drives
pass-numbering). Structure:

```markdown
# SEO Audit — <site> (Pass N, YYYY-MM-DD)

**Mode:** audit [--scan|--plan|--force]   **Knowledge base verified:** <reference date>
**Evidence tiers run:** Tier 0 ✓ · Tier 1 <✓/deferred: reason> · Tier 2 <✓/deferred: reason>

## Verdict
<worst unfixed severity — any unfixed Critical/High = "do not ship">

## Applied — safe (Tier A)
## Applied — generated, VERIFY (Tier B)
## Placeholders emitted ([[NEEDS: ...]])
## Awaiting confirmation — de-index class (Tier C)   [before → after per change]
## Advisory — off-repo (not edited)   [off-page · local · infra perf · reputation — recommendation + evidence]
## Findings (grouped Critical → High → Medium → Low → Info)
  <check-id · file:line · failure · evidence · severity · tier · affected pages>
## Coverage matrix
  <check-id × template-class → pass / fixed / skipped(reason) / deferred(reason)>
## Decisions recorded this run  → appended to claude/seo/decisions.md
```

Append new intentional-choice suppressions and any de-index approvals/rejections to
`claude/seo/decisions.md` (create it if absent) so the next run respects them.

### Phase 6 — Multi-pass

Convergence must be **honest**: a reviewer who just fixed the code is biased toward declaring its own
work clean. So **every pass after Pass 1 is run by a fresh `general-purpose` sub-agent**, given the
exact scope, the full flag set (`--scan`/`--plan`/`--force`/`--out` all propagate), the pass number,
and the framing *"Assume there are still SEO issues in this site. Find them."* - plus a warning that
"the previous pass found nothing" only means the previous reviewer didn't look hard enough. Stop
after **two consecutive clean passes**; any new Critical or High resets the counter to zero.

---

## `--research-keywords` mode — keyword research

**Consumer-facing** (unlike the two dev-only research modes): it writes only to the consumer's
`claude/seo/keywords.md`, never to the skill. Triggered by the `--research-keywords` flag. Builds a
scored, ranked keyword list for the site in three steps, and is safe to re-run because the file is a
**merge target, not a rewrite** (K3 is the idempotency guarantee). `--scan` makes it report the
proposed list without writing.

**K1 — Harvest candidates from the repo.** First **load the existing `claude/seo/keywords.md`** (if it
exists) and parse its `- <keyword> <score>/10` lines into a set of already-known keywords, keyed by the
**normalized** form (lowercase, trim, collapse whitespace) — this is the same key K3 upserts on. Then
reuse Phase 0.2's stack profile to find where the site's content lives and scan it for the terms the
site is *already about*: page titles, H1-H3 headings, meta descriptions/keywords, slugs/URLs, product
& service names, nav labels, frontmatter tags, image `alt`, and recurring noun phrases in body copy.
Normalize each harvested term and **check it against the already-known set before adding it as a new
candidate**: a keyword already in `keywords.md` is *not* a new candidate — it keeps its prior score and
is only re-scored in K2 if its inputs changed — and two harvested terms that normalize to the same key
collapse into one. This existing-file dedup is what keeps a re-run from ever proposing or writing a
duplicate line. This is Tier 0 — files + grep — so it always runs. A candidate no page actually
supports is not a keyword for this site; drop it.

**K2 — Verify performance with claude-in-chrome.** Load the `claude-in-chrome` tools first (one
`ToolSearch` `select:` call — see the MCP instructions), then gauge each candidate against the three
factors of the score, cheapest first:
- **Demand** — the primary signal is **Google Trends** (`https://trends.google.com/explore`): it
  gives *relative* search interest (0-100) and the trend direction (rising / flat / declining), and
  lets you **compare up to 5 terms at once**. Compare candidates in batches of ≤5, carrying one
  **shared anchor term** across every batch so the 0-100 readings are commensurable beyond a single
  batch. Corroborate with Google autocomplete completion and "People also ask" / related-search
  breadth (intent).
- **Attainability / competition** — who ranks page 1 (brand giants vs. thin pages) and the result
  count. A large result count is a **competition** signal, **not** a demand one — many results means
  the term is *contested*, not that it is *searched for*; that is exactly why demand comes from
  Trends, not from the results total.
- **AEO + current standing** — any AI Overview on the query (AEO surface), and whether *this site*
  already appears.

Score each **1-10** as a documented heuristic — **demand × relevance-to-this-site × attainability** —
**not** a precise monthly-search-volume figure: Trends is *relative*, not absolute, and there is no
paid keyword tool here, so say the score is an estimate. Batch lookups, respect Trends' rate limits,
and skip re-querying candidates whose inputs are unchanged from the existing file. If the browser is
unavailable, **degrade, don't fail** (exactly as audit defers an unreachable evidence tier): score
from repo signals alone (prominence × on-page frequency) and stamp the run
`browser unavailable — scores are repo-signal estimates only`.

**K3 — Merge idempotently into `claude/seo/keywords.md`.** Read the existing file if present and parse
each `- <keyword> <score>/10` line into a map keyed by the normalized keyword. **Upsert**: update the
score on a keyword that already exists (edit the line in place, never add a second one), insert the new
ones. Re-sort **best → worst** by score, tie-break alphabetically, and write the whole file back under
a `# SEO Keywords` heading. Because the key is the normalized keyword and the order is fully determined
by (score, keyword), running the mode twice on an unchanged repo produces a byte-identical file. Under
`--scan`, print this block instead of writing it. Format:

```markdown
# SEO Keywords
- kitesurfing 8/10
- kite lessons 6/10
- hello 1/10
```

---

## `--research-dev-only` mode — research (DEV ONLY)

**Dev only.** Triggered by the `--research-dev-only` flag. Refreshes the skill's own bundled SEO
research and regenerates the checklist. Runs only in the source repo.

**Preflight (both guards, before any work):**
1. **Repo guard.** Resolve this skill's *real* path (follow the symlink). If it resolves inside
   `node_modules/`, **STOP**: *"research/optimize modes mutate the skill's bundled research and only
   run in the @daanvandenbergh/claudekit source repo, not a consumer install."*
2. **`/memory-store` preflight.** Confirm `/memory-store` is installed (a `memory-store` sibling
   skill, e.g. `.claude/skills/memory-store/SKILL.md`). If not, **STOP** and tell the user verbatim:
   *"seo research modes keep the research corpus via the `/memory-store` skill, which isn't installed.
   Install it from @daanvandenbergh/claudekit (symlink it into `.claude/skills/memory-store`)
   before running /seo --research-dev-only."*

Then run the phases below. The shape is **parallel research, serial filing** - because
`/memory-store`'s dedup discipline (grep-before-write, refine-in-place, one `INDEX.md` edited with
each entry) is inherently serial, so many concurrent `--store` calls would race the index and defeat
dedup. Every research agent still runs in parallel - the ~20 domain agents **and** the one
topic-coverage scout (and any writer it spawns); only the cheap filing tail is serialized.

- **R0 — Assignment map.** Partition SEO into ~20 non-overlapping domains, one per
  `reference/knowledge/<domain>/` folder (crawlability, indexability, canonicalization, metadata,
  titles/descriptions, structured-data, social, sitemaps, robots/AI-crawlers, hreflang, LCP/INP/CLS,
  mobile, media, internal-linking/architecture, URL/status/redirects, content/E-E-A-T,
  answer-engines/GEO, JS-rendering, local, measurement/tooling). Each brief names what it owns and
  what to defer to a sibling ("you own X, link don't duplicate Y"). **Two domains ship seeded —
  `foundations/` and `answer-engines/` — so those briefs read *refine in place, don't rebuild*.** The
  answer-engines agent owns six existing entries (ai-crawlers, extractability, citeable-patterns,
  entity-signals, platform-behavior, ai-referral-measurement) and must return a `REFINES:<slug>` packet
  for each, linking (not duplicating) to robots/AI-crawlers (C4), JS-rendering (R1), structured-data
  `sameAs` (D4), content/freshness (E4), and measurement.
- **R1 — Parallel research (~20 agents, NO writes).** Each agent first reads
  `reference/knowledge/INDEX.md` and greps its own domain folder, then researches to state-of-the-art
  via web search, then **returns** a filing packet: atomic memories each labeled `NEW` or
  `REFINES:<slug>`, with a primary-source URL + access date, a `type`, a BLUF line, body, and an
  index one-liner. Mandate primary sources (Google Search Central, web.dev, schema.org) and
  `confidence: low` on single-sourced fast-movers - SEO facts rot (INP replaced FID; FAQ/HowTo rich
  results removed 2026), so `source` + `updated` are the re-verification anchors.
- **R1b — Topic-coverage scout (the one extra agent, runs in parallel with R1).** The ~20 domain
  agents each go *deep* on a topic they were handed; none of them can discover a topic that is not on
  the list. This single meta-agent owns exactly that gap: its subject is **the domain map itself**, not
  any one domain. It reads the R0 topic list and `reference/knowledge/INDEX.md`, then researches
  whether state-of-the-art SEO now has a discipline that **no current topic owns** - a genuinely new
  area (e.g. a newly-material ranking system, a new answer-engine surface, a new markup/standard), not
  a subtopic that belongs inside an existing domain. It must justify each candidate against the
  existing map so it adds a *new* topic, never a duplicate of one already covered. For every real gap
  it confirms, it **spawns a fresh researcher for that new topic**; that writer reads the corpus for
  adjacency, researches the topic to state-of-the-art, and **returns a `NEW`-labeled packet for a new
  `reference/knowledge/<new-domain>/` folder** - filed by R2 like every other packet, so the
  single-writer / one-`INDEX.md` discipline still holds (the scout and its writers do **not** call
  `--store` themselves). The scout returns the list of new domains it added (or an explicit
  "none - the map is complete", which is a valid, logged result) and hands it to R3 so each becomes a
  checklist section. Growing the topic set is the whole point of this agent - but a new topic must earn
  its place with a real, sourced gap, not padding.
- **R2 — Serial filing (one filer).** Replay every packet through
  `/memory-store --store reference/knowledge "<memory>"`, one at a time, so grep-before-write sees all
  prior writes and `INDEX.md` is never contended.
- **R3 — Checklist regeneration (one curator).** Rebuild `reference/checklist.md` from the refreshed
  corpus into one coherent, impact-ordered spine. Enforce the two-way link invariant: **every check
  cites ≥1 live knowledge entry** `(src: knowledge/<domain>/<slug>.md)`, and **every audit-relevant
  entry is cited by ≥1 check**. Bake in the current myths as explicit non-checks (do not flag missing
  `llms.txt`; do not promise FAQ/HowTo rich results; no word-count or exact-char-count rules; no
  hand-added JSON-LD as a GEO lever). **Fold in any new domain the R1b scout added:** give it its own
  checklist section, placed by impact, with checks in the standard shape and held to the same two-way
  link invariant. Stamp a `Verified: <date>` header.
- **R4 — Optimize + reconcile.** Run `/memory-store --optimize reference/knowledge`, then the shared
  **reconcile-checklist** routine: because optimize merges/renames entries (overwriting a loser slug
  with a tombstone), grep `checklist.md` for every merged/superseded/renamed slug and repoint it to
  the tombstone's target. Report merged / pruned / repointed; the git diff is the audit trail.

## `--improve-research-dev-only` mode — improve (DEV ONLY)

**Dev only.** Triggered by the `--improve-research-dev-only` flag. Same two preflight guards as research
mode. Then: `/memory-store --optimize
reference/knowledge`, followed by the **reconcile-checklist** routine (repoint any `checklist.md`
citations that optimize's merges/renames broke), then a short report. It is *not* purely a thin
wrapper - the reconciliation is the load-bearing part; skipping it silently leaves audit checks
citing tombstoned entries.

---

## Reference

- `reference/checklist.md` — the operational spine the audit walks: every SEO check as
  ID + failure mode + probe + severity floor + fix tier + fix recipe + verify. **The single source of
  truth for what the audit checks.** Regenerated by `--research-dev-only`.
- `reference/severity.md` — the SEO severity model (indexation impact × blast radius) and the note
  that severity is decoupled from fix-tier.
- `reference/knowledge/` — the `/memory-store`-managed research corpus (`INDEX.md` + per-domain
  entries + `_sources/`). Deep-dive evidence, dated thresholds, schema recipes, and the stack-signals
  table the checklist cites. Grown by `--research-dev-only`; **only ever targeted at `reference/knowledge`,
  never `reference`,** so `--optimize` cannot touch the curated spine.

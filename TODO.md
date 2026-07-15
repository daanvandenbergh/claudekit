# TODO
To do list.

- [ ] Use Fable to improve the: /audit-security skill

- [ ] Use Fable to improve the: /audit skill

- [ ] Use Fable to improve the: /audit-deep-logic skill

- [ ] Use Fable to improve the: /policy-writer skill

- [ ] Use Fable to improve the: /seo skill

- [ ] Use Fable to improve the: /audit-tests skill

- [ ] Use Fable to improve the: /memory-store skill

---

## Off-page SEO skill — `skills/web/seo-offpage/` (proposed `/seo-offpage`)

**Status:** not started · **Priority:** medium · **Depends on:** paid data sources (see below)

### Why a separate skill (not a mode of `/seo`)

`/seo` is an on-**site** auditor+fixer: everything it touches is a repo artifact, and its whole safety
model (fix tiers A/B/C, verify-by-re-probe, idempotent writes) assumes a file it can edit and re-render.
Off-page SEO breaks all three assumptions:

- **No repo artifact to edit.** A backlink, a Google Business Profile, a brand mention on a third-party
  site — none of it lives in the tree, so there is nothing to write and nothing to verify a fix against.
  `/seo` already recognizes this: the *Scope — what the audit edits vs. what it only advises* section
  routes these to **advisory-only** report lines. This skill is the tool that actually *works* those
  advisories instead of just listing them.
- **Actions are executed by a human, over weeks.** You can't "commit" a backlink. Output is an action
  plan + drafts + tracking, not a diff.
- **Signal needs off-site data**, most of it behind paid APIs — a fundamentally different capability
  surface from grep+render.

Keeping it separate keeps `/seo` honest (it never pretends to fix what it can't) and keeps this skill
free to be advisory/action-oriented without contorting the audit's edit-and-verify machinery.

### Scope / capabilities (grouped by sub-domain)

- **Backlink & authority profile** — inventory referring domains, anchor-text distribution, dofollow vs
  nofollow/UGC/sponsored mix, toxic/spam link detection, lost-link monitoring, authority trend. Needs a
  backlink index (see data sources).
- **Link-building / digital PR** — find realistic link opportunities (unlinked brand mentions,
  competitor backlinks we lack = "link gap", resource-page & broken-link targets, HARO/journalist
  queries), draft outreach, track a pipeline. **White-hat only** (see boundaries).
- **Local SEO** — Google Business Profile completeness & categories, NAP consistency across citations,
  review volume/velocity/response rate, local-pack presence for target queries, `LocalBusiness` schema
  cross-check with the on-site audit.
- **Brand & entity signals** — Knowledge Panel / Wikidata / Wikipedia presence, `sameAs` coverage on
  authoritative third-party profiles, branded-search demand (via Google Trends), entity consistency.
- **Off-site reputation** — third-party review platforms (Trustpilot/G2/industry-specific), social
  profile presence & consistency, sentiment at a high level.
- **Competitor gap analysis** — the connective tissue: keyword gap, backlink gap, content gap,
  SERP-feature gap vs. a named competitor set. Feeds all the above with "who's beating us and where."
- **Rank / visibility tracking** — track target keywords (from `claude/seo/keywords.md`) over time,
  SERP features won/lost, share-of-voice. Time-series, so it wants a persisted history file.

### Data sources (the hard part — decide before building)

- **Free / already available:** Google Trends (already used by `/seo --research-keywords`), live SERP
  reads via `claude-in-chrome`, Google Search Console + GA4 **if the user connects them** (first-party,
  best backlink+query data they own), Wikidata/Wikipedia APIs, Google Business Profile.
- **Paid (backlinks need these — no good free index exists):** Ahrefs / Semrush / Moz / Majestic APIs.
  Design the skill so it **degrades to Search Console + SERP scraping when no paid key is present**
  (mirror `/seo`'s "degrade, don't fail" ethos), and clearly label which metrics are estimates.
- **Config:** a `claude/seo/offpage.config.*` (or reuse a shared `claude/seo/` config) for API keys,
  competitor list, target locations, and brand/NAP canonical values.

### Modes / invocation (sketch)

- `--backlinks` · `--link-gap <competitor…>` · `--local` · `--brand` · `--reputation` ·
  `--competitors <domain…>` · `--track` (rank tracking) — plus a default "full off-page audit".
- `--scan` (report only) and an `--out <path>` mirroring `/seo`, for consistency.

### Output / artifacts

- `claude/seo/offpage.md` — a persisted, **idempotent** off-page report + prioritized action plan
  (same merge-not-rewrite discipline as `keywords.md`, keyed so re-runs update in place).
- Optional `claude/seo/rank-history.md` (or CSV) for `--track` time-series.
- Outreach drafts as separate files under `claude/seo/outreach/` (human sends them — never auto-sent).

### Safety / boundaries (carry over `/seo`'s ethos)

- **Advise & draft, never execute off-site.** No auto-sending outreach, no auto-posting reviews, no
  touching third-party accounts.
- **White-hat only.** Never suggest buying links, PBNs, link farms, fake reviews, or any black-hat
  tactic — these carry manual-action risk. Flag if the *current* profile shows signs of them.
- **Never fabricate metrics.** Every authority/volume number is labeled with its source and whether it's
  estimated; no invented DA/traffic figures.
- **Privacy/ToS:** respect target-site robots/ToS when scraping SERPs; rate-limit; don't scrape PII.

### Relationship to `/seo`

- `/seo` audit surfaces off-repo items as advisories → this skill is where they get worked.
- Shares `claude/seo/` (keywords.md, decisions.md) — rank tracking consumes `keywords.md`; local SEO
  cross-checks the on-site `LocalBusiness` schema the audit already inspects.
- Same authoring conventions: project-/stack-agnostic, self-contained skill dir, no cross-skill imports,
  `reference/` for any dated knowledge, `Verified: <date>` on researched thresholds.

### Open questions

1. One skill with sub-modes, or split (`/seo-backlinks`, `/seo-local`) if it grows too big?
2. Which paid API to standardize on first (or stay key-agnostic with an adapter note)?
3. How much to lean on Search Console (best data, but requires user OAuth) vs. keep it zero-setup?
4. Rank tracking implies scheduled re-runs — pair with `/loop` or `/schedule`, or leave manual?

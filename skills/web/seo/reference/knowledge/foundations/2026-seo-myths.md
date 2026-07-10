---
updated: 2026-07-09
source: Google Search Central + web.dev + maintainer's scribekit seo-checklist.md (2026); llms.txt zero-request stat https://ahrefs.com/blog/llmstxt-study/ (single third-party study); re-verify each research run
type: fact
tags: [myths, geo, structured-data]
---

# SEO/GEO myths the audit must not flag (2026)

Reporting any of these as a defect wastes the site owner's review budget and gives advice that
2026 evidence contradicts. The audit checks them and **correctly does not flag them**.

## Facts
- **`llms.txt` is not used by any major AI system** (Google confirmed). It carries no ranking or
  citation benefit — a single third-party study (Ahrefs, 2026-06-15, 137K sites) found ~97% of
  published `llms.txt` files get zero AI requests [Ahrefs study; confidence: low — one measurement,
  could be revised by a later study; the "no major AI system uses it / Google confirmed" claim is
  the primary-sourced part]. Never score a site down
  for lacking one; mention it only as an optional, zero-guarantee experiment, and only for a docs/API
  site (its one genuine, narrow use is Anthropic/Perplexity/IDE-tool retrieval, not marketing pages).
  [Google, 2026]
- **Neither FAQ nor HowTo can be promised as a rich result.** FAQPage rich results were first
  **restricted to authoritative government/health sites on 2023-09-14**, then **fully removed from
  Google Search on 2026-05-07**; **HowTo rich results were removed in 2023.** The markup still has
  semantic/AI-extraction value if it maps to visible content, but its **absence is not a lost rich
  result** — and the audit must **never promise EITHER FAQ or HowTo** as a rich result.
  [https://developers.google.com/search/docs/appearance/structured-data/faqpage]
- **Word-count minimums are not a ranking factor.** Adding words without structure gives ~0
  AI-citation lift. Topical depth and structure matter, not a "1,500+ words" target.
- **Keyword-density targets / stuffing are measurably worse** than natural placement for both classic
  ranking and AI citation. Front-load the keyword naturally once; do not chase a density number.
- **Exact title/meta character counts are not worth obsessing over.** Google rewrites ~60%+ of titles
  and truncates by pixel width (~600px). Front-loading the payload beats trimming to a magic count.
  The checklist's ~30-60 char / ~120-160 char figures are *guidance for the snippet*, not pass/fail.
- **Hand-added JSON-LD is not a GEO lever.** Controlled tests show ~no citation uplift from adding
  schema by hand. Emit the schema that earns *rich results* (Organization, Product, Article,
  Breadcrumb — usually already emitted by the framework) and stop; do not bulk-inject schema chasing
  AI citations.

## AEO anti-patterns the audit must never DO (not just "not flag")

- **Deceptive freshness — never bump a `dateModified` or a visible "last updated" date when the content
  didn't change.** It misleads users and risks spam treatment. The only safe date action is syncing
  schema to the page's actually-true visible/committed date; never invent "today".
- **Never cloak or add model-directed text.** No `display:none` "AI-only" blocks, hidden keyword text,
  or instructions aimed at LLMs — the same manual-action family as spammy markup, and unethical.
  Anything the skill touches must be equally visible and truthful to human visitors; detecting existing
  cloaking is a reportable finding, not something to add.
- **Never promise a citation or ranking.** Engine mechanics are opaque and divergent (ChatGPT and
  Perplexity share ~11% of cited domains); state outcomes as probabilistic and engine behavior as
  "reported/observed", never "the algorithm does X".
- **Never mass-block (or mass-unblock) AI crawlers by default.** Which AI user-agents to allow is a
  business/legal decision, never an auto-fix — see [answer-engines/ai-crawlers](../answer-engines/ai-crawlers.md).

## Related
- [thresholds](thresholds.md)
- [answer-engines/citeable-patterns](../answer-engines/citeable-patterns.md)
- [answer-engines/ai-crawlers](../answer-engines/ai-crawlers.md)
- [rich-results-eligibility-2026](../structured-data/rich-results-eligibility-2026.md)

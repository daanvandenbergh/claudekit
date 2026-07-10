---
updated: 2026-07-09
source: https://developers.google.com/search/docs/fundamentals/creating-helpful-content (accessed 2026-07-09)
type: fact
tags: [content-eeat, freshness, author, byline, credentials, ymyl]
---

# Freshness and authorship — genuine updates and real author identity, not date/byline theater

Content freshness helps only for recency-sensitive queries and only when the content actually changed; author bylines and credentials are E-E-A-T evidence for raters (heavily weighted on YMYL), not standalone ranking levers — and faking either backfires.

## Facts
- Freshness is query-dependent: it matters for recency-sensitive topics (news, "best X 2026", changing facts) and little for evergreen ones. A genuine, substantive update can help; a bumped date with no real change does not — and Google reduces trust/demotes for recency-sensitive queries when dates are manipulated. [Google helpful-content; corroborating: Search Engine Land byline-dates guide] (confidence: medium)
- Never bump `dateModified` or a visible "updated" date without a real edit — this is the deceptive-freshness anti-pattern in foundations/2026-seo-myths; keep the on-page visible date and schema `dateModified` in sync and truthful. On-page visible date tends to matter more than schema-only dates. [foundations/2026-seo-myths; secondary]
- **Author byline/credentials** are E-E-A-T evidence: a byline linking to real author background, expertise and (for YMYL) credentials strengthens the rater-visible Trust/Expertise of a page. On competitive/YMYL queries, clear author attribution is effectively table-stakes. [Google helpful-content; QRG-2025-09]
- But a byline is **not a mechanical ranking factor** — Google has said there is no ranking bonus just for adding an author box; it works via the E-E-A-T signals raters validate, so fabricated authors/credentials are worse than none (a Trust risk). [Google reps; QRG-2025-09] (confidence: low — "no direct bonus" is Google-stated but not in a single canonical doc; treat direction as solid, magnitude as unknown)
- Author *identity/schema* (`sameAs`, Person schema, entity consistency) is deferred → answer-engines/entity-signals; AI-citeable content structure → answer-engines/citeable-patterns; title/desc → titles-descriptions.
- Reject word-count minimums and keyword density as freshness/quality proxies — myths, see foundations/2026-seo-myths.

## Related
- [eeat-framework](../content-eeat/eeat-framework.md)
- [helpful-people-first-content](../content-eeat/helpful-people-first-content.md)
- [scaled-content-site-reputation-spam](../content-eeat/scaled-content-site-reputation-spam.md)

---
updated: 2026-07-09
source: https://developers.google.com/search/docs/appearance/structured-data/search-gallery (accessed 2026-07-09)
type: fact
tags: [structured-data, rich-results, eligibility, faq, howto, deprecation]
---

# Rich-result eligibility 2026 — what Google still shows and what it removed

In 2026 emit only structured data for types Google still renders; FAQ and HowTo no longer produce rich results and several 2025 types are gone.

## Facts
- Still eligible (feature guides live in Google's structured-data gallery, 2026): Article, Breadcrumb, Carousel, Course info, Dataset, Discussion forum, Education Q&A, Employer aggregate rating, Event, Image metadata, Job posting, Local business, Math solver, Movie, Organization, Product (product snippet + merchant listing), Profile page, Q&A, Recipe, Review snippet, Software app, Speakable, Subscription/paywalled content, Vacation rental, Video. [Google Search Central]
- FAQPage rich results were FIRST limited on 2023-09-14 to well-known authoritative government and health websites, then FULLY removed from Google Search on 2026-05-07 (doc deprecation notice added 2026-05-08; feature, Search Console report, and Rich Results Test support removed 2026-06-15; Search Console API removal Aug 2026). FAQPage is still a valid Schema.org type with semantic/AI value, but its absence is no longer a lost rich result and its presence must NOT be promised as one. [Google Search Central — faqpage doc]
- HowTo rich results were deprecated on desktop 2023-09 and no longer appear on ANY device; the How-to documentation was removed from Search Central. Do not promise a HowTo rich result. [Google Search Central]
- June 2025 removals — seven types no longer produce any search appearance: Book actions, Course info/Learning video (learning-video), Claim review (fact check), Estimated salary, Special announcement, Vehicle listing. [Google Search Central changelog, 2025-06]
- ROT-PRONE: rich-result eligibility changes on Google's schedule; treat this list as a 2026-07-09 snapshot and re-verify a specific type against its Google feature guide before flagging its absence as a defect.

## Related
- [structured-data-visible-content-policy](../structured-data/structured-data-visible-content-policy.md)
- [article-schema-recipe](../structured-data/article-schema-recipe.md)

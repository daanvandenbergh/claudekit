---
updated: 2026-07-09
source: https://developers.google.com/search/docs/appearance/structured-data/article (accessed 2026-07-09)
type: procedure
tags: [structured-data, article, newsarticle, blogposting, recipe]
---

# Article / NewsArticle / BlogPosting JSON-LD recipe

Article markup has no required properties; add headline, image, datePublished, dateModified and author to maximize the article rich result.

## Steps
1. Supported @type values: Article, NewsArticle, BlogPosting. There are NO required properties — "add the properties that apply to your content." [Google Article doc]
2. Recommended: author (Person or Organization, with author.name and author.url; list every visible author, each in its own author field), headline (title; long titles may truncate), datePublished and dateModified (ISO 8601, include timezone), image (ImageObject or URL, repeatable; supply high-res 16x9 / 4x3 / 1x1, min 50K pixels). [Google Article doc]
3. Author-identity sameAs / entity signals are covered separately — DEFER to answer-engines/entity-signals; do not duplicate here.

## Related
- [structured-data-visible-content-policy](../structured-data/structured-data-visible-content-policy.md)
- [breadcrumb-organization-schema-recipe](../structured-data/breadcrumb-organization-schema-recipe.md)

---
updated: 2026-07-09
source: https://developers.google.com/search/docs/appearance/structured-data/breadcrumb (accessed 2026-07-09)
type: procedure
tags: [structured-data, breadcrumb, breadcrumblist, organization, logo, knowledge-panel]
---

# BreadcrumbList and Organization JSON-LD recipes

BreadcrumbList needs an ordered itemListElement of ListItems (position, name, item); Organization has no required props but should carry name, url and logo to feed the logo and knowledge panel.

## Steps
1. BreadcrumbList (@type BreadcrumbList): required itemListElement is an ordered array of ListItem; each ListItem needs position (1 = start), name, and item (page URL) — item is optional on the final breadcrumb. Reflect user navigation, not URL structure; omit the domain and the current page. [Google breadcrumb doc]
2. Organization (@type Organization, or subtypes OnlineStore / LocalBusiness): NO required properties. Recommended core: name, url, logo (min 112x112 px). Also recommended: address, telephone, email, contactPoint, description, sameAs, legalName, foundingDate, vatID/taxID. [Google Organization doc]
3. Organization markup on the home page influences which logo shows in Search and the knowledge panel, and feeds merchant/brand knowledge panels. [Google Organization doc]
4. Organization sameAs / entity-identity is covered separately — DEFER to answer-engines/entity-signals; do not duplicate the sameAs entity-signal treatment here.

## Related
- [article-schema-recipe](../structured-data/article-schema-recipe.md)
- [entity-signals](../answer-engines/entity-signals.md)

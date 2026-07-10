---
updated: 2026-07-09
source: https://developers.google.com/search/docs/specialty/ecommerce/pagination-and-incremental-page-loading (accessed 2026-07-09)
type: fact
tags: [architecture, pagination, crawlability, infinite-scroll]
---

# Pagination for SEO — rel=next/prev is dead, use crawlable sequential links

Google stopped using `rel="next"/"prev"` as an indexing signal (announced 2019); paginate instead with crawlable `<a href>` links between pages, a unique self-canonical per page, and real URLs for any load-more/infinite scroll.

## Facts
- "Google no longer uses these tags [rel=next/rel=prev], although these links may still be used by other search engines." Google confirmed it had not used rel=next/prev for years (public confirmation March 2019). [google-pagination]
- Replace it with crawlable links: "include links from each page to the following page using `<a href>` tags"; also "consider linking from all individual pages in a collection back to the first page." [google-pagination]
- Give each paginated page a UNIQUE URL (e.g. `?page=n`) and its own self-referencing canonical. "Don't use the first page of a paginated sequence as the canonical page." [google-pagination]
- Never encode page numbers in a URL fragment: "Google ignores fragment identifiers" — a next-page link that differs only after `#` may not be followed. [google-pagination]
- Load-more / infinite scroll are usually JS; they only work for SEO if each chunk has a real crawlable URL (paginated component behind the scroll). Also expose deep items via sitemap/product feed as a backstop. [google-pagination]

## Related
- [internal-linking](../architecture/internal-linking.md)
- [site-structure-depth](../architecture/site-structure-depth.md)

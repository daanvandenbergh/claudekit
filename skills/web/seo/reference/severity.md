<!-- Verified: 2026-07-09 -->

# SEO severity model

Two independent axes. **Severity** = how much the problem hurts search performance. **Fix tier** =
how dangerous the *fix* is. They are **decoupled**: a Critical de-index leak is fixed with a gated
Tier-C change, while a Low missing `viewport` is fixed with an automatic Tier-A change. Never let a
high severity pull a dangerous fix into auto-apply — that inversion is exactly how a "fix everything"
tool de-indexes a site.

## Severity floors

| Severity | Meaning | Examples |
|----------|---------|----------|
| **Critical** | The site (or a section) can vanish from the index or be penalized. | Leaked sitewide `noindex`; `robots.txt` `Disallow: /` on a live site; canonical pointing the whole site off-page; a wrong base-URL rewriting every canonical; fabricated review/rating schema (spam manual action); broken HTTPS canonicalization. |
| **High** | Ranking/eligibility loss on important pages, or a template-level defect hitting many pages. | Missing/duplicate `<title>` from a template; sitewide missing meta descriptions; broken canonical on key pages; non-reciprocal `hreflang`; redirect chains/loops on nav pages; CSR-only indexable content; schema that contradicts visible content; no `viewport`; 4xx in navigation. |
| **Medium** | Bounded or single-page correctness/quality loss. | Title/description length issues; missing OG/Twitter tags; thin/duplicate H1; missing alt on contentful images; missing image dimensions (CLS); non-descriptive anchors; failing Core Web Vitals; soft-404s. |
| **Low** | Polish; small or low-probability. | Decorative `alt=""`; below-fold lazy-loading; missing `srcset`; web-manifest/favicon; a trailing-slash inconsistency that still resolves. |
| **Info** | Observation, accepted trade-off, or a "verify this" item. | Every Tier-B generated value and every emitted `[[NEEDS: ...]]` placeholder; a deliberate `noindex` confirmed as intentional; a myth that was checked and correctly not flagged. |

## Do not downgrade the de-index class

Anything that can remove pages from the index — canonical, `robots.txt`, `noindex`, redirects,
`hreflang`, host/scheme consolidation, sitemap steering — is **Critical or High by default**, and its
fix is **always Tier C** (confirmed, never silent), regardless of how "defensive" the current config
looks. This is the SEO analog of `/audit`'s rule that money/auth/data-integrity bugs are never
softened to Medium out of habit.

## Verdict

The audit's verdict is the **worst unfixed severity**. Any unfixed Critical or High = **do not ship**.
State it in one line. A pass is clean only with zero unfixed Critical/High/Medium and no new Low.

# NOTICE - provenance and attribution

`policy-writer` bundles content from five source skills so it is fully standalone. This file
maps every bundled file to its origin and license. AGPL-3.0 and Apache-2.0 content is kept
in separate files, never blended. Full license texts are in `licenses/`.

If this skill is ever published, redistributed, or served over a network, AGPL-3.0 source
obligations attach to the AGPL-derived files below - review before distributing.

## Origins

| Origin skill | Author | License | Notes |
|---|---|---|---|
| privacy-policy-stephane-boghossian | Stephane Boghossian | AGPL-3.0 (no LICENSE file shipped in the local copy; upstream documents AGPL - treated as AGPL to be safe) | Version 2026-06-30 |
| compliance-anthropic | Anthropic | Apache-2.0 | Version 2026.01.30 |
| cookie-policy-malik-taiar | Malik Taiar | AGPL-3.0 | Version 2025.12.24 |
| privacy-policy-malik-taiar | Malik Taiar | AGPL-3.0 | Version 2025.12.24 |
| data-privacy-compliance | unknown | none declared | Unversioned, unsourced - see flag below |

## File map

| File in this skill | Source | License |
|---|---|---|
| `references/intake-questionnaire.md` | privacy-policy-stephane-boghossian/references/ (verbatim) | AGPL-3.0 |
| `references/jurisdictions-eu-uk.md` | same (verbatim) | AGPL-3.0 |
| `references/jurisdictions-us.md` | same (verbatim) | AGPL-3.0 |
| `references/jurisdictions-global-mena.md` | same (verbatim) | AGPL-3.0 |
| `references/platform-cookies-ai.md` | same (verbatim) | AGPL-3.0 |
| `references/sector-and-special-products.md` | same (verbatim) | AGPL-3.0 |
| `references/structure-clauses-and-craft.md` | same (verbatim) | AGPL-3.0 |
| `references/edge-cases-failure-modes-qa.md` | same (verbatim) | AGPL-3.0 |
| `assets/template-privacy-policy.md` | privacy-policy-stephane-boghossian/assets/ (verbatim) | AGPL-3.0 |
| `references/cookies-cnil.md` | cookie-policy-malik-taiar/references/COOKIES.md (+ English provenance header) | AGPL-3.0 |
| `references/legal-bases-cookies-cnil.md` | cookie-policy-malik-taiar/references/BASES_LEGALES_COOKIES.md (+ header) | AGPL-3.0 |
| `references/data-subject-rights-cnil.md` | cookie-policy-malik-taiar/references/DROITS_PERSONNES.md (+ header; the byte-identical copy in privacy-policy-malik-taiar was deduplicated) | AGPL-3.0 |
| `references/retention-periods-cnil.md` | cookie-policy-malik-taiar/references/DUREES_CONSERVATION.md (+ header; newer than the privacy-skill copy, which was dropped) | AGPL-3.0 |
| `references/legal-bases-gdpr.md` | privacy-policy-malik-taiar/references/BASES_LEGALES.md (+ header) | AGPL-3.0 |
| `assets/template-politique-cookies.docx` | cookie-policy-malik-taiar/assets/sample_template_politique_cookies.docx (PDF render dropped) | AGPL-3.0 |
| `assets/template-politique-confidentialite.docx` | privacy-policy-malik-taiar/assets/sample_template_politique_confidentialite.docx (PDF render dropped) | AGPL-3.0 |
| `assets/sources/CNIL_*.pdf` (9 files) | cookie-policy-malik-taiar/assets/ (byte-identical duplicates in privacy-policy-malik-taiar deduplicated) | Official CNIL documents (French open-reuse regime) |
| `assets/sources/RGPD_texte_officiel.pdf` | cookie-policy-malik-taiar/assets/ | Official EU text (EUR-Lex reuse policy) |
| `references/dpa-review-and-dsr-ops.md` | extracted from compliance-anthropic/SKILL.md (DPA checklist + DSR operations; regulation overviews and regulatory-monitoring sections dropped) | Apache-2.0 |
| `references/implementation-snippets.md` | code patterns extracted from data-privacy-compliance/SKILL.md; ALL legal claims stripped (several were unsourced or wrong) | none declared - provenance unverified; rewrite from scratch before any distribution |
| `licenses/AGPL-3.0.txt` | cookie-policy-malik-taiar/LICENSE.txt | - |
| `licenses/Apache-2.0.txt` | compliance-anthropic/LICENSE.txt | - |

## Authored for this skill (not derived from the five sources)

| File | Origin |
|---|---|
| `SKILL.md`, `policies/*.md`, `assets/memory-store-seed.md`, `NOTICE.md` | Authored 2026-07-05; procedure sections of `policies/privacy-policy.md` and `policies/cookie-policy.md` generalize two project runbooks (`prompts/privacy-policy.md`, `prompts/cookie-policy.md`, same repository, now retired) |
| `references/terms-of-service-standards.md`, `references/dpa-drafting-standards.md`, `references/ai-act-transparency.md`, `references/call-recording-consent-eu.md`, `references/imprint-requirements-eu.md` | Authored 2026-07-05 from live web research; citations inline |
| `assets/sources/*` beyond the CNIL/GDPR set | Official documents fetched 2026-07-05 from the canonical sources named inline where they are cited |

## Dropped during bundling

- `.DS_Store` files (macOS artifacts).
- `privacy-policy-malik-taiar/references/{COOKIES,DROITS_PERSONNES,DUREES_CONSERVATION}.md` - stale or byte-identical duplicates of the cookie skill's copies.
- `privacy-policy-malik-taiar/assets/*.pdf` - byte-identical duplicates.
- The regulation-overview and regulatory-monitoring sections of compliance-anthropic (covered better by the jurisdiction references; currency is handled by this skill's verification process).
- Every legal claim in data-privacy-compliance (unsourced; known errors: "48-hour" CCPA opt-out response, pre-CPRA "Do Not Sell" label, hardcoded penalty figures).

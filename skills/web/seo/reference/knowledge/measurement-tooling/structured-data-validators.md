---
updated: 2026-07-09
source: https://developers.google.com/search/docs/appearance/structured-data (accessed 2026-07-09)
type: reference
tags: [measurement-tooling, structured-data, schema, rich-results, verification]
---

# Structured-data verification — Rich Results Test vs Schema Markup Validator

Use the Rich Results Test to check whether markup is eligible for a Google rich result (Google-supported types only); use the Schema Markup Validator (validator.schema.org) to validate any schema.org markup for generic correctness — they answer different questions and both parse JSON-LD, Microdata, and RDFa.

## Facts
- **Rich Results Test** validates only the schema types Google can turn into rich results (e.g. Article, Product, Breadcrumb, Event, Recipe, Review, Organization, VideoObject, LocalBusiness, SoftwareApplication…) and reports **eligibility** + required/recommended-property warnings. It is the correct tool for "will this get a rich result." [Google structured-data docs]
- **Schema Markup Validator (validator.schema.org)** is Google's successor to the retired Structured Data Testing Tool; it validates **all ~800+ schema.org types** for syntactic/vocabulary correctness with **no** Google rich-result opinion. Use it for generic schema validity or non-rich-result types. [Google structured-data docs]
- Both accept **JSON-LD, Microdata, and RDFa**; JSON-LD is the recommended format. Verify workflow: parse + required-props in-repo (feeds the verdict), then Rich Results Test for eligibility, Schema Markup Validator for generic validity.
- The exact set of Google-eligible rich-result types drifts over time — treat any hardcoded type list as rot-prone; re-check the structured-data docs each research run.

## Related
- structured-data
- [gsc-verify-reports](../measurement-tooling/gsc-verify-reports.md)
- [2026-seo-myths](../foundations/2026-seo-myths.md)

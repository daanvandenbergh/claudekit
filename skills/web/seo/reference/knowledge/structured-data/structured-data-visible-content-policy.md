---
updated: 2026-07-09
source: https://developers.google.com/search/docs/appearance/structured-data/sd-policies (accessed 2026-07-09)
type: fact
tags: [structured-data, policy, spam, manual-action, json-ld, validation, visible-content]
---

# Structured-data policy — visible-content match, JSON-LD preferred, validation

Structured data must describe content visible on the page; mismatched or hidden-content markup is a spam violation that can trigger a manual action removing rich-result eligibility.

## Facts
- "Don't mark up content that is not visible to readers of the page" — if the JSON-LD names a performer, the HTML body must describe that same performer; content hidden from the user is a common reason a rich result won't show. [Google sd-policies]
- Violation is a spam-policy matter — "Don't use structured data to deceive or mislead users" (impersonation, misrepresenting ownership/affiliation, irrelevant or misleading content such as fake reviews all prohibited). Ratings/reviews not by actual users may result in a manual action. [Google sd-policies]
- Enforcement: "A structured data manual action means that a page loses eligibility for appearance as a rich result; it doesn't affect how the page ranks in Google web search." Syntactically valid markup that violates a quality guideline is simply not displayed. [Google sd-policies]
- JSON-LD is Google's recommended format (marked "Recommended"): "Google recommends using JSON-LD for structured data if your site's setup allows it, as it's the easiest solution to implement and maintain at scale." Microdata and RDFa are supported but not preferred. [Google intro-structured-data]
- Validate with TWO tools — Google Rich Results Test (https://search.google.com/test/rich-results) checks Google-rich-result eligibility; the Schema Markup Validator (https://validator.schema.org) checks generic Schema.org syntax not tied to Google features. Note the Rich Results Test dropped FAQ support in June 2026.

## Related
- [rich-results-eligibility-2026](../structured-data/rich-results-eligibility-2026.md)
- [entity-signals](../answer-engines/entity-signals.md)

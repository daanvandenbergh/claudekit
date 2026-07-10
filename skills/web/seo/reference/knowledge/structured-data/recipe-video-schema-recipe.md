---
updated: 2026-07-09
source: https://developers.google.com/search/docs/appearance/structured-data/recipe (accessed 2026-07-09)
type: procedure
tags: [structured-data, recipe, videoobject, video, carousel, key-moments]
---

# Recipe and VideoObject JSON-LD recipes

Recipe requires only name and image (add ingredients, instructions, ratings, times, video for full results); VideoObject requires name, description, thumbnailUrl and uploadDate.

## Steps
1. Recipe required: name and image (image of the finished dish; crawlable, 50K+ px, aspect ratios 16x9 / 4x3 / 1x1). Recommended: recipeIngredient, recipeInstructions (HowToStep/HowToSection/text), author, datePublished, recipeYield (required if nutrition included), nutrition.calories, aggregateRating, video, prepTime/cookTime/totalTime (ISO 8601). [Google Recipe doc]
2. Recipe host carousel needs a separate ItemList structured data on a summary page listing the collection's recipes. [Google Recipe doc]
3. VideoObject required: name (unique per video), description, thumbnailUrl, uploadDate (ISO 8601). Recommended: contentUrl (preferred fetch source) or embedUrl, duration, expires. [Google Video doc — description is a Google-required VideoObject property]
4. VideoObject enhancements: key moments via hasPart -> Clip (startOffset/endOffset + name), and a LIVE badge via publication -> BroadcastEvent (isLiveBroadcast, startDate, endDate). [Google Video doc]

## Related
- [event-schema-recipe](../structured-data/event-schema-recipe.md)
- [rich-results-eligibility-2026](../structured-data/rich-results-eligibility-2026.md)

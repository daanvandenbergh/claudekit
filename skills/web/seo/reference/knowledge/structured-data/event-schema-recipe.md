---
updated: 2026-07-09
source: https://developers.google.com/search/docs/appearance/structured-data/event (accessed 2026-07-09)
type: procedure
tags: [structured-data, event, offers, performer, eventstatus]
---

# Event JSON-LD recipe

Event markup requires name, startDate, and location with a postal address; add offers, performer, organizer, endDate and eventStatus for a complete event rich result.

## Steps
1. Event required: name, startDate (ISO 8601 DateTime), location (Place) and location.address (PostalAddress). [Google Event doc]
2. Event recommended: description, endDate, eventStatus (EventScheduled / EventCancelled / EventRescheduled / EventPostponed), image, location.name, offers (price, priceCurrency, availability, url), organizer, performer, previousStartDate (for reschedules). [Google Event doc]
3. Google's Event doc explicitly does NOT support eventAttendanceMode / VirtualLocation: "Virtual experiences that have no real-world component aren't supported. Events must take place in a physical location." Every Event needs a real-world location + address; do not rely on eventAttendanceMode/VirtualLocation alone to make a purely virtual event eligible. [Google Event doc, accessed 2026-07-09]

## Related
- [structured-data-visible-content-policy](../structured-data/structured-data-visible-content-policy.md)
- [recipe-video-schema-recipe](../structured-data/recipe-video-schema-recipe.md)

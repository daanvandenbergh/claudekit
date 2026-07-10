---
updated: 2026-07-09
source: https://developers.facebook.com/docs/sharing/webmasters/ ; https://docs.joinmastodon.org/entities/PreviewCard/ ; https://ogp.me/ (accessed 2026-07-09)
type: reference
tags: [social, previews, caching, unfurl, debuggers]
confidence: low
---

# How platforms fetch and cache link previews (and how to bust the cache)

Each platform's bot GETs the URL at share time, reads OG/Twitter tags server-side (no JS execution), and caches by URL — so changing tags needs a cache-bust via the platform's debugger.

## Facts
- Unfurl bots fetch server-rendered HTML and do NOT run JS; OG/Twitter tags must be in the static <head>. [defer: rendering]
- Bot user-agents to allow/detect: facebookexternalhit, Twitterbot, Slackbot-LinkExpanding, Discordbot, LinkedInBot, WhatsApp. [vendor]
- Bluesky and Mastodon are OG-only, no platform-specific meta tags — both generate preview cards purely from standard og:title/og:description/og:image; Bluesky composes at 1.91:1 and IGNORES og:image:width/og:image:height (image is downloaded and cropped regardless), so don't rely on those hints for Bluesky sizing. [vendor]
- Facebook caches by URL and "won't be updated unless the URL changes"; force a re-scrape with the Sharing Debugger. [fb-wm]
- LinkedIn caches previews aggressively (~7 days); force a re-fetch with the LinkedIn Post Inspector. [vendor]
- X caches card images; refresh via the X/Twitter Card Validator. [vendor]
- iMessage has NO cache-clearing mechanism — recipients keep whatever was cached at first share; only a new URL updates it. [vendor]
- Cache-bust trick when no debugger helps: append a query string (?v=2) to the image or page URL to make it a "new" URL. [vendor]

## Related
- [open-graph](../social/open-graph.md)
- [twitter-cards](../social/twitter-cards.md)
- [og-image-specs](../social/og-image-specs.md)

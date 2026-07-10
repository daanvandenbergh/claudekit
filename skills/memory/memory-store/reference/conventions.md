# Store conventions

The exact shape of a memory store: layout, memory kinds, filenames, frontmatter, the index, the
per-kind note body, and links. These are the conventions `--store` writes to and `--optimize`
enforces. They are deliberately minimal - every field and folder here earns a grep or a read;
anything that does not was cut on purpose (see the "rejected as ceremony" note at the end).

## Memory kinds

A memory store mixes content types, and the kind changes how an entry is written and trusted. Tag
each entry with a one-word `type`; keep the vocabulary small:

| `type` | What it holds | Provenance | Body shape |
|---|---|---|---|
| `fact` / `reference` | A learned, durable fact about the world, a system, or an API | An external source (URL/doc/code) | BLUF + `## Facts` |
| `preference` | A user preference or working convention ("prefer X over Y") | The user / a conversation | BLUF + **Why** + **How to apply** |
| `decision` | A choice made and why, so it is not re-litigated | The decision + date | BLUF + **Why** + **How to apply** |
| `project` | An ongoing goal, constraint, or standing context not derivable from the code | A conversation / plan | BLUF + **Why** + **How to apply** |
| `procedure` | A reusable how-to / runbook | Wherever it was learned | BLUF + numbered steps |
| `event` | A consequential thing that happened + the lesson | The event + date | BLUF + what happened + lesson |

The kind is a **frontmatter facet, not a folder** - organize files by domain (below) and let `type`
be grep-able (`grep -rl 'type: decision' <store>`). Mixing a domain axis and a kind axis in the
directory tree breeds "which folder does this go in?" indecision, which breeds duplicates.

## Directory layout

```
<store-root>/
  INDEX.md                        # mandatory - the map, read first on every run
  <domain>/<concept-slug>.md      # canonical atomic entries, tree depth <= 2
  _sources/YYYY-MM-DD-<slug>.md   # OPTIONAL - verbatim raw, only when irreplaceable/load-bearing
```

- **One concept per entry.** Not one entry per source, per session, or per date - that fragments
  the same idea across near-duplicates. If an entry starts covering two things, split it.
- **Shallow tree, depth <= 2.** Folders name a **domain** (`auth/`, `deploy/`, `preferences/`),
  never a container type (`notes/`, `misc/`, `stuff/`). A flat root is fine for a small store. Grep
  reads every file regardless of depth, so deep nesting buys nothing and forces a false "single
  home" that breeds duplicates.
- **One home per concept, many inbound links.** Express cross-topic membership with links and the
  index listing - never by copying a file into two folders.
- **`_sources/` is the only non-canonical area,** and it is optional. The leading underscore sorts
  it out of the trusted tree and signals "raw, not distilled." A raw file's first line points to
  the distilled entry it backs. Retired entries do **not** get an `_archive/` dir - git history is
  the archive.

## Filenames (the primary key)

The filename is a **kebab-case slug of the concept name**, and it is how the entry is referenced:
`rate-limiting-token-bucket.md`, `prefers-tabs-over-spaces.md`, `chose-postgres-over-mongo.md`.

Keep it simple: lowercase ASCII, hyphen-separated, the **most distinctive noun first**. Do not
over-engineer the slug (no forced singularization / stopword-stripping algorithm - two runs would
disagree anyway). The filename is a strong *hint* that helps the same concept collide on the same
path; the real deduper is grep + reading. Dates, origins, and IDs live in frontmatter, **never** in
the filename.

## Frontmatter

Identical shape in every file - grep depends on the literal spelling. Keep it tiny.

**Mandatory:**

```yaml
---
updated: 2026-07-09              # ISO date, lexically sortable. Freshness signal.
source: https://example.com/x    # provenance / origin - see below. Also a cheap dedup key.
type: fact                       # the memory kind (see the table above)
---
```

- `updated` - bump on a real content change or a re-verification, **never** on cosmetic edits (it
  poisons staleness math) and **never** from filesystem mtime (mtime resets on clone/checkout).
- `source` - the **origin**, broadly: a URL or file path for a `fact`; `conversation with <who>,
  <date>` for a `preference`; `decided <date>` for a `decision`; `observed <date>` for an `event`.
  Every memory has an origin - it is the trust anchor and a dedup probe (grep it before writing).
  Mark `(primary)` inline when origin strength matters for a contested memory.
- `type` - one word from the kinds table. It tells `--optimize` how to treat the entry (never
  stale-flag a settled preference the way you would a fast-moving fact) and tells a reader what body
  shape to expect.

**Optional - add a field only when an agent will grep or read it back:**

```yaml
tags: [auth, security]           # single-line flow list. A facet filter: grep -rl 'tags:.*auth'.
status: superseded               # only on a retired entry; pair with superseded_by:
superseded_by: new-slug          # one-way pointer to the successor (git holds the rest)
confidence: low                  # ONLY on genuinely weak/single-source/inferred memories
```

- `tags` earn their place once a store is big enough that a single grep-by-tag is the fastest way
  to cluster a topic. Draw from the `## Tags` list in `INDEX.md`; a small store does fine without
  tags, leaning on index descriptions and grep.
- `confidence` is noise if everything is `high` - omit it on solid entries rather than inflating.

**Rejected as ceremony (do not add):** `content_hash`, `simhash`, per-section hashes, `word_count`,
`reading_time`, an `importance`/`poignancy` salience score (the drop-list and signal test already do
salience at write time - a stored number nobody reads back), UUIDs, `owner`, `created` (add only if
"old but re-verified" must be told apart from "fresh"), and a bidirectional `supersedes:` back-pointer
(one direction + git is enough). Each is a sync point that drifts or a value nobody reads.

## Note body, by kind

Every entry opens with frontmatter and a **BLUF first line** - the one-sentence memory itself, no
intro paragraph, no "In conclusion" tail. What follows depends on the kind.

**`fact` / `reference`:**

```markdown
---
updated: 2026-07-09
source: https://example.com/rate-limiting
type: fact
tags: [auth]
---

# Token-bucket rate limiting

Token-bucket allows short bursts up to the bucket size; leaky-bucket enforces a strictly smooth rate.

## Facts
- Bucket refills at `rate` tokens/sec, capacity `burst`; a request costs 1 token. [source]
- At capacity, `burst` requests can fire back-to-back, then throttle to `rate`. [source]

## Related
- [sliding-window-rate-limiting](sliding-window-rate-limiting.md)
```

**`preference` / `decision` / `project`** - carry the rationale and the actionable instruction, so
a future agent both trusts it and knows what to *do*:

```markdown
---
updated: 2026-07-09
source: conversation with user, 2026-07-09
type: decision
tags: [database]
---

# Chose Postgres over Mongo for the primary store

**Why:** Relational integrity and transactions matter for billing; the team already runs Postgres.
**How to apply:** New persistence goes in Postgres; propose Mongo only for a genuine document/log
use case, with rationale.
```

**`procedure`** - BLUF + numbered steps. **`event`** - BLUF + what happened + the durable lesson.

- **`## Detail`** (optional, any kind) - non-obvious evidence; exact quotes in blockquotes with
  attribution. Agent inference stays in plain prose tagged `(inferred)`.
- Keep a fixed skeleton only where it helps. A two-line preference does not need every heading -
  BLUF + **Why** + **How to apply** is a complete entry.

## Links and keywords

- **One link syntax store-wide.** Prefer relative Markdown `[text](../dir/slug.md)` - `Read`
  resolves it. Use bare `[[wikilinks]]` only if every slug in the store is globally unique.
- **Keyword line (optional, high value for synonyms).** When an entry has synonyms a searcher would
  grep instead of the title, add one line near the top so grep still lands it:
  `<!-- keywords: throttling, rate limit, 429 -->`. This is the embedding-free synonym bridge -
  cheaper than a mandatory `aliases:` field, and it lives where the words are.

## INDEX.md

The single navigation + dedup + governance artifact; every agent's first read. `--store` updates
the relevant row in the same edit as the entry; `--optimize` regenerates the entry list from the
tree so it cannot drift.

```markdown
# <store name>
> One line: what this memory store covers and who reads it.

## How to use
Read this index -> map your query to a topic/tag -> grep the topic + likely synonyms ->
read the top 1-3 hits -> check `updated`/`status` before trusting the memory.

## Tags            <!-- optional; omit for a small store -->
- auth - authentication/authorization flows (synonyms: authn, authz, login)

## auth
- [rate-limiting-token-bucket](auth/rate-limiting-token-bucket.md) - token-bucket vs leaky-bucket
  tradeoffs, when to pick each · fact · updated: 2026-07-09

## decisions
- [chose-postgres-over-mongo](decisions/chose-postgres-over-mongo.md) - primary store is Postgres;
  Mongo only for genuine document use · decision · updated: 2026-07-09
```

- **Entry descriptions must be specific** - "token-bucket vs leaky-bucket tradeoffs", not "notes on
  rate limiting". The description is both the routing signal for a searcher and the near-duplicate
  radar when filing something new. Including the `type` in the one-liner is a cheap, useful facet.
- **One index only.** No parallel machine manifest/TSV - `INDEX.md` is already grep-able, and a
  second artifact just drifts.
- **Cap ~150-200 lines.** When it overflows, split into per-directory `_index.md` files the root
  links to - do not let the root become a wall.

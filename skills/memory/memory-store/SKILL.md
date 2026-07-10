---
name: memory-store
description: Persist an agent's memory into a chosen directory as a clean, de-duplicated, agent-readable Markdown store, and keep it organized over time. Memory here is any durable thing worth remembering across sessions - a learned fact, a user preference or working convention, a decision and its rationale, an ongoing project goal or constraint, a reusable procedure, or a consequential event. Two modes. --store files new memory (raw text or a file path) into the store - distilling it to atomic entries, classifying each by kind, grepping for existing coverage BEFORE writing, and refining/merging/superseding in place instead of adding a duplicate. --optimize reviews the whole store - rebuilding the index, merging duplicates, pruning slop and superseded entries, and flagging stale ones. Use when the user wants to remember, save, store, persist, capture, or file a fact, finding, preference, decision, convention, or lesson into a directory; build or maintain a long-term / agent memory store; or dedupe, consolidate, clean up, organize, compact, or de-bloat a memory/notes folder so it does not fill with duplicate or low-signal content (e.g. /memory-store --store ./memory <text|file>, /memory-store --optimize ./memory, or bare /memory-store ./memory to optimize). Project-agnostic - plain Markdown, filesystem + grep only, no vector DB, no build step. This is a portable, directory-based memory store the user invokes explicitly; it is not the Claude Code built-in memory.
user-invokable: true
argument-hint: "--store <memory-dir> <text|file> [--keep-raw] | [--optimize] <memory-dir>"
---

# memory-store

A memory store is a **concept-keyed, grep-navigable Markdown corpus whose only index is the
filesystem.** There are no embeddings and no database - the retrieval engine is a future agent
running `grep` and then *reading*. Every rule in this skill bends toward one consequence of that
fact: **the same idea must always map to the same file, so a second write for it lands on the
existing entry and refines it instead of forking a duplicate.** Dedup is therefore a *filing
decision made before the write* - grep for the concept, read what already exists, then refine,
merge, or supersede in place - not a cleanup chore done later.

Two more disciplines follow from the same root. **Nothing enters raw:** `--store` distils input to
atomic, self-contained memories and refuses the filler, so extraction *is* the anti-slop filter.
And **nothing is destroyed blindly:** an overturned memory is superseded, never silently deleted,
and the store rides on version control so every edit, merge, and prune is reversible. Get those
three right - one concept per file, grep-before-write, distil-and-supersede - and the store stays
small, trustworthy, and easy for the next session to read.

**Memory comes in kinds, and the kind matters.** Unlike a store of one homogeneous content type,
a memory store mixes a learned **fact**, a user **preference**/working convention, a **decision**
and its rationale, an ongoing **project** goal or constraint, a reusable **procedure**, and a
consequential **event**. The kind changes how an entry is written (a preference needs a *why* and a
*how-to-apply*; a fact needs a source), how it is trusted, and how `--optimize` treats it. So each
entry carries a one-word `type`, and its body follows the shape for that kind (see
`reference/conventions.md`). This is the one real addition over a plain single-topic store - keep
it lean: one word, not a taxonomy.

**The honest ceiling, stated once:** grep + read is a *heuristic* deduper, not a guarantee. Two
entries that state the same thing in disjoint words (no shared identifier, name, or origin) can
evade both `--store` and `--optimize`. The conventions below (one canonical home per concept, a
keyword line, a curated index) push that failure rate down; they do not zero it. Never describe
this store as having "guaranteed" dedup - it has *disciplined* dedup.

## Inputs and dispatch

Everything after `/memory-store` is one raw string. Parse it in prose:

1. **Mode** - `--store` selects store mode; its **absence selects optimize** (the `--optimize`
   flag is accepted but optional, so a bare `/memory-store <dir>` optimizes). These are the only
   two modes.
2. **Store directory** (positional, required) - the first non-flag token is the path to the memory
   folder (e.g. `./memory`, `claude/memory`). Resolve it to an absolute path. In optimize mode it
   may point at a subdirectory to scope the pass to that subtree.
3. **`--keep-raw`** (optional, `--store` only) - force-stash the verbatim input in `_sources/`
   even if it looks reconstructable. Use when the exact bytes are the memory.
4. **Payload** (`--store` only) - everything after the directory token except any recognized flag
   (e.g. `--keep-raw`, wherever it appears). If it is a path to an existing file, read that file;
   otherwise treat it as literal text. A directory or a very large
   file is read in sections, not assumed to fit in one read.

### Prepare the store (both modes, before any work)

- **Bootstrap.** If the store directory does not exist, create it. If it has no `INDEX.md`, this is a fresh
  store: create `INDEX.md` from the template in `reference/conventions.md` before filing anything.
  `--optimize` on an empty or index-less store just builds the index and stops.
- **Version-control safety (the primary undo).** Determine the store's git status:
  - **Store is its own git repo** (a `.git` at or above the store dir, and the store is the repo's
    reason to exist) - commit the store path *before* starting and *after* finishing each run
    (`git -C <store> add -A && git -C <store> commit -m "memory-store: <mode> ..."`). This is what
    makes every edit, merge, and prune reversible; report the post-run `git diff --stat`.
  - **Store is a subdirectory of a larger repo you do not own** - do **not** auto-commit that repo
    (surprise commits in someone's project are a side effect they did not ask for). Note that the
    store is under version control so changes are recoverable via the repo's history, and let the
    user commit as usual.
  - **Store is not under version control** - warn once that edits, merges, and prunes are
    **irreversible** here, and offer to `git init` the store dir. Proceed only with that caveat;
    be correspondingly more conservative (prefer supersede over delete everywhere).
- **Read `INDEX.md` first.** It is the map, the tag vocabulary (if any), and the retrieval
  protocol. Never touch the store without reading it.

Full file/frontmatter/index/body spec, the memory kinds, and the templates:
**`reference/conventions.md`** (read on first run). What to keep and what to cut:
**`reference/anti-slop.md`**.

---

## `--store` workflow

Ordered and non-skippable. The heart is steps 2-6: distil, classify the kind, grep before writing,
read the hits, route each entry.

1. **Read `INDEX.md`** - the topic map, any tag vocabulary, the conventions.
2. **Extract atomic memories (this is the anti-slop filter).** Rewrite the input as self-contained,
   present-tense, pronoun-resolved entries - one durable thing worth remembering each. Discard
   everything that fails the drop-list and the signal test in `reference/anti-slop.md`
   (conversational filler, the agent's own reasoning trace, ephemeral session state, anything
   already derivable from the codebase / git history / project docs, things the model already
   reliably knows, unsourced speculation, transient TODOs). Typically most of a raw dump does not
   survive - that is the point. **Never store the raw dump as an entry.** Keep the origin of every
   surviving memory.
3. **Classify each memory's kind** - `fact` (or `reference`), `preference` (working convention),
   `decision`, `project` (ongoing goal/constraint), `procedure`, or `event`. The kind sets the body
   shape and the provenance expectations (a fact needs a source; a preference/decision needs a
   *why* and a *how-to-apply*). Kinds are a frontmatter facet, not folders - see
   `reference/conventions.md`.
4. **Normalize + fingerprint each memory.** Canonical entity names, one spelling per term, explicit
   units. Pull out 2-5 *distinctive* tokens: rare identifiers, proper nouns, error codes, exact
   phrases - the words a future agent would grep for. These drive the search, not the prose.
5. **Grep before you write - cheap to expensive, stop at the first decisive hit:**
   - (a) `grep -rl "<origin-host/path/who>" <store>` - catches a re-store of the same origin.
   - (b) `find <store> -name '*<concept>*.md'` - catches an existing canonical home by name (any
     depth, shell-independent; `ls <store>/**` misses the flat root under bash without `globstar`).
   - (c) `grep -rilE "<distinctive-token-1>|<token-2>|\"exact phrase\"" <store>` - catches the
     concept under a different filename; also grep any obvious synonyms.
   - (d) scan the `INDEX.md` one-liners for a semantic home grep cannot phrase.
6. **Read the top 1-3 candidate files in full,** then **route** each memory:

   | Classification | Meaning | Action |
   |---|---|---|
   | **DUPLICATE** | Adds nothing new | No-op. Optionally bump `updated` to reconfirm still-true. |
   | **REFINEMENT** | Same memory, more precise / newer detail | **Edit the existing line in place**, bump `updated`. Never append a second copy of the same fact. |
   | **CONFLICT** | Same subject + predicate, different value | Resolve by **origin strength and the memory's own validity date** (not the entry's last-touched date). Winner replaces the line in place; the loser survives in git history (and, if a whole entry is retired, via `status: superseded` + a `superseded_by:` pointer). **Never hard-delete the old value in `--store`.** |
   | **DISTINCT-NEW** | Related but a separate concept | Write a new atomic entry at its own canonical slug; link it; add its `INDEX.md` row. |

   The reading is the semantic judge that an embedding index would otherwise be - decide on
   *content*, never on a filename or grep-hit count. **Do not skip the read.** Only when steps
   (a)-(d) all return nothing may you treat the memory as new without reading (there is nothing to
   read) - and know a disjoint-vocabulary duplicate can slip through here; that is the stated
   ceiling, not a bug to over-correct. Before calling anything a CONFLICT, apply the time check:
   *different point in time -> keep both, each dated* (an "as of 2024" fact and an "as of 2026"
   fact are two time-scoped memories, not a contradiction).
7. **Write the entry** in the body shape for its kind (from `reference/conventions.md`):
   frontmatter -> one-line BLUF statement -> kind-appropriate section (`## Facts` for knowledge;
   **Why:** + **How to apply:** for a preference/decision/project; what-happened + lesson for an
   event) -> `## Related` links. Stamp/refresh `updated`, keep `source` (the origin), set `type`;
   add a keyword line only if the entry has synonyms a searcher would miss.
8. **Update `INDEX.md` in the same edit as the entry.** An entry whose index row is stale is a
   broken store. Add or refresh the one-liner (specific - name what the entry actually says, not
   "notes on X").
9. **Self-check + commit.** The new/edited entry has frontmatter, appears in `INDEX.md`, and there
   is no second live copy of anything you changed. Then commit (if the store is its own repo).

**Raw preservation.** Default to distil-and-cite: the entry carries its `source`/origin, assumed
reconstructable. Stash the verbatim input in `_sources/YYYY-MM-DD-<slug>.md` when the origin is
**not** reconstructable (a one-off conversation, a transcript, ephemeral tool output), when it is
load-bearing (a spec, an exact quote/number that must survive link rot), or when `--keep-raw` is
set. When in doubt, stash - a memory store's worst loss is the exact detail nobody can recover.
Non-text artifacts (PDFs, images, CSVs) go in `_sources/` too; the distilled entry links to them.

---

## `--optimize` workflow

**Conservative, idempotent memory consolidation.** The governing rule: running `--optimize` on an
already-clean store must be a near-no-op. It merges *clear* duplicates and fixes *structural*
problems; it does **not** re-summarize already-distilled entries (repeated LLM re-consolidation
measurably degrades a memory store - each pass can drop a qualifier). Rewrite prose only on entries
that are visibly slop; leave clean entries' wording alone.

Scope to the given path (which may be a subtree). On a large store, work one subtree at a time rather than
loading everything at once. Commit before starting.

1. **Rebuild `INDEX.md` from the tree.** Glob the entries, read each one's frontmatter + BLUF line,
   regenerate the entry table and tag list so the map cannot lie. Flag **orphans** (an entry
   missing from the index) and **danglers** (an index row whose file is gone). Preserve any
   human-written scope note at the top - regenerate the *entry list*, not hand-curated prose.
2. **Normalize.** Fix off-schema or missing frontmatter (including a missing `type`); enforce one
   link syntax; reconcile stray tags back to the vocabulary (if the store uses one).
3. **Fix the link graph.** Grep every link target against actual files (dead links) and every file
   against all link targets (orphans nothing points to).
4. **Merge true duplicates.** Cluster cheaply - shared tags, adjacent slug tokens (`ls | sort`),
   shared proper nouns - then **read each small cluster** and merge only genuine duplicates into
   the better-named canonical entry: union the atomic memories, carry every origin, drop only exact
   restatements. Overwrite the loser with a one-line tombstone redirect (`> merged into
   [slug](path)`), add its name/keywords to the winner, and repoint inbound links. **Merging is the
   one place `--optimize` destroys text - be conservative: if you are unsure two memories are the
   same, keep both.**
5. **Resolve contradictions.** For two entries on the same subject, the stronger origin / more
   recent *validity date* wins; mark the loser `status: superseded` with a pointer to the winner.
   **Keep overturned memories** (with a one-line reason) so a future session does not re-derive
   disproven conclusions or re-litigate a settled decision.
6. **Compress slop.** On entries that are visibly bloated, apply the compression rules in
   `reference/anti-slop.md` by judgment (not blind regex): cut hedges, intros, and restated tails;
   keep every fact, why, and how-to-apply. Do not touch entries that are already tight.
7. **Flag staleness.** Compute `today - updated`; flag old entries whose kind can go stale (facts
   on fast-moving topics; project goals that may be met) with `status: stale` or a banner. **Do not
   mass-delete** durable memories (settled preferences, decisions, lessons) for being old.
8. **Prune - delete-first, but guarded.** Remove superseded, duplicated, and empty-after-slop
   entries - but first confirm the memory survives elsewhere (grep is a weak check: a shared noun
   is not the same *memory* - read to be sure). An entry whose only fault is a dead source URL is
   **kept**, not deleted.
9. **Report, then commit.** Summarize what was merged / superseded / pruned / flagged so the diff
   is reviewable (git is the real veto - `git diff` / `git revert`). Commit if the store is its own
   repo.

---

## Guardrails

- **Version control is the safety net.** With git, every op is reversible and the "report" is a
  real diff. Without it, edits are irreversible - warn, offer `git init`, and prefer supersede over
  delete everywhere.
- **`--store` is additive-safe; deletion lives in `--optimize`.** `--store` refines and supersedes
  in place but never GC-deletes a whole entry. Whole-entry pruning happens only in `--optimize`,
  behind a commit, after confirming the memory survives.
- **Edit-don't-append.** The single worst rot pattern is two live copies of one memory drifting
  apart. On a changed value, edit the line; never append a second live copy. Reserve append for
  genuinely net-new, non-overlapping detail. An entry turning into a dated changelog of dumps is
  the signal to re-distil it into current-state memories.
- **Supersede, never silently delete a memory.** Overturned facts and superseded decisions stay
  (marked, with a reason) so they are not re-derived or re-litigated.
- **Conflicts resolve by origin + validity date, not last-touched.** `updated` is bumped on mere
  re-verification, so it is not authority over which memory is currently true.
- **Provenance is mandatory; inference is labelled.** Every entry keeps its `source`/origin -
  a URL, a file, a conversation, a decision, or an observation. Quoted evidence goes in a
  blockquote with attribution; an agent's own inference is tagged `(inferred)` so a future reader
  never mistakes a guess for an established memory.
- **Do not remember what is already derivable.** Skip anything a future agent recovers for free
  from the codebase, git history, or project docs. If asked to remember such a thing, store only
  what was *non-obvious* about it (the why, the gotcha, the decision) - not the restatement.
- **Resist ceremony (this is deliberately lazy).** No content hashes, no SimHash, no separate
  manifest/TSV, no numeric folder codes, no timestamp IDs, no separate alias/vocab registry files,
  no `_archive/` dir - git history and a single grep-able `INDEX.md` provide all of it for free. The
  `type` facet is one word, not a schema. Add a mechanism only when a concrete, measured pain
  (paraphrase defeating grep across thousands of entries) actually appears. State any simplification
  you rely on plainly.

## Reference

- `reference/conventions.md` - the exact store layout, the memory kinds, the mandatory-vs-optional
  frontmatter set, the slug rule, the `INDEX.md` format, the per-kind note-body templates, and link
  conventions. Read on first run.
- `reference/anti-slop.md` - the drop-list (what never enters), the one-question signal test, the
  compression rules with worked before/after examples, and the slop smell-patterns used as judgment
  aids (not a blind regex pass).

# Anti-slop: what enters, what gets cut

A memory store is only useful while it stays dense. Once low-signal tokens accumulate, a future
agent reading it degrades measurably - "context rot" grows on two axes, the raw length the reader
must wade through and the low-signal noise inside it (noise that resembles the target is the
sharpest driver), so a smaller, denser store beats a large rotting one. The defense runs at two moments: **extraction at
`--store` time** (most slop never enters) and **compression at `--optimize` time** (what leaked in
gets cut). This file is the detail behind those steps.

The core move: **extraction is the filter.** You are not saving the input - you are mining durable
memories out of it and throwing the ore away. Typically the large majority of any raw dump does not
survive, and that is success, not loss.

## The drop-list - refused at the door

Do not store any of these as an entry (they may live in `_sources/` verbatim if the raw is
irreplaceable, but they never become trusted memories):

- **Conversational filler and question-restatement** - "Sure, here's what I found", "As you asked
  about X", "Let me explain".
- **The agent's own chain-of-thought** - "First I'll check... then I'll...". The *conclusion* is
  worth remembering; the reasoning trace is not.
- **Ephemeral session state** - build IDs, timestamps, "I am now running", current working
  directory, transient tool output, in-flight TODOs for *this* task. (Contrast: a durable project
  goal or standing constraint is a legitimate `project` memory - keep that; drop the transient
  step-list.)
- **Anything derivable from the code, git history, or project docs** - the current function
  signature, what a commit changed, a rule already in `CLAUDE.md`. A future agent recovers these for
  free. If asked to remember such a thing, store only what was *non-obvious* about it (the why, the
  gotcha, the decision), not the restatement.
- **Knowledge the model already reliably has** - textbook definitions, language syntax, well-known
  API basics. Store the *project-specific*, the *dated*, the *surprising* instance, not what any
  competent agent already knows.
- **Unsourced speculation presented as fact** - "this might be because...". If it is a hypothesis
  worth keeping, tag it `(inferred)` and say so; do not file it as established memory.
- **Large verbatim code or logs** - unless the exact bytes are load-bearing. Store the *memory*
  ("the retry loop has no cap - see `worker.ts:80`"), not the 200-line paste.

## The one-question signal test

For each memory that survives the drop-list, ask:

> **Would a future agent or session behave better for remembering this, AND is it durable rather
> than ephemeral state that stops mattering when this task ends?**

If either half is "no", drop it. This keeps the durable (a preference, a decision, a hard-won fact,
a lesson) and kills both the trivially-true ("the function returns a value") and the
ephemerally-true ("the test is currently failing", "I'm on step 3").

Note the asymmetry across kinds: a `fact` on a fast-moving topic may go stale and want a date; a
settled `preference` or `decision` is durable by nature; an `event` is a *record* of something that
happened and does not "expire" - it just ages. "Durable" means *worth carrying forward*, not
*eternally current*.

## What a memory is (so you know what not to cut)

A memory worth keeping is durable, actionable content: a fact (a number, path, version, name,
constraint), a **decision + its rationale**, a **preference / working convention + how to apply
it**, a cause->effect, a tradeoff, a gotcha, a reusable procedure, a consequential event + its
lesson, or *the reason an alternative was rejected*. When compressing, these are what you protect -
including the **Why** and **How to apply** lines. Everything else is packaging.

## Compression rules (used at `--optimize`, by judgment)

Apply these to entries that are visibly bloated. **Do not run them on already-tight entries** -
re-compressing clean prose just risks dropping a qualifier, and repeated passes compound the loss.

- **"Delete a sentence - do I lose a memory?"** If deleting it loses no fact, why, or how-to-apply
  (per the definition above), delete it.
- **BLUF.** First line is the memory itself. Cut throat-clearing intros and "In conclusion" tails
  that restate the top.
- **Narrative -> outcome.** Keep the conclusion and *why each alternative failed* (those reasons are
  durable gotchas); drop the first-person "I tried X, then Y, then Z" chronology.
- **Prose -> telegraphic bullets** where it loses nothing: `Retries: 3, backoff 2^n, cap 30s` beats
  a paragraph describing the same.
- **No append-only journals.** The store operation is a reconcile, not a log. An entry that has
  become a dated changelog of dumps is the signal to re-distil it into current-state memories.

## Slop smell-patterns (judgment aids, NOT a blind regex delete)

These words and shapes *often* mark filler. Treat a hit as a prompt to look, not as a
delete-on-sight rule - each can appear in a legitimate memory ("robust to network partitions" is a
real property; "leverage" can be a verb in a real sentence). Read the sentence, keep the memory, cut
the packaging.

- **Hedges / throat-clearing:** "it is important to note", "it's worth noting", "generally
  speaking", "in today's ever-evolving landscape".
- **Marketing adjectives with no fact attached:** "powerful", "seamless", "robust", "cutting-edge",
  "leverage", "game-changing", "best-in-class". If the adjective is not backed by a concrete claim,
  it is noise.
- **Restated-conclusion tails:** "In conclusion", "To summarize", "All in all".
- **Empty transitions:** a sentence that only announces the next sentence.

A store that is BLUF-first, carries each memory's why/how-to-apply, is sourced, and is free of these
is exactly what a future session can read fast and trust - which is the whole point.

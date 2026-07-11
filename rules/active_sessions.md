## Active Sessions (claude/active_sessions.md)
Several agents may work in this repo at once. `claude/active_sessions.md` is the shared
list of what each one is currently doing, so an agent that sees unexpected edits can find
out who is making them. Keep it accurate at all times - a stale entry is worse than none.

**Session id.** The first time you write to the file in a session, generate an id once with
`openssl rand -hex 4` and reuse it for the rest of the session.

**Format.** The file is:

```
# Active Sessions
- <session-id> (updated: <YYYY-MM-DD>): <task-description>
```

Get the date with `date -u +%F` - never guess it.

**Maintain it.**
- When you start working on a prompt, add your line with today's date.
- When you finish that work (before you hand the turn back to the user), remove your line.
  The session staying open does not mean you are still working - only an in-progress task
  belongs in the list.
- On the next prompt in the same session, add your line again with today's date and a task
  description that reflects the new task.
- **Whenever you read or write the file, delete every entry whose date is more than 7 days
  old.** Always - no exceptions, even if the entry is not yours. That session is gone; the
  line is stale.
- If the file or `claude/` does not exist yet, create it.

**Task description.** One line, concrete enough for another agent to tell whether your work
overlaps with theirs: what you are changing and where, e.g.
`- a3f91c2b (updated: 2026-07-11): rewriting the auth middleware in src/server/auth/ and its tests`.
Not `- a3f91c2b (updated: 2026-07-11): fixing a bug`. Do not add status or any other fields.

**Before large or cross-cutting edits**, read the file. If another session lists work that
touches the same area, take that into account or ask the user before proceeding.

## Active Sessions (.agentstore/active_sessions.md)
Several agents may work in this repo at once. This file is the shared list of what each is currently
doing, so an agent that sees unexpected edits can find out who is making them. A stale entry is worse
than none. Create the file (or `.agentstore/`) if it does not exist.

```
# Active Sessions
- <session-id> (updated: <YYYY-MM-DD>): <task-description>
```

**Session id**: generate once per session with `openssl rand -hex 4` and reuse it. **Date**: `date -u
+%F`, never guessed.

- **Add your line when you start working on a prompt; REMOVE it when that work is done**, before you
  hand the turn back. The session staying open does not mean you are still working - only an
  in-progress task belongs in the list. Next prompt, add it again with the new task.
- **Whenever you read or write the file, delete every entry older than 7 days** - always, even if the
  entry is not yours. That session is gone.
- **The task description is one line, concrete enough for another agent to spot an overlap**: what you
  are changing and where. `rewriting the auth middleware in src/server/auth/ and its tests`, not
  `fixing a bug`. No status field, no other fields.
- **Before large or cross-cutting edits, read the file.** If another session lists work in the same
  area, take it into account or ask the user.

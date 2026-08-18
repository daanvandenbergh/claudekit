## Active Sessions (.agentstore/active_sessions/)

Several agents may work in this repo at once. Each session owns **one file** in
`.agentstore/active_sessions/` describing what it is currently doing, so an agent that sees unexpected
edits can find out who is making them. No shared file, so two sessions never clobber each other's
entries. A stale file is worse than none. Create the directory if it does not exist.

**Your file**: `.agentstore/active_sessions/<task-slug>-<id>.txt`, where `<task-slug>` is a few kebab-case
words naming the work (`rewrite-auth-middleware`) and `<id>` comes from `openssl rand -hex 4`, generated
once per session and reused. One line inside:

```
<YYYY-MM-DD> <task-description>
```

**Date**: `date -u +%F`, never guessed.

- **Write your file when you start working on a prompt; `rm` it when that work is done**, before you
  hand the turn back. The session staying open does not mean you are still working - only an
  in-progress task belongs here. Next prompt, write a new file for the new task.
- **Whenever you read or write the directory, delete every file older than 7 days** - always, even if
  the file is not yours. That session is gone.
  `find .agentstore/active_sessions -name '*.txt' -mtime +7 -delete`
- **The task description is one line, concrete enough for another agent to spot an overlap**: what you
  are changing and where. `rewriting the auth middleware in src/server/auth/ and its tests`, not
  `fixing a bug`. No status field, no other fields.
- **Before large or cross-cutting edits, list the directory and read what is there.** If another session
  lists work in the same area, take it into account or ask the user.

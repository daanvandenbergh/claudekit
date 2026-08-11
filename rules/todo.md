## Deferred Work (TODO.md)

**FIX IT NOW. Deferring is a near-last resort, not a planning tool.** When you hit something that
needs doing - a bug, a gap, a wrong comment, a missing test - do it in the current change. The
default is always "fix it in this session". `TODO.md` is where work goes when it *cannot* be done,
not where it goes when it would be inconvenient to do.

### The only two reasons to defer

1. **Blocked on the real world.** It needs an action no agent can perform from this machine: a
   registration, an account, a mailbox, a DNS record, a vendor dashboard setting, a credential only
   the user holds, a purchase, a legal decision. Nothing you can type finishes it.
2. **Genuinely a whole separate project.** Not "large" - *separate*: it needs its own research
   phase, its own design decisions, and a session of its own to do properly. Think a schema
   migration across live data, swapping a vendor, restructuring a subsystem. If you could
   realistically finish and verify it in the current session, it is not this.

That is the whole list. If neither applies, **do the work**.

### Not reasons to defer

Every one of these has been used to file an item that should have been a fix:

- "It touches other files" / "it needs a refactor first" - then touch them, then refactor.
- "It changes a shared module" or "another session may be editing that file" - check
  `.agentstore/active_sessions.md`; if nobody has claimed it, it is yours. A file being important is a
  reason to be careful, not a reason to walk away.
- "It is out of scope of the task I was given" - a bug you *found* while doing the task is in scope.
  Fixing it is the job.
- "It needs a design decision" - make it, and say which one you made and why. If it genuinely needs
  the user, **ask them in your reply** - that is a question, not a `TODO.md` item.
- "I am not sure how the fix should work" - go and read the code until you are.
- "It is a small thing, I will note it for later" - small things are exactly what to fix now.
- "I already wrote a good item for it" - a well-written item is not a substitute for a fix.

**Before you write an item, you must have tried.** Either you attempted the fix and hit a wall you
can name, or you can state concretely why attempting it is impossible. "I decided not to" is not a
reason. If you are writing an item because you would rather not do the work, that is the signal to
do the work.

**A growing `TODO.md` is a failure signal**, not a well-managed backlog. If a session ends with more
items than it started with, the bar was applied too loosely - unless every new item names a
real-world blocker.

### If you do defer

Never silently skip: either fix it, or write the item.

**Real-world gaps count as blocked.** If a change asserts a fact that is not yet true - e.g. the
privacy policy says "trading as SwiftGuard" before that trade name is registered - add the item that
makes it true, unasked.

**Order by what must happen first**, not by when you added it - a prerequisite sits above the work
it unblocks.

**Write each item as a copy-paste-ready prompt.** Assume a fresh session with none of your context:
state what to do, exact files/paths/functions, what is wrong now, what "done" looks like, and the
command or check that verifies it. "Fix the schema" is not enough.

**Delete finished items.** Once verified done, remove the line - do not leave `- [x]` behind. If you
are handed a prompt shaped like `- [ ] ...`, check whether it came from `TODO.md` and remove it there
when done.

**Report every change to the list.** If you touched `TODO.md`, say so in your final message: what you
added and **which of the two reasons above** made it impossible to do now, and what you removed as
done. One line each. Never let the list change silently - the user must be able to see it growing.

### Finish what you start

The point of fixing now is a *finished* fix, not a started one. Whatever you take on, take it all the
way: find the root cause, fix it at the shared chokepoint, leave a test that fails without it, and
verify it the way a user hits it. Half a fix plus a `TODO.md` item is worse than either - it is the
deferral this rule exists to prevent, wearing the costume of work done.

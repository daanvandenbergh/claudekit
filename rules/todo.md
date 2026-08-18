## Deferred Work (TODO.md)

**FIX IT NOW.** A bug, a gap, a wrong comment, a missing test - do it in the current change. `TODO.md`
is where work goes when it *cannot* be done, never where it goes when it would be inconvenient.

### The only two reasons to defer
1. **Blocked on the real world** - a registration, an account, a mailbox, a DNS record, a vendor
   dashboard setting, a credential only the user holds, a purchase, a legal decision. Nothing you can
   type finishes it.
2. **Genuinely a whole separate project.** Not "large" - *separate*: its own research phase, its own
   design decisions, its own session. A schema migration across live data, swapping a vendor,
   restructuring a subsystem. If you could realistically finish and verify it now, it is not this.

If neither applies, **do the work**.

### Not reasons to defer
Every one of these has filed an item that should have been a fix:
- "It touches other files" / "it needs a refactor first" - then touch them, then refactor.
- "It changes a shared module" / "another session may be editing it" - check
  `.agentstore/active_sessions/`; if nobody claimed it, it is yours. Important means careful, not
  hands-off.
- "It is out of scope" - a bug you *found* while doing the task is in scope. Fixing it is the job.
- "It needs a design decision" - make it, and say which and why. If it genuinely needs the user, **ask
  in your reply** - that is a question, not an item.
- "I am not sure how the fix should work" - read the code until you are.
- "It is small, I will note it" - small things are exactly what to fix now.
- "I already wrote a good item" - a well-written item is not a substitute for a fix.

**Before you write an item, you must have tried** - either you hit a wall you can name, or you can
state why attempting it is impossible. "I decided not to" is not a reason.

**A growing `TODO.md` is a failure signal.** More items at session end than at its start means the bar
slipped, unless every new one names a real-world blocker.

### If you do defer
Never silently skip: either fix it, or write the item.
- **Real-world gaps count as blocked.** A change asserting a fact that is not yet true (a policy saying
  "trading as X" before that name is registered) gets the item that makes it true, unasked.
- **Order by what must happen first**, not by when you added it - a prerequisite sits above what it
  unblocks.
- **Write each item as a copy-paste-ready prompt** for a fresh session with none of your context: what
  to do, exact files/paths/functions, what is wrong now, what "done" looks like, and the command that
  verifies it. "Fix the schema" is not enough.
- **Delete finished items** - no `- [x]` left behind. Handed a prompt shaped like `- [ ] ...`? Check
  whether it came from `TODO.md` and remove it there when done.
- **Report every change to the list** in your final message: what you added, **which of the two reasons**
  made it impossible, and what you removed as done. One line each - never let the list change silently.

### Finish what you start
Take it all the way: root cause, fixed at the shared chokepoint, a test that fails without it, verified
the way a user hits it. Half a fix plus a `TODO.md` item is worse than either - it is the deferral this
rule exists to prevent, wearing the costume of work done.

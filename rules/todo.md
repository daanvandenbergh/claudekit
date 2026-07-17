## Deferred Work (TODO.md)

**Fix it now. Deferring is the exception.** When you hit something that needs doing, do it in
the current change. Only add it to `TODO.md` if it is:
- **clearly out of scope** - unrelated to the task at hand, or
- **actually blocked** - a prerequisite that does not exist yet (a missing file or entrypoint,
  an earlier step, or a real-world action: a registration, account, mailbox, DNS record, vendor
  setting, or manual ops step).

"Bigger than I feel like doing", "touches other files", "needs a refactor first" are not blocks.
Do them. A growing `TODO.md` means the bar is being applied too loosely.

Never silently skip: either fix it, or write the item.

**Real-world gaps count as blocked.** If a change asserts a fact that is not yet true - e.g. the
privacy policy says "trading as SwiftGuard" before that trade name is registered - add the item
that makes it true, unasked.

**Order by what must happen first**, not by when you added it - a prerequisite sits above the
work it unblocks.

**Write each item as a copy-paste-ready prompt.** Assume a fresh session with none of your
context: state what to do, exact files/paths/functions, what is wrong now, what "done" looks
like, and the command or check that verifies it. "Fix the schema" is not enough.

**Delete finished items.** Once verified done, remove the line - do not leave `- [x]` behind. If
you are handed a prompt shaped like `- [ ] ...`, check whether it came from `TODO.md` and remove
it there when done.

**Report every change to the list.** If you touched `TODO.md`, say so in your final message:
what you added and why it could not be done now, and what you removed as done. One line each.
Never let the list change silently - the user must be able to see it growing.

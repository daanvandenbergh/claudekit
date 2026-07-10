## Deferred Work (TODO.md)
`TODO.md` (repo root) tracks work that is needed but cannot be done yet - blocked on a
missing prerequisite, a file or entrypoint that does not exist, or a later step. When you
hit such a case, do NOT silently skip it: add a `- [ ]` item to `TODO.md` describing the
work and what unblocks it. This is not only code - capture **real-world / external
prerequisites** too, on your own initiative and without being asked. In particular, whenever
a change **asserts or relies on a fact that is not yet true** - a legal or registration action
(registering a trade name or entity, appointing a role), an external account, mailbox, DNS
record or domain, a vendor or dashboard setting, or any manual ops step - add the item that
makes it true. Rule of thumb: if the code now claims something the real world has not caught
up to (e.g. the privacy policy states "trading as SwiftGuard" before that trade name is
registered), that gap is a `TODO.md` item by default. When you have verified an item from the
list is done, mark it `- [x]`, then delete the line - finished items must not linger. Keep the
list to genuinely-pending, actionable items.

**Order by what must happen first, not by when you added it.** New items do not have to go at
the end - insert each one wherever it belongs in the sequence, so a prerequisite sits above the
work it unblocks and the list reads top-to-bottom as the order things should be done.

**Write each item as a copy-paste-ready prompt.** Phrase every `- [ ]` so it can be pasted
verbatim into a fresh Claude Code session and fixed with no other context. State what to do, the
exact files/paths/functions involved, what is currently wrong or missing, what "done" looks like,
and any command to run or check to verify. Be clear, descriptive, and detailed enough to act on
cold - assume the session has none of the context you have now; a stub like "fix the schema" is
not enough.

**- [ ] Prompt**. If you are fed a prompt that like `- [ ] ...` then check if it isnt an item of the TODO.md list, if so, be sure to remove it when the TODO item was finished.

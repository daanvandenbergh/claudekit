## Security invariants (.agentstore/audit-security/rules.md)

This project's silent-failure security invariants live in `.agentstore/audit-security/rules.md` - the
rules a generic scanner will NEVER find because they are ours (tenant-scope, the deletion cascade, an
operator smuggled from a JSON body into a query filter, a value spliced into a pipeline update without
`$literal`, "refund only what you can prove was never sent"). `/audit-security` hunts them every run.
A rules file rots the moment the code moves on, so maintaining it is a standing obligation.

- **When you add or discover a project invariant, RECORD IT HERE** - a rule that (a) fails SILENTLY (no
  test goes red, nothing throws) and (b) is violable by code that does not exist yet. If only one file
  can break it, its docblock is the right home; if any future file can, it belongs in the rules file.
- **Write it in the file's format:** a one-line failure mode + why it is dangerous, a `✗` broken / `✓`
  correct pair drawn from a real bug, and a `hunt` block - an over-broad ripgrep listing every site the
  rule is in play (good calls and broken ones together), with an `expect:` count floor and a named
  `witness:` file. The ✗/✓ pair is load-bearing: it is the few-shot the auditing agent pattern-matches
  against. Write the ✗ from a bug you actually shipped.
- **If the project ALSO keeps a MECHANICAL copy** - a sweep script, a lint rule, a test - **the
  invariant goes into BOTH registries in the same change.** One without the other fires only for
  whichever reader happens to run, and the mechanical copy is the half that CANNOT forget. Set any count
  floor from the REAL number you just measured. A stale mechanical entry means the RULE broke, not the
  code - fix the entry, never lower the floor. When a rule graduates into a red test, retire it from BOTH.
- **A rule whose hunt matches nothing, or whose `witness:` no longer resolves, is STALE - not passing.**
  The code it guarded moved or was renamed, so it now silently checks nothing. A rule that reads as a
  pass while checking nothing is worse than no rule.
- **Graduate the mechanical ones.** Decidable by a grep + a count? Move it into the test suite (carrying
  its `expect:` floor across verbatim as the test's vacuity guard) and mark it `graduated: <test path>`.
  The audit then skips it but still verifies the test exists with a guard of its own. The genuinely
  semantic rules ("assume the money is gone when you cannot tell") stay.
- **Never delete a rule to make the audit pass.** A rule you cannot satisfy is a finding about the code,
  or an accepted risk recorded in `.agentstore/audit-security/accepted.md` with a reason naming the
  compensating control.

No rules file yet? Run `/audit-security` - its Phase 30 bootstraps one from past audit reports,
most-fixed files, the test suite and the docs, proposing each inferred invariant only after its hunt has
found real candidates. Keep the ones that are real.

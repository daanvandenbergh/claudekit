## Security invariants (claude/audit-security/rules.md)

This project's own silent-failure security invariants live in `claude/audit-security/rules.md` -
the rules a generic scanner will NEVER find because they are ours (tenant-scope, the deletion
cascade, an operator smuggled from a JSON body into a query filter, a value spliced into a pipeline
update without `$literal`, "refund only what you can prove was never sent"). The `/audit-security`
skill hunts them every run; this file is what keeps that hunt honest as the code changes. A rules
file rots the moment the code moves on, so maintaining it is a standing obligation, not a one-time act.

- **When you add or discover a project invariant, RECORD IT HERE** - a rule that (a) fails SILENTLY
  (violating it turns no test red and throws no error) and (b) is violable by code that does not
  exist yet. If only one file can break it, its docblock is the right home; if any future file can,
  it belongs in the rules file.
- **Write it in the file's format:** a one-line failure mode + why it is dangerous, a `✗` broken /
  `✓` correct pair drawn from a real bug, and a `hunt` block - an over-broad ripgrep that lists
  every site the rule is in play (the good calls and the broken ones together), with an `expect:`
  count floor and a named `witness:` file. The ✗/✓ pair is load-bearing: it is the few-shot the
  auditing agent pattern-matches against. Write the ✗ from a bug you actually shipped.
- **A rule whose hunt matches nothing, or whose `witness:` no longer resolves, is STALE - not
  passing.** The code it guarded moved or was renamed, so the rule now silently checks nothing. Fix
  the rule (or graduate it); a rule that reads as a pass while checking nothing is worse than no rule.
- **Graduate the mechanical ones.** When a rule is decidable by a grep + a count, move it into the
  project's own test suite (carrying its `expect:` floor across verbatim as the test's vacuity
  guard) and mark it `graduated: <test path>` in the rules file. The audit then skips it but still
  verifies the test exists with a guard of its own. The genuinely semantic rules ("assume the money
  is gone when you cannot tell") stay - a rules file whose survivors are all semantic has done its job.
- **Never delete a rule to make the audit pass.** A rule you cannot satisfy is a finding about the
  code, or an accepted risk recorded in `claude/audit-security/accepted.md` with a reason that names
  the compensating control - never a line to quietly remove.

If `claude/audit-security/rules.md` does not exist yet, run `/audit-security` - its Phase 30 offers
to bootstrap the file by reading this project's past audit reports, its most-fixed files, its test
suite, and its docs, and proposing the invariants it infers (each shown only after its hunt has run
and found real candidates). Keep the ones that are real.

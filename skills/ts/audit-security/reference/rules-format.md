# The project invariants file - `claude/audit-security/rules.md`

The rules a generic scanner will NEVER find, because they are *this project's own*: tenant-scope, the deletion
cascade, `$literal` in a pipeline update, "refund only what you can prove was never sent." Every one is
exploitable, every one fails SILENTLY (violating it turns no test red and throws no error), and not one is in
any ruleset on earth. Phase 30 hunts them every run. This file is the spec for how they are written, hunted,
kept honest, and eventually retired.

The consumer authors `claude/audit-security/rules.md` (note: `claude/`, not `.claude/`). If it is absent, the
skill offers to bootstrap it (below). `claude/audit-security/accepted.md` (machine-written) holds the accepted
risks.

---

## The format: prose, a ✗/✓ pair, one fenced `hunt` block

A rule is an H2 with a severity in the parenthetical, some prose, a `✗`/`✓` pair, and one `hunt` block. That
is the entire schema. Three deliberate refusals, because a format you fill in like a form is a format nobody
fills in:

- **No per-rule frontmatter.** Severity lives in the H2. That is the whole schema.
- **No `applies:` glob.** The `hunt` command already names its paths. Two sources of truth rot.
- **No required fields.** A rule with prose and nothing else is legal - the skill proposes a `hunt` for it and
  offers to write it back.

The one thing the format insists on is the **✗/✓ pair**, and it insists for a reason worth stating in the file
itself: **that pair is not documentation - it is the few-shot prompt handed verbatim to the auditing agent.**
It is the highest-value two lines in each rule. Write the `✗` from a bug you actually shipped.

```markdown
## ADDR-LITERAL (critical) - `$literal` every address spliced into a Mongo pipeline update

In a pipeline update a `$`-prefixed string is a FIELD PATH, not text. An address arrives from a phone
transcript. A caller who says "$notes" gets their notes written into their own address. Expression
injection, reachable from the PSTN, by speaking.

✗ `updateOne(f, [{ $set: { address: resolved.formatted } }])`
✓ `updateOne(f, [{ $set: { address: { $literal: resolved.formatted } } }])`

​```hunt
rg -ln 'updateOne|updateMany|findOneAndUpdate|bulkWrite' src/backend --type ts
expect: >= 30
witness: src/backend/customers/customers.ts
​```
```

### The `hunt` block

An **over-broad** ripgrep whose job is *not* to find violations but to enumerate **every site where the rule is
in play** - the correct calls and the broken ones together. False positives are fine; **false negatives are
fatal**. Cast the net over the good AND the bad, then let the agent judge. Two guard lines:

- **`expect:`** - a floor on the candidate count (`>= N`). Below it, the hunt is broken.
- **`witness:`** - a `file::pattern` (or `file::symbol`) that must appear in the results, NOT a bare filename.
  A bare filename passes as long as the over-broad hunt hits that file for ANY reason - so the guarded site can
  be renamed or deleted out of it while an unrelated `updateOne` keeps the witness green, and coverage is
  silently lost. Anchor the witness to the actual guarded construct (`customers.ts::$literal` /
  `client-ip.ts::ClientIp.resolve`), so a witness pass means the *real subject* is still there.

---

## HUNT then VERDICT - one mechanism, not three

Rules look like they split into three kinds needing three engines: regex-checkable ("never read
`X-Forwarded-For`"), dataflow ("`$literal` every value spliced into a pipeline"), and semantic ("refund only
what you can prove was never sent"). They do not. They need **one mechanism and three amounts of thinking.**

> A taint engine exists because you cannot afford to look at every sink. An agent CAN afford to look at every
> sink - there are only ~40. Enumerate the sinks and the dataflow problem collapses into a reading problem.

So every rule, of every kind, runs the same two steps:

1. **HUNT** - run the `hunt` ripgrep. It returns the bounded candidate set (paths + lines).
2. **VERDICT** - one sub-agent per rule reads that candidate set and adjudicates. It never greps and never
   wanders. `X-Forwarded-For` is 13 files and a trivial verdict; `$literal` is ~40 files and a traced verdict;
   "refund only what you can prove was never sent" is 8 files and a genuine judgement. Same pipeline. The
   routing you were about to build is a thing you can delete.

Recall comes from the hunt being over-broad; precision comes from the agent being narrow. Above ~150 sites,
shard one rule across several sub-agents.

### Do NOT generate Semgrep rules from the invariants

Fatal, and the argument is worth keeping in the file so nobody re-invents it: **a subtly wrong generated rule
returns zero matches, and zero matches looks exactly like a pass.** That converts a judgement problem into a
*silent-failure* problem - the precise bug class this file exists to hunt. You cannot build the audit tool out
of the thing it is auditing for. (This is unrelated to Semgrep-as-SAST in Phase 2, where the rules are
human-curated.)

---

## The vacuity guard (`expect:` + `witness:`) - checked BEFORE any finding

Lifted from a real red test: *"a walk that silently matches nothing would be a green test that checks nothing
at all - which is worse than no test, because it reads as proof."*

The hunts run **first**, as a blocking phase, and the **rule-health table prints ABOVE the findings**. A rule
whose hunt falls below `expect:`, or whose `witness:` no longer resolves, is a **RULE FAILURE**, reported as a
finding *about the rules file*, never counted as a pass. When a witness vanishes the code it guarded moved or
was renamed; the skill offers a **repair** (*"witness `lib/client-ip.ts` is gone; `ClientIp.resolve` now lives
at `net/client-ip.ts` - update the rule?"*).

One hard formatting law:

> **The report may never print "0 findings" without the site count beside it.** "0 findings / 0 sites hunted"
> must be impossible to mistake for "0 findings / 137 sites hunted."

---

## Graduation - `rules.md` is a NURSERY, not a home

Each adjudicating agent answers one extra question: *"did deciding any of these sites require reading beyond
the matched line?"* The agent that did the work is the honest judge of whether the work was mechanical.

- **All-mechanical across N CONSECUTIVE runs** (default N=2 - one all-mechanical run can be luck; a subtle new
  case that needs judgement must not retire the agent permanently) → the skill offers to write the rule into
  the project's own test suite. **The generated test must do BOTH, not just the count guard:**
  1. **Detect the `✗` pattern and assert it does not exist** - the actual violation detector (walk the hunt's
     sites, apply the `✗`/`✓` distinction, `expect(violations).toEqual([])`). A test that only asserts "sites
     exist" checks nothing about safety.
  2. **Carry the `expect:` floor as its own vacuity guard** - `expect: >= 100` lifts verbatim to
     `expect(files.length).toBeGreaterThan(100)`. The guard is not reinvented; it *moves*.
- The rule then carries **`graduated: <test path>`** and the audit skips it - while each run still verifies the
  test exists, **references this rule's id (or its `✗` pattern) in its body** (a grep for a nearby
  `toBeGreaterThan` is not enough - the body can be gutted while the grep still matches), **and still carries
  its own vacuity guard**. Delete or hollow the test and the rule un-graduates and comes back. Nothing falls
  through.
- **Semantic rules never graduate**, and that is the point. A rules file whose survivors are all genuinely
  semantic has done its job - it handed everything mechanical to a test that costs nothing and runs forever.
  **The graduation rate is this skill's honest metric.**

A rule whose hunt is healthy but which has produced **zero findings across many runs** is not necessarily dead
- it may be working. Say so once a quarter (*"CLIENT-IP: 13 sites, 0 violations, 6 runs. Either it is doing its
job or it graduated and nobody noticed."*) and let the human decide. Do not auto-retire.

---

## Bootstrapping - no rules file yet

The skill does **not** shrug and fall back to generic scanning. It says: *"I have no invariants for this
project. Generic checks find generic bugs. Here are the ones I think your codebase actually depends on."*
Evidence sources, in descending credibility:

1. **Past audit reports** (`last_audit.md`, `claude/reports/`). **A bug that already shipped is a proven
   invariant** - the highest-quality signal in the building, and nothing else is looking at it.
2. **Git history - the files with the most fix commits, and every revert.** A function fixed four times has an
   invariant nobody wrote down.
3. **The existing test suite.** A test named `every-surface-is-gated` *is* an invariant, already enforced -
   harvest it and write it in **pre-`graduated:`**, so the file opens by acknowledging what is already covered
   and never spends a token re-checking it.
4. `CLAUDE.md`, module docblocks, ADRs.
5. **Chokepoint archaeology** - a `require*` / `assert*` / `resolve*` / `safe*` helper with many callers
   *announces* its own rule: "always come through me."

**Two admission bars that do most of the work:** the failure must be **silent** (if violating it turns a test
red, it is already enforced - it does not belong here), and it must be **violable by code that does not exist
yet** (if only one file can break it, that file's docblock is the right home).

**Greenfield (no history, no tests, no prior reports) - the thin case, handled explicitly.** A new project
lacks sources 1-3 above, which is exactly where the skill's unique value (project-specific silent invariants)
is weakest. Fall back to two sources that exist from day one: (a) **the standards doc's imperative
statements** - a `CLAUDE.md` / `AGENTS.md` dense with "MANDATORY ... / fails SILENTLY / every X must Y" lines
is machine-harvestable straight into `hunt` blocks; (b) **chokepoint archaeology alone** - a `require*` /
`resolve*` / `assert*` helper with several callers implies "always come through me" even with no history to
confirm it. Flag every greenfield-derived rule with its low-evidence provenance (`evidence: CLAUDE.md
imperative (unverified by history)`), so the human knows the net is younger and less battle-tested than a
history-derived one.

**The mechanic that makes a proposal trustworthy: no rule is shown to the human until its hunt has been RUN and
come back non-empty.** Nobody is asked to bless an already-vacuous rule. Each proposal arrives carrying live
numbers - and the last line is the demo:

```
3. ADDR-LITERAL (critical) - $literal every address spliced into a pipeline update
   evidence:  CLAUDE.md "Addresses"; src/backend/address/last_audit.md §4
   hunt:      44 sites · witness src/backend/customers/customers.ts ✓
   right now: 2 of those 44 look wrong to me.        [keep / drop / edit]
```

That is not a proposed rule. It is a proposed rule **that has already found something.** Present 8-12, numbered,
keep-the-real-ones; write only what is kept. Do not build a wizard - it is a conversation.

---

## A complete worked `rules.md`

````markdown
# Invariants - <project>

Rules a scanner will never find, because they are ours. Each one is REAL: it has shipped broken, or it is one
edit away from doing so, and none of them turn a test red.

How a rule works. The `hunt` block is a ripgrep you can paste into a terminal right now. Its job is NOT to find
violations - it is to find every site where the rule is IN PLAY, the correct calls and the broken ones
together. Then an agent reads those sites and judges. If the net comes up empty, the net is broken, not the
code - which is what `expect:` and `witness:` are for. The ✗/✓ pair is what the auditor pattern-matches
against; write the ✗ from a bug you actually shipped.

Severity: critical | high | medium | low  (see audit-security/reference/severity.md)

---

## TENANT-SCOPE (critical) - every domain doc carries `organizationId` and every query filters on it

Accessors take it EXPLICITLY. The voice agent has no session and no cookie: if an accessor reaches for ambient
identity it finds none, and the "safe" fallback is the whole tenant table. One org's plumber reads another
org's calls, and nothing anywhere goes red.

✗ `db.collection(COLLECTION_NAMES.call).find({ customerId })`
✓ `db.collection(COLLECTION_NAMES.call).find({ organizationId, customerId })`

​```hunt
rg -ln 'COLLECTION_NAMES\.' src/backend --type ts
expect: >= 100
witness: src/backend/db/collections.ts
​```

## CASCADE (critical) - a new collection goes in `COLLECTION_NAMES` and the deletion cascade

Org-scoped → `onDeleteOrg`. User-scoped → `onDeleteUser`. Miss it and you orphan tenant PII forever, silently,
and the first to find out is a regulator. Every name in the registry is either purged by a cascade or is on the
`NOT_TENANT_SCOPED` escape hatch *with a stated reason*.

✗ a new `COLLECTION_NAMES.transcript` and no matching `deleteMany` anywhere in `on-delete-org.ts`
✓ registry entry + a `deleteMany({ organizationId })` in the cascade

​```hunt
rg -no 'COLLECTION_NAMES\.[a-zA-Z]+' src/backend/db/collections.ts src/backend/auth/internal/on-delete-org.ts src/backend/auth/internal/on-delete-user.ts
expect: >= 25
witness: src/backend/db/collections.ts
​```

## CLIENT-IP (high) - resolve a client IP only via `ClientIp.resolve`, never `X-Forwarded-For`

The leftmost `X-Forwarded-For` entry is written by the CALLER. An IP allowlist, a lockout key or an audit row
built on it is decoration that one line of curl defeats - and it looks like security in review, which is the
dangerous part. Match the code shape, not the word (the word appears in comments and docstrings).

✗ `const ip = headers.get("x-forwarded-for")?.split(",")[0]`
✓ `const ip = ClientIp.resolve(headers)`

​```hunt
rg -lnE '\.get\(\s*["'"'"'`]x-(forwarded-for|real-ip)' src --type ts -g '!**/tests/**' -g '!**/lib/client-ip.ts'
expect: >= 1
witness: src/backend/lib/client-ip.ts
​```

## SMS-REFUND (critical) - refund only what you can prove was never sent

A 4xx, `invalid_number`, `not_configured`: never left the process - refund. A TIMEOUT or a 5xx means WE DO NOT
KNOW: the vendor may have billed us while the answer was lost. Refunding there refunds the quota in exactly the
case where the money went - and a caller looping on a flapping vendor sends unlimited real messages for free.
When you cannot tell, assume the money is gone. GatewayAPI has no idempotency key: a retry is a SECOND CHARGE.

✗ `catch (e) { await Quota.release(hold); }`  - a timeout is not proof of non-delivery
✓ `if (result.kind === "rejected") await Quota.release(hold);` - and nothing else releases

​```hunt
rg -lniE 'refund|release|hold|\$inc' src/backend/sms src/backend/quota --type ts
expect: >= 5
witness: src/backend/sms/sms.ts
​```
````

Every number above is a floor set at ~70-75% of a real live count, matching the headroom convention that
already guards a filesystem-walking red test. Note `CASCADE` runs two hunts in one block and no DSL for the
set-difference: the agent is the join engine, and the prose already says "the two lists must correspond."

---

## `claude/audit-security/accepted.md` - accepted risks, expiring on CODE CHANGE not a date

Same directory, separate file (two files drift; the pardon outlives the law). **Machine-written only** - a
hand-written suppression is a footgun, because the fingerprint has to be right. Keyed on **rule-id + path +
enclosing symbol**, never a line number (which moves on any edit above it). The reason is mandatory prose that
must name the compensating control or why the exploit does not reach; **"won't fix" is not a reason.**

> A date-based expiry is a lie teams tell themselves - everyone sets it six months out and rubber-stamps the
> renewal. **An accepted risk expires when its code changes.** Record the enclosing symbol's `code_hash` at
> acceptance; if it moves, re-adjudicate *that one site* (one file, one rule, pennies) and surface it only if
> the finding still stands. Sticky while the code is identical; re-examined the moment it is not.
>
> **`code_hash` is defined precisely** (so two runs compute the same value, and it does NOT change every
> commit like a git SHA would): `sha1` of the enclosing symbol's body text, **normalized** - whitespace
> collapsed, comments stripped, string/number literals left intact (they are load-bearing here). When a
> violation has **no enclosing symbol** (a module-top-level statement), fall back to `sha1(normalized
> ±5-line window around the site)`. It is NOT a git commit hash - a commit hash would expire the suppression
> on every unrelated commit to the file.

````markdown
# Accepted

Findings we have decided to live with. Each names the compensating control, or why the exploit does not reach.
"Won't fix" is not a reason. Each expires when its code CHANGES - not on a date - and the audit re-decides it
then.

## ADDR-LITERAL @ src/backend/address/internal/cache.ts::cachedLookup
`geocodeCache` is global and its key is a normalised string we build, never caller text - the `$`-prefixed
path cannot originate from a transcript here. Reachability, not mitigation.
accepted: 2026-07-14 · code_hash: sha1:a3f91c2e5b7d   # normalized symbol body, not a git SHA

## SMS-REFUND @ src/backend/sms/tests/sms.test.ts::releasesHold
Test fixture releases a hold unconditionally. Test-only, no vendor call, no meter.
accepted: 2026-07-14 · code_hash: 7b1e440
````

An optional `until: 2026-09-01` is allowed for a genuinely time-boxed case (a vendor fix landing in Q3), but
code-change expiry is the default and the documented path.

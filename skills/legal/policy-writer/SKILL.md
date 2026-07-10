---
name: policy-writer
description: Create or verify-and-update a project's legal/business policies - privacy
    policy, cookie policy, terms of service, data processing agreement (DPA),
    imprint/Impressum, and AI-transparency disclosure - always grounded in a fresh codebase
    investigation so the published text matches what the code actually does. Use when the
    user wants to create, write, draft, update, verify, review, audit, or check any legal or
    compliance policy or page ("update the privacy policy", "create a cookie policy", "do we
    need a consent banner", "write our terms", "are our policies up to date?", "does the
    privacy page match the code?"). Takes an optional policy type; omit to assess all
    policies. Output is a code-verified draft for lawyer review, not legal advice - it never
    invents legal facts.
user-invokable: true
argument-hint: "[privacy|cookies|terms|dpa|imprint|ai-disclosure|all - omit to assess all] | --research-dev-only | --improve-research-dev-only"
---

# policy-writer

A published policy is a set of legal claims about what your software actually does. Every
sentence must therefore trace to one of three things: code or config evidence, a
user-confirmed fact, or a cited legal source. Nothing else may appear in a policy. The
corollary is the zero-hallucination rule: never invent or recall-from-memory a statute, an
article number, a fine, a date, a retention period, or a company identity detail - what
cannot be confirmed is asked, marked `[[PLACEHOLDER: ...]]`, or cut.

This skill is universal: it carries no project facts. Everything it learns about a project -
verified inventories, standing decisions, entity identity - lives in that project's **memory
store** at `claude/memory/policy-writer/`, a directory managed by the sibling `/memory-store`
skill: every run reads it first and files what it learns back into it last (no hand-edited
`ledger.md`, no bespoke file format - `/memory-store` owns the layout, dedup, and index).
CREATE (no policy yet) and VERIFY-AND-UPDATE (policy exists, audit it against reality) are one
workflow with a mode switch, so the skill can be re-run any time to catch drift between code
and policy.

## Preflight - the `/memory-store` dependency (do this before anything else)

This skill's project memory is stored and optimized entirely through the `/memory-store`
skill (normally installed as a sibling at `.claude/skills/memory-store/`). **Confirm it is
installed before running any phase:** check that the `/memory-store` skill is available (a
`memory-store` sibling skill directory / `.claude/skills/memory-store/SKILL.md`). If it is
**not** installed, **STOP immediately** - run no phase, read/write no memory - and tell the
user verbatim: *"policy-writer keeps its project memory via the `/memory-store` skill, which
isn't installed. Install it from `@daanvandenbergh/claudekit` (symlink it into
`.claude/skills/memory-store`) before running policy-writer."* Resume only once it is present.

## Phase 0 - Dispatch

Two developer-only flags come first: `--research-dev-only` and `--improve-research-dev-only`
bypass the policy workflow entirely and select the doctrine-maintenance modes documented at the
end of this file (they STOP unless run from the source repo). Anything else is a policy type (or
omitted). Map the argument (or the user's words) to a per-policy runbook and read it FIRST - it
governs everything policy-specific in the later phases:

| Argument / intent | Runbook |
|---|---|
| privacy | `policies/privacy-policy.md` |
| cookies | `policies/cookie-policy.md` |
| terms | `policies/terms-of-service.md` |
| dpa, data-processing | `policies/data-processing-agreement.md` |
| imprint, impressum, legal notice | `policies/imprint.md` |
| ai-disclosure, ai-transparency | `policies/ai-disclosure.md` |
| all, or omitted | Assess applicability of each (see below), report the gaps, then run the ones the user confirms |

Applicability when assessing "all": every product needs privacy + terms; any site with
cookies/trackers (or a claim about them) needs cookies; a B2B product processing personal
data on customers' behalf needs a DPA; serving markets with provider-identification duties
(notably Germany/Austria) needs an imprint; any AI that interacts with people needs the AI
disclosure.

## Phase 1 - Memory store and mode detection

1. Read the memory store at `claude/memory/policy-writer/`: its `INDEX.md` first, then grep
   and read the entries relevant to this policy (project profile, prior decisions, known
   state). A fresh project has no store yet - it is created on the first `--store` in Phase 6
   (`/memory-store` bootstraps `INDEX.md`); when it is empty, fill the project profile
   (`assets/memory-store-seed.md` lists the facts to capture) by asking the user only what
   Phase 2 cannot discover. Standing `decision` memories bind this run unless the user
   overrides or a decision's premise no longer holds; never re-ask a question the store
   answers; re-verify every stored `fact` (known-state) rather than trusting it.
2. Locate the policy's page/document (from the store, or by searching the repo; if the
   project has no policy pages at all, ask where they should live). Missing page or
   placeholder/stub content -> CREATE mode. Substantive content -> VERIFY-AND-UPDATE mode:
   audit every claim, change only what is wrong, missing, or stale - do not rewrite validated
   wording for style.

## Phase 2 - Codebase investigation (mandatory, every run)

The policy may only claim what the code actually does, and must cover everything it does.
Establish ground truth with parallel read-only subagents launched in ONE message. Every agent
prompt MUST include: "Do NOT spawn any subagents. Do not modify any file. Return findings as
a structured fact table with file:line evidence." Standard team (the runbook adds or narrows
targets):

1. **PII/data inventory** - every personal-data field stored or processed, per data model /
   collection / table, and whose data it is (the customer's vs the customer's customers).
2. **Cookies and client storage** - everything set in the browser (cookies, localStorage,
   sessionStorage, IndexedDB), with name, lifetime, and purpose resolved from actual config.
3. **Vendors and subprocessors** - dependencies, SDK calls, env vars/config, and infra.
   HARD RULE: an env-var-only vendor is an ACTIVE processor until the user confirms
   otherwise - external SaaS can process personal data with zero repo footprint beyond a key.
4. **Existing-policy claims** - extract every claim from the current policy text (and
   sibling policies, which must not be contradicted) so each can be mapped to evidence.
5. **Retention and deletion** - actual TTLs, cascade deletes, cleanup jobs, backup behavior.

Reconcile into one fact inventory plus an ask-the-user list for what the repo cannot show
(entity identity, infra/edge behavior, external platform configuration). Every claim in an
existing policy maps to evidence or is flagged as drift.

## Phase 3 - Draft or patch

The runbook's required structure governs. Global rules:

- Only verified facts; `[[PLACEHOLDER: ...]]` for anything awaiting the user, each one listed
  in the final report as a blocker.
- Every load-bearing legal statement traces to a `references/` file (respect its Verified
  header - if stale, re-verify live) or a live-checked citation.
- Plain language per `references/structure-clauses-and-craft.md`; jurisdiction scope from the
  memory store + `references/intake-questionnaire.md` on first run.
- Planned-but-unshipped features are never described as current processing; record them in
  the memory store so the run that ships them updates the policy.
- A "Last updated" date changes only when content changes.

## Phase 4 - Adversarial verification (fresh agents, every run)

After drafting, launch a FRESH team (same no-spawn, read-only rules; do not show them the
Phase 2 notes):

1. **Policy -> code refutation** - one agent per policy section: "Find evidence this claim is
   false, overstated, or unverifiable. Default to flag when uncertain."
2. **Code -> policy sweep** - fresh re-derivation of the inventory; anything processed but
   undisclosed is a finding.
3. **Legal completeness** - the draft against the runbook's checklist, the relevant
   `references/` files, and the 12-point gate in `references/edge-cases-failure-modes-qa.md`.

Fix findings, re-verify what changed with fresh agents. Done only when a full round returns
zero findings twice in a row.

## Phase 5 - Ship and prove

Run the project's own typecheck/build (from the stored project profile; detect or ask on first run).
Verify the page renders per the project's conventions. Confirm site navigation links the
policy. Update the project's TODO/tracking system if it has one - the lawyer-review item
stays open.

## Phase 6 - Memory store update

File this run's durable memories into the store with the `/memory-store` skill, letting it
distil, dedupe, and refine in place - never hand-write files under `claude/memory/policy-writer/`:

- `/memory-store --store claude/memory/policy-writer "<memory>"` for each: re-verified
  known-state as `fact` entries (each with its `file:line` / user-confirmation source), any
  new decision as a `decision` entry carrying its premise (the condition that keeps it valid),
  and the run outcome + open placeholders as a `project`/`event` entry. `/memory-store`
  greps for existing coverage before writing, so a re-verified fact refines its entry instead
  of duplicating it.
- Periodically (or when the store feels bloated) run `/memory-store claude/memory/policy-writer`
  to optimize - rebuild the index, merge duplicates, and supersede overturned decisions.

Store `[[PLACEHOLDER: ...]]` facts too if they are load-bearing so the next run knows what is
still open; a decision is superseded (never silently rewritten) when its premise breaks.

## Guardrails

- Never invent an entity detail, statute, citation, fine, date, or retention period. Asked,
  placeholdered, or cut - those are the only options.
- Uncited load-bearing legal claims are marked `UNVERIFIED` or removed.
- `references/` is read-only during policy runs; only the developer-only `--research-dev-only`
  and `--improve-research-dev-only` modes (below) may update it, and only from the source repo -
  they update the `Verified:` headers.
- French references are input doctrine; output language comes from the memory store.
- The final report always states what changed, the open blockers, and this caveat verbatim:
  "This policy is a code-verified draft, not legal advice. A qualified lawyer must review it
  before it is treated as final." Claim code-accuracy, never legal certainty.

---

## Developer-only doctrine modes - never run in a consumer install

Two flags maintain the skill's **own bundled legal doctrine** - the `references/*.md` packs and
the primary-source PDFs in `assets/sources/` they cite. This is the dated law every consumer's
policies inherit *unread*: a policy run trusts a reference's `Verified:` header as licence to state
that reference's article numbers, dates, and retention periods without re-checking them live (Phase
3). So `references/` is the one place law is *authored*, and it may be authored only here - under a
human curator who reviews each primary-source trace and a lawyer who can read the diff, conditions
that exist only in the `@daanvandenbergh/claudekit` source repo. A consumer only ever
*consumes* the references, read-only; it never authors law. These modes are deliberately verbose and
un-aliased so they cannot be typed by accident.

**Preflight - repo guard (both modes, before touching anything).** Resolve this skill's *real* path
(follow the symlink). If it resolves inside `node_modules/`, **STOP**: *"research/improve modes
rewrite the skill's bundled legal doctrine that every consumer's policies inherit, and must only run
in the @daanvandenbergh/claudekit source repo, never a consumer install."* These modes edit
`references/` directly with `Read`/`Edit`; they do **not** touch `/memory-store` (that skill owns
only the consumer's project memory at `claude/memory/policy-writer/`), so the `/memory-store`
Preflight at the top of this file does **not** gate them - the repo guard is their only guard.

**Doctrine safety spine - caution first: prefer a missed refresh over a wrong one.** A hallucinated
legal fact written here becomes a false legal representation in every consumer's policies, and looks
*more* trustworthy for being cited - the worst failure this skill has. So:

- **Primary source or nothing.** Every article number, effective date, retention period, and fine
  must trace to the *official text* - the bundled PDF in `assets/sources/`, or a live
  regulator/legislature/court URL (EUR-Lex, Légifrance, gesetze-im-internet.de, EDPB/CNIL/ICO,
  a state-AG/.gov compilation, a court slip opinion) - captured with an article/section number and
  an access date, **never from model memory.** Law-firm alerts, IAPP, gdpr-info.eu and the like are
  *leads*, never the citation of record; they may appear only behind an `UNVERIFIED against primary`
  tag. In SEO the sovereign is Google, so web.dev is primary; in law the sovereign is the
  legislature/regulator/court, and a blog paraphrasing it is telephone.
- **Supersede, never silently delete.** When a rule moves, keep the old fact (struck through, or in
  a `## Superseded` block) stamped with the supersession date, the superseding source, and a
  one-line reason - a lawyer reviewing the diff must see *what changed and why*.
- **French references stay input.** The `-cnil` packs and `CNIL_*.pdf` are French input doctrine;
  a refresh may update them but must never promote French prose into output-facing clause guidance,
  nor treat a CNIL position as the output jurisdiction's own law.
- **Unconfirmable ⇒ flag, don't write.** With no user to ask mid-run, the options collapse to
  flag-or-cut: mark the claim `UNVERIFIED` (the existing house convention) with its best lead, and
  never advance a `Verified:` date over it. When in doubt, don't.

### `--research-dev-only` - re-verify the doctrine against primary sources

Parallel research, serial application - the read-heavy primary-source lookups fan out; the
contention-prone editing of the cross-linked, PDF-sharing files funnels through one curator.

- **R0 - Assignment map.** Partition the **16 doctrine files** into **~13 non-overlapping domains**,
  each owning its file(s) and its primary sources, each brief naming what to defer to a sibling
  ("you own X, link don't duplicate Y"): EU/UK GDPR disclosure (`jurisdictions-eu-uk`); US
  federal+state privacy (`jurisdictions-us`); global/MENA (`jurisdictions-global-mena`);
  cookies/ePrivacy (`cookies-cnil` + `legal-bases-cookies-cnil`); GDPR bases & rights
  (`legal-bases-gdpr` + `data-subject-rights-cnil`); **retention & statutory limitation periods**
  (`retention-periods-cnil` - split out as its own domain because its Légifrance figures, the 10-yr
  accounting `art. L123-22` and the `décret 2021-1362` connection-log periods, are distinct
  primary-source work and genuine fast-movers, not incidental to the bases doctrine); DPA/Art 28/SCC
  transfers (`dpa-drafting-standards` + `dpa-review-and-dsr-ops`); AI Act transparency
  (`ai-act-transparency`); call-recording consent (`call-recording-consent-eu`); imprint
  (`imprint-requirements-eu`); terms of service (`terms-of-service-standards`); platforms/vendors/AI
  tools (`platform-cookies-ai`); sector overlays/security/breach (`sector-and-special-products`).
  The 4 craft/process files (`structure-clauses-and-craft`, `edge-cases-failure-modes-qa`,
  `intake-questionnaire`, `implementation-snippets`) carry no dated law and are handled in the R4
  spine reconcile, not as research domains. Every file ships seeded, so every brief reads *refine in
  place, re-verify, don't rebuild* - never re-author validated prose for style.
- **R1 - Parallel research (~13 domain agents + 1 devil's advocate + 1 topic scout = 15, NO writes -
  the scout may spawn a writer, but a new file still lands through R2).** Each domain
  agent reads its file(s), then re-verifies every load-bearing fact against its primary source - both
  that the file's claim still matches the text *and* that the bundled PDF is still the current
  consolidated/official version - and **returns** a packet per touched claim; it never writes.
  Packet: `FILE`; `ANCHOR` (quoted current text); `CLAIM`; `SOURCE` (official instrument + Art/§ +
  URL + access date; + local PDF matches/stale); `VERDICT`
  (`UNCHANGED`|`CHANGED`|`SUPERSEDED`|`NEW`|`UNVERIFIABLE`); `EDIT` (exact old→new, or none);
  `PDF-NOTE` (superseded-by URL + what changed); `CONFIDENCE` (`low` on fast-movers - US state laws,
  AI Act phase-in, EU-US DPF, ePrivacy Regulation, FTC/CA renewal rules, vendor terms); and the
  proposed `Verified:` line. Secondary sources are leads only.
  - **The devil's advocate owns no domain** - it is the standing red team over the whole refresh,
    complementing R3 (which refutes each *changed fact*) by challenging the *coverage and confidence
    of the set*. It reads every returned packet plus the corpus and flags: cross-domain
    contradictions (two domains asserting incompatible facts - e.g. a retention period cited one way
    in `retention-periods-cnil`, another in `cookies-cnil`); citation laundering (a fact marked
    verified whose `SOURCE` is actually a blog/tracker, not primary text); missing NEW law (a
    2025/26 development that falls *between* domains and no agent owns - e.g. a rule spanning
    US-state privacy and sector overlays); and unearned confidence (an `UNCHANGED` verdict on a
    fast-mover that was not actually re-derived, or a `Verified:` bump no primary source backs). Its
    findings enter R2 as extra flags and R3 as extra facts to refute; it can never itself pass a
    fact - only challenge one.
  - **The topic scout owns no single file either** - where the devil's advocate red-teams the
    *facts* inside the current partition, the scout red-teams the *partition itself*. It reads all
    ~13 domains against the live legal landscape and asks whether a whole area of law now needs its
    own `references/` pack that no existing file covers (a newly-in-force regulation, an uncovered
    jurisdiction, or an obligation today only half-covered across two files). The bar is deliberately
    high: propose a NEW topic only for a real, primary-source-backed obligation a policy run would
    actually need - never a speculative or niche edge case (a thin new file is worse than a linked
    paragraph in an existing pack). When the gap is real, the scout is the **one agent permitted to
    spawn** a fresh writer, which drafts the new pack from primary sources (same mandate: official
    text + Art/§ + URL + access date, a `Verified:` header, a `Provenance:` line) and returns it as
    a `NEW-TOPIC` packet - it does **not** create the file itself. R2 creates the file, R3 refutes
    its facts like any other, and R4 wires it into the spine (dispatch table, runbooks, cross-links).
    Growing the file set stays inside the same gates as every other change.
- **R2 - Serial application (one curator).** Apply packets one at a time with `Edit`: patch
  `CHANGED`, mark `SUPERSEDED` (never delete), add `NEW`, flag `UNVERIFIABLE` as `UNVERIFIED`,
  create the file for a `NEW-TOPIC` packet (`Write`, only after R3 clears its facts); swap
  each superseded PDF in `assets/sources/` **once** and repoint every file that cites it; re-stamp
  each touched file's `Verified:` header with today's date *and* the source's own
  version/publication date (distinct from the access date), preserving its `Provenance:` line.
  Serial because the files cross-reference each other, share PDFs, and must land in one reviewable
  diff. Never bump a `Verified:` date without an actual re-check; if live access is unavailable,
  verify against the bundled PDFs only and mark web-dependent facts *"deferred - not re-verified
  against live sources this pass."*
- **R3 - Adversarial refutation (fresh agents).** The researcher who refreshed a fact is biased
  toward passing it, so refutation, not more finders, is where rigor is spent: **2-3 fresh refuters
  per changed fact** - not shown the researcher's notes or each other's - each independently
  re-derive it from primary sources: *"Find evidence this article number, date, retention period, or
  fine is wrong or superseded. Re-derive it from primary sources independently. Default to flag when
  uncertain."* Because a wrong legal fact is worse than a missed refresh, the rule is conservative,
  not majority-vote: a fact advances its file's `Verified:` date only when it survives **every**
  refuter (and every devil's-advocate flag against it); **any** refuter that contradicts it
  tombstones/corrects and re-refutes, and a fact even one refuter cannot confirm downgrades to
  `UNVERIFIED`. Reserve the third refuter for `CONFIDENCE: low` fast-movers where two is thin.
- **R4 - Reconcile the spine.** Keep the operational spine in lockstep with the refreshed doctrine:
  the 12-point QA gate in `references/edge-cases-failure-modes-qa.md`, the per-policy runbooks'
  `references/…` citations, the inter-reference `Pair with` / `Read when:` links, and the Phase 0
  dispatch table. Two-way invariant: every gate check traces to ≥1 live reference, and every newly
  mandatory obligation the refresh introduced (a new required disclosure, a changed retention
  threshold, a new jurisdiction duty) is covered by ≥1 gate check. Repoint any citation broken by a
  rename/merge - a runbook or gate pointing at a fact that moved is the legal analog of an audit
  citing a tombstone.

**Report:** verdict (any fact that failed refutation or is `UNVERIFIED` ⇒ "do not commit as
verified"); `Verified:` dates advanced; legal facts changed (before→after + primary source);
superseded/tombstoned; `UNVERIFIED` open items; French-input boundary held; cross-reference
integrity. The git diff is the audit trail. Close with: this refreshes a code-verified *draft*
doctrine, not legal advice - a qualified lawyer must review the diff.

### `--improve-research-dev-only` - reconcile and dedup the doctrine tree (no re-verification)

The janitor to research's researcher: a pure reconcile + dedup + header-hygiene pass over the
hand-authored tree. It invokes no `/memory-store` and - the hard line - **never writes a new legal
fact and never re-verifies law against a source.** A fact that looks stale earns a `NEEDS-REFRESH`
flag, not an edit. Same repo-guard preflight; nothing else.

- **I1 - Inventory & citation graph.** Read every `references/*.md`, the 6 runbooks, the QA gate,
  SKILL.md's dispatch/Phase-3 pointers, and `assets/`; build the citation graph
  (runbook→reference, reference→reference, reference→primary-URL, reference→PDF) and read every
  `Verified:` header. Add no `INDEX.md` - the Phase 0 dispatch table plus per-file `Read when:`
  headers already are the index.
- **I2 - Dedup / merge.** Where two files genuinely cover the same doctrine, merge into the
  canonical one preserving the better prose and the *union* of citations, leaving a tombstone
  pointer at the loser. Conservative: near-overlap that isn't true redundancy (the DPA pair, the
  four `-cnil` packs) is **flagged for human review, never force-merged.**
- **I3 - Tombstone tidy.** Housekeep facts a prior refresh already marked superseded into a clean
  `## Superseded` block; never hard-delete, and never decide supersession de novo - that needs
  primary-source research, which is `--research-dev-only`'s job.
- **I4 - Reconcile cross-references (the load-bearing part).** For every file merged/renamed in I2,
  grep the whole graph - runbooks, sibling references, the dispatch table, the QA gate - and repoint
  every pointer to the surviving target. Every citation must resolve after the pass.
- **I5 - Verified-header hygiene.** Normalize the drifting header formats to one shape; flag every
  *fact-bearing* file missing a header, and every header past its "re-verify if older than 12
  months" clause, as `NEEDS-REFRESH` - without false-flagging the craft/process files that correctly
  carry none.

**Report:** merged/deduped; flagged-for-review overlaps; tombstones tidied; citations repointed;
header hygiene (normalized / missing / `NEEDS-REFRESH` / correctly-headerless); orphans. No legal
fact changed - the git diff is prose/structure/citations only.

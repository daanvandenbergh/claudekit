# Seam catalog: recurring cross-module bug archetypes

Scan this first each run. These are the deep-logic bugs that actually ship in real systems - each
is a *shape*, phrased so it transfers across stacks; resolve the project's real vocabulary from
Phase 0. Every entry has: the **shape**, the **probe**, the **false-positive traps to rule out
before flagging** (skipping these is how the skill hallucinates), and a **severity floor**.

This file is meant to **grow per project.** When a pass finds a real seam bug - especially a shape
that recurs - add or sharpen an entry with a one-line "found in <seam>" note, so the next run
scans for it first. This is the system-level twin of a single-module audit's recurring-patterns
list.

The unifying idea: every one of these is a broken **contract** or **invariant** that *no single
file owns*. You can only see it by holding two or more distant sites in view and proving they
cannot compose. If you can prove it from one file, it is not here - it belongs to a single-module
audit.

---

## A. Cross-cutting completeness gaps (DL1) - the bug is an absence across a set (a store OR a trigger)

> A cross-cutting responsibility has a **two-axis** must-cover set: the **data** it must touch and
> the **entrypoints/operations** that must invoke it. A1-A4 are data-axis gaps. **A5 is the
> trigger-axis gap - historically the biggest recall miss**, because a file-by-file reader (and a
> store-only set-diff) never asks "what *other* entrypoint reaches this same effect?".

### A1. Orphaned cascade (registry drifts from the deletion cascade)
- **Shape:** a new tenant/user-owned store is added to the registry and indexed, but never wired
  into the account-deletion cascade, so its rows (often PII or a live credential) are orphaned
  forever on deletion.
- **Probe:** set-diff of {every tenant/user-owned store} − {stores the cascade deletes}.
- **Traps to rule out first:** covered-via-indirection (cascade deletes through a namespace
  accessor, not a literal store name); third-party-owned (framework tables); documented retention
  (a store kept on purpose, e.g. an audit log on a TTL - cite the comment). See method §5.
- **Floor:** orphaned PII / OAuth token / credential = **High** (Critical if it is a standing
  credential to a third party).

### A2. Tenant-scope not universal
- **Shape:** the architecture declares "every domain query filters by the tenant key," but one
  query over one store omits it, or takes the key from the request body instead of the
  authenticated principal.
- **Probe:** for each tenant-owned store, grep every read/write/aggregate and confirm a tenant-key
  filter (in the *first* stage of any pipeline) sourced from the principal.
- **Traps:** a query that is legitimately cross-tenant by design (an admin report) - confirm intent
  before flagging; a filter applied one call up the stack.
- **Floor:** a missing filter returning another tenant's rows = **Critical.**

### A3. Idempotency ledger missing on one ingress
- **Shape:** most at-least-once ingresses dedupe on a unique key, but one entrypoint (or one side
  effect within a deduped handler) is not replay-safe.
- **Probe:** for each external/retried ingress in the entrypoint census, confirm a unique-key
  ledger; for each deduped handler, enumerate *every* side effect and confirm each is idempotent or
  gated behind the completion claim.
- **Traps:** an effect that is naturally idempotent (a set-to-constant update); a dedup key that
  actually does cover the effect one layer up.
- **Floor:** a money/state effect that doubles on redelivery = **Critical.**

### A4. Validator / audit / other cross-cutting concern applied unevenly
- **Shape:** a concern declared universal (schema validation on every critical store, an audit call
  on every security-relevant mutation, sanitizing error detail at every trust boundary) is present
  in some modules and silently absent in others.
- **Probe:** define the concern's expected touchpoints, enumerate the actual ones across modules,
  diff.
- **Traps:** a module where the concern is genuinely N/A; the concern applied via a shared wrapper
  the grep missed.
- **Floor:** an unaudited security action = **Medium/High**; an unvalidated critical write =
  **High.**

---

### A5. Sibling-entrypoint bypass (a second door that skips the cascade/gate)
- **Shape:** a responsibility (teardown, entitlement, idempotency, audit) is enforced on its obvious
  entrypoint, but a **second entrypoint reaches the same destructive/spend/exposing effect and skips
  it**. The cascade over stores can be complete and still be bypassable, because the bug is a missing
  *trigger*, not a missing store.
- **Probe:** the sibling-entrypoint hunt (method §3). For each responsibility, grep every other
  operation that reaches the same effect - every way to destroy a tenant/parent (delete-account vs
  `deleteOrganization`/`leaveOrganization`/`removeMember`/admin-purge/cancel-to-zero), every spend
  path, every external ingress - and check each invokes the responsibility.
- **Traps to rule out first:** covered-via-indirection (the sibling routes through the same cleanup
  one call up); third-party-owned (a framework endpoint that self-cleans); documented-exemption. Read
  the sibling's handler body before flagging. See method §5.
- **Concrete instance:** a delete-account path runs a complete teardown cascade, but a *second*
  parent-delete path - a "delete organization/tenant" endpoint an auth or framework plugin exposes,
  client-callable - is wired to **no** cascade hook: it removes only the framework's own membership
  rows, orphaning every app-owned tenant store (PII, an encrypted third-party OAuth token), leaving a
  live paid subscription still billing, and stranding a paid external resource (e.g. a leased phone
  number, a provisioned VM) - while the account-delete cascade it bypasses is itself perfectly
  complete. Invisible to a store-only set-diff and to reading either file alone.
- **Floor:** an ungated destroy path orphaning PII/credentials or leaking a tenant = **High/Critical**.

## B. Seam contract drift (DL3) - two sides disagree on a shared datum

### B1. Unit / scale drift (the type matches, the meaning doesn't)
- **Shape:** both sides use an integer, but one means cents and the other assumes major units; or
  seconds vs milliseconds; or a duration in minutes read as seconds. Type-checking passes; the
  number is off by a factor.
- **Probe:** follow one value end to end; at each boundary assert not just "is it an integer" but
  "what scale / unit." Diff writer's unit against reader's.
- **Traps:** a conversion at the boundary you didn't open (open both sides); a unit fixed by a typed
  wrapper.
- **Floor:** money off by 100x, or a metered quantity off by 1000x = **Critical.**

### B2. Tax / semantic meaning drift (gross vs net, validated vs raw)
- **Shape:** the value is numerically correct but its *meaning* changes across the seam - a
  tax-exclusive amount displayed as the price paid; a "validated" flag assumed by a reader the
  writer never set.
- **Probe:** at each hop write "here it means X"; a change in meaning no code reconciles is the
  finding.
- **Traps:** a downstream adjustment (tax added later) that you didn't trace to.
- **Floor:** a charged/displayed amount whose meaning is wrong = **High/Critical.**

### B3. Identifier encoding drift
- **Shape:** one logical id is stored as different types/encodings in different stores (an
  object-id vs a hex string, a string vs a number, zero-padded vs not), and a cross-store query
  matches nothing - silently, with no error.
- **Probe:** for each id that crosses a store boundary, record its stored type in every store; find
  every cross-store query and verify the conversion.
- **Traps (important):** an existing conversion helper already bridges it - this is a classic
  false-positive; **grep for the converter and open both sides before flagging.** A query with a
  bridge is correct.
- **Floor:** a cross-store query that silently matches nothing on a deletion/scoping path =
  **Critical** (silent data loss / orphan); elsewhere **High.**

### B4. Enum / variant exhaustiveness drift
- **Shape:** a field's value space is defined or widened in one place (often by an external
  provider) but a distant consumer switches on it non-exhaustively, so an unknown value falls
  through a default. Worse when the default **fails open** (grants access) rather than closed.
- **Probe:** enumerate every value a writer (or the external provider's docs) can produce, and every
  value each reader explicitly handles; diff. Flag any gate whose default on money/auth fails open.
- **Traps:** a reader that is exhaustive with a deliberate safe default; a value the writer cannot
  actually produce.
- **Floor:** an access/spend gate that fails open on an unhandled status = **High.**

### B5. Nullability / optionality drift
- **Shape:** a field optional on write is dereferenced as present on read; or required on read but a
  writer path leaves it unset.
- **Probe:** diff writer's optionality against reader's assumption at each shared field.
- **Traps:** a default applied on read; a writer that always sets it in practice (confirm the path).
- **Floor:** a crash/NPE or a wrong branch on absent data = **High.**

---

## C. Trust-boundary asymmetry (DL4) - the weakest path defines the posture

### C1. Alternate-path auth/tenant bypass
- **Shape:** a sink is protected on its primary entrypoint (session + ownership) but reachable from
  a second, weaker ingress (a webhook/tool-call deriving the tenant key from a header/body) that
  reaches the same data.
- **Probe:** the fan-in matrix (method §6) - every ingress to each shared sink, its identity source,
  and whether its tenant/authz key is attacker-influenceable.
- **Traps:** **intended asymmetry** - a webhook legitimately has no user session. The finding is the
  *missing compensating control* (no per-tenant secret, no ownership binding), not the absent
  session. Rule out an existing binding before flagging.
- **Floor:** cross-tenant read/write via the weak path = **Critical.**

### C2. One channel validated, its co-channel trusted raw
- **Shape:** the obvious payload (JSON body) is schema-validated, but a second channel of the same
  request (headers, metadata, query) carrying a security-critical value (the tenant key, the audit
  subject) is trusted unvalidated.
- **Probe:** at each trust boundary, enumerate *all* inbound channels and confirm each
  security-relevant one is validated; trace where header/metadata values end up.
- **Traps:** a value validated downstream; a channel bound by a signature that also covers it.
- **Floor:** an attacker-controlled tenant key via an unvalidated channel = **Critical/High.**

---

### C3. No decline outcome / always-serve fallback (DL4/DL5)
- **Shape:** an ingress whose only outcomes are "serve" (resolved/entitled) and "serve-with-default"
  (unresolved/unentitled) - there is **no reject/decline path** - so it produces a working, billable
  result for *every* input, and the "obvious" gate (de-register the tenant) just routes into the
  serve-with-default branch.
- **Probe:** for each "resolve-then-serve" ingress, read the unresolved/unentitled branch: does it
  still return a working config / 200 / billable action? Then check whether the intended off-switch
  (remove the routing row, cancel the sub) actually reaches a non-serve outcome or lands in the
  fallback.
- **Traps to rule out first:** a real non-2xx/decline branch you missed; a downstream guard that
  drops the fallbacks output. Read the branch body.
- **Concrete instance:** an inbound-request handler resolves the tenant by a routing key (a called
  number, a subdomain, an API key); the unresolved branch falls back to a DEFAULT config and **still
  returns 200 with a working, billable response**, so any key a stranger points at the system is
  served on the operator's dime - and the intended off-switch ("cancel → de-register the key") lands
  in that same always-serve branch, so it never reaches a decline outcome and does not stop the spend.
- **Floor:** an always-billable ingress with no decline path (cost-DoS / serve-after-cancel) = **High**.

## D. Distributed state & ordering (DL5) - no single module owns the machine

### D1. Distributed / emergent state machine
- **Shape:** a lifecycle is advanced by writes in several modules; a state one module makes terminal
  is re-entered by another, two states can coexist, or a phone-booked object can never reach a
  state a sibling module gates on (a dead state).
- **Probe:** grep every writer of the status/existence field across all modules; reconstruct the
  combined machine; check each transition's guard against the union of states every other module
  can produce.
- **Traps:** a guard enforced one call up; a transition that looks concurrent but is serialized by a
  lock/version.
- **Floor:** a re-entered terminal state or a dead state that silently drops a core flow =
  **High.**

### D2. Source-of-truth mirror goes stale (no reconcile)
- **Shape:** a local mirror of an external system is the gate for a decision, but is only updated by
  events; a dropped/reordered/missed event leaves the mirror diverged from the source with no
  reconcile path.
- **Probe:** for each mirror, trace the sync path and ask "what if this event is late / out of order
  / never arrives?"; grep for any reconcile/backfill/poll/boot-sync path.
- **Traps:** an on-read fallback to the source; a reconcile cron you didn't find (grep before
  asserting absence).
- **Floor:** a paying/entitled decision made on a stale mirror = **High.**

### D3. Cross-module non-atomic unit of work
- **Shape:** one logical operation writes several stores across modules with no shared transaction,
  so a partial failure or an at-least-once retry leaves half-state or a double-effect.
- **Probe:** for each unit-of-work trace, mark every distinct-store write; check whether they share
  one transaction; ask "if the next write throws, what half-state remains?" and "if retried, what
  double-creates?"
- **Traps:** a compensating cleanup on failure; an idempotency key that makes the retry safe.
- **Floor:** a partial write leaving money/state inconsistent = **High/Critical.**

### D4. Ordering / temporal coupling
- **Shape:** module B assumes module A already ran (a referenced row exists, a field was set), but
  on the real timeline A runs later, never, or can be dropped - leaving a dangling reference or a
  decision on absent state.
- **Probe:** for each cross-module reference, order the writer of A and the writer of B on the real
  runtime timeline (mid-call vs post-call, sync vs async, retryable vs drop-on-error).
- **Traps:** an ordering actually guaranteed by a queue/transaction/await chain; a nullable
  reference the reader tolerates.
- **Floor:** a dangling reference on a core flow = **Medium/High.**

### D5. Error/retry semantics that don't compose
- **Shape:** two modules disagree on whether a condition is retryable, fatal, or swallowable - A
  throws expecting recovery; the caller turns it into a response the provider retries; and a
  downstream non-idempotent effect already ran.
- **Probe:** for each cross-module call, write both sides' failure contract and check they compose -
  especially: can a throw occur *after* a non-idempotent effect already succeeded?
- **Traps:** an effect that is idempotent anyway; a retry the caller suppresses.
- **Floor:** a retry that duplicates a money/state effect = **Critical.**

---

## E. Architecture-as-built drift (DL2) and duplicate truth (DL6)

### E1. Declared-boundary violation with a real trace
- **Shape:** a layer that must not import another does; a module reached through its internals
  instead of its public surface; a "thin" adapter holding business logic; a store written outside
  its owning accessor (voiding a chokepoint invariant like the tenant-key stamp).
- **Probe:** one mechanical query per declared boundary; for each hit, **prove the concrete
  consequence** (a future extraction that won't compile; a bypassed chokepoint).
- **Traps:** a hit with no provable consequence → Informational doc-sync note, not a finding; a
  boundary the project never actually declared (don't invent one).
- **Floor:** a bypassed tenant/idempotency chokepoint = **Critical**; a lift-blocking import in a
  layer declared extractable = **High**; consequence-free = **Info.**

### E2. Duplicate source of truth / duplicate rule
- **Shape:** the same fact or rule is computed/normalized in two+ places that can diverge (an
  entitlement predicate, a phone normalizer, a revenue sum), or a spend/exposure consumer gates on
  none of them.
- **Probe:** grep the rule's vocabulary across modules; collect every implementation; diff edge
  behavior (rounding, null, duplicate, throw-vs-swallow). List every spend/exposure consumer and
  confirm each calls a canonical version.
- **Traps:** two implementations that are actually equivalent; a consumer that gates one call up.
- **Floor:** a spend/exposure path gating on none = **High**; two normalizers that mint duplicate
  keys = **High.**

### E3. Invariant enforced directly in most accessors, delegated in one
- **Shape:** a write invariant (e.g. "every write verifies its parent exists") is enforced
  explicitly in N−1 accessors and merely *assumed via a neighbor* in the Nth, so a future caller
  reaching the Nth directly skips it.
- **Probe:** census the guard across all accessors that should hold it; find the one that relies on
  call-order instead of enforcing it directly.
- **Traps:** a delegation that genuinely always holds (a single caller, structurally guaranteed).
- **Floor:** an order-dependent invariant on tenant/data integrity = **Medium** (High if a second
  caller path already exists).

---

## F. Config / environment split (DL5-adjacent)

### F1. Invariant that lives inside an env/flag branch
- **Shape:** a guarantee is enforced only inside a branch gated by env/flag (a prod-only guard, a
  feature flag), so it holds in one environment and silently disappears in another - or a second
  entrypoint skips the guard entirely.
- **Probe:** grep every env/flag branch that gates a security/correctness invariant; ask "what is
  true in the other setting, and is there a path to the protected effect that skips this branch?"
- **Traps:** a guard genuinely enforced at every ingress; environments that are meant to differ.
- **Floor:** a security guard bypassable via a second ingress = **High.**

---

## G. Shared-resource / property coupling (DL7) - one module changes a property another assumes fixed

### G1. Rotatable secret reused as a KDF / encryption key for at-rest data
- **Shape:** a secret that another concern is documented to **rotate** (a session/JWT secret,
  rotated on schedule or on exposure) is *also* used as the key-derivation input or encryption key
  for a different module's at-rest data (OAuth refresh tokens, PII), with **no re-encryption /
  key-versioning path**. Rotating the secret - a routine, expected op - silently and permanently
  makes every stored ciphertext undecryptable.
- **Probe:** grep crypto sites (`hkdf`/`pbkdf2`/`createCipheriv`/`encrypt`), trace the key material
  to a named secret, then check that secret's rotation story (docs/CLAUDE.md) and whether any
  `reEncrypt`/`keyVersion`/envelope path exists. Rotatable + sealing at-rest data + no re-key path =
  candidate.
- **Traps to rule out first:** a dedicated, non-rotated key (fine); an existing key-version/envelope
  scheme; a documented "rotation invalidates X, re-connect required" decision (then it is accepted
  risk, cite it).
- **Concrete instance:** the rotatable session/JWT secret is *also* the HKDF input for the
  AES-256-GCM key that seals each tenant's stored third-party OAuth refresh token, with no
  re-encryption path; a routine secret rotation → every token undecryptable → every operation using
  that integration fails - and a sibling status read that never decrypts still shows "connected"
  (see G2).
- **Floor:** a routine op that permanently bricks a core flow or strands encrypted data = **High/Critical**.

### G2. Fail-open / fail-fatal asymmetry on decrypt/parse, with a stale "healthy" status
- **Shape:** two readers of the same resource treat a decrypt/parse failure oppositely - one path
  throws a hard 500 mid-operation, while a sibling **status** read that never decrypts still reports
  "healthy/connected" - so the system looks fine while every real operation fails, with no self-heal.
- **Probe:** for each decrypt/parse site, find every reader of the same resource; check which decrypt
  (and can throw) vs which only read metadata (and always look OK). Mismatch + a user-visible status
  that reads the non-decrypting path = candidate.
- **Floor:** silent, misleading-green breakage of a core flow = **Medium/High**.

### G3. Clock / timezone coupling
- **Shape:** one module reasons in the tenant's wall-clock zone, a sibling in UTC/server-local, over
  the same value (a slot time, a "is this in the past" check, a reminder trigger), so the two disagree
  by the offset - and by a full day across a DST boundary.
- **Probe:** place a wall-clock producer beside a UTC/server-local consumer of the same value; confirm
  both sites read before flagging. Pay attention to reminder/follow-up jobs consuming availability
  output.
- **Floor:** a booking/reminder off by an hour or a day = **High** (customer-facing scheduling error).

## Accepted / do-not-re-flag

- Any cross-module race the project has **documented as accepted** (a deliberate-shortcut comment,
  a "known deviations" ledger, a prior system-audit accepted-risk entry). Read these before
  flagging; record new accepted seams in the report's accepted-risk ledger so passes don't
  re-litigate them.
- Any single-file defect - it is a single-module audit's job, not a seam.

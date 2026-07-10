# Method: building the artifacts and running the probes

This is the concrete how-to for Phase 0 (profile), Phase 1 (seam inventory), and the Phase 2
probes. The commands are illustrative recipes - adapt the tokens to the project's real module
system, language, and data layer (resolved in Phase 0). They are shown for a TS/JS + Mongo repo
because that is a common shape; the *technique* is what transfers, not the exact grep.

## Table of contents
1. The stance that keeps this top-down
2. Phase 0 - enumerating the system-shaped slots
3. Phase 1 - the seam inventory artifact (format + how to build it)
4. Phase 2 probe recipes (per lens family)
5. The set-difference resolution procedure (anti-false-positive)
6. The fan-in matrix format
7. Context-budget rules (honesty over coverage)

---

## 1. The stance that keeps this top-down

The failure mode of every LLM auditor is: open a file, read it top to bottom, get absorbed in its
internals, and report what you find there. That is a single-module audit and it is not this skill.

Two mechanical habits prevent the collapse:

- **Traverse by seam, never by directory.** Your worklist is the Phase-1 inventory (entrypoint→
  sink pairs, multi-writer stores, import edges, registries) - never `ls src`. When you need a
  file, you open it to confirm *one contract at one seam*, extract that one line, and move on. You
  never read a file "to see what's in it."
- **Read signatures wide, bodies narrow.** Phase 1 reads only signatures, registries, and imports
  across the whole system (cheap, wide). Bodies are opened just-in-time in Phase 2, two at a time
  (the two sides of one seam), and dropped. If you are holding more than a couple of bodies, you
  have drifted into file-reading.

---

## 2. Phase 0 - enumerating the system-shaped slots

Each recipe produces a slot value (or "N/A"). Do not skip the N/A determination - a probe that
does not apply must be *recorded* as N/A, so the report proves you considered it.

- **Module inventory + public surface:** list top-level dirs under the source root; for each,
  find its public entry (a namespace export, an `index.*` barrel, an `__init__`, a package export
  map). `grep -rl "export namespace\|export \* from\|module.exports" <src>` and the directory tree.
- **Process/deploy/trust boundaries:** read the architecture doc for declared splits ("must lift
  out", "edge vs node", "client vs server"); confirm with build/deploy config. Trust boundaries =
  every file that parses an external request (routes, webhook handlers, tool-calls, queue
  consumers) and every auth guard. *N/A if a single process with one trust zone.*
- **Data model + ownership + reference graph:** find the store registry (a `collections.*`, a
  schema dir, migration files, ORM models). For each store, `grep -rl "<StoreName>"` to find its
  owning module. For the reference graph, list id-bearing fields (`*Id`, `*_id`, foreign keys) and
  note which store each points at. Tenant key = the field every domain row carries (`organizationId`,
  `tenant_id`, `account_id`); *N/A if single-tenant*.
- **External entrypoints:** `find` the route/handler files, webhook dirs, cron/job dirs, the
  startup hook, event-consumer registrations. This list becomes the roots of every trace.
- **Orchestration/wiring:** the startup/instrumentation file, middleware, DI container, framework
  lifecycle hooks (auth `afterDelete`, ORM hooks). These are where cross-module ordering lives.
- **Cross-cutting registries / responsibilities:** the single lists/rules that must be honored
  across a whole set. Common ones: a manual deletion cascade (*N/A if the DB does referential
  cascades*), the index/migration register, schema validators, the audit-action list, the set of
  tenant-scoped stores, the entitlement gate on spend paths, the idempotency ledger on external
  ingresses. For each, record **both** halves of its must-cover set: (a) the **data members** it
  must touch, and (b) the **trigger members** - every entrypoint/operation that must invoke it.
- **Destructive, lifecycle & spend operations + their entrypoints:** enumerate every operation
  whose correctness is a whole-system property, and *every entrypoint that can reach each*.
  - Destructive/lifecycle: `grep -rniE "deleteMany|deleteOne|drop\(|remove\(|cancel|deactivate|
    archive|teardown|purge"` and every framework lifecycle hook (auth `deleteUser`/org hooks,
    ORM cascade config). For each, ask: what *else* triggers this same teardown? (delete-account
    vs delete-org vs remove-member vs subscription-cancel). This is the **sibling-entrypoint hunt**.
  - Spend: `grep -rniE "purchase|buy|charge|createCall|sendSms|messages.create|completions|
    generate|synthesi[sz]e"` - every metered/paid external call, and every entrypoint that fans
    out to it.
- **Shared cross-module resources:** a resource whose property one module owns and another assumes.
  - Secrets as key material: `grep -rniE "hkdf|pbkdf2|scrypt|createCipheriv|createHash|encrypt\("`
    → find the key source; then check whether that secret has a documented **rotation** story and a
    **re-encryption/versioning** path. A secret that is rotatable *and* used to seal at-rest data
    with no re-key path is a DL7 candidate.
  - Clocks/zones: `grep -rniE "new Date\(|Date\.now|getHours|setHours|toISOString|timeZone|tz|UTC"`
    → note which sites reason in wall-clock vs UTC/server-local, and which cross a boundary.
  - Mutable config/flags an invariant rides on, connection/pool assumptions, id encodings.

---

## 3. Phase 1 - the seam inventory artifact

Write it to the scratchpad as markdown (it is throwaway navigation, not a committed oracle). Six
tables. **Every contract column is marked UNVERIFIED** until a body confirms it in Phase 2. The
**responsibility register is the highest-yield table** - it is where recall is won.

```markdown
## Modules & public surface
| module | public surface (file) | owns stores | imported by |

## Entrypoints → sinks   (trace roots)
| entrypoint (file) | trust level | modules traversed | terminal sinks (stores/effects) |

## Shared stores (>1 writer)   (the contract seams)
| store | writers (file:line) | readers (file:line) | id/unit contract [UNVERIFIED] |

## Cross-boundary import edges
| from module | to module/target | edge kind (public API / internal reach-in / framework / frontend) |

## Responsibility register   (TWO-axis set-difference - the recall engine)
| responsibility | data members (must-touch) | trigger members (must-invoke) | actually covered | candidates = must − covered (either axis) |

## Shared resources   (DL7 coupling)
| resource | property | who CHANGES it (rotate/reconfigure/zone) | who ASSUMES it stable (file:line) | re-key / reconcile path? |
```

### The sibling-entrypoint hunt (mandatory, per responsibility)

The single biggest recall miss is a *second entrypoint* that performs a destructive/spend/exposing
operation while skipping the responsibility the first one runs. So for every responsibility, do
not stop at the obvious trigger:
- **Teardown:** the obvious trigger is delete-account. Grep for every *other* way a tenant/parent
  is destroyed - `deleteOrganization`, `leaveOrganization`, `removeMember`, an admin purge, a
  subscription-cancel that should also release resources. Check each runs the same cleanup. (A common
  instance: a "delete organization/tenant" endpoint an auth/framework plugin exposes, client-callable,
  with **no** cascade hook - it orphans every tenant store the account-delete cascade would have swept.)
- **Entitlement:** the obvious trigger is the dashboard. Grep every spend path (each paid ingress/
  op) and check each consults the live-subscription predicate. A spend path that gates on none is
  the finding.
- **Idempotency:** for each at-least-once ingress, check not just the ledger but *each side effect*
  on its path (a new effect added beside a deduped one is often not itself replay-safe).
Fill the trigger-member column from this hunt; every uncovered trigger is a candidate.

Build commands (adapt tokens):
- **Import edges:** `grep -rn "from ['\"]@/<...>\|import .* from" <src>` bucketed by module; or a
  graph tool if the project already has one (`madge`, `dependency-cruiser`, `go mod graph`,
  `pydeps`). Use a tool only if already present - do **not** install one for the audit.
- **Writers of a store:** `grep -rn "insertOne\|updateOne\|updateMany\|bulkWrite\|deleteMany\|save(\|INSERT\|UPDATE" <src>` filtered to the store's collection/table name.
- **Readers of a store:** `grep -rn "find(\|findOne\|aggregate\|SELECT" <src>` filtered likewise.
- **Multi-writer stores:** any store whose writer list has length > 1 → a shared-state seam.

Then report inventory **size** and set the coverage frame: "N seams enumerated; coverage claimed
over these N only."

---

## 4. Phase 2 probe recipes (per lens family)

- **DL1 completeness set-diff (BOTH axes):** run the diff twice per responsibility. *Data axis:*
  must-touch set (the store registry / the enum's value space) minus the covered set (what the
  cascade/scoper/validator actually touches). *Trigger axis:* must-invoke set (every entrypoint/
  operation from the sibling-entrypoint hunt in §3) minus the set that actually invokes the
  responsibility. Output on either axis = **candidates**. Resolve each per §5.
- **DL2 boundary drift:** one query per declared boundary. E.g. framework-free layer: `grep -rn
  "<framework-import-token>" <that-layer>` (expect empty). Public-surface-only: `grep -rn
  "/internal/" <other-modules>` for reach-ins past a module's public API. Thin handler: open each
  route file, flag any that does more than parse + delegate. Each hit needs a proven consequence.
- **DL3 contract drift:** from the shared-stores table, for one field, quote the writer's assumed
  type/unit/optionality and the reader's - side by side. Open **both** bodies. Then grep for a
  bridge (a converter, a normalizer) before asserting drift.
- **DL4 fan-in matrix (reads/writes AND destroy/spend ops):** §6. Build the matrix not only for
  each shared data sink but for each **destructive/spend operation** from the Phase-0 census -
  every entrypoint that can reach it, and what identity/authz/entitlement/rate-limit each carries.
  The weakest row is the finding; a totally-ungated spend/destroy path is a finding even if its
  identity absence is "intended" (the missing *compensating* control is the bug).
- **DL5 state, ordering & fail-open:** `grep -rn "<statusField>\s*[:=]" <src>` for every writer of a
  lifecycle field → reconstruct the combined machine. For each at-least-once ingress, list every
  terminal side effect and ask, per effect: fires twice? out of order? after the referenced row
  exists? For each mirror of external state, grep for a reconcile/backfill/poll path; its absence
  with a drop-path in the handler is the finding. For each "resolve-then-serve" ingress, check the
  **unresolved/unentitled branch**: does it still return a working, billable result (no decline
  outcome)? For each decrypt/parse site, check whether failure is fatal on one path but a sibling
  status read still reports "healthy" (fail-open + stale status).
- **DL6 duplicate truth/rule:** grep the rule's vocabulary (`normalize`, `E164`, `active`,
  `entitled`, `toFixed`, `/ 100`) across modules; collect every implementation; diff edge behavior.
- **DL7 shared-resource coupling:** from the shared-resource table, for each resource find the
  *changer* and the *assumer*. Secret-as-KDF: locate the crypto site (`hkdf`/`createCipheriv`/…),
  trace its key material to a named secret, then check that secret's rotation story and whether any
  re-encryption/versioning path exists (grep `rotate`, `reEncrypt`, `keyVersion`). If the secret is
  rotatable and no re-key path exists → candidate. Clock/zone: place a wall-clock producer beside a
  UTC/server-local consumer of the same value. Confirm the coupling is real (both sites read) before
  flagging.

---

## 5. The set-difference resolution procedure (anti-false-positive)

A naive registry-vs-cascade (or enum-writer-vs-reader) diff **false-positives heavily** - in a real
repo it can fire on half the set. So the diff output is **candidates, never findings.** For each
candidate, open the enforcing accessor body and classify it:

1. **Covered via indirection** → DROP. The cascade/scoper touches it through a namespace accessor
   or a helper, not a literal store reference the grep matched. (E.g. `Customers.removeAllForOrg()`
   deletes the customer store without naming the collection constant.)
2. **Third-party owned** → DROP. A framework's own tables (auth's `user`/`session`, the migrations
   table) are legitimately absent from *your* cascade.
3. **Documented retention** → DROP, and cite the doc/comment. A store deliberately kept past
   deletion (an audit log on a TTL, a legal-hold record).
4. **Genuinely uncovered** → FINDING (subject to Phase 3). Label LIVE if it has a writer today,
   LATENT if the store exists but nothing writes it yet (name the future condition that makes it
   bite).

Bake these four categories into the probe so you actively rule out the first three before shipping
the fourth. Skipping this step is how the "highest-yield" probe becomes a false-positive minefield
that buries the one real orphan among ten legitimate absences.

**The same four categories apply to the trigger axis** (a sibling entrypoint that seems to skip a
responsibility): (1) covered-via-indirection - the sibling routes through the same cleanup one call
up; (2) third-party-owned - a framework endpoint that handles the teardown itself; (3) documented-
exemption - an operation deliberately exempt; (4) genuinely-uncovered → FINDING (a real destroy/
spend path that runs no cleanup/gate). Resolve every candidate trigger by reading its handler body -
never ship a trigger-axis set-diff raw.

---

## 6. The fan-in matrix format (DL4)

For each shared sink (a tenant-data accessor, an LLM-prompt builder, a spend call), grep every
caller, walk each up to its entrypoint, and tabulate:

```markdown
### Sink: <Module.method>  (file:line)
| entrypoint | identity source | per-object authz | tenant/authz key origin | attacker-influenceable? |
| dashboard action | session | membership check | session org | no |
| webhook / tool-call | shared bearer secret | none | request header/body | YES ← weakest |
```

The **weakest row defines the real posture.** A row whose tenant/authz key is attacker-influenceable,
or that lacks a per-object check its siblings have, is the finding - stated as the *missing
compensating control*, not as "it has no session" (a webhook legitimately has none; the bug is that
it also has no per-tenant binding).

---

## 7. Context-budget rules (honesty over coverage)

- The inventory is finite and countable **on purpose**: it is the only honest unit of coverage. A
  large repo will not fit in one context at the fidelity these checks need (both bodies of both
  sides of every seam). That is expected.
- **Claim coverage over the inventory, never over "the system."** Report the inventory size and
  which enumerated seams you did not examine and why.
- If even the inventory cannot be built within budget, **fail loud**: narrow to one boundary (one
  entrypoint's traces, one subsystem's seams), audit that fully, and say the rest is un-audited.
  Never sample silently and write a confident clean verdict - on money/PII infrastructure a
  silently-missed seam is the most expensive possible outcome.
- Prefer the multi-pass seam fan-out (SKILL Phase 5) to cover a large inventory: one sub-agent per
  seam, each handed only its two files. That is how you scale coverage without any single agent
  pretending to hold the whole repo.

## 8. Breadth discipline (recall)

Precision is a gate on each finding; recall is a duty over the whole inventory. So:
- **Prosecute every row.** The pass is not done at the first admissible finding - it is done when
  every responsibility-register row (both axes), every shared resource, and every multi-writer store
  has a verdict (finding / clean-with-reason / handed-off). A single finding is never a stopping
  condition.
- **An already-tracked gap is not a substitute for the untracked ones.** Reporting a known,
  TODO-listed gap is fine as the direct answer to the question - but keep going; the value of this
  skill is the seam nobody has written down yet.
- **Widen entry, not the gate.** If you fear slop, the fix is a stricter Phase-3 gate on each
  candidate - never a narrower inventory. A seam you never enumerate is a bug you can never find.

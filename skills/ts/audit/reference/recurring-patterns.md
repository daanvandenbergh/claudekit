# Recurring patterns

Bug archetypes that recur across audits regardless of stack. Scan for these first - they
are cheap wins and the failure modes most likely to repeat. Each is phrased as the
**shape** of the bug; resolve the project's actual vocabulary (helper names, field names,
APIs) from the Project Profile.

This file is meant to **grow per project**. When a pass finds a real bug, and especially
when the same shape appears in more than one module, add (or sharpen) an entry here with a
one-line "found in <module>" note. Over time this becomes the project's own bite-list - the
thing that makes the audit smarter on the next run instead of starting from zero.

## Seed archetypes (stack-neutral)

- **Untrusted data into an LLM/prompt.** User- or DB-sourced text returned to a model
  (tool-call results, retrieved documents, prompt templates) without sanitization at the
  boundary. Check every field of every tool/return value, not just the obvious ones.
- **Missing tenant-key filter.** A read, write, or aggregation over tenant-owned data that
  does not filter by the project's tenant key, or takes the key from the request body
  instead of the authenticated principal. For pipelines, the filter must be in the first
  stage, not the last.
- **Non-idempotent external event.** A webhook / queue message / retried call whose side
  effect (charge, booking, email, state change) is not guarded by a unique idempotency key
  with insert-or-ignore. External delivery is at-least-once; assume it fires twice.
- **Session-expiry not handled on every data path.** An auth-failure response (401/expired)
  that triggers sign-out on some fetch paths but not others. Enumerate every path; they
  drift apart over time.
- **Stale data on key change.** A cache/hook keyed on a dynamic value that keeps showing the
  old value after the key changes. Clear data and error state when the key changes and no
  cache exists for the new key.
- **Unbounded recursion over external structures.** Traversing a `.cause` chain, a tree, or
  attacker-influenced nesting without a depth bound.
- **Read-modify-write without atomicity.** Read a document, compute, write it back, with an
  `await` in between that another request can interleave on. Use an atomic/conditional
  update or a version field.
- **Both-variants drift.** A fix applied to the create path but not the edit path (or
  forward but not reverse), so one half stays broken.
- **A "never throws" surface broken by the stringification of its own refusal.** Template
  literals and `String()` THROW on a Symbol and on a null-prototype/poisoned-`toPrimitive`
  object, `Object.hasOwn` coerces (and throws on) its key, and `error.message` can be a
  poisoned getter - so the very code that phrases a refusal or classifies a caught error
  becomes the exception that escapes. Fix shape: ONE throw-proof safe-stringify chokepoint
  (fall back to `Object.prototype.toString.call`, which runs no user code) used at every
  caller-controlled interpolation, and every property read of a caller-returned object done
  INSIDE the try that guards the caller.
- **A permission verdict compared by truthiness fails OPEN on junk.** `if (!verdict.allow)`
  admits `{ allow: "false" }` straight off a JSON wire - the one gate that exists to stop
  the action then performs it. Compare `=== true`, never truthiness; anything else fails
  closed.
- **A type-level exclusion is not an exclusion - widened objects walk past it.**
  `Omit<T, "field">` + excess-property checks only reject FRESH object literals; a widened
  variable carrying the banned field assigns fine and the field goes over the wire. If the
  field is load-bearing, enforce it AGAIN at the runtime chokepoint (drop the key after the
  spread).
- **One vendor-SDK option silently disabling another.** e.g. an SDK that ignores its
  timeout entirely whenever a caller AbortSignal is present - wiring cancellation removes
  the whole timeout bound. Verify option INTERACTIONS in the SDK's source, not its
  docblocks; combine with `AbortSignal.any([callerSignal, AbortSignal.timeout(ms)])` when
  both must hold. Sibling traps: `AbortSignal.timeout()` rejects fractional input, and
  delays above 2^31-1 ms clamp to ~1 ms - ceil and cap any caller-supplied timeout.
- **Wire enums outlive the pinned SDK's union.** A status/reason string off the wire can be
  a value the installed SDK's type union does not know yet; a bare type assertion turns it
  into a lying "success". Runtime-allowlist the values you handle and fail closed (still
  reporting any usage/spend already incurred) on novelty.

## Accepted (do not re-flag)

- **TOCTOU in confirm-then-act.** The window between "show confirmation" and "act" is an
  accepted trade-off unless the module has a transactional alternative. Record as
  Informational; do not patch repeatedly.
- Anything the project's own standards doc explicitly sanctions, and anything already
  recorded under "Known Deviations" / "Assessed but not patched" in a prior pass.

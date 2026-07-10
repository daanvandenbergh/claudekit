## Modular Coding

Organize the codebase as a set of **(semi-)isolated modules**, each with one clear goal,
exposed through a single public surface - a namespace like `Auth`, `Payments`, or `Storage` -
instead of a sprawl of loose functions imported from all over. One module owns one domain.

**Keep all of a module's files together** - its logic, types, and tests - never scattered into
shared or global buckets elsewhere in the tree. If something belongs to a module, it lives in
that module's directory. Public files sit at the module root; anything that is not part of the
public API goes in an `internal/` subdirectory and is imported only from within the module.

```
users/                one module, one domain
  index             public surface -> the `Users` namespace
  types             public types and errors
  users.test        tests live with the module
  internal/         implementation not part of the public API
    hashing
```

**Depend freely; just don't sprawl.** Modules may import other modules - isolation is about
*where a module's own code lives*, not about avoiding dependencies. A small shared primitive
that many modules use (a `logger`, a `config`/`env` reader) is fine as its own module.

**Code lives in the module whose domain it concerns - even when you write it from somewhere
else.** While working in module A, if you reach for logic, a type, an error, a constant, or a
check that really belongs to module B (its domain, its data, its vocabulary), add it to B's
public surface and call it from A. Do **not** inline a B-shaped thing inside A. This holds even
when B does not have it yet and only A needs it today: **extend B, then import it**. That is
exactly the moment the mistake happens - you needed something from B, B lacked it, so you wrote
it where you stood instead of where it belongs.

Examples:
- A "does this user exist?" check and its `UserNotFoundError` live on `Users`; `Orders` calls
  `Users.assertExists(id)` rather than re-implementing the lookup.
- Duplicate-key / unique-constraint detection is a generic storage concern - one
  `Storage.isDuplicateKey(err)` helper, not the same check copy-pasted into every module that
  writes.
- Money rounding and currency formatting belong to `Payments`, not re-derived in each view or
  report that shows a price.

Smell test when deciding where something goes: name the thing, then ask *whose domain that name
belongs to* - not who happens to call it first. Own it where the domain lives, not where it is
first used.

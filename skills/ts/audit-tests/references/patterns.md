# House-style test patterns

**The project's own strongest test is the real reference - copy its shape.** These two skeletons
are the universal fallback (in a vitest/TypeScript idiom; translate to the project's runner), plus
the one gotcha that bites every dependency-backed or config-dependent test. Wherever the project's
existing tests differ from what is below, the project wins.

## Pattern A - pure logic (no external dependency, no config)

For framework-agnostic functions with no side effects (a formatter, parser, slug/id helper,
redactor). Just import and assert.

```ts
/**
 * Tests for `<thing>`: <one line on the contract> and <why the edge cases matter>.
 */
import { describe, expect, it } from "vitest";

import { normalize, InvalidInputError } from "<the module, imported exactly as the app imports it>";

describe("normalize", () => {
    it("collapses different formats of the same value to one canonical form", () => {
        expect(normalize("<form A>")).toBe("<canonical>");
        expect(normalize("<form B>")).toBe("<canonical>");
    });

    it("throws with the offending raw input on the error", () => {
        try {
            normalize("nope");
            expect.unreachable("should have thrown");
        } catch (error) {
            expect(error).toBeInstanceOf(InvalidInputError);
            expect((error as InvalidInputError).raw).toBe("nope");   // the error carries what was rejected
        }
    });
});
```

## Pattern B - dependency-backed (anything that touches a DB, queue, or other external dep)

Prefer the project's real test double over a mock. A unique index, a per-document write lock, a
duplicate-key error - these exist only in the real dependency, and they are usually exactly what
you are testing. If the project ships an in-memory server or fake (e.g. an in-memory DB replica
set, a fake queue), use it; only fall back to mocking when no double exists.

```ts
/**
 * Integration tests for `<X>` against a real (in-memory) <dependency>.
 * These exercise what pure unit tests cannot: <idempotency / isolation / referential
 * integrity / index-backed races>.
 */
import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";

let dep;          // the in-memory dependency handle
let mod;          // the module under test

beforeAll(async () => {
    dep = await startInMemoryDependency();
    // Set every config/env var the module needs BEFORE importing it (see the gotcha below).
    process.env.WHATEVER_URI = dep.getUri();
    process.env.WHATEVER_REQUIRED_SECRET = "x".repeat(40);

    // GOTCHA: import AFTER config is set. A static top-of-file import would read config first.
    mod = await import("<the module under test>");
    await mod.setupSchemaOrIndexes?.();          // if the test relies on a unique index / schema
}, 120_000);                                     // first-run boot of a real dependency can be slow

afterAll(async () => {
    await dep?.stop();
});

beforeEach(async () => {
    await dep.reset();                           // isolate each test - clean state between them
});
```

Helpers seed prerequisite state directly (e.g. insert a bare parent record so a child has a valid
referent), then the tests call the module and assert behavior.

## The config/env gotcha, restated

Many projects validate configuration **at import time** and throw on a missing required var. Any
module that transitively imports that config inherits the trap. So in dependency-backed or
config-dependent tests, set the config first, then dynamically `import(...)` the module under test -
static imports run before the setup hook and read an unconfigured environment. Pure-logic modules
with no config dependency can import statically. Confirm which case you are in from the project's
existing tests.

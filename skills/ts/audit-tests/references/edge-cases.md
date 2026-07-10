# Edge-case checklist

Walk **every** category against the target and write down the concrete inputs it implies for
*this* code. A category that clearly cannot apply gets a one-line "n/a because ...". Everything
else becomes tests. The categories are universal; the examples are illustrations - translate each
into this project's own vocabulary and failure surface (its ids, its limits, its dependencies).

### 1. Empty / absent / whitespace
Empty string, `"   "` (whitespace-only), `undefined`, `null`, empty array, empty object,
missing optional field, `0`, `NaN`. For every string input ask: what does whitespace-only do?
A `capitalize("")` must not throw. A search for `"   "` must return an empty result, not scan
everything.

### 2. Boundaries (off-by-one is where bugs live)
For any limit/cap/length: test `n-1`, `n`, `n+1`. If a list caps at N, test the Nth (accepted),
the N+1th (refused, list stays at N), and re-adding an existing one at the cap (idempotent no-op).
Pagination: `limit: 0` -> default, oversized limit -> clamped to MAX, negative offset -> clamped to
0, a "has more" flag true at the page edge and false past it. Oversized inputs: a huge input must
be sliced/rejected, not blow up downstream.

### 3. Idempotency (external events arrive at-least-once)
Same operation twice = one record, the second call does not overwrite the first's fields. If a
natural key exists, different representations of the same key collapse to one record. For webhooks/
external events: the same event ID processed twice hits the unique constraint and is treated as
already-processed, not double-applied.

### 4. Concurrency races
Fire N concurrent calls and assert convergence: N first-creates of the same key -> exactly one
record, all callers adopt the winner. N distinct appends past a cap -> exactly the cap admitted,
the record never breaches it. These pass only because of a real unique index and write lock - so
use the real (in-memory) dependency, never a mock.

### 5. Isolation / scoping (a record never crosses its boundary)
If records are scoped (per tenant/org/user/account), assert: reading/updating/deleting another
scope's record returns null/false and leaves it untouched; the same natural key in two scopes is
two separate records; a bulk delete removes only its own scope and returns the right count. This is
usually a security boundary - test it on every path, not just the read.

### 6. Referential integrity (no foreign keys in schemaless stores)
Writing a record that references another must verify the referent exists first. Test both a
reference that is **well-formed but absent** and one that is **syntactically invalid** - the second
should be rejected without a round-trip to the dependency. Expect the specific error type.

### 7. Injection / metacharacters treated literally
User input that reaches a regex, query, or command must be escaped. A search for `".*"` or a
query-operator string must match literally (return nothing), not act as a pattern/operator. Test
the metacharacters, not just alphanumerics.

### 8. Malformed external payloads (validate at the trust boundary)
For any schema (webhook/request/config): missing required field, wrong type, `null` where a string
is expected, extra unexpected fields, a string that should coerce vs one that can't, wrong enum
value. If config fails fast at boot, test that a missing/invalid required var throws and a valid set
parses.

### 9. Unicode / casing / normalization
Where identity is case-insensitive, `A@x.com` and `a@x.com` are the same identity - guards must
normalize before comparing (a classic real bug). Normalize-then-compare inputs (phone numbers,
usernames, paths) collapse their variants to one canonical form. Case-insensitive search must match
a lowercase query to a mixed-case value. Include a non-ASCII value.

### 10. Money (when the project handles it)
Integer minor units (cents), never floats. Assert a value stored as `1000` reads back `1000`, and
that no code path produces `10.0`/`9.999...`. A float for money is a bug the test must catch.

### 11. Time (make it deterministic)
Never assert against the wall clock. If code stamps `createdAt`/`updatedAt` or computes a TTL,
inject or freeze the clock so the assertion is stable; assert monotonicity (`updatedAt >=
createdAt`) rather than an exact instant. Relative-date fixtures must not elapse into failure.

### 12. Error identity and payload
Assert the **specific** error type, not a bare "it threw". And assert the error carries the
offending input (e.g. `error.raw === "nope"`) - a caller needs to know *what* was rejected, so that
contract deserves a test.

### 13. Round-trip through the dependency, and no internal-id leak
Assert the value persists by re-fetching from the dependency, not just by reading the returned
in-memory object - they can differ. And assert an internal storage id (e.g. a DB `_id`) never leaks
onto a returned domain object when the mapping to a public `id` is a contract.

### 14. Secrets never logged
For anything that logs, assert secrets are redacted - an API key, token, `Authorization` header, or
a connection string with credentials must not appear in emitted log lines.

### 15. Deletion cascade
When a record is linked to a parent (user/org/account), deleting the parent must delete or
reassign it - no orphans. Any collection linked to a parent needs a test that removing the parent
leaves nothing behind.

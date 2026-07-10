# Severity model (seam findings)

Four levels plus Informational, applied to **cross-module seam findings**. Examples are
stack-neutral - read them as shapes. Severity is set by the **demonstrated blast radius of the
trace**, never by how dramatic the design smells.

> If the project ships a sibling single-module audit skill with its own severity file, defer to
> that one so the two reports interoperate. This file exists so the skill is self-contained when
> dropped into a project that has no such sibling.

| Severity | Code | Definition | Seam examples | Action |
|----------|------|------------|---------------|--------|
| **Critical** | `C` | A seam defect that **already** causes cross-tenant data exposure, data loss, financial loss, or breaks a core flow. | Alternate-path tenant bypass writing another tenant's rows; a unit/scale drift charging 100x; a retried non-idempotent effect double-charging; a cross-store id-encoding mismatch that silently orphans data on deletion; a bypassed tenant-stamp chokepoint. | Fix immediately (with `--fix`). Block the verdict until patched. |
| **High** | `H` | A seam defect **reachable under realistic conditions** but not yet shown to have caused damage, or a clear cross-module logic error. | An orphaned-cascade store holding PII; an access gate that fails open on an unhandled enum value; a mirror that goes stale with no reconcile; a multi-store unit of work with no transaction; a lift-blocking import in a layer declared extractable. | Always report; fix in the pass it is found (with `--fix`). |
| **Medium** | `M` | A cross-module correctness issue with limited blast radius or reachability. | An order-dependent invariant that holds today but breaks if a second caller path is added; a dangling reference on a non-core flow; an unevenly-applied concern on a low-traffic path. | Report; fix unless a documented cross-module blocker. |
| **Low** | `L` | A minor cross-module inconsistency or low-probability seam edge case. | A duplicate rule whose copies happen to agree today but could drift; a cosmetic contract mismatch with no wrong outcome. | Report; fix unless disproportionate. |
| **Informational** | `Info` | A boundary drift with **no reproducible failure trace**, an accepted cross-module trade-off, or a stale-doc-vs-code note. | A declared-boundary violation with no provable consequence; a documented accepted race. | Document only. Never affects the verdict. |

## Do not downgrade out of habit

If a seam bug touches **money, tenant isolation, idempotency, data-lifecycle/deletion, or a core
user flow, it is Critical or High** - not Medium. This is exactly where the temptation to soften is
strongest, because *each individual file looks defensive*. The whole point of this skill is that
local defensiveness is not global correctness: the blast radius is set by what the composed system
does, not by how careful either file looks in isolation. Give a seam bug the severity its trace
earns.

## No trace, no severity

A candidate with no reproducible input→wrong-outcome trace is **not a Low** - it has no severity at
all. It moves to the report's non-blocking **Design observations** section and never touches the
verdict. Severity is a claim about a demonstrated failure; if you cannot demonstrate it, you do not
get to assign one. (And the converse: a trace-backed finding may never be parked in Design
observations to make the report look tidy - a real Critical stays a Critical.)

## The verdict

The audit's verdict is the **worst unfixed severity**, stated in one line. Any unfixed Critical or
High = **do not ship.** A clean pass reports "No admissible findings over the N-seam inventory" and
lists what was examined - it never says "the system is clean."

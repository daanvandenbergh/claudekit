> **Phase 05 - Scope and rules of engagement**
> **Consumes:** `PROFILE` (00).
> **Produces:** `SCOPE` - the risk appetite, compliance regime, exclusions, and egress consent that
>   later phases read. **Reads other phases' internals: NEVER.**
> **Gate:** blocking. A real engagement scopes before it scans - this is that step.

# Phase 05 - Scope and rules of engagement

A professional assessment names its scope, its risk appetite, and its exclusions up front (PTES
pre-engagement). This phase does that in one short interaction, then encodes the answers as `SCOPE`
so nothing downstream has to guess. Keep it to the few questions whose answer actually changes what
the audit does; default sensibly and say what you defaulted.

## 05.1 In / out of scope

Confirm the scoped subtree (from the scope hint, if any) and the **exclusions**: vendored code,
generated code, test fixtures, and any path the user declares off-limits. Exclusions bound the
Phase-40 mop-up long tail - an excluded file is recorded in COVERAGE as `excluded: <reason>`, never
as residue, and never silently skipped. Default: whole project, standard exclusions
(`node_modules`, build output, lockfiles, vendored dirs), each with a stated reason.

## 05.2 Risk appetite -> the verdict threshold

Ask what severity **blocks** vs merely **advises**. Default: any unfixed Critical or High = do not
ship (the house default, `reference/severity.md`). A team may raise the bar (block on Critical only)
or lower it - record the choice; `phases/60-report.md` reads it for the verdict. This is the only
place the block threshold is set; do not hard-code a different one elsewhere.

## 05.3 Compliance regime (optional)

Ask which regime, if any, the project answers to: SOC 2, PCI-DSS, GDPR, HIPAA, ISO 27001, or none.
If one is named, Phase 55 runs and maps findings to that regime's code-verifiable controls
(`reference/compliance-map.md`); if none, Phase 55 is a stated N/A, not a silent skip. **Never infer
a regime the user did not name, and never let this become a compliance claim** - the skill produces
evidence toward controls, never a verdict on them.

## 05.4 Egress consent

Two audit actions leave the machine, and both are off unless the user opts in here (or via the
flag): TruffleHog live secret-verification (`--verify-secrets` - authenticates to the vendor with the
candidate credential) and any network-dependent scanner step (osv.dev queries, `--licenses` via
deps.dev). In an air-gapped or client-owned environment, record "no egress" in `SCOPE` and the
scanners degrade to their offline modes, each noted in the coverage table.

## 05.5 Emit SCOPE

Record: the scoped paths + exclusions (with reasons), the block threshold, the compliance regime (or
`none`), and the egress posture. Print it back in one short block so the user can correct a wrong
read before the audit spends any budget - a scope the user cannot see is a scope they cannot fix.

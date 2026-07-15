# Severity model

One scale, shared by every phase. It is the sibling `/audit` scale (so the two reports
interoperate) plus one security-specific move: **the vendor's number is only an input - what a
finding is worth to THIS project is set by whether an attacker can reach it.**

Two axes, and they are **independent - never multiplied** (multiplying them is exactly how a
confident "all clear" once buried five real bugs):

- **Severity** = impact IF the finding is real.
- **Confidence** = how sure the finding is real.

A tenant-isolation bypass is **Critical** whether you are 95% or 55% sure. Report it at Critical
with the confidence stated (`severity: Critical, confidence: unproven, status: candidate`). Lower the
confidence field, never the severity.

**Confidence is an ENUM, not a raw number.** The field of record on every finding
(`reference/finding-schema.md`) is one of `confirmed | probable | unproven | refuted`. Where the
verification protocol reasons in numbers (the emit matrix in `reference/verification.md`), map them
by this fixed crosswalk so two readers never bucket the same finding differently:

| Numeric band | Enum | Meaning |
|---|---|---|
| `>= 0.8` | `confirmed` | trace holds / positively demonstrated (set only by Phase 50, never the sweep) |
| `[0.5, 0.8)` | `probable` | a concrete finding, some gate unresolved |
| `< 0.5` | `unproven` | a real gate could not be resolved - **reported at full severity, never dropped for a floor class**; cite the unresolved gate |
| refuted on the closed R1-R7 list | `refuted` | positively disproven |

Bands are half-open (`0.8` is `confirmed`, not `probable`). `unproven` is a confidence value, never a
`status`; the ledger `status` stays `candidate` until Phase 50 admits or rejects it.

## The scale (impact if real)

| Severity | Code | Definition | Examples |
|----------|------|------------|----------|
| **Critical** | `C` | Already causes, or an attacker can directly cause, data corruption/loss, a breach, financial loss, or a broken core flow. | Unauthenticated sensitive endpoint; a query missing the tenant filter (IDOR/BOLA); a secret in the client bundle or git history; RCE via injection/deserialization; a non-idempotent webhook that double-charges; money math on floats; mass-assignment of `role`. |
| **High** | `H` | Exploitable/reachable under realistic conditions but not yet damaging, or a logic error with a clear failure path. | Missing validation allowing an oversized/malformed write; an injection vector via one unsanitized field; SSRF that can reach internal services; a swallowed error hiding a real failure; a cost-DoS path; a timing-unsafe compare guarding a webhook signature. |
| **Medium** | `M` | A correctness/security issue with limited blast radius or exploitability. | Missing sanitization on a low-traffic field; a broken non-critical state transition; a missing index; an XSS reachable only in the attacker's own DOM (self-XSS is Low - this is the cross-user-but-narrow case). |
| **Low** | `L` | A hygiene issue, minor inconsistency, or low-probability edge case. | `latest` base-tag; a missing non-sensitive header; a redundant guard; naming; an unpinned GitHub-owned action. |
| **Informational** | `Info` | A theoretical edge case, an accepted trade-off, or an observation. | TOCTOU in a confirm-then-act pattern **with no state-changing / money / security effect** (a real balance/quota/counter race is Critical/High per SEC-BL1 - never borrow this Info label for it); a deprecated header (`X-XSS-Protection`) whose absence is correct; a documented accepted risk. |

## Do not downgrade out of habit

**A finding that touches money, auth, tenant isolation, idempotency, credentials, deletion, or a
core user flow is Critical or High - not Medium.** Do not soften it because the call site "looks
defensive." The deep-logic and business-logic classes are exactly where a biased reviewer is
tempted to soften, and exactly where the expensive bugs live.

## The exposure modifier (the security-specific part)

Severity is computed, not chosen freehand, and **the arithmetic is printed on every finding** -
that sentence is the deliverable, because it is the thing the reader can disagree with:

```
C (CVSS 9.8, RCE) + E0 (devDependency, absent from the deploy bundle)  ->  LOW
H (semgrep ERROR)  + E4 (unauthenticated webhook, no gate)             ->  CRITICAL
```

Start from the vendor base (below), then apply the exposure class:

| Class | Meaning | Effect on the base |
|-------|---------|--------------------|
| **E0** | Not in the shipped artifact (dev dep, build script, test fixture), reachability-proven | **Cap at Low** - never zero (a dev-dep RCE is still a laptop/supply-chain risk) |
| **E1** | In prod code, but every input source is a server-constant | **-2 levels**, floor Low |
| **E2** | Reachable behind auth, partial compensating control | **-1 level** |
| **E3** | Reachable; an authenticated user drives the input | **base, unchanged** |
| **E4** | Reachable from an **unauthenticated** entrypoint (public route, webhook, LLM tool surface) | **+1 level**, cap Critical |
| **E5** | Reachable **and** touches money, tenant isolation, credentials, or deletion | **floor High; Critical if also E4** |
| **unknown** | Exposure could not be resolved (`unproven`) | **assume E4** (+1 level) - the unknown case fails TOWARD severity, never away from it. (E3 would be neutral, not fail-safe.) |

**The classes are NOT mutually exclusive - apply the HIGHEST-numbered class that holds.** A finding
can be both E4 (unauthenticated) and E5 (touches money): E5 is the higher class, so its rule governs
(floor High; Critical when it is also E4). Never pick a lower class when a higher one applies; when
two both apply, the higher number wins and any "also E<n>" clause on it still fires.

## Vendor base severity (for scanner findings)

| Source | Base |
|--------|------|
| **osv-scanner** | CVSS >=9.0 -> C; 7.0-8.9 -> H; 4.0-6.9 -> M; <4.0 -> L. `max_severity` empty (many advisories carry no CVSS) -> **Unknown tier, never silently L**. An Unknown-tier finding is **treated as High** for ranking and the ship-verdict until a human rates it (so the exposure modifier still applies and it sorts into the verdict rather than becoming unrankable). |
| **semgrep** | `ERROR` -> **H** (not C - its rules have no blast-radius knowledge; let exposure lift it); `WARNING` -> M; `INFO` -> L. Rank within a band by `confidence x (likelihood + impact)`. |
| **gitleaks** (no severity) | By secret class: a live-credential class (cloud key, DB URI with creds, payment/telephony/LLM key, private key, signing secret) -> **C**; generic high-entropy -> **H**. **A secret in git HISTORY is Critical until proven rotated OR proven never-live** - "it is in `.env.example`" is a refutation only with evidence the value is not a valid credential. A secret in the working tree but NOT history is *not yet leaked*: gitignore it, rotate only if it ever reached a remote - a separate, lower finding. |
| **LLM sweep / invariant hunt** | No vendor number; severity is the lens's stated Floor plus the exposure modifier and the anti-downgrade rule. |

## Rating of record: qualitative, CVSS is secondary

The **qualitative Likelihood x Impact** rating above is authoritative and it is what orders the
report. CVSS was built for a vendor scoring a CVE for a world of *unknown* deployers - but this
skill knows the deployment, so CVSS is the wrong primary: a "5.3 medium" info-leak that exposes
call recordings is a GDPR breach, and a "9.8 critical" RCE in a dev-only seed script is nothing.

- **Likelihood** = which caller class can reach it x how hard the precondition is.
- **Impact** = which crown jewel it touches x blast radius (one record -> one tenant -> all
  tenants -> the platform).

State it in one sentence: *"Reachable by any authenticated user of any tenant; reads all tenants'
call audio -> Critical."* A **CVSS v4.0 vector may be emitted only as an optional secondary field**
tagged *"for external comms (questionnaires, SOC 2); the qualitative rating is authoritative"* - it
must never reorder the findings.

## Verdict

The audit's verdict is the **worst unfixed severity**, qualified by coverage. Any unfixed Critical
or High = **do not ship**. And **any High-or-above finding at `unproven` confidence BLOCKS** - the
skill may not ship on "I couldn't prove it." The verdict vocabulary contains no word an
over-refuted or partial scan can reach (`60-report.md` owns the exact strings). **Never "clean",
never "secure", never "no issues found."**

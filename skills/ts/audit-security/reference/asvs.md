# OWASP ASVS as the completeness net

ASVS is a **net, not a hunting dog.** It asks *"is control X present?"*, never *"is there a bug here?"* - so it
runs **after** the threat-model-directed sweep (Phase 40), as a completeness backstop that catches the
categories the hunt did not think to look for. It never decides *where* to look; the threat model does that.

A codebase can pass ASVS L2 cleanly and still be trivially ownable through a business-logic flaw ASVS has no
requirement for. So the sweep is the discovery engine; this pass is the checklist that proves no *category* was
skipped.

## Use 5.0.0, and the reason it is the right spine

We pin **ASVS 5.0.0** (345 requirements, 17 chapters). The version choice is load-bearing: 5.0 **deleted** the
old "V1 Architecture" and "V10 Malicious Code" chapters **because they were not verifiable from source** - which
is the exact principle this whole skill runs on. Even OWASP concluded that unverifiable requirements do not
belong in a verification standard.

The 17 chapters:

| | | | |
|---|---|---|---|
| V1 Encoding and Sanitization | V6 Authentication | V11 Cryptography | V16 Security Logging and Error Handling |
| V2 Validation and Business Logic | V7 Session Management | V12 Secure Communication | V17 WebRTC |
| V3 Web Frontend Security | V8 Authorization | V13 Configuration | |
| V4 API and Web Service | V9 Self-contained Tokens | V14 Data Protection | |
| V5 File Handling | V10 OAuth and OIDC | V15 Secure Coding and Architecture | |

## Level: L2 by default (`--level` overridable)

- **L1** is designed to be checkable *without* source access - using it in a source-led audit throws away the
  whole advantage, and it is too weak for anything handling payments or PII.
- **L2** (253 requirements at L1+L2) is scoped by OWASP itself at "applications handling sensitive data -
  logins, personal data, payments." That is the default target class. Use it unless the host asks otherwise.
- **L3** adds ~92 requirements of catastrophic-failure defence-in-depth (avionics, medical) that bury a
  startup's report.

## Do NOT fan out one agent per chapter

Two reasons, both from the data:

- **Chapters are wildly unbalanced.** V6 Authentication has 47 requirements; V9 Self-contained Tokens has 7.
  One-agent-per-chapter hands one agent 7x the work of another and calls it parallelism.
- **~22% of L1+L2 requirements are not verifiable from source at all** - they reference documentation, a
  policy, or a process, not code.

So fan out **6-8 TOPIC-GROUPED, applicability-gated groups** - grouped by subject and *roughly* balanced, not
strictly equal-sized (a topic that must be reasoned about together, like G4's session+token+OAuth trio, wins
over perfect balance; the `Rough L1+L2 reqs` column below is the real spread, ~16 to ~54, and that is fine).
If a group's live req count after applicability-gating still dwarfs the others (e.g. G4 stays at 54 while G5
drops to 10), split the big one across two agents - balance is achieved by sharding the outlier, not by
mis-grouping unrelated chapters. Adjust to the host's stack; skip a whole group when Phase 0 shows it does not
apply (V10 OAuth-provider reqs for an OAuth *consumer*, V17 WebRTC for an app with no WebRTC):

| Group | Chapters | Rough L1+L2 reqs |
|---|---|---|
| G1 Input & output | V1 Encoding/Sanitization, V2 Validation & Business Logic | ~38 |
| G2 Frontend & API | V3 Web Frontend Security, V4 API & Web Service | ~29 |
| G3 Identity | V6 Authentication | ~35 |
| G4 Session & tokens | V7 Session Management, V9 Self-contained Tokens, V10 OAuth/OIDC | ~54 |
| G5 Access control & files | V8 Authorization, V5 File Handling | ~16 |
| G6 Crypto & comms | V11 Cryptography, V12 Secure Communication | ~23 |
| G7 Config & data | V13 Configuration, V14 Data Protection, V15 Secure Coding & Architecture | ~35 |
| G8 Logging & realtime | V16 Security Logging & Error Handling, V17 WebRTC | ~23 |

Each group agent reads its chapters' requirements from the vendored JSON, filters to the active level, and
audits the codebase against each one.

## Every requirement gets one of four verdicts, with `file:line` evidence

- **Pass** - the control is present; cite where.
- **Fail** - the control is required, applicable, and absent/broken; this becomes a finding in the shared
  schema.
- **N/A** - the requirement does not apply to this app (no WebRTC, no file upload); state why.
- **Not-Assessable** - the requirement needs an artifact outside the source (documentation, a process, evidence
  of a review). **Neither a pass nor a fail. It was not verified.** Count it honestly - marking it Pass is a
  lie, marking it Fail is noise. The report states how many were Not-Assessable and why (see the honesty
  clause in `phases/60-report.md`).

**The over-Not-Assessable tripwire** (Not-Assessable is the ASVS equivalent of over-refutation - an agent can
dodge a genuine Fail by mislabelling the absent control "needs a doc"). Two guards: **(1)** every
Not-Assessable verdict MUST name the *specific* external artifact it is waiting on (a named policy, a config
value only set in the deploy env, a review record) - "cannot assess" with no named artifact is not allowed; it
is a Fail or a Pass. **(2)** the ~22% figure above is the expected baseline for L1+L2; if a group's
Not-Assessable rate materially exceeds it, the report prints `ASVS COVERAGE SUSPECT` for that group and the
requirements are re-run by a fresh agent told "a control absent from the code is a Fail, not Not-Assessable -
Not-Assessable is only for a requirement the source genuinely cannot speak to." Same shape as the discovery
over-refutation tripwire in `reference/verification.md`.

## The data: `reference/asvs-5.0.0.flat.json` (pinned, vendored, never fetched)

Shape:

```json
{ "requirements": [
  { "chapter_id": "V6", "chapter_name": "Authentication",
    "section_id": "V6.2", "section_name": "...",
    "req_id": "V6.2.1", "req_description": "Verify that ...",
    "L": "2" }
] }
```

Load it from disk, filter `requirements` by `L` <= the active level, group by the table above, hand each group
to its agent. **Never fetch it at runtime** - a security audit that must pull a mutable `latest` tag over the
network in order to run is a supply-chain joke at its own expense. To bump the pinned version, replace the file
deliberately and note the version in this doc.

`L` is a string (`"1"`/`"2"`/`"3"`); at L2, take requirements whose `L` is `"1"` or `"2"`.

---
name: audit-tests
description: Hunt untested and under-tested logic in whatever project this runs in and write meticulous, edge-case-exhaustive unit tests until coverage is total. Learns the project's stack, test runner, and house style first, measures real coverage (installing the tool if missing), triages every source file, then writes tests that match the existing suite and verifies them green. Use whenever the user wants to write or add unit tests, improve/increase test coverage, find untested code, hunt edge cases, harden the test suite, reach "100% coverage", or run a periodic coverage audit - even if they only say "are we fully tested?" or "add more tests". Runnable repeatedly; each run finds the next-biggest gap itself.
user-invokable: true
argument-hint: "[module-path or file, optional - omit to audit the whole project]"
---

# audit-tests

A portable skill. **Nothing about any project is baked in** - it learns the project first
(Step 0), then finds code that is not thoroughly tested and makes it thoroughly tested. The bar
is not "a test exists" - it is "every branch, boundary, and adversarial input that could ever
break this in production has a test that fails when it breaks". The reference for that bar is
whatever the project's strongest existing test is - you find it in Step 0 and match it.

Coverage tools measure whether a *line ran*. They do not measure whether a *behavior was
asserted*. A line can be 100% covered by a test that asserts nothing meaningful. So this
skill uses the tool to find the objective gaps (lines/branches/whole files never touched)
**and** reads the code adversarially to find the semantic gaps the tool is blind to. Both.

## Step 0 - Learn this project (every run starts here)

Before measuring anything, discover the project so the tests you write are *this project's*, not
generic. Gather and keep as working notes for the run:

- **Stack & language.** Read `CLAUDE.md` / `AGENTS.md` / `README`, then the manifest
  (`package.json`, `pyproject.toml`, `go.mod`, `Cargo.toml`, `Gemfile`, ...). What language, and
  what is the **test command** (an npm `test` script, `pytest`, `go test ./...`, `cargo test`, ...)?
- **Test runner & convention.** Find how tests are already written: the runner (vitest, jest,
  node:test, pytest, go's testing, ...), where test files live and how they are named
  (`tests/` subdir vs `*_test.go` beside source vs `test_*.py`), and the assertion library. The
  existing layout is law - follow it, don't impose one.
- **House-style reference.** Open the 1-2 strongest existing tests. Their structure, naming,
  docstrings, and how they set up dependencies (real vs mocked) are your calibration target for
  everything you write. `references/patterns.md` shows the two universal skeletons; the project's
  own best test overrides it wherever they differ.
- **Coverage tool.** Determine how to measure real coverage in this stack, and whether it is
  installed (see Step 1). The one non-negotiable: it must report files that **no test imports**,
  not just files some test touched (see the `all` note in Step 1) - otherwise the worst gaps are
  invisible.
- **Scope surface.** From the architecture docs and the tree, decide what holds correctness-
  bearing logic (business/domain/backend modules, pure helpers) versus what is framework glue,
  views, generated code, type-only files, or trivial constant registries. See "Scope" below for
  the reasoning; the *paths* are whatever this project uses.
- **Bootstrap gotcha.** Check whether config/env validates at *import time* (a common trap: a
  module throws on a missing var the moment it is imported) and whether the project has test
  doubles for external deps (in-memory DB, fakes, fixtures). The existing tests reveal both -
  copy their setup.

If the discovered facts are non-obvious or you had to guess, state your read in the report so the
user can correct it.

## Scope: what gets tested here

Reason about scope per project; the categories are universal even though the paths are not.

**In scope - the logic where correctness lives:**
- Business/domain/backend modules and any framework-agnostic logic.
- Pure helpers and data/logic files (formatting, parsing, pricing, slug/id, redaction, ...).

**Out of scope by default (say so in the report, do not silently skip):**
- View/markup components when the runner has no DOM/render harness - testing markup is low-value
  and setting up a component harness is opt-in, not something to do unprompted.
- Thin adapters/controllers that only parse a request and delegate - test the delegated logic, not
  the adapter.
- Framework-wiring modules exercised through an integration test rather than directly.
- Type-only files and trivial constant registries - nothing to assert. Skip with a one-line reason.

If the user passes a path, scope to it. If not, audit the whole in-scope surface and pick the biggest gap.

## Workflow

Work **incrementally**: close the single biggest gap thoroughly, verify it green, report. A
huge unreviewable diff that touches every file is worse than one module made bulletproof.
When run periodically, this naturally advances - the biggest gap is different each time.

### 1. Measure

If coverage tooling is not installed, install the provider that matches the project's runner - a
one-time repo improvement, not per-run churn - and add a scoped coverage config if absent. The
principle that matters in every stack: **report every in-scope file, including ones no test
imports.** A file with no importing test reads as *absent* rather than *0%* unless you force it in.

Concrete examples (use the one matching the discovered runner; adapt to others):

- **vitest**: `npm i -D @vitest/coverage-v8`, then in `vitest.config.ts` `test.coverage`:
  `{ provider: "v8", all: true, include: [<in-scope globs>], exclude: ["**/tests/**", "**/*.d.ts"], reporter: ["text", "json-summary"] }`. `all: true` is the "count uncovered files" switch.
- **jest**: `collectCoverage: true` + `collectCoverageFrom: [<in-scope globs>]` (the analog of `all: true`).
- **pytest**: `pytest --cov=<pkg> --cov-report=term-missing` (point `--cov` at the source package so untouched modules still count).
- **go**: `go test ./... -coverprofile=cover.out && go tool cover -func=cover.out`.

Run the coverage command. Read the per-file table: the 0%-coverage files (whole files never
tested) are the loudest gaps; low-branch-% files are the next.

### 2. Triage

For each in-scope file, classify: **untested logic** (real gap - target it), **weakly
tested** (lines covered, edge cases missing - target it), **covered indirectly** (e.g. an
accessor exercised through an integration test - verify that is true, then leave it), or
**out of scope / nothing to assert** (report the reason). Do not treat "0% in the report" as
automatically a gap, and do not treat "100% lines" as automatically safe. Pick the highest-value target.

### 3. Hunt edge cases

This is the meticulous part and the whole point. For the target, read the source, then walk
**every** category in `references/edge-cases.md` against it and write down the concrete inputs
that category implies for *this* code. Multiple tests for one edge case is encouraged, not
wasteful - if a boundary can fail three ways, assert all three. Prefer many small, sharply-named
tests over few broad ones: a test's name should tell you exactly what broke when it goes red.

### 4. Write

Follow the house style found in Step 0 exactly. `references/patterns.md` has the two canonical
skeletons (pure-logic and dependency-backed) and the import-after-setup gotcha, but the project's
own tests win wherever they differ. Non-negotiables that hold in any stack:
- Put tests where this project puts them, named how this project names them.
- A top-of-file docstring saying what is under test and *why* those cases matter.
- Import the module under test the same way the app does (same alias/suffix conventions).
- One behavior per test; assert the *why* in a trailing comment where it is non-obvious.
- Assert error **identity and payload** - the specific error type *and* that it carries the
  offending input, not just that something threw.
- If the code touches an external dependency (DB, queue, clock), use the project's real test
  double (in-memory server, fake) rather than mocking it away, when one exists - the real
  constraint (a unique index, a write lock) is often exactly what you are testing.

### 5. Verify - never leave the suite red or weaker

- Run the full test command - all green, including everything that already existed.
- Run the project's typecheck/lint if it has one - the tests are production code; no suppression
  directives, no unsafe casts, no `any` smuggling.
- Re-run coverage and confirm the target's numbers moved.
- If a new test fails, decide whether it caught a **real bug** (report it - do not delete the
  test) or a wrong assumption (fix the test). Never weaken or delete a test just to get green. A
  test that can't fail is worse than no test.

### 6. Report

Short and honest:
- Coverage before -> after for the target (and overall if you re-ran the full report).
- Files added, and the count of new tests.
- Any **real bug** the new tests exposed (this is the highest-value output - surface it loudly).
- What remains untested and why (out-of-scope, covered-indirectly, or "next run's target").
- Anything from Step 0 you had to guess, so the user can correct it.

## When run periodically

Each run: learn the project (Step 0 is cheap - one config read plus one existing test), measure,
pick the current biggest gap, close it to the bar above, verify, report. Over successive runs the
frontier advances on its own - no state file needed, the coverage report *is* the state. If
everything in scope is genuinely at the bar, say so plainly rather than inventing low-value tests
to pad the number.

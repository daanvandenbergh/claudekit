# policy-writer memory store - what it holds

The `policy-writer` skill keeps its project memory in a `/memory-store`-managed directory at
`claude/memory/policy-writer/`. This file is **not** a template to copy - `/memory-store` owns
the file layout, frontmatter, and `INDEX.md`. It only lists **what memories the store should
hold** so a run knows what to capture (Phase 1 reads them, Phase 6 files them via
`/memory-store --store claude/memory/policy-writer "<memory>"`).

## Project profile (`type: fact` / `type: project`)

One store entry per fact; each carries its source (a `file:line`, config, or user
confirmation). Ask the user only for what Phase 2's codebase investigation cannot discover;
mark anything still unknown `[[PLACEHOLDER: ...]]` and store it so the next run knows it is open.

- Legal entity: full legal name, legal form, registration number, registered address (ask the user; never invent).
- Policy contact channel (e.g. `privacy@example.com`).
- Policy language(s).
- Jurisdiction bar: which laws apply, and which regulator's standard is the strictest bar used.
- Markets served / audience targeting.
- Where policy pages live: paths + shared layout component, if any.
- Typecheck/build command.
- Render-verification convention: how this project checks a page in a browser.
- External platforms processing personal data (including env-var-only vendors, confirmed with the user).

## Known state (`type: fact`)

Verified facts from the codebase investigation - the data inventory, cookies, subprocessors,
retention. Each is re-verified every run (never trusted stale) and refined in place; store the
evidence source with it.

## Decisions (`type: decision`)

A choice made and **its premise** - the condition that keeps it valid (e.g. "no imprint
required - premise: no DE/AT market targeting"). A decision binds future runs while its premise
holds; when the premise breaks it is superseded, never silently rewritten.

## Run outcome (`type: project` / `type: event`)

The last run's outcome (created | verified-clean | updated), its one-line result, and the open
`[[PLACEHOLDER]]` blockers - so the next run resumes with what is still outstanding.

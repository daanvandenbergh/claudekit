# @daanvandenbergh/claudekit

![](claude/scribekit-hero/readme/hero.png)

> **This is not an SDK and not a wrapper around the Claude / Anthropic API.** It ships no
> runtime code and makes no API calls. It's a content-only collection of reusable
> [Claude Code](https://claude.com/claude-code) **skills** and **CLAUDE.md rules** that
> Claude Code agents load - you drop them into any project.

Reusable [Claude Code](https://claude.com/claude-code) **skills** and **CLAUDE.md rule
snippets**, shipped as plain content. You install the package as a dev-dependency, then
symlink the skills you want into your project's `.claude/skills/` and `@`-import the rules
you want into your `CLAUDE.md`. Because both are references into `node_modules`, they
**auto-update** whenever you bump the package - no re-copying.

## What's inside

```
skills/
  ts/      TypeScript / general code-quality skills
    audit             phased, production-grade single-module audit (security, quality, logic, tests) that fixes what it finds
    audit-deep-logic  whole-system audit of the bugs that live in the SEAMS between modules
    audit-security    project-agnostic WHOLE-PROJECT security audit: real scanners (deps/secrets/SAST/IaC) + its own LLM whole-repo review + a threat model + the project's own invariants, adversarially triaged; report-only, --fix opts in
    audit-tests       hunt untested logic and write edge-case-exhaustive unit tests to total coverage
  memory/  agent-memory skills
    memory-store      persist agent memory (facts, preferences, decisions, project state) into a de-duplicated, agent-readable Markdown store (--store) and keep it organized (--optimize)
  web/     web / SEO skills
    seo               audit the whole site for SEO and auto-fix what's safe (titles, meta, structured data, canonical/robots/sitemap, Core Web Vitals, answer-engine optimization); the de-index-class of changes is always confirmed first, --scan reports only
rules/     CLAUDE.md snippets you compose into a project's CLAUDE.md
  core_principles.md        simplicity-first / no-laziness / minimal-impact
  workflow.md               plan-mode, subagents, self-improvement loop, verification, task management
  todo.md                   the deferred-work (TODO.md) convention
  active_sessions.md        the shared claude/active_sessions.md convention for concurrent agents
  ts_coding_standards.md    TypeScript house style (docstrings, no suppression directives)
  ts_modular_coding.md      one module, one domain, one public surface
  audit_security_rules.md   maintaining the project's own silent-failure security invariants (the
                            standing obligation behind /audit-security)
```

## Install

```sh
npm install --save-dev @daanvandenbergh/claudekit
```

### Link a skill (macOS / Linux symlink, auto-updating)

Claude Code discovers skills under `.claude/skills/<name>/SKILL.md`. Symlink the skill
directory out of `node_modules` so an `npm update` of this package updates the skill in
place - exactly how `@daanvandenbergh/scribekit` is linked.

Run from your **project root** (the symlink is relative, so it survives moving the repo):

```sh
mkdir -p .claude/skills

# a TypeScript skill
ln -s ../../node_modules/@daanvandenbergh/claudekit/skills/ts/audit \
      .claude/skills/audit

ln -s ../../node_modules/@daanvandenbergh/claudekit/skills/ts/audit-deep-logic \
      .claude/skills/audit-deep-logic

ln -s ../../node_modules/@daanvandenbergh/claudekit/skills/ts/audit-security \
      .claude/skills/audit-security

ln -s ../../node_modules/@daanvandenbergh/claudekit/skills/ts/audit-tests \
      .claude/skills/audit-tests

# a memory-store skill
ln -s ../../node_modules/@daanvandenbergh/claudekit/skills/memory/memory-store \
      .claude/skills/memory-store

# a web / SEO skill
ln -s ../../node_modules/@daanvandenbergh/claudekit/skills/web/seo \
      .claude/skills/seo
```

The `../../` is because `.claude/skills/<name>` is two directories deep, so it climbs back
to the project root before descending into `node_modules`. Verify with `ls -l .claude/skills`
(each entry should point into `node_modules/...`) and restart Claude Code so it re-scans.

### Include a rule in your CLAUDE.md

Claude Code inlines any `@path` reference in `CLAUDE.md` at load time. Point it straight at
the file in `node_modules` so the rule text auto-updates with the package:

```md
# CLAUDE.md

@node_modules/@daanvandenbergh/claudekit/rules/core_principles.md
@node_modules/@daanvandenbergh/claudekit/rules/workflow.md
@node_modules/@daanvandenbergh/claudekit/rules/todo.md
@node_modules/@daanvandenbergh/claudekit/rules/audit_security_rules.md
```

Add only the rule files you want; each is self-contained. The path is relative to the
`CLAUDE.md` file, so keep `CLAUDE.md` at the project root (next to `node_modules`).

`audit_security_rules.md` is the companion to the `/audit-security` skill, but it is a rule and
not part of the skill: importing it makes maintaining `claude/audit-security/rules.md` (the
project's own security invariants) a standing obligation every session, not only on the runs
where the skill happens to fire. Some skills still ship their own `claude-rules.md` alongside
`SKILL.md`, imported exactly the same way.

## Updating

```sh
npm update @daanvandenbergh/claudekit
```

Symlinked skills and `@`-imported rules pick up the new content automatically - nothing to
re-link.

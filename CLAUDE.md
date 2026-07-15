# Project: claudekit

`@daanvandenbergh/claudekit` - a content-only npm package of reusable Claude Code
skills and CLAUDE.md rule snippets. There is no build step, no `dist/`, no runtime code: the
published artifact is just the `skills/` and `rules/` trees (see `files` in `package.json`).
Consumers link skills via a symlink into `.claude/skills/` and `@`-import rules into their
own `CLAUDE.md`; see `README.md`.

## Layout
- `skills/ts/` - code-quality skills (`audit`, `audit-deep-logic`, `audit-security`, `audit-tests`).
- `skills/legal/` - legal/compliance skills (`policy-writer`).
- `skills/memory/` - agent-memory skills (`memory-store`).
- `rules/` - standalone CLAUDE.md snippets (`core_principles.md`, `workflow.md`, `todo.md`).

## Conventions
- **Everything here must be project-agnostic.** Every skill and every rule is published for
  arbitrary consumer projects, so none may assume a particular stack, framework, directory
  layout, or repo. No hardcoded paths, tool names, or references to any one codebase - if a
  skill or rule only makes sense inside a specific project, it does not belong here.
- A skill is a directory with a `SKILL.md` (YAML frontmatter: `name`, `description`,
  `user-invokable`, optional `argument-hint`) plus its own `reference/` / `references/` /
  `assets/`. Keep every skill self-contained - it must work when symlinked alone into a
  consumer project, so no cross-skill or repo-relative imports.
- `skills/<category>/<skill-name>/` - `name` in the frontmatter matches the directory name
  (that name is what the consumer symlinks and types as `/<name>`).
- Rule files are plain Markdown fragments meant to be concatenated into a host CLAUDE.md;
  start each at heading level `##` and keep it standalone.

## Releasing
- Bump `version` in `package.json` and `npm publish` (public scope). No pre-publish build.
- Skills are copied/adapted from real projects; keep them stack-agnostic - a skill must not
  assume it runs inside any one repo.

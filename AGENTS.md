# Agent instructions

This file is the cross-tool entry point read by GitHub Copilot, Claude Code, Cursor, Windsurf,
Kiro, Devin, opencode, Codex CLI, and any other coding agent working in this repository.

## Required before opening a pull request

Run the four checks defined in [`.github/skills/quality-gate/SKILL.md`](.github/skills/quality-gate/SKILL.md)
against your own diff and report the result of each in the PR description:

1. **AI slop** — was this generated, skimmed, and shipped, or actually read and run?
2. **Ponytail** — does something in this repo already do this (unused exports/duplicate types)?
3. **Over-engineering** — how many real callers does each new abstraction have?
4. **Framework-pattern conformance** — does the diff follow this repo's existing conventions
   (page objects, fixtures, specs, config, AI agents), or invent a parallel way to do the same
   thing?

A PR that skips a gate must say so explicitly rather than omitting it.

## Other repo conventions

See `.github/skills/` for framework-specific skills (Playwright test/page-object/fixture
generation, flaky diagnosis, trace analysis, CI configuration, etc.) and
`/memories/repo/codebase-conventions-analysis.md` for the verified conventions this codebase
already follows.

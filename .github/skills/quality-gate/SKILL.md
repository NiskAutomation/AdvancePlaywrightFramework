---
name: quality-gate
description: >-
  Four pre-merge quality gates for any AI coding agent (GitHub Copilot, Claude Code, Cursor,
  Windsurf, Kiro, Devin, opencode, Codex CLI, etc.) working in this repo. Run before opening a PR,
  or when asked to "run the quality gates", "check for AI slop", "is this over-engineered", or
  "does this already exist". Checks: AI-slop (generated/skimmed/shipped), duplication/dead-code
  (ponytail), over-engineering (caller count), and framework-pattern conformance.
license: MIT
metadata:
  author: TheTestingAcademy
  pack: quality
  version: 1.0.0
  adapted-for: AdvancePlaywrightFramework
---

# Quality Gate

Any agent working in this repository — GitHub Copilot, Claude Code, Cursor, Windsurf, Kiro, Devin,
opencode, Codex CLI, or anything else — runs these four gates against its own diff before opening a
PR. They are read-only checks: none of them auto-fixes anything, because a fix applied by the same
agent that skimmed the code in the first place is not a check.

## How to invoke

```bash
git diff main... --stat        # everything changed on this branch
git diff main...               # the actual diff each gate below reads
npx knip                       # unused exports, unused files, duplicate exports, unused deps
```

Run all four gates. A PR description states what each one found, even "none" — a gate that was
skipped isn't a gate.

## Gate 1 — AI slop: generated, skimmed, shipped?

Signs a diff was generated and never actually read before it was committed:

- A comment that restates the line under it (`// loop over items` above a `for` loop).
- Leftover placeholder identifiers: a package renamed to `...2x`, `test123`, `foo`, unresolved
  `TODO`, `example.com`, a name that doesn't match anything else in this repo.
- A dependency added that nothing in the diff imports — check `package.json` against
  `grep -rn "from '<pkg>'" src`. (`eslint-plugin` and a bare `playwright` both landed in this
  repo's `package.json` this way: neither was imported anywhere.)
- No command output attached proving the change ran. "It should work" is not evidence.
- Style that doesn't match the surrounding file: different quote style, different brace
  placement, a naming convention this repo doesn't use elsewhere.

**Verdict:** name the specific line that looks unread, or point to the evidence the diff was
actually executed (a pasted command + output, a passing test run, a green CI check).

## Gate 2 — Ponytail: does this already exist?

Before adding a helper, a type, or an interface, check whether the framework already has it.

```bash
npx knip                                       # unused exports and duplicate types
grep -rn "<the concept, not the name>" src      # e.g. "retry", "buildBooking", "RcaVerdict"
```

This is not hypothetical here: `CustomReporter.ts` once carried its own stale copy of
`RcaVerdict`, `BuildSummary`, and `FlakyResult` — duplicated from `src/ai/agents/*`, with
different literal values (`'LOW'|'MEDIUM'|'HIGH'` vs. the real `'critical'|'high'|'medium'|'low'`)
— because nobody checked whether the type already existed before writing it again. `knip`'s
"unused exported types" list is what surfaced it.

**Verdict:** either point to the existing thing being reused, or state why a second one is
genuinely needed. "Didn't check" is not an answer.

## Gate 3 — Over-engineering: how many callers?

For any new class, interface, factory, or wrapper introduced in the diff:

```bash
grep -rn "new <ClassName>(\|<functionName>(" src --include=*.ts | grep -v "<the file that defines it>"
```

- **0 callers outside its own file** → premature. Delete it or inline it at the one call site.
- **1 caller** → question whether it earns its own file/interface, unless it exists specifically
  so it can be swapped later (`LLMClient` has one real implementation today, but the interface is
  what lets five providers share one call site without touching `agentFactory.ts`).
- A dynamic `require()`-based optional loader (see `CustomReporter.ts`'s AI-module loading) shows
  0 static callers to a tool like `knip` and is **not** a violation — say so explicitly, but only
  when the pattern is genuinely optional-dependency loading, not used as an excuse.

**Verdict:** state the caller count, and for anything under 2, why it still deserves to be an
abstraction rather than inline code.

## Gate 4 — Framework-pattern conformance

Does the diff match how this repo already does things, or invent a new way to do the same thing?

- **Page objects:** extend `BasePage`, `static readonly PATH`, locators are `private readonly`,
  actions go through `this.el.*` — never a raw `page.locator()` in a spec.
- **Fixtures:** added to `src/fixtures/test-base.ts`'s `TestFixtures` type, not a second fixtures
  module.
- **Specs:** import `test`/`expect` from `@fixtures/test-base` (UI) or the relevant fixture module
  (API), tagged (`@P0`, `@Regression`, …), logger via `createLogger('<spec-name>')`.
- **Config:** secrets and target URLs come from `@config/env`, never a hardcoded value or a
  direct `process.env` read outside `src/config/`.
- **AI agents:** a new agent is a prompt plus a JSON Schema passed to `createAgent()` in
  `agentFactory.ts` — not a new HTTP client, not a new retry loop.

```bash
grep -rn "page\.locator(\|process\.env\." src/tests src/pages   # common pattern violations
```

**Verdict:** name the pattern the diff follows or breaks, and the file that set the precedent.

## Output format

For each gate: **Pass** / **Flag**, one line of evidence, and the `file:line` it refers to. Four
lines total per review. No fifth gate, no auto-fix, no prose beyond the evidence.

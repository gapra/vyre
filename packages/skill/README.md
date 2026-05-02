# @gapra/vyre-skill

The Vyre AI Skill — gives any coding agent the design taste of a senior frontend engineer.

## Install

```bash
pnpm add @gapra/vyre-skill
```

## Use with Claude Code

Drop the skill into your project:

```bash
mkdir -p .claude/skills
cp -r node_modules/@gapra/vyre-skill .claude/skills/vyre
```

Or add to your global skills directory.

## Use with Cursor

Add `@gapra/vyre-skill/SKILL.md` content to `.cursor/rules/vyre.md`.

## Use with Windsurf

Add `@gapra/vyre-skill/SKILL.md` content to `.windsurf/rules/vyre.md`.

## What's inside

```
SKILL.md                  ← AI entry point
references/
  styles/                 ← 50+ UI styles with recipes
    _index.json           ← manifest
    glassmorphism.md
    aurora.md
    brutalism.md
    ...
  palettes/               ← 177 palettes (mirrored from tokens)
    _index.json
  ux-rules/               ← 90 rules across 7 categories
    _index.json
    gestalt/              ← 10 rules
    heuristics/           ← 12 rules
    a11y/                 ← 25 rules
    interaction/          ← 10 rules
    motion/               ← 8 rules
    content/              ← 15 rules
    forms/                ← 10 rules
  layout/
    grid-system.md
    flex-patterns.md
    spacing.md
  typography/
    scales.md
    pairing.md
    rhythm.md
  frameworks/
    react.md
    vue.md
    svelte.md
    tailwind.md
evals/
  evals.json              ← test suite
```

## How it works

1. The agent reads `SKILL.md` first.
2. For any UI task, it consults `references/styles/_index.json` to pick a style.
3. It consults `references/palettes/_index.json` to pick a palette.
4. It pulls relevant rules from `references/ux-rules/_index.json`.
5. It produces code using only Vyre tokens — never raw values.

## Validate

```bash
pnpm validate
```

## License

MIT © gapra

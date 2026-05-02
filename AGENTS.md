# AGENTS.md — Vyre Design System

This repo is **Vyre**, an AI-native design system. When working in this repo or in any project that has `@gapra/vyre-*` installed, follow these rules.

## Core principles (always apply)

1. **Never hardcode visual values.** No raw hex, no `px` for spacing, no inline font sizes. Always reference tokens.
2. **Pair every surface with a foreground.** Every background token has a matching `-foreground` token. Never mix arbitrarily.
3. **Honor cascade layers.** Component styles go in `@layer components`. Utilities last.
4. **Accessibility is non-negotiable.** Every color combo must pass APCA Lc 60 (text) or Lc 45 (UI). Every interactive element ≥24×24 px target.
5. **Respect `prefers-reduced-motion`.** Wrap any animation > 200ms in `@media (prefers-reduced-motion: no-preference)`.

## When the user asks for UI work

1. Read `packages/skill/SKILL.md` first.
2. Pick a UI style from `packages/skill/references/styles/_index.json`.
3. Pick a palette from `packages/skill/references/palettes/_index.json`.
4. Apply matching rules from `packages/skill/references/ux-rules/_index.json`.
5. Emit code that uses tokens only.
6. Run `pnpm --filter @gapra/vyre-tokens validate` to verify.

## File conventions

- Tokens: `packages/tokens/src/**/*.tokens.json` (DTCG 2025.10 format)
- Skill content: `packages/skill/references/**/*.md` with YAML frontmatter
- Never edit `packages/tokens/dist/` directly — it's generated

## Common pitfalls to avoid

- Don't combine multiple morphism styles (glass + neu) in one component
- Don't use `color` in inline styles — always CSS variables
- Don't generate palettes by guessing OKLCH values — use the generator script
- Don't skip the `_foreground` pair — accessibility regression

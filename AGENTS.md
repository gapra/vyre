# AGENTS.md — Vyre Design System

This repo is **Vyre**, an AI-native design system. When working in this repo or in any project that has `@gapra/vyre-*` installed, follow these rules.

## Core principles (always apply)

1. **No raw values.** No `#hex`, no `px` for spacing. Always `var(--vyre-*)`.
2. **Pair surface + foreground.** Every `--vyre-surface-*` has a matching `--vyre-content-*`. Never mix arbitrarily.
3. **Cascade layers:** `@layer theme, base, components, utilities`. Component styles in `@layer components`.
4. **Contrast is mandatory.** Body text: APCA Lc 60 / WCAG AA 4.5:1. UI: Lc 45 / 3:1.
5. **Guard animations.** `@media (prefers-reduced-motion: no-preference)` around any animation > 200ms.

## When the user asks for UI work

1. Pick a UI style from `references/styles/_index.json` (54 options).
2. Pick a palette from `references/palettes/_index.json` (177 options, tagged).
3. Load relevant UX rules from `references/ux-rules/_index.json` (90 rules — load on demand, not all at once).
4. Check the framework adapter in `references/frameworks/`.
5. Produce token-only code. Run `pnpm lint` before delivering.

## File conventions

- Tokens: `packages/tokens/src/**/*.tokens.json` (DTCG 2025.10 format)
- Skill content: `packages/skill/references/**/*.md` with YAML frontmatter
- Never edit `packages/tokens/dist/` directly — it's generated

## Avoid

- Combining morphism styles (glass + neumorphism) in one component.
- Skipping the `-foreground` pair on any surface — guaranteed a11y regression.
- Animating `width`, `height`, `top`, `left` — animate `transform` + `opacity` only.
- Loading all 90 UX rules at once — use the manifest index.
- Raw hex, px spacing, or inline font sizes anywhere in CSS or style props.

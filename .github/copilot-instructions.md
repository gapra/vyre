# GitHub Copilot Instructions — Vyre Design System

This repo contains **Vyre**, an AI-native design system. Follow these rules when suggesting code.

## Core rules

1. **Never hardcode visual values.** No raw hex, no literal `px` for spacing, no inline font sizes. Always use `var(--vyre-*)` CSS custom properties or Tailwind classes generated from `@gapra/vyre-tokens/tailwind`.
2. **Pair every surface with a foreground.** Every background token has a `-foreground` counterpart. Never mix arbitrarily.
3. **Honor cascade layers.** Component styles go in `@layer components`. Utility overrides go in `@layer utilities`.
4. **Accessibility is non-negotiable.** Every color pair must pass APCA Lc 60 (body text) or Lc 45 (UI elements). Every interactive element must be ≥24×24 px.
5. **Guard all animations.** Wrap any animation > 200ms in `@media (prefers-reduced-motion: no-preference)`.

## Token reference

```css
/* Import base + optional theme */
@import "@gapra/vyre-tokens/css";
@import "@gapra/vyre-tokens/themes/dark"; /* optional */
```

Key token namespaces: `--vyre-surface-*`, `--vyre-content-*`, `--vyre-interactive-*`, `--vyre-border-*`, `--vyre-status-*`, `--vyre-space-*`, `--vyre-radius-*`, `--vyre-font-*`, `--vyre-motion-*`.

## When generating UI code

- Use `packages/skill/references/styles/` for UI style recipes.
- Use `packages/skill/references/ux-rules/` for layout, a11y, interaction, motion rules.
- Run `node packages/skill/scripts/audit-contrast.mjs` to validate color pairs.
- Run `pnpm --filter @gapra/vyre-tokens validate` to validate token schema.

Full context: see `AGENTS.md` and `packages/skill/SKILL.md`.

# Vyre

> AI-native frontend design system for the agent era.

**Vyre** equips AI coding agents (Claude, Cursor, Codex, Windsurf, Copilot) with the design taste of a senior frontend engineer. It ships:

- **50+ UI styles** — glassmorphism, neumorphism, brutalism, aurora, bento, editorial, and more
- **150+ accessible palettes** — generated in OKLCH, all APCA Lc 60+ verified
- **90+ UX rules** — Gestalt, Nielsen heuristics, WCAG 2.2, Laws of UX, motion, micro-copy
- **W3C DTCG 2025.10 design tokens** — CSS variables, Tailwind v4, SCSS, JS/TS
- **Framework-agnostic** — React, Vue, Svelte, Angular, plain CSS
- **Anthropic Agent Skills format** — auto-emits `AGENTS.md`, `.cursor/rules`, `.windsurf/rules`

## Packages

| Package | What it is |
|---|---|
| [`@gapra/vyre-tokens`](./packages/tokens) | W3C-DTCG design tokens. Single source of truth → CSS / Tailwind / SCSS / JS. |
| [`@gapra/vyre-skill`](./packages/skill) | The AI Skill itself: `SKILL.md` + 50 styles + 150 palettes + 90 rules as references. |

## Quick start

### As a developer

```bash
pnpm add @gapra/vyre-tokens
```

```css
/* your-app.css */
@import "@gapra/vyre-tokens/css";

.button {
  background: var(--vyre-color-interactive-primary);
  color: var(--vyre-color-interactive-primary-foreground);
}
```

### With Tailwind v4

```css
@import "tailwindcss";
@import "@gapra/vyre-tokens/tailwind";
```

### As an AI skill (Claude Code, Cursor, Windsurf)

```bash
pnpm add @gapra/vyre-skill
# or copy packages/skill/ into your repo as .claude/skills/vyre/
```

The skill auto-loads when you ask the agent to build UI, pick colors, theme, or fix a11y.

## Status

MVP — actively developed. Spec is stable; content is being filled in.

## License

MIT © gapra

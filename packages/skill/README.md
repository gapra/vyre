# @gapra/vyre-skill

**Gives your AI coding agent the design taste of a senior frontend engineer.**

An [Agent Skill](https://agentskills.io) that loads 50+ UI styles, 177 OKLCH-verified color palettes, and 90+ UX rules into Claude Code, Cursor, Windsurf, GitHub Copilot, or any agent that reads Markdown.

```bash
npm install @gapra/vyre-skill
# or
pnpm add @gapra/vyre-skill
```

[![npm](https://img.shields.io/npm/v/@gapra/vyre-skill)](https://www.npmjs.com/package/@gapra/vyre-skill)
[![license](https://img.shields.io/npm/l/@gapra/vyre-skill)](./LICENSE)

---

## Why

Without this skill, agents default to raw hex values, inconsistent spacing, inaccessible contrast, and no coherent visual system. With it:

| Without | With |
|---|---|
| `background: #3b82f6` | `var(--vyre-interactive-primary)` |
| No focus ring | `:focus-visible` ring from token |
| WCAG unknown | APCA Lc 60+ guaranteed |
| Random spacing | 8-px grid, always |
| Generic look | Chosen from 50+ named styles |

---

## Quick start by tool

### Claude Code

```bash
mkdir -p .claude/skills
cp -r node_modules/@gapra/vyre-skill .claude/skills/vyre
```

The skill loads automatically when you ask for UI work — no extra config needed.

### Cursor

Create `.cursor/rules/vyre.mdc`:

```
---
description: Vyre design system. Use for all UI, styling, components, colors, layout, a11y work.
globs: ["**/*.tsx","**/*.vue","**/*.svelte","**/*.css","**/*.html"]
alwaysApply: false
---
```

Then paste the contents of `node_modules/@gapra/vyre-skill/SKILL.md` below the frontmatter.

### Windsurf

Create `.windsurf/rules/vyre.md` and paste the contents of `node_modules/@gapra/vyre-skill/SKILL.md`.

### GitHub Copilot

Add to `.github/copilot-instructions.md`:

```md
This project uses the Vyre design system (@gapra/vyre-skill).
For all UI work, always use var(--vyre-*) CSS custom properties — never raw hex or px values.
Full rules: node_modules/@gapra/vyre-skill/SKILL.md
```

### Any agent (AGENTS.md)

```bash
cat node_modules/@gapra/vyre-skill/SKILL.md >> AGENTS.md
```

---

## What's inside

### 50+ UI styles

Named, machine-readable recipes — each with do/don't rules, required tokens, performance cost, and accessibility notes.

| Category | Styles |
|---|---|
| Surface morphisms | glassmorphism, neumorphism, claymorphism, skeuomorphic |
| Flat & modern | flat, clean-modern, minimal, material-3, fluent-2 |
| Atmospheric | aurora, dreamcore, vaporwave, synthwave, sunset-gradient |
| Editorial | swiss, magazine, broadsheet, monospace-doc, terminal |
| Brutalist | brutalism, neo-brutalism, anti-design, raw-html |
| Bento / dashboard | bento, dashboard-dense, financial-dense, admin |
| Playful | memphis, blob, claymation, sticker, 3d-extruded |
| Retro | retro-futurism, y2k, 8-bit, terminal-amber, crt |
| Premium | dark-luxury, gallery-monochrome, apple-store-clean |
| Functional | high-density-table, kiosk, accessibility-first |

Browse: `references/styles/_index.json`

### 177 color palettes

OKLCH-native palettes, each validated for APCA Lc 60 (body text) and Lc 45 (UI elements). Tagged for filtering.

| Tag | Example palettes |
|---|---|
| `editorial` | nordic, paper-white, newsprint, gallery, broadsheet |
| `brand` | aurora, electric-violet, coral-reef, ocean-depth |
| `dashboard` | admin, data-viz, financial, slate-pro |
| `neon` | cyberpunk, neon-noir, acid, electric |
| `pastel` | cotton-candy, sakura, lavender-mist |
| `colorblind-safe` | a11y-deuteranopia, a11y-protanopia, a11y-tritanopia |
| `high-contrast` | a11y-high-contrast, a11y-print-safe |

Browse: `references/palettes/_index.json`

### 90+ UX rules

Machine-readable rules grouped into 7 buckets. The agent loads only what's relevant to each request.

| Bucket | Count | Examples |
|---|---|---|
| Gestalt | 10 | proximity, similarity, figure-ground, common-region |
| Nielsen heuristics | 12 | system-status, error-prevention, user-control |
| Accessibility (WCAG 2.2) | 25 | focus-visible, touch-target-size, color-not-only-channel |
| Interaction laws | 10 | feedback-latency, destructive-confirmation, loading-skeleton |
| Motion | 8 | motion-easing, respect-reduced-motion, spatial-continuity |
| Content & microcopy | 15 | error-messages, button-labels, empty-states |
| Forms | 10 | form-labels, form-validation-timing, form-single-column |

Browse: `references/ux-rules/_index.json`

---

## Utility scripts

Three CLI utilities the agent (or you) can run directly:

### `apply-palette` — switch color palette

Outputs a CSS override file that applies any of the 177 palettes on top of your base tokens.

```bash
# List all palettes with tags
node node_modules/@gapra/vyre-skill/scripts/apply-palette.mjs --list

# Apply the aurora palette in dark mode
node node_modules/@gapra/vyre-skill/scripts/apply-palette.mjs \
  --palette aurora --mode dark --out ./src/styles/palette.css
```

```css
/* In your global CSS */
@import "@gapra/vyre-tokens/css";
@import "./src/styles/palette.css";  /* palette override */
```

### `audit-contrast` — validate color contrast

Checks all semantic token pairs (18 pairs) against WCAG 2.2 AA and APCA Lc thresholds. Exits 1 on failure — safe for CI.

```bash
node node_modules/@gapra/vyre-skill/scripts/audit-contrast.mjs --theme light
node node_modules/@gapra/vyre-skill/scripts/audit-contrast.mjs --theme dark
node node_modules/@gapra/vyre-skill/scripts/audit-contrast.mjs --verbose
```

Example output:
```
Vyre contrast audit — theme: light
────────────────────────────────────────────────────────────────────────
✓ All 18 pairs pass (0 skipped — missing tokens).
```

### `generate-component` — scaffold a token-native component

Generates a starter component for your framework. Every value is a token reference — zero raw colors or spacing.

```bash
# List available components
node node_modules/@gapra/vyre-skill/scripts/generate-component.mjs --list-components

# React Button
node node_modules/@gapra/vyre-skill/scripts/generate-component.mjs \
  --component Button --framework react --out ./src/components/

# Vue Card
node node_modules/@gapra/vyre-skill/scripts/generate-component.mjs \
  --component Card --framework vue --out ./src/components/
```

**Components:** Button, Card, Input, Badge, Alert
**Frameworks:** react, vue, svelte, angular, html

---

## Pair with `@gapra/vyre-tokens`

This package is the **rules layer**. The **token layer** is [`@gapra/vyre-tokens`](https://www.npmjs.com/package/@gapra/vyre-tokens) — install it in your project to get the CSS custom properties:

```bash
npm install @gapra/vyre-tokens
```

```css
/* Plain CSS / any framework */
@import "@gapra/vyre-tokens/css";
@import "@gapra/vyre-tokens/themes/dark";    /* optional dark mode */
```

```css
/* Tailwind v4 */
@import "tailwindcss";
@import "@gapra/vyre-tokens/tailwind";       /* @theme { … } */
```

```tsx
// React (Next.js / Vite)
import "@gapra/vyre-tokens/css";
```

Themes available: `light`, `dark`, `high-contrast`, `tritanopia`, `colorblind`

---

## How the skill loads (progressive disclosure)

The agent never dumps all 177 palettes and 90 rules into context at once. It uses three tiers:

```
Tier 1 — SKILL.md            Always in context (~1.5K tokens)
Tier 2 — _index.json files   Loaded when a category is needed
Tier 3 — Individual .md      Loaded only for the specific rule or style
```

This keeps context usage low while still giving the agent access to the full library on demand.

---

## Validate the skill

```bash
pnpm --filter @gapra/vyre-skill validate
# or from this directory:
node scripts/validate-skill.mjs
```

---

## Package structure

```
SKILL.md                        ← AI entry point (< 5K tokens)
references/
  styles/                       ← 50+ UI style recipes
    _index.json                 ← manifest: id, category, cost, a11y
    glassmorphism.md            ← recipe: tokens, do/don't, CSS
    aurora.md
    brutalism.md
    ...
  palettes/                     ← palette selector
    _index.json                 ← 177 palettes with tags + hue info
  ux-rules/                     ← UX rule library
    _index.json                 ← 90 rules with severity + summary
    gestalt/                    ← 10 Gestalt rules
    heuristics/                 ← 12 Nielsen heuristics
    a11y/                       ← 25 WCAG 2.2 rules
    interaction/                ← 10 interaction laws
    motion/                     ← 8 motion rules
    content/                    ← 15 content/microcopy rules
    forms/                      ← 10 form UX rules
  layout/
    grid-system.md
    flex-patterns.md
    spacing.md
  typography/
    scales.md
    pairing.md
    rhythm.md
  frameworks/
    react.md  vue.md  svelte.md  angular.md  tailwind.md
scripts/
  apply-palette.mjs             ← palette switcher CLI
  audit-contrast.mjs            ← WCAG/APCA contrast checker
  generate-component.mjs        ← component scaffolder
evals/
  evals.json                    ← 72 trigger/behavior test cases
```

---

## Related

- [`@gapra/vyre-tokens`](https://www.npmjs.com/package/@gapra/vyre-tokens) — W3C DTCG design tokens (CSS, Tailwind, SCSS, JS)
- [`@gapra/vyre-linter`](https://www.npmjs.com/package/@gapra/vyre-linter) — DTCG validator + WCAG/APCA linter + UX rule checker

## License

MIT © gapra

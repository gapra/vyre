# Installation & Quick Start

This is the **vyre** monorepo (MVP). Follow these steps to get up and running.

## 1. Prerequisites

- **Node.js** ≥ 18 (recommended: 20 LTS or 22 LTS)
- **pnpm** ≥ 9.0.0 — install with `npm install -g pnpm@latest`

## 2. Extract & Install

```bash
# After cloning or extracting the archive
cd vyre

# Install workspace dependencies (none required for tokens build,
# but pnpm initializes the workspace)
pnpm install
```

## 3. Build Tokens

```bash
cd packages/tokens

# Validate every token file (W3C DTCG conformance)
node scripts/validate.mjs
# → ✓ Validated 15135 tokens across 186 files. No errors.

# Build all output formats (CSS, Tailwind v4, SCSS, JS/TS)
node scripts/build.mjs
# → dist/css/tokens.css
# → dist/tailwind/theme.css
# → dist/scss/_tokens.scss
# → dist/js/tokens.js + tokens.d.ts
```

## 4. Validate Skill Package

```bash
cd packages/skill
node scripts/validate-skill.mjs
# → ✓ SKILL.md has frontmatter
# → ✓ 54 styles indexed
# → ✓ 177 palettes indexed
# → ✓ 90 UX rules indexed
# → ✓ Required reference docs present
```

## 5. (Optional) Regenerate Content

The skill ships pre-generated. To regenerate from source scripts:

```bash
cd packages/skill
node scripts/generate-styles.mjs       # 54 UI styles
node scripts/generate-ux-rules.mjs     # 90 UX rules across 7 categories

cd ../tokens
node scripts/generate-palettes.mjs     # 177 palettes
```

## 6. Use the Tokens

In any web project, point at the built CSS:

```html
<link rel="stylesheet" href="/path/to/vyre/packages/tokens/dist/css/tokens.css">
```

Or for Tailwind v4:

```css
/* your-app/src/styles.css */
@import "/path/to/vyre/packages/tokens/dist/tailwind/theme.css";
@import "tailwindcss";
```

Then use any vyre token:

```html
<button style="
  background: var(--vyre-color-interactive-primary);
  color: var(--vyre-color-interactive-primary-foreground);
  padding: var(--vyre-spacing-2) var(--vyre-spacing-4);
  border-radius: var(--vyre-radius-md);
">Click me</button>
```

## 7. Use the Skill (with Claude / Cursor / Windsurf)

Point your AI agent at the skill folder:

```
/path/to/vyre/packages/skill
```

The `SKILL.md` is the entry point. Agents will load `references/*` on demand.

## Project Structure

```
vyre/
├── package.json                    # Workspace root
├── pnpm-workspace.yaml
├── README.md
├── AGENTS.md                       # AI agent contract
├── INSTALL.md                      # ← You are here
├── LICENSE                         # MIT
└── packages/
    ├── tokens/                     # vyre-tokens
    │   ├── src/
    │   │   ├── core/               # 5 base token files (color, dimension, type, motion, shadow)
    │   │   ├── alias/              # 4 semantic alias files (surface, content, interactive, status)
    │   │   └── palettes/           # 177 generated palette token files
    │   ├── scripts/                # build, validate, generate-palettes
    │   └── dist/                   # CSS, Tailwind, SCSS, JS/TS outputs
    └── skill/                      # vyre-skill
        ├── SKILL.md                # Entry point for AI agents
        ├── references/
        │   ├── styles/             # 54 UI style recipes
        │   ├── palettes/           # Palette index (mirrored from tokens)
        │   ├── ux-rules/           # 90 UX rules across 7 categories
        │   ├── layout/             # Grid, flex, spacing
        │   ├── typography/         # Scales, pairing, rhythm
        │   └── frameworks/         # React, Vue, Svelte, Angular, Tailwind
        ├── scripts/                # generate-styles, generate-ux-rules, validate-skill
        ├── evals/                  # 30 should-trigger / should-not-trigger cases
        └── assets/examples/        # (empty — for future demos)
```

## What's Next (Post-MVP)

- `vyre-linter` — lint-style violations
- `vyre-vscode` — VS Code LSP
- `vyre-react`, `vyre-vue`, `vyre-svelte` — pre-built component adapters
- `vyre-figma-tokens` — Figma plugin sync

## Troubleshooting

**`pnpm: command not found`** → `npm install -g pnpm@latest`

**Token build complains about missing files** → make sure you ran `node scripts/generate-palettes.mjs` first if `src/palettes/` is empty.

**Skill validator complains about index mismatch** → re-run `node scripts/generate-styles.mjs` and `node scripts/generate-ux-rules.mjs` to rebuild the indexes.

---

License: MIT

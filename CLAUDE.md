# CLAUDE.md — Vyre Design System

This is **Vyre**, an AI-native design system. Read this before working on any code in this repo.

## What this repo is

A pnpm monorepo with three published packages:

| Package | Purpose |
|---------|---------|
| `@gapra/vyre-tokens` | DTCG 2025.10 design tokens → CSS / Tailwind / SCSS / JS |
| `@gapra/vyre-skill` | AI Skill: 54 UI styles, 177 palettes, 90 UX rules |
| `@gapra/vyre-linter` | CLI + API: DTCG validation, alias refs, WCAG/APCA, UX rules |

## When asked to build or fix UI

1. Pick a UI style from `references/styles/_index.json` (54 options).
2. Pick a palette from `references/palettes/_index.json` (177 options, tagged).
3. Load relevant UX rules from `references/ux-rules/_index.json` (90 rules — load on demand, not all at once).
4. Check the framework adapter in `references/frameworks/`.
5. Produce token-only code. Run `pnpm lint` before delivering.

## The 5 non-negotiables

1. **No raw values.** No `#hex`, no `px` for spacing. Always `var(--vyre-*)`.
2. **Pair surface + foreground.** Every `--vyre-surface-*` has a matching `--vyre-content-*`. Never mix arbitrarily.
3. **Cascade layers:** `@layer theme, base, components, utilities`. Component styles in `@layer components`.
4. **Contrast is mandatory.** Body text: APCA Lc 60 / WCAG AA 4.5:1. UI: Lc 45 / 3:1.
5. **Guard animations.** `@media (prefers-reduced-motion: no-preference)` around any animation > 200ms.

## Common commands

```bash
pnpm install              # install workspace deps
pnpm build:tokens         # build @gapra/vyre-tokens dist/
pnpm lint                 # run vyre-linter (DTCG + refs + contrast + UX rules)
pnpm lint:dark            # contrast audit for dark theme
pnpm validate             # build tokens then lint all
pnpm test                 # run all package tests
```

## Token namespaces

| Namespace | Examples |
|-----------|---------|
| `--vyre-surface-*` | `background`, `panel`, `card`, `popover`, `subtle`, `muted`, `inverse` |
| `--vyre-content-*` | `primary`, `secondary`, `tertiary`, `muted`, `disabled`, `link`, `inverse` |
| `--vyre-interactive-*` | `primary`, `primary-foreground`, `primary-hover`, `secondary-*`, `ghost-*`, `destructive-*` |
| `--vyre-status-*` | `success-solid`, `success-foreground`, `success-subtle` (same for warning/danger/info) |
| `--vyre-border-*` | `subtle`, `default`, `strong`, `interactive`, `focus` |
| `--vyre-space-{0–64}` | 8-px grid. `space-2`=8px, `space-4`=16px, `space-6`=24px |
| `--vyre-radius-*` | `xs`, `sm`, `md`, `lg`, `xl`, `2xl`, `3xl`, `full` |
| `--vyre-shadow-*` | `xs`, `sm`, `md`, `lg`, `xl`, `2xl`, `inner` |
| `--vyre-motion-duration-*` | `instant`, `fast`, `normal`, `slow`, `deliberate` |
| `--vyre-motion-easing-*` | `standard`, `decelerate`, `accelerate`, `sharp` |

## File conventions

- Token source: `packages/tokens/src/**/*.tokens.json` (DTCG 2025.10)
- Skill content: `packages/skill/references/**/*.md` (YAML frontmatter + Markdown)
- **Never edit** `packages/tokens/dist/` — it's generated.
- **Never edit** `.cursor/rules/vyre.mdc`, `.windsurf/rules/vyre.md`, or `.github/copilot-instructions.md` directly — run `node packages/skill/scripts/emit-agent-files.mjs` to regenerate.

## Avoid

- Combining morphism styles (glass + neumorphism) in one component.
- Skipping the `-foreground` pair on any surface — guaranteed a11y regression.
- Animating `width`, `height`, `top`, `left` — animate `transform` + `opacity` only.
- Loading all 90 UX rules at once — use the manifest index.
- Raw hex, px spacing, or inline font sizes anywhere in CSS or style props.

---
name: vyre-design-system
description: |
  Use this skill WHENEVER the user asks for any UI work, frontend styling, component
  creation, design decisions, color choices, theming, layouts, typography, accessibility,
  spacing, or visual polish — in ANY framework (React, Vue, Svelte, Angular, Tailwind,
  plain CSS, HTML). Trigger this skill even for casual phrasings like "make it look
  good", "add some style", "pick colors", "improve the UI", "build a button", "design
  a card", "fix the spacing", "add dark mode", "make it accessible", "more modern look",
  "feels boring", "needs polish", or anything implying visual/UX work. Provides 50+
  UI styles (glassmorphism, neumorphism, brutalism, aurora, bento, editorial, retro,
  cyberpunk, etc.), 177 OKLCH-verified palettes, 90+ UX rules covering Gestalt, Nielsen
  heuristics, WCAG 2.2, Laws of UX, motion, and forms. ALWAYS produces token-based
  code — never hardcodes colors, spacing, or font sizes.
license: MIT
version: 0.1.0
---

# Vyre Design System

You are working with **Vyre**, a token-based design system. Your job is to produce production-quality UI that looks intentional, is fully accessible, and uses only design tokens — never raw values.

## Quick reference (always loaded)

### The 5 non-negotiables
1. **Never hardcode visual values.** No `#hex`, no `px` for spacing, no inline font sizes. Always use `var(--vyre-*)` tokens or Tailwind utility classes that map to them.
2. **Pair surface with foreground.** Every background token has a matching `-foreground` token. Never mix arbitrarily.
3. **Cascade-layer order:** `@layer theme, base, components, utilities`. Component styles go in `components`.
4. **Contrast is mandatory.** Body text must hit APCA Lc 60 / WCAG AA 4.5:1 minimum. UI elements Lc 45 / 3:1.
5. **Honor `prefers-reduced-motion`.** Wrap any animation > 200ms in `@media (prefers-reduced-motion: no-preference)`.

### Core token namespaces
- `--vyre-color-*` — primitive 12-step ramps per hue
- `--vyre-surface-*` — backgrounds (`background`, `panel`, `card`, `popover`, `subtle`, `muted`, `inverse`)
- `--vyre-content-*` — foregrounds (`primary`, `secondary`, `tertiary`, `muted`, `disabled`, `inverse`, `link`)
- `--vyre-interactive-*` — buttons + interactive states (`primary`, `primary-foreground`, `primary-hover`, `secondary-*`, `ghost-*`, `destructive-*`)
- `--vyre-status-*` — `success`, `warning`, `danger`, `info` (each with `solid`, `foreground`, `subtle`, `border`)
- `--vyre-border-*` — `subtle`, `default`, `strong`, `interactive`, `focus`
- `--vyre-space-{0..64}` — 8-px grid (use `2`=8, `4`=16, `6`=24 most often)
- `--vyre-radius-{xs,sm,md,lg,xl,2xl,3xl,full}`
- `--vyre-font-family-{sans,serif,mono,display}`, `--vyre-font-size-*`, `--vyre-font-weight-*`
- `--vyre-shadow-{xs,sm,md,lg,xl,2xl,inner}`
- `--vyre-motion-duration-*`, `--vyre-motion-easing-*`

## Workflow for any UI request

1. **Understand intent.** Identify component type, audience, mood, and constraints.
2. **Pick a UI style** from `references/styles/_index.json`. If user didn't specify, default to `clean-modern` (safe, neutral) or match the existing style of the project.
3. **Pick a palette** from `references/palettes/_index.json`. 177 options tagged by mood, brand, accessibility. Filter by tags (`brand`, `dashboard`, `editorial`, `playful`, `accessibility`, etc.).
4. **Load only the rules you need.** Read `references/ux-rules/_index.json`. Pull individual rule files only when relevant. Do NOT load all 90 at once.
5. **Pick the framework adapter** from `references/frameworks/` (react.md, vue.md, svelte.md, tailwind.md).
6. **Produce code** using ONLY tokens. Verify every color combo mentally against contrast rules.
7. **Self-check** before delivering: run through the 5 non-negotiables. If using a non-default style or palette, mention which one and why.

## Manifests (load these on demand)

- **UI styles:** `references/styles/_index.json` (50+ entries)
- **Palettes:** `references/palettes/_index.json` (177 entries with tags + descriptions)
- **UX rules:** `references/ux-rules/_index.json` (90+ entries with severity)
- **Layout patterns:** `references/layout/`
- **Typography:** `references/typography/`
- **Frameworks:** `references/frameworks/`

## Common patterns (memorize these)

### Button (token-only)
```css
.button {
  background: var(--vyre-interactive-primary);
  color: var(--vyre-interactive-primary-foreground);
  padding: var(--vyre-space-2) var(--vyre-space-4);
  border-radius: var(--vyre-radius-md);
  font-weight: var(--vyre-font-weight-medium);
  transition: background var(--vyre-motion-duration-fast) var(--vyre-motion-easing-standard);
}
.button:hover { background: var(--vyre-interactive-primary-hover); }
.button:focus-visible {
  outline: 2px solid var(--vyre-ring-default);
  outline-offset: 2px;
}
```

### Card
```css
.card {
  background: var(--vyre-surface-card);
  border: 1px solid var(--vyre-border-subtle);
  border-radius: var(--vyre-radius-lg);
  padding: var(--vyre-space-6);
  box-shadow: var(--vyre-shadow-sm);
}
```

### Tailwind v4 usage
```html
<button class="bg-primary text-primary-foreground hover:bg-primary-hover px-4 py-2 rounded-md font-medium">
  Click me
</button>
```

## Avoid

- Combining multiple morphism styles (glass + neu) in one component — they conflict visually.
- Using `color`, `background`, `padding`, `margin`, `font-size` with literal values in inline styles.
- Skipping the `*-foreground` pair — guaranteed accessibility regression.
- Picking palettes by name vibe alone — always check the `tags` field for fit.
- Animating without `prefers-reduced-motion` guard.
- Overriding cascade layer order.
- Loading the full ux-rules folder. Read the manifest, request specific rules.

## When user is ambiguous

Default decisions:
- **Style:** `clean-modern` if professional context, `editorial` if content-heavy, `playful-pop` if marketing/landing.
- **Palette:** `saas-indigo` for product UI, `nordic` for editorial, `dashboard-airy` for data UI.
- **Mode:** Match user's OS preference via `prefers-color-scheme` unless specified.
- **Framework:** Match the existing project. If new, ask once or default to React + Tailwind.

When in doubt, mention the choice you made and offer alternatives.

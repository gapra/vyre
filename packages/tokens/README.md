# @gapra/vyre-tokens

W3C DTCG 2025.10-compliant design tokens. OKLCH-native. Framework-agnostic.

## Install

```bash
pnpm add @gapra/vyre-tokens
```

## Use

### Plain CSS / any framework

```css
@import "@gapra/vyre-tokens/css";

.button {
  background: var(--vyre-color-interactive-primary);
  color: var(--vyre-color-interactive-primary-foreground);
  padding: var(--vyre-space-2) var(--vyre-space-4);
  border-radius: var(--vyre-radius-md);
}
```

### Tailwind v4

```css
@import "tailwindcss";
@import "@gapra/vyre-tokens/tailwind";
```

```html
<button class="bg-primary text-primary-foreground px-4 py-2 rounded-md">
  Click me
</button>
```

### JS / TS

```ts
import { tokens } from '@gapra/vyre-tokens';

const primary = tokens.color.interactive.primary;
```

## Token tiers

1. **Core** (`src/core/`) — primitive seed values: OKLCH colors, base spacing units, type scale ratios
2. **Semantic** (`src/semantic/`) — 12-step Radix-style scales per hue, derived from core
3. **Alias** (`src/alias/`) — role-based tokens: `surface`, `content`, `interactive`, `status`
4. **Themes** (`src/themes/`) — light, dark, high-contrast, colorblind-safe modifiers
5. **Palettes** (`src/palettes/`) — 150+ named palettes (aurora, nordic, brutalist, …)

## Build

```bash
pnpm build
```

Outputs to `dist/`:
- `dist/css/tokens.css` — CSS custom properties
- `dist/tailwind/theme.css` — Tailwind v4 `@theme` blocks
- `dist/scss/_tokens.scss` — Sass map + variables
- `dist/js/tokens.js` + `tokens.d.ts` — typed JS object

## License

MIT © gapra

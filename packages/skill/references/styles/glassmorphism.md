---
id: glassmorphism
category: morphism
description: "Frosted-glass surfaces with backdrop blur, subtle transparency, and crisp edges."
when_to_use: ["Hero overlays","Modal backgrounds","Card stacking","Premium feel"]
contraindications: ["Low-end devices (perf)","High-density data UI","Long-form text"]
contraindicated_with: ["neumorphism","brutalism"]
required_tokens: ["surface.panel","border.subtle","shadow.lg"]
cost: high
accessibility: "Ensure content behind glass has sufficient blur — text may sit on noisy backgrounds."
---

# Glassmorphism

Frosted-glass surfaces with backdrop blur, subtle transparency, and crisp edges.

## When to use

- Hero overlays
- Modal backgrounds
- Card stacking
- Premium feel

## When NOT to use

- Low-end devices (perf)
- High-density data UI
- Long-form text

## Do

- ✅ Use over a colorful or photographic background
- ✅ Keep blur radius 16-24px
- ✅ Add subtle 1px hairline border

## Don't

- ❌ Use on flat solid backgrounds (no glass effect visible)
- ❌ Stack 3+ layers
- ❌ Combine with heavy shadows

## Recipe (CSS)

```css
background: oklch(from var(--vyre-surface-panel) l c h / 0.7);
backdrop-filter: blur(20px) saturate(180%);
border: 1px solid oklch(from var(--vyre-border-subtle) l c h / 0.3);
box-shadow: var(--vyre-shadow-lg);
```

## Required tokens

- `surface.panel`
- `border.subtle`
- `shadow.lg`

## Performance cost

`high` — use sparingly, profile on low-end devices

## Accessibility

Ensure content behind glass has sufficient blur — text may sit on noisy backgrounds.

---
id: liquid-glass
category: material
description: "Apple Liquid Glass aesthetic: translucent, refractive surfaces."
when_to_use: ["Apple platform showcases","Premium iOS/macOS apps"]
contraindications: ["Performance-constrained","Web with broad audience"]
contraindicated_with: ["flat","brutalism"]
required_tokens: ["surface.panel","shadow.xl"]
cost: high
accessibility: "Test thoroughly with motion users."
---

# Liquid Glass

Apple Liquid Glass aesthetic: translucent, refractive surfaces.

## When to use

- Apple platform showcases
- Premium iOS/macOS apps

## When NOT to use

- Performance-constrained
- Web with broad audience

## Do

- ✅ Layer over rich backgrounds
- ✅ Subtle highlight at top edge

## Don't

- ❌ Use over solid colors
- ❌ Stack heavily

## Recipe (CSS)

```css
background: oklch(from var(--vyre-surface-panel) l c h / 0.6);
backdrop-filter: blur(40px) saturate(200%);
border: 0.5px solid oklch(100% 0 0 / 0.2);
border-radius: var(--vyre-radius-2xl);
box-shadow: inset 0 1px 0 oklch(100% 0 0 / 0.5), 0 8px 32px oklch(0% 0 0 / 0.12);
```

## Required tokens

- `surface.panel`
- `shadow.xl`

## Performance cost

`high` — use sparingly, profile on low-end devices

## Accessibility

Test thoroughly with motion users.

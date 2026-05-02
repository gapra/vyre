---
id: flat-2
category: flat
description: "Flat with subtle shadows for elevation and depth cues. Most popular style."
when_to_use: ["SaaS apps","Dashboards","General product UI"]
contraindications: []
contraindicated_with: ["neumorphism"]
required_tokens: ["surface.card","shadow.sm","shadow.md"]
cost: low
accessibility: "Excellent."
---

# Flat 2

Flat with subtle shadows for elevation and depth cues. Most popular style.

## When to use

- SaaS apps
- Dashboards
- General product UI

## When NOT to use

_No major contraindications._

## Do

- ✅ Use shadow for elevation hints
- ✅ Animate shadow on hover

## Don't

- ❌ Use heavy shadows (xl+) for routine elements

## Recipe (CSS)

```css
background: var(--vyre-surface-card);
border-radius: var(--vyre-radius-lg);
box-shadow: var(--vyre-shadow-sm);
transition: box-shadow var(--vyre-motion-duration-fast) var(--vyre-motion-easing-standard);
&:hover { box-shadow: var(--vyre-shadow-md); }
```

## Required tokens

- `surface.card`
- `shadow.sm`
- `shadow.md`

## Performance cost

`low` — no significant cost

## Accessibility

Excellent.

---
id: art-deco
category: retro
description: "Art Deco: gold-on-navy, geometric symmetry, ornate borders."
when_to_use: ["Luxury brands","Wedding/event sites"]
contraindications: ["SaaS","Tech"]
contraindicated_with: []
required_tokens: ["palette.art-deco"]
cost: medium
accessibility: "Verify gold-on-dark contrast."
---

# Art Deco

Art Deco: gold-on-navy, geometric symmetry, ornate borders.

## When to use

- Luxury brands
- Wedding/event sites

## When NOT to use

- SaaS
- Tech

## Do

- ✅ Symmetric layouts
- ✅ Gold/brass accents
- ✅ Bold serif display fonts

## Don't

- ❌ Use for product UI

## Recipe (CSS)

```css
background: oklch(20% 0.10 240);
color: oklch(75% 0.18 75);
border: 2px solid currentColor;
font-family: var(--vyre-font-family-display);
```

## Required tokens

- `palette.art-deco`

## Performance cost

`medium` — reasonable for most contexts

## Accessibility

Verify gold-on-dark contrast.

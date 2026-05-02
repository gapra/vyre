---
id: bento
category: expressive
description: "Asymmetric grid of varied-size cards, like a bento box."
when_to_use: ["Product showcases","Feature highlights","Personal portfolios"]
contraindications: ["Sequential content"]
contraindicated_with: []
required_tokens: ["surface.card","space.4","radius.xl"]
cost: low
accessibility: "Excellent if reading order is logical."
---

# Bento

Asymmetric grid of varied-size cards, like a bento box.

## When to use

- Product showcases
- Feature highlights
- Personal portfolios

## When NOT to use

- Sequential content

## Do

- ✅ Vary card sizes meaningfully
- ✅ Use rounded corners (xl+)
- ✅ Each tile has one focus

## Don't

- ❌ Random sizing
- ❌ Cram tiles
- ❌ Mix radius values

## Recipe (CSS)

```css
display: grid;
grid-template-columns: repeat(4, 1fr);
grid-auto-rows: minmax(120px, auto);
gap: var(--vyre-space-4);
& > .feature { grid-column: span 2; grid-row: span 2; }
```

## Required tokens

- `surface.card`
- `space.4`
- `radius.xl`

## Performance cost

`low` — no significant cost

## Accessibility

Excellent if reading order is logical.

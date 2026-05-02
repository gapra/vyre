---
id: swiss-grid
category: editorial
description: "International Typographic Style. Strict 12-column grid, sans-serif, asymmetric, no decoration."
when_to_use: ["Portfolios","Architecture sites","Corporate identity"]
contraindications: ["Playful brands","E-commerce"]
contraindicated_with: ["memphis","playful"]
required_tokens: ["font.family.sans","font.weight.bold"]
cost: low
accessibility: "Excellent."
---

# Swiss Grid

International Typographic Style. Strict 12-column grid, sans-serif, asymmetric, no decoration.

## When to use

- Portfolios
- Architecture sites
- Corporate identity

## When NOT to use

- Playful brands
- E-commerce

## Do

- ✅ Use Helvetica/Inter
- ✅ Strict grid alignment
- ✅ Black/white/single accent

## Don't

- ❌ Center text
- ❌ Use ornaments
- ❌ Break the grid for fun

## Recipe (CSS)

```css
display: grid;
grid-template-columns: repeat(12, 1fr);
gap: var(--vyre-space-6);
font-family: var(--vyre-font-family-sans);
```

## Required tokens

- `font.family.sans`
- `font.weight.bold`

## Performance cost

`low` — no significant cost

## Accessibility

Excellent.

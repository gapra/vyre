---
id: gallery
category: editorial
description: "Gallery-style with image-forward composition, sparse text, generous margins."
when_to_use: ["Portfolios","Photography","Product showcases"]
contraindications: ["Data-heavy UI"]
contraindicated_with: []
required_tokens: ["space.16","font.family.serif"]
cost: low
accessibility: "Good if alt text used."
---

# Gallery

Gallery-style with image-forward composition, sparse text, generous margins.

## When to use

- Portfolios
- Photography
- Product showcases

## When NOT to use

- Data-heavy UI

## Do

- ✅ Massive whitespace
- ✅ Captions in small caps
- ✅ Black/white only

## Don't

- ❌ Crowd images
- ❌ Add UI chrome

## Recipe (CSS)

```css
display: grid;
grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
gap: var(--vyre-space-8);
padding: var(--vyre-space-16);
```

## Required tokens

- `space.16`
- `font.family.serif`

## Performance cost

`low` — no significant cost

## Accessibility

Good if alt text used.

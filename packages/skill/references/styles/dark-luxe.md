---
id: dark-luxe
category: premium
description: "Dark mode luxury: deep blacks, gold/silver accents, elegant serifs."
when_to_use: ["Luxury e-commerce","High-end services"]
contraindications: ["Mass market"]
contraindicated_with: []
required_tokens: ["palette.gold-luxe","shadow.xl"]
cost: medium
accessibility: "Verify gold/silver text contrast."
---

# Dark Luxe

Dark mode luxury: deep blacks, gold/silver accents, elegant serifs.

## When to use

- Luxury e-commerce
- High-end services

## When NOT to use

- Mass market

## Do

- ✅ Deep #000-#111 backgrounds
- ✅ Metallic accents
- ✅ Serif display

## Don't

- ❌ Use saturated colors as fills
- ❌ Dilute with too many accents

## Recipe (CSS)

```css
background: oklch(8% 0.005 30);
color: oklch(95% 0.04 60);
font-family: var(--vyre-font-family-serif);
& .accent { color: oklch(75% 0.16 75); }
```

## Required tokens

- `palette.gold-luxe`
- `shadow.xl`

## Performance cost

`medium` — reasonable for most contexts

## Accessibility

Verify gold/silver text contrast.

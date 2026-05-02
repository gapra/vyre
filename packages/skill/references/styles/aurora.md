---
id: aurora
category: expressive
description: "Atmospheric gradients evoking northern lights — soft hue shifts and luminous backgrounds."
when_to_use: ["Landing pages","AI products","Hero sections"]
contraindications: ["Dense UI"]
contraindicated_with: ["flat","minimal"]
required_tokens: ["palette.aurora","shadow.xl"]
cost: medium
accessibility: "Ensure overlay contrast for any text on gradients."
---

# Aurora

Atmospheric gradients evoking northern lights — soft hue shifts and luminous backgrounds.

## When to use

- Landing pages
- AI products
- Hero sections

## When NOT to use

- Dense UI

## Do

- ✅ Use diagonal gradients
- ✅ Combine with glassmorphism
- ✅ Subtle animation OK

## Don't

- ❌ Place body text directly on gradient
- ❌ Use for buttons

## Recipe (CSS)

```css
background: linear-gradient(135deg,
  oklch(70% 0.18 160) 0%,
  oklch(60% 0.22 220) 50%,
  oklch(65% 0.24 295) 100%
);
filter: blur(0);
```

## Required tokens

- `palette.aurora`
- `shadow.xl`

## Performance cost

`medium` — reasonable for most contexts

## Accessibility

Ensure overlay contrast for any text on gradients.

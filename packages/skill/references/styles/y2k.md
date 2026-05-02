---
id: y2k
category: retro
description: "Y2K aesthetic: chrome, gradients, frosted glass, cyan/magenta."
when_to_use: ["Niche creative sites","Music/fashion"]
contraindications: ["Most products"]
contraindicated_with: ["minimal"]
required_tokens: ["palette.y2k"]
cost: medium
accessibility: "Test gradient text."
---

# Y2k

Y2K aesthetic: chrome, gradients, frosted glass, cyan/magenta.

## When to use

- Niche creative sites
- Music/fashion

## When NOT to use

- Most products

## Do

- ✅ Chrome/silver textures
- ✅ Bubbly type
- ✅ Lens flare accents

## Don't

- ❌ Use unironically for serious products

## Recipe (CSS)

```css
background: linear-gradient(135deg, oklch(85% 0.18 195) 0%, oklch(80% 0.22 320) 100%);
backdrop-filter: blur(10px);
border: 1px solid oklch(100% 0 0 / 0.4);
```

## Required tokens

- `palette.y2k`

## Performance cost

`medium` — reasonable for most contexts

## Accessibility

Test gradient text.

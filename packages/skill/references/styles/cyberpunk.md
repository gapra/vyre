---
id: cyberpunk
category: expressive
description: "Neon-on-dark with sharp angles, scanlines, glow effects."
when_to_use: ["Gaming sites","Crypto","Sci-fi products"]
contraindications: ["Healthcare","Finance","B2B"]
contraindicated_with: ["minimal","editorial"]
required_tokens: ["palette.cyberpunk","shadow.lg"]
cost: medium
accessibility: "Test glow effects — they can hurt readability."
---

# Cyberpunk

Neon-on-dark with sharp angles, scanlines, glow effects.

## When to use

- Gaming sites
- Crypto
- Sci-fi products

## When NOT to use

- Healthcare
- Finance
- B2B

## Do

- ✅ Use neon pink + cyan
- ✅ Add subtle glow
- ✅ Sharp clip-path edges

## Don't

- ❌ Glow body text heavily
- ❌ Use for forms

## Recipe (CSS)

```css
background: oklch(15% 0.05 270);
color: oklch(85% 0.22 320);
border: 1px solid oklch(75% 0.28 175);
box-shadow: 0 0 20px oklch(75% 0.28 175 / 0.5);
text-shadow: 0 0 4px currentColor;
```

## Required tokens

- `palette.cyberpunk`
- `shadow.lg`

## Performance cost

`medium` — reasonable for most contexts

## Accessibility

Test glow effects — they can hurt readability.

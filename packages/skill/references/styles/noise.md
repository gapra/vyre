---
id: noise
category: expressive
description: "Subtle film-grain texture across surfaces."
when_to_use: ["Premium brands","Editorial sites","Gallery sites"]
contraindications: ["Performance critical"]
contraindicated_with: ["flat"]
required_tokens: []
cost: medium
accessibility: "Subtle noise OK; avoid for dyslexia profiles."
---

# Noise

Subtle film-grain texture across surfaces.

## When to use

- Premium brands
- Editorial sites
- Gallery sites

## When NOT to use

- Performance critical

## Do

- ✅ Use 3-5% opacity
- ✅ Apply to backgrounds only

## Don't

- ❌ Apply to small UI elements
- ❌ Use over text

## Recipe (CSS)

```css
position: relative;
&::after {
  content: '';
  position: absolute; inset: 0;
  background-image: url("data:image/svg+xml,..."); /* SVG grain */
  opacity: 0.04;
  pointer-events: none;
}
```

## Required tokens

_Uses default Vyre tokens._

## Performance cost

`medium` — reasonable for most contexts

## Accessibility

Subtle noise OK; avoid for dyslexia profiles.

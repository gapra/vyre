---
id: fullbleed
category: expressive
description: "Edge-to-edge imagery with overlaid text — magazine cover style."
when_to_use: ["Hero sections","Storytelling sites"]
contraindications: ["Forms","Dashboards"]
contraindicated_with: []
required_tokens: ["shadow.lg"]
cost: medium
accessibility: "Provide adequate text overlay contrast."
---

# Fullbleed

Edge-to-edge imagery with overlaid text — magazine cover style.

## When to use

- Hero sections
- Storytelling sites

## When NOT to use

- Forms
- Dashboards

## Do

- ✅ Always darken/lighten image for text
- ✅ Use sparingly per page

## Don't

- ❌ Use without overlay
- ❌ Stack many fullbleeds

## Recipe (CSS)

```css
background: var(--image) center/cover;
&::after { content: ''; position: absolute; inset: 0; background: linear-gradient(180deg, transparent 0%, oklch(0% 0 0 / 0.6) 100%); }
& .text { position: relative; color: var(--vyre-content-inverse); }
```

## Required tokens

- `shadow.lg`

## Performance cost

`medium` — reasonable for most contexts

## Accessibility

Provide adequate text overlay contrast.

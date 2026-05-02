---
id: anti-design
category: brutalist
description: "Intentionally clashing — breaks conventions for artistic effect."
when_to_use: ["Avant-garde art sites","Statement projects"]
contraindications: ["Almost everything else"]
contraindicated_with: ["*"]
required_tokens: []
cost: low
accessibility: "Difficult — requires deliberate craft."
---

# Anti Design

Intentionally clashing — breaks conventions for artistic effect.

## When to use

- Avant-garde art sites
- Statement projects

## When NOT to use

- Almost everything else

## Do

- ✅ Break grid
- ✅ Mismatched fonts
- ✅ Tilted elements

## Don't

- ❌ Use unironically for products people need
- ❌ Sacrifice a11y

## Recipe (CSS)

```css
font-family: Comic Sans MS, var(--vyre-font-family-sans);
background: var(--vyre-status-warning-solid);
color: var(--vyre-status-danger-solid);
transform: rotate(-1deg);
```

## Required tokens

_Uses default Vyre tokens._

## Performance cost

`low` — no significant cost

## Accessibility

Difficult — requires deliberate craft.

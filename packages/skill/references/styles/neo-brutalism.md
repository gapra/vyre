---
id: neo-brutalism
category: brutalist
description: "Brutalism softened with bold colors and chunky rounded corners."
when_to_use: ["Indie SaaS landing","Creator products","Bold marketing"]
contraindications: ["Enterprise"]
contraindicated_with: ["minimal"]
required_tokens: ["border.width.2","shadow.md"]
cost: low
accessibility: "Good with verified contrast."
---

# Neo Brutalism

Brutalism softened with bold colors and chunky rounded corners.

## When to use

- Indie SaaS landing
- Creator products
- Bold marketing

## When NOT to use

- Enterprise

## Do

- ✅ Use chunky 2-4px borders
- ✅ Hard offset shadows
- ✅ Saturated background colors
- ✅ Bold weights

## Don't

- ❌ Use soft shadows
- ❌ Mix with gradients
- ❌ Use for utility UI

## Recipe (CSS)

```css
background: var(--vyre-interactive-primary-subtle);
border: 2px solid var(--vyre-content-primary);
border-radius: var(--vyre-radius-md);
box-shadow: 4px 4px 0 var(--vyre-content-primary);
font-weight: var(--vyre-font-weight-bold);
```

## Required tokens

- `border.width.2`
- `shadow.md`

## Performance cost

`low` — no significant cost

## Accessibility

Good with verified contrast.

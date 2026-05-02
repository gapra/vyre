---
id: wireframe
category: specialized
description: "Schematic black-on-white wireframe look — for prototypes, drafts."
when_to_use: ["Mockups","Drafts","Architectural diagrams"]
contraindications: ["Production"]
contraindicated_with: []
required_tokens: ["border.width.1"]
cost: low
accessibility: "Excellent."
---

# Wireframe

Schematic black-on-white wireframe look — for prototypes, drafts.

## When to use

- Mockups
- Drafts
- Architectural diagrams

## When NOT to use

- Production

## Do

- ✅ Use for early drafts
- ✅ Pure b&w

## Don't

- ❌ Ship to production

## Recipe (CSS)

```css
background: var(--vyre-surface-background);
border: 1px solid var(--vyre-content-primary);
font-family: var(--vyre-font-family-mono);
```

## Required tokens

- `border.width.1`

## Performance cost

`low` — no significant cost

## Accessibility

Excellent.

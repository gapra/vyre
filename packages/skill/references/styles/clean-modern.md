---
id: clean-modern
category: flat
description: "Refined flat with hairline borders, subtle shadows, generous whitespace."
when_to_use: ["Default fallback","B2B SaaS","Productivity tools"]
contraindications: []
contraindicated_with: []
required_tokens: ["surface.card","border.subtle","shadow.xs"]
cost: low
accessibility: "Excellent."
---

# Clean Modern

Refined flat with hairline borders, subtle shadows, generous whitespace.

## When to use

- Default fallback
- B2B SaaS
- Productivity tools

## When NOT to use

_No major contraindications._

## Do

- ✅ Use for default product UI
- ✅ Pair with sans-serif type
- ✅ Use space-4 minimum padding

## Don't

- ❌ Compete with content
- ❌ Use bright accent colors as fills

## Recipe (CSS)

```css
background: var(--vyre-surface-card);
border: 1px solid var(--vyre-border-subtle);
border-radius: var(--vyre-radius-lg);
box-shadow: var(--vyre-shadow-xs);
```

## Required tokens

- `surface.card`
- `border.subtle`
- `shadow.xs`

## Performance cost

`low` — no significant cost

## Accessibility

Excellent.

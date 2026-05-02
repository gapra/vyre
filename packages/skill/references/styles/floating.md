---
id: floating
category: expressive
description: "Floating cards/elements with deep shadows and subtle hover lift."
when_to_use: ["Showcase sites","Modern landings"]
contraindications: ["Dense data UI"]
contraindicated_with: []
required_tokens: ["shadow.xl","shadow.2xl"]
cost: low
accessibility: "Good."
---

# Floating

Floating cards/elements with deep shadows and subtle hover lift.

## When to use

- Showcase sites
- Modern landings

## When NOT to use

- Dense data UI

## Do

- ✅ Lift on hover
- ✅ Use deep shadows
- ✅ Generous radius

## Don't

- ❌ Apply to every element
- ❌ Combine with flat

## Recipe (CSS)

```css
background: var(--vyre-surface-card);
border-radius: var(--vyre-radius-xl);
box-shadow: var(--vyre-shadow-xl);
transition: transform var(--vyre-motion-duration-fast) var(--vyre-motion-easing-standard), box-shadow var(--vyre-motion-duration-fast);
&:hover { transform: translateY(-4px); box-shadow: var(--vyre-shadow-2xl); }
```

## Required tokens

- `shadow.xl`
- `shadow.2xl`

## Performance cost

`low` — no significant cost

## Accessibility

Good.

---
id: blueprint
category: specialized
description: "Engineering blueprint: cyan-on-navy with technical typography."
when_to_use: ["Engineering tools","Architecture sites"]
contraindications: ["General UI"]
contraindicated_with: []
required_tokens: ["palette.tech-blue"]
cost: low
accessibility: "Verify cyan-on-navy contrast."
---

# Blueprint

Engineering blueprint: cyan-on-navy with technical typography.

## When to use

- Engineering tools
- Architecture sites

## When NOT to use

- General UI

## Do

- ✅ Grid backgrounds
- ✅ Technical labels
- ✅ Drafting font

## Don't

- ❌ Mix with other styles

## Recipe (CSS)

```css
background: oklch(20% 0.12 240);
color: oklch(85% 0.10 220);
font-family: var(--vyre-font-family-mono);
border: 1px solid currentColor;
```

## Required tokens

- `palette.tech-blue`

## Performance cost

`low` — no significant cost

## Accessibility

Verify cyan-on-navy contrast.

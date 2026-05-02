---
id: flat
category: flat
description: "Pure flat colors, no shadows, sharp edges. The default modern style."
when_to_use: ["Default for most UI","Performance-critical apps","Content-focused products"]
contraindications: ["Marketing pages needing depth"]
contraindicated_with: ["skeuomorphic"]
required_tokens: ["surface.background","content.primary"]
cost: low
accessibility: "Excellent — high contrast inherent."
---

# Flat

Pure flat colors, no shadows, sharp edges. The default modern style.

## When to use

- Default for most UI
- Performance-critical apps
- Content-focused products

## When NOT to use

- Marketing pages needing depth

## Do

- ✅ Use generous whitespace
- ✅ Rely on type hierarchy
- ✅ Keep borders 1px or hairline

## Don't

- ❌ Add gratuitous shadows
- ❌ Use gradients

## Recipe (CSS)

```css
background: var(--vyre-surface-card);
border: 1px solid var(--vyre-border-subtle);
border-radius: var(--vyre-radius-md);
```

## Required tokens

- `surface.background`
- `content.primary`

## Performance cost

`low` — no significant cost

## Accessibility

Excellent — high contrast inherent.

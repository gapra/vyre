---
id: neumorphism
category: morphism
description: "Soft UI with extruded surfaces — same color as background, defined by paired light/dark shadows."
when_to_use: ["Niche products","Music/audio apps","Smart home dashboards"]
contraindications: ["Accessibility-first products","High-contrast needs","Forms and data UI"]
contraindicated_with: ["glassmorphism","flat"]
required_tokens: ["surface.background","shadow.lg","shadow.inner"]
cost: medium
accessibility: "WARNING: Low contrast by design. Add explicit text contrast checks; use sparingly."
---

# Neumorphism

Soft UI with extruded surfaces — same color as background, defined by paired light/dark shadows.

## When to use

- Niche products
- Music/audio apps
- Smart home dashboards

## When NOT to use

- Accessibility-first products
- High-contrast needs
- Forms and data UI

## Do

- ✅ Use light/medium gray backgrounds
- ✅ Keep all elements monochromatic
- ✅ Reserve for showcase elements

## Don't

- ❌ Use for primary CTAs (low affordance)
- ❌ Mix with sharp/flat elements
- ❌ Use on dark mode without testing

## Recipe (CSS)

```css
background: var(--vyre-surface-background);
border-radius: var(--vyre-radius-xl);
box-shadow: 8px 8px 16px oklch(0% 0 0 / 0.1), -8px -8px 16px oklch(100% 0 0 / 0.7);
```

## Required tokens

- `surface.background`
- `shadow.lg`
- `shadow.inner`

## Performance cost

`medium` — reasonable for most contexts

## Accessibility

WARNING: Low contrast by design. Add explicit text contrast checks; use sparingly.

---
id: hig
category: material
description: "Apple Human Interface Guidelines: cleanliness, deference, depth."
when_to_use: ["iOS/macOS apps","Apple-aligned products"]
contraindications: ["Android-only"]
contraindicated_with: ["material-3","fluent-2"]
required_tokens: ["radius.xl","shadow.sm"]
cost: low
accessibility: "Excellent — HIG mandates a11y."
---

# Hig

Apple Human Interface Guidelines: cleanliness, deference, depth.

## When to use

- iOS/macOS apps
- Apple-aligned products

## When NOT to use

- Android-only

## Do

- ✅ Use SF Pro / system fonts
- ✅ Generous corner radii
- ✅ Subtle vibrancy effects

## Don't

- ❌ Use Material elevation
- ❌ Sharp corners

## Recipe (CSS)

```css
background: var(--vyre-surface-card);
border-radius: var(--vyre-radius-2xl);
box-shadow: 0 4px 16px oklch(0% 0 0 / 0.08);
font-family: -apple-system, BlinkMacSystemFont, var(--vyre-font-family-sans);
```

## Required tokens

- `radius.xl`
- `shadow.sm`

## Performance cost

`low` — no significant cost

## Accessibility

Excellent — HIG mandates a11y.

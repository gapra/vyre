---
id: material-3
category: material
description: "Google Material Design 3: dynamic color, expressive shapes, elevation tiers."
when_to_use: ["Android apps","Cross-platform with Android","Google product alignment"]
contraindications: ["iOS-only apps"]
contraindicated_with: ["hig","fluent"]
required_tokens: ["shadow.sm","shadow.md","radius.lg"]
cost: medium
accessibility: "Excellent — Material has strong a11y baseline."
---

# Material 3

Google Material Design 3: dynamic color, expressive shapes, elevation tiers.

## When to use

- Android apps
- Cross-platform with Android
- Google product alignment

## When NOT to use

- iOS-only apps

## Do

- ✅ Use elevation tiers consistently
- ✅ Dynamic color from wallpaper
- ✅ Strong FAB usage

## Don't

- ❌ Mix with flat
- ❌ Skip elevation

## Recipe (CSS)

```css
background: var(--vyre-surface-card);
border-radius: var(--vyre-radius-xl);
box-shadow: 0 1px 3px oklch(0% 0 0 / 0.12), 0 1px 2px oklch(0% 0 0 / 0.24);
padding: var(--vyre-space-4);
```

## Required tokens

- `shadow.sm`
- `shadow.md`
- `radius.lg`

## Performance cost

`medium` — reasonable for most contexts

## Accessibility

Excellent — Material has strong a11y baseline.

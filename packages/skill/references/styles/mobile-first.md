---
id: mobile-first
category: specialized
description: "Thumb-friendly bottom nav, swipe gestures, tall touch zones."
when_to_use: ["Mobile apps","Mobile-web priority"]
contraindications: ["Desktop-only"]
contraindicated_with: []
required_tokens: ["space.4","radius.lg"]
cost: low
accessibility: "Targets ≥44px."
---

# Mobile First

Thumb-friendly bottom nav, swipe gestures, tall touch zones.

## When to use

- Mobile apps
- Mobile-web priority

## When NOT to use

- Desktop-only

## Do

- ✅ Bottom nav
- ✅ Tall buttons
- ✅ Sheet modals

## Don't

- ❌ Tiny taps
- ❌ Hover-only interactions

## Recipe (CSS)

```css
padding: var(--vyre-space-4);
min-height: 44px;
border-radius: var(--vyre-radius-lg);
& nav { position: fixed; bottom: 0; }
```

## Required tokens

- `space.4`
- `radius.lg`

## Performance cost

`low` — no significant cost

## Accessibility

Targets ≥44px.

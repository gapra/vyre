---
id: kiosk
category: specialized
description: "Large touch targets, high contrast, simple navigation. For public terminals."
when_to_use: ["Self-service kiosks","Wayfinding","Accessibility-first"]
contraindications: ["Mouse/keyboard products"]
contraindicated_with: []
required_tokens: ["space.10","font.size.3xl"]
cost: low
accessibility: "Required: WCAG AAA."
---

# Kiosk

Large touch targets, high contrast, simple navigation. For public terminals.

## When to use

- Self-service kiosks
- Wayfinding
- Accessibility-first

## When NOT to use

- Mouse/keyboard products

## Do

- ✅ 64px+ touch targets
- ✅ AAA contrast
- ✅ Few choices per screen

## Don't

- ❌ Hover states
- ❌ Tooltips
- ❌ Small text

## Recipe (CSS)

```css
font-size: var(--vyre-font-size-3xl);
padding: var(--vyre-space-10);
min-height: 64px;
border-radius: var(--vyre-radius-xl);
```

## Required tokens

- `space.10`
- `font.size.3xl`

## Performance cost

`low` — no significant cost

## Accessibility

Required: WCAG AAA.

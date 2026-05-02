---
id: illustrated
category: playful
description: "Custom illustrations as primary visual element, supportive UI."
when_to_use: ["Onboarding","Empty states","Marketing"]
contraindications: ["Data UI"]
contraindicated_with: []
required_tokens: ["surface.background"]
cost: high
accessibility: "Decorative — provide alt text."
---

# Illustrated

Custom illustrations as primary visual element, supportive UI.

## When to use

- Onboarding
- Empty states
- Marketing

## When NOT to use

- Data UI

## Do

- ✅ Use illustrations to clarify concepts
- ✅ Stylistically consistent set

## Don't

- ❌ Use random stock illustrations
- ❌ Block content with art

## Recipe (CSS)

```css
display: flex;
flex-direction: column;
align-items: center;
gap: var(--vyre-space-6);
```

## Required tokens

- `surface.background`

## Performance cost

`high` — use sparingly, profile on low-end devices

## Accessibility

Decorative — provide alt text.

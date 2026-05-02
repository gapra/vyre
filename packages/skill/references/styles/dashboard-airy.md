---
id: dashboard-airy
category: dashboard
description: "Modern dashboard with breathing room — cards, generous spacing, clear data viz."
when_to_use: ["SaaS dashboards","Health/wellness apps","Personal analytics"]
contraindications: ["Trading floor density"]
contraindicated_with: ["dashboard-dense"]
required_tokens: ["surface.card","space.6","shadow.sm"]
cost: low
accessibility: "Excellent."
---

# Dashboard Airy

Modern dashboard with breathing room — cards, generous spacing, clear data viz.

## When to use

- SaaS dashboards
- Health/wellness apps
- Personal analytics

## When NOT to use

- Trading floor density

## Do

- ✅ Card-per-metric layout
- ✅ Generous space between cards
- ✅ Charts breathe

## Don't

- ❌ Edge-to-edge tables
- ❌ No whitespace

## Recipe (CSS)

```css
background: var(--vyre-surface-card);
border-radius: var(--vyre-radius-lg);
padding: var(--vyre-space-6);
box-shadow: var(--vyre-shadow-sm);
```

## Required tokens

- `surface.card`
- `space.6`
- `shadow.sm`

## Performance cost

`low` — no significant cost

## Accessibility

Excellent.

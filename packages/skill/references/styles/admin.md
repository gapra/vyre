---
id: admin
category: dashboard
description: "Sober admin panel — tables, sidebars, action toolbars."
when_to_use: ["Backoffice tools","CMS","Internal admin"]
contraindications: ["Customer-facing"]
contraindicated_with: []
required_tokens: ["border.default","space.4"]
cost: low
accessibility: "Good."
---

# Admin

Sober admin panel — tables, sidebars, action toolbars.

## When to use

- Backoffice tools
- CMS
- Internal admin

## When NOT to use

- Customer-facing

## Do

- ✅ Persistent sidebar nav
- ✅ Bulk actions
- ✅ Filter/search prominent

## Don't

- ❌ Hide nav
- ❌ Modal-heavy flows

## Recipe (CSS)

```css
display: grid;
grid-template-columns: 240px 1fr;
border-top: 1px solid var(--vyre-border-default);
```

## Required tokens

- `border.default`
- `space.4`

## Performance cost

`low` — no significant cost

## Accessibility

Good.

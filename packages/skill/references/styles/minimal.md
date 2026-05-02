---
id: minimal
category: flat
description: "Maximum restraint. Borders only, no fills, no shadows."
when_to_use: ["Editorial sites","Reading apps","Portfolio sites"]
contraindications: ["Dashboards needing visual hierarchy"]
contraindicated_with: ["claymorphism","neumorphism"]
required_tokens: ["border.subtle","content.primary"]
cost: low
accessibility: "Excellent if type hierarchy is strong."
---

# Minimal

Maximum restraint. Borders only, no fills, no shadows.

## When to use

- Editorial sites
- Reading apps
- Portfolio sites

## When NOT to use

- Dashboards needing visual hierarchy

## Do

- ✅ Lean on typographic hierarchy
- ✅ Use whitespace as separator
- ✅ Single accent color

## Don't

- ❌ Add decorative elements
- ❌ Use multiple accent colors

## Recipe (CSS)

```css
background: transparent;
border-top: 1px solid var(--vyre-border-subtle);
padding: var(--vyre-space-6) 0;
```

## Required tokens

- `border.subtle`
- `content.primary`

## Performance cost

`low` — no significant cost

## Accessibility

Excellent if type hierarchy is strong.

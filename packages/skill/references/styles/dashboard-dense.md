---
id: dashboard-dense
category: dashboard
description: "Information-dense dashboard. Tight spacing, small fonts, clear data hierarchy."
when_to_use: ["Trading platforms","Analytics tools","Admin panels"]
contraindications: ["Marketing sites","Mobile-first"]
contraindicated_with: ["editorial","gallery"]
required_tokens: ["space.2","font.size.sm","border.subtle"]
cost: low
accessibility: "Test with zoom users — small text needs reflow."
---

# Dashboard Dense

Information-dense dashboard. Tight spacing, small fonts, clear data hierarchy.

## When to use

- Trading platforms
- Analytics tools
- Admin panels

## When NOT to use

- Marketing sites
- Mobile-first

## Do

- ✅ Use 13-14px base text
- ✅ Hairline borders
- ✅ Tabular numbers
- ✅ Sticky headers

## Don't

- ❌ Add padding > space-3
- ❌ Use big radius
- ❌ Decorate

## Recipe (CSS)

```css
font-size: var(--vyre-font-size-sm);
padding: var(--vyre-space-2) var(--vyre-space-3);
border-bottom: 1px solid var(--vyre-border-subtle);
```

## Required tokens

- `space.2`
- `font.size.sm`
- `border.subtle`

## Performance cost

`low` — no significant cost

## Accessibility

Test with zoom users — small text needs reflow.

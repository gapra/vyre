---
id: high-density-table
category: specialized
description: "Spreadsheet-density tables: tabular nums, sticky headers, compact rows."
when_to_use: ["Data tools","Trading","Spreadsheet UIs"]
contraindications: ["Casual UIs"]
contraindicated_with: []
required_tokens: ["font.family.mono","space.1","space.2"]
cost: low
accessibility: "Zoom-friendly required."
---

# High Density Table

Spreadsheet-density tables: tabular nums, sticky headers, compact rows.

## When to use

- Data tools
- Trading
- Spreadsheet UIs

## When NOT to use

- Casual UIs

## Do

- ✅ Tabular numbers
- ✅ Right-align numbers
- ✅ Sticky headers/columns
- ✅ Zebra rows optional

## Don't

- ❌ Center numeric data
- ❌ Use proportional fonts for numbers

## Recipe (CSS)

```css
font-variant-numeric: tabular-nums;
font-size: var(--vyre-font-size-sm);
padding: var(--vyre-space-1) var(--vyre-space-2);
border-bottom: 1px solid var(--vyre-border-subtle);
```

## Required tokens

- `font.family.mono`
- `space.1`
- `space.2`

## Performance cost

`low` — no significant cost

## Accessibility

Zoom-friendly required.

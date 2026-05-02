---
id: magazine-modern
category: editorial
description: "Modern magazine: large display type, image-led, generous margins."
when_to_use: ["Editorial sites","Long-form content"]
contraindications: ["Apps"]
contraindicated_with: []
required_tokens: ["font.size.7xl","space.16"]
cost: low
accessibility: "Excellent."
---

# Magazine Modern

Modern magazine: large display type, image-led, generous margins.

## When to use

- Editorial sites
- Long-form content

## When NOT to use

- Apps

## Do

- ✅ Massive headlines
- ✅ Pull quotes
- ✅ Multi-column layouts

## Don't

- ❌ Cram content
- ❌ Skip whitespace

## Recipe (CSS)

```css
& h1 { font-size: var(--vyre-font-size-7xl); font-weight: var(--vyre-font-weight-bold); line-height: var(--vyre-font-line-height-tight); }
& article { padding: var(--vyre-space-16) var(--vyre-space-8); }
```

## Required tokens

- `font.size.7xl`
- `space.16`

## Performance cost

`low` — no significant cost

## Accessibility

Excellent.

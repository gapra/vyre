---
id: newspaper
category: editorial
description: "Multi-column dense text, classic serif, traditional hierarchy."
when_to_use: ["News sites","Long articles"]
contraindications: ["Mobile-first","Modern SaaS"]
contraindicated_with: ["minimal"]
required_tokens: ["font.family.serif"]
cost: low
accessibility: "Good with proper line length."
---

# Newspaper

Multi-column dense text, classic serif, traditional hierarchy.

## When to use

- News sites
- Long articles

## When NOT to use

- Mobile-first
- Modern SaaS

## Do

- ✅ Use on desktop articles
- ✅ Hyphenate
- ✅ Drop caps for openings

## Don't

- ❌ Use on mobile (column nav awful)
- ❌ Use sans-serif

## Recipe (CSS)

```css
column-count: 2;
column-gap: var(--vyre-space-8);
font-family: var(--vyre-font-family-serif);
hyphens: auto;
```

## Required tokens

- `font.family.serif`

## Performance cost

`low` — no significant cost

## Accessibility

Good with proper line length.

---
id: blog-clean
category: editorial
description: "Modern blog: sans-serif, single column, ample whitespace."
when_to_use: ["Personal blogs","Documentation","Reading apps"]
contraindications: []
contraindicated_with: []
required_tokens: ["font.family.sans","space.6"]
cost: low
accessibility: "Excellent."
---

# Blog Clean

Modern blog: sans-serif, single column, ample whitespace.

## When to use

- Personal blogs
- Documentation
- Reading apps

## When NOT to use

_No major contraindications._

## Do

- ✅ Generous line height (1.65+)
- ✅ Honor reading width
- ✅ Strong heading hierarchy

## Don't

- ❌ Use full-width text
- ❌ Cram sidebars

## Recipe (CSS)

```css
max-width: 70ch;
margin: 0 auto;
padding: var(--vyre-space-12) var(--vyre-space-6);
font-size: var(--vyre-font-size-lg);
line-height: var(--vyre-font-line-height-relaxed);
```

## Required tokens

- `font.family.sans`
- `space.6`

## Performance cost

`low` — no significant cost

## Accessibility

Excellent.

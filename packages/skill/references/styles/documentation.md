---
id: documentation
category: editorial
description: "Technical docs: clear hierarchy, monospace inline code, sidebar nav."
when_to_use: ["Dev docs","API references","Knowledge bases"]
contraindications: ["Marketing"]
contraindicated_with: []
required_tokens: ["font.family.mono","border.subtle"]
cost: low
accessibility: "Excellent."
---

# Documentation

Technical docs: clear hierarchy, monospace inline code, sidebar nav.

## When to use

- Dev docs
- API references
- Knowledge bases

## When NOT to use

- Marketing

## Do

- ✅ Sidebar TOC
- ✅ Inline code highlighting
- ✅ Anchor links on headings

## Don't

- ❌ Marketing fluff
- ❌ Animation distractions

## Recipe (CSS)

```css
font-family: var(--vyre-font-family-sans);
& code { font-family: var(--vyre-font-family-mono); background: var(--vyre-surface-muted); padding: 2px 6px; border-radius: var(--vyre-radius-sm); }
```

## Required tokens

- `font.family.mono`
- `border.subtle`

## Performance cost

`low` — no significant cost

## Accessibility

Excellent.

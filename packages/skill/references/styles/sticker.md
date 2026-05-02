---
id: sticker
category: playful
description: "Sticker-pack aesthetic: chunky outlines, drop shadows, layered cards."
when_to_use: ["Social apps","Creator tools","Marketing"]
contraindications: ["Enterprise"]
contraindicated_with: ["minimal"]
required_tokens: ["border.width.4","shadow.lg"]
cost: low
accessibility: "Good."
---

# Sticker

Sticker-pack aesthetic: chunky outlines, drop shadows, layered cards.

## When to use

- Social apps
- Creator tools
- Marketing

## When NOT to use

- Enterprise

## Do

- ✅ Thick outlines
- ✅ Hard shadows
- ✅ Slight rotations

## Don't

- ❌ Use for forms
- ❌ Stack many tilted elements

## Recipe (CSS)

```css
background: var(--vyre-surface-card);
border: 4px solid var(--vyre-content-primary);
border-radius: var(--vyre-radius-xl);
box-shadow: 8px 8px 0 var(--vyre-content-primary);
transform: rotate(-1deg);
```

## Required tokens

- `border.width.4`
- `shadow.lg`

## Performance cost

`low` — no significant cost

## Accessibility

Good.

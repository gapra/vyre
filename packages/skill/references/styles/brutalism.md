---
id: brutalism
category: brutalist
description: "Raw, deliberately ugly, exposed structure. System fonts, sharp edges, harsh colors."
when_to_use: ["Statement landing pages","Art/cultural sites","Tech-rebel brands"]
contraindications: ["Enterprise","Healthcare","General consumer products"]
contraindicated_with: ["glassmorphism","claymorphism","minimal"]
required_tokens: ["border.width.4","font.family.mono"]
cost: low
accessibility: "Test extensively — high-contrast but unconventional patterns."
---

# Brutalism

Raw, deliberately ugly, exposed structure. System fonts, sharp edges, harsh colors.

## When to use

- Statement landing pages
- Art/cultural sites
- Tech-rebel brands

## When NOT to use

- Enterprise
- Healthcare
- General consumer products

## Do

- ✅ Use thick black borders
- ✅ Hard offset shadows (no blur)
- ✅ Monospace fonts
- ✅ No border radius

## Don't

- ❌ Soften anything
- ❌ Add gradients
- ❌ Use for serious products

## Recipe (CSS)

```css
background: var(--vyre-surface-background);
border: 4px solid var(--vyre-content-primary);
font-family: var(--vyre-font-family-mono);
border-radius: 0;
box-shadow: 8px 8px 0 var(--vyre-content-primary);
```

## Required tokens

- `border.width.4`
- `font.family.mono`

## Performance cost

`low` — no significant cost

## Accessibility

Test extensively — high-contrast but unconventional patterns.

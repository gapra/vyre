---
id: terminal
category: retro
description: "CLI terminal aesthetic: monospace, minimal chrome, single accent color."
when_to_use: ["Dev tools","Hacker culture sites"]
contraindications: ["Mainstream products"]
contraindicated_with: ["claymorphism"]
required_tokens: ["font.family.mono","palette.green-crt"]
cost: low
accessibility: "Good with proper contrast."
---

# Terminal

CLI terminal aesthetic: monospace, minimal chrome, single accent color.

## When to use

- Dev tools
- Hacker culture sites

## When NOT to use

- Mainstream products

## Do

- ✅ Monospace everywhere
- ✅ Caret/cursor effects
- ✅ ASCII separators

## Don't

- ❌ Mix with sans
- ❌ Use color besides accent + neutrals

## Recipe (CSS)

```css
font-family: var(--vyre-font-family-mono);
background: oklch(8% 0.02 130);
color: oklch(80% 0.20 130);
padding: var(--vyre-space-4);
```

## Required tokens

- `font.family.mono`
- `palette.green-crt`

## Performance cost

`low` — no significant cost

## Accessibility

Good with proper contrast.

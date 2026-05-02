---
id: reading-mode
category: editorial
description: "Optimized for long reading: warm tones, comfortable line length, no chrome."
when_to_use: ["Article views","Reader apps","Documentation"]
contraindications: ["Interactive UI"]
contraindicated_with: []
required_tokens: ["palette.reading"]
cost: low
accessibility: "Excellent."
---

# Reading Mode

Optimized for long reading: warm tones, comfortable line length, no chrome.

## When to use

- Article views
- Reader apps
- Documentation

## When NOT to use

- Interactive UI

## Do

- ✅ Warm cream background
- ✅ Generous line height
- ✅ Optical sizing if available

## Don't

- ❌ Pure white background
- ❌ Cram sidebars

## Recipe (CSS)

```css
background: oklch(98% 0.02 75);
color: oklch(20% 0.04 30);
max-width: 65ch;
font-size: var(--vyre-font-size-lg);
line-height: var(--vyre-font-line-height-relaxed);
```

## Required tokens

- `palette.reading`

## Performance cost

`low` — no significant cost

## Accessibility

Excellent.

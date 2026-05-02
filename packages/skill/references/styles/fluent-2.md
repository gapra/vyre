---
id: fluent-2
category: material
description: "Microsoft Fluent 2: depth, motion, materials (acrylic, mica)."
when_to_use: ["Windows apps","Microsoft ecosystem"]
contraindications: ["iOS","Web with no platform tie"]
contraindicated_with: ["material-3"]
required_tokens: ["shadow.md","radius.md"]
cost: medium
accessibility: "Good."
---

# Fluent 2

Microsoft Fluent 2: depth, motion, materials (acrylic, mica).

## When to use

- Windows apps
- Microsoft ecosystem

## When NOT to use

- iOS
- Web with no platform tie

## Do

- ✅ Use acrylic for sidebars
- ✅ Mica for windows
- ✅ Reveal effect on hover

## Don't

- ❌ Mix with material
- ❌ Skip depth

## Recipe (CSS)

```css
background: oklch(from var(--vyre-surface-panel) l c h / 0.8);
backdrop-filter: blur(60px) saturate(125%);
border: 1px solid var(--vyre-border-subtle);
border-radius: var(--vyre-radius-md);
```

## Required tokens

- `shadow.md`
- `radius.md`

## Performance cost

`medium` — reasonable for most contexts

## Accessibility

Good.

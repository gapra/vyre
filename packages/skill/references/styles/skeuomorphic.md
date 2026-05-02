---
id: skeuomorphic
category: morphism
description: "Realistic textures and gradients mimicking physical materials."
when_to_use: ["Niche tools (e.g. analog audio plugins, watch apps)","Specific brand requests"]
contraindications: ["Modern SaaS","Performance-critical","Most contexts in 2026"]
contraindicated_with: ["flat","minimal"]
required_tokens: ["shadow.md","shadow.inner"]
cost: high
accessibility: "Test thoroughly — gradients can hurt contrast."
---

# Skeuomorphic

Realistic textures and gradients mimicking physical materials.

## When to use

- Niche tools (e.g. analog audio plugins, watch apps)
- Specific brand requests

## When NOT to use

- Modern SaaS
- Performance-critical
- Most contexts in 2026

## Do

- ✅ Keep texture restrained
- ✅ Reserve for hero/feature elements

## Don't

- ❌ Use across whole UI
- ❌ Use for general components

## Recipe (CSS)

```css
background: linear-gradient(180deg, var(--vyre-surface-raised) 0%, var(--vyre-surface-sunken) 100%);
border: 1px solid var(--vyre-border-strong);
box-shadow: inset 0 1px 0 oklch(100% 0 0 / 0.5), 0 2px 4px oklch(0% 0 0 / 0.2);
```

## Required tokens

- `shadow.md`
- `shadow.inner`

## Performance cost

`high` — use sparingly, profile on low-end devices

## Accessibility

Test thoroughly — gradients can hurt contrast.

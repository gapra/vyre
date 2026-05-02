---
id: claymorphism
category: morphism
description: "3D plasticky surfaces with rounded corners, inner light, and soft drop shadows."
when_to_use: ["Onboarding flows","Marketing pages","Kid/playful products"]
contraindications: ["Dense dashboards","Editorial content"]
contraindicated_with: ["brutalism","editorial"]
required_tokens: ["surface.panel","shadow.xl","radius.2xl"]
cost: medium
accessibility: "OK with normal contrast checks."
---

# Claymorphism

3D plasticky surfaces with rounded corners, inner light, and soft drop shadows.

## When to use

- Onboarding flows
- Marketing pages
- Kid/playful products

## When NOT to use

- Dense dashboards
- Editorial content

## Do

- ✅ Pair with vibrant colors
- ✅ Use generous padding
- ✅ Round corners heavily (24px+)

## Don't

- ❌ Use on text-heavy content
- ❌ Stack many layers
- ❌ Mix with sharp geometric shapes

## Recipe (CSS)

```css
background: var(--vyre-surface-panel);
border-radius: var(--vyre-radius-2xl);
box-shadow:
  inset 0 -4px 8px oklch(0% 0 0 / 0.05),
  inset 0 4px 8px oklch(100% 0 0 / 0.5),
  0 8px 24px oklch(0% 0 0 / 0.1);
```

## Required tokens

- `surface.panel`
- `shadow.xl`
- `radius.2xl`

## Performance cost

`medium` — reasonable for most contexts

## Accessibility

OK with normal contrast checks.

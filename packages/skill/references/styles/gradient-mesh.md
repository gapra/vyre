---
id: gradient-mesh
category: expressive
description: "Multi-stop mesh gradients for atmospheric backgrounds."
when_to_use: ["Hero sections","AI products","Modern landing"]
contraindications: ["Body content backgrounds"]
contraindicated_with: ["flat"]
required_tokens: ["shadow.xl"]
cost: medium
accessibility: "Always overlay solid surface for content."
---

# Gradient Mesh

Multi-stop mesh gradients for atmospheric backgrounds.

## When to use

- Hero sections
- AI products
- Modern landing

## When NOT to use

- Body content backgrounds

## Do

- ✅ Use as page bg with content cards on top
- ✅ Animate slowly

## Don't

- ❌ Place text directly on it
- ❌ Use multiple meshes

## Recipe (CSS)

```css
background:
  radial-gradient(at 20% 30%, oklch(70% 0.20 264) 0%, transparent 50%),
  radial-gradient(at 80% 60%, oklch(70% 0.20 175) 0%, transparent 50%),
  oklch(98% 0.005 240);
```

## Required tokens

- `shadow.xl`

## Performance cost

`medium` — reasonable for most contexts

## Accessibility

Always overlay solid surface for content.

---
id: editorial
category: editorial
description: "Magazine-style with strong typography, asymmetric grid, generous margins."
when_to_use: ["Long-form content","Newsletters","Blogs","Storytelling"]
contraindications: ["Dense data UI","Forms"]
contraindicated_with: ["brutalism"]
required_tokens: ["font.family.serif","font.family.sans","font.size.4xl"]
cost: low
accessibility: "Excellent for readability."
---

# Editorial

Magazine-style with strong typography, asymmetric grid, generous margins.

## When to use

- Long-form content
- Newsletters
- Blogs
- Storytelling

## When NOT to use

- Dense data UI
- Forms

## Do

- ✅ Mix serif body + sans display
- ✅ Use drop caps
- ✅ Honor 65ch line length
- ✅ Vertical rhythm

## Don't

- ❌ Stuff with UI elements
- ❌ Use justified text
- ❌ Cram side panels

## Recipe (CSS)

```css
font-family: var(--vyre-font-family-serif);
max-width: 65ch;
line-height: var(--vyre-font-line-height-relaxed);
font-size: var(--vyre-font-size-lg);
```

## Required tokens

- `font.family.serif`
- `font.family.sans`
- `font.size.4xl`

## Performance cost

`low` — no significant cost

## Accessibility

Excellent for readability.

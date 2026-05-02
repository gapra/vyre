---
id: split-screen
category: specialized
description: "Two-pane layout — visual on one side, content on other."
when_to_use: ["Hero sections","Feature pages","Auth pages"]
contraindications: ["Mobile-only"]
contraindicated_with: []
required_tokens: ["space.0"]
cost: low
accessibility: "Good."
---

# Split Screen

Two-pane layout — visual on one side, content on other.

## When to use

- Hero sections
- Feature pages
- Auth pages

## When NOT to use

- Mobile-only

## Do

- ✅ Use 50/50 or 60/40 split
- ✅ Stack on mobile
- ✅ Visual + content balance

## Don't

- ❌ Use for body content
- ❌ Make panes scroll independently

## Recipe (CSS)

```css
display: grid;
grid-template-columns: 1fr 1fr;
min-height: 100vh;
```

## Required tokens

- `space.0`

## Performance cost

`low` — no significant cost

## Accessibility

Good.

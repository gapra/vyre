---
id: orbit
category: expressive
description: "Concentric circular layouts with central focus."
when_to_use: ["Dashboards with central metric","Concept landings"]
contraindications: ["Dense data tables"]
contraindicated_with: []
required_tokens: ["radius.full"]
cost: medium
accessibility: "Provide linear fallback for screen readers."
---

# Orbit

Concentric circular layouts with central focus.

## When to use

- Dashboards with central metric
- Concept landings

## When NOT to use

- Dense data tables

## Do

- ✅ Use sparingly
- ✅ Maintain linear DOM order

## Don't

- ❌ Force circular nav for sequential tasks

## Recipe (CSS)

```css
position: relative;
& .center { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); }
& .orbit { border-radius: var(--vyre-radius-full); border: 1px dashed var(--vyre-border-subtle); }
```

## Required tokens

- `radius.full`

## Performance cost

`medium` — reasonable for most contexts

## Accessibility

Provide linear fallback for screen readers.

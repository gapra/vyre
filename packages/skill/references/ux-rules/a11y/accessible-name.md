---
id: accessible-name
category: a11y
title: Accessible Names for Controls
severity: high
refs: ["wcag:4.1.2","wcag:2.5.3"]
---

# Accessible Names for Controls

> Every interactive element has an accessible name (visible label, aria-label, or aria-labelledby).

**Severity:** `high`

## Rule

Icon-only buttons MUST have aria-label. Match accessible name to visible text where both exist.

## Do

- <button aria-label='Close'>×</button>
- Match aria-label to visible text

## Don't

- Icon-only buttons with no aria-label
- aria-label that contradicts visible text

## References

- `wcag:4.1.2`
- `wcag:2.5.3`


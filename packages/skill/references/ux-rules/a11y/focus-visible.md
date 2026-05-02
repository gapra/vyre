---
id: focus-visible
category: a11y
title: Visible Focus Indicators
severity: high
refs: ["wcag:2.4.7","wcag:2.4.11","vyre:focus.ring"]
---

# Visible Focus Indicators

> Keyboard users must see where focus is at all times.

**Severity:** `high`

## Rule

Use :focus-visible with ≥3:1 contrast against adjacent colors and ≥2px ring. Never `outline: none` without a replacement.

## Do

- 2-3px ring with offset using --vyre-color-focus-ring
- High contrast against ALL backgrounds it appears on

## Don't

- `outline: none` without replacement
- Subtle 1px focus that disappears on busy backgrounds

## References

- `wcag:2.4.7`
- `wcag:2.4.11`
- `vyre:focus.ring`


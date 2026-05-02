---
id: color-contrast-text
category: a11y
title: Text Color Contrast
severity: high
refs: ["wcag:1.4.3","wcag:1.4.11","vyre:alias.content"]
---

# Text Color Contrast

> Body text ≥4.5:1, large text ≥3:1, UI components ≥3:1 against background.

**Severity:** `high`

## Rule

WCAG 2.1 AA minimum. Use vyre alias tokens which are pre-validated. Check contrast in light AND dark mode.

## Do

- Use vyre content-primary on surface tokens — pre-checked
- Test gray-on-gray combos with a contrast checker

## Don't

- Use color-9 text on color-1 background (often fails)
- Lower contrast for 'softer aesthetic'

## References

- `wcag:1.4.3`
- `wcag:1.4.11`
- `vyre:alias.content`


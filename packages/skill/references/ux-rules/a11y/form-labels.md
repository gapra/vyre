---
id: form-labels
category: a11y
title: Form Labels
severity: high
refs: ["wcag:3.3.2","wcag:1.3.1"]
---

# Form Labels

> Every form field has a programmatically associated, persistent visible label.

**Severity:** `high`

## Rule

Use <label for=...> or wrap input in label. Placeholder is NOT a label. Required fields marked with text + symbol.

## Do

- Visible label above input
- Mark required with 'Required' text + asterisk
- Inline error messages with aria-describedby

## Don't

- Placeholder-only forms
- Mark required only with red color
- Floating labels that vanish on focus

## References

- `wcag:3.3.2`
- `wcag:1.3.1`


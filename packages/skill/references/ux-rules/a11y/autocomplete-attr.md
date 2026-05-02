---
id: autocomplete-attr
category: a11y
title: Autocomplete on Form Fields
severity: medium
refs: ["wcag:1.3.5"]
---

# Autocomplete on Form Fields

> Use autocomplete tokens to help password managers and assistive tech.

**Severity:** `medium`

## Rule

Standard autocomplete tokens (email, name, current-password, new-password, etc.) reduce errors and friction.

## Do

- autocomplete='email' on email input
- autocomplete='new-password' for signup

## Don't

- autocomplete='off' as default (breaks password managers)

## References

- `wcag:1.3.5`


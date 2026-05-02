---
id: form-validation-timing
category: forms
title: Validation Timing
severity: high
refs: ["form-validation-ux"]
---

# Validation Timing

> Validate on blur (after user finishes), not on every keystroke. Re-validate on input after first error.

**Severity:** `high`

## Rule

Pre-mature validation while typing is hostile. Post-blur is forgiving.

## Do

- Validate after blur
- After error, re-validate on input to clear it instantly

## Don't

- Show errors on first keystroke
- Wait until submit to show all errors at once

## References

- `form-validation-ux`


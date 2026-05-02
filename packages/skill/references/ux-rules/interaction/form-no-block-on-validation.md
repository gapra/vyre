---
id: form-no-block-on-validation
category: interaction
title: Don't Block on Validation
severity: high
refs: ["form-validation-patterns"]
---

# Don't Block on Validation

> Validate inline as user types or on blur. Don't block submit until errors are visible.

**Severity:** `high`

## Rule

Show errors as user moves to next field. Disabled-submit-with-no-explanation is hostile.

## Do

- Inline validation on blur
- Show what's wrong, not just that something's wrong

## Don't

- Submit button greyed with no hint why
- Validate only on submit for long forms

## References

- `form-validation-patterns`


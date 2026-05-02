---
id: form-input-types
category: forms
title: Use Correct Input Types
severity: high
refs: ["input-types"]
---

# Use Correct Input Types

> type='email' / 'tel' / 'number' / 'date' triggers correct keyboards and validation.

**Severity:** `high`

## Rule

Mobile keyboards adapt to input type. Use the right one to reduce errors.

## Do

- type='email' for email
- type='tel' for phone
- inputmode='numeric' for OTP

## Don't

- type='text' for everything
- Custom date pickers when type='date' would do

## References

- `input-types`


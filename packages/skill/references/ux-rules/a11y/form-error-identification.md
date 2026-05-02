---
id: form-error-identification
category: a11y
title: Identify Form Errors Accessibly
severity: high
refs: ["wcag:3.3.1","wcag:3.3.3"]
---

# Identify Form Errors Accessibly

> Errors associated with the relevant field via aria-describedby; error summary at top of form.

**Severity:** `high`

## Rule

Don't rely on color alone. Use icon + text + programmatic association. Move focus to first error on submit.

## Do

- aria-invalid='true' on bad fields
- aria-describedby pointing to error message
- Focus first error after submit

## Don't

- Red border only
- Generic 'Form has errors' with no field linkage

## References

- `wcag:3.3.1`
- `wcag:3.3.3`


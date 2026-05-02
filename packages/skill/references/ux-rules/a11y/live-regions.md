---
id: live-regions
category: a11y
title: Live Regions for Dynamic Content
severity: medium
refs: ["wcag:4.1.3"]
---

# Live Regions for Dynamic Content

> Announce dynamic updates (toasts, errors, search results) to screen readers.

**Severity:** `medium`

## Rule

Use aria-live='polite' for non-urgent, aria-live='assertive' for urgent. role='status' for status messages, role='alert' for errors.

## Do

- Toast container with aria-live='polite'
- Form error summary with role='alert'

## Don't

- Silently update DOM with new errors
- Use aria-live='assertive' for non-urgent toasts

## References

- `wcag:4.1.3`


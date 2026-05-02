---
id: focus-order
category: a11y
title: Logical Focus Order
severity: high
refs: ["wcag:2.4.3"]
---

# Logical Focus Order

> Tab order follows visual reading order; no traps or skips.

**Severity:** `high`

## Rule

DOM order = visual order. Don't use positive tabindex. Modals trap focus when open. Skip-to-main link for repetitive nav.

## Do

- DOM matches visual layout
- Focus trap in modals (return focus on close)
- Skip-to-main link as first focusable

## Don't

- Use tabindex=5 to reorder focus
- Let focus escape an open modal
- Hide focusable elements with display:none after focus enters

## References

- `wcag:2.4.3`


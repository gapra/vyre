---
id: zoom-reflow
category: a11y
title: Zoom and Reflow
severity: high
refs: ["wcag:1.4.4","wcag:1.4.10"]
---

# Zoom and Reflow

> Page must work at 200% zoom and reflow at 320 CSS px width.

**Severity:** `high`

## Rule

No horizontal scrolling at narrow widths (except for data tables). Text resizable to 200% without breaking.

## Do

- Use rem/em for type sizes
- Test at 200% browser zoom
- Test at 320px viewport width

## Don't

- Fix layout to pixel widths
- Hide content at small widths if essential

## References

- `wcag:1.4.4`
- `wcag:1.4.10`


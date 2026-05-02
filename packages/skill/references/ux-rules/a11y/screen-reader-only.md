---
id: screen-reader-only
category: a11y
title: Screen-Reader-Only Text
severity: low
refs: ["a11y-project:sr-only"]
---

# Screen-Reader-Only Text

> Use sr-only utility for context that's visual-only obvious.

**Severity:** `low`

## Rule

Don't use display:none (hidden from AT) or visibility:hidden. Use sr-only pattern with absolute positioning.

## Do

- sr-only utility with clip-path or overflow:hidden + 1px size
- Add context like 'Sort by name, ascending'

## Don't

- display:none for sr-only text
- Excessive sr-only narration

## References

- `a11y-project:sr-only`


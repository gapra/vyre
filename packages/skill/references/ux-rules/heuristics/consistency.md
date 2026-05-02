---
id: consistency
category: heuristics
title: Consistency and Standards
severity: high
refs: ["nielsen:heuristic-4","vyre:tokens"]
---

# Consistency and Standards

> Follow platform conventions. Same things should look and behave the same way.

**Severity:** `high`

## Rule

Use design tokens for everything. Same component for same purpose. Same word for same concept.

## Do

- Use vyre tokens, never hard-coded values
- One delete pattern across the app
- Match OS conventions for scrollbars, modals

## Don't

- Three different date pickers
- Custom controls that fight platform behavior

## References

- `nielsen:heuristic-4`
- `vyre:tokens`


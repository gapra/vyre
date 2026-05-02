---
id: error-prevention
category: heuristics
title: Error Prevention
severity: high
refs: ["nielsen:heuristic-5"]
---

# Error Prevention

> Prevent errors before they happen via good design and constraints.

**Severity:** `high`

## Rule

Disable invalid options. Confirm destructive actions. Use input masks and validation. Default to safe states.

## Do

- Disable submit until form is valid
- Confirm 'Delete account' with typed confirmation
- Use date pickers, not free-text dates

## Don't

- Allow users to type past max-length silently
- Default destructive options as selected

## References

- `nielsen:heuristic-5`


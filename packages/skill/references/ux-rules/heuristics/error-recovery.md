---
id: error-recovery
category: heuristics
title: Help Users Recover From Errors
severity: high
refs: ["nielsen:heuristic-9"]
---

# Help Users Recover From Errors

> Error messages: plain language, problem stated, solution suggested.

**Severity:** `high`

## Rule

No error codes alone. Always say what happened, why, and how to fix it. Position errors near the source.

## Do

- 'Email already in use. Try logging in instead.'
- Inline field errors next to the field
- Suggest specific next actions

## Don't

- 'Error 0x7B3' with no explanation
- Generic 'Something went wrong' as the only message

## References

- `nielsen:heuristic-9`


---
id: match-real-world
category: heuristics
title: Match Between System and Real World
severity: high
refs: ["nielsen:heuristic-2"]
---

# Match Between System and Real World

> Use language and concepts familiar to your users, not internal jargon.

**Severity:** `high`

## Rule

Write labels in user vocabulary. Avoid implementation terms. Use real-world metaphors that match the user's mental model.

## Do

- 'Send' instead of 'Submit POST'
- 'Saved' instead of 'Persisted'
- 'Items' instead of 'Records'

## Don't

- Expose database column names in UI
- Use internal status codes as user-facing labels

## References

- `nielsen:heuristic-2`


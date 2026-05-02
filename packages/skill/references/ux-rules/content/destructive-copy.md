---
id: destructive-copy
category: content
title: Destructive Action Copy
severity: high
refs: ["destructive-microcopy"]
---

# Destructive Action Copy

> Be explicit. Spell out what will happen and what is irreversible.

**Severity:** `high`

## Rule

'Delete X' not 'Remove'. Spell out consequences: 'This cannot be undone. All data will be lost.'

## Do

- 'Delete account permanently. This cannot be undone.'
- Specific scope: 'Delete 47 items'

## Don't

- 'Continue?' as destructive prompt
- Vague 'Are you sure?'

## References

- `destructive-microcopy`


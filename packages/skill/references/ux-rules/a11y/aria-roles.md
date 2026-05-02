---
id: aria-roles
category: a11y
title: Correct ARIA Roles
severity: medium
refs: ["aria-practices"]
---

# Correct ARIA Roles

> ARIA roles must match the element's actual behavior.

**Severity:** `medium`

## Rule

If you use role='button', it MUST be keyboard-operable like a button. Don't add roles you can't fulfill. No ARIA is better than wrong ARIA.

## Do

- role='dialog' on modal containers with focus trap
- aria-current='page' on active nav link

## Don't

- role='button' on a div with no key handlers
- Redundant role='button' on a <button>

## References

- `aria-practices`


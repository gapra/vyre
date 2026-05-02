---
id: respect-reduced-motion
category: motion
title: Respect prefers-reduced-motion
severity: high
refs: ["wcag:2.3.3","vyre:motion.reduced"]
---

# Respect prefers-reduced-motion

> Disable non-essential motion when user prefers reduced motion.

**Severity:** `high`

## Rule

Replace large motion with fade or instant. Keep only motion that conveys essential state change.

## Do

- Override animation/transition durations to 0.01ms in reduced-motion media query
- Fade instead of slide

## Don't

- Ignore the user's stated preference

## References

- `wcag:2.3.3`
- `vyre:motion.reduced`


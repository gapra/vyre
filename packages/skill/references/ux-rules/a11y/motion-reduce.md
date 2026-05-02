---
id: motion-reduce
category: a11y
title: Honor prefers-reduced-motion
severity: high
refs: ["wcag:2.3.3","vyre:motion.reduced"]
---

# Honor prefers-reduced-motion

> Disable or reduce non-essential motion when user prefers reduced motion.

**Severity:** `high`

## Rule

Wrap large/parallax/auto-play motion in @media (prefers-reduced-motion: reduce) and replace with instant or fade.

## Do

- Override animation/transition durations to 0.01ms in reduced-motion media query
- Replace parallax with static

## Don't

- Auto-play looping background video by default
- Force users to watch decorative animations

## References

- `wcag:2.3.3`
- `vyre:motion.reduced`


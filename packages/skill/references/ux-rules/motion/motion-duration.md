---
id: motion-duration
category: motion
title: Motion Duration
severity: high
refs: ["vyre:motion.duration"]
---

# Motion Duration

> Micro: 100-200ms. Standard: 200-400ms. Large/complex: 400-600ms. >600ms feels slow.

**Severity:** `high`

## Rule

Use vyre motion duration tokens. Match duration to distance and importance.

## Do

- 150ms for hover/tap feedback
- 300ms for panel slide-in
- 400-500ms for full-screen transitions

## Don't

- 1s+ for routine transitions
- Same duration for every animation

## References

- `vyre:motion.duration`


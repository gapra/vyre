---
id: motion-easing
category: motion
title: Motion Easing
severity: medium
refs: ["vyre:motion.easing"]
---

# Motion Easing

> Use ease-out for entrances, ease-in for exits, ease-in-out for moves. Avoid linear except for loops.

**Severity:** `medium`

## Rule

Real-world objects accelerate and decelerate. Use vyre motion easing tokens.

## Do

- ease-out for things appearing
- ease-in for things leaving
- spring physics for playful UIs

## Don't

- Linear easing for UI transitions (feels mechanical)
- Bouncy curves on serious enterprise UIs

## References

- `vyre:motion.easing`


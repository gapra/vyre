---
id: transform-opacity-only
category: motion
title: Animate Transform and Opacity Only
severity: high
refs: ["web-perf:animations"]
---

# Animate Transform and Opacity Only

> Animating layout properties (width, height, top, left) causes jank. Use transform and opacity.

**Severity:** `high`

## Rule

Compositor-only properties hit 60fps. Layout-triggering properties drop frames.

## Do

- transform: translateY() instead of top:
- transform: scale() instead of width/height
- opacity for fade

## Don't

- Animate width/height for grow effects
- Animate margin to slide

## References

- `web-perf:animations`


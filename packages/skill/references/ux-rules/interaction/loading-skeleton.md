---
id: loading-skeleton
category: interaction
title: Loading States: Match Final Layout
severity: medium
refs: ["cls-prevention"]
---

# Loading States: Match Final Layout

> Skeletons should approximate the final layout to prevent CLS.

**Severity:** `medium`

## Rule

Skeleton dimensions match real content. Spinner only when layout is unknown.

## Do

- Skeleton card with same dims as real card
- Shimmer animation for skeletons

## Don't

- Centered spinner that causes layout shift on load
- Skeletons of wildly different size than content

## References

- `cls-prevention`


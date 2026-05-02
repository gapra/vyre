---
id: feedback-latency
category: interaction
title: Feedback Latency Tiers
severity: high
refs: ["nielsen:response-times"]
---

# Feedback Latency Tiers

> <100ms feels instant. 100-300ms feels snappy. 300ms-1s needs feedback. >1s needs progress.

**Severity:** `high`

## Rule

Match feedback to perceived performance. Optimistic UI for fast paths. Skeletons for >1s loads.

## Do

- Optimistic UI updates that revert on failure
- Skeleton screens for content >1s
- Progress bars for known-duration tasks

## Don't

- Indeterminate spinner for 30s tasks
- No feedback for clicks that take >300ms

## References

- `nielsen:response-times`


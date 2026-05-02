---
id: system-status
category: heuristics
title: Visibility of System Status
severity: high
refs: ["nielsen:heuristic-1","vyre:motion.duration"]
---

# Visibility of System Status

> Always keep users informed about what's happening through appropriate feedback.

**Severity:** `high`

## Rule

Every action triggers feedback within 100ms. Long operations show progress. Background changes are surfaced.

## Do

- Show loading spinners after 300ms
- Use skeleton screens for content >1s
- Display optimistic UI for instant actions

## Don't

- Leave users wondering if their click registered
- Show indeterminate spinners for >10s tasks

## References

- `nielsen:heuristic-1`
- `vyre:motion.duration`


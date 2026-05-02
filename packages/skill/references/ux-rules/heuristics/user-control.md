---
id: user-control
category: heuristics
title: User Control and Freedom
severity: high
refs: ["nielsen:heuristic-3"]
---

# User Control and Freedom

> Provide clearly marked emergency exits — undo, cancel, back.

**Severity:** `high`

## Rule

Destructive actions require confirmation OR provide undo. Multi-step flows allow back navigation. Modals always have a close affordance.

## Do

- Offer 'Undo' for delete via toast for 5-10s
- Always include cancel buttons in modals
- Preserve form data on accidental navigation

## Don't

- Trap users in flows with no exit
- Make destructive actions one-click and irreversible
- Auto-submit on tab change

## References

- `nielsen:heuristic-3`


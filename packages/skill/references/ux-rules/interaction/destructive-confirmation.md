---
id: destructive-confirmation
category: interaction
title: Confirm Destructive Actions
severity: high
refs: ["destructive-action-patterns"]
---

# Confirm Destructive Actions

> Irreversible destructive actions require confirmation OR robust undo.

**Severity:** `high`

## Rule

Tier by severity: trash/archive = undo via toast; soft delete = simple confirm; permanent delete = type-to-confirm.

## Do

- Toast undo for soft deletes
- Type the project name to confirm permanent delete

## Don't

- One-click permanent delete
- Confirmation dialogs for every minor action (alert fatigue)

## References

- `destructive-action-patterns`


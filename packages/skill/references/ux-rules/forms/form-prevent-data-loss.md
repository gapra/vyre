---
id: form-prevent-data-loss
category: forms
title: Prevent Form Data Loss
severity: high
refs: []
---

# Prevent Form Data Loss

> Save drafts. Warn before navigation. Restore on accidental refresh.

**Severity:** `high`

## Rule

Long forms auto-save to localStorage. Warn on navigation away with unsaved changes. Restore on reload.

## Do

- Auto-save draft every 10s
- beforeunload warning when dirty
- Restore from localStorage on reload

## Don't

- Lose 30 minutes of typing on tab refresh
- No warning before destructive nav



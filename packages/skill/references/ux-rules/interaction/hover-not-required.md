---
id: hover-not-required
category: interaction
title: Hover Is Not a Requirement
severity: high
refs: ["touch-vs-pointer"]
---

# Hover Is Not a Requirement

> Hover-only interactions break on touch devices.

**Severity:** `high`

## Rule

Every hover interaction has a touch/keyboard equivalent. Don't gate primary content behind hover.

## Do

- Show critical info without hover
- Tap-to-reveal on touch devices

## Don't

- Hover-only menus on mobile
- Hover-required tooltips for required info

## References

- `touch-vs-pointer`


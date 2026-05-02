---
id: no-modal-modal
category: interaction
title: No Modals Inside Modals
severity: medium
refs: []
---

# No Modals Inside Modals

> Stacked modals are a UX smell. Use full-screen takeover or in-place editing instead.

**Severity:** `medium`

## Rule

If you need a second modal, your flow has too many steps in the wrong place.

## Do

- Full-screen takeover for complex sub-flows
- Inline editing for in-context changes

## Don't

- Modal opens modal opens dialog



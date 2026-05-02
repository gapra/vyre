---
id: common-region
category: gestalt
title: Common Region
severity: medium
refs: ["vyre:alias.surface"]
---

# Common Region

> Items in the same bounded region (card, panel) are perceived as a unit.

**Severity:** `medium`

## Rule

Use surface tokens to bound related content. Avoid nested cards and 'card inception' — three levels of containment is the practical limit.

## Do

- Wrap a feature group in surface-2 with a single border
- Use surface elevation steps to convey depth

## Don't

- Nest 4+ levels of cards
- Put a card inside a card inside a card without functional reason

## References

- `vyre:alias.surface`


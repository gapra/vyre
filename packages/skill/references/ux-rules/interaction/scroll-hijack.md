---
id: scroll-hijack
category: interaction
title: Don't Hijack Scroll
severity: high
refs: ["scroll-anti-patterns"]
---

# Don't Hijack Scroll

> Respect native scroll behavior; don't override speed, direction, or chaining.

**Severity:** `high`

## Rule

No 'scroll-jacking' that takes 5 wheel turns to advance one section. Don't trap scroll inside containers without explicit user intent.

## Do

- Use scroll-snap for paged content
- Allow normal scroll-through inside lightboxes

## Don't

- Custom scroll easing that fights the OS
- Lock scroll on home page hero

## References

- `scroll-anti-patterns`


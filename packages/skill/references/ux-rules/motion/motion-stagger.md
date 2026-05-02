---
id: motion-stagger
category: motion
title: Staggered Animations
severity: low
refs: []
---

# Staggered Animations

> Stagger 30-50ms between items to imply sequence. >100ms feels slow.

**Severity:** `low`

## Rule

Stagger only when a sequence makes sense (list entry, sequential reveal). Cap total stagger at ~500ms.

## Do

- List items: 40ms stagger, max 12 items animated
- Cap total animation time at 500ms even if list is longer

## Don't

- 100ms+ stagger across 50 items (8s total)
- Stagger every group on every page



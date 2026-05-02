---
id: infinite-scroll-care
category: interaction
title: Infinite Scroll: Use With Care
severity: medium
refs: ["nngroup:infinite-scroll"]
---

# Infinite Scroll: Use With Care

> Infinite scroll breaks back/forward and footer access. Prefer paginated load-more.

**Severity:** `medium`

## Rule

If using infinite scroll, preserve scroll position on back nav, surface page numbers, never bury a footer.

## Do

- Hybrid: 'Load more' button + auto-load
- Sticky footer access
- Restore scroll on back

## Don't

- Pure infinite scroll with footer
- Scroll position lost on detail-back nav

## References

- `nngroup:infinite-scroll`


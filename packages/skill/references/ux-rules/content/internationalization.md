---
id: internationalization
category: content
title: Internationalization Ready
severity: medium
refs: ["i18n-patterns"]
---

# Internationalization Ready

> Don't bake assumptions about text length, direction, or pluralization.

**Severity:** `medium`

## Rule

Allow 30-50% text expansion. Support RTL where users need it. Use ICU MessageFormat for pluralization.

## Do

- Flex layouts that handle long German strings
- Logical CSS properties (margin-inline-start)
- ICU plural messages with locale-aware count handling

## Don't

- Fixed-width buttons that clip Spanish/German
- left/right CSS in RTL-supporting apps

## References

- `i18n-patterns`


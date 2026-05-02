---
id: numbers-formatting
category: content
title: Number and Date Formatting
severity: high
refs: ["intl:formatting"]
---

# Number and Date Formatting

> Use locale-aware formatting. Right-align numbers in tables.

**Severity:** `high`

## Rule

Use Intl APIs. Show currency symbols correctly. Format dates per user locale unambiguously.

## Do

- Intl.NumberFormat for currency
- ISO dates in APIs, localized in UI
- Right-align numbers in table columns

## Don't

- '$1,234.56' for all locales
- Ambiguous '01/02/2024' (US vs EU)

## References

- `intl:formatting`


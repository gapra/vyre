---
id: animated-rich
category: expressive
description: "Heavy use of motion, scroll-triggered animations, hover interactions."
when_to_use: ["Marketing pages","Showcases"]
contraindications: ["Productivity apps","Reduced-motion users"]
contraindicated_with: ["kiosk"]
required_tokens: ["motion.duration.smooth","motion.easing.standard"]
cost: high
accessibility: "CRITICAL: respect prefers-reduced-motion."
---

# Animated Rich

Heavy use of motion, scroll-triggered animations, hover interactions.

## When to use

- Marketing pages
- Showcases

## When NOT to use

- Productivity apps
- Reduced-motion users

## Do

- ✅ Always wrap in prefers-reduced-motion
- ✅ Subtle by default
- ✅ Animate transforms not layout

## Don't

- ❌ Auto-playing carousels
- ❌ Parallax everywhere
- ❌ Block content for animation

## Recipe (CSS)

```css
@media (prefers-reduced-motion: no-preference) {
  transition: all var(--vyre-motion-duration-smooth) var(--vyre-motion-easing-standard);
}
```

## Required tokens

- `motion.duration.smooth`
- `motion.easing.standard`

## Performance cost

`high` — use sparingly, profile on low-end devices

## Accessibility

CRITICAL: respect prefers-reduced-motion.

# Animation Specification

## Page Transitions

### Fade Transition
- **Duration:** 200ms
- **Easing:** ease-in-out
- **Properties:** opacity (0 -> 1)
- **Use:** Route changes between pages

### Slide Transition
- **Duration:** 300ms
- **Easing:** ease-in-out
- **Properties:** translateX (20px -> 0)
- **Use:** Sidebar panels, drawer open/close

---

## Panel Animations

### Panel Slide In
- **Duration:** 300ms
- **Easing:** ease-out
- **Properties:** translateX (100% -> 0), opacity (0 -> 1)
- **Use:** Detail panels, drawer panels

### Modal Open/Close
- **Duration:** 200ms
- **Easing:** ease-in-out
- **Properties:** scale (0.95 -> 1), opacity (0 -> 1)
- **Backdrop:** opacity (0 -> 0.5)

---

## Micro-Interactions

### Button Hover
- **Duration:** 150ms
- **Properties:** background-color
- **Easing:** ease

### Row Hover
- **Duration:** 100ms
- **Properties:** background-color
- **Easing:** ease

### Tab Switch
- **Duration:** 200ms
- **Properties:** underline position (transform: translateX)
- **Easing:** ease-in-out

### Checkbox Toggle
- **Duration:** 150ms
- **Properties:** scale (bounce effect)
- **Easing:** cubic-bezier(0.68, -0.55, 0.27, 1.55)

### Focus Ring
- **Duration:** 150ms
- **Properties:** box-shadow, outline
- **Easing:** ease

---

## Loading States

### Skeleton Shimmer
- **Duration:** 1.5s infinite loop
- **Properties:** background-position
- **Gradient:** linear-gradient from surface to surfaceHover
- **Use:** Content loading placeholders

### Spinner Rotation
- **Duration:** 1s infinite linear
- **Properties:** rotate (0 -> 360deg)
- **Use:** Inline loading indicators

### Progress Bar
- **Duration:** 300ms per segment
- **Easing:** ease-out
- **Properties:** width (0% -> X%)
- **Use:** Generation progress

### Dots Loading
- **Duration:** 1.4s infinite
- **Keyframes:** 0%, 80%, 100% (opacity: 0.3), 40% (opacity: 1)
- **Use:** Text loading indicators

---

## Success States

### Checkmark Draw
- **Duration:** 400ms
- **Properties:** stroke-dashoffset (SVG path animation)
- **Easing:** ease-in-out
- **Use:** Completed task indicators

### Confetti Burst
- **Duration:** 1s
- **Properties:** translateY, opacity, rotate (random per particle)
- **Use:** Batch generation complete

### Success Fade In
- **Duration:** 300ms
- **Properties:** opacity, translateY (-10px -> 0)
- **Easing:** ease-out
- **Use:** Toast notifications

---

## Error States

### Shake
- **Duration:** 400ms
- **Properties:** translateX (oscillating -5px, 5px, -3px, 3px, 0)
- **Use:** Invalid form fields, failed actions

### Error Slide In
- **Duration:** 200ms
- **Properties:** translateY (from top: -100% -> 0)
- **Easing:** ease-out
- **Use:** Error banners

---

## Reduced Motion Support

All animations respect the `prefers-reduced-motion` media query.

```css
@media (prefers-reduced-motion: reduce) {
    *,
    *::before,
    *::after {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
        scroll-behavior: auto !important;
    }
}
```

When reduced motion is preferred:
- Page transitions: instant (no animation)
- Micro-interactions: instant state change
- Loading states: static indicators (no shimmer/spinner)
- Success states: instant show (no confetti)
- Error states: instant show (no shake)

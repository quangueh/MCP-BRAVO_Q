# Responsive Rules

## Window Constraints

| Property | Value | Notes |
|---|---|---|
| Minimum window | 1280x720 | Hard minimum, app won't render below this |
| Default window | 1440x900 | Recommended starting size |
| Maximum window | Fullscreen | No upper limit |

---

## Breakpoints

| Breakpoint | Width | Behavior |
|---|---|---|
| Compact | 1280px | Sidebar collapsed (icons only), 1-2 column layouts |
| Standard | 1440px | Sidebar expanded, 2-3 column layouts |
| Wide | 1920px+ | Extra panels visible, 3-4 column layouts |

---

## Sidebar Behavior

| State | Width | Content |
|---|---|---|
| Collapsed | 60px | Icons only, tooltips on hover |
| Expanded | 240px | Icons + labels visible |
| Default at 1280px | Collapsed | Auto-collapse when window is narrow |
| Default at 1440px+ | Expanded | Auto-expand when space allows |

Sidebar transition: 200ms ease-in-out width animation.

Toggle button always visible at top of sidebar.

---

## Grid Layouts

Responsive column count based on container width:

| Container Width | Columns | Use Case |
|---|---|---|
| < 400px | 1 | Mobile-like narrow panels |
| 400-600px | 2 | Standard card grids |
| 600-900px | 3 | Wide card grids |
| > 900px | 4 | Dashboard stat cards |

CSS Grid with `auto-fill` and `minmax()`:

```css
.grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 16px;
}
```

---

## Table Behavior

- Tables scroll horizontally when content exceeds container width
- Sticky first column (row identifier) on horizontal scroll
- Column widths: use `min-width` to prevent squishing
- On narrow screens: hide non-essential columns (show on expand)

---

## Text Overflow

- Single-line text: truncate with ellipsis, show full text in tooltip on hover
- Multi-line text: truncate after N lines with "Show more" expand button
- Code blocks: horizontal scroll, no wrapping by default

```css
.truncate {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}
```

---

## Panel Layout

### Standard Layout (1440px+)

```
+---240px---+-------------------remaining-------------------+
|           |                                               |
|  Sidebar  |              Main Content                     |
|           |                                               |
|           |                                               |
+-----------+-----------------------------------------------+
```

### Compact Layout (1280px)

```
+--60px--+------------------remaining-----------------------+
|        |                                                  |
| Icons  |              Main Content                        |
|        |                                                  |
|        |                                                  |
+--------+--------------------------------------------------+
```

### Wide Layout (1920px+)

```
+---240px---+--------main--------+--------detail-----------+
|           |                   |                          |
|  Sidebar  |    Content List   |    Detail Panel          |
|           |                   |                          |
|           |                   |                          |
+-----------+-------------------+--------------------------+
```

---

## Responsive Component Behavior

### Buttons
- At 1280px: icon-only buttons in toolbars, labels in tooltips
- At 1440px+: icon + label buttons
- At 1920px+: icon + label + shortcut hint

### Modals
- Max width: 90vw, max height: 90vh
- At 1280px: 600px wide
- At 1440px+: 800px wide
- At 1920px+: 1000px wide

### Cards
- Min width: 280px
- Stack vertically on narrow screens
- Grid layout on wider screens

### Forms
- At 1280px: single column layout
- At 1440px+: two column layout
- At 1920px+: three column layout for long forms

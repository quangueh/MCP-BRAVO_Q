# Layout Selector Wireframe

## Layout

The layout selector allows users to browse, search, and select layouts for generation.

---

## ASCII Wireframe

```
+------+-----------------------------------------------------------+
|      |  Layouts                                      [View: =  ] |
|      |                                                           |
|      |  [Search layouts...                    ] [Type v] [Mod v] |
|      |                                      [Complexity v]       |
|      |                                                           |
|      |  +-------+--------+---------+----------+--------+--------+
|      |  | Select| Name   | Type    | Tables   | Cols   | Last   |
|      |  |-------|--------|---------|----------|--------|--------|
| HOME |  | [ ]   | Cust.  | Explorer| 3        | 12     | Jan 10 |
|      |  | [ ]   | Invoice| Editor  | 5        | 28     | Jan 8  |
| LAY- |  | [x]   | Budget | Report  | 2        | 15     | Jan 12 |
| OUTS |  | [x]   | Vendor | Explorer| 2        | 10     | Jan 5  |
|      |  | [ ]   | Product| Editor  | 4        | 20     | Jan 3  |
| GENE-|  | [ ]   | Employ | Explorer| 2        | 8      | Jan 1  |
| RATE |  | [ ]   | Wareh. | Explorer| 1        | 6      | Dec 28 |
|      |  +-------+--------+---------+----------+--------+--------+
| BATCH|                                                           |
|      |  Showing 1-7 of 156 layouts    [< 1 2 3 ... 23 >]       |
| HIS- |                                                           |
| TORY |  +--Sidebar Panel---------+                               |
|      |  | Selected: 2 layouts    |                               |
|      |  |                        |                               |
| SET- |  | Budget Report          |                               |
| TINGS|  | Vendor Explorer        |                               |
|      |  |                        |                               |
|      |  | [Generate Selected]    |                               |
|      |  +------------------------+                               |
+------+-----------------------------------------------------------+
```

---

## Component Breakdown

### Search Bar
- Instant search with 200ms debounce
- Searches layout name, table name, display name
- Clear button when text is entered

### Filter Dropdowns

| Filter | Options |
|---|---|
| Type | All, Explorer, Editor, Report |
| Module | All, Accounting, Budget, HR, Inventory, Sales |
| Complexity | All, Simple (1-3 cols), Medium (4-10 cols), Complex (11+ cols) |

Active filters shown as removable chips below the filter bar.

### Layout Grid/List

Toggle between grid view (cards) and list view (table).

**List view columns:**
- Checkbox (for multi-select)
- Name (layout display name, clickable)
- Type (badge: Explorer/Editor/Report)
- Tables (count of related tables)
- Columns (count of columns)
- Last Generated (date, relative time)

**Grid view cards:**
- Layout name
- Type badge
- Table/column counts
- Last generated date
- Select button

### Pagination
- Page size: 20 (configurable: 10/20/50)
- Shows: "Showing X-Y of Z layouts"
- Page navigation: First, Prev, Pages, Next, Last

### Sidebar Panel (Selected Layouts)
- Shows count of selected layouts
- List of selected layout names
- "Generate Selected" button (navigates to generation config)
- "Clear Selection" link

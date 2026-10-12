# History Wireframe

## Layout

The history screen shows past generations with search, filtering, and management actions.

---

## ASCII Wireframe

```
+------+-----------------------------------------------------------+
|      |  History                                                   |
|      |                                                           |
|      |  [Search...       ] [Jan 1 - Jan 15] [Status: All v]     |
|      |                                                           |
|      |  +------+----------+-----------+--------+---------+------+
|      |  | Date | Layout   | Action    | Status | Duration| Out  |
|      |  |------|----------|-----------|--------|---------|------|
|      |  | 01/15| Customer | Generate  | OK     | 1.2s    | 5    |
|      |  | 01/15| Invoice  | Generate  | OK     | 3.1s    | 6    |
|      |  | 01/15| Product  | Batch     | OK     | 5.4s    | 12   |
|      |  | 01/14| Employee | Generate  | FAIL   | 0.8s    | 0    |
|      |  | 01/14| Vendor   | Generate  | OK     | 2.0s    | 4    |
|      |  | 01/13| Budget   | Generate  | OK     | 4.2s    | 8    |
|      |  | 01/13| Wareh.   | Generate  | WARN   | 1.5s    | 3    |
|      |  +------+----------+-----------+--------+---------+------+
|      |                                                           |
|      |  Showing 1-7 of 42 entries       [< 1 2 3 ... 7 >]      |
|      |                                                           |
+------+-----------------------------------------------------------+
```

---

## Filters

### Search Bar
- Searches layout name and action description
- 200ms debounce

### Date Range Picker
- Start date and end date inputs
- Quick selects: Today, Last 7 days, Last 30 days, This month, All time

### Status Filter
- All, OK, FAIL, WARN

---

## Table Columns

| Column | Width | Description |
|---|---|---|
| Date | 120px | Generation date/time (dd/MM/yyyy HH:mm) |
| Layout | 180px | Layout name (link to detail) |
| Action | 120px | Generate / Batch Generate / Export |
| Status | 80px | Badge: OK (green), FAIL (red), WARN (yellow) |
| Duration | 80px | Time taken (Xs or Xms) |
| Outputs | 60px | Number of output files generated |

### Row Actions

Each row has action buttons (shown on hover or in overflow menu):

| Action | Description |
|---|---|
| View | Opens the generation output in preview |
| Diff | Compares output with current version |
| Rollback | Restores this version as the active one |

---

## History Detail (Drawer/Modal)

When clicking "View" on a history entry:

```
+---History Detail-------------------+
| Layout: Customer Explorer          |
| Date: 2024-01-15 14:30:22         |
| Action: Generate                   |
| Status: OK                         |
| Duration: 1.2s                     |
|                                    |
| Outputs:                           |
| - CREATE_TABLE_Customer.sql        |
| - FK_Customer.sql                  |
| - INDEX_Customer.sql               |
| - DataSource_Customer.xml          |
| - Layout_Customer.xml              |
|                                    |
| [View Output] [Diff] [Rollback]   |
+------------------------------------+
```

---

## Empty State

When no history entries match filters:

```
No history entries match your filters.
[Clear Filters]
```

When no history entries at all:

```
No generation history yet.
Generate your first layout to see history here.
[Go to Generate]
```

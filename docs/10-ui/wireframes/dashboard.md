# Dashboard Wireframe

## Layout

The dashboard is the landing page showing overview statistics, recent activity, and quick actions.

---

## ASCII Wireframe

```
+------------------------------------------------------------------+
| [Logo]  Bravo Layout Generator          [Theme] [Settings] [?]  |
+------+-----------------------------------------------------------+
|      |                                                           |
| HOME |  Dashboard                                                |
|      |                                                           |
| LAY- |  +-----------+ +-----------+ +-----------+ +-----------+  |
| OUTS |  | Total     | | Generated | | Success   | | Avg Time  |  |
|      |  | Layouts   | | Today     | | Rate      | |           |  |
| GENE-|  |   156     | |    12     | |   98%     | |  2.3s     |  |
| RATE |  +-----------+ +-----------+ +-----------+ +-----------+  |
|      |                                                           |
| BATCH|  Recent Activity                                         |
|      |  +-------------------------------------------------------+
| HIS- |  | Date       | Layout      | Action   | Status  | Time |
| TORY |  |------------|------------|----------|---------|------|
|      |  | 2024-01-15 | Customer   | Generate | OK      | 1.2s |
|      |  | 2024-01-15 | Invoice    | Generate | OK      | 3.1s |
| SET- |  | 2024-01-15 | Product    | Batch    | OK      | 5.4s |
| TINGS|  | 2024-01-14 | Employee   | Generate | FAIL    | 0.8s |
|      |  | 2024-01-14 | Vendor     | Generate | OK      | 2.0s |
|      |  +-------------------------------------------------------+
|      |                                                           |
|      |  Quick Actions                                           |
|      |  [Connect DB]  [Browse Layouts]  [Generate]  [Batch]     |
|      |                                                           |
+------+-----------------------------------------------------------+
```

---

## Component Breakdown

### Stats Row (4 cards)

Each stat card contains:
- Icon (top-left)
- Label (secondary text)
- Value (large bold number)
- Trend indicator (up/down arrow + percentage)

Cards:
1. **Total Layouts** - Count of all available layouts in database
2. **Generated Today** - Number of layouts generated today
3. **Success Rate** - Percentage of successful generations (last 30 days)
4. **Avg Time** - Average generation time (last 30 days)

### Recent Activity Table

Columns:
- Date (formatted: dd/MM/yyyy HH:mm)
- Layout Name (link to layout detail)
- Action (Generate / Batch Generate / Export)
- Status (badge: OK=green, FAIL=red, WARN=yellow)
- Duration (formatted: Xs or Xms)

Shows last 10 activities. "View All" link at bottom.

### Quick Actions

4 action buttons in a row:
1. **Connect DB** - Opens database connection dialog
2. **Browse Layouts** - Navigates to layout browser
3. **Generate** - Navigates to generation config
4. **Batch Generate** - Navigates to batch generation

Each button has an icon and label.

---

## Empty State

When no database is connected:
```
+------------------------------------------------------------------+
|                                                                  |
|                    No Database Connected                         |
|                                                                  |
|              Connect to a Bravo database to get started          |
|                                                                  |
|                      [Connect Database]                          |
|                                                                  |
+------------------------------------------------------------------+
```

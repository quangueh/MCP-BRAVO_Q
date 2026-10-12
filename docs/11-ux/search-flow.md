# Search and Filter Flow

## Overview

Instant search with filtering and sorting for the Layout Browser screen.

---

## Flow Diagram

```
+----------+     +----------+     +----------+     +----------+
|  Type    |---->|  Apply   |---->|  View    |---->|  Refine  |
|  Search  |     |  Filters |     |  Results |     |  / Reset |
+----------+     +----------+     +----------+     +----------+
```

---

## Search Behavior

### Instant Search
- **Debounce:** 200ms after last keystroke
- **Search scope:** Layout name, table name, display name, module
- **Matching:** Case-insensitive substring match
- **Highlighting:** Matched text highlighted in results
- **Result count:** "X layouts found" shown above results

### Search Input
- Placeholder: "Search layouts..."
- Clear button (X) when text is entered
- Keyboard shortcut: Ctrl+K to focus search bar
- Enter key: no action (instant search already applied)

---

## Filter Options

### Layout Type
| Option | Description |
|---|---|
| All | No type filter |
| Explorer | Explorer layouts only |
| Editor | Editor layouts only |
| Report | Report layouts only |

### Module
| Option | Description |
|---|---|
| All | No module filter |
| Accounting | Accounting module layouts |
| Budget | Budget module layouts |
| HR | Human resources layouts |
| Inventory | Inventory management layouts |
| Sales | Sales module layouts |

### Complexity
| Option | Description | Criteria |
|---|---|---|
| All | No complexity filter | - |
| Simple | Simple layouts | 1-3 columns |
| Medium | Medium complexity | 4-10 columns |
| Complex | Complex layouts | 11+ columns |

### Additional Filters
| Filter | Options |
|---|---|
| Has SP | Yes / No / All |
| Has Tree View | Yes / No / All |
| Has Detail | Yes / No / All |

---

## Sort Options

| Sort By | Direction | Description |
|---|---|---|
| Name | A-Z / Z-A | Alphabetical by layout name |
| Type | - | Group by layout type |
| Columns | Asc / Desc | Number of columns |
| Last Generated | Newest / Oldest | Most/least recently generated |

Default: Name A-Z

---

## Active Filters Display

When filters are active, they appear as removable chips:

```
[Type: Explorer x] [Module: Budget x] [Complexity: Complex x]  [Clear All]
```

- Click X on chip to remove that filter
- "Clear All" removes all filters and search text

---

## Results

### Match Highlighting
- Matched search terms highlighted with primary color background
- Highlight appears in: layout name, table name, module name

### Result Count
- "Showing X of Y layouts" above the results grid/table
- Updates instantly as filters change

### Empty State
When no results match:

```
+------------------------------------------+
|         No layouts match your filters     |
|                                          |
|  Try adjusting your search or filters    |
|                                          |
|         [Clear All Filters]              |
+------------------------------------------+
```

When database has no layouts:

```
+------------------------------------------+
|          No layouts found                |
|                                          |
|  Connect to a Bravo database to browse   |
|  available layouts                       |
|                                          |
|         [Connect Database]               |
+------------------------------------------+
```

---

## Keyboard Shortcuts

| Key | Action |
|---|---|
| Ctrl+K | Focus search bar |
| Escape | Clear search / Close filter dropdown |
| Enter | Confirm filter selection |
| Tab | Navigate between filters |
| Arrow keys | Navigate filter options |

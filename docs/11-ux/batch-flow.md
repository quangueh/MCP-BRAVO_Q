# Batch Generation Flow

## Overview

Generate outputs for multiple layouts simultaneously. Useful for initial project setup or bulk updates.

---

## Flow Diagram

```
+----------+     +----------+     +----------+     +----------+     +----------+
| Multi-   |---->|  Select  |---->|  Batch   |---->| Progress |---->| Results  |
| Select   |     | Outputs  |     | Generate |     | (X of Y) |     | Summary  |
+----------+     +----------+     +----------+     +----------+     +----------+
                                                                      |
                                                                      v
                                                                 +----------+
                                                                 | Export   |
                                                                 | as ZIP   |
                                                                 +----------+
```

---

## Step 1: Multi-Select Layouts

**Action:** User selects multiple layouts in the Layout Browser.

**UI:**
- Checkboxes on each layout row
- Header checkbox for select all/deselect all
- Selection count shown: "X layouts selected"
- Selected layouts listed in sidebar panel

**Constraints:**
- Minimum: 1 layout
- Maximum: 50 layouts (performance limit)
- Warning at 20+: "Large batch may take several minutes"

---

## Step 2: Select Common Output Types

**Action:** User selects output types that apply to all selected layouts.

**UI:**
- Same output type checkboxes as single generation
- "Apply to all selected layouts" label
- Option: "Use each layout's defaults" checkbox (default: on)

**Behavior:**
- If "Use defaults" is on: each layout uses its type-specific defaults
- If "Use defaults" is off: user picks output types for all

---

## Step 3: Click Batch Generate

**Action:** User clicks "Batch Generate" button.

**System:**
1. Validates all layouts
2. Creates generation queue
3. Processes layouts sequentially (to manage DB connections)
4. Reports progress per layout

---

## Step 4: Progress Indicator

**UI during generation:**

```
Batch Generation Progress
+------------------------------------------+
| [============================] 70%       |
| Processing: Budget Report (7 of 10)     |
+------------------------------------------+

Completed:
  [OK] Customer Explorer - 1.2s
  [OK] Invoice Editor - 3.1s
  [OK] Product Explorer - 2.0s
  [OK] Vendor Explorer - 1.8s
  [OK] Employee Explorer - 1.5s
  [OK] Warehouse Explorer - 1.1s
  [..] Budget Report - generating...
  [ ]  Account Explorer - pending
  [ ]  Project Editor - pending
  [ ]  Tax Report - pending
```

---

## Step 5: Results Summary

**UI after completion:**

```
Batch Generation Complete
  Successful: 9 of 10
  Failed: 1
  Total time: 25.3s

  [OK] Customer Explorer - 5 outputs
  [OK] Invoice Editor - 6 outputs
  ...
  [FAIL] Tax Report - Error: SP generation failed

  [Export All as ZIP]  [Retry Failed]  [View Details]
```

---

## Step 6: Export as ZIP

**Action:** User clicks "Export All as ZIP".

**ZIP structure:**
```
blg-batch-2024-01-15.zip
  Customer/
    CREATE_TABLE_Customer.sql
    FK_Customer.sql
    DataSource_Customer.xml
    Layout_Customer.xml
  Invoice/
    CREATE_TABLE_Invoice.sql
    CREATE_TABLE_InvoiceDetail.sql
    ...
  Budget/
    ...
```

---

## Error Handling

### Individual Layout Failure
- Mark as FAIL in results list
- Continue processing remaining layouts
- Show error reason in results summary
- "Retry Failed" button to re-process only failed layouts

### Connection Loss During Batch
- Pause batch
- Toast: "Connection lost. Batch paused."
- "Resume" button after reconnection
- No need to restart from beginning

### Performance Limit
- At 50 layouts: hard stop with message
- Suggestion: "Split into smaller batches"

# Core Generation Flow

## Overview

The primary user flow: select a layout, configure outputs, generate, preview, and export. Target: 5 clicks from start to export.

---

## Sequence Diagram

```
User         Browser        Core        Generators      Preview
 |              |              |              |              |
 |--Select------>|              |              |              |
 |               |--Load Meta-->|              |              |
 |               |              |--Analyze--->|              |
 |               |<--Metadata---|              |              |
 |<--Show Meta---|              |              |              |
 |              |              |              |              |
 |--Configure--->|              |              |              |
 |--Generate---->|              |              |              |
 |               |--Generate--->|              |              |
 |               |              |--Build SQL->|              |
 |               |              |--Build XML->|              |
 |               |              |<-Results----|              |
 |               |<-Progress----|              |              |
 |               |              |              |              |
 |               |--Preview---->|              |              |
 |               |              |--------------|->Display     |
 |<--Show Code---|              |              |              |
 |              |              |              |              |
 |--Export------>|              |              |              |
 |               |--Export----->|              |              |
 |<--Download----|              |              |              |
```

---

## Step-by-Step

### Step 1: Select Layout

**Action:** User clicks a layout in the Layout Browser.

**System:**
1. Loads layout metadata from cache/DB
2. Analyzes tables, columns, foreign keys
3. Detects layout type (Explorer/Editor/Report)
4. Identifies relationships and dependencies

**UI Update:** Layout detail panel opens with metadata summary.

### Step 2: View Metadata

**Action:** System auto-displays analyzed metadata.

**Content shown:**
- Layout name and type
- Table list with column counts
- Foreign key relationships
- Detected patterns (master-detail, tree view)
- Recommended output types

### Step 3: Configure Outputs

**Action:** User selects desired output types via checkboxes.

**Default selections based on layout type:**

| Layout Type | Default Outputs |
|---|---|
| Explorer | SQL Tables, FK, Index, DataSource XML, Layout XML |
| Editor | SQL Tables, FK, Index, DataSource XML, Layout XML |
| Report | SQL Tables, DataSource XML, Layout XML, SP |

**Optional:** User adjusts generation options (schema, naming, etc.).

### Step 4: Click Generate

**Action:** User clicks the "Generate" button.

**System processes:**
1. Parse metadata
2. Generate SQL (CREATE TABLE, FK, INDEX)
3. Generate DataSource XML
4. Generate Layout XML
5. Generate SP/View (if selected)
6. Validate all outputs

**Progress shown:**
- Progress bar (0-100%)
- Current step label
- Estimated time remaining

### Step 5: Preview Results

**Action:** System shows generated output in tabbed preview.

**Features:**
- Syntax-highlighted code
- Line numbers
- Tab per output type
- Copy/Download buttons

### Step 6: Export

**Action:** User exports results.

**Options:**
- Copy individual tab to clipboard
- Download individual file
- Export all as ZIP

---

## Error Paths

### DB Connection Fail
- Toast: "Database connection lost"
- Action: "Retry" button, "Work Offline" link
- Recovery: Reconnect and retry generation

### Generation Fail
- Modal: Error message with details
- Suggestion: "Check metadata for inconsistencies"
- Action: "Edit Metadata" button, "Retry" button

### XML Parse Fail
- Warning banner: "Some outputs could not be generated"
- Continues with available outputs
- Shows list of skipped outputs with reasons

### Export Fail
- Toast: "Export failed - file may be in use"
- Action: "Retry" button, "Save As" alternative

# Diff Flow

## Overview

Compare generated output with existing files or previous versions using side-by-side diff view.

---

## Flow Diagram

```
+----------+     +----------+     +----------+     +----------+
|  Click   |---->|  Select  |---->|  Diff    |---->|  Merge   |
| Compare  |     |  Source  |     |  View    |     |  Actions |
+----------+     +----------+     +----------+     +----------+
```

---

## Step 1: User Clicks Compare

**Trigger:** User clicks "Compare" button in preview toolbar.

**Context:** User is viewing generated output in the preview screen.

---

## Step 2: Select Comparison Source

**Options:**

| Source | Description |
|---|---|
| Existing File | Select a local file to compare against |
| Previous Version | Select from history (previous generation of same layout) |
| Clipboard | Paste content from clipboard |

**UI:** Modal with radio buttons for source selection, file picker or history list.

---

## Step 3: Side-by-Side Diff View

**Layout:**

```
+---Left (Existing)---+  +---Right (Generated)---+
| 1  CREATE TABLE..   |  | 1  CREATE TABLE..     |
| 2      Id INT..     |  | 2      Id UNIQUE..    |
+ 3      Name VARCHAR.|  | 3      Name NVARCHAR..|
- 4      OldCol CHAR  |  |                      |
| 5      Amount DEC.. |  | 4      Amount DEC..   |
|                      |  | 5      CreatedDate.. |
+---------------------+  +----------------------+
```

**Color Coding:**
- Green background: Added lines (right side only)
- Red background: Removed lines (left side only)
- Yellow/brown background: Modified lines (both sides)
- Gray: Unchanged lines

**Navigation:**
- "Previous Change" / "Next Change" buttons
- Change counter: "3 of 7 changes"
- Keyboard shortcuts: Alt+Up / Alt+Down

---

## Step 4: Merge Actions

**Options per change:**

| Action | Description |
|---|---|
| Accept Left | Keep the existing version |
| Accept Right | Keep the generated version |
| Accept Both | Include both versions |
| Skip | Leave as-is |

**Bulk actions:**
- "Accept All Left" - Keep all existing
- "Accept All Right" - Accept all generated
- "Reset" - Undo all merge decisions

---

## Step 5: Save Merged Result

After resolving all changes:
- "Save Merged Result" button
- Option to save as new file or overwrite existing
- Confirmation dialog before overwrite

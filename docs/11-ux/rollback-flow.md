# Rollback Flow

## Overview

Restore a previous generation version as the current active version. Every rollback creates a new version entry (the rollback itself is undoable).

---

## Flow Diagram

```
+----------+     +----------+     +----------+     +----------+     +----------+
|  View    |---->|  Select  |---->|  Click   |---->| Confirm  |---->| Rollback |
| History  |     | Version  |     | Rollback |     | Dialog   |     | Execute  |
+----------+     +----------+     +----------+     +----------+     +----------+
```

---

## Step 1: User Views History

**Action:** User navigates to History screen.

**UI:** Table showing past generations with dates, layouts, status, and actions.

---

## Step 2: Select Version to Rollback

**Action:** User identifies the version to restore.

**Helpful info shown:**
- Generation date and time
- Layout name
- Output types generated
- Status (OK/FAIL/WARN)
- Preview of the outputs (expandable row)

---

## Step 3: Click Rollback

**Action:** User clicks "Rollback" button on a history row.

---

## Step 4: Confirmation Dialog

**UI:**

```
+---Confirm Rollback---------------------------+
|                                               |
|  Are you sure you want to rollback to this    |
|  version?                                     |
|                                               |
|  Layout: Customer Explorer                    |
|  Version: 2024-01-10 14:30:22                 |
|                                               |
|  This will create a new version with the      |
|  content from the selected version.           |
|                                               |
|  Changes:                                     |
|  - 3 files will be updated                    |
|  - 2 files unchanged                          |
|                                               |
|  [Cancel]              [Rollback]             |
+-----------------------------------------------+
```

---

## Step 5: Rollback Executes

**System actions:**
1. Reads the selected version's outputs
2. Creates a new version entry in history
3. Marks the new version as "Rollback" action type
4. Copies the old content to the new version
5. Updates the output files

**UI:** Progress indicator, then success toast: "Rollback complete. New version created."

---

## Step 6: Success Notification

**Toast notification:**
- Message: "Rolled back to version from [date]"
- Action: "View Changes" link (opens diff view)

---

## Undo Rollback

Since every rollback creates a new version:
- The rollback itself can be rolled back
- Navigate to the rollback entry in history
- Click "Rollback" on the entry before the rollback
- This restores the state before the rollback

**Version chain example:**
```
v1 (Jan 10) -> v2 (Jan 12) -> v3 (Jan 15 rollback to v1) -> v4 (Jan 16 rollback to v2)
```

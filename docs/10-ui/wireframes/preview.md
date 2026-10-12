# Preview Screen Wireframe

## Layout

The preview screen shows generated output with syntax highlighting in a tabbed interface.

---

## ASCII Wireframe

```
+------+-----------------------------------------------------------+
|      |  Preview: Budget Report                                    |
|      |                                                           |
|      |  [SQL] [DataSource XML] [Layout XML] [SP] [View] [Diff]  |
|      |  +-------------------------------------------------------+
|      |  | 1 | CREATE TABLE dbo.tblBudget (                      |
|      |  | 2 |     BudgetId UNIQUEIDENTIFIER NOT NULL,            |
|      |  | 3 |     BudgetCode NVARCHAR(50) NOT NULL,              |
|      |  | 4 |     BudgetName NVARCHAR(200) NOT NULL,             |
|      |  | 5 |     Amount DECIMAL(18,2) DEFAULT 0,                |
|      |  | 6 |     CreatedDate DATETIME DEFAULT GETDATE(),        |
|      |  | 7 |     CONSTRAINT PK_tblBudget PRIMARY KEY (BudgetId) |
|      |  | 8 | );                                                 |
|      |  +-------------------------------------------------------+
|      |                                                           |
|      |  [Copy] [Download] [Export All] [Compare] [Search...   ] |
|      |                                                           |
+------+-----------------------------------------------------------+
```

---

## Tab Bar

Tabs for each generated output type:

| Tab | Content |
|---|---|
| SQL | CREATE TABLE, FK, INDEX statements |
| DataSource XML | Bravo DataSource XML |
| Layout XML | Bravo Layout XML |
| SP | Stored procedure code |
| View | CREATE VIEW statement |
| Diff | Side-by-side comparison (if compare enabled) |

Tabs with content are enabled. Tabs without content are disabled and grayed out.
Each tab shows a count badge for the number of statements/sections.

---

## Code Display

### Features
- Syntax highlighting (SQL, XML, JavaScript)
- Line numbers on left (fixed width, right-aligned)
- Current line highlight (subtle background)
- Long lines: horizontal scroll (no wrap by default)
- Search within current tab (Ctrl+F style)
- Find and replace (Ctrl+H)

### Toolbar Actions

| Action | Icon | Description |
|---|---|---|
| Copy | Copy | Copy current tab content to clipboard |
| Download | Download | Save current tab as file |
| Export All | Archive | Download all outputs as ZIP |
| Compare | Diff | Compare with existing file or previous version |
| Search | Search | Search within current tab |
| Wrap | Wrap | Toggle word wrap on/off |

---

## Diff View (Tab: Diff)

Side-by-side comparison view:

```
+------------------------+  +------------------------+
| Existing (left)        |  | Generated (right)      |
|                        |  |                        |
| 1  CREATE TABLE dbo..  |  | 1  CREATE TABLE dbo..  |
| 2      BudgetId INT    |  | 2      BudgetId UNIQUE..|
+ 3      BudgetCode VAR..|  | 3      BudgetCode NVAR..|
- 4      OldColumn CHAR  |  |                        |
| 5      Amount DECIMAL..|  | 4      Amount DECIMAL.. |
|                        |  | 5      CreatedDate DAT..|
+------------------------+  +------------------------+
```

Color coding:
- Green background: Added lines (right side only)
- Red background: Removed lines (left side only)
- Yellow background: Modified lines (both sides)
- Gray: Unchanged lines

Navigation: Previous/Next change buttons, change counter "3 of 7 changes"

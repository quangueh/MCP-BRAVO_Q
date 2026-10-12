# Generation Screen Wireframe

## Layout

The generation screen allows users to configure output types and options before generating.

---

## ASCII Wireframe

```
+------+-----------------------------------------------------------+
|      |  Generate                                                  |
|      |                                                           |
|      |  +---Selected Layout---+  +---Output Types---+            |
|      |  |                     |  |                  |            |
|      |  | Name: Budget Report |  | [x] SQL Tables   |            |
|      |  | Type: Report        |  | [x] Foreign Keys |            |
|      |  | SP: usp_Budget      |  | [x] Indexes      |            |
|      |  | Tables: 2           |  | [x] DataSource   |            |
|      |  | Columns: 15         |  | [x] Layout XML   |            |
|      |  | Has Tree: Yes       |  | [ ] Stored Proc  |            |
|      |  |                     |  | [ ] View         |            |
|      |  +---------------------+  | [ ] Triggers     |            |
|      |                           | [ ] INSERT seed  |            |
|      |                           | [ ] SELECT proc  |            |
|      |                           +------------------+            |
|      |                                                           |
|      |  +---Generation Options---+                               |
|      |  |                        |                               |
|      |  | Schema: [dbo        v] |                               |
|      |  | Naming: [PascalCase v] |                               |
|      |  | Audit:  [x] Include   |                               |
|      |  | Seed:   [ ] Include   |                               |
|      |  | Timeout: [30    ] sec  |                               |
|      |  |                        |                               |
|      |  +------------------------+                               |
|      |                                                           |
|      |  [============Generate============]                       |
|      |                                                           |
|      |  +---Progress---+                                        |
|      |  | [========] 60%  Generating SQL Tables...              |
|      |  +--------------+                                        |
|      |                                                           |
+------+-----------------------------------------------------------+
```

---

## Component Breakdown

### Selected Layout Info Panel

Shows metadata for the selected layout:
- **Name** - Layout display name
- **Type** - Explorer / Editor / Report
- **SP** - Stored procedure name (for reports)
- **Tables** - Number of related tables
- **Columns** - Number of columns
- **Has Tree** - Yes/No (tree view support)

If multiple layouts selected (batch mode): shows count and collapsible list.

### Output Type Checkboxes

| Output | Description | Default |
|---|---|---|
| SQL Tables | CREATE TABLE statements | Checked |
| Foreign Keys | ALTER TABLE ADD CONSTRAINT | Checked |
| Indexes | CREATE INDEX statements | Checked |
| DataSource XML | Bravo DataSource XML | Checked |
| Layout XML | Bravo Layout XML (Explorer/Editor/Report) | Checked |
| Stored Procedure | Generated SP for reports | Unchecked |
| View | CREATE VIEW statement | Unchecked |
| Triggers | Audit triggers (INSERT/UPDATE/DELETE) | Unchecked |
| INSERT seed | INSERT statements for default data | Unchecked |
| SELECT proc | SELECT stored procedure | Unchecked |

"Select All" / "Deselect All" links at top.

### Generation Options

| Option | Type | Default | Description |
|---|---|---|---|
| Schema name | Dropdown | dbo | Target SQL schema |
| Naming convention | Dropdown | PascalCase | camelCase, PascalCase, snake_case |
| Include audit columns | Checkbox | Yes | CreatedDate, ModifiedDate, etc. |
| Include seed data | Checkbox | No | Generate INSERT statements |
| Timeout | Number input | 30 | Generation timeout in seconds |

### Generate Button
- Full-width primary button
- Disabled until at least one output type is selected
- Shows spinner during generation

### Progress Bar
- Appears below Generate button when generation starts
- Shows percentage and current step description
- Steps: Parsing -> Analyzing -> Generating -> Validating

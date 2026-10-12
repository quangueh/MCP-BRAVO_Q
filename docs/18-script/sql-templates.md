# SQL Template Library

## Template Inventory

| #  | Template           | File               | Description                          |
|----|--------------------|--------------------|--------------------------------------|
| 1  | create-table       | `create-table.ejs` | CREATE TABLE with columns, PK, defaults |
| 2  | add-fk             | `add-fk.ejs`       | ALTER TABLE ADD CONSTRAINT FK        |
| 3  | add-index          | `add-index.ejs`    | CREATE INDEX                         |
| 4  | sp-select          | `sp-select.ejs`    | SELECT stored procedure with JOINs   |
| 5  | sp-insert          | `sp-insert.ejs`    | INSERT stored procedure with output  |
| 6  | sp-update          | `sp-update.ejs`    | UPDATE stored procedure with audit   |
| 7  | sp-delete          | `sp-delete.ejs`    | Soft delete stored procedure         |
| 8  | view-simple        | `view-simple.ejs`  | Simple view (single table)           |
| 9  | view-join          | `view-join.ejs`    | JOIN view (multiple tables)          |
| 10 | trigger-audit      | `trigger-audit.ejs`| Audit trigger for change tracking    |
| 11 | insert-seed        | `insert-seed.ejs`  | Seed data INSERT statements          |

## Template: `create-table.ejs`

**Variables:** `tableName`, `schemaName`, `columns[]` (`name`, `type`, `nullable`, `defaultValue`), `pkColumn`

**Example output:**

```sql
CREATE TABLE [dbo].[B20Customer] (
  [Id]           INT            NOT NULL IDENTITY(1,1),
  [CustomerCode] NVARCHAR(50)   NOT NULL,
  [CustomerName] NVARCHAR(200)  NOT NULL,
  [IsActive]     BIT            NOT NULL DEFAULT 1,
  CONSTRAINT [PK_B20Customer] PRIMARY KEY CLUSTERED ([Id])
);
```

## Template: `add-fk.ejs`

**Variables:** `sourceTable`, `targetTable`, `sourceColumn`, `targetColumn`, `constraintName`

## Template: `add-index.ejs`

**Variables:** `tableName`, `columns[]`, `indexName`, `isUnique`

## Template: `sp-select.ejs`

**Variables:** `spName`, `tableName`, `schemaName`, `columns[]`, `joinTables[]`, `filterColumns[]`

## Template: `sp-insert.ejs`

**Variables:** `spName`, `tableName`, `schemaName`, `columns[]` (excluding Id/audit), `outputColumns[]`

## Template: `sp-update.ejs`

**Variables:** `spName`, `tableName`, `schemaName`, `columns[]`, `auditColumns[]`, `pkColumn`

## Template: `sp-delete.ejs`

**Variables:** `spName`, `tableName`, `schemaName`, `pkColumn`, `softDeleteColumn`

## Template: `view-simple.ejs`

**Variables:** `viewName`, `tableName`, `schemaName`, `columns[]`

## Template: `view-join.ejs`

**Variables:** `viewName`, `tables[]` (`name`, `alias`, `joinType`, `joinCondition`), `columns[]`

## Template: `trigger-audit.ejs`

**Variables:** `tableName`, `schemaName`, `auditTable`, `trackedColumns[]`

## Template: `insert-seed.ejs`

**Variables:** `tableName`, `schemaName`, `columns[]`, `rows[]` (array of value arrays)

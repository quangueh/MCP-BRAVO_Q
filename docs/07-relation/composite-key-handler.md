# Composite Key Handler

## Overview

Handling of composite primary keys and composite foreign keys in Bravo ERP database tables.

---

## Detection

A composite key is detected when the PK definition has multiple columns.

```json
{
  "primaryKey": {
    "columns": ["UserId", "RoleId"],
    "type": "COMPOSITE",
    "isClustered": true
  }
}
```

---

## Usage Patterns

### Junction Tables (N:M Relations)

Tables linking two entities in a many-to-many relationship.

```
B20User  <---> B20UserRole  <---> B20Role
         (UserId, RoleId)
```

### Historical Data Tables

Tables tracking changes over time, keyed by entity + date/period.

```
B20BudgetPeriod
  PK: (BudgetId, PeriodNumber)
```

### Configuration Tables

Tables with settings scoped to multiple dimensions.

```
B00UserPermission
  PK: (UserId, ModuleCode, PermissionCode)
```

---

## Generation Rules

### Composite PK

```sql
CREATE TABLE [dbo].[{TableName}] (
    [{Col1}] {Type1} NOT NULL,
    [{Col2}] {Type2} NOT NULL,
    -- other columns...
    CONSTRAINT [PK_{TableName}] PRIMARY KEY CLUSTERED (
        [{Col1}] ASC,
        [{Col2}] ASC
    )
);
```

### Composite FK

When a composite PK is referenced, the FK must include ALL PK columns in the same order.

```sql
ALTER TABLE [{SourceTable}]
ADD CONSTRAINT [{FKName}]
FOREIGN KEY ([{Col1}], [{Col2}])
REFERENCES [{TargetTable}]([{TargetCol1}], [{TargetCol2}])
ON DELETE CASCADE
ON UPDATE CASCADE;
```

---

## Index Strategy

```sql
-- Index on second column for reverse lookups
CREATE NONCLUSTERED INDEX [IX_{Table}_{Col2}]
ON [{Table}] ([{Col2}] ASC);
```

---

## SQL Template - Complete Junction Table

```sql
CREATE TABLE [dbo].[B20UserRole] (
    [UserId]       INT            NOT NULL,
    [RoleId]       INT            NOT NULL,
    [IsActive]     BIT            NOT NULL DEFAULT ((1)),
    [CreatedBy]    INT            NULL,
    [CreatedDate]  DATETIME2(7)   NULL DEFAULT (GETDATE()),
    [ModifiedBy]   INT            NULL,
    [ModifiedDate] DATETIME2(7)   NULL,
    CONSTRAINT [PK_B20UserRole] PRIMARY KEY CLUSTERED ([UserId] ASC, [RoleId] ASC)
);
GO

ALTER TABLE [dbo].[B20UserRole]
ADD CONSTRAINT [FK_B20UserRole_B20User]
FOREIGN KEY ([UserId]) REFERENCES [dbo].[B20User]([Id])
ON DELETE CASCADE ON UPDATE CASCADE;
GO

ALTER TABLE [dbo].[B20UserRole]
ADD CONSTRAINT [FK_B20UserRole_B20Role]
FOREIGN KEY ([RoleId]) REFERENCES [dbo].[B20Role]([Id])
ON DELETE CASCADE ON UPDATE CASCADE;
GO

CREATE NONCLUSTERED INDEX [IX_B20UserRole_RoleId]
ON [dbo].[B20UserRole] ([RoleId] ASC);
GO
```

---

## Validation Rules

1. All composite PK columns must be NOT NULL
2. Composite FK columns must match PK columns in count, order, and data type
3. Index column order should match most common query pattern
4. Junction tables should have few non-key columns
5. Maximum recommended composite PK width: 4 columns
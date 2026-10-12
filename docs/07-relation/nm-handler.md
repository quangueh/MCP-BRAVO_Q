# Many-to-Many (N:M) Handler

## Overview

Handling of many-to-many relationships through junction/bridge tables in Bravo ERP.

---

## Detection

A junction table is detected when:

1. Table has 2+ foreign keys to different master tables
2. Table has few non-FK columns (typically only audit columns)
3. Table PK is composite (combination of both FK columns)

```javascript
function detectJunctionTables(tables, relations) {
  const junctions = [];

  for (const table of tables) {
    const fks = relations.filter(r =>
      r.sourceTable === table.tableName &&
      r.targetTable !== table.tableName
    );

    const uniqueTargets = [...new Set(fks.map(f => f.targetTable))];

    if (uniqueTargets.length >= 2) {
      const nonKeyColumns = table.columns.filter(c =>
        !fks.some(fk => fk.sourceColumn === c.name) &&
        !["CreatedBy", "CreatedDate", "ModifiedBy", "ModifiedDate", "IsActive"].includes(c.name)
      );

      if (nonKeyColumns.length <= 2) {
        junctions.push({
          junctionTable: table.tableName,
          masterTables: uniqueTargets,
          fkColumns: fks.map(f => ({
            column: f.sourceColumn,
            references: f.targetTable
          })),
          hasExtraColumns: nonKeyColumns.length > 0
        });
      }
    }
  }

  return junctions;
}
```

---

## Naming Convention

| Pattern                  | Example                      |
|--------------------------|------------------------------|
| {Table1}_{Table2}        | B20UserRole                  |
| {Table1}{Table2}         | B20UserRole (no separator)   |

---

## Generation

### Create Junction Table

```sql
CREATE TABLE [dbo].[{JunctionTable}] (
    [{FK1}]        INT            NOT NULL,
    [{FK2}]        INT            NOT NULL,
    [IsActive]     BIT            NOT NULL DEFAULT ((1)),
    [CreatedBy]    INT            NULL,
    [CreatedDate]  DATETIME2(7)   NULL DEFAULT (GETDATE()),
    [ModifiedBy]   INT            NULL,
    [ModifiedDate] DATETIME2(7)   NULL,
    CONSTRAINT [PK_{JunctionTable}] PRIMARY KEY CLUSTERED (
        [{FK1}] ASC, [{FK2}] ASC
    )
);
GO
```

### FK Constraints

```sql
ALTER TABLE [dbo].[{JunctionTable}]
ADD CONSTRAINT [FK_{JunctionTable}_{Master1}]
FOREIGN KEY ([{FK1}])
REFERENCES [dbo].[{Master1}]([Id])
ON DELETE CASCADE ON UPDATE CASCADE;
GO

ALTER TABLE [dbo].[{JunctionTable}]
ADD CONSTRAINT [FK_{JunctionTable}_{Master2}]
FOREIGN KEY ([{FK2}])
REFERENCES [dbo].[{Master2}]([Id])
ON DELETE CASCADE ON UPDATE CASCADE;
GO
```

### Indexes

```sql
CREATE NONCLUSTERED INDEX [IX_{JunctionTable}_{FK2}]
ON [dbo].[{JunctionTable}] ([{FK2}] ASC);
GO
```

---

## Complete Example: B20UserRole

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

## UI Configuration

### Multi-Select in Editor

```json
{
  "name": "UserRoles",
  "controlType": "CheckedListBox",
  "dataMember": "RoleId",
  "lookupSource": {
    "table": "B20Role",
    "valueMember": "Id",
    "displayMember": "Name",
    "filter": "IsActive = 1"
  }
}
```

---

## Stored Procedures

### Get Related Records

```sql
CREATE PROCEDURE [dbo].[usp_B20UserRole_GetByUser]
    @UserId INT,
    @_UserId INT = NULL
AS
BEGIN
    SET NOCOUNT ON;

    SELECT ur.[RoleId], r.[Code] AS RoleCode, r.[Name] AS RoleName
    FROM [dbo].[B20UserRole] ur
    INNER JOIN [dbo].[B20Role] r ON ur.[RoleId] = r.[Id]
    WHERE ur.[UserId] = @UserId AND ur.[IsActive] = 1 AND r.[IsActive] = 1;
END;
GO
```

### Sync N:M Relations (Replace All)

```sql
CREATE PROCEDURE [dbo].[usp_B20UserRole_SyncByUser]
    @UserId INT,
    @RoleIds NVARCHAR(MAX),
    @_UserId INT = NULL
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRY
        BEGIN TRANSACTION;

        UPDATE [dbo].[B20UserRole]
        SET [IsActive] = 0, [ModifiedBy] = @_UserId, [ModifiedDate] = GETDATE()
        WHERE [UserId] = @UserId AND [IsActive] = 1;

        INSERT INTO [dbo].[B20UserRole] ([UserId], [RoleId], [CreatedBy], [CreatedDate])
        SELECT @UserId, value, @_UserId, GETDATE()
        FROM STRING_SPLIT(@RoleIds, ',')
        WHERE TRY_CAST(value AS INT) IS NOT NULL;

        COMMIT TRANSACTION;
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0 ROLLBACK;
        THROW;
    END CATCH;
END;
GO
```

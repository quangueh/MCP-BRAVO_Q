# Self-Referencing Relation Handler

## Overview

Handling of self-referencing foreign keys where a table references itself. Common in tree/hierarchy structures in Bravo ERP.

---

## Detection

A self-reference is detected when the FK source table equals the target table.

| Table                | Column    | Pattern         | Description              |
|----------------------|-----------|-----------------|--------------------------|
| B20ClassInfo         | ParentId  | Tree            | Classification hierarchy |
| B20JobRCC            | ParentId  | Tree            | Job cost center tree     |
| B20Employee          | ManagerId | Hierarchy       | Org chart                |
| B20Account           | ParentId  | Tree            | Chart of accounts        |
| B20ProductCategory   | ParentId  | Tree            | Product categories       |

---

## Generation

### FK Constraint

```sql
ALTER TABLE [dbo].[B20ClassInfo]
ADD CONSTRAINT [FK_B20ClassInfo_B20ClassInfo_Parent]
FOREIGN KEY ([ParentId])
REFERENCES [dbo].[B20ClassInfo]([Id])
ON DELETE RESTRICT
ON UPDATE CASCADE;
```

### Index

```sql
CREATE NONCLUSTERED INDEX [IX_B20ClassInfo_ParentId]
ON [dbo].[B20ClassInfo] ([ParentId] ASC);
```

---

## UI Configuration

### Tree View with zTree

```json
{
  "explorerConfig": {
    "treeColumn": "Name",
    "treeParentColumn": "ParentId",
    "zTreeColName": "Name",
    "zMakingTreeNodeKeyColName": "Id"
  }
}
```

---

## Stored Procedure: Recursive CTE Traversal

### Get Full Tree

```sql
CREATE PROCEDURE [dbo].[usp_B20ClassInfo_GetTree]
    @_UserId INT = NULL,
    @_BranchCode VARCHAR(3) = NULL,
    @_LangId INT = 1
AS
BEGIN
    SET NOCOUNT ON;

    WITH ClassTree AS (
        SELECT
            ci.[Id], ci.[Code], ci.[Name], ci.[ParentId],
            0 AS [Level],
            CAST(ci.[Code] AS VARCHAR(MAX)) AS [SortPath]
        FROM [dbo].[B20ClassInfo] ci
        WHERE ci.[ParentId] IS NULL AND ci.[IsActive] = 1

        UNION ALL

        SELECT
            ci.[Id], ci.[Code], ci.[Name], ci.[ParentId],
            ct.[Level] + 1,
            CAST(ct.[SortPath] + '.' + ci.[Code] AS VARCHAR(MAX))
        FROM [dbo].[B20ClassInfo] ci
        INNER JOIN ClassTree ct ON ci.[ParentId] = ct.[Id]
        WHERE ci.[IsActive] = 1
    )
    SELECT [Id], [Code], [Name], [ParentId], [Level], [SortPath]
    FROM ClassTree
    ORDER BY [SortPath];
END;
GO
```

### Get Children of Specific Node

```sql
CREATE PROCEDURE [dbo].[usp_B20ClassInfo_GetChildren]
    @ParentId INT = NULL,
    @_UserId INT = NULL
AS
BEGIN
    SET NOCOUNT ON;

    SELECT
        [Id], [Code], [Name], [ParentId],
        CASE WHEN EXISTS (
            SELECT 1 FROM [dbo].[B20ClassInfo] child
            WHERE child.[ParentId] = ci.[Id] AND child.[IsActive] = 1
        ) THEN 1 ELSE 0 END AS [HasChildren]
    FROM [dbo].[B20ClassInfo] ci
    WHERE ci.[ParentId] = @ParentId AND ci.[IsActive] = 1
    ORDER BY ci.[Code];
END;
GO
```

### Get Ancestors (Path to Root)

```sql
CREATE PROCEDURE [dbo].[usp_B20ClassInfo_GetAncestors]
    @NodeId INT,
    @_UserId INT = NULL
AS
BEGIN
    SET NOCOUNT ON;

    WITH Ancestors AS (
        SELECT [Id], [Code], [Name], [ParentId]
        FROM [dbo].[B20ClassInfo]
        WHERE [Id] = @NodeId AND [IsActive] = 1

        UNION ALL

        SELECT ci.[Id], ci.[Code], ci.[Name], ci.[ParentId]
        FROM [dbo].[B20ClassInfo] ci
        INNER JOIN Ancestors a ON ci.[Id] = a.[ParentId]
        WHERE ci.[IsActive] = 1
    )
    SELECT [Id], [Code], [Name], [ParentId]
    FROM Ancestors
    ORDER BY [Id];
END;
GO
```

---

## Validation Rules

1. Self-reference FK target column must be the PK
2. Self-reference should use ON DELETE RESTRICT (prevent orphan subtrees)
3. ParentId column must allow NULL (root nodes have no parent)
4. No circular references in tree data (A->B->C->A)
5. Tree depth should be monitored (warn if > 20 levels)

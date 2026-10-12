# Index Generator Specification

## Overview
Auto-generates indexes based on table metadata.

## Auto-Generated Types
1. IX_{Table}_{FK} for every FK column
2. UX_{Table}_{Code} UNIQUE for Code columns
3. IX_{Table}_{Col1}_{Col2} for composite queries

## Template
```sql
CREATE [UNIQUE] NONCLUSTERED INDEX [{Name}]
ON [{Schema}].[{Table}] ([{Col1}] ASC, [{Col2}] ASC)
INCLUDE ([{IncludeCol1}]);
GO
```

## Rules
- Max 10 indexes per table
- No index on low-selectivity columns (IsActive, Status)
- FK columns always get index
- Code columns get UNIQUE index

## Examples

```sql
-- FK Index
CREATE NONCLUSTERED INDEX [IX_B20Order_CustomerId]
ON [dbo].[B20Order] ([CustomerId] ASC);
GO

-- Unique Code Index
CREATE UNIQUE NONCLUSTERED INDEX [UX_B20Customer_Code]
ON [dbo].[B20Customer] ([Code] ASC);
GO

-- Composite Index
CREATE NONCLUSTERED INDEX [IX_B20Order_OrderDate_CustomerId]
ON [dbo].[B20Order] ([OrderDate] ASC, [CustomerId] ASC)
INCLUDE ([TotalAmount], [Status]);
GO
```

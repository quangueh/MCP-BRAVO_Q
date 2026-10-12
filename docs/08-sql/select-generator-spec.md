# SELECT Query Generator Specification

## Basic Template
```sql
SELECT [{Col1}], [{Col2}]
FROM [{Table}]
WHERE [IsActive] = 1
ORDER BY [{SortCol}] DESC;
```

## With JOINs Template
```sql
SELECT
    t.[{Col1}], t.[{Col2}],
    m.[Name] AS {MasterName}
FROM [{Table}] t
LEFT JOIN [{MasterTable}] m ON t.[{FkCol}] = m.[{PkCol}]
WHERE t.[IsActive] = 1
ORDER BY t.[{SortCol}] DESC;
```

## Rules
1. Always filter IsActive = 1
2. LEFT JOIN for master data lookups
3. RIGHT JOIN not allowed
4. ORDER BY most recent first for transactions
5. Parameterize WHERE clauses
6. Use table aliases (t, m, d)

## Example with Multiple JOINs
```sql
SELECT
    t.[Id], t.[Code], t.[OrderDate],
    t.[TotalAmount], t.[Status],
    c.[Name] AS CustomerName,
    b.[Name] AS BranchName
FROM [dbo].[B20Order] t
LEFT JOIN [dbo].[B20Customer] c ON t.[CustomerId] = c.[Id]
LEFT JOIN [dbo].[B00Branch] b ON t.[BranchCode] = b.[Code]
WHERE t.[IsActive] = 1
ORDER BY t.[OrderDate] DESC;
```

## Pagination Template
```sql
SELECT [{Cols}]
FROM [{Table}]
WHERE [IsActive] = 1
ORDER BY [Id] DESC
OFFSET @Offset ROWS
FETCH NEXT @PageSize ROWS ONLY;
```

# View Generator Specification

## Pattern 1: Simple View
```sql
CREATE VIEW [dbo].[vw_B20Customer]
AS
SELECT [Id], [Code], [Name], [TaxCode], [IsActive]
FROM [dbo].[B20Customer]
WHERE [IsActive] = 1;
GO
```

## Pattern 2: JOIN View (Master Data Denormalization)
```sql
CREATE VIEW [dbo].[vw_B20Order_Master]
AS
SELECT
    t.[Id], t.[Code] AS OrderCode, t.[OrderDate],
    c.[Name] AS CustomerName, b.[Name] AS BranchName
FROM [dbo].[B20Order] t
LEFT JOIN [dbo].[B20Customer] c ON t.[CustomerId] = c.[Id]
LEFT JOIN [dbo].[B00Branch] b ON t.[BranchCode] = b.[Code]
WHERE t.[IsActive] = 1;
GO
```

## Pattern 3: Aggregate View
```sql
CREATE VIEW [dbo].[vw_B20Customer_Orders]
AS
SELECT
    c.[Id] AS CustomerId, c.[Code] AS CustomerCode,
    COUNT(o.[Id]) AS OrderCount, SUM(o.[TotalAmount]) AS TotalAmount
FROM [dbo].[B20Customer] c
LEFT JOIN [dbo].[B20Order] o ON c.[Id] = o.[CustomerId] AND o.[IsActive] = 1
WHERE c.[IsActive] = 1
GROUP BY c.[Id], c.[Code], c.[Name];
GO
```

## Rules
1. Use WITH SCHEMABINDING for indexed views
2. Alias columns for clarity
3. Filter IsActive = 1 in view definition
4. No ORDER BY in views (apply in query)
5. Prefix views with vw_
6. Use LEFT JOIN for optional relationships

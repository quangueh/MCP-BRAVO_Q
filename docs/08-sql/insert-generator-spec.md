# INSERT Script Generator Specification

## Template
```sql
SET IDENTITY_INSERT [{Table}] ON;

INSERT INTO [{Table}] ([Id], [Code], [Name], [IsActive], [CreatedBy], [CreatedDate])
VALUES (@Id, @Code, @Name, 1, @UserId, GETDATE());

SET IDENTITY_INSERT [{Table}] OFF;
GO
```

## Rules
1. Enable identity insert for ID columns
2. Handle NULL with NULL keyword, not string
3. Handle strings with N prefix for unicode (N'...')
4. Handle dates with YYYY-MM-DD format
5. Disable identity insert after batch
6. Always include audit columns

## Value Formatting

| Data Type | Format | Example |
|-----------|--------|---------|
| INT | Literal number | 42 |
| DECIMAL | Number with dot | 1500.00 |
| VARCHAR | Single-quoted | ABC123 |
| NVARCHAR | N-prefix quoted | N'Ten san pham' |
| DATE | YYYY-MM-DD | 2024-01-15 |
| BIT | 0 or 1 | 1 |
| NULL | NULL keyword | NULL |

## Example
```sql
SET IDENTITY_INSERT [dbo].[B00Branch] ON;

INSERT INTO [dbo].[B00Branch] ([Id], [Code], [Name], [IsActive], [CreatedBy], [CreatedDate])
VALUES
(1, N'HCM', N'Chi nhanh TP.HCM', 1, 1, GETDATE()),
(2, N'HN', N'Chi nhanh Ha Noi', 1, 1, GETDATE()),
(3, N'DN', N'Chi nhanh Da Nang', 1, 1, GETDATE());

SET IDENTITY_INSERT [dbo].[B00Branch] OFF;
GO
```

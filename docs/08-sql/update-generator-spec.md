# UPDATE Script Generator Specification

## Template
```sql
UPDATE [{Table}]
SET
    [{Col1}] = @{Col1},
    [{Col2}] = @{Col2},
    [ModifiedBy] = @_UserId,
    [ModifiedDate] = GETDATE()
WHERE [{PkColumn}] = @{PkColumn};
GO
```

## Rules
1. Always include audit columns (ModifiedBy, ModifiedDate)
2. WHERE on PK only - never update without PK filter
3. Parameterize all values
4. Exclude Identity column from SET
5. Exclude CreatedBy/CreatedDate from SET (immutable)
6. Exclude IsActive from SET (use soft delete instead)

## Example
```sql
UPDATE [dbo].[B20Customer]
SET
    [Code] = @Code,
    [Name] = @Name,
    [TaxCode] = @TaxCode,
    [ModifiedBy] = @_UserId,
    [ModifiedDate] = GETDATE()
WHERE [Id] = @Id;
GO
```

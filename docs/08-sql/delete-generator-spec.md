# DELETE Script Generator Specification

## Soft Delete Template (Default)
```sql
UPDATE [{Table}]
SET
    [IsActive] = 0,
    [ModifiedBy] = @_UserId,
    [ModifiedDate] = GETDATE()
WHERE [{PkColumn}] = @{PkColumn};
GO
```

## Hard Delete Template (Reference data only)
```sql
DELETE FROM [{Table}]
WHERE [{PkColumn}] = @{PkColumn};
GO
```

## Rules
1. Default to soft delete (IsActive = 0)
2. Check FK references before hard delete
3. Log deletion for audit trail
4. Never hard delete transaction data
5. Hard delete only for reference/lookup data
6. Always filter by PK

## Hard Delete with FK Check
```sql
IF EXISTS (
    SELECT 1 FROM [dbo].[B20Order]
    WHERE [CustomerId] = @Id AND [IsActive] = 1
)
BEGIN
    RAISERROR(N'Cannot delete: Customer has active orders', 16, 1);
    RETURN;
END

DELETE FROM [dbo].[B20Customer] WHERE [Id] = @Id;
GO
```

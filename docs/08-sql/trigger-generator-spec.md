# Trigger Generator Specification

## Audit Trigger Template
```sql
CREATE TRIGGER [dbo].[trg_{Table}_Audit]
ON [dbo].[{Table}]
AFTER INSERT, UPDATE, DELETE
AS
BEGIN
    SET NOCOUNT ON;

    -- INSERT
    IF EXISTS (SELECT 1 FROM inserted) AND NOT EXISTS (SELECT 1 FROM deleted)
    BEGIN
        INSERT INTO [dbo].[AuditLog] ([TableName], [Action], [RecordId], [UserId], [ActionDate])
        SELECT '{Table}', 'INSERT', i.[Id], i.[CreatedBy], GETDATE()
        FROM inserted i;
    END

    -- UPDATE
    IF EXISTS (SELECT 1 FROM inserted) AND EXISTS (SELECT 1 FROM deleted)
    BEGIN
        INSERT INTO [dbo].[AuditLog] ([TableName], [Action], [RecordId], [UserId], [ActionDate])
        SELECT '{Table}', 'UPDATE', i.[Id], i.[ModifiedBy], GETDATE()
        FROM inserted i;
    END

    -- DELETE
    IF NOT EXISTS (SELECT 1 FROM inserted) AND EXISTS (SELECT 1 FROM deleted)
    BEGIN
        INSERT INTO [dbo].[AuditLog] ([TableName], [Action], [RecordId], [UserId], [ActionDate])
        SELECT '{Table}', 'DELETE', d.[Id], NULL, GETDATE()
        FROM deleted d;
    END
END;
GO
```

## Rules
1. Only for tables requiring audit trail
2. Use inserted/deleted magic tables
3. Log action type, record ID, user, timestamp
4. Disable trigger for bulk operations

## Disable for Bulk Operations
```sql
DISABLE TRIGGER [dbo].[trg_{Table}_Audit] ON [dbo].[{Table}];
-- bulk operation
ENABLE TRIGGER [dbo].[trg_{Table}_Audit] ON [dbo].[{Table}];
```

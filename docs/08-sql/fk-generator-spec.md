# FK Generator Specification

## Overview
Generates ALTER TABLE ADD CONSTRAINT FOREIGN KEY statements.

## Template
```sql
ALTER TABLE [{SourceTable}]
ADD CONSTRAINT [{FKName}]
FOREIGN KEY ([{SourceColumn}])
REFERENCES [{TargetTable}]([{TargetColumn}])
ON DELETE {Action}
ON UPDATE {Action};
GO
```

## Naming: FK_{SourceTable}_{TargetTable} (max 128 chars)

## Cascade Actions

| Scenario | ON DELETE | ON UPDATE |
|----------|-----------|-----------|
| Child/detail tables | CASCADE | CASCADE |
| Reference/lookup tables | RESTRICT | CASCADE |
| Optional refs (nullable FK) | SET NULL | CASCADE |
| Audit columns (CreatedBy) | NO ACTION | NO ACTION |

## Examples

```sql
-- CASCADE (child table)
ALTER TABLE [dbo].[B10BudgetConsDetail]
ADD CONSTRAINT [FK_B10BudgetConsDetail_B10BudgetCons]
FOREIGN KEY ([BudgetConsId])
REFERENCES [dbo].[B10BudgetCons]([Id])
ON DELETE CASCADE ON UPDATE CASCADE;
GO

-- RESTRICT (reference table)
ALTER TABLE [dbo].[B20Order]
ADD CONSTRAINT [FK_B20Order_B20Customer]
FOREIGN KEY ([CustomerId])
REFERENCES [dbo].[B20Customer]([Id])
ON DELETE RESTRICT ON UPDATE CASCADE;
GO

-- SET NULL (optional reference)
ALTER TABLE [dbo].[B20Employee]
ADD CONSTRAINT [FK_B20Employee_B20Employee_Manager]
FOREIGN KEY ([ManagerId])
REFERENCES [dbo].[B20Employee]([Id])
ON DELETE SET NULL ON UPDATE CASCADE;
GO
```

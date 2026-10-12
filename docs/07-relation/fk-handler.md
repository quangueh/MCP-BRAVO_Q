# Foreign Key Handler

## Detection
1. Explicit FK from _foreign_keys.json (confidence: 100%)
2. Name-based inference (confidence: 50-80%)

## Naming: FK_{Source}_{Target} (max 128 chars)

## Generation Template
```sql
ALTER TABLE [{Source}]
ADD CONSTRAINT [{FKName}]
FOREIGN KEY ([{Column}])
REFERENCES [{Target}]([{TargetColumn}])
ON DELETE {Action} ON UPDATE {Action};
GO
```

## Cascade Actions

| Scenario | ON DELETE | ON UPDATE |
|----------|-----------|-----------|
| Child/detail tables | CASCADE | CASCADE |
| Reference/lookup | RESTRICT | CASCADE |
| Optional (nullable FK) | SET NULL | CASCADE |
| Audit columns | NO ACTION | NO ACTION |

## Examples

```sql
-- CASCADE for child table
ALTER TABLE [dbo].[B10BudgetConsDetail]
ADD CONSTRAINT [FK_B10BudgetConsDetail_B10BudgetCons]
FOREIGN KEY ([BudgetConsId])
REFERENCES [dbo].[B10BudgetCons]([Id])
ON DELETE CASCADE ON UPDATE CASCADE;

-- RESTRICT for reference table
ALTER TABLE [dbo].[B20Order]
ADD CONSTRAINT [FK_B20Order_B20Customer]
FOREIGN KEY ([CustomerId])
REFERENCES [dbo].[B20Customer]([Id])
ON DELETE RESTRICT ON UPDATE CASCADE;

-- SET NULL for optional reference
ALTER TABLE [dbo].[B20Employee]
ADD CONSTRAINT [FK_B20Employee_B20Employee_Manager]
FOREIGN KEY ([ManagerId])
REFERENCES [dbo].[B20Employee]([Id])
ON DELETE SET NULL ON UPDATE CASCADE;
```

## Index on FK Column
Every FK column gets a supporting index:
```sql
CREATE NONCLUSTERED INDEX [IX_{Table}_{FKColumn}]
ON [{Table}] ([{FKColumn}] ASC);
```

## Validation
1. Source table exists
2. Target table exists
3. Columns exist in respective tables
4. Data types match
5. No duplicate FKs
6. FK name unique and <= 128 chars

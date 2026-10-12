# Naming Conventions

## Overview

All database objects in Bravo ERP follow consistent naming patterns. The BLG tool must adhere to these conventions when auto-generating database objects.

---

## Table Naming

### Pattern

```
B{Prefix}{Name}
```

### Rules

- **Prefix**: Two-digit domain prefix (B00, B10, B20, B30)
- **Name**: PascalCase, no underscores, no spaces
- **Examples**: B20Customer, B30BizDoc, B10ChartOfAcc

### Domain Prefixes

| Prefix | Domain |
|---|---|
| B00 | System configuration |
| B10 | Accounting / Financial |
| B20 | Master data |
| B30 | Transaction data |

---

## Column Naming

### Pattern

```
PascalCase
```

### Rules

- Always PascalCase, no underscores
- Boolean columns prefixed with `Is` (e.g., IsActive, IsDefault)
- Foreign key columns end with `Id` (e.g., ProductId, CustomerId)
- Code columns use plain name (e.g., Code, Name)

---

## Audit Columns

Every table must include these audit columns:

```sql
IsActive      BIT            NOT NULL DEFAULT 1
CreatedBy     NVARCHAR(50)   NULL
CreatedDate   DATETIME       NULL DEFAULT GETDATE()
ModifiedBy    NVARCHAR(50)   NULL
ModifiedDate  DATETIME       NULL
```

### Notes

- `IsActive`: Soft-delete flag. 1 = active, 0 = deleted
- `CreatedBy`/`ModifiedBy`: Store the username (not user Id)
- `CreatedDate`: Set once on insert
- `ModifiedDate`: Updated on each modification

---

## Primary Key

### Pattern

```
Id INT IDENTITY(1,1) NOT NULL PRIMARY KEY
```

### Rules

- Every table has a single `Id` column
- Type: `INT IDENTITY(1,1)`
- Constraint: `PK_{TableName}` (e.g., `PK_B20Customer`)

### Example

```sql
ALTER TABLE B20Customer
ADD CONSTRAINT PK_B20Customer PRIMARY KEY (Id);
```

---

## Foreign Key Naming

### Pattern

```
FK_{SourceTable}_{TargetTable}
```

### Rules

- No `B` prefix on either table name in the constraint name
- Source = table containing the FK column
- Target = table being referenced

### Examples

```sql
ALTER TABLE B30BudgetCons
ADD CONSTRAINT FK_BudgetCons_Product
FOREIGN KEY (ProductId) REFERENCES B20Product(Id);

ALTER TABLE B30BudgetConsDetail
ADD CONSTRAINT FK_BudgetConsDetail_BudgetCons
FOREIGN KEY (BudgetConsId) REFERENCES B30BudgetCons(Id);
```

---

## Index Naming

### Pattern

```
IX_{TableName}_{Column1}_{Column2}
```

### Rules

- Single column: `IX_B20Customer_Code`
- Composite: `IX_B30BizDoc_ProductId_CustomerId`
- Unique index: `UIX_{TableName}_{Column}` (e.g., `UIX_B20Customer_Code`)

### Examples

```sql
-- Unique index on Code
CREATE UNIQUE INDEX UIX_B20Customer_Code ON B20Customer(Code);

-- Non-unique index on FK column
CREATE INDEX IX_B30BizDoc_ProductId ON B30BizDoc(ProductId);

-- Composite index
CREATE INDEX IX_B30BizDoc_ProductId_CustomerId ON B30BizDoc(ProductId, CustomerId);
```

---

## Stored Procedure Naming

### Pattern

```
usp_{Module}_{Action}
```

### Rules

- Prefix: `usp_` (user stored procedure)
- Module: Matches table or feature area (e.g., Customer, BizDoc, BudgetCons)
- Action: Operation type (Select, Insert, Update, Delete, BaoCao)

### Examples

```sql
usp_Customer_Select
usp_Customer_Insert
usp_Customer_Update
usp_Customer_Delete
usp_CCM_BaoCaoTongHopThucHienNganSachCongTruong_HangMuc_KeToan
```

### Action Suffixes

| Suffix | Purpose |
|---|---|
| Select | Retrieve data |
| Insert | Create new record |
| Update | Modify existing record |
| Delete | Soft-delete record |
| BaoCao{ReportName} | Report generation |

---

## View Naming

### Pattern

```
v{Prefix}{Name}
```

### Rules

- Prefix: `v` (lowercase)
- Rest follows table naming convention
- Examples: vB20Customer, vB30BizDoc

---

## Summary Table

| Object | Pattern | Example |
|---|---|---|
| Table | B{Prefix}{Name} | B20Customer |
| Column | PascalCase | ProductId |
| Primary Key | PK_{Table} | PK_B20Customer |
| Foreign Key | FK_{Source}_{Target} | FK_BudgetCons_Product |
| Index | IX_{Table}_{Column} | IX_B20Customer_Code |
| Unique Index | UIX_{Table}_{Column} | UIX_B20Customer_Code |
| Stored Procedure | usp_{Module}_{Action} | usp_Customer_Select |
| View | v{Prefix}{Name} | vB20Customer |

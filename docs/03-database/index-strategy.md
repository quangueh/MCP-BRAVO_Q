# Index Strategy

## Overview

BLG auto-generates indexes based on column patterns. This document defines the rules for index creation, naming, and the decision logic for which columns to index.

---

## Auto-Generation Rules

### Rule 1: Unique Index on Code Columns

Every table with a `Code` column gets a unique index.

```sql
-- Auto-generated for every B20 master data table
CREATE UNIQUE INDEX UIX_{TableName}_Code ON {TableName}(Code);
```

**Condition**: Column named `Code` exists in the table.

**Examples**:
```sql
CREATE UNIQUE INDEX UIX_B20Customer_Code ON B20Customer(Code);
CREATE UNIQUE INDEX UIX_B20Vendor_Code ON B20Vendor(Code);
CREATE UNIQUE INDEX UIX_B20Product_Code ON B20Product(Code);
CREATE UNIQUE INDEX UIX_B20Warehouse_Code ON B20Warehouse(Code);
CREATE UNIQUE INDEX UIX_B20ClassInfo_Code ON B20ClassInfo(Code);
CREATE UNIQUE INDEX UIX_B20JobRCC_Code ON B20JobRCC(Code);
```

---

### Rule 2: Index on Every FK Column

Every foreign key column gets a non-unique index for JOIN performance.

```sql
-- Auto-generated for every FK column
CREATE INDEX IX_{TableName}_{ColumnName} ON {TableName}({ColumnName});
```

**Condition**: Column ends with `Id` and is not the primary key `Id`.

**Examples**:
```sql
CREATE INDEX IX_B30BudgetCons_ProductId ON B30BudgetCons(ProductId);
CREATE INDEX IX_B30BudgetCons_CustomerId ON B30BudgetCons(CustomerId);
CREATE INDEX IX_B30BizDoc_ProductId ON B30BizDoc(ProductId);
CREATE INDEX IX_B30BizDoc_CustomerId ON B30BizDoc(CustomerId);
CREATE INDEX IX_B30BillDoc_BizDocId ON B30BillDoc(BizDocId);
CREATE INDEX IX_B30AccDoc_BillDocId ON B30AccDoc(BillDocId);
CREATE INDEX IX_B30BudgetConsDetail_BudgetConsId ON B30BudgetConsDetail(BudgetConsId);
CREATE INDEX IX_B20ClassInfo_ParentId ON B20ClassInfo(ParentId);
CREATE INDEX IX_B20JobRCC_ParentId ON B20JobRCC(ParentId);
```

---

### Rule 3: Composite Index on Common Query Combinations

When a table is commonly queried by multiple columns together, generate a composite index.

```sql
-- Composite index for multi-column filters
CREATE INDEX IX_{TableName}_{Col1}_{Col2}
ON {TableName}({Col1}, {Col2});
```

**Condition**: Manually specified or detected from SP WHERE clauses.

**Examples**:
```sql
CREATE INDEX IX_B30BizDoc_ProductId_CustomerId ON B30BizDoc(ProductId, CustomerId);
CREATE INDEX IX_B30BizDoc_DocDate_DocStatus ON B30BizDoc(DocDate, DocStatus);
CREATE INDEX IX_B30BudgetCons_ProductId_CustomerId ON B30BudgetCons(ProductId, CustomerId);
CREATE INDEX IX_B30AccDoc_DocDate ON B30AccDoc(DocDate);
```

---

### Rule 4: No Index on IsActive Alone

`IsActive` has very low selectivity (only 0 or 1 values) and should never be indexed alone.

**Bad** (do NOT generate):
```sql
-- LOW SELECTIVITY - DO NOT CREATE
CREATE INDEX IX_B20Customer_IsActive ON B20Customer(IsActive);
```

**Good** (use in composite index only):
```sql
-- Acceptable in a composite index with high-selectivity columns
CREATE INDEX IX_B30BizDoc_DocStatus_IsActive ON B30BizDoc(DocStatus, IsActive);
```

---

## Naming Conventions

| Index Type | Pattern | Example |
|---|---|---|
| Unique (single column) | UIX_{Table}_{Column} | UIX_B20Customer_Code |
| Unique (composite) | UIX_{Table}_{Col1}_{Col2} | UIX_B20Inventory_ProductId_WarehouseId |
| Non-unique (single) | IX_{Table}_{Column} | IX_B30BizDoc_ProductId |
| Non-unique (composite) | IX_{Table}_{Col1}_{Col2} | IX_B30BizDoc_ProductId_CustomerId |
| Clustered | CIX_{Table}_{Column} | CIX_B30BizDoc_DocDate |

---

## Index Generation Algorithm

```
FOR each generated table:
    1. IF table has 'Code' column:
       CREATE UNIQUE INDEX UIX_{Table}_Code

    2. FOR each column ending in 'Id' (excluding primary 'Id'):
       CREATE INDEX IX_{Table}_{Column}

    3. IF table has composite query patterns:
       CREATE INDEX IX_{Table}_{Col1}_{Col2}

    4. SKIP indexing IsActive alone
```

---

## Example: Complete Index Set for B30BizDoc

```sql
-- Unique index on Code (if exists)
CREATE UNIQUE INDEX UIX_B30BizDoc_Code ON B30BizDoc(Code);

-- FK indexes
CREATE INDEX IX_B30BizDoc_ProductId ON B30BizDoc(ProductId);
CREATE INDEX IX_B30BizDoc_CustomerId ON B30BizDoc(CustomerId);
CREATE INDEX IX_B30BizDoc_WarehouseId ON B30BizDoc(WarehouseId);
CREATE INDEX IX_B30BizDoc_EmployeeId ON B30BizDoc(EmployeeId);
CREATE INDEX IX_B30BizDoc_BranchId ON B30BizDoc(BranchId);

-- Composite indexes for common queries
CREATE INDEX IX_B30BizDoc_DocDate_DocStatus ON B30BizDoc(DocDate, DocStatus);
CREATE INDEX IX_B30BizDoc_ProductId_CustomerId ON B30BizDoc(ProductId, CustomerId);
```

---

## Performance Notes

- Indexes speed up SELECT queries but slow down INSERT/UPDATE
- Aim for 3-6 indexes per table (excluding PK)
- Monitor index usage with `sys.dm_db_index_usage_stats`
- Rebuild indexes periodically when fragmentation exceeds 30%
- Consider filtered indexes for large tables with common WHERE conditions

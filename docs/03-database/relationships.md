# Relationships

## Overview

Bravo ERP database relationships form a directed acyclic graph flowing from master data to transaction data. This document maps all known foreign key relationships and their patterns.

---

## Primary Relationships

### Master to Transaction

These are the core business relationships connecting master data tables (B20) to transaction tables (B30).

| Foreign Key | Source Column | Target Table | Target Column | Cardinality |
|---|---|---|---|---|
| FK_BudgetCons_Product | B30BudgetCons.ProductId | B20Product | Id | Many-to-One |
| FK_BudgetCons_Customer | B30BudgetCons.CustomerId | B20Customer | Id | Many-to-One |
| FK_BizDoc_Product | B30BizDoc.ProductId | B20Product | Id | Many-to-One |
| FK_BizDoc_Customer | B30BizDoc.CustomerId | B20Customer | Id | Many-to-One |

### Transaction to Transaction (Document Chain)

These relationships form the document flow from business documents to billing to accounting.

| Foreign Key | Source Column | Target Table | Target Column | Cardinality |
|---|---|---|---|---|
| FK_BudgetConsDetail_BudgetCons | B30BudgetConsDetail.BudgetConsId | B30BudgetCons | Id | Many-to-One |
| FK_BillDoc_BizDoc | B30BillDoc.BizDocId | B30BizDoc | Id | Many-to-One |
| FK_AccDoc_BillDoc | B30AccDoc.BillDocId | B30BillDoc | Id | Many-to-One |

---

## Document Flow Chain

```
B30BizDoc (Business Document)
    |
    +-- B30BizDocDetail (Document Lines)
    |
    v
B30BillDoc (Billing Document)
    |
    +-- B30BillDocDetail (Billing Lines)
    |
    v
B30AccDoc (Accounting Document)
    |
    +-- B30AccDocDetail (Accounting Lines)
```

---

## Self-Referencing Relationships

Several master data tables use hierarchical (parent-child) structures via self-referencing foreign keys.

### B20ClassInfo (Classification Hierarchy)

```sql
ALTER TABLE B20ClassInfo
ADD CONSTRAINT FK_ClassInfo_ParentClassInfo
FOREIGN KEY (ParentId) REFERENCES B20ClassInfo(Id);
```

- Used for: Account categories, product categories, project classifications
- Tree depth: Typically 3-5 levels
- Root nodes have `ParentId = NULL`

### B20JobRCC (Project/Job Hierarchy)

```sql
ALTER TABLE B20JobRCC
ADD CONSTRAINT FK_JobRCC_ParentJobRCC
FOREIGN KEY (ParentId) REFERENCES B20JobRCC(Id);
```

- Used for: Project work breakdown structure (WBS)
- Tree depth: Typically 2-4 levels
- Root nodes have `ParentId = NULL`

### B10ChartOfAcc (Chart of Accounts)

```sql
ALTER TABLE B10ChartOfAcc
ADD CONSTRAINT FK_ChartOfAcc_ParentChartOfAcc
FOREIGN KEY (ParentId) REFERENCES B10ChartOfAcc(Id);
```

- Used for: Account hierarchy (Assets > Current Assets > Cash)
- Tree depth: Typically 4-6 levels

---

## Dependency Graph

### Layer 1: Configuration (No dependencies)

```
B00SysConfig
B00Users
B00Branch
B00ModuleConfig -> B00Branch
```

### Layer 2: Accounting Setup (Depends on Layer 1)

```
B10AccYear -> B00Branch
B10AccPeriod -> B10AccYear
B10Currency
B10Tax
B10ChartOfAcc -> B10ChartOfAcc (self)
```

### Layer 3: Master Data (Depends on Layers 1-2)

```
B20Customer
B20Vendor
B20Product -> B20ClassInfo
B20Warehouse
B20ClassInfo -> B20ClassInfo (self)
B20JobRCC -> B20JobRCC (self)
B20Employee -> B20ClassInfo
B20Unit
B20Inventory -> B20Product, B20Warehouse
```

### Layer 4: Transactions (Depends on all above)

```
B30BudgetCons -> B20Product, B20Customer
B30BudgetConsDetail -> B30BudgetCons
B30BizDoc -> B20Product, B20Customer
B30BizDocDetail -> B30BizDoc, B20Product
B30BillDoc -> B30BizDoc
B30BillDocDetail -> B30BillDoc, B20Product
B30AccDoc -> B30BillDoc
B30AccDocDetail -> B30AccDoc, B10ChartOfAcc
```

---

## Generation Rules

When BLG generates new tables, the following FK rules apply:

1. **Every FK column must have a corresponding FK constraint**
2. **FK naming**: `FK_{SourceTableNoB}_{TargetTableNoB}`
3. **FK columns are always INT type** referencing the target table's `Id` column
4. **ON DELETE**: Use NO ACTION (prevent accidental cascade deletes)
5. **ON UPDATE**: Use NO ACTION (Id values should never change)
6. **Nullable FK**: Allowed when the relationship is optional
7. **Non-nullable FK**: Required when the relationship is mandatory

---

## Cardinality Summary

| Relationship Type | Count | Pattern |
|---|---|---|
| Many-to-One (FK to master) | ~45 | Transaction references master data |
| One-to-Many (master to detail) | ~20 | Header to detail lines |
| Self-referencing | 3 | Hierarchical tree structures |
| Many-to-Many (via junction) | ~5 | Through junction/detail tables |

# Column Patterns

## Overview

Bravo ERP tables use a consistent set of column patterns. BLG must apply these patterns when generating new tables or mapping existing columns to UI controls.

---

## Pattern 1: Identity Primary Key

Every table uses an auto-incrementing integer primary key.

```sql
Id INT IDENTITY(1,1) NOT NULL
CONSTRAINT PK_{TableName} PRIMARY KEY (Id)
```

| Property | Value |
|---|---|
| Name | Id |
| Type | INT |
| Nullable | NOT NULL |
| Identity | IDENTITY(1,1) |
| Constraint | PK_{TableName} |

**Generation rule**: Always generate as the first column of every table.

---

## Pattern 2: Audit Columns

Every table includes five audit columns for tracking record lifecycle.

```sql
IsActive      BIT          NOT NULL DEFAULT 1
CreatedBy     NVARCHAR(50) NULL
CreatedDate   DATETIME     NULL DEFAULT GETDATE()
ModifiedBy    NVARCHAR(50) NULL
ModifiedDate  DATETIME     NULL
```

| Column | Type | Default | Purpose |
|---|---|---|---|
| IsActive | BIT | 1 | Soft-delete flag (1=active, 0=deleted) |
| CreatedBy | NVARCHAR(50) | NULL | Username who created the record |
| CreatedDate | DATETIME | GETDATE() | Timestamp of creation |
| ModifiedBy | NVARCHAR(50) | NULL | Username who last modified |
| ModifiedDate | DATETIME | NULL | Timestamp of last modification |

**Generation rule**: Append as the last five columns of every table.

---

## Pattern 3: Foreign Key Reference

Foreign key columns reference other tables by their `Id` column.

```sql
ProductId    INT    NULL     -- References B20Product(Id)
CustomerId   INT    NOT NULL -- References B20Customer(Id)
```

### Naming Rules

| Column Name | References | Nullable |
|---|---|---|
| ProductId | B20Product.Id | Depends on requirement |
| CustomerId | B20Customer.Id | Depends on requirement |
| VendorId | B20Vendor.Id | Depends on requirement |
| WarehouseId | B20Warehouse.Id | Depends on requirement |
| EmployeeId | B20Employee.Id | Depends on requirement |
| BranchId | B00Branch.Id | Depends on requirement |
| ParentId | Same table (self-ref) | NULL for root nodes |
| BudgetConsId | B30BudgetCons.Id | NOT NULL (detail must have header) |
| BizDocId | B30BizDoc.Id | NOT NULL |

**Generation rule**: Generate FK column + FK constraint + Index on the column.

---

## Pattern 4: Status Columns

Document and record status tracking.

```sql
DocStatus    INT    NOT NULL DEFAULT 1
```

### Status Values

| Value | Meaning | Description |
|---|---|---|
| 1 | Draft | Newly created, editable |
| 2 | Active | Submitted, limited editing |
| 3 | Pending | Awaiting approval |
| 4 | Approved | Approved by authority |
| 5 | Rejected | Rejected, needs revision |
| 6 | Closed | Completed, no changes allowed |
| 9 | Cancelled | Voided |

**Generation rule**: Add DocStatus INT NOT NULL DEFAULT 1 to document tables (B30 prefix).

---

## Pattern 5: Code Columns

Unique business codes for master data identification.

```sql
Code    VARCHAR(50)    NOT NULL
```

| Property | Value |
|---|---|
| Type | VARCHAR(50) |
| Nullable | NOT NULL |
| Unique | Yes (via UNIQUE index) |
| Pattern | Alphanumeric, business-defined format |

### Index

```sql
CREATE UNIQUE INDEX UIX_{TableName}_Code ON {TableName}(Code);
```

**Generation rule**: Add Code VARCHAR(50) NOT NULL to master data tables (B20 prefix). Generate unique index.

---

## Pattern 6: Amount Columns

Financial and quantity columns use high-precision decimal types.

```sql
Amount       DECIMAL(18,2)  NOT NULL DEFAULT 0
Quantity     DECIMAL(18,4)  NOT NULL DEFAULT 0
Price        DECIMAL(18,4)  NOT NULL DEFAULT 0
ExchangeRate DECIMAL(18,6)  NOT NULL DEFAULT 1
```

| Column Purpose | Type | Default | Precision |
|---|---|---|---|
| Money/Amount | DECIMAL(18,2) | 0 | 2 decimal places |
| Quantity | DECIMAL(18,4) | 0 | 4 decimal places |
| Unit Price | DECIMAL(18,4) | 0 | 4 decimal places |
| Exchange Rate | DECIMAL(18,6) | 1 | 6 decimal places |
| Tax Rate | DECIMAL(18,2) | 0 | 2 decimal places |
| Percentage | DECIMAL(18,2) | 0 | 2 decimal places |

**Generation rule**: Always use DECIMAL, never FLOAT or REAL for financial data.

---

## Pattern 7: Description Columns

Multi-language text fields use NVARCHAR.

```sql
Name         NVARCHAR(255)  NOT NULL
Description  NVARCHAR(500)  NULL
Note         NVARCHAR(MAX)  NULL
Address      NVARCHAR(500)  NULL
```

| Column | Type | Nullable | Purpose |
|---|---|---|---|
| Name | NVARCHAR(255) | NOT NULL | Primary display name |
| Description | NVARCHAR(500) | NULL | Extended description |
| Note | NVARCHAR(MAX) | NULL | Free-text notes |
| Address | NVARCHAR(500) | NULL | Physical address |
| TaxCode | VARCHAR(20) | NULL | Tax identification number |
| Phone | VARCHAR(20) | NULL | Phone number |
| Email | VARCHAR(100) | NULL | Email address |

**Generation rule**: Always use NVARCHAR (not VARCHAR) for text that may contain Unicode characters (Vietnamese diacritics).

---

## Column Type Quick Reference

| Business Concept | SQL Type | BLG Default |
|---|---|---|
| Primary Key | INT IDENTITY(1,1) | Always |
| Foreign Key | INT | With FK constraint |
| Code | VARCHAR(50) | With UNIQUE index |
| Name | NVARCHAR(255) | NOT NULL |
| Description | NVARCHAR(500) | NULL |
| Amount | DECIMAL(18,2) | DEFAULT 0 |
| Quantity | DECIMAL(18,4) | DEFAULT 0 |
| Price | DECIMAL(18,4) | DEFAULT 0 |
| Date | DATE | NULL |
| DateTime | DATETIME | NULL |
| Status | INT | DEFAULT 1 |
| Boolean Flag | BIT | DEFAULT 0 or 1 |
| IsActive | BIT | DEFAULT 1 |

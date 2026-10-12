# View Patterns

## Overview

Bravo ERP uses 1,593 views in the Bravo_Config database. This document catalogs the common view patterns that BLG may reference or generate.

---

## Pattern 1: Master Data Views

Denormalized views of master data for display in grids and lookups.

### Naming Convention

```
v{Prefix}{Name}
```

### Example: Customer View

```sql
CREATE VIEW [dbo].[vB20Customer]
AS
SELECT
    c.Id,
    c.Code,
    c.Name,
    c.TaxCode,
    c.Address,
    c.Phone,
    c.Email,
    c.IsActive,
    c.CreatedBy,
    c.CreatedDate,
    c.ModifiedBy,
    c.ModifiedDate,
    -- Denormalized lookup fields
    ci.Name AS ClassName,
    br.Name AS BranchName
FROM B20Customer c
LEFT JOIN B20ClassInfo ci ON ci.Id = c.ClassId
LEFT JOIN B00Branch br ON br.Id = c.BranchId
WHERE c.IsActive = 1;
```

### Example: Product View

```sql
CREATE VIEW [dbo].[vB20Product]
AS
SELECT
    p.Id,
    p.Code,
    p.Name,
    p.Unit,
    p.CategoryId,
    ci.Name AS CategoryName,
    p.IsActive,
    p.CreatedBy,
    p.CreatedDate,
    p.ModifiedBy,
    p.ModifiedDate
FROM B20Product p
LEFT JOIN B20ClassInfo ci ON ci.Id = p.CategoryId
WHERE p.IsActive = 1;
```

### Generation Rules

- Include all columns from the base table
- LEFT JOIN to lookup tables for Name/Code display
- Filter by `IsActive = 1` to exclude soft-deleted records
- Alias lookup columns as `{LookupName}Name` or `{LookupName}Code`

---

## Pattern 2: Transaction Views

Views that join transaction tables with master data for comprehensive display.

### Example: Business Document View

```sql
CREATE VIEW [dbo].[vB30BizDoc]
AS
SELECT
    bd.Id,
    bd.DocDate,
    bd.Code,
    bd.DocStatus,
    -- Product fields
    bd.ProductId,
    p.Code AS ProductCode,
    p.Name AS ProductName,
    -- Customer fields
    bd.CustomerId,
    c.Code AS CustomerCode,
    c.Name AS CustomerName,
    -- Amounts
    bd.Amount,
    bd.Quantity,
    bd.Price,
    -- Audit
    bd.IsActive,
    bd.CreatedBy,
    bd.CreatedDate,
    bd.ModifiedBy,
    bd.ModifiedDate
FROM B30BizDoc bd
LEFT JOIN B20Product p ON p.Id = bd.ProductId
LEFT JOIN B20Customer c ON c.Id = bd.CustomerId
WHERE bd.IsActive = 1;
```

### Example: Business Document Detail View

```sql
CREATE VIEW [dbo].[vB30BizDocDetail]
AS
SELECT
    bdd.Id,
    bdd.BizDocId,
    bdd.ProductId,
    p.Code AS ProductCode,
    p.Name AS ProductName,
    bdd.Quantity,
    bdd.Price,
    bdd.Amount,
    bdd.Note
FROM B30BizDocDetail bdd
LEFT JOIN B20Product p ON p.Id = bdd.ProductId
WHERE bdd.IsActive = 1;
```

### Generation Rules

- JOIN to all referenced master tables
- Include both FK Id and display Code/Name columns
- Filter parent table's IsActive = 1

---

## Pattern 3: Report Views

Pre-aggregated views optimized for report rendering.

### Example: Budget Summary View

```sql
CREATE VIEW [dbo].[vBudgetSummary]
AS
SELECT
    bc.ProductId,
    p.Code AS ProductCode,
    p.Name AS ProductName,
    bc.CustomerId,
    c.Code AS CustomerCode,
    c.Name AS CustomerName,
    bc.YearId,
    SUM(bcd.Amount) AS TotalBudget,
    COUNT(bcd.Id) AS LineCount
FROM B30BudgetCons bc
INNER JOIN B30BudgetConsDetail bcd ON bcd.BudgetConsId = bc.Id
INNER JOIN B20Product p ON p.Id = bc.ProductId
INNER JOIN B20Customer c ON c.Id = bc.CustomerId
WHERE bc.IsActive = 1
GROUP BY
    bc.ProductId, p.Code, p.Name,
    bc.CustomerId, c.Code, c.Name,
    bc.YearId;
```

### Generation Rules

- Pre-aggregate commonly needed summaries
- Include GROUP BY on all non-aggregated columns
- Use SUM, COUNT, AVG, MIN, MAX as appropriate
- JOIN to master tables for display codes/names

---

## Pattern 4: Status Views

Views that present document status with workflow context.

### Example: Document Status View

```sql
CREATE VIEW [dbo].[vDocumentStatus]
AS
SELECT
    bd.Id,
    bd.Code,
    bd.DocDate,
    bd.DocStatus,
    CASE bd.DocStatus
        WHEN 1 THEN 'Draft'
        WHEN 2 THEN 'Active'
        WHEN 3 THEN 'Pending'
        WHEN 4 THEN 'Approved'
        WHEN 5 THEN 'Rejected'
        WHEN 6 THEN 'Closed'
        WHEN 9 THEN 'Cancelled'
        ELSE 'Unknown'
    END AS StatusText,
    bd.ModifiedBy AS LastModifiedBy,
    bd.ModifiedDate AS LastModifiedDate
FROM B30BizDoc bd
WHERE bd.IsActive = 1;
```

### Generation Rules

- Map numeric status values to descriptive text
- Include workflow-relevant columns
- Filter out inactive records

---

## Pattern 5: Summary Views

Views with COUNT, SUM aggregations for dashboard/KPI display.

### Example: Document Count by Status

```sql
CREATE VIEW [dbo].[vDocCountByStatus]
AS
SELECT
    'BizDoc' AS DocType,
    DocStatus,
    COUNT(*) AS DocCount,
    SUM(Amount) AS TotalAmount
FROM B30BizDoc
WHERE IsActive = 1
GROUP BY DocStatus;
```

### Example: Monthly Summary

```sql
CREATE VIEW [dbo].[vMonthlyDocSummary]
AS
SELECT
    YEAR(DocDate) AS DocYear,
    MONTH(DocDate) AS DocMonth,
    COUNT(*) AS DocCount,
    SUM(Amount) AS TotalAmount,
    AVG(Amount) AS AvgAmount
FROM B30BizDoc
WHERE IsActive = 1
GROUP BY YEAR(DocDate), MONTH(DocDate);
```

---

## View Generation Algorithm

```
FOR each table:
    1. Generate base master data view (Pattern 1)
       - JOIN all FK references
       - Include display columns

    2. If table has detail tables:
       Generate transaction view (Pattern 2)
       - JOIN header + detail + master data

    3. If table is commonly aggregated:
       Generate report view (Pattern 3)
       - GROUP BY + SUM/COUNT

    4. If table has DocStatus:
       Generate status view (Pattern 4)
       - CASE WHEN for status text

    5. If table is large:
       Generate summary view (Pattern 5)
       - Pre-aggregated for dashboard
```

---

## View Naming Summary

| Pattern | Prefix | Example |
|---|---|---|
| Master data | v{Prefix}{Name} | vB20Customer |
| Transaction | v{Prefix}{Name} | vB30BizDoc |
| Report | v{ReportTopic} | vBudgetSummary |
| Status | v{Topic}Status | vDocumentStatus |
| Summary | v{Topic}Summary | vMonthlyDocSummary |

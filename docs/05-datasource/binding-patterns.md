# DataSource Binding Patterns

## Overview

DataSource binding defines how layout controls connect to database objects. There are 5 binding patterns, each suited for different scenarios.

---

## Pattern 1: SP Binding (Most Common)

The most common pattern. The SourceCollection references a stored procedure name.

### When to Use

- Reports with complex filtering logic
- Data retrieval requiring temp tables or aggregations
- Cross-table queries with business logic
- Any query that cannot be expressed as a simple SELECT

### XML Example

```xml
<DataSource>
    <TableCollection>
        <Ct Name="BudgetReport" Source="usp_CCM_BaoCaoTongHopThucHienNganSachCongTruong_HangMuc_KeToan" Type="StoredProcedure">
            <Parameters>
                <Parameter Name="_DocDate" DbType="DATE" Direction="OUTPUT" />
                <Parameter Name="_ProductId" DbType="INT" Direction="INPUT" />
                <Parameter Name="_nUserId" DbType="INT" Direction="INPUT" />
                <Parameter Name="_BranchCode" DbType="VARCHAR(3)" Direction="INPUT" />
            </Parameters>
        </Ct>
    </TableCollection>
</DataSource>
```

### Generation Rules

1. Set `Type="StoredProcedure"` on the Ct element
2. Set `Source` to the SP name
3. Define `<Parameters>` matching the SP parameters
4. Set `Direction` for INPUT/OUTPUT parameters
5. Map default values for OUTPUT parameters

---

## Pattern 2: View Binding

Source references a database view name.

### When to Use

- Simple data retrieval with JOINs already defined in the view
- Master data display with denormalized lookup fields
- When the view already contains all needed columns

### XML Example

```xml
<DataSource>
    <TableCollection>
        <Ct Name="Customer" Source="vB20Customer" Type="View">
            <Columns>
                <Column Name="Id" DbType="INT" IsPK="true" />
                <Column Name="Code" DbType="VARCHAR(50)" />
                <Column Name="Name" DbType="NVARCHAR(255)" />
                <Column Name="ClassName" DbType="NVARCHAR(255)" />
            </Columns>
        </Ct>
    </TableCollection>
</DataSource>
```

### Generation Rules

1. Set `Type="View"` on the Ct element
2. Set `Source` to the view name (prefixed with `v`)
3. Columns are automatically available from the view
4. No parameter definitions needed

---

## Pattern 3: Direct Table

Source is the table name directly.

### When to Use

- Simple CRUD operations on a single table
- When no JOINs or complex logic is needed
- Quick lookup data sources

### XML Example

```xml
<DataSource>
    <TableCollection>
        <Ct Name="Customer" Source="B20Customer" Type="Table">
            <Columns>
                <Column Name="Id" DbType="INT" IsPK="true" IsIdentity="true" />
                <Column Name="Code" DbType="VARCHAR(50)" />
                <Column Name="Name" DbType="NVARCHAR(255)" />
                <Column Name="IsActive" DbType="BIT" />
            </Columns>
        </Ct>
    </TableCollection>
    <CommandCollection>
        <Command Name="InsertCustomer" Type="INSERT">
            <Text>INSERT INTO B20Customer (Code, Name) VALUES (@Code, @Name)</Text>
            <Parameters>
                <Parameter Name="Code" DbType="VARCHAR(50)" SourceColumn="Code" />
                <Parameter Name="Name" DbType="NVARCHAR(255)" SourceColumn="Name" />
            </Parameters>
        </Command>
    </CommandCollection>
</DataSource>
```

### Generation Rules

1. Set `Type="Table"` on the Ct element
2. Set `Source` to the full table name
3. Define all columns explicitly
4. Must provide CommandCollection for CRUD operations
5. Auto-generate INSERT, UPDATE, DELETE commands

---

## Pattern 4: CTE Binding

SourceCollection contains a WITH clause (Common Table Expression).

### When to Use

- Recursive queries (hierarchical data)
- Multi-step data transformations
- Complex aggregations requiring intermediate results

### XML Example

```xml
<DataSource>
    <SourceCollection>
        <Source Name="CTE_Hierarchy">
            <Text>
                WITH CTE AS (
                    SELECT Id, Code, Name, ParentId, 0 AS Level
                    FROM B20ClassInfo
                    WHERE ParentId IS NULL
                    UNION ALL
                    SELECT c.Id, c.Code, c.Name, c.ParentId, Level + 1
                    FROM B20ClassInfo c
                    INNER JOIN CTE ON c.ParentId = CTE.Id
                )
                SELECT * FROM CTE
            </Text>
        </Source>
    </SourceCollection>
</DataSource>
```

### Generation Rules

1. Identify self-referencing tables (ParentId column)
2. Generate recursive CTE with base case and recursive case
3. Include `Level` column for indentation
4. Use `UNION ALL` for performance

---

## Pattern 5: Sub-query Binding

SourceCollection contains a nested SELECT statement.

### When to Use

- Aggregated summary data
- Filtered subsets of data
- Derived columns from multiple tables

### XML Example

```xml
<DataSource>
    <SourceCollection>
        <Source Name="BudgetSummary">
            <Text>
                SELECT
                    p.Code AS ProductCode,
                    p.Name AS ProductName,
                    c.Code AS CustomerCode,
                    c.Name AS CustomerName,
                    SUM(bcd.Amount) AS TotalBudget
                FROM B30BudgetCons bc
                INNER JOIN B30BudgetConsDetail bcd ON bcd.BudgetConsId = bc.Id
                INNER JOIN B20Product p ON p.Id = bc.ProductId
                INNER JOIN B20Customer c ON c.Id = bc.CustomerId
                WHERE bc.IsActive = 1
                GROUP BY p.Code, p.Name, c.Code, c.Name
            </Text>
        </Source>
    </SourceCollection>
</DataSource>
```

### Generation Rules

1. Analyze the query requirements
2. Build SELECT with appropriate JOINs
3. Add WHERE clause for IsActive = 1
4. Add GROUP BY for aggregations
5. Alias columns to match layout DataMember names

---

## Pattern Selection Guide

| Scenario | Recommended Pattern |
|---|---|
| Simple CRUD | Direct Table |
| Display with lookups | View Binding |
| Report with parameters | SP Binding |
| Hierarchy/tree view | CTE Binding |
| Aggregated summary | Sub-query Binding |
| Complex business logic | SP Binding |
| Cross-table queries | View or SP Binding |

---

## Binding Priority

When multiple patterns could work, prefer in this order:

1. **SP Binding** - Most flexible, best performance
2. **View Binding** - Clean separation, reusable
3. **Direct Table** - Simplest, for basic CRUD
4. **CTE Binding** - For hierarchical data only
5. **Sub-query Binding** - Last resort for complex queries

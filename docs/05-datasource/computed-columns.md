# Computed Column Patterns

## Overview

TempColumns in DataSource XML define virtual/computed columns that are calculated at runtime. These columns do not exist in the database but are derived from other column values.

---

## Pattern 1: Concatenation

Combines two or more columns into a single display value.

### Use Case

Display full name from first name and last name, or combine code with name.

### XML Example

```xml
<TempColumns>
    <TempColumn Name="FullName">
        <Expression>FirstName + ' ' + LastName</Expression>
        <DataType>NVARCHAR(500)</DataType>
    </TempColumn>
    <TempColumn Name="ProductDisplay">
        <Expression>ProductCode + ' - ' + ProductName</Expression>
        <DataType>NVARCHAR(500)</DataType>
    </TempColumn>
</TempColumns>
```

### Generation Rules

- Use `+` operator for string concatenation
- Ensure proper type conversion if mixing types
- Set DataType to NVARCHAR with sufficient length
- Handle NULL values with ISNULL or COALESCE

---

## Pattern 2: Calculation

Performs arithmetic on numeric columns.

### Use Case

Calculate total amount, net amount, variance, etc.

### XML Example

```xml
<TempColumns>
    <TempColumn Name="TotalAmount">
        <Expression>Quantity * UnitPrice</Expression>
        <DataType>DECIMAL(18,2)</DataType>
    </TempColumn>
    <TempColumn Name="Variance">
        <Expression>BudgetAmount - ActualAmount</Expression>
        <DataType>DECIMAL(18,2)</DataType>
    </TempColumn>
    <TempColumn Name="VariancePercent">
        <Expression>CASE WHEN BudgetAmount = 0 THEN 0 ELSE (BudgetAmount - ActualAmount) / BudgetAmount * 100 END</Expression>
        <DataType>DECIMAL(18,2)</DataType>
    </TempColumn>
    <TempColumn Name="TaxAmount">
        <Expression>SubTotal * TaxRate / 100</Expression>
        <DataType>DECIMAL(18,2)</DataType>
    </TempColumn>
</TempColumns>
```

### Generation Rules

- Use standard arithmetic operators (+, -, *, /)
- Handle division by zero with CASE WHEN
- Match decimal precision to business requirements
- Use ROUND() for financial calculations if needed

---

## Pattern 3: Conditional

Uses IIF or CASE WHEN for conditional display values.

### Use Case

Map numeric status codes to text, show conditional values.

### XML Example

```xml
<TempColumns>
    <TempColumn Name="StatusText">
        <Expression>IIF(DocStatus = 1, 'Draft', IIF(DocStatus = 2, 'Active', IIF(DocStatus = 4, 'Approved', 'Unknown')))</Expression>
        <DataType>NVARCHAR(50)</DataType>
    </TempColumn>
    <TempColumn Name="IsActiveText">
        <Expression>IIF(IsActive = 1, 'Active', 'Inactive')</Expression>
        <DataType>NVARCHAR(20)</DataType>
    </TempColumn>
    <TempColumn Name="IsOverBudget">
        <Expression>IIF(ActualAmount > BudgetAmount, 'Yes', 'No')</Expression>
        <DataType>NVARCHAR(10)</DataType>
    </TempColumn>
</TempColumns>
```

### Generation Rules

- Use IIF() for simple two-way conditions
- Use nested IIF() or CASE WHEN for multi-way conditions
- CASE WHEN is preferred for more than 3 conditions
- Match DataType to the output values

---

## Pattern 4: Lookup Display

Retrieves display text from a related table via expression.

### Use Case

Show customer name instead of just customer Id, show product code alongside product Id.

### XML Example

```xml
<TempColumns>
    <TempColumn Name="CustomerName">
        <Expression>(SELECT Name FROM B20Customer WHERE Id = CustomerId)</Expression>
        <DataType>NVARCHAR(255)</DataType>
    </TempColumn>
    <TempColumn Name="ProductCode">
        <Expression>(SELECT Code FROM B20Product WHERE Id = ProductId)</Expression>
        <DataType>VARCHAR(50)</DataType>
    </TempColumn>
    <TempColumn Name="WarehouseName">
        <Expression>(SELECT Name FROM B20Warehouse WHERE Id = WarehouseId)</Expression>
        <DataType>NVARCHAR(255)</DataType>
    </TempColumn>
</TempColumns>
```

### Generation Rules

- Use scalar sub-query for single value lookup
- Only for simple single-column lookups
- For complex lookups, use JOIN in the data source instead
- Performance note: sub-queries execute per row, so use sparingly

---

## Pattern 5: Running Total

Calculates a running/cumulative total.

### Use Case

Running balance, cumulative amount, sequential numbering.

### XML Example

```xml
<TempColumns>
    <TempColumn Name="RunningTotal">
        <Expression>SUM(Amount) OVER (ORDER BY DocDate, Id ROWS UNBOUNDED PRECEDING)</Expression>
        <DataType>DECIMAL(18,2)</DataType>
    </TempColumn>
    <TempColumn Name="RowNumber">
        <Expression>ROW_NUMBER() OVER (ORDER BY DocDate, Id)</Expression>
        <DataType>INT</DataType>
    </TempColumn>
</TempColumns>
```

### Generation Rules

- Use window functions (SUM OVER, ROW_NUMBER OVER)
- Define ORDER BY for meaningful sequence
- ROWS UNBOUNDED PRECEDING for running total
- Performance note: window functions can be expensive on large datasets

---

## TempColumn XML Reference

### Complete XML Structure

```xml
<TempColumns>
    <TempColumn Name="{ColumnName}">
        <Expression>{SQLExpression}</Expression>
        <DataType>{SQLDataType}</DataType>
    </TempColumn>
</TempColumns>
```

### Supported Expressions

| Expression Type | Syntax | Example |
|---|---|---|
| Column reference | ColumnName | Code |
| Concatenation | Col1 + Col2 | Code + ' - ' + Name |
| Arithmetic | Col1 * Col2 | Quantity * UnitPrice |
| IIF condition | IIF(cond, true, false) | IIF(Status=1, 'Active', 'Inactive') |
| CASE WHEN | CASE WHEN ... END | CASE WHEN A>B THEN 'X' ELSE 'Y' END |
| Scalar sub-query | (SELECT ... ) | (SELECT Name FROM B20Product WHERE Id = ProductId) |
| Window function | Func() OVER (...) | SUM(Amount) OVER (ORDER BY Date) |
| ISNULL | ISNULL(Col, default) | ISNULL(Note, '') |
| CAST | CAST(Col AS Type) | CAST(Quantity AS INT) |

---

## Auto-Generation Rules

| Scenario | Generated TempColumn |
|---|---|
| FK column exists | Lookup display via sub-query |
| Status INT column exists | StatusText via nested IIF |
| Quantity + UnitPrice exist | TotalAmount = Quantity * UnitPrice |
| Budget + Actual exist | Variance = Budget - Actual |
| FirstName + LastName exist | FullName = FirstName + ' ' + LastName |

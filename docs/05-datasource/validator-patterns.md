# Validator Patterns

## Overview

Validators enforce data integrity rules before saving records. Each validator checks a specific condition and displays a localized error message if the check fails.

---

## Pattern 1: Required Field

Field cannot be null or empty string.

```xml
<Validator Name="valCodeRequired">
    <Field>Code</Field>
    <Rule>Required</Rule>
    <Message>
        <Vietnamese>Ma khong duoc de trong</Vietnamese>
        <English>Code is required</English>
    </Message>
</Validator>
```

### Rules

- Check that the field value is not NULL
- Check that the field value is not an empty string
- For strings: trim whitespace before checking
- Applied before save operation

---

## Pattern 2: Range Check

Numeric value must be within specified bounds.

```xml
<Validator Name="valQuantityRange">
    <Field>Quantity</Field>
    <Rule>Range</Rule>
    <Min>0.0001</Min>
    <Max>999999999</Max>
    <Message>
        <Vietnamese>So luong phai lon hon 0 va nho hon 999,999,999</Vietnamese>
        <English>Quantity must be between 0 and 999,999,999</English>
    </Message>
</Validator>

<Validator Name="valPriceRange">
    <Field>Price</Field>
    <Rule>Range</Rule>
    <Min>0</Min>
    <Message>
        <Vietnamese>Don gia phai lon hon hoac bang 0</Vietnamese>
        <English>Unit price must be greater than or equal to 0</English>
    </Message>
</Validator>
```

### Rules

- Min is inclusive (value >= Min)
- Max is inclusive (value <= Max)
- If Min is omitted, only upper bound is checked
- If Max is omitted, only lower bound is checked
- Applied to numeric fields (INT, DECIMAL, MONEY)

---

## Pattern 3: Format Check

Value must match a specific format pattern.

```xml
<Validator Name="valCodeFormat">
    <Field>Code</Field>
    <Rule>Format</Rule>
    <Pattern>^[A-Z0-9\-]+$</Pattern>
    <Message>
        <Vietnamese>Ma chi duoc chua chu hoa, so va dau gach ngang</Vietnamese>
        <English>Code can only contain uppercase letters, numbers, and hyphens</English>
    </Message>
</Validator>

<Validator Name="valEmailFormat">
    <Field>Email</Field>
    <Rule>Format</Rule>
    <Pattern>^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$</Pattern>
    <Message>
        <Vietnamese>Dinh dang email khong hop le</Vietnamese>
        <English>Invalid email format</English>
    </Message>
</Validator>

<Validator Name="valDateFormat">
    <Field>DocDate</Field>
    <Rule>Format</Rule>
    <Pattern>Date</Pattern>
    <Message>
        <Vietnamese>Dinh dang ngay khong hop le</Vietnamese>
        <English>Invalid date format</English>
    </Message>
</Validator>
```

### Rules

- Pattern uses regular expression syntax
- Common patterns:
  - Code: `^[A-Z0-9\-]+$`
  - Email: standard email regex
  - Phone: `^[0-9+\-\s()]+$`
  - Date: built-in Date format check
- Case-sensitive by default

---

## Pattern 4: FK Integrity

Referenced record must exist in the target table.

```xml
<Validator Name="valProductExists">
    <Field>ProductId</Field>
    <Rule>FKIntegrity</Rule>
    <TargetTable>B20Product</TargetTable>
    <TargetColumn>Id</TargetColumn>
    <Message>
        <Vietnamese>San pham khong ton tai</Vietnamese>
        <English>Product does not exist</English>
    </Message>
</Validator>

<Validator Name="valCustomerExists">
    <Field>CustomerId</Field>
    <Rule>FKIntegrity</Rule>
    <TargetTable>B20Customer</TargetTable>
    <TargetColumn>Id</TargetColumn>
    <Message>
        <Vietnamese>Khach hang khong ton tai</Vietnamese>
        <English>Customer does not exist</English>
    </Message>
</Validator>
```

### Rules

- Check that the FK value exists in the target table
- Also check that the referenced record is active (IsActive = 1)
- Applied before INSERT and UPDATE operations
- Can be auto-generated from FK column definitions

---

## Pattern 5: Unique Check

Value must be unique within the table (excluding the current record on update).

```xml
<Validator Name="valCodeUnique">
    <Field>Code</Field>
    <Rule>Unique</Rule>
    <Table>B20Customer</Table>
    <ExcludeCurrentRecord>True</ExcludeCurrentRecord>
    <Message>
        <Vietnamese>Ma da ton tai</Vietnamese>
        <English>Code already exists</English>
    </Message>
</Validator>
```

### Rules

- Check uniqueness against the database (not just loaded data)
- For updates: exclude the current record's Id from the check
- Case-insensitive comparison recommended
- Auto-generated for columns with unique indexes

---

## Pattern 6: Cross-Field Validation

Value must satisfy a condition relative to another field.

```xml
<Validator Name="valDateRange">
    <Field>EndDate</Field>
    <Rule>CrossField</Rule>
    <Condition>EndDate >= StartDate</Condition>
    <CompareField>StartDate</CompareField>
    <Message>
        <Vietnamese>Ngay ket thuc phai sau ngay bat dau</Vietnamese>
        <English>End date must be after start date</English>
    </Message>
</Validator>

<Validator Name="valAmountMatch">
    <Field>TotalAmount</Field>
    <Rule>CrossField</Rule>
    <Condition>TotalAmount = SUM(DetailLines.Amount)</Condition>
    <Message>
        <Vietnamese>Tong tien khong khop voi tong chi tiet</Vietnamese>
        <English>Total amount does not match detail sum</English>
    </Message>
</Validator>
```

### Rules

- Compare the current field against another field or expression
- Supports: >=, <=, >, <, = comparisons
- Can reference aggregated values from detail lines
- Applied after all single-field validations pass

---

## Validator Execution Order

Validators are executed in this order:

1. **Required** - Basic null/empty checks
2. **Format** - Pattern matching
3. **Range** - Numeric bounds
4. **FK Integrity** - Reference existence
5. **Unique** - Uniqueness constraint
6. **Cross-Field** - Multi-field logic

If any validator fails, execution stops and the error message is displayed. No partial saves occur.

---

## Auto-Generation Rules

| Column Pattern | Auto-Generated Validator |
|---|---|
| Code (VARCHAR, NOT NULL) | Required + Unique |
| Name (NVARCHAR, NOT NULL) | Required |
| FK column (INT, NOT NULL) | Required + FKIntegrity |
| Amount (DECIMAL, >= 0) | Range(0, max) |
| Quantity (DECIMAL, > 0) | Range(0.0001, max) |
| StartDate + EndDate pair | CrossField(EndDate >= StartDate) |

# Control Mapping Engine

## DB Type to UI Control Mapping

The control mapping engine selects the appropriate Bravo UI control for each database column based on SQL data type and column naming conventions.

| SQL Type | Pattern | UI Control | Notes |
|---|---|---|---|
| VARCHAR | General | BravoTextBox | Standard text input |
| NVARCHAR | General | BravoTextBox | Unicode text input |
| VARCHAR(MAX) | Length > 500 | BravoTextBox | WordWrap: True |
| NVARCHAR(MAX) | Length > 500 | BravoTextBox | WordWrap: True |
| DATE | - | BravoDateInputBox | Format: dd/MM/yyyy |
| DATETIME | - | BravoDateInputBox | Format: dd/MM/yyyy HH:mm |
| DATETIME2 | - | BravoDateInputBox | Format: dd/MM/yyyy HH:mm |
| SMALLDATETIME | - | BravoDateInputBox | Format: dd/MM/yyyy HH:mm |
| INT | Non-FK | BravoQuantityInputBox | Format: N0 |
| BIGINT | Non-FK | BravoQuantityInputBox | Format: N0 |
| SMALLINT | Non-FK | BravoQuantityInputBox | Format: N0 |
| TINYINT | Non-FK | BravoQuantityInputBox | Format: N0 |
| MONEY | - | BravoQuantityInputBox | Format: N2 |
| SMALLMONEY | - | BravoQuantityInputBox | Format: N2 |
| DECIMAL | - | BravoQuantityInputBox | Format: N{scale} |
| NUMERIC | - | BravoQuantityInputBox | Format: N{scale} |
| FLOAT | - | BravoQuantityInputBox | Format: N2 |
| REAL | - | BravoQuantityInputBox | Format: N2 |
| BIT | - | BravoTextBox | Checkbox display mode |
| TEXT | - | BravoTextBox | WordWrap: True, multiline |
| NTEXT | - | BravoTextBox | WordWrap: True, multiline |
| UNIQUEIDENTIFIER | Non-FK | BravoTextBox | Read-only display |

---

## Foreign Key Detection

Columns are detected as foreign keys using these rules:

1. Column name ends with `Id` (case-sensitive match: `CustomerId`, `ProductId`)
2. Column has an explicit FK constraint in the database
3. Column references another table's primary key

When detected as FK, the control becomes `BravoLookupBox` regardless of underlying SQL type.

### Exception List (Not FK despite ending in Id)

These columns ending in `Id` are NOT treated as FK:

- `RowId` - Row identifier
- `Id` - Primary key itself
- `*DetailId` - Self-reference in detail tables
- `*LogId` - Audit log reference

---

## Lookup Source Mapping

When a column is mapped to `BravoLookupBox`, the lookup source is determined by the column name prefix:

| FK Column | LookupSource | KeyField | DisplayField | CodeField |
|---|---|---|---|---|
| CustomerId | Customer | CustomerId | CustomerName | CustomerCode |
| VendorId | Vendor | VendorId | VendorName | VendorCode |
| ProductId | Item | ProductId | ProductName | ProductCode |
| EmployeeId | Employee | EmployeeId | EmployeeName | EmployeeCode |
| CurrencyCode | Currency | CurrencyCode | CurrencyName | CurrencyCode |
| WarehouseId | Warehouse | WarehouseId | WarehouseName | WarehouseCode |
| ClassId | ClassInfo | ClassId | ClassName | ClassCode |
| BizDocId | BizDoc | BizDocId | BizDocName | BizDocCode |
| DepartmentId | Department | DepartmentId | DepartmentName | DepartmentCode |
| AccountId | Account | AccountId | AccountName | AccountCode |
| ProjectId | Project | ProjectId | ProjectName | ProjectCode |
| UnitId | Unit | UnitId | UnitName | UnitCode |
| TaxGroupId | TaxGroup | TaxGroupId | TaxGroupName | TaxGroupCode |

### Custom Lookup Resolution

If the column name prefix does not match any standard mapping:

1. Search DataSource XML for a `<Source>` element matching the referenced table
2. Use the referenced table's primary key as KeyField
3. Use the first `Name` or `*Name` column as DisplayField
4. Use the first `Code` or `*Code` column as CodeField

---

## Control Generation Examples

### Text Field

```xml
<!-- Input: CustomerCode NVARCHAR(50) -->
<BravoTextBox Name="txtCustomerCode"
    Caption="Ma khach hang"
    DataField="CustomerCode"
    MaxLength="50"
    Width="120"
    Required="True" />
```

### Date Field

```xml
<!-- Input: InvoiceDate DATE -->
<BravoDateInputBox Name="dtpInvoiceDate"
    Caption="Ngay hoa don"
    DataField="InvoiceDate"
    Format="dd/MM/yyyy"
    Width="150"
    Required="True" />
```

### Lookup Field

```xml
<!-- Input: CustomerId UNIQUEIDENTIFIER (FK) -->
<BravoLookupBox Name="lkbCustomer"
    Caption="Khach hang"
    DataField="CustomerId"
    LookupSource="Customer"
    Width="250"
    Required="True" />
```

### Numeric Field

```xml
<!-- Input: Amount DECIMAL(18,2) -->
<BravoQuantityInputBox Name="numAmount"
    Caption="So tien"
    DataField="Amount"
    Format="N2"
    Width="150" />
```

### Integer Field

```xml
<!-- Input: Quantity INT -->
<BravoQuantityInputBox Name="numQuantity"
    Caption="So luong"
    DataField="Quantity"
    Format="N0"
    Width="100" />
```

### Textarea Field

```xml
<!-- Input: Notes NVARCHAR(MAX) -->
<BravoTextBox Name="txtNotes"
    Caption="Ghi chu"
    DataField="Notes"
    WordWrap="True"
    Multiline="True"
    Height="80"
    Width="400" />
```

---

## Mapping Decision Tree

```
Is column a Foreign Key?
    YES -> BravoLookupBox
          -> Determine LookupSource from column name prefix
    NO  -> Is SQL type DATE/DATETIME?
            YES -> BravoDateInputBox
            NO  -> Is SQL type MONEY/DECIMAL/NUMERIC?
                    YES -> BravoQuantityInputBox with N{scale} format
                    NO  -> Is SQL type INT/BIGINT/SMALLINT?
                            YES -> BravoQuantityInputBox with N0 format
                            NO  -> Is SQL type BIT?
                                    YES -> BravoTextBox (checkbox mode)
                                    NO  -> Is length > 500?
                                            YES -> BravoTextBox (multiline)
                                            NO  -> BravoTextBox (standard)
```

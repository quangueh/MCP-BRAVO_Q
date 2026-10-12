# Control Catalog

## Overview

Bravo ERP layouts use a set of custom WinForms controls. This catalog documents every control type used in layout XML generation.

---

## Control Types

### BravoExplorerControl

Main grid/list control for displaying records in the Explorer panel.

| Property | Type | Description |
|---|---|---|
| Assembly | string | Bravo.Windows.Controls |
| ClassName | string | BravoExplorerControl |
| DataMember | string | Table/view name for data binding |
| Cols | array | Column definitions |
| zTreeColName | string | Column used for tree grouping |
| zMakingTreeNodeKeyColName | string | Key column for tree nodes |

---

### BravoTextBox

Standard text input control.

| Property | Type | Description |
|---|---|---|
| Assembly | string | Bravo.Windows.Controls |
| ClassName | string | BravoTextBox |
| DataMember | string | Bound column name |
| Width | int | Control width in pixels |
| Height | int | Control height in pixels |
| MaxLength | int | Maximum character length |

**Use for**: VARCHAR, NVARCHAR columns.

---

### BravoDateInputBox

Date picker control with calendar dropdown.

| Property | Type | Description |
|---|---|---|
| Assembly | string | Bravo.Windows.Controls |
| ClassName | string | BravoDateInputBox |
| DataMember | string | Bound column name |
| Width | int | Control width in pixels |
| Format | string | Date display format (e.g., dd/MM/yyyy) |

**Use for**: DATE, DATETIME columns.

---

### BravoQuantityInputBox

Numeric input control with spin buttons.

| Property | Type | Description |
|---|---|---|
| Assembly | string | Bravo.Windows.Controls |
| ClassName | string | BravoQuantityInputBox |
| DataMember | string | Bound column name |
| Width | int | Control width in pixels |
| DecimalPlaces | int | Number of decimal places |
| Format | string | Number display format (e.g., N2) |

**Use for**: INT, DECIMAL, MONEY columns.

---

### BravoLookupBox

Dropdown control with search/lookup functionality.

| Property | Type | Description |
|---|---|---|
| Assembly | string | Bravo.Windows.Controls |
| ClassName | string | BravoLookupBox |
| DataMember | string | Bound column name (FK column) |
| Width | int | Control width in pixels |
| LookupSource | string | Source entity type |
| DisplayMember | string | Column to display |
| ValueMember | string | Column for value (usually Id) |

**Use for**: Foreign key columns (ProductId, CustomerId, etc.).

---

### BravoTabControl

Tab container for organizing layout panels.

| Property | Type | Description |
|---|---|---|
| Assembly | string | Bravo.Windows.Controls |
| ClassName | string | BravoTabControl |
| Pages | array | Collection of TabPages |

---

### BravoGridContainer

Wrapper control for grids with toolbar and status bar.

| Property | Type | Description |
|---|---|---|
| Assembly | string | Bravo.Windows.Controls |
| ClassName | string | BravoGridContainer |
| DataMember | string | Table/view name |
| Cols | array | Column definitions |
| SumColumns | array | Columns to sum in footer |
| Groups | array | Grouping definitions |

---

### BravoLinkCommand

Hyperlink-style action button.

| Property | Type | Description |
|---|---|---|
| Assembly | string | Bravo.Windows.Controls |
| ClassName | string | BravoLinkCommand |
| Text | string | Link text |
| BravoCommandKey | string | Command to execute |

---

## Lookup Sources

LookupBox controls can bind to the following predefined sources:

| LookupSource | Description | Display Columns |
|---|---|---|
| Customer | B20Customer | Code, Name |
| Vendor | B20Vendor | Code, Name |
| Item | B20Product | Code, Name |
| Employee | B20Employee | Code, FullName |
| Currency | B10Currency | Code, Name |
| Warehouse | B20Warehouse | Code, Name |
| ClassInfo | B20ClassInfo | Code, Name |
| BizDoc | B30BizDoc | Code, DocDate |
| DocStatus | Status values | Value, Text |
| DmCt | Document types | 12 types |
| JobRCC | B20JobRCC | Code, Name |
| Unit | B20Unit | Code, Name |

---

## Control Type Mapping

| Database Type | Control Type | LookupSource |
|---|---|---|
| VARCHAR | BravoTextBox | - |
| NVARCHAR | BravoTextBox | - |
| DATE | BravoDateInputBox | - |
| DATETIME | BravoDateInputBox | - |
| INT (non-FK) | BravoQuantityInputBox | - |
| DECIMAL | BravoQuantityInputBox | - |
| MONEY | BravoQuantityInputBox | - |
| INT (FK) | BravoLookupBox | Based on FK target |
| BIT | Checkbox (in grid) | - |
| TEXT | BravoTextBox (multiline) | - |

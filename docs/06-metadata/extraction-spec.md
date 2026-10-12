# Metadata Extraction Engine Specification

## Overview

The extraction engine parses Bravo ERP XML files (Layout XML and DataSource XML) and produces structured metadata JSON conforming to the schemas defined in this phase.

## Input

- **Layout XML**: UI layout definition (controls, panels, toolbar, styles)
- **DataSource XML**: Data binding configuration (table, SP, view references)

## Output

- Valid metadata JSON conforming to metadata-schema.json
- Ready for downstream generation (tables, relations, SQL scripts)

---

## Extraction Pipeline

1. Parse XML with xml2js
2. Identify layout type from panel structure
3. Extract controls from panel nodes
4. Map controls to columns using DataMember bindings
5. Extract styles and formatting
6. Parse DataSource XML for table/SP bindings
7. Build complete metadata object

---

## Step 1: Parse XML

Use xml2js to parse both XML files into JavaScript objects.

Rules:
- Handle encoding declarations (UTF-8, UTF-16)
- Preserve CDATA sections for expressions
- Normalize attribute names to camelCase

---

## Step 2: Identify Layout Type

| Panel Node Pattern      | Layout Type |
|-------------------------|-------------|
| Contains panelExplorer  | Explorer    |
| Contains panelEditor    | Editor      |
| Contains panelReporter  | Report      |
| Contains panelDashboard | Dashboard   |
| Contains panelApproval  | Approval    |

Fallback: If no panel type identifiable, inspect child controls:
- GridControl present -> Explorer
- Detail controls (TextBox, DateEdit) -> Editor
- Parameter panel + report viewer -> Report

---

## Step 3: Extract Controls

Walk the panel node tree and extract all control definitions.

### Control Type Mapping

| XML Control Type | Mapped To    | Notes               |
|------------------|--------------|---------------------|
| GridControl      | Grid         | Explorer grid       |
| TextBox          | TextBox      | Text input          |
| MemoEdit         | MemoEdit     | Multi-line text     |
| ComboBox         | ComboBox     | Dropdown            |
| LookUpEdit       | LookUpEdit   | Lookup dropdown     |
| DateEdit         | DateEdit     | Date picker         |
| SpinEdit         | SpinEdit     | Numeric spinner     |
| CheckEdit        | CheckBox     | Boolean toggle      |
| ButtonEdit       | ButtonEdit   | Button + text combo |
| RepositoryItem   | LookupSource | Grid column lookup  |

For each control: extract Name, Type, DataMember, Width, Visible, Text, Properties.

---

## Step 4: Map Controls to Columns

Bind extracted controls to column definitions using DataMember.

1. Each control with DataMember maps to a column
2. Grid columns from BandedGridView > Columns > GridColumn
3. Editor controls map to header fields
4. Duplicate DataMembers merge into single column entry

---

## Step 5: Extract Styles and Formatting

| Element              | Source Path                               |
|----------------------|-------------------------------------------|
| Font                 | AppearanceObject.Font                     |
| Background Color     | AppearanceObject.BackColor                |
| Foreground Color     | AppearanceObject.ForeColor                |
| Text Alignment       | AppearanceObject.TextOptions.HAlignment   |
| Format String        | GridColumn.DisplayFormat.FormatString     |
| Header Style         | GridBand.AppearanceHeader                 |
| Row Style            | GridView.Appearance.Row                   |
| Alternating Row Style| GridView.Appearance.EvenRow               |
| Group Row Style      | GridView.Appearance.GroupRow              |
| Sum Row Style        | GridView.Appearance.FooterPanel           |

Defaults: Font Tahoma/9, Header BG #F0F0F0, Row #FFFFFF, Alt Row #F7F7F7, Sum Row #FFFDE0, Group #E8F0FE

---

## Step 6: Parse DataSource XML

| Element     | Maps To                     | Notes                      |
|-------------|-----------------------------|-----------------------------|
| TableName   | dataSource.tableName        | Primary table              |
| SPName      | dataSource.spName           | Stored procedure           |
| CommandType | dataSource.viewType         | Text/StoredProcedure/Table |
| Filter      | dataSource.filterExpression | Default WHERE clause       |
| SortField   | defaultSortColumn           | Default ORDER BY           |

---

## Step 7: Build Complete Metadata Object

Assemble all extracted data into final metadata JSON with:
- layoutName, layoutType, sourceTable
- dataSource, columns, controls, toolbar
- parameters, styles, relations, seedData
- metadata (version, createdAt, sourceFile)

---

## Fallback Defaults

| Missing Element      | Default Value                            |
|----------------------|------------------------------------------|
| Column width         | 100                                      |
| Column visible       | true                                     |
| Column format        | Based on data type (see column-metadata) |
| Control type         | TextBox                                  |
| Toolbar buttons      | Standard set for layout type             |
| Styles               | Office2016Colorful defaults              |
| DataSource viewType  | Table                                    |
| Parameters           | Empty array                              |
| Filter expression    | IsActive = 1                             |

---

## Validation Checklist

- layoutName is non-empty and follows naming convention
- layoutType is a valid enum value
- sourceTable is non-empty
- At least one column defined
- All column names unique
- All dataMember values reference valid columns
- dataSource.tableName matches sourceTable
- No duplicate toolbar button names
- All parameter names unique
- Styles contain valid colors
- Width values are positive integers
- Format strings valid for column data type

---

## Error Handling

| Code | Description                  | Action                   |
|------|------------------------------|--------------------------|
| E001 | XML parse failure            | Log error, halt          |
| E002 | No layout type identified    | Default to Explorer      |
| E003 | No controls found            | Log warning, continue    |
| E004 | No columns extracted         | Log error, halt          |
| E005 | DataSource missing table     | Log error, halt          |
| E006 | Duplicate column names       | Log warning, deduplicate |
| E007 | Invalid control type         | Map to TextBox fallback  |
| E008 | Missing style info           | Apply defaults           |
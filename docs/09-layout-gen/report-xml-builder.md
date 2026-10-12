# Report XML Builder

## Input

```typescript
interface ReportMetadata {
    spName: string;
    displayName: string;
    parameters: SPParameter[];
    outputColumns: ColumnMetadata[];
    sumColumns: string[];
    groups: GroupDefinition[];
    hasTreeView: boolean;
    treeColumnName?: string;
    module: string;
}

interface SPParameter {
    name: string;
    sqlType: string;
    defaultValue?: string;
    caption: string;
}

interface GroupDefinition {
    column: string;
    caption: string;
    showSummary: boolean;
}
```

---

## Build Process

### Step 1: buildRoot()

```xml
<root showCommandButtons="Custom"
      xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
      xsi:noNamespaceSchemaLocation="Report.xsd">
```

### Step 2: buildToolStrip()

```xml
<ToolStrip Name="tsReport">
    <Button Name="btnPreview" Text="Xem truoc" Icon="Preview" />
    <Button Name="btnPrint" Text="In" Icon="Print" />
    <Button Name="btnExport" Text="Xuat" Icon="Export" />
    <Button Name="btnRefresh" Text="Lam moi" Icon="Refresh" />
</ToolStrip>
```

### Step 3: buildPanelParameters()

Creates input controls for each stored procedure parameter.

```xml
<PanelParameters Name="ppParams">
    <BravoDateInputBox Name="dtpFromDate" 
        Caption="Tu ngay"
        ParameterName="@FromDate"
        Format="dd/MM/yyyy"
        Width="150" />
    <BravoDateInputBox Name="dtpToDate" 
        Caption="Den ngay"
        ParameterName="@ToDate"
        Format="dd/MM/yyyy"
        Width="150" />
    <BravoLookupBox Name="lkbDepartment" 
        Caption="Bo phan"
        ParameterName="@DepartmentId"
        LookupSource="Department"
        Width="200" />
</PanelParameters>
```

Parameter to control mapping:
- `@FromDate`, `@ToDate` -> `BravoDateInputBox`
- `@*Id` (FK params) -> `BravoLookupBox` with appropriate LookupSource
- `@*Code` -> `BravoLookupBox` or `BravoTextBox`
- `@*Amount`, `@*Qty` -> `BravoQuantityInputBox`
- `@*Flag`, `@*Type` -> `BravoTextBox` or dropdown

### Step 4: buildPanelReporter()

Creates the report display panel.

```xml
<PanelReporter Name="prMain">
    <Report_0 Name="rpt0" />
</PanelReporter>
```

### Step 5: buildReportContent()

Sets data binding, tree configuration, and main grid.

```xml
<DataMember>Table1</DataMember>
```

If tree view is enabled:

```xml
<zTreeColName>ParentCode</zTreeColName>
<zMakingTreeNodeKeyColName>Code</zMakingTreeNodeKeyColName>
```

### Step 6: buildCols()

Generates column definitions from SP output columns.

```xml
<Cols>
    <Col Name="Code" Caption="Ma" Width="120" Style="LeftTop" />
    <Col Name="Name" Caption="Ten" Width="200" Style="LeftTop" />
    <Col Name="BudgetAmount" Caption="Ngan sach" Width="130" 
         Style="RightTop" Format="N2" />
    <Col Name="ActualAmount" Caption="Thuc hien" Width="130" 
         Style="RightTop" Format="N2" />
    <Col Name="Variance" Caption="Chenh lech" Width="130" 
         Style="RightTop" Format="N2" />
</Cols>
```

### Step 7: buildSumColumns()

Defines numeric columns that support aggregation (sum at group/total level).

```xml
<SumColumns>
    <SumCol Name="BudgetAmount" />
    <SumCol Name="ActualAmount" />
    <SumCol Name="Variance" />
</SumColumns>
```

Selection criteria for sum columns:
- Column type is MONEY, DECIMAL, or numeric INT
- Column is not a key/identifier field
- Column name does not end with "Id" or "Code"

### Step 8: buildGroups()

Defines grouping expressions for hierarchical reports.

```xml
<Groups>
    <Group Name="grpModule" 
           Expression="ModuleCode"
           Caption="Nhom"
           ShowSummary="True">
        <SumColumns>
            <SumCol Name="BudgetAmount" />
            <SumCol Name="ActualAmount" />
        </SumColumns>
    </Group>
</Groups>
```

### Step 9: buildSummary()

Adds legend and signature blocks.

```xml
<Summary>
    <Legend>
        <Item Caption="Ngan sach" Color="Blue" />
        <Item Caption="Thuc hien" Color="Green" />
    </Legend>
    <Signatures>
        <Signature Caption="Nguoi lap" Position="Left" />
        <Signature Caption="Ke toan truong" Position="Center" />
        <Signature Caption="Giam doc" Position="Right" />
    </Signatures>
</Summary>
```

### Step 10: buildComplete()

Validates and returns XML string.

Validation checks:
1. All SP parameters have corresponding controls
2. DataMember is set
3. SumColumns reference valid column names
4. Group expressions reference valid columns
5. No duplicate names

---

## Complete Output Example

```xml
<?xml version="1.0" encoding="utf-8"?>
<root showCommandButtons="Custom"
      xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
      xsi:noNamespaceSchemaLocation="Report.xsd">

    <ToolStrip Name="tsReport">
        <Button Name="btnPreview" Text="Xem truoc" Icon="Preview" />
        <Button Name="btnPrint" Text="In" Icon="Print" />
        <Button Name="btnExport" Text="Xuat" Icon="Export" />
        <Button Name="btnRefresh" Text="Lam moi" Icon="Refresh" />
    </ToolStrip>

    <PanelParameters Name="ppParams">
        <BravoDateInputBox Name="dtpFromDate" 
            Caption="Tu ngay"
            ParameterName="@FromDate"
            Format="dd/MM/yyyy"
            Width="150" />
        <BravoDateInputBox Name="dtpToDate" 
            Caption="Den ngay"
            ParameterName="@ToDate"
            Format="dd/MM/yyyy"
            Width="150" />
    </PanelParameters>

    <PanelReporter Name="prMain">
        <Report_0 Name="rpt0">
            <DataMember>Table1</DataMember>
            <zTreeColName>ParentCode</zTreeColName>
            <zMakingTreeNodeKeyColName>Code</zMakingTreeNodeKeyColName>
            <Cols>
                <Col Name="Code" Caption="Ma hang muc" Width="120" 
                     Style="LeftTop" />
                <Col Name="Name" Caption="Ten hang muc" Width="250" 
                     Style="LeftTop" />
                <Col Name="BudgetAmount" Caption="Ngan sach" Width="130" 
                     Style="RightTop" Format="N2" />
                <Col Name="ActualAmount" Caption="Thuc hien" Width="130" 
                     Style="RightTop" Format="N2" />
            </Cols>
            <SumColumns>
                <SumCol Name="BudgetAmount" />
                <SumCol Name="ActualAmount" />
            </SumColumns>
        </Report_0>
    </PanelReporter>
</root>
```

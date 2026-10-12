# Report Layout Generator Specification

## Overview

The Report generator produces a complete layout XML for report viewing. Input is stored procedure metadata with parameters and output columns; output is a fully functional Report XML layout.

---

## Input

SP metadata object:

```json
{
  "SPName": "usp_CCM_BaoCaoTongHopThucHienNganSachCongTruong_HangMuc_KeToan",
  "Module": "CCM",
  "DisplayName": "Budget Performance Report",
  "Parameters": [
    { "Name": "_DocDate", "Type": "DATE", "Direction": "OUTPUT", "Default": "GETDATE()" },
    { "Name": "_ProductId", "Type": "INT", "Direction": "INPUT", "FK": "B20Product" },
    { "Name": "_nUserId", "Type": "INT", "Direction": "INPUT" },
    { "Name": "_BranchCode", "Type": "VARCHAR(3)", "Direction": "INPUT" }
  ],
  "OutputColumns": [
    { "Name": "ProductCode", "Type": "VARCHAR(50)" },
    { "Name": "ProductName", "Type": "NVARCHAR(255)" },
    { "Name": "CustomerCode", "Type": "VARCHAR(50)" },
    { "Name": "CustomerName", "Type": "NVARCHAR(255)" },
    { "Name": "BudgetAmount", "Type": "DECIMAL(18,2)" },
    { "Name": "ActualAmount", "Type": "DECIMAL(18,2)" },
    { "Name": "Variance", "Type": "DECIMAL(18,2)" }
  ]
}
```

---

## Generation Steps

### Step 1: Create panelParameters

Generate input controls for each SP parameter (excluding @_nUserId which is system-injected).

```xml
<panelParameters Name="panelParams">
    <Controls>
        <Control>
            <Name>dtpDocDate</Name>
            <ClassName>BravoDateInputBox</ClassName>
            <DataMember>_DocDate</DataMember>
            <Location X="10" Y="10" />
            <Size Width="150" Height="25" />
            <Format>dd/MM/yyyy</Format>
            <Label>
                <Text>
                    <Vietnamese>Ngay bao cao</Vietnamese>
                    <English>Report Date</English>
                </Text>
            </Label>
        </Control>
        <Control>
            <Name>lkpProduct</Name>
            <ClassName>BravoLookupBox</ClassName>
            <DataMember>_ProductId</DataMember>
            <Location X="200" Y="10" />
            <Size Width="250" Height="25" />
            <LookupSource>Item</LookupSource>
            <Label>
                <Text>
                    <Vietnamese>San pham</Vietnamese>
                    <English>Product</English>
                </Text>
            </Label>
        </Control>
    </Controls>
</panelParameters>
```

### Step 2: Map Parameter Types to Controls

| Parameter Type | Control Type | Notes |
|---|---|---|
| DATE | BravoDateInputBox | Default to current date |
| INT (FK) | BravoLookupBox | With LookupSource |
| INT (non-FK) | BravoQuantityInputBox | DecimalPlaces: 0 |
| VARCHAR(3) | BravoLookupBox | LookupSource: Branch |
| VARCHAR(50) | BravoTextBox | - |
| DECIMAL | BravoQuantityInputBox | DecimalPlaces from scale |

### Step 3: Create panelReporter with Report_0

```xml
<panelReporter>
    <Report_0 Name="report0">
        <Content>
            <DataMember>Table1</DataMember>
            <Cols>
                {GeneratedColumns}
            </Cols>
        </Content>
    </Report_0>
</panelReporter>
```

### Step 4: Set DataMember to Table1

Report output always binds to `Table1` (the first result set from the SP).

### Step 5: Generate Cols from SP Output Columns

```xml
<Col Name="colProductCode" Header="">
    <Header>
        <Vietnamese>Ma SP</Vietnamese>
        <English>Product Code</English>
    </Header>
    <DataMember>ProductCode</DataMember>
    <Width>120</Width>
    <TextAlign>LeftTop</TextAlign>
    <Visible>True</Visible>
    <ReadOnly>True</ReadOnly>
</Col>
```

### Step 6: Add SumColumns for Numeric Columns

```xml
<SumColumns>BudgetAmount,ActualAmount,Variance</SumColumns>
```

### Step 7: Add Groups if Grouping Needed

```xml
<Groups>
    <Group>
        <GroupCol>ProductCode</GroupCol>
        <ShowHeader>True</ShowHeader>
        <ShowFooter>True</ShowFooter>
    </Group>
</Groups>
```

### Step 8: Set Tree View Properties

For hierarchical reports:

```xml
<zTreeColName>ProductCode</zTreeColName>
<zMakingTreeNodeKeyColName>ProductId</zMakingTreeNodeKeyColName>
```

---

## Complete Report XML Template

```xml
<?xml version="1.0" encoding="utf-8"?>
<Layout>
    <panelParameters Name="panelParams">
        <Controls>
            {ParameterControls}
        </Controls>
    </panelParameters>
    <panelReporter>
        <Report_0 Name="report0">
            <Content>
                <DataMember>Table1</DataMember>
                <Cols>
                    {OutputColumns}
                </Cols>
                <SumColumns>{SumColumnList}</SumColumns>
                <Groups>
                    {GroupDefinitions}
                </Groups>
            </Content>
        </Report_0>
    </panelReporter>
</Layout>
```

---

## Parameter Control Generation Algorithm

```
FOR each SP parameter:
    1. SKIP if parameter is @_nUserId (system-injected)
    2. SKIP if parameter is @_BranchCode (system-injected)
    3. Determine control type from parameter type
    4. If FK parameter (ends with Id): use LookupBox
    5. Generate Label text using column name translation
    6. Set Default value if parameter has OUTPUT direction
    7. Position control in horizontal layout
```

---

## Output Column Generation Algorithm

```
FOR each SP output column:
    1. Determine Width from column type (column-mapping rules)
    2. Determine TextAlign from column type
    3. Determine Format from column type
    4. Set Visible=True for all columns
    5. Set ReadOnly=True (report is read-only)
    6. Generate Header multi-language text
    7. If DECIMAL type: add to SumColumns list
    8. Apply HeaderStyle and Style
```

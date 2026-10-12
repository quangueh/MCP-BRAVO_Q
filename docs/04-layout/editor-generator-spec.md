# Editor Layout Generator Specification

## Overview

The Editor generator produces a complete layout XML for creating and editing records. It handles both master data forms (single table) and document editors (header + detail lines).

---

## Input

Master table metadata + optional detail table metadata:

```json
{
  "MasterTable": {
    "TableName": "B30BizDoc",
    "Columns": [
      { "Name": "Id", "Type": "INT", "IsPK": true },
      { "Name": "Code", "Type": "VARCHAR(50)" },
      { "Name": "DocDate", "Type": "DATE" },
      { "Name": "ProductId", "Type": "INT", "FK": "B20Product" },
      { "Name": "CustomerId", "Type": "INT", "FK": "B20Customer" },
      { "Name": "Amount", "Type": "DECIMAL(18,2)" },
      { "Name": "DocStatus", "Type": "INT" }
    ]
  },
  "DetailTable": {
    "TableName": "B30BizDocDetail",
    "Columns": [
      { "Name": "Id", "Type": "INT", "IsPK": true },
      { "Name": "BizDocId", "Type": "INT", "FK": "B30BizDoc" },
      { "Name": "ProductId", "Type": "INT", "FK": "B20Product" },
      { "Name": "Quantity", "Type": "DECIMAL(18,4)" },
      { "Name": "Price", "Type": "DECIMAL(18,4)" },
      { "Name": "Amount", "Type": "DECIMAL(18,2)" }
    ]
  }
}
```

---

## Generation Steps

### Step 1: Create Root with toolStrip1

```xml
<toolStrip1>
    <Items>
        <Item Name="btnSave" BravoCommandKey="Save">
            <Text><Vietnamese>Luu</Vietnamese><English>Save</English></Text>
        </Item>
        <Item Name="btnCancel" BravoCommandKey="Cancel">
            <Text><Vietnamese>Huy</Vietnamese><English>Cancel</English></Text>
        </Item>
        <Item Name="btnPrint" BravoCommandKey="Print">
            <Text><Vietnamese>In</Vietnamese><English>Print</English></Text>
        </Item>
    </Items>
</toolStrip1>
```

### Step 2: Create panelEditor with panelHeader

The panelHeader contains input controls mapped from master table columns.

```xml
<panelEditor>
    <panelHeader Name="panelHeader1">
        <Controls>
            {GeneratedControls}
        </Controls>
    </panelHeader>
</panelEditor>
```

### Step 3: Map Column Types to Controls

| Column Type | Control Type | Properties |
|---|---|---|
| VARCHAR | BravoTextBox | MaxLength from column size |
| NVARCHAR | BravoTextBox | MaxLength from column size |
| DATE | BravoDateInputBox | Format: dd/MM/yyyy |
| DATETIME | BravoDateInputBox | Format: dd/MM/yyyy HH:mm |
| INT (non-FK) | BravoQuantityInputBox | DecimalPlaces: 0 |
| INT (FK) | BravoLookupBox | LookupSource from FK target |
| DECIMAL | BravoQuantityInputBox | DecimalPlaces from scale |
| MONEY | BravoQuantityInputBox | DecimalPlaces: 2 |
| BIT | Checkbox | - |

### Step 4: Control Layout Positions

Controls are arranged in a grid layout within panelHeader:

```
Row 1: [Code]        [DocDate]
Row 2: [Customer]    [Product]
Row 3: [Amount]      [DocStatus]
```

Each control has position properties:
```xml
<Control>
    <Name>txtCode</Name>
    <ClassName>BravoTextBox</ClassName>
    <DataMember>Code</DataMember>
    <Location X="10" Y="10" />
    <Size Width="200" Height="25" />
    <Label Text="" />
</Control>
```

### Step 5: Create panelDetail with Grid

For document editors with detail lines:

```xml
<panelDetail>
    <BravoGridContainer Name="gridDetail">
        <DataMember>{DetailTableName}</DataMember>
        <Cols>
            {GeneratedDetailColumns}
        </Cols>
    </BravoGridContainer>
</panelDetail>
```

### Step 6: Set DataMember Bindings

- panelHeader controls bind to master table columns
- panelDetail grid binds to detail table
- Master-detail relationship via FK column (BizDocId)

---

## Control XML Templates

### TextBox Control

```xml
<Control>
    <Name>txt{Name}</Name>
    <Assembly>Bravo.Windows.Controls</Assembly>
    <ClassName>BravoTextBox</ClassName>
    <DataMember>{ColumnName}</DataMember>
    <Location X="{X}" Y="{Y}" />
    <Size Width="{Width}" Height="25" />
    <MaxLength>{MaxLength}</MaxLength>
    <Label>
        <Text>
            <Vietnamese>{ViLabel}</Vietnamese>
            <English>{EnLabel}</English>
        </Text>
    </Label>
</Control>
```

### DateInputBox Control

```xml
<Control>
    <Name>dtp{Name}</Name>
    <Assembly>Bravo.Windows.Controls</Assembly>
    <ClassName>BravoDateInputBox</ClassName>
    <DataMember>{ColumnName}</DataMember>
    <Location X="{X}" Y="{Y}" />
    <Size Width="150" Height="25" />
    <Format>dd/MM/yyyy</Format>
    <Label>
        <Text>
            <Vietnamese>{ViLabel}</Vietnamese>
            <English>{EnLabel}</English>
        </Text>
    </Label>
</Control>
```

### LookupBox Control

```xml
<Control>
    <Name>lkp{Name}</Name>
    <Assembly>Bravo.Windows.Controls</Assembly>
    <ClassName>BravoLookupBox</ClassName>
    <DataMember>{ColumnName}</DataMember>
    <Location X="{X}" Y="{Y}" />
    <Size Width="250" Height="25" />
    <LookupSource>{SourceEntity}</LookupSource>
    <DisplayMember>Name</DisplayMember>
    <ValueMember>Id</ValueMember>
    <Label>
        <Text>
            <Vietnamese>{ViLabel}</Vietnamese>
            <English>{EnLabel}</English>
        </Text>
    </Label>
</Control>
```

### QuantityInputBox Control

```xml
<Control>
    <Name>qty{Name}</Name>
    <Assembly>Bravo.Windows.Controls</Assembly>
    <ClassName>BravoQuantityInputBox</ClassName>
    <DataMember>{ColumnName}</DataMember>
    <Location X="{X}" Y="{Y}" />
    <Size Width="150" Height="25" />
    <DecimalPlaces>{Scale}</DecimalPlaces>
    <Format>N{Scale}</Format>
    <Label>
        <Text>
            <Vietnamese>{ViLabel}</Vietnamese>
            <English>{EnLabel}</English>
        </Text>
    </Label>
</Control>
```

---

## Complete Editor XML Template

```xml
<?xml version="1.0" encoding="utf-8"?>
<Layout>
    <toolStrip1>
        <Items>
            <Item Name="btnSave" BravoCommandKey="Save">
                <Text><Vietnamese>Luu</Vietnamese><English>Save</English></Text>
            </Item>
            <Item Name="btnCancel" BravoCommandKey="Cancel">
                <Text><Vietnamese>Huy</Vietnamese><English>Cancel</English></Text>
            </Item>
            <Item Name="btnPrint" BravoCommandKey="Print">
                <Text><Vietnamese>In</Vietnamese><English>Print</English></Text>
            </Item>
        </Items>
    </toolStrip1>
    <panelEditor>
        <panelHeader Name="panelHeader1">
            <Controls>
                {MasterControls}
            </Controls>
        </panelHeader>
        <panelDetail>
            <BravoGridContainer Name="gridDetail">
                <DataMember>{DetailTable}</DataMember>
                <Cols>
                    {DetailColumns}
                </Cols>
            </BravoGridContainer>
        </panelDetail>
    </panelEditor>
</Layout>
```

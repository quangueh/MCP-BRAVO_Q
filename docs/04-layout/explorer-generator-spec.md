# Explorer Layout Generator Specification

## Overview

The Explorer generator produces a complete layout XML for browsing and managing records in a grid view. Input is table metadata; output is a fully functional Explorer XML layout.

---

## Input

Table metadata object:

```json
{
  "TableName": "B20Customer",
  "DisplayName": "Customer",
  "Columns": [
    { "Name": "Id", "Type": "INT", "IsPK": true, "IsIdentity": true },
    { "Name": "Code", "Type": "VARCHAR(50)" },
    { "Name": "Name", "Type": "NVARCHAR(255)" },
    { "Name": "TaxCode", "Type": "VARCHAR(20)" },
    { "Name": "Address", "Type": "NVARCHAR(500)" },
    { "Name": "Phone", "Type": "VARCHAR(20)" },
    { "Name": "IsActive", "Type": "BIT" },
    { "Name": "CreatedBy", "Type": "NVARCHAR(50)" },
    { "Name": "CreatedDate", "Type": "DATETIME" },
    { "Name": "ModifiedBy", "Type": "NVARCHAR(50)" },
    { "Name": "ModifiedDate", "Type": "DATETIME" }
  ]
}
```

---

## Generation Steps

### Step 1: Create Root with toolStrip1

Generate the toolbar with standard action buttons.

```xml
<toolStrip1>
    <Items>
        <Item Name="btnAdd" Text="" BravoCommandKey="New">
            <Text>
                <Vietnamese>Them moi</Vietnamese>
                <English>Add</English>
            </Text>
        </Item>
        <Item Name="btnEdit" Text="" BravoCommandKey="Edit">
            <Text>
                <Vietnamese>Sua</Vietnamese>
                <English>Edit</English>
            </Text>
        </Item>
        <Item Name="btnDelete" Text="" BravoCommandKey="Delete">
            <Text>
                <Vietnamese>Xoa</Vietnamese>
                <English>Delete</English>
            </Text>
        </Item>
        <Item Name="btnRefresh" Text="" BravoCommandKey="Refresh">
            <Text>
                <Vietnamese>Tai lai</Vietnamese>
                <English>Refresh</English>
            </Text>
        </Item>
        <Item Name="btnSearch" Text="" BravoCommandKey="Search">
            <Text>
                <Vietnamese>Tim kiem</Vietnamese>
                <English>Search</English>
            </Text>
        </Item>
    </Items>
</toolStrip1>
```

### Step 2: Create panelExplorer with BravoTabControl

```xml
<panelExplorer>
    <BravoTabControl Name="tabMain">
        <Pages>
            <TabPage Name="tabPage1">
                <Text>
                    <Vietnamese>Danh sach</Vietnamese>
                    <English>List</English>
                </Text>
                <!-- Grid container goes here -->
            </TabPage>
        </Pages>
    </BravoTabControl>
</panelExplorer>
```

### Step 3: Create TabPage with BravoGridContainer

```xml
<BravoGridContainer Name="gridMain">
    <DataMember>{TableName}</DataMember>
    <Cols>
        <!-- Generated from columns -->
    </Cols>
</BravoGridContainer>
```

### Step 4: Generate Cols from Table Columns

For each column, apply column-mapping rules:

```xml
<Col Name="colCode" Header="">
    <Header>
        <Vietnamese>Ma</Vietnamese>
        <English>Code</English>
    </Header>
    <DataMember>Code</DataMember>
    <Width>150</Width>
    <TextAlign>LeftTop</TextAlign>
    <Visible>True</Visible>
    <ReadOnly>True</ReadOnly>
</Col>
```

### Step 5: Apply Styles

**Header style** (on every column):
```xml
<HeaderStyle>
    <BackColor>Navy</BackColor>
    <ForeColor>White</ForeColor>
    <Font>,11pt,style=Bold</Font>
</HeaderStyle>
```

**Detail style** (on every column):
```xml
<Style>
    <BackColor>White</BackColor>
    <ForeColor>Black</ForeColor>
</Style>
```

### Step 6: Set DataMember

Set `DataMember` on the grid container to the table name.

### Step 7: Add Tree View (if needed)

If the table has a `ParentId` column (self-referencing), add tree view properties:

```xml
<zTreeColName>Code</zTreeColName>
<zMakingTreeNodeKeyColName>Id</zMakingTreeNodeKeyColName>
```

---

## Complete XML Template

```xml
<?xml version="1.0" encoding="utf-8"?>
<Layout>
    <toolStrip1>
        <Items>
            <Item Name="btnAdd" BravoCommandKey="New">
                <Text><Vietnamese>Them moi</Vietnamese><English>Add</English></Text>
            </Item>
            <Item Name="btnEdit" BravoCommandKey="Edit">
                <Text><Vietnamese>Sua</Vietnamese><English>Edit</English></Text>
            </Item>
            <Item Name="btnDelete" BravoCommandKey="Delete">
                <Text><Vietnamese>Xoa</Vietnamese><English>Delete</English></Text>
            </Item>
            <Item Name="btnRefresh" BravoCommandKey="Refresh">
                <Text><Vietnamese>Tai lai</Vietnamese><English>Refresh</English></Text>
            </Item>
            <Item Name="btnSearch" BravoCommandKey="Search">
                <Text><Vietnamese>Tim kiem</Vietnamese><English>Search</English></Text>
            </Item>
        </Items>
    </toolStrip1>
    <panelExplorer>
        <BravoTabControl Name="tabMain">
            <Pages>
                <TabPage Name="tabPage1">
                    <Text><Vietnamese>Danh sach</Vietnamese><English>List</English></Text>
                    <BravoGridContainer Name="gridMain">
                        <DataMember>{TableName}</DataMember>
                        <Cols>
                            {GeneratedColumns}
                        </Cols>
                    </BravoGridContainer>
                </TabPage>
            </Pages>
        </BravoTabControl>
    </panelExplorer>
</Layout>
```

---

## Column Generation Algorithm

```
FOR each column in table metadata:
    1. Skip if column is audit AND not explicitly requested
    2. Determine Width from column type (column-mapping rules)
    3. Determine TextAlign from column type
    4. Determine Format from column type
    5. Set Visible=True (except Id, IsActive, audit)
    6. Set ReadOnly=True (for display-only grids)
    7. Generate Header multi-language text
    8. Apply HeaderStyle (Navy background, white text)
    9. Apply Style (white background, black text)
    10. Add SumColumns for DECIMAL/MONEY types
```

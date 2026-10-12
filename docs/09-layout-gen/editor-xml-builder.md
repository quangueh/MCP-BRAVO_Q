# Editor XML Builder

## Input

```typescript
interface EditorMetadata {
    tableName: string;
    displayName: string;
    columns: ColumnMetadata[];
    detailColumns?: ColumnMetadata[];
    detailTableName?: string;
    foreignKeys: ForeignKeyMetadata[];
    dataSourceName: string;
    module: string;
}
```

---

## Build Process

### Step 1: buildRoot()

Creates the root element.

```xml
<root xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
      xsi:noNamespaceSchemaLocation="Editor.xsd">
```

### Step 2: buildToolStrip()

Adds Editor-specific toolbar buttons.

```xml
<ToolStrip Name="tsEditor">
    <Button Name="btnSave" Text="Ghi" Icon="Save" />
    <Button Name="btnDelete" Text="Xoa" Icon="Delete" />
    <Button Name="btnPrint" Text="In" Icon="Print" />
    <Button Name="btnNew" Text="Them moi" Icon="Add" />
</ToolStrip>
```

### Step 3: buildPanelEditor()

Creates the Editor panel structure with header and detail sections.

```xml
<PanelEditor Name="peMain">
    <BravoTabControl Name="tcMain">
        <TabPages>
            <TabPage Name="tabHeader" Text="Thong tin chung">
                <PanelHeader Name="phHeader">
                </PanelHeader>
            </TabPage>
            <TabPage Name="tabDetail" Text="Chi tiet">
                <PanelDetail Name="pdDetail">
                </PanelDetail>
            </TabPage>
        </TabPages>
    </BravoTabControl>
</PanelEditor>
```

### Step 4: buildHeaderControls()

Maps columns to UI controls based on data type.

| Column Type | Control | Example |
|---|---|---|
| VARCHAR/NVARCHAR | BravoTextBox | CustomerCode, CustomerName |
| DATE/DATETIME | BravoDateInputBox | InvoiceDate, DueDate |
| FK (column ends with Id) | BravoLookupBox | CustomerId, ProductId |
| MONEY/DECIMAL | BravoQuantityInputBox | Amount, Price |
| INT (non-FK) | BravoQuantityInputBox | Quantity, Count |
| BIT | BravoTextBox | IsActive |

```xml
<BravoTextBox Name="txtCustomerCode" 
    Caption="Ma khach hang"
    DataField="CustomerCode"
    MaxLength="50"
    Width="200" />
```

### Step 5: buildDetailGrid()

Creates BravoGridContainer for line items when the editor has detail records.

```xml
<BravoGridContainer Name="gcDetail"
    Assembly="Bravo.DataEditor"
    ClassName="BravoEditorGridControl"
    Dock="Fill">
    <DataMember>InvoiceDetail</DataMember>
    <Cols>
        <Col Name="LineNumber" Caption="STT" Width="50" 
             Style="CenterTop" />
        <Col Name="ProductCode" Caption="Ma SP" Width="120" 
             Style="LeftTop" />
        <Col Name="ProductName" Caption="Ten SP" Width="200" 
             Style="LeftTop" />
        <Col Name="Quantity" Caption="SL" Width="80" 
             Style="RightTop" Format="N0" />
        <Col Name="UnitPrice" Caption="Don gia" Width="120" 
             Style="RightTop" Format="N2" />
        <Col Name="Amount" Caption="Thanh tien" Width="120" 
             Style="RightTop" Format="N2" />
    </Cols>
</BravoGridContainer>
```

### Step 6: buildLookupBindings()

Sets LookupSource for all BravoLookupBox controls.

| FK Column Pattern | LookupSource |
|---|---|
| CustomerId | Customer |
| ProductId | Item |
| VendorId | Vendor |
| EmployeeId | Employee |
| CurrencyCode | Currency |
| WarehouseId | Warehouse |
| ClassId | ClassInfo |
| BizDocId | BizDoc |

```xml
<LookupSource Name="Customer">
    <Source>vw_CustomerLookup</Source>
    <KeyField>CustomerId</KeyField>
    <DisplayField>CustomerName</DisplayField>
    <CodeField>CustomerCode</CodeField>
</LookupSource>
```

### Step 7: buildComplete()

Validates and returns XML string.

Validation checks:
1. Root element exists
2. All DataField references match actual column names
3. All LookupSource references have matching bindings
4. No duplicate control names
5. Required fields are marked

---

## Complete Output Example

```xml
<?xml version="1.0" encoding="utf-8"?>
<root xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
      xsi:noNamespaceSchemaLocation="Editor.xsd">

    <ToolStrip Name="tsEditor">
        <Button Name="btnSave" Text="Ghi" Icon="Save" />
        <Button Name="btnDelete" Text="Xoa" Icon="Delete" />
        <Button Name="btnPrint" Text="In" Icon="Print" />
        <Button Name="btnNew" Text="Them moi" Icon="Add" />
    </ToolStrip>

    <PanelEditor Name="peMain">
        <BravoTabControl Name="tcMain">
            <TabPages>
                <TabPage Name="tabHeader" Text="Thong tin chung">
                    <PanelHeader Name="phHeader">
                        <BravoTextBox Name="txtInvoiceNo" 
                            Caption="So hoa don"
                            DataField="InvoiceNo"
                            MaxLength="20"
                            Width="150" />
                        <BravoDateInputBox Name="dtpInvoiceDate" 
                            Caption="Ngay hoa don"
                            DataField="InvoiceDate"
                            Format="dd/MM/yyyy"
                            Width="150" />
                        <BravoLookupBox Name="lkbCustomer" 
                            Caption="Khach hang"
                            DataField="CustomerId"
                            LookupSource="Customer"
                            Width="250" />
                        <BravoQuantityInputBox Name="numTotalAmount" 
                            Caption="Tong tien"
                            DataField="TotalAmount"
                            Format="N2"
                            Width="150" />
                    </PanelHeader>
                </TabPage>
                <TabPage Name="tabDetail" Text="Chi tiet">
                    <PanelDetail Name="pdDetail">
                        <BravoGridContainer Name="gcDetail"
                            Assembly="Bravo.DataEditor"
                            ClassName="BravoEditorGridControl"
                            Dock="Fill">
                            <DataMember>InvoiceDetail</DataMember>
                            <Cols>
                                <Col Name="LineNumber" Caption="STT" 
                                     Width="50" Style="CenterTop" />
                                <Col Name="ProductName" Caption="San pham" 
                                     Width="200" Style="LeftTop" />
                                <Col Name="Quantity" Caption="So luong" 
                                     Width="80" Style="RightTop" 
                                     Format="N0" />
                                <Col Name="UnitPrice" Caption="Don gia" 
                                     Width="120" Style="RightTop" 
                                     Format="N2" />
                            </Cols>
                        </BravoGridContainer>
                    </PanelDetail>
                </TabPage>
            </TabPages>
        </BravoTabControl>
    </PanelEditor>

    <LookupSources>
        <LookupSource Name="Customer">
            <Source>vw_CustomerLookup</Source>
            <KeyField>CustomerId</KeyField>
            <DisplayField>CustomerName</DisplayField>
            <CodeField>CustomerCode</CodeField>
        </LookupSource>
    </LookupSources>
</root>
```

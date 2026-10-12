# Explorer XML Builder

## Input

```typescript
interface ExplorerMetadata {
    tableName: string;
    displayName: string;
    columns: ColumnMetadata[];
    hasTreeView: boolean;
    treeColumnName?: string;
    dataSourceName: string;
    module: string;
}
```

---

## Build Process

### Step 1: buildRoot()

Creates the `<root>` element with Explorer-specific attributes.

```xml
<root showCommandButtons="Custom" 
      xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
      xsi:noNamespaceSchemaLocation="Explorer.xsd">
```

Key attributes:
- `showCommandButtons="Custom"` - Uses custom toolbar instead of default

### Step 2: buildToolStrip()

Adds standard Explorer toolbar buttons using the `explorer-toolbar.ejs` template.

```xml
<ToolStrip Name="tsExplorer">
    <Button Name="btnAdd" Text="Them" Icon="Add" />
    <Button Name="btnEdit" Text="Sua" Icon="Edit" />
    <Button Name="btnDelete" Text="Xoa" Icon="Delete" />
    <Button Name="btnRefresh" Text="Lam moi" Icon="Refresh" />
    <Button Name="btnPrint" Text="In" Icon="Print" />
    <Button Name="btnExport" Text="Xuat" Icon="Export" />
</ToolStrip>
```

### Step 3: buildPanelExplorer()

Creates `BravoTabControl` with `TabPages`.

```xml
<PanelExplorer Name="peMain">
    <BravoTabControl Name="tcMain">
        <TabPages>
            <TabPage Name="tabList" Text="Danh sach">
                <!-- Grid goes here -->
            </TabPage>
        </TabPages>
    </BravoTabControl>
</PanelExplorer>
```

### Step 4: buildGridContainer()

Creates `BravoGridContainer` with Explorer assembly references.

```xml
<BravoGridContainer Name="gcMain"
    Assembly="Bravo.DataExplorer"
    ClassName="BravoExplorerControl"
    Dock="Fill">
```

Key attributes:
- `Assembly="Bravo.DataExplorer"` - Standard Explorer assembly
- `ClassName="BravoExplorerControl"` - Standard Explorer control class

### Step 5: buildCols()

Generates column definitions from `metadata.columns` using the style mapping engine.

```xml
<Cols>
    <Col Name="Code" Caption="Ma" Width="120" 
         Style="LeftTop" />
    <Col Name="Name" Caption="Ten" Width="200" 
         Style="LeftTop" />
    <Col Name="Amount" Caption="So tien" Width="120" 
         Style="RightTop" Format="N2" />
    <Col Name="DateCreated" Caption="Ngay tao" Width="100" 
         Style="CenterTop" Format="dd/MM/yy" />
</Cols>
```

Column generation rules:
- Each column from metadata is mapped to a `<Col>` element
- Style is determined by the Style Engine (see [style-engine.md](style-engine.md))
- Width is calculated based on data type and typical content length
- Format string is set for numeric and date columns

### Step 6: buildDataMember()

Sets the data source binding.

```xml
<DataMember>vw_CustomerExplorer</DataMember>
```

The DataMember binds to the corresponding DataSource XML table or view name.

### Step 7: buildTreeConfig()

Adds tree view configuration when `hasTreeView` is true.

```xml
<!-- Only included when hasTreeView = true -->
<zTreeColName>ParentCode</zTreeColName>
```

### Step 8: buildComplete()

Validates and returns the final XML string.

Validation checks:
1. Root element exists with required attributes
2. At least one column is defined
3. DataMember is set
4. No duplicate control names
5. All referenced styles are defined

---

## Complete Output Example

```xml
<?xml version="1.0" encoding="utf-8"?>
<root showCommandButtons="Custom"
      xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
      xsi:noNamespaceSchemaLocation="Explorer.xsd">

    <ToolStrip Name="tsExplorer">
        <Button Name="btnAdd" Text="Them" Icon="Add" />
        <Button Name="btnEdit" Text="Sua" Icon="Edit" />
        <Button Name="btnDelete" Text="Xoa" Icon="Delete" />
        <Button Name="btnRefresh" Text="Lam moi" Icon="Refresh" />
        <Button Name="btnPrint" Text="In" Icon="Print" />
        <Button Name="btnExport" Text="Xuat" Icon="Export" />
    </ToolStrip>

    <PanelExplorer Name="peMain">
        <BravoTabControl Name="tcMain">
            <TabPages>
                <TabPage Name="tabList" Text="Danh sach">
                    <BravoGridContainer Name="gcMain"
                        Assembly="Bravo.DataExplorer"
                        ClassName="BravoExplorerControl"
                        Dock="Fill">
                        <DataMember>vw_CustomerExplorer</DataMember>
                        <Cols>
                            <Col Name="CustomerCode" Caption="Ma KH" 
                                 Width="120" Style="LeftTop" />
                            <Col Name="CustomerName" Caption="Ten KH" 
                                 Width="200" Style="LeftTop" />
                            <Col Name="Phone" Caption="Dien thoai" 
                                 Width="120" Style="LeftTop" />
                            <Col Name="Balance" Caption="So du" 
                                 Width="120" Style="RightTop" Format="N2" />
                            <Col Name="CreatedDate" Caption="Ngay tao" 
                                 Width="100" Style="CenterTop" 
                                 Format="dd/MM/yy" />
                        </Cols>
                    </BravoGridContainer>
                </TabPage>
            </TabPages>
        </BravoTabControl>
    </PanelExplorer>
</root>
```

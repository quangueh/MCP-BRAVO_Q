# Bravo Tag Handbook

Tài liệu này là catalog các thẻ/thuộc tính Bravo thường gặp để AI đọc hiểu và sinh/sửa XML. Tên thẻ thực tế có thể thay đổi theo version/customization, nên luôn đối chiếu với layout mẫu trong `knowledge/` nếu có.

## Nhóm Gốc

| Thẻ | Vai trò | Ghi chú |
| --- | --- | --- |
| `root` | Gốc layout XML phổ biến | Chứa toolbar, panel, control, grid, tab. |
| `DataSource` | Gốc DataSource XML | Mô tả bảng/view/SP, source lookup, command, validator. |
| `TableCollection` | Danh sách nguồn dữ liệu chính | Mỗi node con thường là alias như `Ct`, `Ct0`, `Detail`. |
| `SourceCollection` | Danh sách nguồn phụ/lookup | Dùng cho combobox/lookup/filter. |
| `CommandCollection` | Lệnh insert/update/delete/save/process | Có thể gọi SQL text hoặc stored procedure. |
| `Evaluators` | Logic sự kiện/tính toán | Gắn command với action, điều kiện, validator. |
| `Validators` | Luật kiểm tra dữ liệu | Required, range, unique, FK, custom expression. |

## DataSource Tags

### `TableCollection`

`TableCollection` định nghĩa các dataset mà Layout sử dụng qua `DataMember`.

Ví dụ:

```xml
<TableCollection>
  <Ct>
    <Name>B20Customer</Name>
    <Columns>Ct.*</Columns>
    <FilterKey>IsActive=1</FilterKey>
    <Sort>Code</Sort>
  </Ct>
</TableCollection>
```

Ý nghĩa:

| Thẻ con | Vai trò | Lưu ý |
| --- | --- | --- |
| `Name` | Tên bảng/view/SP nguồn | Có thể là table, view hoặc proc tùy form. |
| `Columns` | Danh sách cột select | `Ct.*` nhanh nhưng khó kiểm soát; form chuẩn nên rõ field cần dùng. |
| `FilterKey` | Điều kiện lọc mặc định | Cần giữ branch/user/security nếu môi trường có phân quyền. |
| `Sort` | Sắp xếp mặc định | Explorer/report hay dùng `DocDate DESC`, `Code`. |
| `DataMember` | Alias bind từ layout | Trong nhiều form alias là tên node như `Ct`. |

### `SourceCollection`

Dùng cho lookup, combobox, popup chọn dữ liệu.

```xml
<SourceCollection>
  <Customer>
    <Source>vB20Customer</Source>
    <KeyField>Id</KeyField>
    <CodeField>Code</CodeField>
    <DisplayField>Name</DisplayField>
    <FilterKey>IsActive=1</FilterKey>
  </Customer>
</SourceCollection>
```

Checklist:

- `KeyField` phải khớp field lưu trong bảng chính.
- `CodeField`/`DisplayField` nên là field người dùng dễ nhận diện.
- Lookup theo danh mục B20 thường cần `IsActive=1`.

### `CommandCollection`

Chứa lệnh ghi dữ liệu hoặc chạy nghiệp vụ.

```xml
<CommandCollection>
  <Save>
    <CommandType>StoredProcedure</CommandType>
    <CommandText>usp_Form_Save</CommandText>
  </Save>
</CommandCollection>
```

Checklist:

- Editor cần đường save rõ ràng.
- Command gọi SP phải kiểm tra tham số: user, branch, lang, doc id, doc status.
- Không tự sinh command ghi/xóa nếu yêu cầu chỉ là đọc/báo cáo.

### `Evaluators`

Gắn sự kiện UI với command hoặc expression.

```xml
<Evaluators>
  <Save>
    <CommandKey>Save</CommandKey>
    <Validators>RequiredFields</Validators>
    <Command>Save</Command>
  </Save>
</Evaluators>
```

AI cần kiểm tra evaluator khi nút có trên toolbar nhưng bấm không chạy, hoặc command có nhưng không được gọi.

### `Validators`

Kiểm tra dữ liệu trước khi lưu.

```xml
<Validators>
  <RequiredDocDate>
    <Field>DocDate</Field>
    <Rule>Required</Rule>
    <Message>
      <Vietnamese>Ngay chung tu khong duoc de trong</Vietnamese>
      <English>Document date is required</English>
    </Message>
  </RequiredDocDate>
</Validators>
```

Các rule thường gặp:

| Rule | Dùng khi |
| --- | --- |
| `Required` | Field bắt buộc nhập. |
| `Range` | Số lượng, đơn giá, tỷ lệ. |
| `Format` | Email, mã, ngày, số chứng từ. |
| `Unique` | Mã danh mục/chứng từ không trùng. |
| `FKIntegrity` | Field phải tồn tại trong bảng danh mục. |

## Layout Tags

### `toolStrip1` / `ToolStrip`

Thanh lệnh của form.

```xml
<toolStrip1>
  <Items>
    <New />
    <Edit />
    <Save />
    <Delete />
    <Refresh />
  </Items>
</toolStrip1>
```

Các command phổ biến: `New`, `Edit`, `Save`, `Delete`, `Refresh`, `Print`, `Export`, `Approve`, `Reject`, `Post`, `Unpost`.

### `PanelExplorer`

Vùng chính của màn hình danh sách.

```xml
<PanelExplorer>
  <Controls>
    <BravoGridContainer>
      <Assembly>Bravo.DataExplorer</Assembly>
      <ClassName>BravoExplorerControl</ClassName>
      <DataMember>Ct</DataMember>
    </BravoGridContainer>
  </Controls>
</PanelExplorer>
```

Explorer thường cần:

- Grid chính.
- `DataMember` trỏ tới alias trong DataSource.
- Cột mã, tên, ngày, trạng thái, số tiền hoặc thông tin nghiệp vụ chính.

### `PanelEditor`

Vùng nhập liệu của màn hình editor.

```xml
<PanelEditor>
  <Controls>
    <BravoTextBox>
      <DataMember>DocNo</DataMember>
    </BravoTextBox>
  </Controls>
</PanelEditor>
```

Editor thường cần:

- Header fields: `DocNo`, `DocDate`, `Description`, `CustomerId`, `DeptId`, `EmployeeId`.
- Detail grid nếu chứng từ có dòng chi tiết.
- Save command/evaluator/validator.

### `BravoGridContainer`

Grid danh sách hoặc detail.

```xml
<BravoGridContainer>
  <Assembly>Bravo.DataExplorer</Assembly>
  <ClassName>BravoExplorerControl</ClassName>
  <DataMember>Ct</DataMember>
  <Cols>
    <DocNo>
      <Width>120</Width>
      <Style>TextAlign:LeftTop;</Style>
      <Rows>
        <Row_0>
          <Text>
            <Vietnamese>So chung tu</Vietnamese>
            <English>Doc No.</English>
          </Text>
        </Row_0>
      </Rows>
    </DocNo>
  </Cols>
</BravoGridContainer>
```

Thẻ con quan trọng:

| Thẻ | Vai trò |
| --- | --- |
| `Assembly` | Module control Bravo, ví dụ `Bravo.DataExplorer`, `Bravo.DataEditor`. |
| `ClassName` | Class control, ví dụ `BravoExplorerControl`, `BravoEditorGridControl`. |
| `DataMember` | Alias dữ liệu bind vào grid. |
| `Cols` | Danh sách cột hiển thị. |
| `Rows` | Header nhiều dòng/đa ngôn ngữ. |
| `Width` | Độ rộng cột. |
| `Style` | Căn lề, màu, font, format. |
| `Format` | Format số/ngày nếu tách riêng khỏi Style. |

### `Cols` Và Cột Grid

Mỗi thẻ con trong `Cols` thường là tên field.

```xml
<Cols>
  <Code>
    <Width>120</Width>
    <Style>TextAlign:LeftTop;</Style>
  </Code>
  <Amount>
    <Width>120</Width>
    <Style>TextAlign:RightTop;Format:"N2";</Style>
  </Amount>
</Cols>
```

Mapping nên dùng:

| Loại field | Style/Format |
| --- | --- |
| Mã, tên, diễn giải | `TextAlign:LeftTop;` |
| Ngày | `TextAlign:CenterTop;Format:"dd/MM/yyyy";` |
| Số lượng, tiền | `TextAlign:RightTop;Format:"N0"` hoặc `N2`. |
| Trạng thái | Center hoặc lookup text. |
| Checkbox/bit | Center. |

### `BravoTextBox`

Input text thường dùng cho mã, tên, diễn giải ngắn.

```xml
<BravoTextBox>
  <DataMember>Description</DataMember>
  <Width>300</Width>
</BravoTextBox>
```

### `BravoDateInputBox`

Input ngày.

```xml
<BravoDateInputBox>
  <DataMember>DocDate</DataMember>
  <Format>dd/MM/yyyy</Format>
</BravoDateInputBox>
```

### `BravoQuantityInputBox`

Input số lượng, tỷ lệ, tiền.

```xml
<BravoQuantityInputBox>
  <DataMember>Amount</DataMember>
  <Format>N2</Format>
</BravoQuantityInputBox>
```

### `BravoLookupBox`

Lookup danh mục.

```xml
<BravoLookupBox>
  <DataMember>CustomerId</DataMember>
  <LookupSource>Customer</LookupSource>
  <LookupKey>Id</LookupKey>
  <LookupText>Name</LookupText>
</BravoLookupBox>
```

Checklist:

- `LookupSource` phải tồn tại trong DataSource.
- `DataMember` là field lưu key.
- `LookupKey` là key trả về.
- `LookupText`/display field là tên hiển thị.

### `BravoTabControl`, `TabPages`, `TabPage`

Dùng chia màn hình thành tab.

```xml
<BravoTabControl>
  <TabPages>
    <TabPage Name="tabHeader" Text="Thong tin chung" />
    <TabPage Name="tabDetail" Text="Chi tiet" />
  </TabPages>
</BravoTabControl>
```

### `Rows`, `Row_0`, `Text`, `Vietnamese`, `English`

Dùng cho header, label đa ngôn ngữ.

```xml
<Rows>
  <Row_0>
    <Text>
      <Vietnamese>Ngay chung tu</Vietnamese>
      <English>Doc Date</English>
    </Text>
  </Row_0>
</Rows>
```

AI nên giữ tiếng Việt không dấu nếu file mẫu đang dùng không dấu.

## Thuộc Tính/Thẻ Phổ Biến

| Tên | Vai trò |
| --- | --- |
| `Name` | Tên control/dataset/source. |
| `Text` | Caption hiển thị. |
| `DataMember` | Field hoặc dataset alias được bind. |
| `Assembly` | Assembly chứa control. |
| `ClassName` | Class control. |
| `Width`, `Height` | Kích thước control/cột. |
| `Visible` | Ẩn/hiện. |
| `ReadOnly` | Chỉ đọc. |
| `Enabled` | Cho phép thao tác. |
| `Style` | Chuỗi style Bravo. |
| `Format` | Định dạng số/ngày. |
| `FilterKey` | Điều kiện lọc. |
| `Sort` | Sắp xếp. |
| `LookupKey`, `FilterKey`, `Source` | Cấu hình lookup/lọc dữ liệu. |

## Mẫu Explorer Tối Thiểu

```xml
<root>
  <toolStrip1>
    <Items>
      <New />
      <Edit />
      <Refresh />
    </Items>
  </toolStrip1>
  <PanelExplorer>
    <Controls>
      <BravoGridContainer>
        <Assembly>Bravo.DataExplorer</Assembly>
        <ClassName>BravoExplorerControl</ClassName>
        <DataMember>Ct</DataMember>
        <Cols>
          <Code><Width>120</Width></Code>
          <Name><Width>240</Width></Name>
          <IsActive><Width>80</Width></IsActive>
        </Cols>
      </BravoGridContainer>
    </Controls>
  </PanelExplorer>
</root>
```

## Mẫu DataSource Tối Thiểu

```xml
<DataSource>
  <TableCollection>
    <Ct>
      <Name>B20Sample</Name>
      <Columns>Ct.*</Columns>
      <FilterKey>IsActive=1</FilterKey>
      <Sort>Code</Sort>
    </Ct>
  </TableCollection>
</DataSource>
```

## Lỗi Hay Gặp

| Hiện tượng | Nguyên nhân thường gặp | Cách kiểm tra |
| --- | --- | --- |
| Grid trắng | `DataMember` không khớp alias trong `TableCollection` | So sánh `DataMember` và node alias. |
| Lookup không lên dữ liệu | Thiếu `SourceCollection` hoặc sai key/display | Kiểm tra source, key, field hiển thị. |
| Bấm Save không chạy | Thiếu command/evaluator | Kiểm tra `CommandCollection` và `Evaluators`. |
| Cột lỗi/blank | Field không có trong dataset | Kiểm tra `Columns`, view/SP output. |
| Lọc sai chi nhánh | `FilterKey` thiếu branch/user condition | So với form mẫu cùng module. |
| Sai format tiền/ngày | `Style` hoặc `Format` sai | Kiểm tra field type và format mẫu. |

## Khi AI Sinh XML

1. Bắt đầu từ form mẫu gần nhất.
2. Giữ cấu trúc panel/grid/tab theo mẫu.
3. Thêm field vào DataSource trước, rồi mới bind Layout.
4. Với lookup, thêm source và control cùng lúc.
5. Với save/process, thêm command, evaluator, validator cùng lúc.
6. Không tự thêm nghiệp vụ ghi dữ liệu nếu chưa rõ SP/table đích.

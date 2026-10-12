class LayoutGenerator {
  generateExplorer(metadata, formName) {
    let xml = '<?xml version="1.0" encoding="utf-8"?>
';
    xml += '<root>
';
    xml += '  <toolStrip1>
    <Items>
      <New />
      <_SEPARATOR_0 />
      <Edit />
      <_SEPARATOR_1 />
      <Save />
      <_SEPARATOR_2 />
      <Refresh />
    </Items>
  </toolStrip1>
';
    xml += '  <menuStrip1>
    <Items>
      <_MENU_0>
        <Text><Vietnamese>Du lieu</Vietnamese><English>Edit</English></Text>
        <Items><New /><Edit /><_SEPARATOR_0 /><Save /><_SEPARATOR_1 /><Refresh /><_SEPARATOR_2 /><Import /><Export /></Items>
      </_MENU_0>
    </Items>
  </menuStrip1>
';
    xml += '  <panelExplorer>
    <Rows><Row_0><SizeType>Percent</SizeType><Height>100</Height></Row_0></Rows>
    <Controls>
      <BravoTabControl>
        <Pages>
          <Ct>
            <Text><Vietnamese>' + formName + '</Vietnamese><English>' + formName + '</English></Text>
            <AutoSize>True</AutoSize>
            <Controls>
              <BravoGridContainer>
                <Assembly>Bravo.DataExplorer</Assembly>
                <ClassName>BravoExplorerControl</ClassName>
                <DataMember>Ct</DataMember>
                <Rows><Row_0><Height>20</Height></Row_0></Rows>
                <Cols>
';
    xml += '                  <DocNo><Width>120</Width><Style>TextAlign:LeftTop;</Style><Rows><Row_0><Text><Vietnamese>So chung tu</Vietnamese><English>Doc No.</English></Text></Row_0></Rows></DocNo>
';
    xml += '                  <DocDate><Width>100</Width><Style>Format:dd/MM/yyyy;</Style><Rows><Row_0><Text><Vietnamese>Ngay</Vietnamese><English>Date</English></Text></Row_0></Rows></DocDate>
';
    xml += '                  <Description><Width>300</Width><Style>TextAlign:LeftTop;</Style><Rows><Row_0><Text><Vietnamese>Dien giai</Vietnamese><English>Description</English></Text></Row_0></Rows></Description>
';
    xml += '                  <DocStatusName><Width>120</Width><Style>TextAlign:LeftTop;</Style><Rows><Row_0><Text><Vietnamese>Trang thai</Vietnamese><English>Status</English></Text></Row_0></Rows></DocStatusName>
';
    xml += '                  <CreatedByName><Width>150</Width><Style>TextAlign:LeftTop;</Style><Rows><Row_0><Text><VietnameseNguoi lap</Vietnamese><English>Created By</English></Text></Row_0></Rows></CreatedByName>
';
    xml += '                </Cols>
              </BravoGridContainer>
            </Controls>
          </Ct>
        </Pages>
      </BravoTabControl>
    </Controls>
  </panelExplorer>
</root>';
    return xml;
  }

  generateDataSource(metadata, formName) {
    let xml = '<?xml version="1.0" encoding="utf-8"?>
';
    xml += '<root>
  <TableCollection>
    <Ct>
';
    xml += '      <Name>v' + formName + '</Name>
';
    xml += '      <Columns>Ct.*</Columns>
';
    xml += '      <Sort>DocDate DESC</Sort>
';
    xml += '      <FilterKey>BranchCode='{=BRANCH()}' AND IsActive=1</FilterKey>
';
    if (metadata.lookups && metadata.lookups.length > 0) {
      xml += '      <Evaluators>
';
      xml += '        <Eval_Editor><ClassName>BravoCommandKey</ClassName><CommandKey>EDIT_' + formName + '</CommandKey><zCtorArgs>PrimaryKeyValue={=ISNULL(Id,-1)};</zCtorArgs><Expr>LastCommand() IN('Open')</Expr></Eval_Editor>
';
      xml += '      </Evaluators>
';
    }
    xml += '    </Ct>
  </TableCollection>
</root>';
    return xml;
  }
}
module.exports = LayoutGenerator;
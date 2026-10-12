import { LayoutMetadata } from '../../../shared/types';

export function generateLayoutXml(metadata: LayoutMetadata): string {
  switch (metadata.layoutType) {
    case 'Explorer': return generateExplorerLayout(metadata);
    case 'Editor': return generateEditorLayout(metadata);
    case 'Report': return generateReportLayout(metadata);
    default: return generateExplorerLayout(metadata);
  }
}

function generateExplorerLayout(m: LayoutMetadata): string {
  let xml = '<?xml version="1.0" encoding="utf-8"?>
';
  xml += '<root>
';
  xml += '  <toolStrip1>
    <Items>
';
  xml += '      <BravoToolStripButton Name="btnAdd" Text="Add" />
';
  xml += '      <BravoToolStripButton Name="btnEdit" Text="Edit" />
';
  xml += '      <BravoToolStripButton Name="btnDelete" Text="Delete" />
';
  xml += '    </Items>
  </toolStrip1>
';
  xml += '  <panelExplorer>
    <Controls>
';
  xml += '      <BravoTabControl Name="tabMain">
        <Pages>
';
  xml += '          <TabPage Name="tabList">
            <Controls>
';
  xml += '              <BravoGridContainer Name="gridMain" Assembly="Bravo.DataExplorer" ClassName="BravoExplorerControl">
';
  xml += '                <DataMember>' + (m.sourceTable || '') + '</DataMember>
';
  xml += '                <Items>
                  <ChildTable>
                    <Cols>
';
  for (const col of m.columns) {
    if (!col.visible) continue;
    xml += '                      <' + col.name + '>
';
    xml += '                        <Width>' + col.width + '</Width>
';
    xml += '                        <Visible>True</Visible>
';
    xml += '                        <Style>TextAlign:' + col.textAlign + ';</Style>
';
    xml += '                        <Rows>
                          <Row_0>
';
    xml += '                            <Text><Vietnamese>' + col.headerText + '</Vietnamese></Text>
';
    xml += '                            <Style>BackColor:Navy;ForeColor:White;</Style>
';
    xml += '                          </Row_0>
                        </Rows>
';
    xml += '                      </' + col.name + '>
';
  }
  xml += '                    </Cols>
                  </ChildTable>
';
  xml += '                </Items>
              </BravoGridContainer>
';
  xml += '            </Controls>
          </TabPage>
';
  xml += '        </Pages>
      </BravoTabControl>
';
  xml += '    </Controls>
  </panelExplorer>
</root>';
  return xml;
}

function generateEditorLayout(m: LayoutMetadata): string {
  let xml = '<?xml version="1.0" encoding="utf-8"?>
<root>
';
  xml += '  <panelEditor>
    <Controls>
      <panelHeader>
        <Controls>
';
  for (const ctrl of m.controls) {
    xml += '          <' + ctrl.type + ' Name="' + ctrl.name + '" DataMember="' + ctrl.dataMember + '" Width="' + ctrl.width + '" />
';
  }
  xml += '        </Controls>
      </panelHeader>
    </Controls>
  </panelEditor>
</root>';
  return xml;
}

function generateReportLayout(m: LayoutMetadata): string {
  let xml = '<?xml version="1.0" encoding="utf-8"?>
<root>
';
  xml += '  <panelReporter>
    <Controls>
      <Report_0>
        <Content>
';
  xml += '          <DataMember>' + (m.dataSource.tableName || 'Table1') + '</DataMember>
';
  xml += '          <Cols>
';
  for (const col of m.columns) {
    if (!col.visible) continue;
    xml += '            <' + col.name + '>
';
    xml += '              <Width>' + col.width + '</Width>
';
    xml += '              <Visible>True</Visible>
';
    xml += '            </' + col.name + '>
';
  }
  xml += '          </Cols>
        </Content>
      </Report_0>
    </Controls>
  </panelReporter>
</root>';
  return xml;
}

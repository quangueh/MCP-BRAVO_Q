import { LayoutMetadata, TableSchema } from '../../../shared/types';

export function generateDataSourceXml(metadata: LayoutMetadata, schemas: TableSchema[]): string {
  const mainTable = schemas.find((s) => s.tableName === metadata.sourceTable) || schemas[0];
  if (!mainTable) return '<!-- No table found -->';
  const tableName = mainTable.tableName;
  const editCols = mainTable.columns.filter((c) => !c.isIdentity && !['CreatedBy','CreatedDate','ModifiedBy','ModifiedDate'].includes(c.name));
  const fkCols = mainTable.columns.filter((c) => c.isFk);
  let xml = '<?xml version="1.0" encoding="utf-8"?>
';
  xml += '<DataSource>
';
  xml += '  <TableCollection>
';
  xml += '    <Ct Name="Ct" Source="' + tableName + '" Type="Table" />
';
  xml += '  </TableCollection>
';
  if (fkCols.length > 0) {
    xml += '  <JoinCollection>
';
    for (const fk of fkCols) {
      const target = fk.name.replace(/Id$/, '');
      const t = schemas.find((s) => s.tableName.includes(target));
      if (t) xml += '    <Join Name="' + target + '" Type="Left" Source="Ct" Column="' + fk.name + '" Target="' + t.tableName + '" TargetColumn="Id" />
';
    }
    xml += '  </JoinCollection>
';
  }
  xml += '  <CommandCollection>
';
  xml += '    <Command Name="Insert" Type="Insert" Target="Ct">
';
  xml += '      <Parameters>
';
  for (const col of editCols) xml += '        <Parameter Name="' + col.name + '" SourceColumn="' + col.name + '" />
';
  xml += '      </Parameters>
';
  xml += '    </Command>
';
  xml += '  </CommandCollection>
';
  xml += '</DataSource>';
  return xml;
}

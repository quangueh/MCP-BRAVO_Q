import { LayoutMetadata, TableSchema } from '../../../shared/types';

export function generateCrudSp(metadata: LayoutMetadata, schemas: TableSchema[]): string {
  const mainTable = schemas.find((s) => s.tableName === metadata.sourceTable) || schemas[0];
  if (!mainTable) return '-- No table found for SP generation\n';

  const tableName = mainTable.tableName;
  const pkCol = mainTable.primaryKey.columns[0] || 'Id';
  const editableCols = mainTable.columns.filter((c) => !c.isIdentity && !['CreatedBy', 'CreatedDate', 'ModifiedBy', 'ModifiedDate'].includes(c.name));

  let sp = '';

  // SELECT SP
  sp += `CREATE PROCEDURE [dbo].[usp_${tableName}_Select]\n`;
  sp += `  @_${pkCol} ${getPkType(mainTable)} = NULL\n`;
  sp += `AS\nBEGIN\n  SET NOCOUNT ON;\n\n`;
  sp += `  SELECT * FROM [dbo].[${tableName}]\n`;
  sp += `  WHERE [IsActive] = 1\n`;
  sp += `    AND (@_${pkCol} IS NULL OR [${pkCol}] = @_${pkCol})\n`;
  sp += `  ORDER BY [${pkCol}];\nEND\nGO\n\n`;

  // INSERT SP
  sp += `CREATE PROCEDURE [dbo].[usp_${tableName}_Insert]\n`;
  for (const col of editableCols) {
    sp += `  @${col.name} ${getColType(col)}${col.nullable ? ' = NULL' : ''},\n`;
  }
  sp += `  @_${pkCol} ${getPkType(mainTable)} OUTPUT\n`;
  sp += `AS\nBEGIN\n  SET NOCOUNT ON;\n\n`;
  sp += `  INSERT INTO [dbo].[${tableName}] (${editableCols.map((c) => `[${c.name}]`).join(', ')}, [IsActive], [CreatedBy], [CreatedDate])\n`;
  sp += `  VALUES (${editableCols.map((c) => `@${c.name}`).join(', ')}, 1, SYSTEM_USER, GETDATE());\n\n`;
  sp += `  SET @_${pkCol} = SCOPE_IDENTITY();\nEND\nGO\n\n`;

  // UPDATE SP
  sp += `CREATE PROCEDURE [dbo].[usp_${tableName}_Update]\n`;
  sp += `  @${pkCol} ${getPkType(mainTable)},\n`;
  for (const col of editableCols) {
    sp += `  @${col.name} ${getColType(col)}${col.nullable ? ' = NULL' : ''},\n`;
  }
  sp += `  @_${pkCol} ${getPkType(mainTable)} OUTPUT\n`;
  sp += `AS\nBEGIN\n  SET NOCOUNT ON;\n\n`;
  sp += `  UPDATE [dbo].[${tableName}]\n`;
  sp += `  SET ${editableCols.map((c) => `[${c.name}] = @${c.name}`).join(', ')},\n`;
  sp += `      [ModifiedBy] = SYSTEM_USER,\n`;
  sp += `      [ModifiedDate] = GETDATE()\n`;
  sp += `  WHERE [${pkCol}] = @${pkCol};\n\n`;
  sp += `  SET @_${pkCol} = @${pkCol};\nEND\nGO\n\n`;

  // DELETE SP (Soft Delete)
  sp += `CREATE PROCEDURE [dbo].[usp_${tableName}_Delete]\n`;
  sp += `  @${pkCol} ${getPkType(mainTable)}\n`;
  sp += `AS\nBEGIN\n  SET NOCOUNT ON;\n\n`;
  sp += `  UPDATE [dbo].[${tableName}]\n`;
  sp += `  SET [IsActive] = 0,\n`;
  sp += `      [ModifiedBy] = SYSTEM_USER,\n`;
  sp += `      [ModifiedDate] = GETDATE()\n`;
  sp += `  WHERE [${pkCol}] = @${pkCol};\nEND\nGO\n`;

  return sp;
}

function getPkType(schema: TableSchema): string {
  switch (schema.primaryKey.type) {
    case 'BIGINT_IDENTITY': return 'BIGINT';
    case 'GUID': return 'UNIQUEIDENTIFIER';
    default: return 'INT';
  }
}

function getColType(col: any): string {
  const dt = col.dataType.toUpperCase();
  if (dt === 'VARCHAR') return `VARCHAR(${col.maxLength || 50})`;
  if (dt === 'NVARCHAR') return `NVARCHAR(${col.maxLength || 50})`;
  if (dt === 'DECIMAL') return `DECIMAL(${col.precision || 18},${col.scale || 2})`;
  return dt;
}

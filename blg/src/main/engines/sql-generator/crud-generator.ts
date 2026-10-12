import { LayoutMetadata, TableSchema } from '../../../shared/types';

export function generateSelectQueries(metadata: LayoutMetadata, schemas: TableSchema[]): string {
  let sql = '';
  const mainTable = schemas.find((s) => s.tableName === metadata.sourceTable) || schemas[0];
  if (!mainTable) return '';

  const tableName = mainTable.tableName;
  const pkCol = mainTable.primaryKey.columns[0] || 'Id';
  const fkCols = mainTable.columns.filter((c) => c.isFk);

  // Basic SELECT
  sql += `-- Basic SELECT for ${tableName}\n`;
  sql += `SELECT t.*\n`;
  sql += `FROM [dbo].[${tableName}] t\n`;

  for (const fk of fkCols) {
    const target = fk.name.replace(/Id$/, '');
    const targetTable = schemas.find((s) => s.tableName.includes(target));
    if (targetTable) {
      sql += `LEFT JOIN [dbo].[${targetTable.tableName}] ${target} ON t.[${fk.name}] = ${target}.[Id]\n`;
    }
  }

  sql += `WHERE t.[IsActive] = 1\n`;
  sql += `ORDER BY t.[${pkCol}];\n`;
  sql += `GO\n\n`;

  return sql;
}

export function generateInsertScripts(schemas: TableSchema[]): string {
  let sql = '';

  for (const schema of schemas) {
    const editableCols = schema.columns.filter(
      (c) => !c.isIdentity && !['CreatedBy', 'CreatedDate', 'ModifiedBy', 'ModifiedDate'].includes(c.name)
    );

    if (editableCols.length === 0) continue;

    sql += `-- INSERT template for ${schema.tableName}\n`;
    sql += `-- Uncomment and modify values before executing\n`;
    sql += `-- SET IDENTITY_INSERT [dbo].[${schema.tableName}] ON;\n`;
    sql += `-- INSERT INTO [dbo].[${schema.tableName}] (${editableCols.map((c) => `[${c.name}]`).join(', ')}, [IsActive], [CreatedBy], [CreatedDate])\n`;
    sql += `-- VALUES (${editableCols.map((c) => getDefault_value(c)).join(', ')}, 1, SYSTEM_USER, GETDATE());\n`;
    sql += `-- SET IDENTITY_INSERT [dbo].[${schema.tableName}] OFF;\n`;
    sql += `GO\n\n`;
  }

  return sql;
}

function getDefault_value(col: any): string {
  const dt = col.dataType.toUpperCase();
  if (dt === 'INT' || dt === 'BIGINT' || dt === 'DECIMAL' || dt === 'MONEY') return '0';
  if (dt === 'BIT') return '0';
  if (dt === 'DATE' || dt === 'DATETIME') return 'GETDATE()';
  if (dt === 'NVARCHAR' || dt === 'VARCHAR') return "N''";
  return 'NULL';
}

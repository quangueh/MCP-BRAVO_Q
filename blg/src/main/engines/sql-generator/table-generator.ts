import { TableSchema } from '../../../shared/types';

export function generateCreateTable(schema: TableSchema): string {
  const lines: string[] = [];
  lines.push(`CREATE TABLE [dbo].[${schema.tableName}] (`);

  const columnDefs: string[] = [];
  for (const col of schema.columns) {
    columnDefs.push(`  ${generateColumnDef(col.name, col.dataType, col.maxLength, col.precision, col.scale, col.nullable, col.isIdentity, col.defaultValue)}`);
  }

  // Primary key
  if (schema.primaryKey.columns.length > 0) {
    const pkCols = schema.primaryKey.columns.map((c) => `[${c}] ASC`).join(', ');
    columnDefs.push(`  CONSTRAINT [PK_${schema.tableName}] PRIMARY KEY CLUSTERED (${pkCols})`);
  }

  lines.push(columnDefs.join(',\n'));
  lines.push(')');

  return lines.join('\n');
}

function generateColumnDef(
  name: string, dataType: string, maxLength: number | null,
  precision: number, scale: number, nullable: boolean,
  isIdentity: boolean, defaultValue: string | null
): string {
  const type = getSqlType(dataType, maxLength, precision, scale);
  const identity = isIdentity ? ' IDENTITY(1,1)' : '';
  const nullStr = nullable ? 'NULL' : 'NOT NULL';
  const defaultStr = defaultValue ? ` DEFAULT ${defaultValue}` : '';

  return `[${name}] ${type}${identity} ${nullStr}${defaultStr}`;
}

function getSqlType(dataType: string, maxLength: number | null, precision: number, scale: number): string {
  const dt = dataType.toUpperCase();
  switch (dt) {
    case 'VARCHAR':
      return `VARCHAR(${maxLength || 50})`;
    case 'NVARCHAR':
      return `NVARCHAR(${maxLength || 50})`;
    case 'CHAR':
      return `CHAR(${maxLength || 10})`;
    case 'NCHAR':
      return `NCHAR(${maxLength || 10})`;
    case 'DECIMAL':
    case 'NUMERIC':
      return `DECIMAL(${precision || 18},${scale || 2})`;
    case 'MONEY':
    case 'SMALLMONEY':
      return dt;
    case 'INT':
    case 'BIGINT':
    case 'SMALLINT':
    case 'TINYINT':
      return dt;
    case 'DATE':
    case 'DATETIME':
    case 'DATETIME2':
    case 'DATETIMEOFFSET':
      return dt;
    case 'BIT':
      return 'BIT';
    case 'TEXT':
    case 'NTEXT':
      return 'NVARCHAR(MAX)';
    case 'UNIQUEIDENTIFIER':
      return 'UNIQUEIDENTIFIER';
    default:
      return dt;
  }
}

export function generateForeignKeys(schema: TableSchema): string {
  const lines: string[] = [];

  for (const fk of schema.foreignKeys) {
    const fkName = fk.name.length > 128 ? fk.name.substring(0, 128) : fk.name;
    const fkCols = fk.columns.map((c) => `[${c}]`).join(', ');
    const pkCols = fk.targetColumns.map((c) => `[${c}]`).join(', ');

    const onDelete = fk.onDelete === 'CASCADE' ? 'CASCADE' :
                     fk.onDelete === 'SET_NULL' ? 'SET NULL' : 'NO ACTION';
    const onUpdate = fk.onUpdate === 'CASCADE' ? 'CASCADE' : 'NO ACTION';

    lines.push(`ALTER TABLE [dbo].[${schema.tableName}] WITH CHECK ADD CONSTRAINT [${fkName}] FOREIGN KEY (${fkCols}) REFERENCES [dbo].[${fk.targetTable}] (${pkCols});`);
    lines.push(`ALTER TABLE [dbo].[${schema.tableName}] CHECK CONSTRAINT [${fkName}];`);
    lines.push('');
  }

  return lines.join('\n');
}

export function generateIndexes(schema: TableSchema): string {
  const lines: string[] = [];

  // Auto-index FK columns
  for (const fk of schema.foreignKeys) {
    for (const col of fk.columns) {
      const idxName = `IX_${schema.tableName}_${col}`;
      if (!schema.indexes.find((i) => i.columns.includes(col))) {
        lines.push(`CREATE NONCLUSTERED INDEX [${idxName}] ON [dbo].[${schema.tableName}] ([${col}] ASC);`);
      }
    }
  }

  // Unique index on Code columns
  for (const col of schema.columns) {
    if (col.name === 'Code' || col.name.endsWith('Code')) {
      const idxName = `UX_${schema.tableName}_${col.name}`;
      lines.push(`CREATE UNIQUE NONCLUSTERED INDEX [${idxName}] ON [dbo].[${schema.tableName}] ([${col.name}] ASC);`);
    }
  }

  return lines.join('\n');
}

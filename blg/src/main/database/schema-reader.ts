import { query } from './connection';
import { TableSchema, ColumnSchema, ForeignKeyInfo, IndexInfo, PrimaryKeyInfo } from '../../shared/types';

export async function readTableSchemas(database: string): Promise<TableSchema[]> {
  const tables = await query<{ TABLE_NAME: string }>(`
    SELECT TABLE_NAME
    FROM INFORMATION_SCHEMA.TABLES
    WHERE TABLE_TYPE = 'BASE TABLE'
    ORDER BY TABLE_NAME
  `);

  const schemas: TableSchema[] = [];
  for (const table of tables) {
    const schema = await readTableSchema(database, table.TABLE_NAME);
    schemas.push(schema);
  }
  return schemas;
}

export async function readTableSchema(database: string, tableName: string): Promise<TableSchema> {
  const columns = await readColumns(database, tableName);
  const primaryKey = await readPrimaryKey(database, tableName);
  const foreignKeys = await readForeignKeys(database, tableName);
  const indexes = await readIndexes(database, tableName);

  return {
    tableName,
    database,
    columns,
    primaryKey,
    foreignKeys,
    indexes,
  };
}

async function readColumns(database: string, tableName: string): Promise<ColumnSchema[]> {
  const rows = await query<{
    COLUMN_NAME: string;
    DATA_TYPE: string;
    CHARACTER_MAXIMUM_LENGTH: number;
    NUMERIC_PRECISION: number;
    NUMERIC_SCALE: number;
    IS_NULLABLE: string;
    COLUMN_DEFAULT: string | null;
    IS_IDENTITY: number;
  }>(`
    SELECT
      c.COLUMN_NAME,
      c.DATA_TYPE,
      c.CHARACTER_MAXIMUM_LENGTH,
      c.NUMERIC_PRECISION,
      c.NUMERIC_SCALE,
      c.IS_NULLABLE,
      c.COLUMN_DEFAULT,
      COLUMNPROPERTY(OBJECT_ID('${database}.dbo.${tableName}'), c.COLUMN_NAME, 'IsIdentity') AS IS_IDENTITY
    FROM INFORMATION_SCHEMA.COLUMNS c
    WHERE c.TABLE_CATALOG = '${database}'
      AND c.TABLE_SCHEMA = 'dbo'
      AND c.TABLE_NAME = '${tableName}'
    ORDER BY c.ORDINAL_POSITION
  `);

  return rows.map((r) => ({
    name: r.COLUMN_NAME,
    dataType: r.DATA_TYPE,
    maxLength: r.CHARACTER_MAXIMUM_LENGTH,
    precision: r.NUMERIC_PRECISION,
    scale: r.NUMERIC_SCALE,
    nullable: r.IS_NULLABLE === 'YES',
    isIdentity: r.IS_IDENTITY === 1,
    defaultValue: r.COLUMN_DEFAULT,
  }));
}

async function readPrimaryKey(database: string, tableName: string): Promise<PrimaryKeyInfo> {
  const rows = await query<{ COLUMN_NAME: string; DATA_TYPE: string }>(`
    SELECT
      ku.COLUMN_NAME,
      c.DATA_TYPE
    FROM INFORMATION_SCHEMA.TABLE_CONSTRAINTS tc
    JOIN INFORMATION_SCHEMA.KEY_COLUMN_USAGE ku
      ON tc.CONSTRAINT_NAME = ku.CONSTRAINT_NAME
      AND tc.TABLE_SCHEMA = ku.TABLE_SCHEMA
    JOIN INFORMATION_SCHEMA.COLUMNS c
      ON c.TABLE_CATALOG = ku.TABLE_CATALOG
      AND c.TABLE_SCHEMA = ku.TABLE_SCHEMA
      AND c.TABLE_NAME = ku.TABLE_NAME
      AND c.COLUMN_NAME = ku.COLUMN_NAME
    WHERE tc.CONSTRAINT_TYPE = 'PRIMARY KEY'
      AND tc.TABLE_CATALOG = '${database}'
      AND tc.TABLE_NAME = '${tableName}'
    ORDER BY ku.ORDINAL_POSITION
  `);

  if (rows.length === 0) {
    return { columns: ['Id'], type: 'INT_IDENTITY' };
  }

  const columns = rows.map((r) => r.COLUMN_NAME);
  const firstType = rows[0].DATA_TYPE.toUpperCase();

  let type: PrimaryKeyInfo['type'] = 'INT_IDENTITY';
  if (columns.length > 1) type = 'COMPOSITE';
  else if (firstType === 'BIGINT') type = 'BIGINT_IDENTITY';
  else if (firstType === 'UNIQUEIDENTIFIER') type = 'GUID';

  return { columns, type };
}

async function readForeignKeys(database: string, tableName: string): Promise<ForeignKeyInfo[]> {
  const rows = await query<{
    FK_NAME: string;
    FK_COLUMN: string;
    PK_TABLE: string;
    PK_COLUMN: string;
    DELETE_RULE: string;
    UPDATE_RULE: string;
  }>(`
    SELECT
      fk.name AS FK_NAME,
      cp.name AS FK_COLUMN,
      OBJECT_NAME(fk.referenced_object_id) AS PK_TABLE,
      cr.name AS PK_COLUMN,
      DELETE_REFERENTIAL_ACTION_DESC AS DELETE_RULE,
      UPDATE_REFERENTIAL_ACTION_DESC AS UPDATE_RULE
    FROM sys.foreign_keys fk
    JOIN sys.foreign_key_columns fkc ON fk.object_id = fkc.constraint_object_id
    JOIN sys.columns cp ON fkc.parent_object_id = cp.object_id AND fkc.parent_column_id = cp.column_id
    JOIN sys.columns cr ON fkc.referenced_object_id = cr.object_id AND fkc.referenced_column_id = cr.column_id
    WHERE OBJECT_NAME(fk.parent_object_id) = '${tableName}'
      AND OBJECT_NAME(fk.referenced_object_id) != '${tableName}'
  `);

  const fkMap = new Map<string, ForeignKeyInfo>();
  for (const row of rows) {
    const existing = fkMap.get(row.FK_NAME);
    if (existing) {
      existing.columns.push(row.FK_COLUMN);
      existing.targetColumns.push(row.PK_COLUMN);
    } else {
      fkMap.set(row.FK_NAME, {
        name: row.FK_NAME,
        columns: [row.FK_COLUMN],
        targetTable: row.PK_TABLE,
        targetColumns: [row.PK_COLUMN],
        onDelete: row.DELETE_RULE,
        onUpdate: row.UPDATE_RULE,
      });
    }
  }

  return Array.from(fkMap.values());
}

async function readIndexes(database: string, tableName: string): Promise<IndexInfo[]> {
  const rows = await query<{ INDEX_NAME: string; COLUMN_NAME: string; IS_UNIQUE: number }>(`
    SELECT
      i.name AS INDEX_NAME,
      col.name AS COLUMN_NAME,
      i.is_unique AS IS_UNIQUE
    FROM sys.indexes i
    JOIN sys.index_columns ic ON i.object_id = ic.object_id AND i.index_id = ic.index_id
    JOIN sys.columns col ON ic.object_id = col.object_id AND ic.column_id = col.column_id
    WHERE OBJECT_NAME(i.object_id) = '${tableName}'
      AND i.name IS NOT NULL
      AND i.is_primary_key = 0
    ORDER BY i.name, ic.key_ordinal
  `);

  const idxMap = new Map<string, IndexInfo>();
  for (const row of rows) {
    const existing = idxMap.get(row.INDEX_NAME);
    if (existing) {
      existing.columns.push(row.COLUMN_NAME);
    } else {
      idxMap.set(row.INDEX_NAME, {
        name: row.INDEX_NAME,
        columns: [row.COLUMN_NAME],
        isUnique: row.IS_UNIQUE === 1,
      });
    }
  }

  return Array.from(idxMap.values());
}

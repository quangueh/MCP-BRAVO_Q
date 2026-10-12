const fs = require('fs');
const path = require('path');
const sql = require('mssql');

function env(name, fallback = undefined) {
  return process.env[name] || fallback;
}

const databases = env('MSSQL_DATABASES', '')
  .split(',')
  .map((name) => name.trim())
  .filter(Boolean);

if (databases.length === 0) {
  console.error('Missing MSSQL_DATABASES. Example: MSSQL_DATABASES=Bravo_Config,Bravo_Data');
  process.exit(1);
}

const config = {
  server: env('MSSQL_SERVER'),
  port: Number(env('MSSQL_PORT', '1433')),
  user: env('MSSQL_USER'),
  password: env('MSSQL_PASSWORD'),
  options: {
    trustServerCertificate: env('MSSQL_TRUST_SERVER_CERTIFICATE', 'true') === 'true',
    encrypt: env('MSSQL_ENCRYPT', 'false') === 'true'
  }
};

const knowledgeDir = path.resolve(env('KNOWLEDGE_DIR', path.join(process.cwd(), 'knowledge')));

async function query(pool, text) {
  const result = await pool.request().query(text);
  return result.recordset;
}

async function extractDatabase(dbName) {
  const dbDir = path.join(knowledgeDir, dbName);
  fs.mkdirSync(dbDir, { recursive: true });

  const pool = await sql.connect({ ...config, database: dbName });
  console.log(`Extracting metadata: ${dbName}`);

  const tables = await query(pool, `
    SELECT TABLE_SCHEMA, TABLE_NAME
    FROM INFORMATION_SCHEMA.TABLES
    WHERE TABLE_TYPE = 'BASE TABLE'
    ORDER BY TABLE_SCHEMA, TABLE_NAME
  `);
  const tableNames = tables.map((table) => `${table.TABLE_SCHEMA}.${table.TABLE_NAME}`);
  fs.writeFileSync(path.join(dbDir, '_tables.json'), JSON.stringify(tableNames, null, 2));

  const foreignKeys = await query(pool, `
    SELECT
      fk.name AS FK_NAME,
      tp.name AS PARENT_TABLE,
      cp.name AS PARENT_COLUMN,
      tr.name AS REFERENCE_TABLE,
      cr.name AS REFERENCE_COLUMN
    FROM sys.foreign_keys fk
    INNER JOIN sys.foreign_key_columns fkc ON fk.object_id = fkc.constraint_object_id
    INNER JOIN sys.tables tp ON fkc.parent_object_id = tp.object_id
    INNER JOIN sys.columns cp ON fkc.parent_object_id = cp.object_id AND fkc.parent_column_id = cp.column_id
    INNER JOIN sys.tables tr ON fkc.referenced_object_id = tr.object_id
    INNER JOIN sys.columns cr ON fkc.referenced_object_id = cr.object_id AND fkc.referenced_column_id = cr.column_id
    ORDER BY tp.name
  `);
  fs.writeFileSync(path.join(dbDir, '_foreign_keys.json'), JSON.stringify(foreignKeys, null, 2));

  const indexes = await query(pool, `
    SELECT
      t.name AS TableName,
      i.name AS IndexName,
      i.type_desc AS IndexType,
      i.is_primary_key,
      i.is_unique,
      STRING_AGG(c.name, ', ') WITHIN GROUP (ORDER BY ic.key_ordinal) AS Columns
    FROM sys.indexes i
    INNER JOIN sys.index_columns ic ON i.object_id = ic.object_id AND i.index_id = ic.index_id
    INNER JOIN sys.columns c ON ic.object_id = c.object_id AND ic.column_id = c.column_id
    INNER JOIN sys.tables t ON i.object_id = t.object_id
    WHERE i.name IS NOT NULL AND t.is_ms_shipped = 0
    GROUP BY t.name, i.name, i.type_desc, i.is_primary_key, i.is_unique
    ORDER BY t.name, i.name
  `);
  fs.writeFileSync(path.join(dbDir, '_indexes.json'), JSON.stringify(indexes, null, 2));

  const views = await query(pool, `
    SELECT TABLE_SCHEMA, TABLE_NAME
    FROM INFORMATION_SCHEMA.VIEWS
    ORDER BY TABLE_SCHEMA, TABLE_NAME
  `);
  fs.writeFileSync(path.join(dbDir, '_views.json'), JSON.stringify(views, null, 2));

  const procedures = await query(pool, `
    SELECT
      SCHEMA_NAME(o.schema_id) AS ROUTINE_SCHEMA,
      o.name AS ROUTINE_NAME,
      'PROCEDURE' AS ROUTINE_TYPE,
      m.definition AS ROUTINE_DEFINITION
    FROM sys.procedures o
    LEFT JOIN sys.sql_modules m ON o.object_id = m.object_id
    ORDER BY SCHEMA_NAME(o.schema_id), o.name
  `);
  fs.writeFileSync(path.join(dbDir, '_procedures.json'), JSON.stringify(procedures, null, 2));

  let processed = 0;
  for (const tableName of tableNames) {
    const [schemaName, plainTableName] = tableName.split('.');
    const columns = await query(pool, `
      SELECT
        c.COLUMN_NAME,
        c.DATA_TYPE,
        c.CHARACTER_MAXIMUM_LENGTH,
        c.NUMERIC_PRECISION,
        c.NUMERIC_SCALE,
        c.IS_NULLABLE,
        c.COLUMN_DEFAULT,
        c.ORDINAL_POSITION
      FROM INFORMATION_SCHEMA.COLUMNS c
      WHERE c.TABLE_SCHEMA = '${schemaName.replace(/'/g, "''")}'
        AND c.TABLE_NAME = '${plainTableName.replace(/'/g, "''")}'
      ORDER BY c.ORDINAL_POSITION
    `);

    fs.writeFileSync(
      path.join(dbDir, `${schemaName}_${plainTableName}.json`),
      JSON.stringify({
        table: tableName,
        columns: columns.map((column) => ({
          name: column.COLUMN_NAME,
          type: column.DATA_TYPE,
          maxLength: column.CHARACTER_MAXIMUM_LENGTH,
          precision: column.NUMERIC_PRECISION,
          scale: column.NUMERIC_SCALE,
          nullable: column.IS_NULLABLE === 'YES',
          default: column.COLUMN_DEFAULT
        }))
      }, null, 2)
    );
    processed += 1;
  }

  await pool.close();
  return {
    tables: tableNames.length,
    foreignKeys: foreignKeys.length,
    indexes: indexes.length,
    views: views.length,
    procedures: procedures.length,
    tableFiles: processed
  };
}

async function main() {
  fs.mkdirSync(knowledgeDir, { recursive: true });
  const summary = {};

  for (const dbName of databases) {
    summary[dbName] = await extractDatabase(dbName);
  }

  fs.writeFileSync(path.join(knowledgeDir, '_summary.json'), JSON.stringify(summary, null, 2));
  console.log(JSON.stringify(summary, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

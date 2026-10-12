import { ipcMain } from 'electron';
import { GenerateOptions, LayoutMetadata, TableSchema } from '../../shared/types';
import { generateCreateTable, generateForeignKeys, generateIndexes } from '../engines/sql-generator/table-generator';
import { generateCrudSp } from '../engines/sql-generator/sp-generator';
import { generateDataSourceXml } from '../engines/xml-generator/datasource-builder';
import { generateLayoutXml } from '../engines/xml-generator/layout-builder';
import { generateInsertScripts, generateSelectQueries } from '../engines/sql-generator/crud-generator';

export function setupGenerationHandlers(): void {
  ipcMain.handle('generate:all', async (_event, metadata: LayoutMetadata, schemas: TableSchema[], options: GenerateOptions) => {
    const start = Date.now();
    const warnings: string[] = [];
    const errors: string[] = [];

    try {
      const outputs = {
        createTable: '',
        foreignKeys: '',
        indexes: '',
        insertScripts: '',
        updateScripts: '',
        deleteScripts: '',
        selectQueries: '',
        storedProcedures: '',
        views: '',
        triggers: '',
        dataSourceXml: '',
        layoutXml: '',
        metadataJson: JSON.stringify(metadata, null, 2),
      };

      // Generate SQL
      for (const schema of schemas) {
        outputs.createTable += generateCreateTable(schema) + '\nGO\n\n';
        outputs.foreignKeys += generateForeignKeys(schema) + '\n';
        if (options.includeIndexes) {
          outputs.indexes += generateIndexes(schema) + '\n';
        }
      }

      outputs.selectQueries = generateSelectQueries(metadata, schemas);
      outputs.insertScripts = generateInsertScripts(schemas);

      // Generate SP
      if (metadata.dataSource.spName) {
        outputs.storedProcedures = `-- Stored Procedure: ${metadata.dataSource.spName}\n-- (Parameterized - review before execution)\n`;
      } else {
        outputs.storedProcedures = generateCrudSp(metadata, schemas);
      }

      // Generate XML
      outputs.dataSourceXml = generateDataSourceXml(metadata, schemas);
      outputs.layoutXml = generateLayoutXml(metadata);

      return {
        success: true,
        data: outputs,
        warnings,
        errors,
        duration: Date.now() - start,
      };
    } catch (err: any) {
      errors.push(err.message);
      return {
        success: false,
        data: null,
        warnings,
        errors,
        duration: Date.now() - start,
      };
    }
  });

  ipcMain.handle('generate:sql', async (_event, schemas: TableSchema[], options: GenerateOptions) => {
    let sql = '';
    for (const schema of schemas) {
      sql += generateCreateTable(schema) + '\nGO\n\n';
      sql += generateForeignKeys(schema) + '\n';
      if (options.includeIndexes) {
        sql += generateIndexes(schema) + '\n';
      }
    }
    return { success: true, data: sql };
  });
}

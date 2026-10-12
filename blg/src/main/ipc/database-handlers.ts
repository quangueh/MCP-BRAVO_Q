import { ipcMain } from 'electron';
import { connect, disconnect, testConnection } from '../database/connection';
import { readTableSchemas, readTableSchema } from '../database/schema-reader';
import { DatabaseConfig } from '../../shared/types';

let currentConfig: DatabaseConfig | null = null;

export function setupDatabaseHandlers(): void {
  ipcMain.handle('db:test', async (_event, config: DatabaseConfig) => {
    const ok = await testConnection(config);
    if (ok) currentConfig = config;
    return { success: ok };
  });

  ipcMain.handle('db:connect', async (_event, config: DatabaseConfig) => {
    try {
      await connect(config);
      currentConfig = config;
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  });

  ipcMain.handle('db:disconnect', async () => {
    await disconnect();
    currentConfig = null;
    return { success: true };
  });

  ipcMain.handle('db:get-tables', async (_event, database: string) => {
    try {
      const schemas = await readTableSchemas(database);
      return { success: true, data: schemas.map((s) => s.tableName) };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  });

  ipcMain.handle('db:get-table-schema', async (_event, database: string, tableName: string) => {
    try {
      const schema = await readTableSchema(database, tableName);
      return { success: true, data: schema };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  });

  ipcMain.handle('db:get-config', async () => {
    return currentConfig;
  });
}

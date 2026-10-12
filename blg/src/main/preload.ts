import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electronAPI', {
  // Database
  testConnection: (config: any) => ipcRenderer.invoke('db:test', config),
  connect: (config: any) => ipcRenderer.invoke('db:connect', config),
  disconnect: () => ipcRenderer.invoke('db:disconnect'),
  getTables: (database: string) => ipcRenderer.invoke('db:get-tables', database),
  getTableSchema: (database: string, tableName: string) => ipcRenderer.invoke('db:get-table-schema', database, tableName),
  getConfig: () => ipcRenderer.invoke('db:get-config'),

  // Layouts
  setCachePath: (path: string) => ipcRenderer.invoke('layout:set-cache-path', path),
  listLayouts: (dirPath?: string) => ipcRenderer.invoke('layout:list', dirPath),
  parseLayout: (filePath: string) => ipcRenderer.invoke('layout:parse', filePath),
  searchLayouts: (dirPath: string, query: string) => ipcRenderer.invoke('layout:search', dirPath, query),

  // Generation
  generateAll: (metadata: any, schemas: any[], options: any) => ipcRenderer.invoke('generate:all', metadata, schemas, options),
  generateSql: (schemas: any[], options: any) => ipcRenderer.invoke('generate:sql', schemas, options),
});

// Mock Electron API for browser-only development
// In Electron, this would be replaced by preload.ts bridge

import * as mockData from './mock-data';

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

export const electronAPI = {
  // Database
  testConnection: async (config: any) => {
    await delay(800);
    return { success: true };
  },
  connect: async (config: any) => {
    await delay(500);
    return { success: true };
  },
  disconnect: async () => {
    await delay(200);
    return { success: true };
  },
  getTables: async (database: string) => {
    await delay(300);
    return { success: true, data: mockData.tableNames };
  },
  getTableSchema: async (database: string, tableName: string) => {
    await delay(200);
    const schema = mockData.schemas[tableName];
    return { success: true, data: schema || mockData.schemas['B20Customer'] };
  },
  getConfig: async () => null,

  // Layouts
  setCachePath: async (path: string) => ({ success: true }),
  listLayouts: async (dirPath?: string) => {
    await delay(500);
    return { success: true, data: mockData.layouts, total: mockData.layouts.length };
  },
  parseLayout: async (filePath: string) => {
    await delay(400);
    return { success: true, data: mockData.parsedMetadata };
  },
  searchLayouts: async (dirPath: string, query: string) => {
    const results = mockData.layouts.filter(
      (l: any) => l.displayName.toLowerCase().includes(query.toLowerCase())
    );
    return { success: true, data: results };
  },

  // Generation
  generateAll: async (metadata: any, schemas: any[], options: any) => {
    await delay(1000);
    return { success: true, data: mockData.generateMockOutput(metadata, schemas), warnings: [], errors: [], duration: 1000 };
  },
  generateSql: async (schemas: any[], options: any) => {
    await delay(500);
    return { success: true, data: mockData.generateMockSql(schemas) };
  },
};

// Detect if running in Electron or browser
const isElectron = typeof window !== "undefined" && typeof (window as any).electronAPI !== "undefined";

export function getApi() {
  if (isElectron) {
    return (window as any).electronAPI;
  }
  return electronAPI;
}

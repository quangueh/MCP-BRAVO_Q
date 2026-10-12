import { ipcMain } from 'electron';
import * as fs from 'fs';
import * as path from 'path';
import { parseLayoutXml } from '../engines/layout-parser/parser';

let layoutCachePath = '';

export function setupLayoutHandlers(): void {
  ipcMain.handle('layout:set-cache-path', async (_event, dirPath: string) => {
    layoutCachePath = dirPath;
    return { success: true };
  });

  ipcMain.handle('layout:list', async (_event, dirPath?: string) => {
    const scanDir = dirPath || layoutCachePath;
    if (!scanDir) {
      return { success: false, error: 'No layout directory configured' };
    }

    try {
      const files = fs.readdirSync(scanDir).filter((f) => f.endsWith('.xml'));
      const layouts = files.map((f) => {
        const name = f.replace(/\.xml$/, '').replace(/_Layout\d*$/, '').replace(/__DataSource__$/, '');
        return {
          fileName: f,
          displayName: name,
          fullPath: path.join(scanDir, f),
          isLayout: f.includes('Layout'),
          isDataSource: f.includes('DataSource'),
        };
      });

      // Group by form name (pair layout + datasource)
      const grouped = new Map<string, any>();
      for (const layout of layouts) {
        const key = layout.displayName;
        if (!grouped.has(key)) {
          grouped.set(key, { formName: displayName, layouts: [], dataSources: [] });
        }
        const group = grouped.get(key)!;
        if (layout.isLayout) group.layouts.push(layout);
        if (layout.isDataSource) group.dataSources.push(layout);
      }

      return {
        success: true,
        data: Array.from(grouped.values()),
        total: files.length,
      };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  });

  ipcMain.handle('layout:parse', async (_event, filePath: string) => {
    try {
      const xml = fs.readFileSync(filePath, 'utf-8');
      const metadata = parseLayoutXml(xml);
      return { success: true, data: metadata };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  });

  ipcMain.handle('layout:search', async (_event, dirPath: string, query: string) => {
    try {
      const files = fs.readdirSync(dirPath).filter((f) => f.toLowerCase().includes(query.toLowerCase()));
      return { success: true, data: files };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  });
}

// Fix: use the correct variable name
function displayName(name: string): string {
  return name;
}

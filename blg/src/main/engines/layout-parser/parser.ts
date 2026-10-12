import * as xml2js from 'xml2js';
import { LayoutMetadata, LayoutType, ColumnMetadata, ControlMetadata, ToolbarButton, ParameterMetadata, TreeConfig } from '../../../shared/types';

export function parseLayoutXml(xml: string): LayoutMetadata {
  const parser = new xml2js.Parser({ explicitArray: false, mergeAttrs: true });
  let result: any = {};
  parser.parseString(xml, (err: any, parsed: any) => {
    if (!err) result = parsed;
  });
  const root = result.root || result;
  const layoutType = detectLayoutType(root);

  return {
    layoutName: '',
    formName: '',
    layoutType,
    isTemplate: 0,
    sourceTable: extractDataMember(root, layoutType),
    dataSource: {
      spName: null, viewName: null,
      tableName: extractDataMember(root, layoutType),
      sourceType: 'Table',
      commandCollection: [], evaluators: [], validators: [],
    },
    columns: extractColumns(root, layoutType),
    controls: extractControls(root, layoutType),
    toolbar: extractToolbar(root),
    parameters: extractParameters(root),
    styles: { headerBackColor: 'Navy', headerForeColor: 'White', alternatingRowColor: 'WhiteSmoke', defaultWidth: 120 },
    relations: [],
    treeConfig: extractTreeConfig(root, layoutType),
  };
}

function detectLayoutType(root: any): LayoutType {
  if (root.panelReporter) return 'Report';
  if (root.panelEditor) return 'Editor';
  return 'Explorer';
}

function extractDataMember(root: any, type: LayoutType): string | null {
  try {
    if (type === 'Explorer') {
      const c = root.panelExplorer?.Controls?.BravoGridContainer;
      return c?.DataMember || null;
    }
    if (type === 'Editor') {
      const c = root.panelEditor?.Controls?.BravoGridContainer;
      return c?.DataMember || null;
    }
    if (type === 'Report') {
      return root.panelReporter?.Controls?.Report_0?.Content?.DataMember || 'Table1';
    }
    return null;
  } catch { return null; }
}

function extractColumns(root: any, type: LayoutType): ColumnMetadata[] {
  const columns: ColumnMetadata[] = [];
  try {
    let cols: any = null;
    if (type === 'Explorer') {
      cols = root.panelExplorer?.Controls?.BravoGridContainer?.Items?.ChildTable?.Cols;
    } else if (type === 'Report') {
      cols = root.panelReporter?.Controls?.Report_0?.Content?.Cols;
    }
    if (!cols) return columns;
    for (const colName of Object.keys(cols)) {
      if (colName.startsWith('z') || colName.startsWith('_')) continue;
      const def = cols[colName];
      const style = def.Style || '';
      const widthMatch = style.match(/Width:(\d+)/);
      columns.push({
        name: colName,
        headerText: def.Rows?.Row_0?.Text?.Vietnamese || colName,
        width: widthMatch ? parseInt(widthMatch[1]) : parseInt(def.Width) || 120,
        visible: def.Visible !== 'False',
        format: (style.match(/Format:"([^"]+)"/) || [])[1] || '',
        textAlign: (style.match(/TextAlign:(\w+)/) || [])[1] || 'LeftTop',
        dataType: 'NVARCHAR', isPk: colName === 'Id', isFk: colName.endsWith('Id') && colName !== 'Id',
        fkTarget: null, nullable: true,
        generationHints: { controlType: 'BravoTextBox', lookupSource: null, backColor: null, foreColor: null },
      });
    }
  } catch {}
  return columns;
}

function extractControls(root: any, type: LayoutType): ControlMetadata[] {
  const controls: ControlMetadata[] = [];
  const types = ['BravoTextBox', 'BravoDateInputBox', 'BravoLookupBox', 'BravoQuantityInputBox'];
  try {
    let panel: any = null;
    if (type === 'Explorer') panel = root.panelExplorer;
    if (type === 'Editor') panel = root.panelEditor;
    if (!panel) return controls;
    const walk = (obj: any) => {
      if (!obj || typeof obj !== 'object') return;
      for (const [k, v] of Object.entries(obj)) {
        if (types.includes(k) && typeof v === 'object' && v !== null) {
          const c = v as any;
          controls.push({ name: c.Name || k, type: k, dataMember: c.DataMember || '',
            width: parseInt(c.Width) || 150, height: parseInt(c.Height) || 25, style: c.Style || '' });
        }
        if (typeof v === 'object' && v !== null) walk(v);
      }
    };
    walk(panel);
  } catch {}
  return controls;
}

function extractToolbar(root: any): ToolbarButton[] {
  const buttons: ToolbarButton[] = [];
  try {
    const ts = root.toolStrip1;
    if (!ts?.Items) return buttons;
    for (const [k, v] of Object.entries(ts.Items)) {
      if (typeof v === 'object' && v !== null) {
        const b = v as any;
        buttons.push({ name: b.Name || k, text: b.Text || k, icon: b.Image || '', command: b.Command || '' });
      }
    }
  } catch {}
  return buttons;
}

function extractParameters(root: any): ParameterMetadata[] {
  const params: ParameterMetadata[] = [];
  try {
    const panel = root.panelReporter?.Controls?.Report_0?.panelParameters;
    if (!panel?.Controls) return params;
    const types = ['BravoDateInputBox', 'BravoLookupBox', 'BravoTextBox'];
    const walk = (obj: any) => {
      if (!obj || typeof obj !== 'object') return;
      for (const [k, v] of Object.entries(obj)) {
        if (types.includes(k) && typeof v === 'object' && v !== null) {
          const c = v as any;
          params.push({ name: c.Name || c.DataMember || k, dataType: 'NVARCHAR',
            defaultValue: c.DefaultValue || '', isOutput: false, direction: 'Input' });
        }
        if (typeof v === 'object' && v !== null) walk(v);
      }
    };
    walk(panel.Controls);
  } catch {}
  return params;
}

function extractTreeConfig(root: any, type: LayoutType): TreeConfig | null {
  try {
    let content: any = null;
    if (type === 'Explorer') content = root.panelExplorer?.Controls?.BravoGridContainer;
    if (type === 'Report') content = root.panelReporter?.Controls?.Report_0?.Content;
    if (!content?.zTreeColName) return null;
    return { treeColumnName: content.zTreeColName, treeNodeKeyColumnName: content.zMakingTreeNodeKeyColName || '_GroupOrder' };
  } catch { return null; }
}

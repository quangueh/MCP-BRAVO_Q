// ===== Database Types =====
export interface DatabaseConfig {
  server: string;
  port: number;
  user: string;
  password: string;
  database: string;
  options?: {
    trustServerCertificate?: boolean;
    encrypt?: boolean;
  };
}

export interface TableSchema {
  tableName: string;
  database: string;
  columns: ColumnSchema[];
  primaryKey: PrimaryKeyInfo;
  foreignKeys: ForeignKeyInfo[];
  indexes: IndexInfo[];
}

export interface ColumnSchema {
  name: string;
  dataType: string;
  maxLength: number | null;
  precision: number;
  scale: number;
  nullable: boolean;
  isIdentity: boolean;
  defaultValue: string | null;
}

export interface PrimaryKeyInfo {
  columns: string[];
  type: 'INT_IDENTITY' | 'BIGINT_IDENTITY' | 'GUID' | 'COMPOSITE';
}

export interface ForeignKeyInfo {
  name: string;
  columns: string[];
  targetTable: string;
  targetColumns: string[];
  onDelete: string;
  onUpdate: string;
}

export interface IndexInfo {
  name: string;
  columns: string[];
  isUnique: boolean;
}

// ===== Layout Types =====
export type LayoutType = 'Explorer' | 'Editor' | 'Report' | 'Dashboard' | 'Approval' | 'Hybrid';

export interface LayoutMetadata {
  layoutName: string;
  formName: string;
  layoutType: LayoutType;
  isTemplate: number;
  sourceTable: string | null;
  dataSource: DataSourceBinding;
  columns: ColumnMetadata[];
  controls: ControlMetadata[];
  toolbar: ToolbarButton[];
  parameters: ParameterMetadata[];
  styles: StyleConfig;
  relations: RelationMetadata[];
  treeConfig: TreeConfig | null;
}

export interface DataSourceBinding {
  spName: string | null;
  viewName: string | null;
  tableName: string | null;
  sourceType: 'StoredProcedure' | 'View' | 'Table';
  commandCollection: CommandMetadata[];
  evaluators: EvaluatorMetadata[];
  validators: ValidatorMetadata[];
}

export interface ColumnMetadata {
  name: string;
  headerText: string;
  width: number;
  visible: boolean;
  format: string;
  textAlign: string;
  dataType: string;
  isPk: boolean;
  isFk: boolean;
  fkTarget: string | null;
  nullable: boolean;
  generationHints: GenerationHints;
}

export interface GenerationHints {
  controlType: string;
  lookupSource: string | null;
  backColor: string | null;
  foreColor: string | null;
}

export interface ControlMetadata {
  name: string;
  type: string;
  dataMember: string;
  width: number;
  height: number;
  style: string;
}

export interface ToolbarButton {
  name: string;
  text: string;
  icon: string;
  command: string;
}

export interface ParameterMetadata {
  name: string;
  dataType: string;
  defaultValue: string;
  isOutput: boolean;
  direction: 'Input' | 'Output';
}

export interface StyleConfig {
  headerBackColor: string;
  headerForeColor: string;
  alternatingRowColor: string;
  defaultWidth: number;
}

export interface RelationMetadata {
  name: string;
  type: 'OneToMany' | 'ManyToOne' | 'ManyToMany' | 'SelfRef' | 'DocumentChain';
  sourceTable: string;
  sourceColumn: string;
  targetTable: string;
  targetColumn: string;
}

export interface TreeConfig {
  treeColumnName: string;
  treeNodeKeyColumnName: string;
}

export interface CommandMetadata {
  name: string;
  type: 'INSERT' | 'UPDATE' | 'DELETE' | 'SELECT';
  parameters: CommandParameter[];
  text: string;
}

export interface CommandParameter {
  name: string;
  dataType: string;
  sourceColumn: string;
}

export interface EvaluatorMetadata {
  name: string;
  commandKey: string;
  description: string;
}

export interface ValidatorMetadata {
  name: string;
  field: string;
  type: string;
  message: string;
}

// ===== Generation Types =====
export interface GenerateOptions {
  includeAuditColumns: boolean;
  includeSeedData: boolean;
  includeViews: boolean;
  includeTriggers: boolean;
  includeIndexes: boolean;
  schemaName: string;
  language: string;
}

export interface GenerateOutput {
  createTable: string;
  foreignKeys: string;
  indexes: string;
  insertScripts: string;
  updateScripts: string;
  deleteScripts: string;
  selectQueries: string;
  storedProcedures: string;
  views: string;
  triggers: string;
  dataSourceXml: string;
  layoutXml: string;
  metadataJson: string;
}

export interface GenerationResult {
  layoutName: string;
  timestamp: string;
  options: GenerateOptions;
  outputs: GenerateOutput;
  warnings: string[];
  errors: string[];
  duration: number;
}

// ===== History Types =====
export interface HistoryEntry {
  id: string;
  timestamp: string;
  layoutName: string;
  action: string;
  status: 'success' | 'partial' | 'failed';
  duration: number;
  outputs: string[];
}

// ===== IPC Channel Names =====
export const IPC_CHANNELS = {
  DB_CONNECT: 'db:connect',
  DB_DISCONNECT: 'db:disconnect',
  DB_TEST: 'db:test',
  DB_GET_TABLES: 'db:get-tables',
  DB_GET_TABLE_SCHEMA: 'db:get-table-schema',

  LAYOUT_LIST: 'layout:list',
  LAYOUT_PARSE: 'layout:parse',
  LAYOUT_GET_METADATA: 'layout:get-metadata',

  GENERATE_SQL: 'generate:sql',
  GENERATE_XML: 'generate:xml',
  GENERATE_SP: 'generate:sp',
  GENERATE_ALL: 'generate:all',

  EXPORT_FILE: 'export:file',
  EXPORT_ZIP: 'export:zip',
  EXPORT_CLIPBOARD: 'export:clipboard',

  HISTORY_LIST: 'history:list',
  HISTORY_ADD: 'history:add',
  HISTORY_GET: 'history:get',
} as const;

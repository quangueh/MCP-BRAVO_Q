export const APP_NAME = 'Bravo Layout Generator';
export const APP_VERSION = '0.1.0';

export const DEFAULT_DB_CONFIG = {
  server: 'your-sql-server',
  port: 1433,
  user: 'readonly_user',
  password: '',
  database: 'Bravo_Config',
  options: {
    trustServerCertificate: true,
    encrypt: false,
  },
};

export const TABLE_PREFIXES = {
  B00: 'Configuration',
  B10: 'Accounting',
  B20: 'Master Data',
  B30: 'Transactions',
} as const;

export const LAYOUT_IS_TEMPLATE = {
  REGULAR: 0,
  SYSTEM: 2,
  DATASOURCE: 3,
} as const;

export const DOC_STATUS = {
  DRAFT: 1,
  ACTIVE: 2,
  APPROVED: 4,
} as const;

export const SQL_TYPES = {
  INT: { width: 80, format: 'N0', controlType: 'BravoQuantityInputBox' },
  BIGINT: { width: 100, format: 'N0', controlType: 'BravoQuantityInputBox' },
  DECIMAL: { width: 120, format: 'N2', controlType: 'BravoQuantityInputBox' },
  MONEY: { width: 120, format: 'N2', controlType: 'BravoQuantityInputBox' },
  VARCHAR: { width: 150, format: '', controlType: 'BravoTextBox' },
  NVARCHAR: { width: 200, format: '', controlType: 'BravoTextBox' },
  DATE: { width: 100, format: 'dd/MM/yy', controlType: 'BravoDateInputBox' },
  DATETIME: { width: 150, format: 'dd/MM/yyyy HH:mm', controlType: 'BravoDateInputBox' },
  BIT: { width: 60, format: '', controlType: 'BravoTextBox' },
  TEXT: { width: 300, format: '', controlType: 'BravoTextBox' },
} as const;

export const HEADER_STYLE = 'BackColor:Navy;ForeColor:White;Font:,11pt,style=Bold;';
export const ALTERNATING_ROW_STYLE = 'BackColor:WhiteSmoke;';

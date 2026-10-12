# Module Definitions

## Overview

12 modules, each with single responsibility, public API, and no circular dependencies.

---

## 1. Core

**Purpose:** App shell, routing, global state, initialization.

**Responsibilities:**
- Electron main process setup
- React app initialization
- Route configuration
- Global error handling
- App lifecycle (startup, shutdown)

**Public API:**
- `App` - Root React component
- `Router` - Route configuration
- `useApp()` - App state hook

---

## 2. Database

**Purpose:** Database connection, queries, schema reading.

**Responsibilities:**
- mssql connection pool management
- Connection retry logic with exponential backoff
- Schema metadata queries (tables, columns, FKs)
- Health check polling
- Read-only query execution

**Public API:**
- `ConnectionManager` - Connection lifecycle
- `SchemaRepository` - Schema metadata access
- `useConnection()` - Connection state hook

---

## 3. Layout Parser

**Purpose:** Parse Bravo XML layout files, extract metadata.

**Responsibilities:**
- Parse Explorer XML layouts
- Parse Editor XML layouts
- Parse Report XML layouts
- Extract column definitions, styles, controls
- Detect layout type from XML structure

**Public API:**
- `LayoutParser` - Main parser class
- `parseLayout(xml: string): LayoutMetadata`
- `detectLayoutType(xml: string): LayoutType`

---

## 4. Schema Analyzer

**Purpose:** Analyze database table structure and relationships.

**Responsibilities:**
- Column type analysis and classification
- Foreign key detection
- Naming convention analysis
- Complexity scoring
- Master-detail relationship detection

**Public API:**
- `SchemaAnalyzer` - Main analyzer class
- `analyzeTable(tableName: string): TableAnalysis`
- `detectForeignKeys(columns: ColumnMetadata[]): ForeignKeyMetadata[]`

---

## 5. Relation Engine

**Purpose:** Build and manage dependency graphs between tables.

**Responsibilities:**
- Dependency graph construction
- Topological sort for generation order
- Circular dependency detection
- Related table discovery
- Join path calculation

**Public API:**
- `RelationEngine` - Main engine class
- `buildDependencyGraph(tables: string[]): DependencyGraph`
- `getGenerationOrder(graph: DependencyGraph): string[]`
- `detectCircularDeps(graph: DependencyGraph): Cycle[]`

---

## 6. SQL Generator

**Purpose:** Generate all SQL artifacts.

**Responsibilities:**
- CREATE TABLE statements
- ALTER TABLE (foreign keys)
- CREATE INDEX statements
- CRUD stored procedures
- Report stored procedures
- Views
- Audit triggers
- INSERT seed data

**Public API:**
- `SqlGenerator` - Main generator class
- `generateCreateTable(table: TableAnalysis): string`
- `generateForeignKeys(table: TableAnalysis): string`
- `generateIndexes(table: TableAnalysis): string`
- `generateStoredProcedure(table: TableAnalysis): string`

---

## 7. XML Generator

**Purpose:** Generate Bravo DataSource and Layout XML.

**Responsibilities:**
- DataSource XML generation (using DataSourceXmlBuilder)
- Explorer Layout XML generation (using ExplorerXmlBuilder)
- Editor Layout XML generation (using EditorXmlBuilder)
- Report Layout XML generation (using ReportXmlBuilder)
- Style resolution and application

**Public API:**
- `XmlGenerator` - Main generator class
- `generateDataSource(metadata: DataSourceMetadata): string`
- `generateLayout(metadata: LayoutMetadata): string`
- `buildStyles(columns: ColumnMetadata[]): StyleDefinition[]`

---

## 8. Script Engine

**Purpose:** Template rendering and code formatting.

**Responsibilities:**
- EJS template loading and rendering
- Code formatting (SQL, XML)
- Naming convention conversion (PascalCase, camelCase, snake_case)
- String utilities

**Public API:**
- `ScriptEngine` - Main engine class
- `renderTemplate(templateName: string, context: object): string`
- `formatSql(sql: string): string`
- `toPascalCase(str: string): string`

---

## 9. Preview

**Purpose:** Syntax highlighting, diff view, code display.

**Responsibilities:**
- Syntax highlighting (SQL, XML, JavaScript)
- Side-by-side diff computation
- Line numbering
- Search within code
- Copy to clipboard

**Public API:**
- `SyntaxHighlighter` - Highlighting engine
- `DiffEngine` - Diff computation
- `highlight(code: string, language: string): HighlightedLines[]`
- `computeDiff(left: string, right: string): DiffResult`

---

## 10. Export

**Purpose:** File export, ZIP bundling, clipboard operations.

**Responsibilities:**
- Individual file export
- ZIP archive creation
- Clipboard operations
- File naming and organization
- Output directory management

**Public API:**
- `ExportManager` - Main export class
- `exportFile(content: string, filename: string): void`
- `exportZip(files: ExportFile[]): void`
- `copyToClipboard(content: string): void`

---

## 11. History

**Purpose:** Versioning, undo/redo, activity logging.

**Responsibilities:**
- Version storage and retrieval
- Diff between versions
- Rollback operations
- Activity log (who, what, when)
- Auto-cleanup of old versions

**Public API:**
- `HistoryManager` - Main history class
- `recordGeneration(entry: HistoryEntry): void`
- `getVersions(layoutName: string): Version[]`
- `rollback(versionId: string): void`
- `getActivityLog(filter: LogFilter): ActivityEntry[]`

---

## 12. UI

**Purpose:** React components, themes, animations.

**Responsibilities:**
- All reusable UI components (20 components)
- Theme management (dark/light)
- Animation utilities
- Responsive layout helpers
- Icon library

**Public API:**
- All component exports
- `useTheme()` - Theme hook
- `useAnimation()` - Animation hook

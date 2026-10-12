# Engine Directory Structure

## `src/main/engines/` - All Generation Engines

Each engine follows the same internal structure.

---

## Common Pattern

```
src/main/engines/{engine-name}/
|-- index.ts                # Public API (barrel export)
|-- {feature}.ts            # Feature implementations
|-- types.ts                # Engine-specific interfaces
+-- helpers.ts              # Internal helper functions (optional)
```

**Rules:**
- `index.ts` exports only the public API
- `types.ts` defines interfaces used by other modules
- Max 500 lines per file; split into multiple files if exceeded
- No circular imports within an engine

---

## 1. layout-parser/

```
layout-parser/
|-- index.ts                # Public: parseLayout(), detectLayoutType()
|-- explorer-parser.ts      # Parse Explorer XML
|-- editor-parser.ts        # Parse Editor XML
|-- report-parser.ts        # Parse Report XML
|-- column-extractor.ts     # Extract column definitions from XML
|-- control-extractor.ts    # Extract control definitions from XML
+-- types.ts                # LayoutMetadata, ParsedColumn, etc.
```

---

## 2. schema-analyzer/

```
schema-analyzer/
|-- index.ts                # Public: analyzeTable(), detectForeignKeys()
|-- table-analyzer.ts       # Table structure analysis
|-- column-classifier.ts    # Column type classification
|-- fk-detector.ts          # Foreign key detection
|-- naming-analyzer.ts      # Naming convention analysis
|-- complexity-scorer.ts    # Complexity scoring
+-- types.ts                # TableAnalysis, ColumnClass, etc.
```

---

## 3. relation-engine/

```
relation-engine/
|-- index.ts                # Public: buildGraph(), getGenerationOrder()
|-- graph-builder.ts        # Dependency graph construction
|-- topological-sort.ts     # Topological ordering
|-- cycle-detector.ts       # Circular dependency detection
|-- join-calculator.ts      # Join path calculation
+-- types.ts                # DependencyGraph, Node, Edge, Cycle, etc.
```

---

## 4. sql-generator/

```
sql-generator/
|-- index.ts                # Public: generateCreateTable(), etc.
|-- create-table.ts         # CREATE TABLE statements
|-- foreign-keys.ts         # ALTER TABLE ADD CONSTRAINT
|-- indexes.ts              # CREATE INDEX statements
|-- crud-sp.ts              # CRUD stored procedures (INSERT/UPDATE/DELETE/SELECT)
|-- report-sp.ts            # Report stored procedures
|-- views.ts                # CREATE VIEW statements
|-- triggers.ts             # Audit triggers
|-- seed-data.ts            # INSERT seed data statements
+-- types.ts                # SqlGenerationOptions, GeneratedSql, etc.
```

---

## 5. xml-generator/

```
xml-generator/
|-- index.ts                # Public: generateDataSource(), generateLayout()
|-- builders/               # Builder classes
|   |-- xml-builder.ts      # Abstract base class
|   |-- explorer-builder.ts # ExplorerXmlBuilder
|   |-- editor-builder.ts   # EditorXmlBuilder
|   |-- report-builder.ts   # ReportXmlBuilder
|   +-- datasource-builder.ts # DataSourceXmlBuilder
|-- style-engine.ts         # Style resolution engine
|-- control-mapping.ts      # DB type to UI control mapping
+-- types.ts                # BuilderOptions, StyleDefinition, etc.
```

---

## 6. script-engine/

```
script-engine/
|-- index.ts                # Public: renderTemplate(), formatSql()
|-- template-renderer.ts    # EJS template loading and rendering
|-- code-formatter.ts       # SQL/XML code formatting
|-- naming-converter.ts     # Naming convention conversion
+-- types.ts                # TemplateContext, FormatOptions, etc.
```

---

## Engine Dependencies

```
layout-parser -----> (standalone, parses XML)
schema-analyzer ---> (standalone, reads DB metadata)
relation-engine --> schema-analyzer
sql-generator ----> schema-analyzer, relation-engine, script-engine
xml-generator ----> schema-analyzer, relation-engine, script-engine
script-engine ----> (standalone, template + formatting)
```

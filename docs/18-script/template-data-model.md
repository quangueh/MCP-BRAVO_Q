# Template Data Model

## GenerateContext

The root object passed to all templates during generation.

```typescript
interface GenerateContext {
  metadata: LayoutMetadata;
  schema: SchemaMetadata;
  relations: Relation[];
  options: GenerateOptions;
}
```

## GenerateOptions

Controls what gets generated.

```typescript
interface GenerateOptions {
  includeAudit: boolean;      // add CreatedDate/By, ModifiedDate/By columns
  includeSeed: boolean;       // generate seed data INSERT statements
  schemaName: string;         // target schema (default: "dbo")
  language: string;           // output language for comments ("vi" | "en")
}
```

## GenerateOutput

The result of a full generation run. Each field contains the generated code for that object type.

```typescript
interface GenerateOutput {
  tables: string;             // CREATE TABLE statements
  foreignKeys: string;        // ALTER TABLE ADD CONSTRAINT FK
  indexes: string;            // CREATE INDEX statements
  sps: string;                // Stored procedure definitions
  views: string;              // View definitions
  triggers: string;           // Trigger definitions
  inserts: string;            // Seed data INSERT statements
  dataSourceXml: string;      // DataSource XML
  layoutXml: string;          // Layout XML (Explorer/Editor/Report)
  metadata: string;           // JSON metadata for the layout
}
```

## LayoutMetadata

Parsed from the input XML layout.

```typescript
interface LayoutMetadata {
  formName: string;
  formType: 'Explorer' | 'Editor' | 'Report';
  title: string;
  tableName: string;
  columns: ColumnMetadata[];
  toolbarCommands: ToolbarCommand[];
  relations: Relation[];
}

interface ColumnMetadata {
  name: string;
  header: string;
  dataType: string;
  maxLength?: number;
  nullable: boolean;
  defaultValue?: string;
  isPrimaryKey: boolean;
  isForeignKey: boolean;
  referencesTable?: string;
  referencesColumn?: string;
  visible: boolean;
  readOnly: boolean;
  width?: number;
  format?: string;
  styleClass?: string;
}
```

## SchemaMetadata

Loaded from the database.

```typescript
interface SchemaMetadata {
  tables: TableInfo[];
  columns: ColumnInfo[];
  foreignKeys: ForeignKeyInfo[];
  indexes: IndexInfo[];
  procedures: ProcedureInfo[];
  views: ViewInfo[];
}
```

## Relation

Represents a relationship between tables.

```typescript
interface Relation {
  sourceTable: string;
  sourceColumn: string;
  targetTable: string;
  targetColumn: string;
  relationType: 'one-to-many' | 'one-to-one';
}
```

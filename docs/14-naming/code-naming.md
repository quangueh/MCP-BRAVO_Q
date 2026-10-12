# Code Naming Conventions

## Variables — camelCase

```typescript
const layoutMetadata: LayoutMetadata = { ... };
const columnName = 'CustomerName';
let isProcessing = false;
```

## Functions — camelCase

```typescript
function parseLayout(xml: string): LayoutMetadata { ... }
function generateTable(metadata: TableMetadata): string { ... }
function validateColumn(column: ColumnMetadata): boolean { ... }
```

## Classes — PascalCase

```typescript
class LayoutParser { ... }
class SqlGenerator { ... }
class SchemaAnalyzer { ... }
class ExportManager { ... }
```

## Interfaces — PascalCase (I prefix optional)

```typescript
interface Metadata { ... }
interface IMetadata { ... }   // also valid

interface LayoutParserResult { ... }
interface ColumnDefinition { ... }
```

> Prefer no `I` prefix unless disambiguation is needed (e.g., `IMetadata` vs a `Metadata` class in the same scope).

## Types — PascalCase

```typescript
type ColumnMetadata = { name: string; type: string; nullable: boolean; };
type LayoutType = 'Explorer' | 'Editor' | 'Report';
type GenerateStatus = 'idle' | 'processing' | 'done' | 'error';
```

## Constants — UPPER_SNAKE_CASE

```typescript
const MAX_COLUMNS = 256;
const DEFAULT_WIDTH = 120;
const CONNECTION_TIMEOUT = 30000;
const SUPPORTED_LAYOUT_TYPES = ['Explorer', 'Editor', 'Report'] as const;
```

## Enums — PascalCase names, PascalCase members

```typescript
enum LayoutType {
  Explorer = 'Explorer',
  Editor = 'Editor',
  Report = 'Report',
}

enum GenerateStatus {
  Idle = 'Idle',
  Processing = 'Processing',
  Done = 'Done',
  Error = 'Error',
}
```

## Private Fields — `_` Prefix

```typescript
class LayoutParser {
  private _cache: Map<string, LayoutMetadata>;
  private _isInitialized: boolean = false;

  private _parseNode(node: XmlNode): ColumnMetadata { ... }
}
```

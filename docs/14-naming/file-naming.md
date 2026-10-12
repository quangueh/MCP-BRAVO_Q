# File Naming Conventions

## Rules

| Category          | Convention       | Examples                                      |
|-------------------|------------------|-----------------------------------------------|
| Source files      | kebab-case       | `layout-parser.ts`, `sql-generator.ts`        |
| Test files        | `{name}.test.ts` | `layout-parser.test.ts`, `sql-generator.test.ts` |
| Config files      | lowercase + dots | `default.json`, `tsconfig.json`               |
| Template files    | PascalCase       | `CreateTable.sql`, `ExplorerLayout.xml`       |
| Generated output  | `{Name}_{Type}`  | `B20Customer_CreateTable.sql`, `Customer_Explorer.xml` |

## Constraints

- No spaces allowed
- No special characters (except `.` for extensions and `-`/`_` as separators)
- Maximum 64 characters per filename

## Source Files (kebab-case)

```
layout-parser.ts        # parses XML layouts
sql-generator.ts        # generates SQL output
xml-generator.ts        # generates XML output
schema-analyzer.ts      # analyzes DB schema
export-manager.ts       # handles file exports
```

## Test Files

```
layout-parser.test.ts
sql-generator.test.ts
schema-analyzer.test.ts
```

## Config Files (lowercase with dots)

```
default.json
tsconfig.json
eslint.config.js
```

## Template Files (PascalCase)

```
CreateTable.sql
ExplorerLayout.xml
AddForeignKey.sql
EditorLayout.xml
```

## Generated Output

```
B20Customer_CreateTable.sql
B30BizDoc_AddForeignKey.sql
Customer_Explorer.xml
Invoice_Editor.xml
```

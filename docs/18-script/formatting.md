# Code Formatting Engine

## SQL Formatting

| Rule                      | Example                              |
|---------------------------|--------------------------------------|
| 2-space indentation       | `  [Column] INT NOT NULL`           |
| Keywords UPPERCASE        | `SELECT`, `FROM`, `WHERE`, `JOIN`   |
| Identifiers lowercase     | `[customername]`, `[docdate]`       |
| Line break before clauses | `FROM`, `WHERE`, `JOIN`, `ORDER BY` |
| Align commas              | commas before column names, aligned  |

**Tool:** `sql-formatter` npm package

```typescript
import { format } from 'sql-formatter';

const formatted = format(sqlString, {
  language: 'mssql',
  indent: '  ',
  uppercase: true,
  linesBetweenQueries: 2
});
```

## XML Formatting

| Rule                              | Example                              |
|-----------------------------------|--------------------------------------|
| 2-space indentation               | proper nesting with 2-space indent   |
| Self-closing for empty elements   | `<Column />` instead of `<Column></Column>` |
| Proper nesting                    | correct parent-child relationships   |
| UTF-8 encoding declaration        | `<?xml version="1.0" encoding="utf-8"?>`    |

**Tool:** `fast-xml-parser` npm package

```typescript
import { XMLParser, XMLBuilder } from 'fast-xml-parser';

const parser = new XMLParser({ ignoreAttributes: false });
const builder = new XMLBuilder({
  format: true,
  indentBy: '  ',
  suppressEmptyNode: true
});
const xml = builder.build(parser.parse(rawXml));
```

## JSON Formatting

| Rule                  | Value     |
|-----------------------|-----------|
| Indentation           | 2 spaces  |
| Sorted keys           | Yes       |
| Trailing newline      | Yes       |

```typescript
const formatted = JSON.stringify(obj, Object.keys(obj).sort(), 2) + '\n';
```

## Integration

All three formatters are applied automatically after generation:

1. SQL output -> `sql-formatter`
2. XML output -> `fast-xml-parser` builder
3. JSON output -> `JSON.stringify` with sort + indent

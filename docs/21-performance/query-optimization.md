# Query Optimization

## Rules

### 1. SELECT Explicit Columns, Never SELECT *

```sql
-- BAD
SELECT * FROM B20Customer;

-- GOOD
SELECT Id, CustomerCode, CustomerName FROM B20Customer;
```

### 2. Use LEFT JOIN, Never Subqueries Where JOIN Works

```sql
-- BAD
SELECT * FROM B30BizDoc WHERE CustomerId IN (SELECT Id FROM B20Customer WHERE IsActive = 1);

-- GOOD
SELECT d.*
FROM B30BizDoc d
LEFT JOIN B20Customer c ON d.CustomerId = c.Id
WHERE c.IsActive = 1;
```

### 3. Filter Early (WHERE Before JOIN)

```sql
-- Better: filter reduces rows before join
SELECT d.*, c.CustomerName
FROM B30BizDoc d
INNER JOIN (
  SELECT Id, CustomerName FROM B20Customer WHERE IsActive = 1
) c ON d.CustomerId = c.Id;
```

### 4. Use Indexed Columns in WHERE

Always filter on columns that have an index (PK, FK, or explicitly indexed).

### 5. Limit Results (TOP for Large Tables)

```sql
SELECT TOP 1000 Id, CustomerCode, CustomerName
FROM B20Customer
ORDER BY Id;
```

### 6. Use NOLOCK Hint for Reads

Since the database is read-only for BLG:

```sql
SELECT Id, CustomerCode
FROM B20Customer WITH (NOLOCK)
WHERE IsActive = 1;
```

### 7. Cache Schema Queries

Run schema queries once per session, cache the result in memory.

```typescript
let schemaCache: SchemaMetadata | null = null;

async function getSchema(): Promise<SchemaMetadata> {
  if (!schemaCache) {
    schemaCache = await loadSchemaFromDb();
  }
  return schemaCache;
}
```

### 8. Parameterize All Queries

```typescript
// BAD — string interpolation
const query = `SELECT * FROM ${tableName}`;

// GOOD — parameterized
const query = `SELECT * FROM @tableName`;
request.input('tableName', sql.NVarChar, tableName);
```

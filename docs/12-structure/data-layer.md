# Data Layer Architecture

## Components

```
+-------------------+     +-------------------+     +-------------------+
| ConnectionManager |---->| SchemaRepository  |---->| LayoutRepository  |
+-------------------+     +-------------------+     +-------------------+
        |                        |                          |
        v                        v                          v
+---------------------------------------------------------------+
|                       CacheManager                             |
|   Layer 1: In-memory (schemas, layouts)                        |
|   Layer 2: File-based (generated outputs)                      |
+---------------------------------------------------------------+
                                |
                                v
+---------------------------------------------------------------+
|                       ConfigStore                              |
|   User settings persistence (JSON file)                        |
+---------------------------------------------------------------+
```

---

## 1. ConnectionManager

**Purpose:** Manage mssql connection pool with retry logic.

```typescript
class ConnectionManager {
    private pool: mssql.ConnectionPool | null;
    private config: ConnectionConfig;
    
    connect(config: ConnectionConfig): Promise<void>
    disconnect(): Promise<void>
    query<T>(sql: string, params?: object): Promise<T[]>
    healthCheck(): Promise<boolean>
    isConnected(): boolean
}
```

**Features:**
- Connection pooling (min: 2, max: 10)
- Retry logic: 3 attempts with exponential backoff (1s, 2s, 4s)
- Health check polling every 30 seconds
- Graceful shutdown on app close
- Connection string masking in logs

---

## 2. SchemaRepository

**Purpose:** Read and cache table metadata from the database.

```typescript
class SchemaRepository {
    getTables(): Promise<TableMetadata[]>
    getColumns(tableName: string): Promise<ColumnMetadata[]>
    getForeignKeys(tableName: string): Promise<ForeignKeyMetadata[]>
    getIndexes(tableName: string): Promise<IndexMetadata[]>
    getStoredProcedures(): Promise<SPMetadata[]>
    refresh(): Promise<void>
}
```

**Caching:**
- Schema data cached in memory after first load
- Cache invalidated on explicit refresh
- Cache TTL: session lifetime (cleared on reconnect)

---

## 3. LayoutRepository

**Purpose:** Read and parse layout XML files.

```typescript
class LayoutRepository {
    getLayouts(): Promise<LayoutSummary[]>
    getLayout(name: string): Promise<LayoutMetadata>
    getLayoutXml(name: string): Promise<string>
    search(query: string): Promise<LayoutSummary[]>
    filter(criteria: FilterCriteria): Promise<LayoutSummary[]>
}
```

**Caching:**
- Parsed layout metadata cached in memory
- Raw XML cached on disk (file-based cache)
- Cache invalidated when source XML changes

---

## 4. CacheManager

**Purpose:** Two-tier caching for performance.

```typescript
class CacheManager {
    // Layer 1: In-memory
    get<T>(key: string): T | null
    set<T>(key: string, value: T, ttl?: number): void
    has(key: string): boolean
    invalidate(key: string): void
    invalidateAll(): void
    
    // Layer 2: File-based
    getFile(key: string): string | null
    setFile(key: string, content: string): void
    hasFile(key: string): boolean
}
```

**Layers:**
1. **In-memory:** Fast access for schemas and layout metadata. Max: 100MB.
2. **File-based:** Persistent cache for generated outputs. Stored in `.cache/` directory.

**Eviction:** LRU when memory limit reached. File cache cleaned on app start.

---

## 5. ConfigStore

**Purpose:** Persist user settings to JSON file.

```typescript
class ConfigStore {
    get<T>(key: string): T
    set<T>(key: string, value: T): void
    getAll(): AppConfig
    reset(): void
    save(): void
}
```

**Storage location:** `~/.blg/config.json`

**Settings persisted:**
- Database connection (password encrypted)
- Default schema
- Template directory
- Appearance (theme, font size, language)
- Generation defaults (output types, options)
- Window size and position

---

## Important: READ-ONLY Database Access

All database access through ConnectionManager is **READ-ONLY**. The app never modifies the Bravo database.

Write operations (generation outputs) go to:
- `output/` directory for SQL files
- `output/xml/` for XML files
- `.cache/` for cached data

SQL scripts that would modify the database are generated as files in `output/`, never executed directly.

# Module Interactions

## Data Flow

```
UI (React)
    |
    v
Core (App Shell)
    |
    v
Layout Parser -----> Schema Analyzer -----> Relation Engine
    |                    |                       |
    v                    v                       v
SQL Generator <---- (metadata) <----------- (dependencies)
    |
    v
XML Generator
    |
    v
Preview -----> Export
    |
    v
History
```

---

## State Management

### Zustand Stores

| Store | Scope | Contents |
|---|---|---|
| layoutStore | Layout data | Selected layout, metadata, list of layouts |
| generationStore | Generation state | Output types, progress, results, errors |
| settingsStore | App settings | DB connection, preferences, theme |
| historyStore | History data | Versions, activity log, current diff |

### Store Dependencies

```
settingsStore (root - persisted)
    |
    +-- layoutStore (depends on DB connection)
    |
    +-- generationStore (depends on selected layout)
    |
    +-- historyStore (depends on generation results)
```

---

## Event Bus

Used for async cross-module communication. See [event-system.md](event-system.md).

---

## Module Dependency Matrix

| Module | Depends On | Depended By |
|---|---|---|
| Core | All infrastructure | All presentation |
| Database | (none) | Schema Analyzer, Layout Parser |
| Layout Parser | Database | Schema Analyzer |
| Schema Analyzer | Database, Layout Parser | Relation Engine |
| Relation Engine | Schema Analyzer | SQL Generator, XML Generator |
| SQL Generator | Schema Analyzer, Relation Engine, Script Engine | Preview, Export |
| XML Generator | Schema Analyzer, Relation Engine, Script Engine | Preview, Export |
| Script Engine | (none) | SQL Generator, XML Generator |
| Preview | SQL Generator, XML Generator | Export, UI |
| Export | Preview | UI |
| History | Export | UI |
| UI | All modules | (none - leaf) |

---

## Interaction Examples

### Generate SQL for a Layout

1. **UI** user clicks "Generate"
2. **Core** receives action, calls generation use case
3. **Layout Parser** parses the layout XML (if exists)
4. **Schema Analyzer** queries DB for table metadata
5. **Relation Engine** builds dependency graph
6. **SQL Generator** generates CREATE TABLE, FK, INDEX
7. **XML Generator** generates DataSource and Layout XML
8. **Preview** receives generated outputs for display
9. **History** records the generation event
10. **UI** shows results in tabbed preview

### Rollback to Previous Version

1. **UI** user selects version in history
2. **Core** receives rollback action
3. **History** retrieves stored version outputs
4. **History** creates new version entry
5. **Export** updates output files
6. **UI** shows success notification

---

## Async Patterns

| Pattern | Use Case |
|---|---|
| Direct call | Synchronous operations (parsing, formatting) |
| Event bus | Progress updates, notifications |
| Zustand action | State changes with side effects |
| Promise chain | Multi-step generation pipeline |

# Plugin Hook Catalog

## Hook Points

### 1. `onBeforeGenerate(metadata: LayoutMetadata) -> LayoutMetadata`

Modify metadata before generation begins.

**Use cases:**
- Add custom columns
- Override column types
- Inject computed fields

**When called:** After layout is parsed, before SQL/XML generation.

---

### 2. `onAfterGenerate(output: GenerateOutput) -> GenerateOutput`

Post-process generated output.

**Use cases:**
- Add copyright headers to generated files
- Reformat output
- Append additional SQL statements

**When called:** After all generation is complete, before export.

---

### 3. `onExport(exportData: ExportData) -> ExportData`

Modify data during export.

**Use cases:**
- Transform output to a different format
- Add metadata to exported files
- Route files to different directories

**When called:** During the export phase.

---

### 4. `onValidate(result: ValidationResult) -> ValidationResult`

Add custom validation rules.

**Use cases:**
- Enforce naming conventions
- Check business rules
- Warn about deprecated patterns

**When called:** After built-in validation runs.

---

### 5. `onLayoutParsed(layoutData: LayoutMetadata) -> LayoutMetadata`

Extend or transform parsed layout data.

**Use cases:**
- Add virtual columns not in the original layout
- Normalize column names
- Resolve lookup references

**When called:** Immediately after XML layout parsing.

---

### 6. `onSchemaLoaded(schemaData: SchemaMetadata) -> SchemaMetadata`

Extend or filter database schema data.

**Use cases:**
- Filter out system tables
- Add computed column metadata
- Merge schema from multiple databases

**When called:** After schema is loaded from the database.

---

## Execution Rules

- Hooks run **sequentially** in priority order
- **First failure stops the hook chain** for that hook point
- Lower priority number runs first
- Default priority: `100`

```typescript
// Hook with custom priority
hooks: {
  onBeforeGenerate: {
    handler: (meta) => { ... },
    priority: 10  // runs before priority 100
  }
}
```

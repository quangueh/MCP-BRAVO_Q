# Test Data Management

## Fixtures Directory

```
tests/fixtures/
  ├── layouts/            # 10 sample XML layout files
  │   ├── simple-explorer.xml
  │   ├── explorer-with-joins.xml
  │   ├── simple-editor.xml
  │   ├── editor-with-lookups.xml
  │   ├── report-basic.xml
  │   ├── wide-table.xml
  │   ├── no-primary-key.xml
  │   ├── circular-references.xml
  │   ├── nested-groups.xml
  │   └── unicode-columns.xml
  ├── schemas/            # JSON schema files (frozen DB snapshots)
  │   ├── Bravo_Config.schema.json
  │   └── test-schema.json
  └── expected/           # Expected outputs for snapshot tests
      ├── simple-explorer-create-table.sql
      ├── simple-explorer-layout.xml
      └── ... (one per test case)
```

## Schema Generation

Use `extract_schema.js` (already exists in the project) to create JSON schema snapshots.

```bash
node scripts/extract_schema.js --output tests/fixtures/schemas/Bravo_Config.schema.json
```

Run once, commit the output. Update only when schema intentionally changes.

## Snapshot Testing

Save expected output, compare on each test run.

```typescript
it('should match expected CREATE TABLE output', () => {
  const sql = generator.generateCreateTable(metadata);
  expect(sql).toMatchSnapshot();
});
```

## Updating Snapshots

```bash
npx vitest --update-snapshot
```

**Always review diffs before accepting snapshot updates.**

## Size Management

- Keep total fixture size **< 1MB**
- Avoid large binary fixtures
- Use compressed/minified XML for large layout samples if needed

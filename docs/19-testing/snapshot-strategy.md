# Snapshot Testing Strategy

## What TO Snapshot

- Generated SQL (`CREATE TABLE`, `ALTER TABLE ADD FK`, stored procedures)
- Generated XML (`DataSource`, `Layout`)
- Formatted output (post-formatting result)

## What NOT to Snapshot

- Intermediate data structures (metadata objects, parsed layouts)
- Config objects (too volatile)
- Database query results (covered by integration tests)

## Example

```typescript
describe('SqlGenerator', () => {
  it('should generate correct CREATE TABLE for explorer layout', () => {
    const metadata = loadFixture('simple-explorer');
    const sql = generator.generateCreateTable(metadata);
    expect(sql).toMatchSnapshot('simple-explorer-create-table');
  });

  it('should generate correct FK constraints', () => {
    const metadata = loadFixture('explorer-with-joins');
    const fk = generator.generateForeignKeys(metadata);
    expect(fk).toMatchSnapshot('explorer-with-joins-fk');
  });
});
```

## Update Policy

1. Run `npx vitest --update-snapshot` to regenerate snapshots
2. **Review every diff** in the pull request before merging
3. Only accept snapshot updates when the change is intentional

## Size Management

- Max **100 snapshots** in the project
- Delete oldest/most stable snapshots if limit is exceeded
- Use descriptive snapshot names for easy identification

## Snapshot Naming

```
{module}-{test-case}.snap
```

Examples:
- `sql-generator-simple-explorer-create-table.snap`
- `xml-generator-explorer-with-joins-layout.snap`

## CI Integration

- Snapshot diffs are shown inline in pull request reviews
- CI fails if snapshots don't match (unless `--update-snapshot` is used)
- Snapshot changes require explicit approval in code review

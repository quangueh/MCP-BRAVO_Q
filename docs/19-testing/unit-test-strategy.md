# Unit Test Strategy

## Framework

**Vitest** — chosen for native TypeScript support, fast execution, and Jest-compatible API.

## Coverage Targets

| Module              | Target Line Coverage |
|---------------------|----------------------|
| Engines (parser, generators, analyzers) | 80%       |
| Utilities (formatters, validators)      | 90%       |
| Types (interfaces, type guards)         | 50%       |

## Mocking Strategy

| Dependency         | Mock Approach                              |
|--------------------|--------------------------------------------|
| `mssql` (database) | Vitest `vi.mock('mssql')`, return canned data |
| `fs` (file system) | `vi.mock('fs')` with in-memory file system    |
| XML parser         | `vi.mock('fast-xml-parser')` for controlled input |

## Test Patterns

**Arrange-Act-Assert:**
```typescript
describe('SqlGenerator', () => {
  it('should generate CREATE TABLE for simple entity', () => {
    // Arrange
    const metadata = createSimpleMetadata();

    // Act
    const sql = generator.generateCreateTable(metadata);

    // Assert
    expect(sql).toContain('CREATE TABLE');
    expect(sql).toContain('[CustomerName]');
  });
});
```

**Naming convention:**
```
should{ExpectedBehavior}For{Scenario}
```

Examples:
- `shouldGenerateCreateTableForSimpleEntity`
- `shouldThrowParseErrorForMalformedXml`
- `shouldIncludeAuditColumnsWhenOptionEnabled`

## Fixtures

Located in `tests/fixtures/`:

```
tests/fixtures/
  ├── metadata/        # sample LayoutMetadata objects
  │   ├── simple-explorer.json
  │   ├── complex-editor.json
  │   └── report-with-joins.json
  └── expected/        # expected output strings (for snapshot comparison)
      ├── simple-explorer-create-table.sql
      └── complex-editor-layout.xml
```

## Target

80% line coverage for all engine modules.

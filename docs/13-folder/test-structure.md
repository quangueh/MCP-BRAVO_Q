# Test Directory Structure

## `tests/` - Root

```
tests/
|-- unit/                   # Unit tests (mirrors src/ structure)
|   |-- main/
|   |   |-- engines/
|   |   |   |-- layout-parser/
|   |   |   |   |-- explorer-parser.test.ts
|   |   |   |   |-- editor-parser.test.ts
|   |   |   |   +-- column-extractor.test.ts
|   |   |   |-- schema-analyzer/
|   |   |   |   |-- table-analyzer.test.ts
|   |   |   |   +-- fk-detector.test.ts
|   |   |   |-- relation-engine/
|   |   |   |   |-- graph-builder.test.ts
|   |   |   |   +-- cycle-detector.test.ts
|   |   |   |-- sql-generator/
|   |   |   |   |-- create-table.test.ts
|   |   |   |   |-- foreign-keys.test.ts
|   |   |   |   +-- indexes.test.ts
|   |   |   |-- xml-generator/
|   |   |   |   |-- explorer-builder.test.ts
|   |   |   |   |-- editor-builder.test.ts
|   |   |   |   |-- report-builder.test.ts
|   |   |   |   +-- style-engine.test.ts
|   |   |   +-- script-engine/
|   |   |       |-- template-renderer.test.ts
|   |   |       +-- naming-converter.test.ts
|   |   |-- database/
|   |   |   +-- schema.test.ts
|   |   +-- utils/
|   |       +-- crypto.test.ts
|   |-- renderer/
|   |   |-- stores/
|   |   |   |-- layoutStore.test.ts
|   |   |   +-- generationStore.test.ts
|   |   |-- hooks/
|   |   |   +-- useSearch.test.ts
|   |   +-- components/
|   |       +-- Table.test.tsx
|   +-- shared/
|       |-- utils/
|       |   |-- naming.test.ts
|       |   +-- validation.test.ts
|       +-- constants/
|           +-- patterns.test.ts
|
|-- integration/            # Integration tests
|   |-- generation-pipeline.test.ts    # Full generation flow
|   |-- layout-parsing-flow.test.ts    # Parse -> Analyze flow
|   |-- export-flow.test.ts            # Generate -> Export flow
|   +-- db-schema-read.test.ts         # DB connection + schema
|
|-- e2e/                    # End-to-end tests
|   |-- onboarding.test.ts             # First-time user flow
|   |-- single-generation.test.ts      # Single layout generation
|   |-- batch-generation.test.ts       # Batch generation
|   +-- history-rollback.test.ts       # History and rollback
|
|-- fixtures/               # Test data
|   |-- xml/
|   |   |-- explorer-sample.xml        # Sample Explorer XML
|   |   |-- editor-sample.xml          # Sample Editor XML
|   |   +-- report-sample.xml          # Sample Report XML
|   |-- schemas/
|   |   |-- customer-schema.json       # Sample table schema
|   |   |-- invoice-schema.json        # Sample table schema
|   |   +-- budget-sp-schema.json      # Sample SP schema
|   |-- sql/
|   |   |-- expected-create-table.sql  # Expected output
|   |   +-- expected-fk.sql            # Expected output
|   +-- xml-output/
|       |-- expected-datasource.xml    # Expected DataSource XML
|       +-- expected-layout.xml        # Expected Layout XML
|
+-- helpers/                # Test utilities
    |-- test-setup.ts       # Global test setup (mocks, config)
    |-- mock-db.ts          # Mock database connection
    |-- xml-helpers.ts      # XML comparison utilities
    +-- assertion-helpers.ts # Custom assertion functions
```

---

## Naming Conventions

| Type | Pattern | Example |
|---|---|---|
| Unit test | `{module}.test.ts` | `create-table.test.ts` |
| Integration test | `{feature}.integration.test.ts` | `generation-pipeline.integration.test.ts` |
| E2E test | `{flow}.test.ts` | `single-generation.test.ts` |
| Fixture | `{descriptive}.{ext}` | `customer-schema.json` |

---

## Test Framework

- **Runner:** Vitest (fast, Vite-native)
- **Assertions:** Vitest built-in + custom helpers
- **Mocking:** Vitest mocks for modules, custom mocks for DB
- **React testing:** @testing-library/react
- **E2E:** Playwright

---

## Test Configuration

```typescript
// vitest.config.ts
export default {
    test: {
        globals: true,
        environment: 'node',        // For main process tests
        environmentMatchGlobs: [
            ['**/*.tsx', 'jsdom']   // For React component tests
        ],
        setupFiles: ['./tests/helpers/test-setup.ts'],
        coverage: {
            reporter: ['text', 'html'],
            exclude: ['tests/fixtures/']
        }
    }
}
```

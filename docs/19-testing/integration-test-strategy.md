# Integration Test Strategy

## Test Scenarios

### 1. Layout Parsing End-to-End

```
Input:  XML layout file (from fixtures)
Output: LayoutMetadata object
```

Validates: XML parsing, column extraction, type inference, relation detection.

### 2. SQL Generation End-to-End

```
Input:  LayoutMetadata object
Output: SQL string (CREATE TABLE, FK, SP, etc.)
```

Validates: Template rendering, variable substitution, SQL syntax (via parser or regex).

### 3. XML Generation End-to-End

```
Input:  LayoutMetadata object
Output: XML string (DataSource, Layout)
```

Validates: XML structure, attribute correctness, self-closing tags, encoding.

### 4. Full Pipeline

```
Input:  Layout XML file
Output: All generated artifacts (SQL + XML + metadata)
```

Validates: Complete flow from raw layout to all output types.

## Database Strategy

Use **cached schema** — no live database required for tests.

```
tests/fixtures/schemas/
  ├── Bravo_Config.schema.json     # frozen schema snapshot
  └── Bravo_Config_Staging.schema.json
```

Schema is extracted once by `extract_schema.js` and committed as a fixture.

## Fixture Layouts

10 representative layouts covering all types and edge cases:

| #  | Layout Name            | Type     | Edge Case                  |
|----|------------------------|----------|----------------------------|
| 1  | simple-explorer        | Explorer | Single table, no relations |
| 2  | explorer-with-joins    | Explorer | Multiple JOINs            |
| 3  | simple-editor          | Editor   | Basic form fields          |
| 4  | editor-with-lookups    | Editor   | LookupBox bindings         |
| 5  | report-basic           | Report   | Parameters + columns       |
| 6  | wide-table             | Explorer | 50+ columns               |
| 7  | no-primary-key         | Explorer | Missing PK (error case)   |
| 8  | circular-references    | Explorer | A->B->A relations         |
| 9  | nested-groups          | Explorer | Column groups / tree       |
| 10 | unicode-columns        | Explorer | Vietnamese column names    |

## Performance Target

Each integration test: **< 5 seconds**.

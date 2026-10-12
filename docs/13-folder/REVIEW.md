# Phase 13 Review: Folder Structure

## Status: COMPLETE

## Tasks Completed

| Task | Description | Status |
|---|---|---|
| 13.1 | Root Folder Structure | DONE |
| 13.2 | Source Directory Structure | DONE |
| 13.3 | Engine Directory Structure | DONE |
| 13.4 | Test Directory Structure | DONE |
| 13.5 | Config File Structure | DONE |

## Summary

### Root Structure

```
blg/
  src/          - Source code (main, renderer, shared)
  docs/         - Documentation (34 directories)
  tests/        - Unit, integration, E2E tests
  templates/    - EJS generation templates (sql/, xml/, sp/)
  knowledge/    - Extracted schemas and layouts
  output/       - Generated output (git-ignored)
  config/       - App configuration
  scripts/      - Build scripts
  .cache/       - Runtime cache (git-ignored)
  logs/         - Runtime logs (git-ignored)
```

### Source Structure

- `src/renderer/` - React frontend with components (by feature), pages, stores, hooks, styles
- `src/main/` - Electron main with database, ipc, engines
- `src/shared/` - Types, constants, utilities, IPC channels

### Engine Structure

6 engines, each following the pattern: `index.ts` (public API) + feature files + `types.ts`:
1. layout-parser/ - 6 files (explorer, editor, report parsers, extractors)
2. schema-analyzer/ - 6 files (table, column, FK, naming, complexity)
3. relation-engine/ - 5 files (graph, sort, cycle, join)
4. sql-generator/ - 9 files (table, FK, index, CRUD SP, report SP, view, trigger, seed)
5. xml-generator/ - 7 files (4 builders, style engine, control mapping)
6. script-engine/ - 4 files (template renderer, formatter, naming)

### Test Structure

- `tests/unit/` - Mirrors src/ structure, one test file per module
- `tests/integration/` - 4 integration test suites (pipeline, parsing, export, DB)
- `tests/e2e/` - 4 E2E test suites (onboarding, single gen, batch, history)
- `tests/fixtures/` - Sample XML, schemas, expected outputs
- `tests/helpers/` - Test setup, mock DB, custom assertions
- Framework: Vitest + @testing-library/react + Playwright

### Config Structure

- `.env` - Environment variables (DB credentials)
- `config/default.json` - Default settings (DB, generation, appearance, cache, history)
- `templates/` - EJS templates organized by output type (sql/, xml/, sp/)
- `knowledge/` - Pre-extracted metadata for offline access

## Decisions Made

1. Feature-based component organization (not type-based)
2. Each engine in its own directory with consistent internal structure
3. Max 500 lines per file rule
4. Test structure mirrors source structure for easy navigation
5. Two-tier config: .env for secrets, default.json for app settings
6. Knowledge directory for pre-extracted metadata (offline support)

## Ready For Next Phase

Phase 13 is complete. The project is ready to proceed to Phase 14 (Naming Conventions).

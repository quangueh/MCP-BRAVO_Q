# Import / Export Standard

## Barrel Exports

Each module directory has an `index.ts` that re-exports the public API.

```
src/engines/
  ├── parser.ts
  ├── sql-generator.ts
  ├── xml-generator.ts
  └── index.ts          # re-exports public classes/functions
```

```typescript
// src/engines/index.ts
export { LayoutParser } from './parser';
export { SqlGenerator } from './sql-generator';
export { XmlGenerator } from './xml-generator';
```

Consumers import from the barrel:
```typescript
import { LayoutParser, SqlGenerator } from '@engines';
```

## Path Aliases

| Alias          | Maps To             |
|----------------|---------------------|
| `@shared/*`    | `src/shared/*`      |
| `@engines/*`   | `src/engines/*`     |
| `@components/*`| `src/components/*`  |
| `@stores/*`    | `src/stores/*`      |

## No Circular Imports

The dependency graph must be a DAG (directed acyclic graph).

```
@engines -> @shared      (allowed)
@shared  -> @engines     (FORBIDDEN — circular)
```

Use `madge` or `eslint-plugin-import` to detect cycles.

## Dynamic Imports

Use for large modules that are not needed at startup.

```typescript
const { PreviewRenderer } = await import('./preview-renderer');
const { DiffViewer } = await import('./diff-viewer');
```

Targets: Preview, Diff, Export modules.

## Re-Export Pattern

```typescript
export { Parser } from './parser';
export type { ParserResult } from './parser';  // type-only re-export
```

## Import Order

```
1. Node built-ins        (path, fs, os)
2. External packages     (mssql, fast-xml-parser)
3. Internal @shared/*    (types, utils)
4. Internal @engines/*   (generators, parsers)
5. Parent/sibling        (../types, ./helpers)
```

Each group separated by a blank line.

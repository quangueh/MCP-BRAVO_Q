# Error Handling Standard

## Custom Error Hierarchy

```
AppError (base)
  ├── DatabaseError
  ├── ParseError
  ├── GenerationError
  ├── ValidationError
  └── ExportError
```

## Error Shape

```typescript
interface AppError {
  code: string;          // DB_CONNECT_FAIL, XML_PARSE_ERROR, ...
  message: string;       // human-readable message
  details?: unknown;     // original error, context
  suggestion?: string;   // actionable next step
}
```

## Custom Error Classes

```typescript
class AppError extends Error {
  code: string;
  details?: unknown;
  suggestion?: string;

  constructor(code: string, message: string, suggestion?: string, details?: unknown) {
    super(message);
    this.code = code;
    this.suggestion = suggestion;
    this.details = details;
  }
}

class DatabaseError extends AppError { ... }
class ParseError extends AppError { ... }
class GenerationError extends AppError { ... }
class ValidationError extends AppError { ... }
class ExportError extends AppError { ... }
```

## Error Boundaries

| Layer              | Handler                               |
|--------------------|----------------------------------------|
| React UI           | `<ErrorBoundary>` component            |
| Engine / Generator | `try/catch` around each operation      |
| Main process       | global `uncaughtException` handler     |

## User-Facing Messages

Never show raw error messages to users. Always include an action.

```typescript
// BAD
throw new Error("ECONNREFUSED 127.0.0.1:1433");

// GOOD
throw new DatabaseError(
  'DB_CONNECT_FAIL',
  'Connection failed. Check server address and try again.',
  'Verify database server is running and settings are correct.',
  originalError
);
```

## Logging

- All errors logged with full context (module, function, input summary)
- Stack trace logged in `DEBUG` mode only
- PII filtered before logging (passwords, tokens)

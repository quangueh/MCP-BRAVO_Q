# Error Log Design

## Schema

```typescript
interface ErrorLogEntry {
  timestamp: string;           // ISO 8601
  level: 'WARN' | 'ERROR';
  category: string;            // 'db' | 'parser' | 'generator' | 'ui' | 'system'
  message: string;             // human-readable error message
  stack?: string;              // stack trace (debug mode only)
  context: {
    module: string;            // which module threw the error
    function: string;          // which function
    inputSummary: string;      // truncated input that caused the error
  };
  resolution?: string;         // how the error was resolved (filled in later)
}
```

## Storage

File-based at `{appdata}/blg/logs/errors/`

```
{appdata}/blg/logs/errors/
  ├── errors-2026-07-24.log
  ├── errors-2026-07-23.log
  └── ...
```

Format: JSON Lines (one JSON object per line)

## PII Filtering

Before logging, filter sensitive data:

| Field Pattern     | Filter Action           |
|-------------------|-------------------------|
| Password fields   | Masked: `********`      |
| Connection strings| Password portion masked |
| Long strings      | Truncated to 200 chars  |
| Token / API keys  | Masked: `****...****`   |

## Consecutive Error Alert

If **5 consecutive errors** occur within a short window:
- Show a user notification in the UI
- Include count and most recent error message
- Offer action: "View error details" / "Dismiss"

## Resolution Tracking

Errors can be marked as resolved after investigation.

```typescript
// Mark error as resolved
await errorLog.resolve(errorId, 'Fixed by updating connection string');
```

Resolution is stored in the `resolution` field and shown in the error history view.

## Export

Export error log for debugging support:
- JSON export of all errors in date range
- Attach to support tickets

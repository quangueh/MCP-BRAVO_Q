# Activity Log Design

## Schema

```typescript
interface ActivityLogEntry {
  timestamp: string;         // ISO 8601
  action: 'generate' | 'preview' | 'export' | 'import' | 'rollback';
  layoutName: string;
  outputTypes: string[];     // ["CreateTable", "ForeignKey", ...]
  status: 'success' | 'partial' | 'failed';
  duration: number;          // milliseconds
  errorMessage?: string;     // present when status is 'failed' or 'partial'
  userId?: string;           // optional, for multi-user scenarios
}
```

## Storage

**SQLite** database at `{appdata}/blg/activity.db`

```sql
CREATE TABLE activity_log (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  timestamp     TEXT    NOT NULL,
  action        TEXT    NOT NULL,
  layout_name   TEXT    NOT NULL,
  output_types  TEXT    NOT NULL,   -- JSON array
  status        TEXT    NOT NULL,
  duration      INTEGER NOT NULL,
  error_message TEXT,
  user_id       TEXT
);

CREATE INDEX idx_activity_log_timestamp ON activity_log(timestamp);
CREATE INDEX idx_activity_log_layout    ON activity_log(layout_name);
CREATE INDEX idx_activity_log_action    ON activity_log(action);
```

## Retention

- Default: **90 days** (configurable via `history.retentionDays`)
- Cleanup runs on app startup
- Old entries deleted automatically

## Querying

Supports filtering by:
- Date range (`timestamp BETWEEN ? AND ?`)
- Layout name (`layout_name = ?`)
- Action (`action = ?`)
- Status (`status = ?`)

## Export

Export activity log to:
- CSV (for spreadsheet analysis)
- JSON (for programmatic use)

## UI Display

History page shows:
- List of all activity entries
- Search by layout name
- Filter by action, status, date range
- Duration column for performance monitoring
- Click to view error details (for failed entries)

# Logging Specification

## Log Levels

| Level  | Use Case                   | Example                               |
|--------|----------------------------|---------------------------------------|
| DEBUG  | Development diagnostics    | Variable values, function entry/exit  |
| INFO   | Normal operations          | "Generation completed successfully"   |
| WARN   | Recoverable issues         | "Column type not found, using default"|
| ERROR  | Failures                   | "Database connection failed"          |

## Log Categories

| Category   | Scope                              |
|------------|-------------------------------------|
| `db`       | Database operations (connect, query, disconnect) |
| `parser`   | XML parsing (load, parse, validate) |
| `generator`| SQL/XML generation (template render, format) |
| `ui`       | User actions (button click, selection, navigation) |
| `system`   | App lifecycle (startup, shutdown, config load) |

## Log Format

```
[2026-07-24T10:30:00.000Z] [INFO] [generator] Generation completed for B20Customer { duration: 1234, outputType: "CreateTable" }
```

Pattern:
```
[TIMESTAMP] [LEVEL] [CATEGORY] message {context}
```

## Output Destinations

| Environment | Destination                            |
|-------------|----------------------------------------|
| Development | Console (`console.log`)                |
| Production  | File: `{appdata}/blg/logs/blg-{date}.log` |

## Log Rotation

| Setting         | Value       |
|-----------------|-------------|
| Rotation period | Daily       |
| Max file size   | 10 MB       |
| Max retention   | 30 days     |
| Cleanup         | Automatic on app start |

## Configuration

```json
{
  "advanced": {
    "logLevel": "INFO"
  }
}
```

Set to `DEBUG` during development for verbose output.

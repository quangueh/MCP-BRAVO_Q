# Database Connection Configuration

## Connection Properties

| Property | Type   | Default            | Description              |
|----------|--------|--------------------|--------------------------|
| server   | string | `"localhost"`      | Database server address  |
| port     | number | `1433`            | Server port              |
| user     | string | —                  | Login username           |
| password | string | —                  | Login password (encrypted at rest) |
| database | string | `"Bravo_Config"`  | Target database name     |

## Driver Options

```json
{
  "options": {
    "trustServerCertificate": true,
    "encrypt": false
  }
}
```

## Connection Pool

```json
{
  "pool": {
    "max": 5,
    "min": 0,
    "idleTimeout": 30000
  }
}
```

## Multiple Profiles

Store multiple connection profiles in a `connections` array.

```json
{
  "connections": [
    { "name": "Production", "server": "10.0.0.1", "port": 1433, "database": "Bravo_Config", "user": "readonly", "password": "..." },
    { "name": "Staging",    "server": "10.0.0.2", "port": 1433, "database": "Bravo_Config_Staging", "user": "readonly", "password": "..." }
  ]
}
```

## Test Connection

Use a simple ping query:

```sql
SELECT 1
```

## Reconnect Strategy

Exponential backoff on connection failure:

```
Attempt 1: wait 1s
Attempt 2: wait 2s
Attempt 3: wait 4s
...
Max wait: 30s per attempt
Max attempts: 5
```

After max attempts, show error to user with suggestion to check network/server.

# History and Versioning Design

## Version Entry Schema

```json
{
  "id": "string",
  "timestamp": "Date",
  "layoutName": "string",
  "options": {},
  "outputs": [],
  "metadata": {},
  "checksum": "string"
}
```

## Storage

- `{appdata}/blg/versions/{id}/` - output files + `manifest.json`
- `{appdata}/blg/versions/index.json` - fast listing index

## Retention

- Max 100 versions
- Oldest auto-deleted when limit exceeded

## Operations

| Operation | Description |
|---|---|
| Diff | Compare any two versions by checksum |
| Restore | Copy version outputs to current state |

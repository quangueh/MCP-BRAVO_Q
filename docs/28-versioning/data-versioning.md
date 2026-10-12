# Data/Schema Versioning

## Metadata Schema Version

- `{ schemaVersion: "1.0.0" }` in every metadata JSON

## Metadata Migration

- If `schemaVersion` < current, run migration functions

## Config Version

- `{ configVersion: 1 }` in `settings.json`

## Config Migration

- Add new fields with defaults
- Remove deprecated fields

## Compatibility

| Direction | Strategy |
|---|---|
| Backward | Old metadata loads with warnings |
| Forward | New fields are optional |

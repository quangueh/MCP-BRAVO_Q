# Schema Cache Strategy

## Cache Key

- Database name

## Contents

- Tables (with columns, types, PKs)
- Foreign keys
- Indexes

## Load

- On first DB connection
- Takes ~2s for 218 tables

## Refresh

- Manual button or on reconnect

## Validation

- Compare table count with last cached value

## Storage

- `Map<string, SchemaMetadata>` in memory
- Serialized to `cache/schema-{db}.json` on disk

# Layout Cache Strategy

## Cache Key

- File path + file hash (md5)

## Contents

- Parsed LayoutMetadata

## Load

- On layout selection
- ~100ms for parsed XML

## Refresh

- On file modification time change

## Invalidation

- When layout XML is re-exported

## Storage

- `Map<string, LayoutMetadata>` with LRU eviction (max 500 entries)

## Index

- Inverted index for search (table names, column names, layout names)

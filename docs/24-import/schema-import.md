# Database Schema Import

## Process

1. Connect to DB (read-only)
2. Query `INFORMATION_SCHEMA.TABLES` for table list
3. Query `INFORMATION_SCHEMA.COLUMNS` for each table
4. Query `sys.foreign_keys` for FKs
5. Query `sys.indexes` for indexes
6. Build SchemaMetadata for each table
7. Cache all schemas
8. Return schema summary

## Performance

- Timeout: 30s for full schema
- Incremental: only reload changed tables

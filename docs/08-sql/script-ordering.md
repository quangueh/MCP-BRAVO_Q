# Script Execution Order

## 8-Phase Execution Order

### Phase 1: CREATE TABLE
All tables, ordered by dependency graph (topological sort).
Independent tables first. No FK constraints in this phase.

### Phase 2: ALTER TABLE ADD CONSTRAINT FK
After all tables exist. Add all foreign key constraints.
Deferred FKs (circular dependency breaks) last.

### Phase 3: CREATE INDEX
After all FKs are created.
FK indexes, unique indexes, composite indexes.

### Phase 4: CREATE VIEW
After tables and indexes.
Simple views, JOIN views, aggregate views.

### Phase 5: CREATE PROCEDURE
After views. CRUD SPs, report SPs, utility SPs.

### Phase 6: CREATE TRIGGER
After SPs. Audit triggers only.

### Phase 7: INSERT Seed Data
After all objects created.
Reference data, lookup data, initial config.

### Phase 8: GRANT Permissions
Last phase. Execute on SPs, SELECT on views/tables.

## Execution Flow

```
Phase 1: CREATE TABLE -----> [All tables exist]
Phase 2: ALTER TABLE FK ----> [All FKs exist]
Phase 3: CREATE INDEX -----> [All indexes exist]
Phase 4: CREATE VIEW ------> [All views exist]
Phase 5: CREATE PROCEDURE --> [All SPs exist]
Phase 6: CREATE TRIGGER ---> [All triggers exist]
Phase 7: INSERT seed data --> [Data loaded]
Phase 8: GRANT perms ------> [Access configured]
```

## Transaction Wrapping
Each phase wrapped in a transaction:
```sql
BEGIN TRANSACTION;
-- Phase N operations...
COMMIT TRANSACTION;
GO
```
If any statement fails, the entire phase rolls back.

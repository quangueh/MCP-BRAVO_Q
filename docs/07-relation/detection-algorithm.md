# Relation Detection Algorithm

## Overview
Automated detection of table relationships in the Bravo ERP database schema.

## Input
- Schema JSON files (table-metadata.json for each table)
- _foreign_keys.json (explicit FK definitions from database)
- Naming conventions documentation

## Output
- Complete relation graph with confidence scores
- Adjacency list representation
- Detected types: OneToMany, ManyToOne, ManyToMany, SelfRef, DocumentChain

---

## Step 1: Read Explicit Foreign Keys
Load from _foreign_keys.json.
```javascript
const foreignKeys = JSON.parse(fs.readFileSync("_foreign_keys.json"));
for (const fk of foreignKeys) {
  addRelation({
    sourceTable: fk.TABLE_NAME,
    sourceColumn: fk.COLUMN_NAME,
    targetTable: fk.REFERENCED_TABLE_NAME,
    targetColumn: fk.REFERENCED_COLUMN_NAME,
    confidence: 100,
    method: "ForeignKey"
  });
}
```

## Step 2: Name-Based Inference
Scan columns ending in "Id" (excluding "Id" itself).

| Column Name | Inferred Target | Confidence |
|-------------|-----------------|------------|
| CustomerId | B20Customer | 80% |
| JobId | B20Job | 80% |
| BudgetConsId | B10BudgetCons | 80% |
| ParentId | (same table) | 90% (self-ref) |
| CreatedBy | B20SysUser | 60% |
| BranchCode | B00Branch | 70% |

## Step 3: Confidence Scoring
| Method | Score | Notes |
|--------|-------|-------|
| FK metadata | 100% | Explicit FK exists |
| Name match exact | 80% | Column matches table |
| Name match partial | 50% | Partial string match |
| Convention | 60% | Standard field |
| Manual | 100% | User-specified |

Adjustments: type match +10%, convention match +5%, NOT NULL +5%.

## Step 4: Detect Self-References
FK where source table = target table. Common: ParentId, ManagerId.

## Step 5: Detect Junction Tables (N:M)
Criteria: 2+ FKs to different tables, few non-FK columns.

## Step 6: Detect Document Chains
Sequential: Quotation -> Order -> Invoice -> Payment.

## Step 7: Build Adjacency List
Graph representation for traversal and cycle detection.

## Step 8: Detect Cycles
DFS-based. Self-refs are NOT cycles.

## Output Format
```json
{
  "relations": [{"name":"FK_...","type":"OneToMany","confidence":100}],
  "junctionTables": [{"tableName":"B20UserRole","masterTables":["B20User","B20Role"]}],
  "documentChains": [],
  "cycles": []
}
```

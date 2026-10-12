# Dependency Graph Builder

## Overview

Builds a dependency graph from table relations and determines the correct order for SQL script execution using topological sort.

---

## Algorithm: Topological Sort (Kahn Algorithm)

### JavaScript Implementation

```javascript
function buildDependencyGraph(relations) {
  const tables = new Set();
  for (const rel of relations) {
    tables.add(rel.sourceTable);
    tables.add(rel.targetTable);
  }

  const graph = new Map();
  const inDegree = new Map();

  for (const table of tables) {
    graph.set(table, []);
    inDegree.set(table, 0);
  }

  for (const rel of relations) {
    graph.get(rel.targetTable).push(rel.sourceTable);
    inDegree.set(rel.sourceTable, inDegree.get(rel.sourceTable) + 1);
  }

  const queue = [];
  for (const [table, degree] of inDegree) {
    if (degree === 0) queue.push(table);
  }

  const sorted = [];
  while (queue.length > 0) {
    const node = queue.shift();
    sorted.push(node);

    for (const neighbor of graph.get(node)) {
      inDegree.set(neighbor, inDegree.get(neighbor) - 1);
      if (inDegree.get(neighbor) === 0) {
        queue.push(neighbor);
      }
    }
  }

  if (sorted.length !== tables.size) {
    const remaining = [...tables].filter(t => !sorted.includes(t));
    return { order: sorted, circular: remaining, error: "Circular dependency detected" };
  }

  return { order: sorted, circular: [], error: null };
}
```

---

## Example

### Input Relations

```
B20Order     -> B20Customer    (CustomerId)
B20Order     -> B20Product     (ProductId)
B20OrderItem -> B20Order       (OrderId)
B20OrderItem -> B20Product     (ProductId)
B20Customer  -> B00Branch      (BranchCode)
B20Product   -> B20Category    (CategoryId)
```

### Topological Sort Result

```
Phase 1: B00Branch, B20Category       (no dependencies)
Phase 2: B20Customer, B20Product       (depend on Phase 1)
Phase 3: B20Order                      (depends on Phase 2)
Phase 4: B20OrderItem                  (depends on Phase 3)
```

### SQL Execution Order

```sql
-- Phase 1: Independent tables
CREATE TABLE [dbo].[B00Branch] (...);
CREATE TABLE [dbo].[B20Category] (...);

-- Phase 2: First-level dependencies
CREATE TABLE [dbo].[B20Customer] (...);
CREATE TABLE [dbo].[B20Product] (...);

-- Phase 3: Second-level dependencies
CREATE TABLE [dbo].[B20Order] (...);

-- Phase 4: Third-level dependencies
CREATE TABLE [dbo].[B20OrderItem] (...);

-- FK constraints (after all tables exist)
ALTER TABLE ... ADD CONSTRAINT FK_B20Customer_B00Branch ...;
ALTER TABLE ... ADD CONSTRAINT FK_B20Product_B20Category ...;
ALTER TABLE ... ADD CONSTRAINT FK_B20Order_B20Customer ...;
ALTER TABLE ... ADD CONSTRAINT FK_B20Order_B20Product ...;
ALTER TABLE ... ADD CONSTRAINT FK_B20OrderItem_B20Order ...;
ALTER TABLE ... ADD CONSTRAINT FK_B20OrderItem_B20Product ...;
```

---

## Cycle Resolution

When circular dependencies are detected:

1. Identify the cycle: A -> B -> C -> A
2. Find the weakest link (optional FK, nullable column)
3. Break the cycle by deferring that FK constraint
4. Create all tables first, then add deferred FK via ALTER TABLE

```javascript
function resolveCycle(cycle, relations) {
  for (let i = 0; i < cycle.length; i++) {
    const source = cycle[i];
    const target = cycle[(i + 1) % cycle.length];

    const rel = relations.find(r =>
      r.sourceTable === source && r.targetTable === target
    );

    if (rel && rel.isOptional) {
      return {
        breakAt: { source, target },
        deferredFK: rel,
        reason: "Optional FK can be deferred"
      };
    }
  }

  return {
    breakAt: null,
    error: "No optional FK found in cycle. Manual intervention required.",
    cycle: cycle
  };
}
```

---

## Output Format

```json
{
  "order": ["B00Branch", "B20Category", "B20Customer", "B20Product", "B20Order", "B20OrderItem"],
  "phases": [
    {"phase": 1, "tables": ["B00Branch", "B20Category"]},
    {"phase": 2, "tables": ["B20Customer", "B20Product"]},
    {"phase": 3, "tables": ["B20Order"]},
    {"phase": 4, "tables": ["B20OrderItem"]}
  ],
  "circular": [],
  "deferredFKs": [],
  "warnings": []
}
```

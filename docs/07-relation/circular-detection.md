# Circular Dependency Detection

## Overview

Detection and resolution of circular dependencies in table relationships.

---

## Definitions

### Self-Reference (NOT Circular)

A table referencing itself is a valid tree structure, NOT a circular dependency.

```
B20ClassInfo.ParentId -> B20ClassInfo.Id  (VALID TREE)
```

### True Circular Dependency

A chain of references that forms a cycle between different tables.

```
A -> B -> C -> A  (CIRCULAR - must be resolved)
```

---

## Detection Algorithm: DFS-Based Cycle Detection

```javascript
function detectCycles(graph) {
  const WHITE = 0; // Unvisited
  const GRAY = 1;  // In current path
  const BLACK = 2; // Fully processed

  const color = {};
  const cycles = [];

  for (const node of Object.keys(graph)) {
    color[node] = WHITE;
  }

  function dfs(node, path) {
    color[node] = GRAY;
    path.push(node);

    for (const edge of (graph[node] || [])) {
      const neighbor = edge.target;

      // Skip self-references (they are trees, not cycles)
      if (neighbor === node) continue;

      if (color[neighbor] === GRAY) {
        // Found a cycle
        const cycleStart = path.indexOf(neighbor);
        cycles.push(path.slice(cycleStart));
      } else if (color[neighbor] === WHITE) {
        dfs(neighbor, [...path]);
      }
    }

    color[node] = BLACK;
  }

  for (const node of Object.keys(graph)) {
    if (color[node] === WHITE) {
      dfs(node, []);
    }
  }

  return cycles;
}
```

---

## Resolution Strategy

### Rule 1: Self-References Are Not Circular

```javascript
function isTrueCircular(cycle) {
  if (cycle.length === 1) return false;
  return new Set(cycle).size > 1;
}
```

### Rule 2: Break at Weakest Link

Find the optional FK in the cycle to break:

```javascript
function findWeakestLink(cycle, relations) {
  const candidates = [];

  for (let i = 0; i < cycle.length; i++) {
    const source = cycle[i];
    const target = cycle[(i + 1) % cycle.length];

    const rel = relations.find(r =>
      r.sourceTable === source && r.targetTable === target
    );

    if (rel) {
      let weakness = 0;
      if (rel.isOptional) weakness += 3;
      if (rel.onDelete === "SET_NULL") weakness += 2;
      if (rel.confidence < 80) weakness += 1;

      candidates.push({ relation: rel, weakness, index: i });
    }
  }

  candidates.sort((a, b) => b.weakness - a.weakness);
  return candidates[0] || null;
}
```

### Rule 3: Generate Deferred FK

When breaking a cycle, create tables first, then add the deferred FK:

```javascript
function generateWithCycleResolution(tables, relations, cycles) {
  const deferredFKs = [];

  for (const cycle of cycles) {
    const weakest = findWeakestLink(cycle.tables, relations);
    if (weakest) {
      deferredFKs.push(weakest.relation);
    }
  }

  const createStatements = tables.map(t =>
    generateCreateTable(t, { includeFK: false })
  );

  const fkStatements = relations
    .filter(r => !deferredFKs.includes(r))
    .map(r => generateFKConstraint(r));

  const deferredStatements = deferredFKs
    .map(r => generateFKConstraint(r));

  return {
    creates: createStatements,
    fks: fkStatements,
    deferred: deferredStatements,
    warnings: deferredFKs.map(fk =>
      "FK " + fk.sourceTable + " -> " + fk.targetTable + " deferred due to circular dependency"
    )
  };
}
```

---

## Resolution Example

### Circular Dependency

```
B20Project -> B20Department (DepartmentId)
B20Department -> B20Project (DefaultProjectId)
```

### Resolution

1. Detect cycle: B20Project -> B20Department -> B20Project
2. Find weakest link: B20Department.DefaultProjectId is nullable (optional)
3. Generate B20Project table first (no FK to B20Department)
4. Generate B20Department table with FK to B20Project
5. Deferred: ALTER TABLE B20Project ADD CONSTRAINT FK_B20Project_B20Department

```sql
-- Phase 1: Create tables without circular FK
CREATE TABLE [dbo].[B20Project] (
    [Id] INT IDENTITY(1,1) NOT NULL,
    [Name] NVARCHAR(255) NOT NULL,
    [DepartmentId] INT NULL,  -- FK added later
    CONSTRAINT [PK_B20Project] PRIMARY KEY CLUSTERED ([Id] ASC)
);

CREATE TABLE [dbo].[B20Department] (
    [Id] INT IDENTITY(1,1) NOT NULL,
    [Name] NVARCHAR(255) NOT NULL,
    [DefaultProjectId] INT NULL,
    CONSTRAINT [PK_B20Department] PRIMARY KEY CLUSTERED ([Id] ASC)
);

-- Phase 2: Add non-circular FKs
ALTER TABLE [dbo].[B20Department]
ADD CONSTRAINT [FK_B20Department_B20Project]
FOREIGN KEY ([DefaultProjectId]) REFERENCES [dbo].[B20Project]([Id])
ON DELETE SET NULL ON UPDATE CASCADE;

-- Phase 3: Add deferred FK (breaks cycle)
ALTER TABLE [dbo].[B20Project]
ADD CONSTRAINT [FK_B20Project_B20Department]
FOREIGN KEY ([DepartmentId]) REFERENCES [dbo].[B20Department]([Id])
ON DELETE SET NULL ON UPDATE CASCADE;
```

---

## When No Optional FK Exists

If all FKs in the cycle are required (NOT NULL):

1. Warn user about the hard circular dependency
2. Require manual intervention
3. Suggest options:
   - Make one FK nullable
   - Remove one FK constraint
   - Redesign table structure

```json
{
  "error": "HARD_CIRCULAR_DEPENDENCY",
  "cycle": ["B20A", "B20B", "B20C", "B20A"],
  "message": "All FKs in cycle are required. Manual intervention needed.",
  "suggestions": [
    "Make B20C.AId nullable (currently NOT NULL)",
    "Remove FK B20C -> B20A",
    "Merge B20A and B20B into single table"
  ]
}
```

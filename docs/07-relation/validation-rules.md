# Relation Validation Rules

## Overview

Comprehensive validation rules for table relationships in the Bravo ERP schema.

---

## Rules

### Rule 1: FK Target Table Must Exist

Every FK constraint must reference a table that exists in the schema.

```javascript
function validateTargetExists(relations, tables) {
  const tableNames = new Set(tables.map(t => t.tableName));
  const violations = [];

  for (const rel of relations) {
    if (!tableNames.has(rel.targetTable)) {
      violations.push({
        rule: "FK_TARGET_EXISTS",
        severity: "ERROR",
        message: "FK " + rel.name + " references non-existent table " + rel.targetTable,
        relation: rel
      });
    }
  }

  return violations;
}
```

### Rule 2: FK Column Type Must Match PK Column Type

```javascript
function validateColumnType(relations, tables) {
  const violations = [];

  for (const rel of relations) {
    const sourceTable = tables.find(t => t.tableName === rel.sourceTable);
    const targetTable = tables.find(t => t.tableName === rel.targetTable);

    const sourceCol = sourceTable?.columns.find(c => c.name === rel.sourceColumn);
    const targetCol = targetTable?.columns.find(c => c.name === rel.targetColumn);

    if (sourceCol && targetCol && sourceCol.dataType !== targetCol.dataType) {
      violations.push({
        rule: "FK_TYPE_MATCH",
        severity: "ERROR",
        message: "Type mismatch: " + rel.sourceTable + "." + rel.sourceColumn,
        relation: rel
      });
    }
  }

  return violations;
}
```

### Rule 3: FK Column Length Must Match PK Column Length

For string types, the max length must be equal or greater.

### Rule 4: No Duplicate FK Constraints

Each source-column to target-table combination should have only one FK.

### Rule 5: No Circular Dependencies (Except Self-Ref)

True circular dependencies must be detected and flagged.

### Rule 6: Composite FK Column Order Must Match PK

For composite FKs, the column order must match the referenced PK column order.

### Rule 7: FK Naming Convention Must Be Consistent

All FK constraints follow: FK_{Source}_{Target}

### Rule 8: Every FK Should Have an Index

FK columns should be indexed for JOIN performance.

```javascript
function validateFKHasIndex(relations, indexes) {
  const violations = [];

  for (const rel of relations) {
    const hasIndex = indexes.some(idx =>
      idx.tableName === rel.sourceTable &&
      idx.columns.includes(rel.sourceColumn)
    );

    if (!hasIndex) {
      violations.push({
        rule: "FK_INDEX_REQUIRED",
        severity: "WARNING",
        message: "No index on FK column " + rel.sourceTable + "." + rel.sourceColumn,
        relation: rel,
        suggestion: "CREATE INDEX [IX_" + rel.sourceTable + "_" + rel.sourceColumn + "] ON [" + rel.sourceTable + "] ([" + rel.sourceColumn + "])"
      });
    }
  }

  return violations;
}
```

### Rule 9: Required FKs Cannot Have NULL

If a FK column is NOT NULL, the referenced record must exist.

```javascript
function validateRequiredFK(relations, tables) {
  const violations = [];

  for (const rel of relations) {
    const sourceCol = getColumn(tables, rel.sourceTable, rel.sourceColumn);

    if (sourceCol && !sourceCol.nullable && rel.onDelete === "SET_NULL") {
      violations.push({
        rule: "FK_REQUIRED_NO_SETNULL",
        severity: "ERROR",
        message: "Required FK " + rel.sourceTable + "." + rel.sourceColumn + " cannot use ON DELETE SET NULL",
        relation: rel
      });
    }
  }

  return violations;
}
```

### Rule 10: Optional FKs Should Have ON DELETE SET NULL

If a FK column is nullable, the delete action should be SET NULL.

---

## Complete Validation Suite

```javascript
function validateAll(relations, tables, indexes) {
  const violations = [
    ...validateTargetExists(relations, tables),
    ...validateColumnType(relations, tables),
    ...validateColumnLength(relations, tables),
    ...validateNoDuplicates(relations),
    ...validateNoCycles(relations),
    ...validateCompositeOrder(relations, tables),
    ...validateNamingConvention(relations),
    ...validateFKHasIndex(relations, indexes),
    ...validateRequiredFK(relations, tables),
    ...validateOptionalFK(relations, tables)
  ];

  const errors = violations.filter(v => v.severity === "ERROR");
  const warnings = violations.filter(v => v.severity === "WARNING");

  return {
    passed: errors.length === 0,
    errors,
    warnings,
    total: violations.length
  };
}
```

---

## Summary Table

| # | Rule                        | Severity | Auto-fix |
|---|-----------------------------|----------|----------|
| 1  | FK target table must exist  | ERROR    | No       |
| 2  | Column type must match      | ERROR    | No       |
| 3  | Column length must match    | ERROR    | No       |
| 4  | No duplicate FKs            | ERROR    | Yes      |
| 5  | No circular dependencies    | WARNING  | Yes      |
| 6  | Composite FK column order   | ERROR    | No       |
| 7  | Naming convention           | WARNING  | Yes      |
| 8  | FK should have index        | WARNING  | Yes      |
| 9  | Required FK no SET NULL     | ERROR    | No       |
| 10 | Optional FK use SET NULL    | WARNING  | Yes      |

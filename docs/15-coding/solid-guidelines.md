# SOLID Guidelines for BLG

## Single Responsibility Principle (SRP)

Each module has one job.

```
SqlGenerator   -> generates SQL only
XmlGenerator   -> generates XML only
LayoutParser   -> parses XML layouts only
SchemaAnalyzer -> reads DB schema only
ExportManager  -> writes output files only
```

No class should mix parsing, generation, and export.

## Open/Closed Principle (OCP)

New layout types are added via new builder classes — existing code is not modified.

```typescript
// Add a new layout type without touching existing generators
class DashboardLayoutBuilder implements XmlBuilder {
  build(metadata: LayoutMetadata): string { ... }
}
```

Register new builders in a factory; generators remain untouched.

## Liskov Substitution Principle (LSP)

All builders implement `XmlBuilder` and are interchangeable.

```typescript
interface XmlBuilder {
  build(metadata: LayoutMetadata): string;
}

// Any implementation works wherever XmlBuilder is expected
function generateXml(builder: XmlBuilder, metadata: LayoutMetadata): string {
  return builder.build(metadata);
}
```

## Interface Segregation Principle (ISP)

Separate interfaces for distinct concerns.

```typescript
interface LayoutParser { parse(xml: string): LayoutMetadata; }
interface SqlGenerator { generateSql(meta: LayoutMetadata): string; }
interface XmlGenerator { generateXml(meta: LayoutMetadata): string; }
interface Validator     { validate(meta: LayoutMetadata): ValidationResult; }
```

Do not combine parsing + generation into one interface.

## Dependency Inversion Principle (DIP)

Engines depend on metadata interfaces, not concrete database classes.

```typescript
// GOOD: depends on interface
class SqlGenerator {
  constructor(private schema: SchemaProvider) {}
}

// BAD: depends on concrete class
class SqlGenerator {
  constructor(private db: MsSqlConnection) {}
}
```

## Practical Rules

| Rule                        | Enforcement                     |
|-----------------------------|---------------------------------|
| No God classes              | max 300 lines per file          |
| No duplicate logic          | extract shared code to utils    |
| Clear public APIs           | barrel exports via `index.ts`   |
| Max 50 lines per function   | ESLint enforced                 |
| Max depth 4                 | ESLint enforced                 |

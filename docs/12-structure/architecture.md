# Architecture Pattern

## Decision: Modular Architecture

### Rationale

Chose **Modular Architecture** over strict Clean Architecture or MVC.

| Pattern | Pros | Cons |
|---|---|---|
| Clean Architecture | Strong boundaries, testable | Over-engineered for desktop app, unnecessary controller layer |
| MVC | Simple, well-known | Doesn't handle complex module interactions well |
| **Modular (chosen)** | Clear boundaries, practical | Needs discipline to maintain module boundaries |

**Why not Clean Architecture:** Desktop apps don't need the controller/presenter layer that Clean Architecture mandates. The overhead of interfaces for every boundary is not justified.

**Why not MVC:** MVC doesn't handle the complexity of 12 distinct modules with async interactions well. The model layer becomes a dumping ground.

**Why Modular:** Clear module boundaries with single responsibility, practical for a desktop app with 120+ tasks. Each module owns its domain and exposes a clean public API.

---

## Layers

```
+--------------------------------------------------+
|              Presentation (React)                 |
|   Components, Pages, Hooks, Stores (Zustand)     |
+--------------------------------------------------+
                        |
+--------------------------------------------------+
|            Application (Use Cases)                |
|   Orchestration, State Management, Event Bus      |
+--------------------------------------------------+
                        |
+--------------------------------------------------+
|              Domain (Business Logic)              |
|   Metadata Models, Validation Rules, Types        |
+--------------------------------------------------+
                        |
+--------------------------------------------------+
|           Infrastructure (External)               |
|   DB Access, File I/O, XML Parsing, Templates     |
+--------------------------------------------------+
```

### Layer Responsibilities

**Presentation (React)**
- UI components and pages
- Zustand stores for client state
- Custom hooks for reusable logic
- Styles and animations

**Application (Use Cases)**
- Orchestrates workflows (generate, export, etc.)
- State management across modules
- Event bus for async communication
- Caching strategies

**Domain (Business Logic)**
- Metadata models (ExplorerMetadata, EditorMetadata, etc.)
- Validation rules
- Type definitions
- Pure business logic (no external dependencies)

**Infrastructure (External)**
- Database access (mssql)
- File system operations
- XML parsing/generation
- Template rendering (EJS)

---

## Module Communication

```
Zustand Stores (sync state)
        |
        v
Event Bus (async operations)
        |
        v
Direct imports (within same layer)
```

**Rules:**
1. Presentation depends on Application and Domain
2. Application depends on Domain and Infrastructure
3. Domain has no external dependencies
4. Infrastructure depends on Domain (for types only)
5. No circular dependencies between modules

---

## Architecture Diagram

```
+--------+  +--------+  +--------+  +--------+  +--------+
|Dashboard|  |Layout  |  |Generate|  |Preview |  |Settings|
|  Page   |  | Browser|  |  Page  |  |  Page  |  |  Page  |
+----+----+  +---+----+  +---+----+  +---+----+  +---+----+
     |           |           |           |           |
     +-----------+-----------+-----------+-----------+
                         |
                   +-----+-----+
                   |   Core    |
                   | (App Shell|
                   |  Routing) |
                   +-----+-----+
                         |
        +-------+--------+--------+-------+
        |       |        |        |       |
   +----+--+ +--+---+ +--+---+ +-+----+ ++------+
   |Layout | |Schema| |SQL   | |XML   | |Script |
   |Parser | |Analy-| |Gene- | |Gene- | |Engine |
   |       | |zer   | |rator | |rator | |       |
   +---+---+ +--+---+ +--+---+ +--+---+ +---+---+
       |        |        |        |        |
       +--------+--------+--------+--------+
                         |
              +----------+----------+
              |                     |
        +-----+-----+        +-----+-----+
        |  Database  |        |   Cache   |
        |  (mssql)   |        | (memory + |
        |            |        |  file)    |
        +------------+        +-----------+
```

---

## Benefits

1. **Testable** - Each module can be tested independently with mocked dependencies
2. **Maintainable** - Clear module boundaries make changes localized
3. **Extensible** - New modules can be added without modifying existing ones
4. **Clear boundaries** - Each module has a defined public API

## Tradeoff

Slightly more code than a flat structure, but the modular approach is worth it for a 120+ task project. The discipline of maintaining boundaries pays off in maintainability.

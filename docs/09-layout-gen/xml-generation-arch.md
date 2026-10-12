# XML Generation Architecture

## Decision: Builder Pattern + Templates Hybrid

### Rationale

The XML generation system uses a hybrid approach combining the **Builder Pattern** for dynamic structures and **EJS Templates** for static fragments. This decision was made after evaluating three approaches:

| Approach | Pros | Cons |
|---|---|---|
| Pure Templates | Simple, fast for static XML | Hard to manage dynamic nesting, conditional logic becomes messy |
| Pure Builder | Full programmatic control | Verbose code for simple repetitive structures |
| **Hybrid (chosen)** | Best of both worlds | Slightly more infrastructure |

**Simple structures** (header, toolbar, standard buttons) use **EJS templates** for conciseness.

**Complex structures** (grids, controls, conditional layouts) use **Builder classes** for flexibility and testability.

---

## Architecture

```
XmlBuilder (abstract base)
    |
    +-- ExplorerXmlBuilder    (Explorer layouts)
    +-- EditorXmlBuilder      (Editor layouts)
    +-- ReportXmlBuilder      (Report layouts)
    +-- DataSourceXmlBuilder  (DataSource XML)
```

### Base Class Contract

Every builder implements the following lifecycle methods:

```
buildRoot()        -> Creates <root> element with layout-specific attributes
buildToolbar()     -> Adds toolbar with action buttons
buildContent()     -> Builds main content area (grid, controls, panels)
buildStyles()      -> Generates style definitions
buildComplete()    -> Validates XML and returns final string
```

### Template Engine (EJS)

Static XML fragments are stored as `.ejs` templates:

```
templates/xml/
    explorer-toolbar.ejs    # Standard Explorer toolbar buttons
    editor-toolbar.ejs      # Standard Editor toolbar buttons
    report-toolbar.ejs      # Standard Report toolbar buttons
    header-style.ejs        # Common header style definition
    grid-style.ejs          # Common grid style definition
    button-style.ejs        # Common button style definition
```

Templates receive a context object and produce XML strings that builders embed into their output.

### Builder for Dynamic Structure

Builders handle:
- Conditional column inclusion based on metadata
- Dynamic control type selection from column types
- Nested grid containers for master-detail
- Style resolution with priority rules
- Tree view configuration when applicable

---

## Benefits

1. **Testable** - Each builder method can be unit tested independently
2. **Extensible** - New layout types require only a new builder subclass
3. **Maintainable** - Static parts in templates, dynamic parts in code
4. **Reusable** - Common patterns (toolbar, styles) shared via templates
5. **Debuggable** - Each build step produces inspectable intermediate XML

## Tradeoff

More code than a pure template approach, but the hybrid handles the complexity of Bravo XML generation (conditional controls, nested grids, style resolution) without creating unmaintainable template spaghetti.

---

## Example Flow

```
Input: ExplorerMetadata { tableName: "Customer", columns: [...] }

1. buildRoot()
   -> <root showCommandButtons="Custom" ...>

2. buildToolbar()  
   -> Uses explorer-toolbar.ejs template
   -> <ToolStrip> with Add, Edit, Delete, Refresh, Print, Export buttons

3. buildContent()
   -> buildPanelExplorer() -> <PanelExplorer>
   -> buildGridContainer() -> <BravoGridContainer>
   -> buildCols() -> iterates metadata.columns, builds <Col> elements
   -> buildDataMember() -> sets DataMember binding

4. buildStyles()
   -> Applies style engine rules per column type
   -> Generates <Styles> section

5. buildComplete()
   -> Validates XML structure
   -> Returns final XML string
```

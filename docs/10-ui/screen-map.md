# Screen Map

## Main Navigation

Sidebar navigation with the following top-level items:

| # | Screen | Icon | Description |
|---|---|---|---|
| 1 | Dashboard | Home | Overview stats and quick actions |
| 2 | Layouts | List | Browse and search layouts |
| 3 | Generate | Play | Configure and run generation |
| 4 | History | Clock | View past generations |
| 5 | Settings | Gear | App configuration |

---

## Screen Inventory

### 1. Dashboard
- **Route:** `/`
- **Purpose:** Landing page with overview stats, recent activity, quick actions
- **Components:** StatCards, ActivityTable, QuickActions

### 2. Layout Browser
- **Route:** `/layouts`
- **Purpose:** Search, filter, and browse all available layouts
- **Components:** SearchBar, FilterDropdowns, LayoutGrid/ListView, Pagination

### 3. Layout Detail
- **Route:** `/layouts/:id`
- **Purpose:** View layout metadata, relation graph, XML preview
- **Components:** MetadataView, RelationGraph, PreviewPanel

### 4. Generation Config
- **Route:** `/generate`
- **Purpose:** Select output types and configure generation options
- **Components:** OutputCheckboxes, OptionsPanel, GenerateButton

### 5. Generation Progress
- **Route:** `/generate/progress`
- **Purpose:** Real-time progress of ongoing generation
- **Components:** ProgressBar, StepIndicators, LogPanel

### 6. Output Preview
- **Route:** `/preview`
- **Purpose:** View generated output in tabbed view with syntax highlighting
- **Components:** TabBar, CodeBlock, DiffView, Toolbar

### 7. Batch Generation
- **Route:** `/batch`
- **Purpose:** Multi-select layouts for batch generation
- **Components:** MultiSelectGrid, BatchOptions, BatchProgress

### 8. History
- **Route:** `/history`
- **Purpose:** View past generations with search and filtering
- **Components:** SearchBar, DateRangePicker, HistoryTable, DetailDrawer

### 9. Settings
- **Route:** `/settings`
- **Purpose:** Configure database connection, templates, appearance
- **Components:** FormSections, ConnectionTest, ThemeToggle

### 10. Documentation
- **Route:** `/docs`
- **Purpose:** Help documentation and guides
- **Components:** TableOfContents, MarkdownRenderer

---

## Navigation Flow Diagram

```
                    +-----------+
                    | Dashboard |
                    +-----+-----+
                          |
          +-------+-------+-------+-------+
          |       |       |       |       |
     +----+--+ +--+--+ +--+--+ +-+----+ ++------+
     |Layouts| |Gene-| |Batch| |His-  | |Settings|
     |Browser| |rate | |     | |tory  | |        |
     +---+---+ +--+--+ +--+--+ +--+---+ +--------+
         |        |       |       |
    +----+---+ +-+----+  |   +---+----+
    |Layout  | |Pro-  |  |   |History |
    |Detail  | |gress |  |   |Detail  |
    +--------+ +--+---+  |   +--------+
                   |      |
              +----+---+  |
              |Preview |  |
              |(tabs)  |  |
              +--------+  |
                          |
              +-----------+
              | Batch     |
              | Progress  |
              +-----------+
```

---

## Route Configuration

```typescript
const routes = [
    { path: "/", element: <Dashboard /> },
    { path: "/layouts", element: <LayoutBrowser /> },
    { path: "/layouts/:id", element: <LayoutDetail /> },
    { path: "/generate", element: <GenerationConfig /> },
    { path: "/generate/progress", element: <GenerationProgress /> },
    { path: "/preview", element: <OutputPreview /> },
    { path: "/batch", element: <BatchGeneration /> },
    { path: "/history", element: <History /> },
    { path: "/settings", element: <Settings /> },
    { path: "/docs", element: <Documentation /> },
];
```

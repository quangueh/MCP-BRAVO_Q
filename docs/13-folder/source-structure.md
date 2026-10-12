# Source Directory Structure

## `src/renderer/` - React Frontend

```
src/renderer/
|-- index.html              # HTML entry point
|-- main.tsx                # React entry point
|-- App.tsx                 # Root component
|
|-- components/             # Reusable UI components (by feature)
|   |-- common/             # Generic components (Button, Input, etc.)
|   |   |-- Button.tsx
|   |   |-- Input.tsx
|   |   |-- Select.tsx
|   |   |-- Card.tsx
|   |   |-- Table.tsx
|   |   |-- Modal.tsx
|   |   |-- Toast.tsx
|   |   +-- index.ts        # Barrel export
|   |
|   |-- layout/             # App layout components
|   |   |-- Sidebar.tsx
|   |   |-- Header.tsx
|   |   +-- MainLayout.tsx
|   |
|   |-- code/               # Code display components
|   |   |-- CodeBlock.tsx
|   |   |-- DiffView.tsx
|   |   +-- SyntaxHighlighter.tsx
|   |
|   +-- generation/         # Generation-specific components
|       |-- OutputTypeSelector.tsx
|       |-- ProgressPanel.tsx
|       +-- GenerationOptions.tsx
|
|-- pages/                  # Page components (one per route)
|   |-- Dashboard.tsx
|   |-- LayoutBrowser.tsx
|   |-- LayoutDetail.tsx
|   |-- GenerationConfig.tsx
|   |-- GenerationProgress.tsx
|   |-- OutputPreview.tsx
|   |-- BatchGeneration.tsx
|   |-- History.tsx
|   |-- Settings.tsx
|   +-- Documentation.tsx
|
|-- stores/                 # Zustand stores
|   |-- layoutStore.ts
|   |-- generationStore.ts
|   |-- settingsStore.ts
|   +-- historyStore.ts
|
|-- hooks/                  # Custom React hooks
|   |-- useEvent.ts         # Event bus subscription
|   |-- useConnection.ts    # DB connection state
|   |-- useSearch.ts        # Search with debounce
|   +-- useGeneration.ts    # Generation workflow
|
|-- styles/                 # Global styles
|   |-- globals.css         # CSS reset, variables
|   |-- tokens.css          # Design tokens as CSS vars
|   +-- themes/             # Dark/light theme overrides
|       |-- dark.css
|       +-- light.css
|
|-- assets/                 # Static assets
|   |-- icons/              # SVG icons
|   +-- images/             # Images
|
+-- utils/                  # Renderer-specific utilities
    |-- formatters.ts       # Number, date formatters
    +-- validators.ts       # Input validators
```

---

## `src/main/` - Electron Main Process

```
src/main/
|-- index.ts                # Main process entry point
|-- preload.ts              # Preload script (IPC bridge)
|
|-- database/               # Database access
|   |-- connection.ts       # ConnectionManager
|   |-- schema.ts           # SchemaRepository
|   +-- queries.ts          # SQL query builders
|
|-- ipc/                    # IPC handlers
|   |-- handlers.ts         # All IPC handler registration
|   |-- schema.handlers.ts  # Schema-related handlers
|   |-- generation.handlers.ts  # Generation handlers
|   +-- file.handlers.ts    # File I/O handlers
|
|-- engines/                # Generation engines (see engine-structure.md)
|   |-- layout-parser/
|   |-- schema-analyzer/
|   |-- relation-engine/
|   |-- sql-generator/
|   |-- xml-generator/
|   +-- script-engine/
|
+-- utils/                  # Main process utilities
    |-- logger.ts           # Logging utility
    +-- crypto.ts           # Password encryption
```

---

## `src/shared/` - Shared Code

```
src/shared/
|-- types/                  # TypeScript type definitions
|   |-- metadata.ts         # ExplorerMetadata, EditorMetadata, etc.
|   |-- database.ts         # TableMetadata, ColumnMetadata, etc.
|   |-- generation.ts       # GenerationResult, OutputFile, etc.
|   +-- events.ts           # Event payload types
|
|-- constants/              # Shared constants
|   |-- defaults.ts         # Default values
|   |-- patterns.ts         # Regex patterns (FK detection, naming)
|   +-- mappings.ts         # Control mapping, style mapping
|
|-- utils/                  # Shared utility functions
|   |-- naming.ts           # Naming convention converters
|   |-- formatting.ts       # String formatters
|   +-- validation.ts       # Shared validators
|
+-- ipc/                    # IPC channel definitions
    +-- channels.ts         # Channel name constants
```

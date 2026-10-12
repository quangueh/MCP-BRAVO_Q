# Plugin Interface (v2 Feature)

> **Note:** Plugin support is deferred to v2. This document defines the interface for future implementation.

## TypeScript Interface

```typescript
interface Plugin {
  name: string;
  version: string;
  description: string;
  author: string;

  hooks: {
    onBeforeGenerate?: (metadata: LayoutMetadata) => LayoutMetadata;
    onAfterGenerate?: (output: GenerateOutput) => GenerateOutput;
    onExport?: (exportData: ExportData) => ExportData;
    onValidate?: (result: ValidationResult) => ValidationResult;
    onLayoutParsed?: (layoutData: LayoutMetadata) => LayoutMetadata;
    onSchemaLoaded?: (schemaData: SchemaMetadata) => SchemaMetadata;
  };

  activate(context: PluginContext): void;
  deactivate(): void;
}
```

## Plugin Context

Provided to the plugin during activation.

```typescript
interface PluginContext {
  metadata: LayoutMetadata;
  addValidation(rule: ValidationRule): void;
  addTemplate(name: string, content: string): void;
  addExportFormat(name: string, handler: ExportHandler): void;
  registerCommand(name: string, handler: CommandHandler): void;
}
```

## Plugin Manifest

Each plugin requires a `package.json` with a `blg-plugin` field.

```json
{
  "name": "blg-custom-validator",
  "version": "1.0.0",
  "description": "Adds custom business validation rules",
  "main": "dist/index.js",
  "blg-plugin": {
    "minAppVersion": "1.0.0",
    "entry": "dist/index.js"
  }
}
```

## Sandboxing

- Plugins run in an isolated scope
- No direct database access
- No access to filesystem outside plugin directory
- All interactions go through the `PluginContext` API

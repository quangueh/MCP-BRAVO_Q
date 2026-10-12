# Plugin Examples

## Example 1: Custom Validation Plugin

Adds business-specific validation rules to the generation pipeline.

### Manifest

```json
{
  "name": "blg-naming-validator",
  "version": "1.0.0",
  "description": "Enforces B{Prefix}{Name} table naming convention",
  "main": "dist/index.js",
  "blg-plugin": {
    "minAppVersion": "1.0.0",
    "entry": "dist/index.js"
  }
}
```

### Code

```typescript
import { Plugin, PluginContext, ValidationResult } from 'blg-sdk';

const namingValidator: Plugin = {
  name: 'blg-naming-validator',
  version: '1.0.0',
  description: 'Enforces B{Prefix}{Name} table naming convention',
  author: 'BLG Team',

  hooks: {
    onValidate(result: ValidationResult): ValidationResult {
      const tableName = result.metadata.tableName;
      if (!/^B\d{2}[A-Z]/.test(tableName)) {
        result.warnings.push({
          code: 'NAMING_CONVENTION',
          message: `Table "${tableName}" does not follow B{Prefix}{Name} convention`,
          suggestion: `Rename to B{NN}${tableName}`
        });
      }
      return result;
    }
  },

  activate(context: PluginContext): void {
    context.registerCommand('check-naming', () => {
      // run naming checks on demand
    });
  },

  deactivate(): void {
    // cleanup
  }
};

export default namingValidator;
```

---

## Example 2: Custom Template Plugin

Adds a new generation template for a specialized output format.

### Manifest

```json
{
  "name": "blg-audit-template",
  "version": "1.0.0",
  "description": "Adds audit trail column template",
  "main": "dist/index.js",
  "blg-plugin": {
    "minAppVersion": "1.0.0",
    "entry": "dist/index.js"
  }
}
```

### Code

```typescript
import { Plugin, PluginContext } from 'blg-sdk';

const auditTemplate: Plugin = {
  name: 'blg-audit-template',
  version: '1.0.0',
  description: 'Adds audit trail column template',
  author: 'BLG Team',

  hooks: {
    onBeforeGenerate(metadata) {
      // Inject audit columns if not present
      const auditCols = ['CreatedDate', 'CreatedBy', 'ModifiedDate', 'ModifiedBy'];
      for (const col of auditCols) {
        if (!metadata.columns.find(c => c.name === col)) {
          metadata.columns.push({
            name: col,
            type: col.includes('Date') ? 'datetime' : 'nvarchar(50)',
            nullable: false,
            defaultValue: col.includes('Created') ? 'GETDATE()' : "''"
          });
        }
      }
      return metadata;
    }
  },

  activate(context: PluginContext): void {
    context.addTemplate('audit-columns', `
-- Audit columns for <%= tableName %>
ALTER TABLE [<%= schema %>].[<%= tableName %>] ADD
  CreatedDate  DATETIME     NOT NULL DEFAULT GETDATE(),
  CreatedBy    NVARCHAR(50) NOT NULL DEFAULT '',
  ModifiedDate DATETIME     NULL,
  ModifiedBy   NVARCHAR(50) NULL;
`);
  },

  deactivate(): void {}
};

export default auditTemplate;
```

---

## Example 3: Export Plugin

Adds a custom export format (Confluence wiki markup).

### Manifest

```json
{
  "name": "blg-confluence-export",
  "version": "1.0.0",
  "description": "Exports schema as Confluence wiki markup",
  "main": "dist/index.js",
  "blg-plugin": {
    "minAppVersion": "1.0.0",
    "entry": "dist/index.js"
  }
}
```

### Code

```typescript
import { Plugin, PluginContext, ExportHandler } from 'blg-sdk';

const confluenceExport: Plugin = {
  name: 'blg-confluence-export',
  version: '1.0.0',
  description: 'Exports schema as Confluence wiki markup',
  author: 'BLG Team',

  hooks: {},

  activate(context: PluginContext): void {
    const handler: ExportHandler = {
      name: 'confluence-wiki',
      extension: '.wiki',
      generate(metadata) {
        const lines: string[] = [];
        lines.push(`h2. ${metadata.tableName}`);
        lines.push('');
        lines.push('|| Column || Type || Nullable || Description ||');
        for (const col of metadata.columns) {
          lines.push(`| ${col.name} | ${col.type} | ${col.nullable ? 'Yes' : 'No'} | ${col.description || ''} |`);
        }
        return lines.join('\n');
      }
    };
    context.addExportFormat('confluence-wiki', handler);
  },

  deactivate(): void {}
};

export default confluenceExport;
```

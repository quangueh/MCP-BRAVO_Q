# Template Configuration

## Template Directory

Configurable path to the template root directory.

```json
{
  "templates": {
    "templateDir": "./templates",
    "customTemplates": "./templates/custom"
  }
}
```

## Template Types

| Type         | Location              | Writable | Description                     |
|--------------|-----------------------|----------|---------------------------------|
| Default      | `templates/built-in/` | No       | Ships with app, read-only       |
| Custom       | `templates/custom/`   | Yes      | User-created overrides          |

## Template Discovery

Scan template directories for supported file types:

- `.sql` — SQL templates (CREATE TABLE, SPs, Views, etc.)
- `.xml` — XML templates (DataSource, Layout, etc.)
- `.ejs` — EJS templates (mixed SQL/XML with logic)

Discovery runs at app startup and on manual refresh.

## Template Validation

Each template is validated on load:

1. File is parseable (no syntax errors)
2. Required variables are declared in template metadata
3. Output produces valid SQL or XML (basic check)

Invalid templates are flagged with a warning; they are not used for generation but remain in the directory.

## Template Reload

Templates are watched for file changes at runtime.

- Use `fs.watch` on the template directory
- On change: re-validate the changed file
- On success: replace the in-memory version
- On failure: keep the previous valid version, show warning

## Template Priority

When both a default and custom template exist for the same type:

```
custom/templates/CreateTable.sql  ->  takes priority
built-in/templates/CreateTable.sql  ->  fallback only
```

Custom templates override defaults of the same name.

# Plugin Lifecycle

## States

```
installed -> activated -> deactivated -> removed
                ^            |
                |            v
                +--- re-activated
```

## Lifecycle Operations

### Install

1. Copy plugin files to `plugins/{name}/` directory
2. Validate `package.json` manifest (has `blg-plugin` field)
3. Verify `minAppVersion` compatibility
4. Mark as `installed`

### Activate

1. Load the plugin module (`require` or dynamic `import`)
2. Validate exported interface matches `Plugin` contract
3. Call `plugin.activate(context)`
4. Register all declared hooks
5. Mark as `activated`

### Deactivate

1. Call `plugin.deactivate()`
2. Unregister all hooks
3. Free allocated resources
4. Mark as `deactivated`

### Remove

1. Deactivate (if currently activated)
2. Delete plugin files from `plugins/{name}/`
3. Remove from plugin registry

### Update

1. Deactivate current version
2. Replace plugin files with new version
3. Validate new manifest
4. Activate new version

## Error Handling

If a plugin throws during `activate()`:

- Mark as `failed` (not `activated`)
- Log the error with full stack trace
- Show user notification: "Plugin {name} failed to activate: {message}"
- Do not block app startup

If a plugin hook throws during generation:

- Log the error
- Skip the failed hook
- Continue generation without the plugin's modification
- Show warning after generation completes

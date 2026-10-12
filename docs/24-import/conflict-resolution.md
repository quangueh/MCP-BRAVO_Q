# Conflict Resolution

## Detection

Compare imported metadata with existing cache.

## Conflict Types

| # | Type | Action |
|---|---|---|
| 1 | Table exists with different columns | Show diff |
| 2 | Layout exists with different metadata | Show diff |
| 3 | Generated output differs from cached | Show diff |

## Resolution Options

1. **Keep existing** (default, safe)
2. **Overwrite with imported**
3. **Merge** (select fields)
4. **Skip import**

## UI

- Modal with side-by-side comparison and radio buttons

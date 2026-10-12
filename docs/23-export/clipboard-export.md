# Clipboard Export

## Actions

1. **Copy SQL** - `navigator.clipboard.writeText`
2. **Copy XML**
3. **Copy Metadata JSON**
4. **Copy all as formatted text**

## Formatting

- SQL with comments
- XML with declaration

## Feedback

- Toast notification "Copied to clipboard"

## Limits

- Warn if >1MB (clipboard may fail)

## Fallback

- textarea select + copy for old browsers

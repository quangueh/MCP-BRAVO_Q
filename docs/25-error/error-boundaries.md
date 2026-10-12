# Error Boundary Strategy

## UI Layer

- React ErrorBoundary wrapping each page
- Catches render errors
- Shows fallback UI with retry button

## Engine Layer

- try/catch around each engine method
- Catches errors, wraps in AppError
- Logs error
- Returns partial results if possible

## Global Layer

### Browser

- `window.addEventListener('unhandledrejection')`
- Shows toast notification
- Logs error to file

### Process

- `process.on('uncaughtException')`
- Logs error
- Shows dialog
- Offers restart option

## Recovery

| Error Type | Strategy |
|---|---|
| Transient (DB timeout) | Auto-retry |
| Persistent | Manual retry with user action |

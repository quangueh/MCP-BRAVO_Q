# Event System Design

## EventBus Class

Pub/sub pattern for loose coupling between modules.

```typescript
class EventBus {
    on(event: string, handler: EventHandler): Unsubscribe
    off(event: string, handler: EventHandler): void
    emit(event: string, payload?: any): void
    once(event: string, handler: EventHandler): Unsubscribe
}
```

---

## Event Catalog

### Layout Events

| Event | Payload | Trigger |
|---|---|---|
| layout:selected | `{ layoutName: string, layoutType: LayoutType }` | User selects a layout |
| layout:analyzed | `{ layoutName: string, analysis: TableAnalysis }` | Schema analysis complete |
| layout:parsed | `{ layoutName: string, metadata: LayoutMetadata }` | XML parsing complete |
| layout:list:updated | `{ count: number }` | Layout list refreshed |

### Generation Events

| Event | Payload | Trigger |
|---|---|---|
| generation:started | `{ layoutName: string, outputTypes: string[] }` | Generation begins |
| generation:progress | `{ step: string, percent: number, message: string }` | Progress update |
| generation:completed | `{ layoutName: string, outputs: OutputFile[] }` | Generation succeeds |
| generation:failed | `{ layoutName: string, error: ErrorInfo }` | Generation fails |
| generation:batch:started | `{ layoutNames: string[] }` | Batch begins |
| generation:batch:progress | `{ current: number, total: number, layout: string }` | Batch progress |
| generation:batch:completed | `{ results: BatchResult[] }` | Batch completes |

### Export Events

| Event | Payload | Trigger |
|---|---|---|
| export:started | `{ format: string, count: number }` | Export begins |
| export:completed | `{ path: string, format: string }` | Export succeeds |
| export:failed | `{ error: ErrorInfo }` | Export fails |

### History Events

| Event | Payload | Trigger |
|---|---|---|
| history:recorded | `{ entryId: string, action: string }` | History entry created |
| history:rollback:started | `{ versionId: string }` | Rollback begins |
| history:rollback:completed | `{ versionId: string, newVersionId: string }` | Rollback succeeds |

### Error Events

| Event | Payload | Trigger |
|---|---|---|
| error:occurred | `{ code: string, category: string, message: string }` | Any error |
| connection:lost | `{ reason: string }` | DB connection drops |
| connection:restored | `{}` | DB connection restored |

---

## Payload Types

```typescript
interface ErrorInfo {
    code: string;
    category: 'connection' | 'parse' | 'generation' | 'export' | 'validation';
    message: string;
    details?: string;
    recoverable: boolean;
}

interface OutputFile {
    name: string;
    type: 'sql' | 'xml' | 'sp' | 'view' | 'trigger';
    content: string;
    size: number;
}

interface BatchResult {
    layoutName: string;
    success: boolean;
    outputs: OutputFile[];
    error?: ErrorInfo;
    duration: number;
}
```

---

## Subscription Management

### Auto-Cleanup on Unmount

React hooks automatically unsubscribe on component unmount:

```typescript
function useEvent(event: string, handler: EventHandler) {
    useEffect(() => {
        const unsubscribe = eventBus.on(event, handler);
        return unsubscribe;
    }, [event, handler]);
}
```

### Error Handling

Event handlers are wrapped in try/catch:

```typescript
emit(event: string, payload?: any): void {
    const handlers = this.handlers.get(event) || [];
    for (const handler of handlers) {
        try {
            handler(payload);
        } catch (error) {
            console.error(`Event handler error for ${event}:`, error);
            // Error is logged, not thrown - prevents cascading failures
        }
    }
}
```

---

## Usage Example

```typescript
// In Generation use case
eventBus.emit('generation:started', {
    layoutName: 'Customer',
    outputTypes: ['sql', 'xml']
});

// Progress updates
eventBus.emit('generation:progress', {
    step: 'Generating SQL Tables',
    percent: 40,
    message: 'CREATE TABLE Customer...'
});

// In React component
useEvent('generation:progress', (payload) => {
    setProgress(payload.percent);
    setCurrentStep(payload.message);
});

// Completion
eventBus.emit('generation:completed', {
    layoutName: 'Customer',
    outputs: generatedFiles
});
```

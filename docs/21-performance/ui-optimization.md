# UI Optimization

## Virtual Scrolling

The layout list contains **5,917 items**. Use virtual scrolling to render only visible rows.

**Tool:** `react-window` or `react-virtual`

```tsx
import { FixedSizeList } from 'react-window';

<FixedSizeList
  height={600}
  itemCount={layouts.length}
  itemSize={40}
  width="100%"
>
  {({ index, style }) => (
    <LayoutRow layout={layouts[index]} style={style} />
  )}
</FixedSizeList>
```

## Lazy Loading

Load layout metadata on demand, not all at once.

```
1. Load layout list (names only)         -> fast
2. On select: load full metadata         -> on demand
3. On scroll: load next batch of names   -> incremental
```

## Code Splitting

Separate bundles for large modules:

| Bundle     | Contents                | Loaded          |
|------------|-------------------------|-----------------|
| `main`     | Core app, navigation    | At startup      |
| `preview`  | Preview renderer        | On first preview|
| `generator`| Generation engine       | On first generate|
| `diff`     | Diff viewer             | On diff request |

Use `React.lazy()` + `Suspense` for dynamic imports.

## Memoization

```tsx
// Memoize grid rows — only re-render when data changes
const LayoutRow = React.memo(({ layout, style }) => {
  return <div style={style}>{layout.name}</div>;
});

// Memoize expensive calculations
const sortedLayouts = useMemo(
  () => layouts.sort((a, b) => a.name.localeCompare(b.name)),
  [layouts]
);
```

## Debouncing

| Input              | Delay   |
|--------------------|---------|
| Search input       | 200ms   |
| Resize events      | 150ms   |
| Filter changes     | 300ms   |

```typescript
const debouncedSearch = useDebouncedCallback((term: string) => {
  filterLayouts(term);
}, 200);
```

## Web Workers

Offload XML parsing for large files from the main thread.

```typescript
// main thread
const worker = new Worker('xml-parser.worker.ts');
worker.postMessage({ xml: largeXmlString });
worker.onmessage = (e) => {
  const metadata = e.data;
  // update UI
};
```

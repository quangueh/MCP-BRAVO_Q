# Memory Management

## Rules

### 1. Dispose DB Connections After Use

Connection pool handles this automatically. Ensure pool is closed on app shutdown.

```typescript
process.on('SIGTERM', async () => {
  await pool.close();
  process.exit(0);
});
```

### 2. Clear Parsed XML After Metadata Extraction

```typescript
const metadata = parseLayout(xmlString);
// xmlString no longer needed — allow GC
// do not store xmlString in a long-lived variable
```

### 3. Limit In-Memory Cache

Max **1,000 layouts** in memory. Use LRU (Least Recently Used) eviction.

```typescript
import LRU from 'lru-cache';

const layoutCache = new LRU<string, LayoutMetadata>({
  max: 1000,
  ttl: 1000 * 60 * 30, // 30 minutes
});
```

### 4. Unsubscribe Event Listeners on Unmount

```tsx
useEffect(() => {
  const handler = (e: Event) => { /* ... */ };
  window.addEventListener('resize', handler);

  return () => {
    window.removeEventListener('resize', handler); // cleanup
  };
}, []);
```

### 5. Use WeakMap for Temporary Object References

```typescript
const metadataCache = new WeakMap<object, LayoutMetadata>();
```

WeakMap allows GC to collect keys when no other references exist.

### 6. Stream Large File Exports

Do not load entire output into memory for large batches.

```typescript
import { createWriteStream } from 'fs';

const stream = createWriteStream(outputPath);
for (const layout of layouts) {
  const output = await generate(layout);
  stream.write(output);
}
stream.end();
```

### 7. Monitor Memory in Dev Mode

```typescript
if (process.env.NODE_ENV === 'development') {
  setInterval(() => {
    const usage = process.memoryUsage();
    console.log(`Memory: ${Math.round(usage.heapUsed / 1024 / 1024)} MB`);
  }, 30000);
}
```

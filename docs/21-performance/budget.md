# Performance Budget

## Operations

| Operation            | Target (p95)  | Notes                          |
|----------------------|---------------|--------------------------------|
| Layout analysis      | < 5s          | Parse XML + extract metadata   |
| Single generation    | < 10s         | Full SQL + XML for one layout  |
| Batch generation     | < 60s         | 10 layouts in one run          |
| UI load (cold)       | < 3s          | First launch, no cache         |
| UI load (warm)       | < 1s          | Subsequent launches            |
| Search               | < 200ms       | Filter layout list             |
| Preview render       | < 500ms       | Syntax-highlighted output      |
| DB query             | < 1s          | Schema queries, layout queries |

## Memory

| Metric         | Limit    |
|----------------|----------|
| Peak memory    | < 500 MB |
| Idle memory    | < 200 MB |

## Bundle Size

| Bundle           | Limit    |
|------------------|----------|
| Main process     | < 10 MB  |
| Renderer process | < 5 MB   |

## Startup

| Metric                  | Target   |
|-------------------------|----------|
| Time to interactive     | < 2s     |
| Time to first paint     | < 1s     |

## Measurement

Performance is measured using:
- `performance.now()` for operation timing
- `process.memoryUsage()` for memory tracking
- Bundle analyzer for bundle size
- Electron's built-in performance metrics for startup

# Cache Architecture

Two tiers: in-memory and file-based.

## Tier 1: In-Memory (Map/LRU)

| Cache Entry | TTL | Notes |
|---|---|---|
| Schema metadata | Session | Persists until DB disconnect or app close |
| Layout parsed data | 5 min | LRU eviction when full |
| Generation context | 10 min | Cleared on schema change |

## Tier 2: File-Based (`{appdata}/blg/cache/`)

| Cache Entry | Key | Notes |
|---|---|---|
| Generated outputs | Content hash | SQL, XML, SP results |
| Layout index | File path | For fast search across layouts |

## Invalidation Strategy

| Trigger | Action |
|---|---|
| DB reconnect | Refresh schema cache |
| File change detected | Refresh layout cache |
| Template change | Clear generation cache |

## Resource Limits

- **Memory**: max 200MB
- **Disk**: max 1GB

## Eviction Policy

- **Memory**: LRU (Least Recently Used)
- **Disk**: Oldest entries removed first

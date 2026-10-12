# Multi-Project Support

## Design

- Connection manager with multiple DB profiles

## Profile Schema

- Name
- Server
- Port
- Credentials
- Default database

## UI

- Project selector in header

## Switching

- Reload schema cache for new DB

## Isolation

Each project has separate:
- History
- Cache
- Settings

## Cross-Project

- Export from one, import to another (manual)

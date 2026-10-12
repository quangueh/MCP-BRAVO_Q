# Auto-Save Design

## Trigger

30 seconds after last change.

## State Saved

- Current layout selection
- Generation options
- UI state (sidebar, tabs)

## Storage

- `{appdata}/blg/autosave.json`

## Atomic Write

- Write to temp file, then rename (prevents corruption)

## Recovery

- On app start, check for autosave
- Offer to restore if found

## Limits

- Max 1MB autosave file
- Disable during generation (too much state change)

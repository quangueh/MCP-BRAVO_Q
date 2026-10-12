# Rollback Design

## Process

1. User selects version from history
2. Clicks Rollback
3. Confirmation dialog shows what will change
4. Current state saved as new version (for undo)
5. Version outputs restored to current state
6. Metadata updated
7. Success notification

## Undo Rollback

- Rollback itself is a versioned action, so Ctrl+Z works

## Partial Rollback

- Not supported (full version restore only)

## Safety

- Never delete original files

# Auto-Update Design

## Library

- electron-updater

## Server

- GitHub releases or custom file server

## Check Frequency

- On app startup + every 24 hours

## Update Flow

1. Check for update (`GET /latest.yml`)
2. Compare versions (semver)
3. If newer: show notification
4. User clicks Update
5. Download in background with progress
6. Verify checksum
7. Prompt to restart
8. Install update on restart

## Rollback

- Keep previous version for 7 days

## Security

- Verify code signature of update

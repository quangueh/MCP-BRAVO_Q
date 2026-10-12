# Packaging Strategy

## Tool

- electron-builder

## Target

- Windows 10/11 (NSIS installer)

## Output

- setup.exe (~100MB)

## Features

- Auto-update via electron-updater
- Code signing (optional for v1)
- Per-user install (no admin required)

## Build Command

```
npm run build -> electron-builder
```

## CI

- GitHub Actions for automated builds

## Artifacts

- `setup.exe`
- `latest.yml` (auto-update manifest)

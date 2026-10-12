# Build Pipeline

## Tool

- GitHub Actions

## Stages

| # | Stage | Tool |
|---|---|---|
| 1 | Lint | eslint |
| 2 | Type check | `tsc --noEmit` |
| 3 | Unit tests | `vitest run` |
| 4 | Integration tests | `vitest run --project integration` |
| 5 | Build | `vite build` + `electron-builder` |
| 6 | Package | `electron-builder --win` |
| 7 | Sign | Optional, code signing cert |
| 8 | Upload artifacts | GitHub Actions |
| 9 | Create GitHub release | On tag |

## Triggers

- **Lint/Test**: on push
- **Build/Package**: on tag

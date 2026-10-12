# Root Folder Structure

## Project Root: `blg/`

```
blg/
|-- src/                    # Source code
|   |-- main/               # Electron main process
|   |-- renderer/           # React frontend
|   +-- shared/             # Shared types and utilities
|
|-- docs/                   # All documentation
|   |-- 00-requirements/    # Requirements docs
|   |-- 01-business/        # Business logic docs
|   |-- ...                 # (34 doc directories)
|   +-- 33-final/           # Final review docs
|
|-- tests/                  # Test files
|   |-- unit/               # Unit tests
|   |-- integration/        # Integration tests
|   +-- e2e/                # End-to-end tests
|
|-- templates/              # Generation templates
|   |-- sql/                # SQL generation templates (EJS)
|   |-- xml/                # XML generation templates (EJS)
|   +-- sp/                 # Stored procedure templates
|
|-- knowledge/              # Extracted schemas and layouts
|   |-- schemas/            # Database schema snapshots
|   +-- layouts/            # Parsed layout metadata
|
|-- output/                 # Generated SQL/XML output
|   |-- sql/                # Generated SQL files
|   +-- xml/                # Generated XML files
|
|-- config/                 # App configuration
|   |-- default.json        # Default settings
|   +-- schemas/            # Generation schemas
|
|-- scripts/                # Build and utility scripts
|   |-- build.js            # Build script
|   +-- dev.js              # Dev server script
|
|-- .cache/                 # File-based cache
|-- logs/                   # Application logs
|
|-- package.json            # Node.js package config
|-- tsconfig.json           # TypeScript config
|-- electron-builder.yml    # Electron build config
|-- .gitignore              # Git ignore rules
|-- .env                    # Environment variables (git-ignored)
+-- README.md               # Project readme
```

---

## Directory Purposes

| Directory | Purpose | Version Controlled |
|---|---|---|
| src/ | All source code | Yes |
| docs/ | Documentation | Yes |
| tests/ | Test code and fixtures | Yes |
| templates/ | EJS generation templates | Yes |
| knowledge/ | Extracted schemas/layouts | Yes (reference data) |
| output/ | Generated output files | No (git-ignored) |
| config/ | App configuration | Yes (except secrets) |
| scripts/ | Build tooling | Yes |
| .cache/ | Runtime cache | No (git-ignored) |
| logs/ | Runtime logs | No (git-ignored) |

---

## Key Files

| File | Purpose |
|---|---|
| package.json | Dependencies, scripts, metadata |
| tsconfig.json | TypeScript compiler options |
| electron-builder.yml | Electron packaging config |
| .env | DB credentials, secrets (git-ignored) |
| .gitignore | Ignored files and directories |

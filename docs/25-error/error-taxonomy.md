# Error Taxonomy

## Categories

### 1. Database

- `DB_CONNECT`
- `DB_QUERY`
- `DB_TIMEOUT`
- `DB_AUTH`

### 2. Parse

- `XML_MALFORMED`
- `XML_INVALID`
- `XML_MISSING_ELEMENT`

### 3. Generation

- `GEN_TEMPLATE_ERROR`
- `GEN_MISSING_DATA`
- `GEN_INVALID_CONFIG`

### 4. Export

- `EXPORT_FILE_WRITE`
- `EXPORT_FORMAT_INVALID`
- `EXPORT_TOO_LARGE`

### 5. Import

- `IMPORT_PARSE_FAIL`
- `IMPORT_CONFLICT`
- `IMPORT_UNSUPPORTED`

### 6. Validation

- `VAL_REQUIRED`
- `VAL_TYPE_MISMATCH`
- `VAL_FK_MISSING`

### 7. UI

- `UI_COMPONENT_ERROR`
- `UI_STATE_CORRUPT`

### 8. System

- `SYS_MEMORY`
- `SYS_PERMISSION`
- `SYS_CONFIG`

## Severity Levels

- **Critical**: System cannot continue
- **High**: Feature unavailable
- **Medium**: Degraded functionality
- **Low**: Minor issue, workaround available

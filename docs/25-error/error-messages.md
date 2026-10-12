# User Error Messages Catalog

| Code | Severity | Message | Icon | Action Button |
|---|---|---|---|---|
| DB_CONNECT | High | Cannot connect to database. Check connection settings and try again. | warning | Retry / Settings |
| DB_QUERY | High | Database query failed. The database may be temporarily unavailable. | warning | Retry |
| DB_TIMEOUT | Medium | Database query timed out. Try again or check network. | clock | Retry |
| DB_AUTH | High | Authentication failed. Check credentials. | lock | Settings |
| XML_MALFORMED | Medium | The XML file contains syntax errors. Please check the file format. | alert | View Details |
| XML_INVALID | Medium | The XML structure is invalid for Bravo format. | alert | View Details |
| XML_MISSING_ELEMENT | Low | Missing expected XML element. Default value used. | info | OK |
| GEN_TEMPLATE_ERROR | High | Generation template has an error. Reset templates to defaults. | warning | Reset Templates |
| GEN_MISSING_DATA | Medium | Required data is missing for generation. Refresh the schema. | warning | Refresh |
| GEN_INVALID_CONFIG | Medium | Invalid generation configuration. Check options. | alert | Review Config |
| EXPORT_FILE_WRITE | High | Cannot write file. Check disk space and permissions. | warning | Retry |
| EXPORT_FORMAT_INVALID | Medium | Export format not supported for this output type. | alert | OK |
| EXPORT_TOO_LARGE | Low | Export file is very large (>50MB). Consider splitting. | info | Continue / Cancel |
| IMPORT_PARSE_FAIL | Medium | Failed to parse imported file. Check format. | alert | View Details |
| IMPORT_CONFLICT | Medium | Imported data conflicts with existing cache. | warning | Resolve |
| IMPORT_UNSUPPORTED | Low | File format not supported. | alert | OK |
| VAL_REQUIRED | Medium | Required field is missing. | alert | OK |
| VAL_TYPE_MISMATCH | Medium | Data type mismatch detected. | alert | OK |
| VAL_FK_MISSING | Medium | Referenced table or column not found. | warning | OK |
| UI_COMPONENT_ERROR | Low | Component error. Try refreshing. | warning | Refresh |
| UI_STATE_CORRUPT | Low | UI state corrupted. Resetting to defaults. | info | OK |
| SYS_MEMORY | High | System running low on memory. Close other applications. | warning | OK |
| SYS_PERMISSION | Medium | Permission denied. Run as administrator. | lock | OK |
| SYS_CONFIG | Medium | Configuration file corrupted. Resetting to defaults. | warning | Reset |

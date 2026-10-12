# API Naming Conventions

## IPC Channels — kebab-case with colon namespace

```
layout:parse          # parse a layout XML
schema:read           # read database schema
generate:sql          # generate SQL output
generate:xml          # generate XML output
export:file           # export generated files
settings:read         # read app settings
settings:write        # write app settings
```

Format: `{module}:{action}`

## REST-Like Endpoints (Web Mode)

```
GET    /api/layouts              # list all layouts
GET    /api/layouts/:id          # get single layout
POST   /api/generate             # run generation
GET    /api/schema               # get DB schema
POST   /api/export               # export output
GET    /api/settings             # get settings
PUT    /api/settings             # update settings
```

## Event Names — dot-separated

```
generation.completed          # generation finished
generation.progress           # generation progress update
layout.selected               # layout selected in list
layout.loaded                 # layout loaded and parsed
schema.loaded                 # schema loaded from DB
export.completed              # export finished
connection.changed            # DB connection state changed
```

Format: `{domain}.{event}`

## Error Codes — MODULE_ACTION_REASON

```
DB_CONNECT_FAIL               # database connection failed
DB_QUERY_TIMEOUT              # database query timed out
XML_PARSE_ERROR               # XML parsing failed
XML_PARSE_INVALID_FORMAT      # XML has invalid format
GEN_SQL_SYNTAX                # generated SQL has syntax issue
GEN_XML_VALIDATION            # generated XML failed validation
EXPORT_FILE_WRITE             # file write failed during export
EXPORT_FILE_PERMISSION        # no permission to write file
CONFIG_INVALID                # configuration is invalid
PLUGIN_ACTIVATE_FAIL          # plugin activation failed
```

Format: `{MODULE}_{ACTION}_{REASON}`

## Status Codes

```
SUCCESS                       # all operations completed
PARTIAL_SUCCESS               # some operations completed, some failed
FAILED                        # all operations failed
CANCELLED                     # user cancelled the operation
```

# Error Recovery Flow

## Overview

Comprehensive error handling strategy. All errors are categorized, logged, and provide clear recovery actions. The app never crashes on errors.

---

## Error Categories

### 1. Database Connection Error

**Trigger:** Lost connection, timeout, authentication failure.

**UI Response:**
- Toast notification: "Database connection error: [reason]"
- Connection status indicator turns red in header
- "Retry" button in toast
- "Work Offline" link in toast

**Recovery Actions:**
1. Auto-retry (3 attempts with exponential backoff: 1s, 2s, 4s)
2. Manual retry via toast button
3. Switch to offline mode
4. Navigate to Settings to update connection

**Log:** Error logged with timestamp, connection string (masked), error code.

---

### 2. Parse Error

**Trigger:** Malformed XML, unexpected column types, missing metadata.

**UI Response:**
- Warning banner at top of page: "Some data could not be parsed"
- Expandable error details showing specific parse failures
- "Skip" button to continue with partial data
- "View Raw Data" link

**Recovery Actions:**
1. Continue with successfully parsed data
2. View raw/unparsed data for manual inspection
3. Edit metadata to fix inconsistencies

**Log:** Warning logged with parser name, input data, error position.

---

### 3. Generation Error

**Trigger:** SQL generation fails, template rendering error, validation failure.

**UI Response:**
- Error modal with details:
  - Error type and message
  - Affected component (table/column/SP)
  - Suggested fix
- "Retry" button
- "Edit Metadata" button (if fixable)
- "View Log" link

**Recovery Actions:**
1. Retry generation after fixing the issue
2. Edit metadata/configuration and retry
3. Skip the failing output type and generate others
4. Report the issue (if unexpected)

**Log:** Error logged with full stack trace, input metadata, generation context.

---

### 4. Export Error

**Trigger:** File write permission, disk full, file locked by another process.

**UI Response:**
- Toast notification: "Export failed: [reason]"
- "Retry" button
- "Save As" button (choose different location)
- "Copy to Clipboard" alternative

**Recovery Actions:**
1. Retry export to same location
2. Choose different export location
3. Copy content to clipboard instead
4. Close the file in the other application and retry

---

### 5. Validation Error

**Trigger:** Invalid user input, missing required fields, format errors.

**UI Response:**
- Inline error messages on each invalid field
- Red border on invalid fields
- Error summary at top of form (for complex forms)
- "Clear" button per field

**Recovery Actions:**
1. Correct the invalid input
2. Error clears automatically when valid input is entered

---

## Error Catalog

| Code | Category | Message | Recovery |
|---|---|---|---|
| E001 | Connection | Connection timeout | Retry / Offline |
| E002 | Connection | Authentication failed | Settings |
| E003 | Connection | Server not found | Settings |
| E004 | Parse | Invalid XML structure | Skip / View Raw |
| E005 | Parse | Unknown column type | Skip column |
| E006 | Parse | Missing required attribute | Edit metadata |
| E007 | Generate | Template not found | Retry / Report |
| E008 | Generate | SQL syntax error | Edit / Skip |
| E009 | Generate | Circular dependency | Edit relations |
| E010 | Export | Permission denied | Save As |
| E011 | Export | Disk full | Save As |
| E012 | Export | File locked | Retry |
| E013 | Validation | Required field empty | Fill field |
| E014 | Validation | Invalid format | Correct format |
| E015 | Validation | Value out of range | Adjust value |

---

## Error Logging

All errors are logged to the activity log with:
- Timestamp
- Error code and category
- Severity (error, warning, info)
- User action that triggered the error
- Stack trace (for unexpected errors)
- Recovery action taken

Log location: `logs/blg-{date}.log`

---

## Global Error Boundary

React error boundary wraps the entire app:
- Catches unexpected rendering errors
- Shows fallback UI: "Something went wrong"
- "Reload App" button
- "Report Issue" link with error details pre-filled
- Never shows raw error to user

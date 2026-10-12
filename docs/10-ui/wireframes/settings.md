# Settings Wireframe

## Layout

The settings screen has grouped sections for app configuration.

---

## ASCII Wireframe

```
+------+-----------------------------------------------------------+
|      |  Settings                                                  |
|      |                                                           |
|      |  +---Database Connection---+                              |
|      |  | Server: [localhost    ] |                              |
|      |  | Port:   [1433         ] |                              |
|      |  | User:   [sa           ] |                              |
|      |  | Pass:   [********    ] |                              |
|      |  | Database: [BravoDB   v] |                              |
|      |  | [Test Connection] Status: Connected OK                 |
|      |  +-------------------------+                              |
|      |                                                           |
|      |  +---Default Schema---+                                   |
|      |  | Database: [BravoDB v] |                                |
|      |  | Schema:   [dbo     v] |                                |
|      |  +---------------------+                                  |
|      |                                                           |
|      |  +---Templates---+                                        |
|      |  | Directory: [./templates] [Browse]                      |
|      |  | [Reset to Defaults]                                    |
|      |  +----------------+                                       |
|      |                                                           |
|      |  +---Appearance---+                                       |
|      |  | Theme:  (o) Dark  ( ) Light                            |
|      |  | Language: [English v]                                  |
|      |  | Font Size: [14px    v]                                 |
|      |  +------------------+                                     |
|      |                                                           |
|      |  +---Generation---+                                       |
|      |  | Default Outputs: [SQL, FK, Index, XML] [Configure]    |
|      |  | Auto-save: [x] Enabled                                |
|      |  | Timeout:   [30] seconds                               |
|      |  +----------------+                                       |
|      |                                                           |
|      |  +---About---+                                            |
|      |  | Version: 1.0.0                                        |
|      |  | License: MIT                                          |
|      |  +---------+                                              |
|      |                                                           |
|      |  [Save Settings]  [Reset to Defaults]                    |
|      |                                                           |
+------+-----------------------------------------------------------+
```

---

## Sections

### 1. Database Connection

| Field | Type | Default | Description |
|---|---|---|---|
| Server | Text input | localhost | SQL Server hostname or IP |
| Port | Number input | 1433 | SQL Server port |
| User | Text input | sa | Database username |
| Password | Password input | (empty) | Database password (masked) |
| Database | Dropdown | (empty) | Auto-populated after connection test |

**Test Connection** button: Tests connectivity and populates database dropdown.
**Status indicator:** Connected (green), Disconnected (red), Testing (spinner).

### 2. Default Schema

| Field | Type | Default |
|---|---|---|
| Database | Dropdown | (from connection) |
| Schema | Dropdown | dbo |

Auto-populated from database connection.

### 3. Templates

| Field | Type | Default |
|---|---|---|
| Directory | Path input | ./templates |
| Browse | Button | Opens folder picker |
| Reset to Defaults | Button | Restores bundled templates |

### 4. Appearance

| Field | Type | Options |
|---|---|---|
| Theme | Radio buttons | Dark (default), Light |
| Language | Dropdown | English, Vietnamese |
| Font Size | Dropdown | 12px, 14px (default), 16px |

Theme change applies immediately (live preview).

### 5. Generation

| Field | Type | Default |
|---|---|---|
| Default Outputs | Checkbox group | SQL, FK, Index, DataSource XML |
| Auto-save | Toggle | Enabled |
| Timeout | Number input | 30 seconds |

### 6. About

- Version number
- License info
- Links: Documentation, GitHub, Report Issue

---

## Actions

- **Save Settings** - Persists all changes to config file
- **Reset to Defaults** - Confirmation dialog, then resets all settings

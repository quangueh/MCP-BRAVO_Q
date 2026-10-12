# User Preferences

## Appearance

| Setting         | Options           | Default    |
|-----------------|-------------------|------------|
| Theme           | dark / light      | dark       |
| Language        | Vietnamese / English | Vietnamese |
| Font size       | 12–16px           | 14px       |
| Sidebar state   | collapsed / expanded | expanded |

## Behavior

| Setting              | Options       | Default |
|----------------------|---------------|---------|
| Recent layouts count | last 20       | 20      |
| Default output types | configurable  | all     |
| Auto-save            | on / off      | on      |
| Auto-save interval   | seconds       | 60      |

## Window State

Persisted between sessions:

- Window position (x, y)
- Window size (width, height)
- Maximized state (boolean)

## Storage Location

```
{appdata}/blg/settings.json
```

- `%APPDATA%/blg/settings.json` on Windows
- `~/Library/Application Support/blg/settings.json` on macOS
- `~/.config/blg/settings.json` on Linux

## Example `settings.json`

```json
{
  "appearance": {
    "theme": "dark",
    "language": "vi",
    "fontSize": 14,
    "sidebarCollapsed": false
  },
  "recentLayouts": 20,
  "defaultOutputTypes": ["CreateTable", "ForeignKey", "StoredProcedure"],
  "autoSave": true,
  "autoSaveInterval": 60,
  "window": {
    "x": 100,
    "y": 100,
    "width": 1280,
    "height": 800,
    "maximized": false
  }
}
```

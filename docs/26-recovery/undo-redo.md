# Undo/Redo Stack Design

## Pattern

Command pattern. Each user action creates a Command object with `execute()` and `undo()`.

## Stacks

- **undoStack**: max 50 entries
- **redoStack**: cleared on new action

## Commands

| Command | Description |
|---|---|
| SelectLayout | Layout selection change |
| ConfigureOptions | Option modification |
| GenerateOutputs | Generation execution |
| ModifyTemplate | Template edit |
| ChangeSettings | Settings change |

## State

Each command captures before/after state (lightweight: references, not copies).

## Keyboard

- `Ctrl+Z` - Undo
- `Ctrl+Y` - Redo

## UI

- Undo/redo buttons in toolbar

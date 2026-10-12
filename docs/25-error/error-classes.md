# Error Class Hierarchy

## Base Class

```
AppError {
  code: string
  message: string
  details: string
  suggestion: string
  severity: 'Critical' | 'High' | 'Medium' | 'Low'
  timestamp: Date
}
```

## Subclasses

| Class | Properties | Use Case |
|---|---|---|
| DatabaseError | connection, query | DB connection/query failures |
| ParseError | xml, json | XML/JSON parsing failures |
| GenerationError | template, data | Template/data generation failures |
| ValidationError | field, relation | Validation rule failures |
| ExportError | file, format | File/format export failures |
| ImportError | parse, conflict | Import parsing/conflict failures |
| SystemError | memory, permission | System resource failures |

## Methods

- Each class has static factory methods
- `toJSON()` for logging
- `toUserMessage()` for display

## Error Chaining

- `cause` property for wrapping errors

# Primary Key Handler

## Detection
Read PK from schema JSON primaryKey field.

## PK Types

| Type | Frequency | Description |
|------|-----------|-------------|
| INT IDENTITY | ~90% | Auto-increment integer |
| BIGINT IDENTITY | ~5% | Auto-increment bigint |
| GUID | ~2% | Uniqueidentifier |
| Composite | ~3% | Multiple columns |

## Generation Rules

### INT IDENTITY (Default)
```sql
[Id] INT IDENTITY(1,1) NOT NULL,
CONSTRAINT [PK_{TableName}] PRIMARY KEY CLUSTERED ([Id] ASC)
```

### BIGINT IDENTITY
```sql
[Id] BIGINT IDENTITY(1,1) NOT NULL,
CONSTRAINT [PK_{TableName}] PRIMARY KEY CLUSTERED ([Id] ASC)
```

### GUID
```sql
[Id] UNIQUEIDENTIFIER NOT NULL DEFAULT (NEWSEQUENTIALID()),
CONSTRAINT [PK_{TableName}] PRIMARY KEY CLUSTERED ([Id] ASC)
```

### Composite
```sql
CONSTRAINT [PK_{TableName}] PRIMARY KEY CLUSTERED ([Col1] ASC, [Col2] ASC)
```

## Naming: PK_{TableName}, always CLUSTERED

## Constraints
- Every table MUST have a PK
- PK columns always NOT NULL
- Identity seed: start 1, increment 1

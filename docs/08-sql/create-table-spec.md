# CREATE TABLE Generator Specification

## Overview
Generates CREATE TABLE statements from table metadata.

## Template
```sql
CREATE TABLE [{Schema}].[{TableName}] (
    [{Col1}] {DataType} {Nullable} {Default},
    [IsActive] BIT NOT NULL DEFAULT ((1)),
    [CreatedBy] INT NULL,
    [CreatedDate] DATETIME2(7) NULL,
    [ModifiedBy] INT NULL,
    [ModifiedDate] DATETIME2(7) NULL,
    CONSTRAINT [PK_{TableName}] PRIMARY KEY CLUSTERED ([{PkCol}] ASC)
);
GO
```

## Data Type Mapping

| Source Type | SQL Type | Notes |
|------------|----------|-------|
| INT | INT | 4 bytes, most common |
| BIGINT | BIGINT | 8 bytes, large tables |
| DECIMAL(p,s) | DECIMAL(p,s) | Default DECIMAL(18,2) |
| VARCHAR(n) | VARCHAR(n) | ASCII, max 8000 |
| NVARCHAR(n) | NVARCHAR(n) | Unicode, max 4000 |
| DATE | DATE | Date only |
| DATETIME | DATETIME2(7) | Always use DATETIME2 |
| BIT | BIT | Boolean 0/1 |
| TEXT | NVARCHAR(MAX) | Large text |
| UNIQUEIDENTIFIER | UNIQUEIDENTIFIER | GUID |

## Default Values

| Type Category | Default Value |
|---------------|---------------|
| Numeric (INT etc) | DEFAULT ((0)) |
| String (VARCHAR) | DEFAULT ('') |
| String (NVARCHAR) | DEFAULT (N'') |
| BIT | DEFAULT ((0)) |
| Date/Time | NULL (no default) |

## Nullable Rules

| Column Type | Nullable | Reason |
|-------------|----------|--------|
| Primary Key | NOT NULL | Required by definition |
| FK (required) | NOT NULL | Parent required |
| FK (optional) | NULL | Parent optional |
| Name/Code | NOT NULL | Business requirement |
| Description | NULL | Optional |
| Audit columns | NULL | System-managed |
| IsActive | NOT NULL | Soft delete flag |

## Example

```sql
CREATE TABLE [dbo].[B20Customer] (
    [Id] INT IDENTITY(1,1) NOT NULL,
    [Code] VARCHAR(50) NOT NULL,
    [Name] NVARCHAR(255) NOT NULL,
    [TaxCode] VARCHAR(20) NULL,
    [Address] NVARCHAR(500) NULL,
    [Phone] VARCHAR(20) NULL,
    [Email] VARCHAR(100) NULL,
    [Balance] DECIMAL(18,2) NOT NULL DEFAULT ((0)),
    [IsActive] BIT NOT NULL DEFAULT ((1)),
    [CreatedBy] INT NULL,
    [CreatedDate] DATETIME2(7) NULL DEFAULT (GETDATE()),
    [ModifiedBy] INT NULL,
    [ModifiedDate] DATETIME2(7) NULL,
    CONSTRAINT [PK_B20Customer] PRIMARY KEY CLUSTERED ([Id] ASC)
);
GO
```

# Database Naming Conventions (Generated Objects)

## Tables — `B{Prefix}{Name}`

```
B20Customer
B30BizDoc
B40Invoice
B10Company
```

`B` prefix + numeric tier + PascalCase name.

## Columns — PascalCase

```
CustomerName
DocDate
Amount
IsActive
CreatedDate
CreatedBy
```

## Primary Key

```
Id
```

Always `Id` (singular, PascalCase).

## Foreign Key Columns — `{Target}Id`

```
CustomerId         -> references B20Customer.Id
ProductId          -> references B50Product.Id
DocumentId         -> references B30BizDoc.Id
```

## FK Constraints — `FK_{Source}_{Target}`

```sql
ALTER TABLE B30BizDoc
  ADD CONSTRAINT FK_B30BizDoc_B20Customer
  FOREIGN KEY (CustomerId) REFERENCES B20Customer(Id);
```

## Indexes

Regular:
```sql
CREATE INDEX IX_B30BizDoc_DocDate ON B30BizDoc(DocDate);
```

Unique:
```sql
CREATE UNIQUE INDEX UX_B20Customer_Code ON B20Customer(CustomerCode);
```

Format: `IX_{Table}_{Column}` or `UX_{Table}_{Code}`.

## Stored Procedures — `usp_{Table}_{Action}`

```
usp_B20Customer_Select
usp_B20Customer_Insert
usp_B20Customer_Update
usp_B20Customer_Delete
usp_B30BizDoc_Select
usp_B30BizDoc_SelectByCustomer
```

## Views — `v{Name}`

```
vB20CustomerWithStats
vB30BizDocSummary
vInvoiceAging
```

## Triggers — `trg_{Table}_{Action}`

```sql
CREATE TRIGGER trg_B30BizDoc_Audit ON B30BizDoc AFTER UPDATE AS ...
CREATE TRIGGER trg_B20Customer_Log ON B20Customer AFTER DELETE AS ...
```

## Constraints Summary

| Object            | Max Length |
|-------------------|------------|
| All names         | 128 chars  |
| Table names       | 128 chars  |
| Column names      | 128 chars  |
| Constraint names  | 128 chars  |
| SP names          | 128 chars  |

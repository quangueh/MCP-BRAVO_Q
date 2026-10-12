# DataSource XML Generator Specification

## Overview

The DataSource generator produces a complete XML configuration that defines how data is fetched, saved, and validated. It bridges the database layer and the layout layer.

---

## Input

```json
{
  "TableMetadata": {
    "TableName": "B20Customer",
    "Columns": ["Id", "Code", "Name", "TaxCode", "Address", "Phone", "IsActive"]
  },
  "LayoutType": "Explorer|Editor|Report",
  "SPMetadata": {
    "SPName": "usp_Customer_Select",
    "Parameters": []
  }
}
```

---

## Generation Steps

### Step 1: Create TableCollection with Main Table

```xml
<TableCollection>
    <Ct Name="Customer" Source="B20Customer" Type="Table">
        <Columns>
            <Column Name="Id" DbType="INT" IsPK="true" IsIdentity="true" />
            <Column Name="Code" DbType="VARCHAR(50)" />
            <Column Name="Name" DbType="NVARCHAR(255)" />
            <Column Name="TaxCode" DbType="VARCHAR(20)" />
            <Column Name="Address" DbType="NVARCHAR(500)" />
            <Column Name="Phone" DbType="VARCHAR(20)" />
            <Column Name="IsActive" DbType="BIT" />
        </Columns>
    </Ct>
</TableCollection>
```

### Step 2: If SP-Based, Set Source to SP Name

```xml
<Ct Name="Customer" Source="usp_Customer_Select" Type="StoredProcedure">
    <Parameters>
        <Parameter Name="_nUserId" DbType="INT" />
        <Parameter Name="_BranchCode" DbType="VARCHAR(3)" />
    </Parameters>
</Ct>
```

### Step 3: If View-Based, Set Source to View Name

```xml
<Ct Name="Customer" Source="vB20Customer" Type="View" />
```

### Step 4: Create SourceCollection for Sub-Queries

```xml
<SourceCollection>
    <Source Name="CustomerLookup">
        <Text>SELECT Id, Code, Name FROM B20Customer WHERE IsActive = 1 ORDER BY Code</Text>
    </Source>
</SourceCollection>
```

### Step 5: Create JoinCollection for LEFT JOINs

```xml
<JoinCollection>
    <Join Name="CustomerClass">
        <SourceTable>Customer</SourceTable>
        <TargetTable>ClassInfo</TargetTable>
        <SourceColumn>ClassId</SourceColumn>
        <TargetColumn>Id</TargetColumn>
        <JoinType>LEFT</JoinType>
        <Columns>
            <Column Name="ClassName" Source="ClassInfo.Name" />
        </Columns>
    </Join>
</JoinCollection>
```

### Step 6: Create CommandCollection

INSERT command:
```xml
<Command Name="InsertCustomer" Type="INSERT">
    <Text>
        INSERT INTO B20Customer (Code, Name, TaxCode, Address, Phone, IsActive, CreatedBy, CreatedDate)
        VALUES (@Code, @Name, @TaxCode, @Address, @Phone, 1, @nUserId, GETDATE())
    </Text>
    <Parameters>
        <Parameter Name="Code" DbType="VARCHAR(50)" SourceColumn="Code" />
        <Parameter Name="Name" DbType="NVARCHAR(255)" SourceColumn="Name" />
        <Parameter Name="TaxCode" DbType="VARCHAR(20)" SourceColumn="TaxCode" />
        <Parameter Name="Address" DbType="NVARCHAR(500)" SourceColumn="Address" />
        <Parameter Name="Phone" DbType="VARCHAR(20)" SourceColumn="Phone" />
    </Parameters>
</Command>
```

UPDATE command:
```xml
<Command Name="UpdateCustomer" Type="UPDATE">
    <Text>
        UPDATE B20Customer
        SET Code = @Code, Name = @Name, TaxCode = @TaxCode,
            Address = @Address, Phone = @Phone,
            ModifiedBy = @nUserId, ModifiedDate = GETDATE()
        WHERE Id = @Id
    </Text>
    <Parameters>
        <Parameter Name="Id" DbType="INT" SourceColumn="Id" />
        <Parameter Name="Code" DbType="VARCHAR(50)" SourceColumn="Code" />
        <Parameter Name="Name" DbType="NVARCHAR(255)" SourceColumn="Name" />
    </Parameters>
</Command>
```

### Step 7: Add Evaluators for Toolbar Actions

```xml
<Evaluators>
    <Evaluator Name="evalNew" BravoCommandKey="New">
        <Action>NewRow</Action>
    </Evaluator>
    <Evaluator Name="evalSave" BravoCommandKey="Save">
        <Action>Save</Action>
        <Validators>RequiredFields</Validators>
    </Evaluator>
    <Evaluator Name="evalDelete" BravoCommandKey="Delete">
        <Action>SoftDelete</Action>
        <Parameters>
            <Parameter Name="Id" Source="CurrentRow.Id" />
        </Parameters>
    </Evaluator>
</Evaluators>
```

### Step 8: Add Validators

```xml
<Validators>
    <Validator Name="valCodeRequired">
        <Field>Code</Field>
        <Rule>Required</Rule>
        <Message>
            <Vietnamese>Ma khong duoc de trong</Vietnamese>
            <English>Code is required</English>
        </Message>
    </Validator>
    <Validator Name="valCodeUnique">
        <Field>Code</Field>
        <Rule>Unique</Rule>
        <Message>
            <Vietnamese>Ma da ton tai</Vietnamese>
            <English>Code already exists</English>
        </Message>
    </Validator>
</Validators>
```

---

## Complete DataSource XML Template

```xml
<?xml version="1.0" encoding="utf-8"?>
<DataSource>
    <TableCollection>
        <Ct Name="{MainTable}" Source="{Source}" Type="{Type}">
            <Columns>{ColumnDefs}</Columns>
        </Ct>
    </TableCollection>
    <SourceCollection>
        {SubQueries}
    </SourceCollection>
    <JoinCollection>
        {Joins}
    </JoinCollection>
    <ChildCollection>
        {MasterDetailLinks}
    </ChildCollection>
    <CommandCollection>
        {InsertCommand}
        {UpdateCommand}
        {DeleteCommand}
    </CommandCollection>
    <Evaluators>
        {Evaluators}
    </Evaluators>
    <Validators>
        {Validators}
    </Validators>
    <TempColumns>
        {ComputedColumns}
    </TempColumns>
</DataSource>
```

---

## Generation Rules by Layout Type

| Layout Type | TableCollection | SourceCollection | CommandCollection | Evaluators | Validators |
|---|---|---|---|---|---|
| Explorer | Required | Optional | Not needed | Not needed | Not needed |
| Editor | Required | Required | Required (CRUD) | Required | Required |
| Report | Required (SP) | Not needed | Not needed | Not needed | Not needed |

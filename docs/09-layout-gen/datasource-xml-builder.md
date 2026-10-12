# DataSource XML Builder

## Input

```typescript
interface DataSourceMetadata {
    tableName: string;
    displayName: string;
    columns: ColumnMetadata[];
    foreignKeys: ForeignKeyMetadata[];
    detailTables?: DetailTableMetadata[];
    hasAuditColumns: boolean;
    customCommands?: CustomCommand[];
}
```

---

## Build Process

### Step 1: buildTableCollection()

Creates the main Ct element defining the table.

```xml
<TableCollection>
    <Ct Name="Customer"
        Source="tblCustomer"
        Type="Table">
        <Key>CustomerId</Key>
        <Columns>
            <Column Name="CustomerId" Type="uniqueidentifier" 
                    IsKey="true" />
            <Column Name="CustomerCode" Type="nvarchar" Length="50" />
            <Column Name="CustomerName" Type="nvarchar" Length="200" />
            <Column Name="Phone" Type="nvarchar" Length="20" />
            <Column Name="Balance" Type="decimal" Precision="18" 
                    Scale="2" />
        </Columns>
    </Ct>
</TableCollection>
```

### Step 2: buildSourceCollection()

Builds sub-queries and CTEs used for lookups and computed data.

```xml
<SourceCollection>
    <Source Name="vw_CustomerLookup" Type="View">
        <Query>
            SELECT CustomerId, CustomerCode, CustomerName
            FROM tblCustomer
            WHERE IsActive = 1
        </Query>
    </Source>
</SourceCollection>
```

### Step 3: buildJoinCollection()

Defines LEFT JOINs to master data tables for lookups.

```xml
<JoinCollection>
    <Join Type="LEFT">
        <Table>tblCustomer</Table>
        <Alias>c</Alias>
        <On>m.CustomerId = c.CustomerId</On>
        <Columns>
            <Column Name="CustomerCode" Source="c.CustomerCode" 
                    Alias="CustomerCode" />
            <Column Name="CustomerName" Source="c.CustomerName" 
                    Alias="CustomerName" />
        </Columns>
    </Join>
</JoinCollection>
```

### Step 4: buildChildCollection()

Defines master-detail relationships.

```xml
<ChildCollection>
    <Child Name="InvoiceDetail"
           Source="tblInvoiceDetail"
           ForeignKey="InvoiceId"
           ParentKey="InvoiceId">
        <Columns>
            <Column Name="InvoiceDetailId" Type="uniqueidentifier" 
                    IsKey="true" />
            <Column Name="ProductId" Type="uniqueidentifier" />
            <Column Name="Quantity" Type="decimal" 
                    Precision="18" Scale="2" />
            <Column Name="UnitPrice" Type="decimal" 
                    Precision="18" Scale="2" />
            <Column Name="Amount" Type="decimal" 
                    Precision="18" Scale="2" />
        </Columns>
    </Child>
</ChildCollection>
```

### Step 5: buildCommandCollection()

Generates INSERT/UPDATE/DELETE commands with parameterized queries.

```xml
<CommandCollection>
    <Command Name="Insert" Type="INSERT">
        <SQL>
            INSERT INTO tblCustomer 
            (CustomerId, CustomerCode, CustomerName, Phone, Balance)
            VALUES 
            (@CustomerId, @CustomerCode, @CustomerName, @Phone, @Balance)
        </SQL>
        <Parameters>
            <Parameter Name="@CustomerId" Column="CustomerId" />
            <Parameter Name="@CustomerCode" Column="CustomerCode" />
            <Parameter Name="@CustomerName" Column="CustomerName" />
            <Parameter Name="@Phone" Column="Phone" />
            <Parameter Name="@Balance" Column="Balance" />
        </Parameters>
    </Command>
    <Command Name="Update" Type="UPDATE">
        <SQL>
            UPDATE tblCustomer SET
                CustomerCode = @CustomerCode,
                CustomerName = @CustomerName,
                Phone = @Phone,
                Balance = @Balance
            WHERE CustomerId = @CustomerId
        </SQL>
    </Command>
    <Command Name="Delete" Type="DELETE">
        <SQL>
            DELETE FROM tblCustomer 
            WHERE CustomerId = @CustomerId
        </SQL>
    </Command>
</CommandCollection>
```

### Step 6: buildEvaluators()

Generates toolbar action handler definitions.

```xml
<Evaluators>
    <Evaluator Name="OnBeforeSave" Event="BeforeSave">
        <Expression>
            // Validate required fields
            if (CustomerCode == null || CustomerCode == "")
                throw "Ma khach hang khong duoc de trong";
        </Expression>
    </Evaluator>
    <Evaluator Name="OnAfterSave" Event="AfterSave">
        <Expression>
            // Log save action
            Log("Customer saved: " + CustomerCode);
        </Expression>
    </Evaluator>
</Evaluators>
```

### Step 7: buildValidators()

Generates field validation rules.

```xml
<Validators>
    <Validator Name="valCustomerCode"
               Column="CustomerCode" Type="Required">
        <Message>Ma khach hang khong duoc de trong</Message>
    </Validator>
    <Validator Name="valBalance"
               Column="Balance" Type="Range"
               Min="0" Max="999999999">
        <Message>So du phai lon hon 0</Message>
    </Validator>
</Validators>
```

### Step 8: buildTempColumns()

Generates computed/temporary columns.

```xml
<TempColumns>
    <TempColumn Name="FullName"
                Expression="CustomerCode + ' - ' + CustomerName"
                Type="nvarchar" Length="255" />
</TempColumns>
```

### Step 9: buildComplete()

Validates and returns XML string.

Validation checks:
1. TableCollection has at least one Ct element
2. Key column is defined
3. All FK references are valid
4. Command SQL syntax is valid
5. No circular child references

---

## Complete Output Example

```xml
<?xml version="1.0" encoding="utf-8"?>
<DataSource>
    <TableCollection>
        <Ct Name="Customer" Source="tblCustomer" Type="Table">
            <Key>CustomerId</Key>
            <Columns>
                <Column Name="CustomerId" Type="uniqueidentifier" 
                        IsKey="true" />
                <Column Name="CustomerCode" Type="nvarchar" Length="50" />
                <Column Name="CustomerName" Type="nvarchar" Length="200" />
                <Column Name="Phone" Type="nvarchar" Length="20" />
                <Column Name="Balance" Type="decimal" 
                        Precision="18" Scale="2" />
                <Column Name="IsActive" Type="bit" />
            </Columns>
        </Ct>
    </TableCollection>
    <CommandCollection>
        <Command Name="Insert" Type="INSERT">
            <SQL>
                INSERT INTO tblCustomer 
                (CustomerId, CustomerCode, CustomerName, Phone, 
                 Balance, IsActive)
                VALUES 
                (@CustomerId, @CustomerCode, @CustomerName, @Phone, 
                 @Balance, @IsActive)
            </SQL>
        </Command>
    </CommandCollection>
    <Validators>
        <Validator Name="valCustomerCode" Column="CustomerCode" 
                   Type="Required">
            <Message>Ma khach hang khong duoc de trong</Message>
        </Validator>
    </Validators>
</DataSource>
```

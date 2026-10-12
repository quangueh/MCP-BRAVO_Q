# Stored Procedure Patterns

## Overview

Bravo ERP uses 2,253 stored procedures across the Bravo_Config database. This document catalogs the common SP patterns that BLG must generate.

---

## Pattern 1: CRUD Stored Procedures

Every table gets four standard CRUD procedures.

### Naming Convention

```
usp_{Module}_Select
usp_{Module}_Insert
usp_{Module}_Update
usp_{Module}_Delete
```

### Select Procedure

```sql
CREATE PROCEDURE [dbo].[usp_Customer_Select]
    @_nUserId   INT           = NULL,
    @_BranchCode VARCHAR(3)   = NULL,
    @_SearchText NVARCHAR(255) = NULL
AS
BEGIN
    SET NOCOUNT ON;

    SELECT
        c.Id, c.Code, c.Name, c.TaxCode,
        c.Address, c.Phone, c.Email,
        c.IsActive, c.CreatedBy, c.CreatedDate,
        c.ModifiedBy, c.ModifiedDate
    FROM B20Customer c
    WHERE c.IsActive = 1
      AND (@_SearchText IS NULL
           OR c.Code LIKE '%' + @_SearchText + '%'
           OR c.Name LIKE '%' + @_SearchText + '%'
    ORDER BY c.Code;
END
```

### Insert Procedure

```sql
CREATE PROCEDURE [dbo].[usp_Customer_Insert]
    @_Code        VARCHAR(50),
    @_Name        NVARCHAR(255),
    @_TaxCode     VARCHAR(20)   = NULL,
    @_Address     NVARCHAR(500) = NULL,
    @_Phone       VARCHAR(20)   = NULL,
    @_Email       VARCHAR(100)  = NULL,
    @_nUserId     INT           = NULL,
    @_NewId       INT           OUTPUT
AS
BEGIN
    SET NOCOUNT ON;

    INSERT INTO B20Customer (Code, Name, TaxCode, Address, Phone, Email, IsActive, CreatedBy, CreatedDate)
    VALUES (@_Code, @_Name, @_TaxCode, @_Address, @_Phone, @_Email, 1, @_nUserId, GETDATE());

    SET @_NewId = SCOPE_IDENTITY();
END
```

### Update Procedure

```sql
CREATE PROCEDURE [dbo].[usp_Customer_Update]
    @_Id          INT,
    @_Code        VARCHAR(50),
    @_Name        NVARCHAR(255),
    @_TaxCode     VARCHAR(20)   = NULL,
    @_Address     NVARCHAR(500) = NULL,
    @_Phone       VARCHAR(20)   = NULL,
    @_Email       VARCHAR(100)  = NULL,
    @_nUserId     INT           = NULL
AS
BEGIN
    SET NOCOUNT ON;

    UPDATE B20Customer
    SET Code        = @_Code,
        Name        = @_Name,
        TaxCode     = @_TaxCode,
        Address     = @_Address,
        Phone       = @_Phone,
        Email       = @_Email,
        ModifiedBy  = @_nUserId,
        ModifiedDate = GETDATE()
    WHERE Id = @_Id AND IsActive = 1;
END
```

### Delete Procedure (Soft Delete)

```sql
CREATE PROCEDURE [dbo].[usp_Customer_Delete]
    @_Id      INT,
    @_nUserId INT = NULL
AS
BEGIN
    SET NOCOUNT ON;

    UPDATE B20Customer
    SET IsActive     = 0,
        ModifiedBy   = @_nUserId,
        ModifiedDate = GETDATE()
    WHERE Id = @_Id;
END
```

---

## Pattern 2: Report Stored Procedures

Report SPs follow the Vietnamese naming convention `BaoCao` (Report).

### Naming Convention

```
usp_{Module}_BaoCao{ReportName}
```

### Common Parameters

| Parameter | Type | Direction | Purpose |
|---|---|---|---|
| @_DocDate | DATE | OUTPUT | Report date |
| @_ProductId | INT | INPUT | Filter by product |
| @_nUserId | INT | INPUT | Current user |
| @_BranchCode | VARCHAR(3) | INPUT | Branch filter |

### Example

```sql
CREATE PROCEDURE [dbo].[usp_CCM_BaoCaoTongHopThucHienNganSachCongTruong_HangMuc_KeToan]
    @_DocDate      DATE          = NULL OUTPUT,
    @_ProductId    INT           = NULL,
    @_nUserId      INT           = NULL,
    @_BranchCode   VARCHAR(3)    = NULL
AS
BEGIN
    SET NOCOUNT ON;

    IF @_DocDate IS NULL
        SET @_DocDate = GETDATE();

    CREATE TABLE #Budget (
        ProductId    INT,
        CustomerId   INT,
        BudgetAmount DECIMAL(18,2),
        ActualAmount DECIMAL(18,2)
    );

    INSERT INTO #Budget (ProductId, CustomerId, BudgetAmount, ActualAmount)
    SELECT bc.ProductId, bc.CustomerId,
        SUM(bcd.Amount) AS BudgetAmount,
        0 AS ActualAmount
    FROM B30BudgetCons bc
    INNER JOIN B30BudgetConsDetail bcd ON bcd.BudgetConsId = bc.Id
    WHERE bc.IsActive = 1
      AND (@_ProductId IS NULL OR bc.ProductId = @_ProductId)
    GROUP BY bc.ProductId, bc.CustomerId;

    UPDATE b SET b.ActualAmount = ISNULL(a.ActualAmount, 0)
    FROM #Budget b
    LEFT JOIN (
        SELECT ProductId, CustomerId, SUM(Amount) AS ActualAmount
        FROM B30BizDoc
        WHERE IsActive = 1 AND DocDate <= @_DocDate
        GROUP BY ProductId, CustomerId
    ) a ON a.ProductId = b.ProductId AND a.CustomerId = b.CustomerId;

    SELECT p.Code AS ProductCode, p.Name AS ProductName,
        c.Code AS CustomerCode, c.Name AS CustomerName,
        b.BudgetAmount, b.ActualAmount,
        b.BudgetAmount - b.ActualAmount AS Variance
    FROM #Budget b
    INNER JOIN B20Product p ON p.Id = b.ProductId
    INNER JOIN B20Customer c ON c.Id = b.CustomerId
    ORDER BY p.Code, c.Code;

    DROP TABLE #Budget;
END
```

---

## Pattern 3: Approval Stored Procedures

Approval SPs handle workflow transitions.

```sql
CREATE PROCEDURE [dbo].[usp_BizDoc_Approve]
    @_Id        INT,
    @_DocStatus INT,
    @_nUserId   INT = NULL,
    @_ApproveNote NVARCHAR(500) = NULL
AS
BEGIN
    SET NOCOUNT ON;

    BEGIN TRY
        IF NOT EXISTS (
            SELECT 1 FROM B30BizDoc
            WHERE Id = @_Id AND DocStatus IN (1, 2, 3)
        )
        BEGIN
            RAISERROR('Document cannot be approved in its current status.', 16, 1);
            RETURN;
        END

        UPDATE B30BizDoc
        SET DocStatus   = @_DocStatus,
            ModifiedBy  = @_nUserId,
            ModifiedDate = GETDATE()
        WHERE Id = @_Id;
    END TRY
    BEGIN CATCH
        DECLARE @ErrorMessage NVARCHAR(4000) = ERROR_MESSAGE();
        RAISERROR(@ErrorMessage, 16, 1);
    END CATCH
END
```

---

## Pattern 4: Utility Stored Procedures

Utility SPs handle system operations.

### Refresh Lookup Cache

```sql
CREATE PROCEDURE [dbo].[usp_RefreshCache]
    @_TableName NVARCHAR(100) = NULL
AS
BEGIN
    SET NOCOUNT ON;

    IF @_TableName IS NULL OR @_TableName = 'Customer'
        SELECT Id, Code, Name FROM B20Customer WHERE IsActive = 1 ORDER BY Code;

    IF @_TableName IS NULL OR @_TableName = 'Product'
        SELECT Id, Code, Name FROM B20Product WHERE IsActive = 1 ORDER BY Code;
END
```

### Number Generation

```sql
CREATE PROCEDURE [dbo].[usp_GenerateDocNumber]
    @_Prefix    VARCHAR(10),
    @_BranchCode VARCHAR(3),
    @_NewNumber VARCHAR(50) OUTPUT
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @LastNum INT;

    SELECT @LastNum = MAX(CAST(SUBSTRING(Code, LEN(@_Prefix) + 1, 10) AS INT))
    FROM B30BizDoc
    WHERE Code LIKE @_Prefix + '%';

    SET @LastNum = ISNULL(@LastNum, 0) + 1;
    SET @_NewNumber = @_Prefix + RIGHT('00000' + CAST(@LastNum AS VARCHAR), 5);
END
```

---

## Common Parameters Reference

| Parameter | Type | Purpose |
|---|---|---|
| @_nUserId | INT | Current logged-in user Id |
| @_BranchCode | VARCHAR(3) | Current branch code |
| @_DocDate | DATE | Document date / report date |
| @_ProductId | INT | Product filter |
| @_CustomerId | INT | Customer filter |
| @_VendorId | INT | Vendor filter |
| @_DocStatus | INT | Status filter |
| @_SearchText | NVARCHAR(255) | Free-text search |
| @_NewId | INT OUTPUT | Newly created record Id |
| @_NewNumber | VARCHAR(50) OUTPUT | Generated document number |

---

## Temp Table Patterns

| Table Name | Purpose | Lifetime |
|---|---|---|
| #Budget | Budget aggregation working table | Single execution |
| #Result | Final result staging | Single execution |
| #Working | Intermediate calculations | Single execution |
| #TempDoc | Document header + lines joined | Single execution |
| #Summary | Aggregated summary data | Single execution |

---

## Error Handling Pattern

```sql
BEGIN TRY
    BEGIN TRANSACTION;
    -- Operations...
    COMMIT TRANSACTION;
END TRY
BEGIN CATCH
    IF @@TRANCOUNT > 0
        ROLLBACK TRANSACTION;
    DECLARE @ErrorMessage NVARCHAR(4000) = ERROR_MESSAGE();
    DECLARE @ErrorSeverity INT = ERROR_SEVERITY();
    DECLARE @ErrorState INT = ERROR_STATE();
    RAISERROR(@ErrorMessage, @ErrorSeverity, @ErrorState);
END CATCH
```

# Stored Procedure Generator Specification

## Standard SP Set
Per table: usp_{Table}_Select, _Insert, _Update, _Delete

## Common Parameters
```sql
@_UserId INT = NULL,
@_BranchCode VARCHAR(3) = NULL,
@_LangId INT = 1
```

## usp_{Table}_Select
```sql
CREATE PROCEDURE [dbo].[usp_B20Customer_Select]
    @_UserId INT = NULL,
    @SearchText NVARCHAR(255) = NULL,
    @IsActive BIT = 1
AS
BEGIN
    SET NOCOUNT ON;
    SELECT t.[Id], t.[Code], t.[Name], t.[TaxCode], t.[IsActive]
    FROM [dbo].[B20Customer] t
    WHERE t.[IsActive] = @IsActive
      AND (@SearchText IS NULL
           OR t.[Code] LIKE N'%' + @SearchText + N'%'
           OR t.[Name] LIKE N'%' + @SearchText + N'%')
    ORDER BY t.[Code];
END;
GO
```

## usp_{Table}_Insert
```sql
CREATE PROCEDURE [dbo].[usp_B20Customer_Insert]
    @_UserId INT = NULL,
    @Code VARCHAR(50),
    @Name NVARCHAR(255),
    @NewId INT OUTPUT
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRY
        INSERT INTO [dbo].[B20Customer] ([Code], [Name], [IsActive], [CreatedBy], [CreatedDate])
        VALUES (@Code, @Name, 1, @_UserId, GETDATE());
        SET @NewId = SCOPE_IDENTITY();
    END TRY
    BEGIN CATCH
        THROW;
    END CATCH;
END;
GO
```

## usp_{Table}_Update
```sql
CREATE PROCEDURE [dbo].[usp_B20Customer_Update]
    @_UserId INT = NULL,
    @Id INT,
    @Code VARCHAR(50),
    @Name NVARCHAR(255)
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRY
        UPDATE [dbo].[B20Customer]
        SET [Code] = @Code, [Name] = @Name,
            [ModifiedBy] = @_UserId, [ModifiedDate] = GETDATE()
        WHERE [Id] = @Id AND [IsActive] = 1;
    END TRY
    BEGIN CATCH
        THROW;
    END CATCH;
END;
GO
```

## usp_{Table}_Delete
```sql
CREATE PROCEDURE [dbo].[usp_B20Customer_Delete]
    @_UserId INT = NULL,
    @Id INT
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRY
        UPDATE [dbo].[B20Customer]
        SET [IsActive] = 0, [ModifiedBy] = @_UserId, [ModifiedDate] = GETDATE()
        WHERE [Id] = @Id AND [IsActive] = 1;
    END TRY
    BEGIN CATCH
        THROW;
    END CATCH;
END;
GO
```

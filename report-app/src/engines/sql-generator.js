class SqlGenerator {
  generateAll(metadata, tableName) {
    const tbl = tableName || 'GeneratedTable';
    return {
      createTable: this.generateCreateTable(tbl, metadata),
      foreignKeys: this.generateForeignKeys(tbl, metadata),
      indexes: this.generateIndexes(tbl),
      views: this.generateViews(tbl),
      storedProcedures: this.generateStoredProcedures(tbl),
      dropScript: this.generateDropScript(tbl),
      insertScript: this.generateInsertTemplate(tbl),
      seedData: this.generateSeedData(tbl)
    };
  }

  generateCreateTable(tbl, metadata) {
    let sql = '-- CREATE TABLE: ' + tbl + '
';
    sql += 'CREATE TABLE [dbo].[' + tbl + '] (
';
    sql += '  [Id] INT IDENTITY(1,1) PRIMARY KEY,
';
    sql += '  [BranchCode] VARCHAR(3) NOT NULL,
';
    sql += '  [DocCode] VARCHAR(10),
';
    sql += '  [DocDate] DATE,
';
    sql += '  [DocNo] VARCHAR(20),
';
    sql += '  [Description] NVARCHAR(255),
';
    sql += '  [DocStatus] TINYINT DEFAULT 0,
';
    sql += '  [IsActive] BIT DEFAULT 1,
';
    sql += '  [IsCancelled] BIT DEFAULT 0,
';
    sql += '  [CreatedBy] INT,
';
    sql += '  [CreatedAt] DATETIME DEFAULT GETDATE(),
';
    sql += '  [ModifiedBy] INT,
';
    sql += '  [ModifiedAt] DATETIME
';
    sql += ');
GO
';
    return sql;
  }

  generateForeignKeys(tbl, metadata) {
    let sql = '-- FOREIGN KEYS

';
    if (metadata.lookups && metadata.lookups.length > 0) {
      metadata.lookups.forEach(lk => {
        const target = this.mapLookup(lk);
        if (target) {
          const fkCol = lk + 'Id';
          sql += 'ALTER TABLE [dbo].[' + tbl + ']
';
          sql += 'ADD CONSTRAINT [FK_' + tbl + '_' + fkCol + ']
';
          sql += 'FOREIGN KEY ([' + fkCol + '])
';
          sql += 'REFERENCES [dbo].[' + target + '] ([Id]);
GO

';
        }
      });
    }
    return sql;
  }

  generateIndexes(tbl) {
    let sql = '-- INDEXES

';
    sql += 'CREATE INDEX [IX_' + tbl + '_BranchCode] ON [dbo].[' + tbl + '] ([BranchCode]);
GO
';
    sql += 'CREATE INDEX [IX_' + tbl + '_DocDate] ON [dbo].[' + tbl + '] ([DocDate]);
GO
';
    sql += 'CREATE INDEX [IX_' + tbl + '_DocStatus] ON [dbo].[' + tbl + '] ([DocStatus]);
GO
';
    return sql;
  }

  generateViews(tbl) {
    let sql = '-- VIEW: v' + tbl + '

';
    sql += 'CREATE VIEW [dbo].[v' + tbl + ']
AS
';
    sql += 'SELECT t.*, b.Name AS BranchName
';
    sql += 'FROM [dbo].[' + tbl + '] t
';
    sql += 'LEFT JOIN [dbo].[B00Branch] b ON t.BranchCode = b.Code
';
    sql += 'WHERE t.IsActive = 1;
GO
';
    return sql;
  }

  generateStoredProcedures(tbl) {
    let sql = '-- STORED PROCEDURES

';
    sql += 'CREATE PROCEDURE [dbo].[usp_' + tbl + '_Select]
  @BranchCode VARCHAR(3) = NULL
AS
BEGIN
  SET NOCOUNT ON;
  SELECT * FROM [dbo].[v' + tbl + ']
  WHERE (@BranchCode IS NULL OR BranchCode = @BranchCode)
  ORDER BY DocDate DESC;
END
GO

';
    sql += 'CREATE PROCEDURE [dbo].[usp_' + tbl + '_Insert]
  @BranchCode VARCHAR(3), @DocCode VARCHAR(10) = NULL, @DocDate DATE = NULL, @Description NVARCHAR(255) = NULL
AS
BEGIN
  SET NOCOUNT ON;
  INSERT INTO [dbo].[' + tbl + '] (BranchCode, DocCode, DocDate, Description)
  VALUES (@BranchCode, @DocCode, @DocDate, @Description);
  SELECT SCOPE_IDENTITY() AS Id;
END
GO

';
    sql += 'CREATE PROCEDURE [dbo].[usp_' + tbl + '_Update]
  @Id INT, @DocCode VARCHAR(10) = NULL, @DocDate DATE = NULL, @Description NVARCHAR(255) = NULL
AS
BEGIN
  SET NOCOUNT ON;
  UPDATE [dbo].[' + tbl + ']
  SET DocCode = ISNULL(@DocCode, DocCode), DocDate = ISNULL(@DocDate, DocDate), Description = ISNULL(@Description, Description), ModifiedAt = GETDATE()
  WHERE Id = @Id;
END
GO

';
    sql += 'CREATE PROCEDURE [dbo].[usp_' + tbl + '_Delete]
  @Id INT
AS
BEGIN
  SET NOCOUNT ON;
  UPDATE [dbo].[' + tbl + '] SET IsActive = 0, ModifiedAt = GETDATE() WHERE Id = @Id;
END
GO
';
    return sql;
  }

  generateDropScript(tbl) {
    let sql = '-- DROP SCRIPT

';
    sql += "IF EXISTS (SELECT * FROM sys.procedures WHERE name = 'usp_" + tbl + "_Delete') DROP PROCEDURE [dbo].[usp_" + tbl + "_Delete];
";
    sql += "IF EXISTS (SELECT * FROM sys.procedures WHERE name = 'usp_" + tbl + "_Update') DROP PROCEDURE [dbo].[usp_" + tbl + "_Update];
";
    sql += "IF EXISTS (SELECT * FROM sys.procedures WHERE name = 'usp_" + tbl + "_Insert') DROP PROCEDURE [dbo].[usp_" + tbl + "_Insert];
";
    sql += "IF EXISTS (SELECT * FROM sys.procedures WHERE name = 'usp_" + tbl + "_Select') DROP PROCEDURE [dbo].[usp_" + tbl + "_Select];
";
    sql += "IF EXISTS (SELECT * FROM sys.views WHERE name = 'v" + tbl + "') DROP VIEW [dbo].[v" + tbl + "];
";
    sql += "IF EXISTS (SELECT * FROM sys.tables WHERE name = '" + tbl + "') DROP TABLE [dbo].[" + tbl + "];
GO
";
    return sql;
  }

  generateInsertTemplate(tbl) {
    let sql = '-- INSERT TEMPLATE

';
    sql += "INSERT INTO [dbo].[" + tbl + "] (BranchCode, DocCode, DocDate, Description)
";
    sql += "VALUES ('A01', 'XX', GETDATE(), N'Mo ta');
GO
";
    return sql;
  }

  generateSeedData(tbl) {
    let sql = '-- SEED DATA

';
    sql += "SET IDENTITY_INSERT [dbo].[" + tbl + "] ON;

";
    sql += "INSERT INTO [dbo].[" + tbl + "] (Id, BranchCode, DocCode, DocDate, Description, IsActive)
";
    sql += "VALUES (1, 'A01', 'XX', GETDATE(), N'Sample data', 1);

";
    sql += "SET IDENTITY_INSERT [dbo].[" + tbl + "] OFF;
GO
";
    return sql;
  }

  mapLookup(lookup) {
    const map = { Customer: 'B20Customer', Vendor: 'B20ItemVendor', Item: 'B20Item', Employee: 'B20Employee', Currency: 'B20Currency', Warehouse: 'B20Warehouse', Product: 'B20Product' };
    return map[lookup] || null;
  }
}
module.exports = SqlGenerator;
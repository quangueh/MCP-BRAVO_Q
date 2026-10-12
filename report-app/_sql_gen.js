class SqlGenerator {
  generateAll(metadata, tableName) {
    const tbl = tableName || "GeneratedTable";
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
    let s = "-- CREATE TABLE: " + tbl + NL;
    s += "CREATE TABLE [dbo].[" + tbl + "] (" + NL;
    s += "  [Id] INT IDENTITY(1,1) PRIMARY KEY," + NL;
    s += "  [BranchCode] VARCHAR(3) NOT NULL," + NL;
    s += "  [DocCode] VARCHAR(10)," + NL;
    s += "  [DocDate] DATE," + NL;
    s += "  [DocNo] VARCHAR(20)," + NL;
    s += "  [Description] NVARCHAR(255)," + NL;
    s += "  [DocStatus] TINYINT DEFAULT 0," + NL;
    s += "  [IsActive] BIT DEFAULT 1," + NL;
    s += "  [IsCancelled] BIT DEFAULT 0," + NL;
    s += "  [CreatedBy] INT," + NL;
    s += "  [CreatedAt] DATETIME DEFAULT GETDATE()," + NL;
    s += "  [ModifiedBy] INT," + NL;
    s += "  [ModifiedAt] DATETIME" + NL;
    s += ");" + NL + "GO" + NL;
    return s;
  }

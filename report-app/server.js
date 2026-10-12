const express = require('express');
const sql = require('mssql');
const cors = require('cors');
const XLSX = require('xlsx');
const PDFDocument = require('pdfkit');
const path = require('path');
const fs = require('fs');
const LayoutParser = require('./src/engines/layout-parser');
const SqlGenerator = require('./src/engines/sql-generator');
const LayoutGenerator = require('./src/engines/layout-generator');

const app = express();
app.use(cors());
app.use(express.json());

// ============ TEST ROUTE ============
app.get('/api/test', (req, res) => {
  res.json({ message: 'Test route works' });
});

const config = {
  server: process.env.MSSQL_SERVER || 'your-sql-server',
  port: Number(process.env.MSSQL_PORT || '1433'),
  user: process.env.MSSQL_USER || 'readonly_user',
  password: process.env.MSSQL_PASSWORD || '',
  options: {
    trustServerCertificate: process.env.MSSQL_TRUST_SERVER_CERTIFICATE !== 'false',
    encrypt: process.env.MSSQL_ENCRYPT === 'true'
  }
};

// Database connections
async function getConnection(database) {
  const dbConfig = { ...config, database };
  return await sql.connect(dbConfig);
}

// ============ DASHBOARD API ============

// Get overview stats
app.get('/api/dashboard', async (req, res) => {
  try {
    await getConnection('Bravo_Data');

    const [customers, items, employees, vendors] = await Promise.all([
      sql.query('SELECT COUNT(*) as cnt FROM B20Customer'),
      sql.query('SELECT COUNT(*) as cnt FROM B20Item'),
      sql.query('SELECT COUNT(*) as cnt FROM B20Employee'),
      sql.query('SELECT COUNT(*) as cnt FROM B20ItemVendor')
    ]);

    await sql.close();

    res.json({
      customers: customers.recordset[0].cnt,
      items: items.recordset[0].cnt,
      employees: employees.recordset[0].cnt,
      vendors: vendors.recordset[0].cnt
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get recent transactions
app.get('/api/transactions', async (req, res) => {
  try {
    await getConnection('Bravo_Data');

    const result = await sql.query(`
      SELECT TOP 100
        Id, DocNo, DocDate, DocStatus,
        CustomerCode, CustomerName,
        TotalAmount, CurrencyCode
      FROM B30AccDocSales
      ORDER BY DocDate DESC
    `);

    await sql.close();
    res.json(result.recordset);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ============ DATA API ============

// Generic table query
app.get('/api/table/:database/:tableName', async (req, res) => {
  try {
    const { database, tableName } = req.params;
    const { page = 1, pageSize = 50, search = '' } = req.query;

    await getConnection(database);

    // Validate table name (prevent SQL injection)
    const validTables = await sql.query(`
      SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES
      WHERE TABLE_TYPE = 'BASE TABLE'
    `);
    const validNames = validTables.recordset.map(t => t.TABLE_NAME);

    if (!validNames.includes(tableName)) {
      await sql.close();
      return res.status(400).json({ error: 'Invalid table name' });
    }

    // Get columns
    const columns = await sql.query(`
      SELECT COLUMN_NAME, DATA_TYPE, CHARACTER_MAXIMUM_LENGTH
      FROM INFORMATION_SCHEMA.COLUMNS
      WHERE TABLE_NAME = '${tableName}'
      ORDER BY ORDINAL_POSITION
    `);

    // Get data with pagination
    const offset = (page - 1) * pageSize;
    let whereClause = '';
    if (search) {
      const textCols = columns.recordset
        .filter(c => c.DATA_TYPE.includes('char') || c.DATA_TYPE.includes('text'))
        .map(c => `CAST([${c.COLUMN_NAME}] AS NVARCHAR(MAX)) LIKE '%${search}%'`);
      if (textCols.length > 0) {
        whereClause = 'WHERE ' + textCols.join(' OR ');
      }
    }

    const data = await sql.query(`
      SELECT * FROM [${tableName}]
      ${whereClause}
      ORDER BY (SELECT NULL)
      OFFSET ${offset} ROWS
      FETCH NEXT ${pageSize} ROWS ONLY
    `);

    // Get total count
    const countResult = await sql.query(`
      SELECT COUNT(*) as cnt FROM [${tableName}] ${whereClause}
    `);

    await sql.close();

    res.json({
      columns: columns.recordset.map(c => ({
        name: c.COLUMN_NAME,
        type: c.DATA_TYPE,
        maxLength: c.CHARACTER_MAXIMUM_LENGTH
      })),
      data: data.recordset,
      total: countResult.recordset[0].cnt,
      page: parseInt(page),
      pageSize: parseInt(pageSize)
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// List tables for a database
app.get('/api/tables/:database', async (req, res) => {
  try {
    const { database } = req.params;
    await getConnection(database);

    const result = await sql.query(`
      SELECT
        t.TABLE_NAME,
        (SELECT COUNT(*) FROM [${database}].INFORMATION_SCHEMA.COLUMNS c
         WHERE c.TABLE_NAME = t.TABLE_NAME) as ColumnCount
      FROM INFORMATION_SCHEMA.TABLES t
      WHERE t.TABLE_TYPE = 'BASE TABLE'
      ORDER BY t.TABLE_NAME
    `);

    await sql.close();
    res.json(result.recordset);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ============ EXPORT API ============

// Export to Excel
app.post('/api/export/excel', async (req, res) => {
  try {
    const { database, tableName, search = '' } = req.body;

    await getConnection(database);

    const data = await sql.query(`SELECT * FROM [${tableName}]`);
    await sql.close();

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(data.recordset);
    XLSX.utils.book_append_sheet(wb, ws, tableName);

    const buffer = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename=${tableName}_export.xlsx`);
    res.send(buffer);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Export to PDF
app.post('/api/export/pdf', async (req, res) => {
  try {
    const { database, tableName } = req.body;

    await getConnection(database);
    const data = await sql.query(`SELECT TOP 100 * FROM [${tableName}]`);
    await sql.close();

    const doc = new PDFDocument({ margin: 30, size: 'A4', layout: 'landscape' });
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=${tableName}_export.pdf`);
    doc.pipe(res);

    // Title
    doc.fontSize(16).text(`Report: ${tableName}`, { align: 'center' });
    doc.moveDown();

    // Table header
    if (data.recordset.length > 0) {
      const columns = Object.keys(data.recordset[0]);
      const colWidth = (doc.page.width - 60) / columns.length;

      doc.fontSize(8).font('Helvetica-Bold');
      columns.forEach((col, i) => {
        doc.text(col.substring(0, 15), 30 + i * colWidth, doc.y, {
          width: colWidth,
          continued: false
        });
      });
      doc.moveDown();

      // Table data
      doc.font('Helvetica').fontSize(7);
      data.recordset.forEach(row => {
        if (doc.y > doc.page.height - 50) {
          doc.addPage();
        }
        columns.forEach((col, i) => {
          const val = String(row[col] || '').substring(0, 20);
          doc.text(val, 30 + i * colWidth, doc.y, {
            width: colWidth,
            continued: false
          });
        });
      });
    }

    doc.end();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ============ BUDGET REPORT API ============

app.get('/api/budget-report', async (req, res) => {
  try {
    const { date, productId } = req.query;

    await getConnection('Bravo_Config');

    // Call the stored procedure with EXACT parameters from Bravo
    const request = new sql.Request();
    request.input('_DocDate', sql.Date, new Date(date || '2025-12-31'));
    request.input('_ProductId', sql.Int, parseInt(productId) || 0);
    request.input('_BranchCode', sql.VarChar(3), 'A01');
    request.input('_CurrencyCode0', sql.NChar(3), 'VND');
    request.input('_nUserId', sql.Int, 0);
    request.input('_LangId', sql.Int, 0);
    request.input('_IsHangMuc', sql.TinyInt, 1);
    request.input('_IsBCTC', sql.TinyInt, 1);
    request.input('_IsDetail', sql.TinyInt, 0);
    request.input('_DocCodeLstBudget', sql.NVarChar(192), 'CB,CS,ME,MS');
    request.input('_DocCodeLstContract', sql.NVarChar(192), 'PO,C3,C4,C5,C6');
    request.input('_DocCodeLstBill', sql.NVarChar(192), 'P1,P3,P6,P7');
    request.input('_DefinitionTableName', sql.NVarChar(32), 'B10KqtCCMBCTC');
    request.input('_ExpenseAccount', sql.NVarChar(192), '621,622,623,627,641,642,811');
    request.input('_ExcludedCrspAccount', sql.NVarChar(192), '911,154');
    request.input('_BizDocId_CPQL', sql.NVarChar(20), '01035208C1');

    const result = await request.execute('usp_CCM_BaoCaoTongHopThucHienNganSachCongTruong_HangMuc_KeToan');

    await sql.close();

    // Return first recordset (main report data)
    if (result.recordsets.length > 0) {
      res.json(result.recordsets[0]);
    } else {
      res.json([]);
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Budget summary by project
app.get('/api/budget-summary', async (req, res) => {
  try {
    await getConnection('Bravo_Data');

    const result = await sql.query(`
      SELECT
        b.ProductId,
        p.Name as ProductName,
        COUNT(*) as ItemCount,
        SUM(ISNULL(b.OriginalBudgetAmount, 0)) as TotalBudget,
        SUM(ISNULL(b.RevenueAmount, 0)) as TotalRevenue,
        SUM(ISNULL(b.ExpenseAmount, 0)) as TotalExpense,
        SUM(ISNULL(b.ProfitAmount0, 0)) as TotalProfit
      FROM B30BudgetCons b
      LEFT JOIN B20Product p ON b.ProductId = p.Id
      WHERE b.IsActive = 1 AND b.DocStatus = 4
      GROUP BY b.ProductId, p.Name
      ORDER BY TotalBudget DESC
    `);

    await sql.close();
    res.json(result.recordset);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ============ CUSTOM QUERY API ============

app.post('/api/query', async (req, res) => {
  try {
    const { database, query: rawQuery } = req.body;

    // Only allow SELECT queries
    if (!rawQuery.trim().toUpperCase().startsWith('SELECT')) {
      return res.status(400).json({ error: 'Only SELECT queries are allowed' });
    }

    await getConnection(database);
    const result = await sql.query(rawQuery);
    await sql.close();

    res.json({
      columns: result.recordset.columns ? Object.keys(result.recordset.columns) : [],
      data: result.recordset,
      rowCount: result.recordset.length
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ============ SCHEMA API ============

app.get('/api/schema/:database/:tableName', async (req, res) => {
  try {
    const { database, tableName } = req.params;
    await getConnection(database);

    const result = await sql.query(`
      SELECT
        c.COLUMN_NAME,
        c.DATA_TYPE,
        c.CHARACTER_MAXIMUM_LENGTH,
        c.NUMERIC_PRECISION,
        c.NUMERIC_SCALE,
        c.IS_NULLABLE,
        c.COLUMN_DEFAULT
      FROM INFORMATION_SCHEMA.COLUMNS c
      WHERE c.TABLE_NAME = '${tableName}'
      ORDER BY c.ORDINAL_POSITION
    `);

    await sql.close();
    res.json(result.recordset);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});



// ============ LAYOUT GENERATOR API ============

const layoutsDir = path.join(__dirname, '..', 'knowledge', 'layouts');

// List all forms grouped by category
app.get('/api/layout-forms', (req, res) => {
  try {
    const summaryPath = path.join(layoutsDir, '_form_summary.json');
    const summary = JSON.parse(fs.readFileSync(summaryPath, 'utf8'));
    const grouped = {};
    for (const [formName, data] of Object.entries(summary)) {
      const cat = data.category || 'Other';
      if (!grouped[cat]) grouped[cat] = [];
      grouped[cat].push({
        formName,
        layouts: data.layouts.filter(l => l !== '<DataSource>'),
        hasDataSource: data.layouts.includes('<DataSource>'),
        hasTemplate: data.hasTemplate
      });
    }
    for (const cat of Object.keys(grouped)) {
      grouped[cat].sort((a, b) => a.formName.localeCompare(b.formName));
    }
    res.json(grouped);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get raw XML
app.get('/api/layout-xml/:formName/:layoutName', (req, res) => {
  try {
    const { formName, layoutName } = req.params;
    const fileName = layoutName === '<DataSource>'
      ? formName + '__DataSource_.xml'
      : formName + '_' + layoutName + '.xml';
    const filePath = path.join(layoutsDir, fileName);
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'Layout not found' });
    }
    const xml = fs.readFileSync(filePath, 'utf8');
    res.type('application/xml').send(xml);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Parse DataSource XML
app.get('/api/layout-parse/:formName', (req, res) => {
  try {
    const { formName } = req.params;
    const dsFile = formName + '__DataSource_.xml';
    const dsPath = path.join(layoutsDir, dsFile);
    if (!fs.existsSync(dsPath)) {
      return res.status(404).json({ error: 'DataSource not found' });
    }
    const xml = fs.readFileSync(dsPath, 'utf8');

    const extract = (regex) => {
      const results = [];
      let m;
      while ((m = regex.exec(xml)) !== null) {
        if (!results.includes(m[1])) results.push(m[1]);
      }
      return [...new Set(results)];
    };

    const tables = extract(/<Name>([^$<]+)</Name>/g).filter(t => !t.startsWith('
app.use(express.static('public'));

// ============ START SERVER ============

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Report Server running at http://localhost:${PORT}`);
  console.log('Available routes:');
  console.log('  GET /api/test');
  console.log('  GET /api/dashboard');
  console.log('  GET /api/budget-report');
  console.log('  GET /api/budget-summary');
  console.log('  POST /api/query');
});
));
    const dataMembers = extract(/<DataMember>([^<]+)</DataMember>/g);
    const sources = extract(/<Source>([^$<]+)</Source>/g).filter(s => !s.startsWith('
app.use(express.static('public'));

// ============ START SERVER ============

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Report Server running at http://localhost:${PORT}`);
  console.log('Available routes:');
  console.log('  GET /api/test');
  console.log('  GET /api/dashboard');
  console.log('  GET /api/budget-report');
  console.log('  GET /api/budget-summary');
  console.log('  POST /api/query');
});
));
    const lookups = extract(/<LookupKey>([^<]+)</LookupKey>/g);
    const filters = extract(/<FilterKey>([^<]+)</FilterKey>/g).map(f => f.replace(/&lt;/g,'<').replace(/&gt;/g,'>'));

    res.json({
      formName, tables, dataMembers, sources, lookups, filters,
      xmlLength: xml.length
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Generate SQL + XML templates
app.post('/api/layout-generate', (req, res) => {
  try {
    const { formName, tableName } = req.body;
    const tbl = tableName || formName;

    const createSQL = `CREATE TABLE [${tbl}] (
  Id INT IDENTITY(1,1) PRIMARY KEY,
  BranchCode VARCHAR(3) NOT NULL,
  DocCode VARCHAR(10),
  DocDate DATE,
  DocNo VARCHAR(20),
  Description NVARCHAR(255),
  DocStatus TINYINT DEFAULT 0,
  IsActive BIT DEFAULT 1,
  IsCancelled BIT DEFAULT 0,
  CreatedBy INT,
  CreatedAt DATETIME DEFAULT GETDATE(),
  ModifiedBy INT,
  ModifiedAt DATETIME
);`;

    const layoutXml = `<?xml version="1.0" encoding="utf-8"?>
<root>
  <toolStrip1>
    <Items>
      <New />
      <_SEPARATOR_0 />
      <Edit />
      <_SEPARATOR_1 />
      <Save />
      <_SEPARATOR_2 />
      <Refresh />
    </Items>
  </toolStrip1>
  <panelExplorer>
    <Rows><Row_0><SizeType>Percent</SizeType><Height>100</Height></Row_0></Rows>
    <Controls>
      <BravoGridContainer>
        <Assembly>Bravo.DataExplorer</Assembly>
        <ClassName>BravoExplorerControl</ClassName>
        <DataMember>Ct</DataMember>
        <Rows><Row_0><Height>20</Height></Row_0></Rows>
        <Cols>
          <DocNo>
            <Width>120</Width>
            <Style>TextAlign:LeftTop;</Style>
            <Rows><Row_0><Text><Vietnamese>Số chứng từ</Vietnamese><English>Doc No.</English></Text></Row_0></Rows>
          </DocNo>
          <DocDate>
            <Width>100</Width>
            <Style>Format:"dd/MM/yyyy";</Style>
            <Rows><Row_0><Text><Vietnamese>Ngày</Vietnamese><English>Date</English></Text></Row_0></Rows>
          </DocDate>
          <Description>
            <Width>300</Width>
            <Style>TextAlign:LeftTop;</Style>
            <Rows><Row_0><Text><Vietnamese>Diễn giải</Vietnamese><English>Description</English></Text></Row_0></Rows>
          </Description>
        </Cols>
      </BravoGridContainer>
    </Controls>
  </panelExplorer>
</root>`;

    const dsXml = `<?xml version="1.0" encoding="utf-8"?>
<root>
  <TableCollection>
    <Ct>
      <Name>${tbl}</Name>
      <Columns>Ct.*</Columns>
      <Sort>DocDate DESC</Sort>
      <FilterKey>BranchCode='{=BRANCH()}' AND IsActive=1</FilterKey>
    </Ct>
  </TableCollection>
</root>`;

    res.json({ createSQL, layoutXml, dataSourceXml: dsXml, formName, tableName: tbl });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// ============ STATIC FILES ============
app.use(express.static('public'));

// ============ START SERVER ============

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Report Server running at http://localhost:${PORT}`);
  console.log('Available routes:');
  console.log('  GET /api/test');
  console.log('  GET /api/dashboard');
  console.log('  GET /api/budget-report');
  console.log('  GET /api/budget-summary');
  console.log('  POST /api/query');
});

# Bravo ERP Domain Model

## Entity Catalog

### Config (B00)
- Layout, LayoutData, LayoutDataEdit

### Accounting (B10)
- BalanceSheet (B10Kqt01), IncomeStatement (B10Kqt021), CashFlow (B10Kqt03), TrialBalance (B10Kqt04)

### Master Data (B20)
- Product, Customer, JobRCC, Employee, Item, Currency, Warehouse, ClassInfo

### Transaction (B30)
- BizDoc, BillDoc, AccDoc, BudgetCons, BudgetConsDetail

## Key Relationships
1. Master-Detail: Product -> BudgetCons -> BudgetConsDetail
2. Document Chain: BizDoc -> BillDoc -> AccDoc
3. Self-Referencing: ClassInfo.ParentId, JobRCC.ParentId
4. Reporting Hierarchy: _GroupOrder comma-separated tree

## Domain Invariants
1. Every transaction references exactly one Product
2. IsTitle flag determines title vs detail row
3. DocStatus: 1=draft, 2=active, 4=approved
4. IsActive=0 is soft delete
5. _GroupOrder max depth = 4 levels

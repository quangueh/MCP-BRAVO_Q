# Data Flow Mapping

## Flow 1: DB to UI (Read)
SQL Server -> SP/View/Table -> DataSource XML -> Layout XML DataMember -> UI Control

## Flow 2: UI to DB (Write)
User Input -> Layout Control binding -> DataSource Commands -> Expression eval -> SQL

## Flow 3: BLG Generation
Select Layout -> Parse XML -> Extract Metadata -> Analyze Schema -> Build Relations -> Generator Pipeline -> Preview -> Export

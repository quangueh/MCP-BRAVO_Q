# Use Case Map

## Actor-Use Case Matrix

| Use Case | S1 Dev | S2 Lead | S3 DBA | S4 QA | Priority |
|----------|--------|---------|--------|-------|----------|
| UC-01 Connect to Database | R | I | C | I | P0 |
| UC-02 Browse Layouts | R | R | - | R | P0 |
| UC-03 Search/Filter Layouts | R | R | - | R | P0 |
| UC-04 Analyze Layout | R | R | I | R | P0 |
| UC-05 Generate CREATE TABLE | R | R | C | R | P0 |
| UC-06 Generate Foreign Keys | R | R | C | R | P0 |
| UC-07 Generate Indexes | R | R | C | R | P1 |
| UC-08 Generate DataSource XML | R | R | - | R | P0 |
| UC-09 Generate Layout XML | R | R | - | R | P0 |
| UC-10 Generate Stored Procedure | R | R | C | R | P0 |
| UC-11 Generate View | R | R | C | R | P1 |
| UC-12 Generate Trigger | R | I | C | R | P2 |
| UC-13 Generate INSERT Scripts | R | R | C | R | P1 |
| UC-14 Generate SELECT Queries | R | R | - | R | P1 |
| UC-15 Generate CRUD Scripts | R | R | C | R | P0 |
| UC-16 Generate Relation Map | R | R | I | - | P0 |
| UC-17 Generate Metadata | R | R | - | - | P0 |
| UC-18 Preview Generated Output | R | R | R | R | P0 |
| UC-19 Compare with Existing | R | R | R | R | P1 |
| UC-20 Export to File | R | R | R | R | P0 |
| UC-21 Export to Clipboard | R | R | - | R | P1 |
| UC-22 Batch Generate | R | R | R | R | P1 |
| UC-23 Dry Run / Simulation | R | R | R | R | P1 |
| UC-24 Undo/Redo | R | - | - | - | P0 |
| UC-25 Rollback Generation | R | R | - | - | P1 |
| UC-26 View History | R | R | - | R | P1 |
| UC-27 Compare Versions | R | R | R | R | P1 |
| UC-28 Manage Templates | R | R | - | - | P2 |
| UC-29 Configure Settings | R | R | - | - | P1 |
| UC-30 View Documentation | R | R | - | R | P2 |
| UC-31 Validate Generated SQL | - | R | R | R | P1 |
| UC-32 Manage Plugins | R | R | - | - | P2 |
| UC-33 AI-Assisted Generation | R | I | - | - | P2 |
| UC-34 Import Existing Layout | R | R | - | R | P1 |

R = Responsible, A = Accountable (all A = S1), C = Consulted, I = Informed

## Core Use Case Flows

### UC-05: Generate CREATE TABLE

**Actor:** Bravo ERP Developer
**Precondition:** Connected to database, layout analyzed
**Postcondition:** Valid CREATE TABLE SQL generated

**Main Flow:**
1. Developer selects a layout from the list
2. Tool analyzes layout and identifies related tables
3. Developer clicks "Generate SQL"
4. Tool generates CREATE TABLE statements
5. Developer previews the SQL
6. Developer exports or copies to clipboard

**Alternative Flows:**
- 4a. Table already exists: Tool detects and offers ALTER vs CREATE
- 4b. Complex column types: Tool prompts for clarification
- 5a. Developer wants to modify: Edit inline before export

**Exception Flows:**
- E1. Database connection lost: Show error, offer retry
- E2. Layout has unrecognized elements: Log warning, skip

### UC-18: Preview Generated Output

**Actor:** Developer
**Precondition:** Generation completed
**Postcondition:** Output reviewed

**Main Flow:**
1. Generation completes
2. Tool displays output in tabbed view
3. Developer switches between SQL/XML/SP tabs
4. Developer reviews syntax highlighting
5. Developer clicks "Copy" or "Export"

**Alternative Flows:**
- 3a. Diff view: Compare with existing output
- 3b. Raw view: Show unformatted output

### UC-22: Batch Generate

**Actor:** Developer
**Precondition:** Multiple layouts selected
**Postcondition:** All outputs generated

**Main Flow:**
1. Developer selects multiple layouts (checkbox)
2. Developer selects output types
3. Tool generates progress indicator
4. Tool generates all outputs sequentially
5. Tool shows summary with success/failure per layout
6. Developer exports batch as ZIP

**Exception Flows:**
- 4a. One layout fails: Continue with others, report failures
- 4a. All fail: Show error summary with root cause

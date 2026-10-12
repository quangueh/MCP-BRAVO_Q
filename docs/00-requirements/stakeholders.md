# Stakeholder Analysis

## Stakeholder Map

| ID | Stakeholder | Role | Goal | Pain Point | Priority |
|----|------------|------|------|------------|----------|
| S1 | Bravo ERP Developer | Primary user | Create new layouts faster | Manual XML writing takes hours | P0 |
| S2 | Senior Developer / Tech Lead | Reviewer | Ensure quality of generated code | No standardization, tribal knowledge | P0 |
| S3 | Database Administrator | Supporting | Validate generated SQL | Manual review of SQL scripts | P1 |
| S4 | QA Tester | Supporting | Verify generated outputs work | No automated testing for XML/SQL | P1 |
| S5 | Project Manager | Observer | Track layout creation progress | No visibility into development velocity | P2 |
| S6 | New Developer | Learning | Learn Bravo patterns quickly | Steep learning curve, no documentation | P2 |

## Detailed Profiles

### S1: Bravo ERP Developer (PRIMARY)

**Responsibilities:**
- Create new Layout + DataSource XML for business forms
- Write stored procedures for data access
- Design database tables and relationships
- Maintain existing layouts

**Current Workflow (Manual):**
1. Receive business requirement
2. Analyze existing similar layouts (1-2 hours)
3. Design database tables (30 min - 1 hour)
4. Write CREATE TABLE SQL (30 min)
5. Write FK, Index SQL (30 min)
6. Write stored procedures (2-4 hours)
7. Write DataSource XML (1-2 hours)
8. Write Layout XML (2-4 hours)
9. Test and debug (2-4 hours)
10. Deploy (30 min)

**Total: 8-15 hours per new layout**

**Expected with BLG Tool:**
- Steps 5-9 reduced to minutes
- **Target: <30 minutes per new layout**

**Frustrations:**
- Repetitive XML boilerplate
- Remembering all column types and styles
- Copy-pasting from old layouts and modifying
- Forgetting FK relationships
- XML formatting errors

### S2: Senior Developer / Tech Lead

**Responsibilities:**
- Code review of generated outputs
- Architectural decisions
- Knowledge transfer

**Needs from BLG:**
- Consistent, standards-compliant output
- Diff/compare capabilities
- Batch generation for refactoring
- Export for version control

### S3: Database Administrator

**Responsibilities:**
- Validate SQL scripts before execution
- Monitor database performance
- Manage permissions

**Needs from BLG:**
- Ordered SQL scripts (tables before FKs)
- Index recommendations
- No destructive operations by default
- Rollback scripts

## User Personas

### Persona 1: "Minh" - Experienced Developer
- 5+ years with Bravo ERP
- Knows all patterns by heart
- Wants: Speed. Automate the boring parts.
- Tech level: Advanced

### Persona 2: "Hoa" - New Developer
- 6 months with Bravo ERP
- Still learning XML structure
- Wants: Guidance. Don't let me make mistakes.
- Tech level: Intermediate

### Persona 3: "Tuan" - Tech Lead
- Oversees team of 5 developers
- Reviews all generated code
- Wants: Consistency. Standards enforcement.
- Tech level: Expert

## Stakeholder Conflicts

| Conflict | Stakeholders | Resolution |
|----------|-------------|------------|
| Speed vs Quality | S1 wants fast, S2 wants review | Auto-review + quality scoring |
| Flexibility vs Standards | S1 wants custom, S2 wants standard | Template override with validation |
| Automation vs Control | S1 wants auto, S3 wants review | Dry-run + approval workflow |

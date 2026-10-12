# Risk Register

## Risk Matrix

| ID | Risk | Probability | Impact | Score | Mitigation | Owner |
|----|------|------------|--------|-------|------------|-------|
| R01 | XML format changes in Bravo updates | 3 | 5 | 15 | Version-aware parser, template updates | Dev |
| R02 | Complex SPs cannot be template-generated | 4 | 3 | 12 | Allow manual SP + auto-wrap | Dev |
| R03 | Generated XML has subtle formatting bugs | 4 | 4 | 16 | Snapshot testing against known-good XML | Dev |
| R04 | Performance degrades with 5,917 layouts | 2 | 3 | 6 | Virtual scrolling, lazy loading, caching | Dev |
| R05 | Database connection instability | 2 | 4 | 8 | Connection pooling, retry logic, offline cache | Dev |
| R06 | User rejects generated output quality | 3 | 4 | 12 | Configurable templates, manual override | Dev |
| R07 | Scope creep delays MVP | 4 | 5 | 20 | Strict P0-only for v1, defer P2 features | PM |
| R08 | Code signing certificate issues | 2 | 2 | 4 | Use self-signed for internal, purchase later | Dev |
| R09 | Node.js/mssql compatibility issues | 2 | 3 | 6 | Pin versions, test matrix | Dev |
| R10 | Loss of domain knowledge | 2 | 5 | 10 | Document all patterns in Phase 1-5 docs | Dev |

## Top 5 Risks (Score >= 12)

1. **R07 (20)** - Scope creep - Mitigation: Strict P0 focus for v1
2. **R03 (16)** - XML formatting bugs - Mitigation: Snapshot testing
3. **R01 (15)** - Format changes - Mitigation: Version-aware parser
4. **R02 (12)** - Complex SPs - Mitigation: Manual SP support
5. **R06 (12)** - Output quality - Mitigation: Configurable templates

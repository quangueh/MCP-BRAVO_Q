# Non-Functional Requirements

## Performance

| ID | Requirement | Target | Measurement |
|----|-------------|--------|-------------|
| NFR-P01 | Layout analysis time | <5 seconds (p95) | Time from click to metadata displayed |
| NFR-P02 | Single layout generation | <10 seconds (p95) | Time from click to all outputs ready |
| NFR-P03 | Batch generation (10 layouts) | <60 seconds | Total batch processing time |
| NFR-P04 | UI initial load | <3 seconds | Time from launch to interactive |
| NFR-P05 | Search response | <200ms | Time from keystroke to results |
| NFR-P06 | Preview load | <500ms | Time from tab click to rendered |
| NFR-P07 | Memory usage | <500MB | Peak working set during normal use |
| NFR-P08 | Database query time | <1 second | Schema query execution time |

## Scalability

| ID | Requirement | Target |
|----|-------------|--------|
| NFR-S01 | Layout count | 10,000+ layouts without degradation |
| NFR-S02 | Table schema count | 500+ tables without degradation |
| NFR-S03 | Concurrent generation | 1 generation at a time (single user) |
| NFR-S04 | History entries | 1,000+ entries with pagination |
| NFR-S05 | Generated file size | Handle outputs up to 10MB |

## Usability

| ID | Requirement | Target |
|----|-------------|--------|
| NFR-U01 | Time to first generation | <5 minutes from install |
| NFR-U02 | Learning curve | Basic use without documentation |
| NFR-U03 | Minimum window size | 1280x720 |
| NFR-U04 | Theme support | Dark mode + Light mode |
| NFR-U05 | Keyboard shortcuts | All primary actions have shortcuts |
| NFR-U06 | Accessibility | WCAG 2.1 AA contrast ratios |

## Reliability

| ID | Requirement | Target |
|----|-------------|--------|
| NFR-R01 | Uptime | No crashes during normal use |
| NFR-R02 | Error recovery | App recovers from errors without restart |
| NFR-R03 | Data integrity | No data loss during generation |
| NFR-R04 | Auto-save | State preserved every 30 seconds |
| NFR-R05 | Graceful degradation | Works offline for cached data |

## Security

| ID | Requirement | Target |
|----|-------------|--------|
| NFR-SEC01 | Database access | Read-only, no write operations |
| NFR-SEC02 | Credential storage | Encrypted in local config |
| NFR-SEC03 | No PII in logs | Sensitive data masked |
| NFR-SEC04 | SQL injection | All queries parameterized |
| NFR-SEC05 | File system access | Only output directory written to |

## Maintainability

| ID | Requirement | Target |
|----|-------------|--------|
| NFR-M01 | Code coverage | >80% unit test coverage |
| NFR-M02 | Module independence | No circular dependencies |
| NFR-M03 | Documentation | All public APIs documented |
| NFR-M04 | Configuration | All behavior configurable |
| NFR-M05 | Logging | All operations logged with context |

# Code Audit: server.js

## Reusable
- Database connection, dashboard queries, transaction listing

## Issues
- Hardcoded credentials, no pooling, no error boundary

## Recommendation: Refactor DB, rewrite routes, reuse queries

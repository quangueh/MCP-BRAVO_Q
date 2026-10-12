# Layout XML Import

## Process

1. Read file (`fs.readFile` or clipboard)
2. Detect encoding (UTF-8, UTF-16)
3. Parse XML (xml2js)
4. Detect layout type from panel structure
5. Extract controls, columns, bindings
6. Extract styles
7. Build LayoutMetadata
8. Validate against schema
9. Store in layout cache
10. Return imported metadata with warnings

## Error Handling

| Error | Action |
|---|---|
| Malformed XML | Suggest fix |
| Missing elements | Use defaults |

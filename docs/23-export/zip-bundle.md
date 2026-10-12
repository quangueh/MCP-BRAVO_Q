# ZIP Bundle Export

## Structure

```
{LayoutName}/
├── sql/          # All SQL files ordered
├── xml/          # DataSource and Layout XML
├── sp/           # Stored procedures
├── docs/         # Metadata JSON and documentation
└── README.md     # Generation summary
```

## Naming

- `{LayoutName}_{date}.zip`

## Limits

- Max size: warn if >50MB

## Compression

- Deflate (default)

## Dependencies

- adm-zip library (already installed)

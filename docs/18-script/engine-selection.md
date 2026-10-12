# Template Engine Selection

## Chosen: EJS (Embedded JavaScript)

## Rationale

| Criteria              | EJS           |
|-----------------------|---------------|
| Syntax simplicity     | Excellent — uses plain JS |
| Familiarity           | High — standard JS developers |
| Performance           | Good — compiles to JS functions |
| Includes/Partials     | Supported via `<%- include() %>` |
| Learning curve        | Low           |
| Template size         | Small (no extra runtime) |

## Alternatives Considered

| Engine      | Reason Rejected                          |
|-------------|------------------------------------------|
| Handlebars  | More verbose syntax, separate logic concerns |
| Nunjucks    | Python-oriented community, heavier runtime |
| Mustache    | Too limited — no conditionals or loops   |

## EJS Syntax Reference

```
<% code %>          — execute JavaScript (no output)
<%= expr %>         — output escaped value
<%- expr %>         — output raw (unescaped) value
<%- include() %>    — include partial template
<%# comment %>      — template comment (not rendered)
```

## Configuration

```json
{
  "ejs": {
    "pretty": true,
    "rmWhitespace": false
  }
}
```

`pretty: true` ensures readable generated output with proper indentation.
`rmWhitespace: false` preserves template whitespace for predictable formatting.

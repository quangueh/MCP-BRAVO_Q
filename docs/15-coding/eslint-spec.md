# ESLint Rules

## Base Configuration

```json
{
  "extends": [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended"
  ]
}
```

## Key Rules

| Rule                           | Level   |
|--------------------------------|---------|
| `no-console`                   | warn (prod: error) |
| `no-unused-vars`               | error   |
| `consistent-return`            | error   |
| `prefer-const`                 | error   |
| `no-var`                       | error   |
| `eqeqeq`                       | error   |
| `no-eval`                      | error   |
| `@typescript-eslint/no-explicit-any` | warn |

## File Limits

| Rule                      | Limit |
|---------------------------|-------|
| `max-lines`               | 300   |
| `max-lines-per-function`  | 50    |
| `max-depth`               | 4     |
| `max-nesting-depth`       | 3     |

## Import Ordering

```
1. external   (node built-ins, npm packages)
2. internal   (@shared/*, @engines/*, @components/*)
3. parent     (../...)
4. sibling    (./...)
```

Use `eslint-plugin-simple-import-sort` or `eslint-plugin-import` with custom groups to enforce.

## Example `.eslintrc.json`

```json
{
  "extends": [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended"
  ],
  "rules": {
    "no-console": "warn",
    "no-unused-vars": "error",
    "consistent-return": "error",
    "prefer-const": "error",
    "no-var": "error",
    "eqeqeq": "error",
    "no-eval": "error",
    "@typescript-eslint/no-explicit-any": "warn",
    "max-lines": ["error", { "max": 300 }],
    "max-lines-per-function": ["error", { "max": 50 }],
    "max-depth": ["error", { "max": 4 }],
    "max-nesting-depth": ["error", { "max": 3 }]
  }
}
```

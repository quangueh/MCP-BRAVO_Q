# TypeScript Configuration

## Strict Settings

```json
{
  "strict": true,
  "noImplicitAny": true,
  "strictNullChecks": true,
  "noUnusedLocals": true,
  "noUnusedParameters": true,
  "exactOptionalPropertyTypes": false
}
```

`exactOptionalPropertyTypes` is disabled — too strict for rapid development and causes friction with optional config objects.

## Module & Target

```json
{
  "module": "ESNext",
  "target": "ES2020",
  "lib": ["ES2020", "DOM"]
}
```

## Path Aliases

```json
{
  "paths": {
    "@shared/*": ["src/shared/*"],
    "@engines/*": ["src/engines/*"],
    "@components/*": ["src/components/*"]
  }
}
```

## Include / Exclude

```json
{
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist", "tests"]
}
```

## Complete tsconfig.json

```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "exactOptionalPropertyTypes": false,
    "module": "ESNext",
    "target": "ES2020",
    "lib": ["ES2020", "DOM"],
    "moduleResolution": "bundler",
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "resolveJsonModule": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "outDir": "./dist",
    "rootDir": "./src",
    "baseUrl": "./src",
    "paths": {
      "@shared/*": ["shared/*"],
      "@engines/*": ["engines/*"],
      "@components/*": ["components/*"]
    }
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist", "tests"]
}
```

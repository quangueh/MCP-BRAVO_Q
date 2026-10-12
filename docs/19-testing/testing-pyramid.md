# Testing Pyramid

## Distribution

```
         /\
        / E2E \        10%
       /-------\
      / Integr. \      20%
     /-----------\
    /    Unit     \    70%
   /_______________\
```

## Layer Details

| Layer       | Coverage Target | Speed       | Tool         |
|-------------|-----------------|-------------|--------------|
| Unit        | 70%             | < 1ms each  | Vitest       |
| Integration | 20%             | < 5s each   | Vitest       |
| E2E         | 10%             | < 30s each  | Playwright   |

## Unit Tests (70%)

- Test individual functions and classes in isolation
- Mock all external dependencies (DB, file system, XML parser)
- Run on every commit
- Fast feedback loop

## Integration Tests (20%)

- Test module interactions (parser -> generator, metadata -> SQL)
- Use cached/frozen schema data (no live DB)
- Run on every pull request
- Validate cross-module contracts

## E2E Tests (10%)

- Full generation flow: layout XML in -> all outputs out
- Test the complete pipeline
- Run before release / in CI nightly
- Validate real-world scenarios

## CI Schedule

```
Every commit:   Unit tests
Every PR:       Unit + Integration tests
Pre-release:    Unit + Integration + E2E tests
```

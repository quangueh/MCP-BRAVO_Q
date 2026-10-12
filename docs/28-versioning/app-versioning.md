# Application Versioning

## Standard

semver (MAJOR.MINOR.PATCH)

## Version Meaning

| Type | Meaning | Example |
|---|---|---|
| MAJOR | Breaking changes (new XML format, removed features) | 2.0.0 |
| MINOR | New features (new generator, new export format) | 1.1.0 |
| PATCH | Bug fixes | 1.0.1 |

## Pre-release

- `alpha.0` - Early development
- `beta.0` - Feature complete, testing
- `rc.0` - Release candidate

## Current Version

- `1.0.0-alpha.0` (pre-development)

## Version Storage

- `package.json`
- Shown in About screen

## Changelog

- Auto-generated from conventional commits

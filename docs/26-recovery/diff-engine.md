# Diff Engine Specification

## SQL Diff

- Line-by-line comparison using diff library
- Highlight: green (added), red (removed), yellow (changed)

## XML Diff

- Node-by-node comparison (fast-xml-parser)
- Highlight: attribute changes, child node changes

## UI

- Side-by-side panels with synchronized scrolling
- Navigation: next/previous change buttons
- Merge: accept left/right for each change block

## Performance

- Handle files up to 10MB

# Generation Cache Strategy

## Cache Key

- Layout hash + template version + options hash (content-addressable)

## Contents

- Generated outputs (SQL, XML, SP)

## Hit Rate Target

- >70% for repeated generations

## Invalidation

- Template update
- Options change
- Schema change

## Storage

- File-based in `cache/gen-{hash}/` directories

## Limits

- Max 500 cached generations
- Oldest evicted when full

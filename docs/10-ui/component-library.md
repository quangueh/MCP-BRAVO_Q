# Component Library

## Overview

20 reusable components for the Bravo Layout Generator UI. All components follow the design tokens and support dark/light themes.

---

## 1. Button

**Variants:** primary, secondary, ghost, danger

| Prop | Type | Default | Description |
|---|---|---|---|
| variant | string | primary | Visual style variant |
| size | string | md | sm, md, lg |
| icon | ReactNode | - | Icon element |
| iconPosition | string | left | left, right |
| loading | boolean | false | Shows spinner |
| disabled | boolean | false | Disabled state |
| fullWidth | boolean | false | Full width |

**Usage:** `<Button variant="primary" icon={<SaveIcon />}>Save</Button>`

---

## 2. Input

**Variants:** text, number, date, search

| Prop | Type | Default | Description |
|---|---|---|---|
| type | string | text | Input type |
| label | string | - | Label text |
| placeholder | string | - | Placeholder text |
| value | string | - | Controlled value |
| error | string | - | Error message |
| disabled | boolean | false | Disabled state |
| required | boolean | false | Required indicator |

**Usage:** `<Input type="search" placeholder="Search layouts..." />`

---

## 3. Select

**Variants:** single, multi, with search

| Prop | Type | Default | Description |
|---|---|---|---|
| options | Option[] | - | Array of {value, label} |
| value | any | - | Selected value(s) |
| multiple | boolean | false | Multi-select mode |
| searchable | boolean | false | Enable search |
| placeholder | string | Select... | Placeholder text |

**Usage:** `<Select options={types} searchable placeholder="Filter by type" />`

---

## 4. Card

**Variants:** stat, info, action

| Prop | Type | Default | Description |
|---|---|---|---|
| variant | string | info | Card variant |
| title | string | - | Card title |
| icon | ReactNode | - | Header icon |
| value | string/number | - | Stat value (stat variant) |
| trend | object | - | {direction, percentage} (stat variant) |
| actions | Action[] | - | Action buttons (action variant) |

---

## 5. Table

**Features:** sort, filter, pagination, row selection

| Prop | Type | Default | Description |
|---|---|---|---|
| columns | Column[] | - | Column definitions |
| data | object[] | - | Row data |
| sortable | boolean | true | Enable sorting |
| selectable | boolean | false | Row checkboxes |
| pageSize | number | 20 | Rows per page |
| onRowClick | function | - | Row click handler |

---

## 6. Tabs

**Variants:** horizontal, vertical

| Prop | Type | Default | Description |
|---|---|---|---|
| tabs | Tab[] | - | Array of {id, label, content} |
| activeTab | string | - | Active tab id |
| onChange | function | - | Tab change handler |
| variant | string | horizontal | horizontal, vertical |

---

## 7. Modal

**Variants:** dialog, drawer

| Prop | Type | Default | Description |
|---|---|---|---|
| variant | string | dialog | dialog, drawer |
| title | string | - | Modal title |
| open | boolean | false | Visibility |
| onClose | function | - | Close handler |
| size | string | md | sm, md, lg, xl |
| closeOnOverlay | boolean | true | Close on backdrop click |

---

## 8. Toast

**Variants:** success, error, warning, info

| Prop | Type | Default | Description |
|---|---|---|---|
| variant | string | info | Toast type |
| message | string | - | Toast message |
| duration | number | 3000 | Auto-dismiss (ms) |
| dismissible | boolean | true | Manual dismiss |

---

## 9. Badge

**Variants:** status, count

| Prop | Type | Default | Description |
|---|---|---|---|
| variant | string | status | status, count |
| color | string | default | default, success, warning, error |
| value | number/string | - | Badge content |

---

## 10. Spinner

| Prop | Type | Default | Description |
|---|---|---|---|
| size | string | md | sm, md, lg |
| color | string | primary | primary, secondary |

---

## 11. Progress

**Variants:** bar, circle

| Prop | Type | Default | Description |
|---|---|---|---|
| variant | string | bar | bar, circle |
| value | number | 0 | Progress percentage (0-100) |
| label | string | - | Progress text |
| animated | boolean | true | Animate fill |

---

## 12. CodeBlock

**Features:** syntax highlighting, line numbers, copy button

| Prop | Type | Default | Description |
|---|---|---|---|
| code | string | - | Code content |
| language | string | sql | sql, xml, javascript, typescript |
| showLineNumbers | boolean | true | Show line numbers |
| showCopyButton | boolean | true | Show copy button |
| maxHeight | string | 400px | Max height with scroll |

---

## 13. DiffView

**Features:** side-by-side comparison, syntax highlighting

| Prop | Type | Default | Description |
|---|---|---|---|
| left | string | - | Left content |
| right | string | - | Right content |
| language | string | sql | Syntax language |
| leftLabel | string | Existing | Left panel label |
| rightLabel | string | Generated | Right panel label |

---

## 14. TreeView

**Features:** expand/collapse, selection, icons

| Prop | Type | Default | Description |
|---|---|---|---|
| data | TreeNode[] | - | Tree data |
| onSelect | function | - | Selection handler |
| defaultExpanded | string[] | - | Initially expanded nodes |
| showIcons | boolean | true | Show node icons |

---

## 15. Tooltip

| Prop | Type | Default | Description |
|---|---|---|---|
| content | string/ReactNode | - | Tooltip content |
| position | string | top | top, bottom, left, right |
| delay | number | 200 | Show delay (ms) |

---

## 16. Sidebar

| Prop | Type | Default | Description |
|---|---|---|---|
| items | NavItem[] | - | Navigation items |
| collapsed | boolean | false | Collapsed state |
| onToggle | function | - | Toggle handler |
| activePath | string | - | Current active path |

---

## 17. Header

| Prop | Type | Default | Description |
|---|---|---|---|
| title | string | - | Page title |
| breadcrumbs | Breadcrumb[] | - | Breadcrumb items |
| actions | ReactNode | - | Right-side action buttons |

---

## 18. Breadcrumb

| Prop | Type | Default | Description |
|---|---|---|---|
| items | BreadcrumbItem[] | - | Array of {label, path} |
| separator | string | / | Separator character |

---

## 19. Pagination

| Prop | Type | Default | Description |
|---|---|---|---|
| currentPage | number | 1 | Current page |
| totalPages | number | - | Total pages |
| pageSize | number | 20 | Items per page |
| onPageChange | function | - | Page change handler |
| showSizeChanger | boolean | false | Show page size selector |

---

## 20. EmptyState

| Prop | Type | Default | Description |
|---|---|---|---|
| icon | ReactNode | - | Illustration icon |
| title | string | - | Main message |
| description | string | - | Secondary message |
| action | Action | - | CTA button |

**Usage:** `<EmptyState title="No layouts found" description="Try adjusting your filters" action={{label: "Clear Filters", onClick: clearFilters}} />`

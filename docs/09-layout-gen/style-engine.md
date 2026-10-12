# Style Engine

## Priority-Based Rule Resolution

The style engine resolves styles using a priority chain. When multiple rules apply to the same column, the highest priority rule wins.

| Priority | Source | Description |
|---|---|---|
| 1 (highest) | User Custom Style | Explicitly set by user in metadata or config |
| 2 | Column Type Style | Based on SQL data type (MONEY, DATE, etc.) |
| 3 | Business Rule Style | Based on column name patterns (e.g., "Code" columns) |
| 4 (lowest) | Default Style | Fallback when no other rule matches |

### Resolution Algorithm

```
function resolveStyle(column, userStyles, typeStyles, businessRules):
    // Priority 1: Check user custom styles
    if userStyles.has(column.name):
        return userStyles.get(column.name)
    
    // Priority 2: Check column type styles
    typeKey = column.sqlType + (column.precision ? `(${column.precision})` : '')
    if typeStyles.has(typeKey):
        return typeStyles.get(typeKey)
    
    // Priority 3: Check business rules
    for rule in businessRules:
        if rule.matches(column):
            return rule.style
    
    // Priority 4: Default style
    return getDefaultStyle()
```

---

## Style Rules by Column Type

### Money Columns (MONEY, DECIMAL, numeric with precision > 0)

```
Style:      RightTop
Format:     "N2" (thousands separator, 2 decimal places)
Width:      120px
BackColor:  (none, inherits alternating row)
ForeColor:  (none, inherits)
Alignment:  Right, Top
```

Example columns: `Amount`, `Price`, `Total`, `Balance`, `Budget`

### Text Columns (VARCHAR, NVARCHAR)

```
Style:      LeftTop
Format:     (none)
Width:      varies by max length (see width calculation)
BackColor:  (none)
ForeColor:  (none)
Alignment:  Left, Top
WordWrap:   False (True for Length > 500)
```

Width by length:
| MaxLength | Width |
|---|---|
| <= 20 | 80px |
| <= 50 | 120px |
| <= 100 | 180px |
| <= 200 | 250px |
| <= 500 | 300px |
| > 500 | 350px, WordWrap=True |

### Date Columns (DATE, DATETIME, DATETIME2)

```
Style:      CenterTop
Format:     "dd/MM/yyyy" (editor), "dd/MM/yy" (explorer grid)
Width:      100px (explorer), 150px (editor)
BackColor:  (none)
ForeColor:  (none)
Alignment:  Center, Top
```

### Boolean Columns (BIT)

```
Style:      CenterTop
Format:     (none)
Width:      60px
BackColor:  (none)
ForeColor:  (none)
Alignment:  Center, Top
```

### Integer Columns (INT, non-money)

```
Style:      RightTop
Format:     "N0" (thousands separator, no decimals)
Width:      80px
BackColor:  (none)
ForeColor:  (none)
Alignment:  Right, Top
```

---

## Header Styles

### Default Header

```
BackColor:  Navy (#000080)
ForeColor:  White (#FFFFFF)
Font:       Bold, Segoe UI, 9pt
Alignment:  Center, Middle
Height:     28px
```

### Group Header (for grouped reports)

```
BackColor:  LightSteelBlue (#B0C4DE)
ForeColor:  Black (#000000)
Font:       Bold, Segoe UI, 9pt
Alignment:  Left, Middle
Height:     24px
```

---

## Row Styles

### Normal Row

```
BackColor:  White (#FFFFFF)
ForeColor:  Black (#000000)
Font:       Regular, Segoe UI, 9pt
Height:     22px
```

### Alternating Row

```
BackColor:  WhiteSmoke (#F5F5F5)
ForeColor:  Black (#000000)
Font:       Regular, Segoe UI, 9pt
Height:     22px
```

### Summary Row

```
BackColor:  LightYellow (#FFFFE0)
ForeColor:  Black (#000000)
Font:       Bold, Segoe UI, 9pt
Height:     24px
```

---

## Conditional Styles

### Error/Warning Conditional

```
ForeColor:  Red (#FF0000)
Font:       Bold, Segoe UI, 9pt
Trigger:    Column value validation fails
```

### Negative Number Conditional

```
ForeColor:  Red (#FF0000)
Trigger:    Numeric column value < 0
```

### Over-Budget Conditional

```
ForeColor:  Red (#FF0000)
BackColor:  LightPink (#FFB6C1)
Trigger:    ActualAmount > BudgetAmount
```

---

## Width Calculation Formula

For columns without explicit width rules:

```
width = (characterCount * 8) + padding

Where:
    characterCount = column typical display length
    padding = 24px (for cell padding + sort indicator)
    
Minimum width = 50px
Maximum width = 500px
```

Example:
- Column "Code" with typical content "KH001" (5 chars)
  - width = (5 * 8) + 24 = 64px -> round to 80px minimum
- Column "Name" with typical content "Cong ty TNHH ABC" (16 chars)
  - width = (16 * 8) + 24 = 152px -> round to 160px

---

## Style Resolution Example

Given column `Amount` of type `DECIMAL(18,2)`:

1. Check user custom styles for "Amount" -> Not found
2. Check column type style for "DECIMAL(18,2)" -> Match: RightTop, N2, width 120
3. Return: `{ alignment: "RightTop", format: "N2", width: 120 }`

Given column `CustomerCode` of type `NVARCHAR(50)`:

1. Check user custom styles for "CustomerCode" -> Not found
2. Check column type style for "NVARCHAR(50)" -> Match: LeftTop, width based on length
3. Check business rules: "Code" pattern -> width override to 120
4. Return: `{ alignment: "LeftTop", format: null, width: 120 }`

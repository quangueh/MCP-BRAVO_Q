# Style Mapping Rules

## Overview

This document defines the visual style rules applied to columns and cells in Bravo ERP layouts. Styles control colors, fonts, alignment, and formatting of grid cells, headers, and controls.

---

## Number Column Styles

| Column Type | TextAlign | Format | ForeColor | Example |
|---|---|---|---|---|
| INT | RightTop | N0 | Black | 1,234 |
| BIGINT | RightTop | N0 | Black | 1,234,567 |
| DECIMAL(18,2) | RightTop | N2 | Black | 1,234.56 |
| DECIMAL(18,4) | RightTop | N4 | Black | 1.2345 |
| MONEY | RightTop | N2 | Black | 1,234.56 |
| Negative amounts | RightTop | N2 | Red | -1,234.56 |

```xml
<Style>
    <TextAlign>RightTop</TextAlign>
    <Format>N2</Format>
    <BackColor>White</BackColor>
    <ForeColor>Black</ForeColor>
</Style>
```

---

## Text Column Styles

| Column Type | TextAlign | WordWrap | ForeColor |
|---|---|---|---|
| VARCHAR | LeftTop | False | Black |
| NVARCHAR | LeftTop | True (if > 100 chars) | Black |

```xml
<Style>
    <TextAlign>LeftTop</TextAlign>
    <BackColor>White</BackColor>
    <ForeColor>Black</ForeColor>
</Style>
```

---

## Date Column Styles

| Column Type | TextAlign | Format | ForeColor |
|---|---|---|---|
| DATE | CenterTop | dd/MM/yy | Black |
| DATETIME | CenterTop | dd/MM/yyyy HH:mm | Black |

```xml
<Style>
    <TextAlign>CenterTop</TextAlign>
    <Format>dd/MM/yy</Format>
    <BackColor>White</BackColor>
    <ForeColor>Black</ForeColor>
</Style>
```

---

## Boolean Column Styles

| Column Type | TextAlign | Width | ForeColor |
|---|---|---|---|
| BIT | CenterTop | 60 | Black |

```xml
<Style>
    <TextAlign>CenterTop</TextAlign>
    <BackColor>White</BackColor>
    <ForeColor>Black</ForeColor>
</Style>
```

---

## Header Style

All column headers share a consistent style:

```xml
<HeaderStyle>
    <BackColor>Navy</BackColor>
    <ForeColor>White</ForeColor>
    <Font>,11pt,style=Bold</Font>
    <TextAlign>CenterMiddle</TextAlign>
</HeaderStyle>
```

| Property | Value | Description |
|---|---|---|
| BackColor | Navy | Dark blue background |
| ForeColor | White | White text |
| Font | ,11pt,style=Bold | Bold 11pt font |
| TextAlign | CenterMiddle | Centered both horizontally and vertically |

---

## Detail/Row Styles

### Normal Row

```xml
<Style>
    <BackColor>White</BackColor>
    <ForeColor>Black</ForeColor>
</Style>
```

### Alternating Row

```xml
<AlternatingStyle>
    <BackColor>WhiteSmoke</BackColor>
    <ForeColor>Black</ForeColor>
</AlternatingStyle>
```

### Selected Row

```xml
<SelectedStyle>
    <BackColor>Highlight</BackColor>
    <ForeColor>White</ForeColor>
</SelectedStyle>
```

---

## Status-Dependent Styles

### Error (Red)

Applied when validation fails or document is rejected.

```xml
<Style>
    <ForeColor>Red</ForeColor>
    <Font>,10pt,style=Bold</Font>
</Style>
```

### Warning (Orange)

Applied for warnings and pending items.

```xml
<Style>
    <ForeColor>Orange</ForeColor>
</Style>
```

### Info (Blue)

Applied for informational highlights.

```xml
<Style>
    <ForeColor>Blue</ForeColor>
</Style>
```

---

## DocStatus Color Mapping

| Status | Value | ForeColor | BackColor | Description |
|---|---|---|---|---|
| Draft | 1 | Gray | White | Editable, not submitted |
| Active | 2 | Black | White | Submitted |
| Pending | 3 | Orange | LightYellow | Awaiting approval |
| Approved | 4 | Green | LightGreen | Approved |
| Rejected | 5 | Red | LightCoral | Rejected |
| Closed | 6 | DarkGray | WhiteSmoke | Completed |
| Cancelled | 9 | Red | White | Voided |

---

## Style Application Rules

1. **Column-level style** overrides table-level style
2. **HeaderStyle** is the same for all columns
3. **AlternatingStyle** applies to even-numbered rows
4. **Status-dependent styles** override normal cell styles
5. **Read-only cells** use standard styles
6. **Editable cells** in editor mode have a light yellow background

---

## Summary Table

| Element | BackColor | ForeColor | Font | TextAlign |
|---|---|---|---|---|
| Header | Navy | White | 11pt Bold | CenterMiddle |
| Normal Row | White | Black | Default | - |
| Alternating Row | WhiteSmoke | Black | Default | - |
| Number Cell | White | Black | Default | RightTop |
| Text Cell | White | Black | Default | LeftTop |
| Date Cell | White | Black | Default | CenterTop |
| Error Cell | White | Red | Bold | - |
| Selected Row | Highlight | White | Default | - |
| Footer (Sum) | Navy | White | 11pt Bold | RightTop |

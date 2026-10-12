# Column Mapping Rules

## Overview

This document defines the rules for mapping database column types to XML grid column definitions. These rules are used by BLG to auto-generate column definitions in layout XML.

---

## Database Type to XML Mapping

### Integer Types

| DB Type | Width | TextAlign | Format | Visible | Notes |
|---|---|---|---|---|---|
| INT | 80 | RightTop | N0 | Yes | Standard integer display |
| INT (FK) | 80 | RightTop | N0 | Yes | Show alongside lookup display column |
| BIGINT | 100 | RightTop | N0 | Yes | Wider for large numbers |
| SMALLINT | 60 | RightTop | N0 | Yes | Narrower for small numbers |
| TINYINT | 50 | RightTop | N0 | Yes | Narrowest for tiny numbers |
| BIT | 60 | CenterTop | - | Yes | Checkbox display |

### Decimal/Money Types

| DB Type | Width | TextAlign | Format | Visible | Notes |
|---|---|---|---|---|---|
| DECIMAL(18,2) | 120 | RightTop | N2 | Yes | Standard money display |
| DECIMAL(18,4) | 120 | RightTop | N4 | Yes | High-precision quantity |
| DECIMAL(18,6) | 130 | RightTop | N6 | Yes | Exchange rate display |
| MONEY | 120 | RightTop | N2 | Yes | Legacy money type |
| SMALLMONEY | 100 | RightTop | N2 | Yes | Legacy small money |

### String Types

| DB Type | Width | TextAlign | Format | WordWrap | Visible | Notes |
|---|---|---|---|---|---|---|
| VARCHAR(50) | 150 | LeftTop | - | False | Yes | Code columns |
| VARCHAR(100) | 200 | LeftTop | - | False | Yes | Email, phone |
| VARCHAR(20) | 100 | LeftTop | - | False | Yes | Tax code, short code |
| NVARCHAR(255) | 250 | LeftTop | - | True | Yes | Name columns |
| NVARCHAR(500) | 300 | LeftTop | - | True | Yes | Address, description |
| NVARCHAR(MAX) | 300 | LeftTop | - | True | Yes | Notes, remarks |
| TEXT | 300 | LeftTop | - | True | Yes | Legacy text |

### Date/Time Types

| DB Type | Width | TextAlign | Format | Visible | Notes |
|---|---|---|---|---|---|
| DATE | 100 | CenterTop | dd/MM/yy | Yes | Date only |
| DATETIME | 150 | CenterTop | dd/MM/yyyy HH:mm | Yes | Date with time |
| DATETIME2 | 150 | CenterTop | dd/MM/yyyy HH:mm:ss | Yes | High-precision datetime |
| SMALLDATETIME | 130 | CenterTop | dd/MM/yyyy HH:mm | Yes | Legacy datetime |

---

## Special Column Mappings

### Audit Columns (Hidden by Default)

| Column | Width | TextAlign | Format | Visible |
|---|---|---|---|---|
| Id | 80 | RightTop | N0 | False |
| IsActive | 60 | CenterTop | - | False |
| CreatedBy | 100 | LeftTop | - | False |
| CreatedDate | 130 | CenterTop | dd/MM/yyyy HH:mm | False |
| ModifiedBy | 100 | LeftTop | - | False |
| ModifiedDate | 130 | CenterTop | dd/MM/yyyy HH:mm | False |

### Status Columns

| Column | Width | TextAlign | Format | Visible | Notes |
|---|---|---|---|---|---|
| DocStatus | 80 | CenterTop | - | Yes | Show numeric status |
| StatusText | 100 | CenterTop | - | Yes | Show descriptive text |

---

## Column Order in Grid

Columns should be ordered as follows:

1. **Code** (if exists) - always first
2. **Name/Description** (if exists) - second
3. **Business columns** - ordered by importance
4. **Amount/Quantity columns** - grouped together
5. **Status columns** - near the end
6. **Audit columns** - hidden, at the end

---

## XML Output Format

### Standard Column

```xml
<Col Name="colCode" Header="">
    <Header>
        <Vietnamese>Ma</Vietnamese>
        <English>Code</English>
    </Header>
    <DataMember>Code</DataMember>
    <Width>150</Width>
    <TextAlign>LeftTop</TextAlign>
    <Visible>True</Visible>
    <ReadOnly>True</ReadOnly>
    <Style>
        <BackColor>White</BackColor>
        <ForeColor>Black</ForeColor>
    </Style>
    <HeaderStyle>
        <BackColor>Navy</BackColor>
        <ForeColor>White</ForeColor>
        <Font>,11pt,style=Bold</Font>
    </HeaderStyle>
</Col>
```

### Amount Column with Sum

```xml
<Col Name="colAmount" Header="">
    <Header>
        <Vietnamese>So tien</Vietnamese>
        <English>Amount</English>
    </Header>
    <DataMember>Amount</DataMember>
    <Width>120</Width>
    <TextAlign>RightTop</TextAlign>
    <Format>N2</Format>
    <Visible>True</Visible>
    <ReadOnly>True</ReadOnly>
    <SumColumns>Amount</SumColumns>
</Col>
```

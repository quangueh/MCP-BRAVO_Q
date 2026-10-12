# XML Template Library

## Template Inventory

| #  | Template            | File                 | Description                       |
|----|---------------------|----------------------|-----------------------------------|
| 1  | explorer-root       | `explorer-root.ejs`  | Root structure for Explorer layout |
| 2  | editor-root         | `editor-root.ejs`    | Root structure for Editor layout   |
| 3  | report-root         | `report-root.ejs`    | Root structure for Report layout   |
| 4  | datasource-root     | `datasource-root.ejs`| DataSource XML root               |
| 5  | grid-container      | `grid-container.ejs` | BravoGridContainer definition     |
| 6  | col-definition      | `col-definition.ejs` | Column definition with style      |
| 7  | toolbar             | `toolbar.ejs`        | Standard toolbar                  |
| 8  | lookup-binding      | `lookup-binding.ejs` | BravoLookupBox binding            |
| 9  | command             | `command.ejs`        | CommandCollection command         |
| 10 | evaluator           | `evaluator.ejs`      | Evaluator handler                 |

## Template: `explorer-root.ejs`

**Variables:** `formName`, `title`, `dataSource`, `gridColumns[]`, `toolbarCommands[]`

**Example output:**

```xml
<?xml version="1.0" encoding="utf-8"?>
<Form>
  <Explorer>
    <FormName><%= formName %></FormName>
    <Title><%= title %></Title>
    <DataSource>
      <%- include('datasource-root', { dataSource }) %>
    </DataSource>
    <GridContainer>
      <%- include('grid-container', { columns: gridColumns }) %>
    </GridContainer>
    <Toolbar>
      <%- include('toolbar', { commands: toolbarCommands }) %>
    </Toolbar>
  </Explorer>
</Form>
```

## Template: `editor-root.ejs`

**Variables:** `formName`, `title`, `dataSource`, `fields[]`, `toolbarCommands[]`

## Template: `report-root.ejs`

**Variables:** `formName`, `title`, `dataSource`, `parameters[]`, `columns[]`

## Template: `datasource-root.ejs`

**Variables:** `tableName`, `schemaName`, `columns[]`, `relations[]`, `spName`

## Template: `grid-container.ejs`

**Variables:** `columns[]` (`name`, `header`, `width`, `dataType`, `visible`, `style`)

## Template: `col-definition.ejs`

**Variables:** `name`, `header`, `width`, `dataType`, `visible`, `readOnly`, `format`, `styleClass`

## Template: `toolbar.ejs`

**Variables:** `commands[]` (`name`, `icon`, `action`, `visible`, `enabled`)

## Template: `lookup-binding.ejs`

**Variables:** `fieldName`, `lookupTable`, `lookupColumn`, `displayColumn`, `valueColumn`

## Template: `command.ejs`

**Variables:** `commandName`, `action`, `parameters[]`, `confirmMessage`

## Template: `evaluator.ejs`

**Variables:** `evaluatorName`, `eventType`, `conditions[]`, `actions[]`

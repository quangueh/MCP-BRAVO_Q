# Evaluator Patterns

## Overview

Evaluators define the action handlers for toolbar buttons and context menu items. Each evaluator maps a BravoCommandKey to an action with optional parameters and validation.

---

## Pattern 1: New Record

Creates a blank row for data entry.

```xml
<Evaluator Name="evalNew" BravoCommandKey="New">
    <Action>NewRow</Action>
    <Defaults>
        <Default Column="IsActive" Value="1" />
        <Default Column="DocStatus" Value="1" />
        <Default Column="CreatedDate" Expression="GETDATE()" />
    </Defaults>
</Evaluator>
```

### Rules

- Sets default values for new row columns
- IsActive defaults to 1
- DocStatus defaults to 1 (Draft)
- CreatedDate uses GETDATE() expression
- System columns (CreatedBy) are set from current user context

---

## Pattern 2: Save

Validates and persists changes to the database.

```xml
<Evaluator Name="evalSave" BravoCommandKey="Save">
    <Action>Save</Action>
    <Validators>
        <ValidatorRef Name="valCodeRequired" />
        <ValidatorRef Name="valNameRequired" />
        <ValidatorRef Name="valCodeUnique" />
    </Validators>
    <Commands>
        <CommandRef Name="InsertCustomer" Condition="IsNew" />
        <CommandRef Name="UpdateCustomer" Condition="IsExisting" />
    </Commands>
    <PostActions>
        <Refresh />
        <ShowMessage>
            <Vietnamese>Luu thanh cong</Vietnamese>
            <English>Saved successfully</English>
        </ShowMessage>
    </PostActions>
</Evaluator>
```

### Rules

- Run all validators before saving
- Use INSERT command for new records
- Use UPDATE command for existing records
- Refresh grid after save
- Show success message

---

## Pattern 3: Delete

Soft-deletes a record with confirmation.

```xml
<Evaluator Name="evalDelete" BravoCommandKey="Delete">
    <Action>SoftDelete</Action>
    <Confirmation>
        <Message>
            <Vietnamese>Ban co chac chan xoa ban ghi nay?</Vietnamese>
            <English>Are you sure you want to delete this record?</English>
        </Message>
    </Confirmation>
    <Commands>
        <CommandRef Name="DeleteCustomer" />
    </Commands>
    <PostActions>
        <Refresh />
    </PostActions>
</Evaluator>
```

### Rules

- Always show confirmation dialog before deleting
- Use soft-delete (IsActive = 0) not hard-delete
- Refresh grid after deletion
- Prevent deletion of approved/referenced records

---

## Pattern 4: Refresh

Re-queries data from the database.

```xml
<Evaluator Name="evalRefresh" BravoCommandKey="Refresh">
    <Action>Refresh</Action>
    <Requery>True</Requery>
</Evaluator>
```

### Rules

- Re-execute the data source query
- Preserve current selection if possible
- No confirmation needed

---

## Pattern 5: Export

Exports data to an external file.

```xml
<Evaluator Name="evalExport" BravoCommandKey="Export">
    <Action>Export</Action>
    <Formats>
        <Format Name="Excel" Extension=".xlsx" />
        <Format Name="PDF" Extension=".pdf" />
        <Format Name="CSV" Extension=".csv" />
    </Formats>
    <DefaultFormat>Excel</DefaultFormat>
</Evaluator>
```

### Rules

- Show file format selection dialog
- Default to Excel format
- Export visible columns only (respect column visibility)
- Apply current filters to exported data

---

## Pattern 6: Print

Opens print preview for the current record or grid.

```xml
<Evaluator Name="evalPrint" BravoCommandKey="Print">
    <Action>Print</Action>
    <PrintTemplate>{TemplatePath}</PrintTemplate>
    <Parameters>
        <Parameter Name="Id" Source="CurrentRow.Id" />
        <Parameter Name="nUserId" Source="CurrentUser.Id" />
    </Parameters>
</Evaluator>
```

### Rules

- Open print preview dialog
- Pass current record Id as parameter
- Support both detail and summary print modes
- Allow printer selection

---

## Pattern 7: Approval

Handles workflow approval actions.

```xml
<Evaluator Name="evalApprove" BravoCommandKey="Approve">
    <Action>ExecuteSP</Action>
    <StoredProcedure>usp_BizDoc_Approve</StoredProcedure>
    <Parameters>
        <Parameter Name="_Id" Source="CurrentRow.Id" />
        <Parameter Name="_DocStatus" Value="4" />
        <Parameter Name="_nUserId" Source="CurrentUser.Id" />
    </Parameters>
    <Confirmation>
        <Message>
            <Vietnamese>Ban co chac duyet ban ghi nay?</Vietnamese>
            <English>Are you sure you want to approve this record?</English>
        </Message>
    </Confirmation>
    <PostActions>
        <Refresh />
        <ShowMessage>
            <Vietnamese>Duyet thanh cong</Vietnamese>
            <English>Approved successfully</English>
        </ShowMessage>
    </PostActions>
</Evaluator>

<Evaluator Name="evalReject" BravoCommandKey="Reject">
    <Action>ExecuteSP</Action>
    <StoredProcedure>usp_BizDoc_Approve</StoredProcedure>
    <Parameters>
        <Parameter Name="_Id" Source="CurrentRow.Id" />
        <Parameter Name="_DocStatus" Value="5" />
        <Parameter Name="_nUserId" Source="CurrentUser.Id" />
    </Parameters>
    <Confirmation>
        <Message>
            <Vietnamese>Ban co chac tu choi ban ghi nay?</Vietnamese>
            <English>Are you sure you want to reject this record?</English>
        </Message>
    </Confirmation>
    <PostActions>
        <Refresh />
    </PostActions>
</Evaluator>
```

### Rules

- Require confirmation for both approve and reject
- Call approval SP with appropriate status
- Only show approve/reject buttons for records in pending status
- Refresh after action

---

## BravoCommandKey Reference

| CommandKey | Action | Typical Button |
|---|---|---|
| New | NewRow | Add |
| Edit | EditRow | Edit |
| Delete | SoftDelete | Delete |
| Save | Save | Save |
| Cancel | CancelEdit | Cancel |
| Refresh | Refresh | Refresh |
| Search | Search | Search |
| Print | Print | Print |
| Export | Export | Export |
| Approve | ExecuteSP | Approve |
| Reject | ExecuteSP | Reject |

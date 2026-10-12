# Bravo Full Tag Index

File này gom danh mục thẻ/thuộc tính từ bộ tài liệu kỹ thuật Bravo đã cung cấp trong thư mục `Guide/`. Mục tiêu là để AI có bản đồ đầy đủ trước khi đi sâu vào từng tài liệu chuyên đề.

Phạm vi: đây là danh mục theo tài liệu hiện có, không khẳng định là toàn bộ mọi thẻ nội bộ của mọi version Bravo.

## Bộ Tài Liệu Nguồn

| Module | Tài liệu nguồn | Nội dung chính |
| --- | --- | --- |
| Editor | `NB_TaiLieuKyThuatBravo10_Editor.pdf`, `NB_DLL Editor.pdf`, `TXT_EDITOR/Editor.txt` | Layout Editor, controls, grid, evaluator, validator. |
| Explorer | `NB_TaiLieuKyThuatBravo10_Explorer.pdf` | DataExplorer, navigator, group filter, grid, search. |
| Datasource | `NB_TaiLieuKyThuatBravo10_Datasource.pdf` | Table/query model, events, evaluator, validator. |
| Reporter | `NB_TaiLieuKyThuatBravo10_Reporter.pdf` | Print/export/report setup, content grid, chart, subreport. |
| Dashboard | `NB_TaiLieuKyThuatBravo10_Dashboard.pdf` | Dashboard datasource, filter table, widget layout. |
| AttachFile | `NB_TaiLieuKyThuatBravo10_AttachFile.pdf` | FileHandle, upload/download/preview, picture/file controls. |
| Diagram | `NB_TaiLieuKyThuatBravo10_Diagram.pdf` | Diagram control, shape/style/menu/evaluator wiring. |
| DLL Editor | `NB_DLL Editor.pdf` | Bản rộng hơn của Editor/Datasource với nhiều class/evaluator/validator. |

## Datasource Tags

### DataSource Structure

| Nhóm | Thẻ/thuộc tính |
| --- | --- |
| Root | `DataSource`, `root` |
| Table model | `TableCollection`, `ChildCollection`, `TempTableCollection`, `ParametersTable` |
| Table definition | `Name`, `Alias`, `Columns`, `Source`, `SourceCollection`, `SourceColumn`, `dataAccessMode` |
| Select/query | `SelectType`, `Limit`, `JoinType`, `JoinCollection`, `FilterKey`, `FilterCollection`, `DefaultFilterKey`, `Group`, `GroupCollection`, `Having`, `HavingCollection`, `Sort`, `SortCollection` |
| Recursion/relation | `ForEach`, `ForEachJoin`, `MaxRecursion`, `Recursive`, `RecursiveJoin`, `ParentKey`, `ChildKey`, `TreeNodeKeyMember` |
| Command/query behavior | `CommandCollection`, `CommandType`, `RetrieveChangeLog`, `PageSize`, `bShowChangeLog`, `RequeryCondition`, `RowSelected` |
| Template | `GlobalTemplate` |

### Datasource Events

| Vùng | Thẻ |
| --- | --- |
| Load | `ServerLoading`, `ServerLoaded` |
| Column | `ColumnChanging`, `ColumnChanged`, `RefreshColumnList` |
| Row | `RowAdded`, `RowCopied`, `RowDeleting`, `RowDeleted`, `RowImported` |
| Transaction | `BeforeTransaction`, `BeforeCommit`, `AfterCommit`, `AfterTransaction` |
| Server update | `ServerUpdating`, `ServerUpdated`, `ServerCommit` |
| Defaults/copy | `DefaultValues`, `CopyList`, `CopyListNew`, `CopyMode`, `ReadOnly` |
| Validation/command | `UniqueKey`, `AssignmentUpdateList`, `CommandValidators`, `ServerCommand`, `FilterKey` |
| Calculation | `Expressions`, `TempColumns`, `TableSummed`, `Views`, `TempTable` |

### Evaluator Tags And Classes

| Nhóm | Thẻ/class |
| --- | --- |
| Container | `Evaluators`, `Evaluator_X`, `EvaluatorGroups` |
| Common config | `Assembly`, `ClassName`, `DataMember`, `Expr`, `Value`, `Parameters`, `CommandKey`, `Command`, `CommandName`, `zCtorArgs`, `zScopeExpr`, `scopeType`, `allowRunning`, `commandFormState`, `zCustomConnectionName` |
| Event suppression | `bSuppressChangeEvents`, `bSuppressLookupEvents` |
| Core classes | `BravoEvaluator`, `BravoAddRowEvaluator`, `BravoAllocationEvaluator`, `BravoBindingMember`, `BravoCommandkey`, `BravoCopyValue`, `BravoDeleteRowEvaluator`, `BravoMoneyEvaluator`, `BravoSelectRowEvaluator`, `BravoServerConstraint`, `BravoTableAggregator`, `BravoTableOrderer` |
| File/mail/integration | `BravoFileWriter`, `BravoReadFile`, `BravoAddFileEvaluator`, `BravoSendDataChange`, `BravoOauth2ResponseTypeCode`, `BravoSendMailEvaluator` |
| POS/HR/VoIP | `BravoPosPromotionProgram`, `BravoPortSIPVoIPEvaluator`, `BravoPortSIPVoIPInviteIncomingEvaluator`, `BravoTimeAttendanceEvaluator` |
| Password/security | `BravoPasswordPolicyValidator` |
| Promotion config | `zPromoTableName`, `zApplyPromoTableName`, `zPromoDiscountRateMember`, `ApplyPromoDefaultValues` |

### Validator Tags And Classes

| Nhóm | Thẻ/class |
| --- | --- |
| Container | `Validators`, `Ten_Validator` |
| Common config | `Assembly`, `ClassName`, `SourceColumn`, `TargetColumn`, `Caption`, `Expr`, `zValidateExpr`, `Text`, `Command`, `FilterKey`/`Filterkey` |
| Behavior flags | `bValidateIfModify`, `bValidateNegate`, `bValidateIfNotEmpty`, `bValidateWarning`, `bEmptyAsNull`, `bZeroAsNull`, `RestrictedPassword` |
| Classes | `BravoFiscalDateValidator`, `BravoNullValidator`, `BravoServerConstraintValidator`, `BravoUniqueKeyValidator`, `BravoValidator` |

## Editor Tags

### Editor Layout Root

| Nhóm | Thẻ/thuộc tính |
| --- | --- |
| Navigation | `navigator`, `LinkCommand`, `Items`, `Caption`, `Execute`, `Visible`, `Select`, `Text` |
| Main panels | `panelEditor`, `panelCommand`, `showCommandButtons`, `panelSummary`, `panelParent` |
| Layout behavior | `zSubLayout`, `verifyWorkingData`, `zCustomConnectionName`, `Execute`, `bFullScreenMode`, `bShowStatusStrip`, `TextFormat`, `zDefaultCommandButton`, `identityColumnValueType`, `bLoadPermissionForAllTables` |
| Command buttons | `SaveAndNew`, `SaveAndClose`, `SaveLocal`, `CloseWindow` |
| Other form behavior | `nIdleMinuteInterval`, `bAllowDeletingLocalSaveFile` |

### Editor Common Control Tags

| Nhóm | Thẻ/thuộc tính |
| --- | --- |
| Layout grid | `Dock`, `Rows`, `Cols`, `Column`, `Row`, `ColumnSpan`, `RowSpan`, `Controls`, `Pages` |
| Identity/binding | `ClassName`, `Assembly`, `DataMember`, `Name`, `LookupKey`, `bindingMembers`, `selectedMembers` |
| Text/caption | `Text`, `Vietnamese`, `English`, `Japanese`, `Chinese`, `Korean` |
| Appearance | `Style`, `Anchor`, `BackColor`, `BorderStyle`, `Enabled`, `Font`, `fontStyle`, `ForeColor`, `ImageAlign`, `Margin`, `MaximumSize`, `MinimumSize`, `nFontScale`, `Size`, `TextAlign`, `Visible`, `ReadOnly`, `TabStop` |
| Clipboard/input | `bDisableClipboardUpdated`, `bAllowUsingEnterAsTabKey`, `Multiline`, `autoCorrectOptions` |

### Editor Control Classes

| Loại | ClassName |
| --- | --- |
| Key/lookup/code | `BravoKeyInputBox`, `BravoLookupBox`, `BravoCodeInputBox`, `BravoListLookupControl`, `BravoLookupList`, `BravoDomainUserLookupBox` |
| Text/number/date | `BravoTextBox`, `BravoRichTextBox`, `BravoQuantityInputBox`, `BravoNumericInputBox`, `BravoDateInputBox`, `BravoDataServiceTextBox` |
| Check/option/list | `BravoCheckBox`, `BravoOptionBox`, `BravoOptionControl`, `BravoCheckList` |
| Label/link/button | `BravoLabel`, `BravoDataLabel`, `BravoLinkLabel`, `BravoLinkCommand`, `BravoButton`, `BravoDialogDataButton` |
| File/picture | `BravoOpenFileBox`, `BravoSaveFileBox`, `BravoPictureBox`, `BravoPictureInputBox`, `BravoPictureEditor`, `BravoOpenServerDirBox` |
| Device/input special | `BravoBarCodeBox`, `BravoBarCodeInputBox`, `BravoPassCodeReader`, `BravoScaleReader`, `BravoPhysicalInventoryReader` |
| Web/HTML/online | `BravoWebView`, `BravoOauth2WebView`, `BravoOnlineSourceViewer`, `BravoHtmlEditor` |
| Complex controls | `BravoExpandingPanel`, `BravoDocInputBox`, `BravoDataCollectionControl`, `BravoScheduleControl` |

### Editor Grid Tags

| Nhóm | Thẻ/thuộc tính |
| --- | --- |
| Binding | `DataMember`, `Cols`, `Text`, `zOpenRelatedChild`, `zCarryingColumns`, `carryingColumnType`, `bCarryingColumnAsDefaultValue` |
| Editing | `AllowAddNew`, `AllowDelete`, `AllowEditing`, `zAllowDeleteRow`, `allowEditingMultiCells`, `bDoubleClickActivateCell` |
| Display | `AllowDragging`, `AllowFreezing`, `nFreezeCols`, `nFreezeRows`, `bAllowGrandTotal`, `Groups`, `bExcludeSumColumns`, `SumColumns`, `Styles` |
| Dynamic columns | `DynamicColX`, `Name`, `Pattern`, `PatternRegex`, `UpdatedColumn()`, `ColumnName()` |
| Relation/row header | `dataRelationMode`, `bShowRowIndicator`, `bMarkDataRowState`, `rowHeaderNumbering` |

## Explorer Tags

### Explorer Datasource

Explorer dùng lại nhiều thẻ của Datasource, đặc biệt:

`Name`, `Sort`, `RowSelected`, `PageSize`, `bShowChangeLog`, `TreeNodeKeyMember`, `FilterKey`, `ParentKey`, `ChildKey`, `Evaluator`, `CommandValidators`, `ServerCommand`, `Alias`.

### Explorer Layout

| Nhóm | Thẻ/thuộc tính |
| --- | --- |
| Navigator | `navigator`, `GroupFilter`, `Items`, `Text`, `FilterKey` |
| Main panel | `panelExplorer`, `Controls` |
| Grid/control | `ClassName`, `Assembly`, `AllowEditing`, `Execute`, `Items`, `DataMember`, `Cols`, `AllowDelete`, `BravoLinkCommand` |
| Search | `quickSearchMode`, `searchRange`, `bShowAllFilterParameters` |
| Connection | `zCustomConnectionName`, `connectionStrings` |
| Data list | `BravoDataListControl` |

## Reporter Tags

### Reporter DataSource

`Command`, `ParametersTable`, `Table_x`.

### PrintSettings

`PrintSettings`, `PaperSize`, `PaperName`, `Landscape`, `Margins`, `Top`, `Bottom`, `Left`, `Right`, `bAutoExtendPrintWidth`, `bCenterOnPage`, `bMiddleOnPage`, `zReportNumberSeparator`, `zReportCultureLanguage`, `Printer`, `PrinterName`, `Duplex`, `Collate`, `Copies`, `FromPage`, `ToPage`, `bFitToPaperWidth`, `bPrintCurrentState`, `bPrintSelectionOnly`, `MeasuringUnit`, `ViewerZoom`, `PageRange`.

### ReportSetup

`ReportSetup`, `PrintExpr`, `ReportGroupMember`, `bRenderSubtotalForGroup`, `bGroupOnNewPage`, `bIgnoreEmptyGroup`, `bColumnGroupTogether`, `bNoResetPageNumberForGroup`, `SumOnEachPage`, `SumExpr`, `zSumFromPreviousPageDisplayText`, `zSumForNextPageDisplayText`, `attachedText`, `attachedTextOffset`, `bCenterOnPage`, `bMiddleOnPage`, `bAutoAdjustPageSettings`, `bAutoCompanyTitle`, `nNumberOfCopies`, `bCopyPageForGroup`, `showCopyInfo`, `zCopyInfoDisplayText`, `copyInfoOffset`, `bBarcodeAsImage`, `bDetailKeepTogether`, `bDetailPageBottomLine`, `detailHLineColor`, `detailHLineStyle`, `autoExtendDetail`, `bDrawDiagonalMarginHLine`, `diagonalLineStyle`, `diagonalMargins`, `nDiagonalLineWeight`, `bExcludeTreeGlyphIndent`, `bFitCompanyTitle`, `bFitDetailContent`, `bRenderPlainColorOnly`, `bRenderTextOnly`, `nTextLineSpacing`, `nTextCharSpacing`, `bRepeatColumnHeader`, `bRepeatColumnHeaderWithoutDetail`, `bRepeatTitleForGroup`, `bRepeatSummaryForGroup`, `bRepeatTitleOnPage`, `bRepeatSummaryOnPage`, `bTotalRowAtBottom`, `detailNewPage`, `detailPageBottomLineStyle`, `detailVLineColor`, `detailVLineStyle`, `pageInfoOffset`, `zPageInfoDisplayText`, `PageInfo`/`PageInfor`, `printExtraWidth`, `bCopyMergeContent`, `pageNumberOrder`, `extraPageDisplayContent`, `subReportLayout`, `Watermark`, `WatermarkAlignment`, `WatermarkPrintOnPages`, `WatermarkSizeMode`, `cachingDocument`, `nCustomCachingDocumentPages`, `nAutoCachingMinimumRows`, `zCachingLocation`, `displayIndent`, `bAutoBarcodeChecksum`, `bBarcodeChecksumEnabled`, `detailPageBottomLineColor`, `nDetailPageBottomLineWeight`, `nContentBorderWeight`, `ContentBorderStyle`, `zExcludedColumns`, `bSubReportWithoutDetailOnGroup`.

### ExportSettings

`ExportSettings`, `bCloseWhenCompleted`, `bExportDataOnly`, `bGroupOnNewSheet`, `bGroupOnNewFile`, `bSubReportOnNewFile`, `bSubReportOnNewSheet`, `bOpenFileWhenCompleted`, `bOverwriteExistingFile`, `bRenderReportForPdf`, `bSendMailWhenCompleted`, `bSupportExportRpx`, `zFileType`, `zOutputFileName`, `zRecipientAddress`, `zBCCRecipientAddress`, `zCCRecipientAddress`, `bHtmlFileAttachment`, `bZipFileAttachment`, `bMessageBody`, `zExcludedFormatList`, `nAttachmentSize`, `htmlAttachment`, `zFilePassword`, `zZipPasswordFileAttachment`, `bDocumentOnNewSheet`.

### ExportSetup

`ExportSetup`, `bAutoCompanyTitle`, `bCenterOnPage`, `bChartAsImage`, `bDisplayGridLines`, `bGroupOnNewFile`, `bGroupOnNewPage`, `bGroupOnNewSheet`, `bMiddleOnPage`, `bNonDetailCellAsTextBox`, `exportExtraRows`, `exportExtraPages`, `bExcludedSubtotalFormula`, `bUseDataColumnExpression`, `optimizeLevel`, `zTextDelimited`, `bColumnCaptionForHeader`, `PageInfor`, `zPageInfoDisplayText`, `bExportSelectionOnly`, `valueQuoteType`, `zAllowInvisibleColumn`.

### Reporter Content And Other Tags

| Nhóm | Thẻ/thuộc tính |
| --- | --- |
| Content | `Content`, `Chart`, `hideZeroValue`, `zTreeColName`, `bAllowGrandTotal`, `SumColumns`, `Groups`, `bGroupInColumn`, `treeStyle`, `Execute`, `AllowFreezing`, `countGroupChilds`, `bAllowSorting`, `grandTotalPosition`, `zDataViewSortExprFormat`, `zGrandTotalText`, `zMakingTreeNodeKeyColName`, `gridMode` |
| Layout/parameters | `panelReporter`, `panelParameters`, `Controls`, `DataMember`, `Column`, `ColumnSpan`, `Row`, `RowSpan`, `quickParameters`, `bShowAllQuickParameters` |
| Template/sub-layout | `tabStripSubLayout`, `zSubLayout`, `bUseReportTemplate`, `bUseReportTemplateAsDefault`, `nDefaultReportTemplateName`, `bUseCurrentLayoutToPrintAll` |
| Behavior | `bAutoHideEmptyAutoTextRows`, `bDisplayError`, `bUseGridSettingsHistory`, `zDefinitionCommandKey` |

## Dashboard Tags

### Dashboard Datasource

| Nhóm | Thẻ/thuộc tính |
| --- | --- |
| Command/requery | `Command`, `RequeryCondition` |
| Tables/views | `TableCollection`, `FilterTable`, `Tablex`, `ViewCollection`, `View1`, `Table1`, `Table2`, `Alias`, `Name`, `FilterKey`, `DefaultValues` |
| Evaluators | `Evaluators`, `BravoUpdateViewEvaluator`, `DataMember`, `ColumnChanged`, `RowSelected`, `TempTableCollection` |
| Saved filters | `B00DashboardFilter`, `CommandKey`, `ParamName`, `ParamValue`, `BranchCode`, `IsActive` |

### Dashboard Widget Classes

`BravoTabWidget`, `BravoWidgetPeriod`, `BravoFilterWidget`, `BravoRangeSlider`, `BravoSlider`, `BravoWidgetCheckList`, `BravoWidgetLookup`, `BravoLabelWidget`, `BravoChartWidget`, `BravoGridWidget`, `BravoGaugeWidget`, `BravoTornadoWidget`, `BravoTreeMapWidget`, `BravoWaterfallWidget`, `BravoSliderWidget`, `BravoDiagramWidget`, `BravoReportWidget`, `BravoWidgetPie`, `BravoPieWidget`, `BravoOpenFileBox`.

### Dashboard Widget Tags

`tabPosition`, `bAutoHideTabStrip`, `nAutoHideDelayInterval`, `position`, `ValueColors`, `Color`, `Groups`, `Values`, `SumValues`, `zCommand`, `bAllowFilter`, `Refresh`, `fileLocation`, `FileName`, `FileContent`, `selectedMembers`.

## AttachFile Tags

### FileHandle

| Nhóm | Thẻ/thuộc tính |
| --- | --- |
| Container | `FileName`, `FileHandle` |
| File policy | `AllowFileType`, `FileSizeLimit`, `DialogFileFilter`, `FileOverwriteOption`, `DisplayFileNameOnly`, `DestinationFolder`, `FileAccessMode` |
| UI/action | `VisibleColumns`, `DownloadExpr`, `UploadExpr` |
| Return mapping | `selectedMembers`, `FileSize`, `FileReadTimeUTC`, `FileNameWithoutExtension`, `FileExtension` |

### Attach/File Controls

`BravoUploadFileBox`, `BravoPictureInputBox`, `ClassName`, `Assembly`, `nFileSizeLimit`, `dialogFileFilter`, `DataMember`, `Width`, `Style`, `Rows`, `Row_0`, `Text`, `Vietnamese`, `English`, `Japanese`, `Chinese`, `Korean`.

Supported `AllowFileType`: `File`, `Url`, `All`.

Supported `DialogFileFilter`: `DocumentFiles`, `ImageFiles`, `VideoFiles`, `AllFiles`.

Supported `FileOverwriteOption`: `Overwrite`, `NoOverwrite`, `AutoRename`.

Supported `VisibleColumns`: `None`, `Download`, `Upload`, `Preview`, `All`.

Supported `FileAccessMode`: `Private`, `Public`.

## Diagram Tags

| Nhóm | Thẻ/thuộc tính |
| --- | --- |
| Panel/control | `panelDiagram`, `Controls`, `Control_0`, `ClassName`, `Assembly`, `Dock`, `Diagram`, `WidgetCRMManagermentDiagram` |
| Items/menu | `Items`, `Item`, `Item_0`, `Item_1`, `MenuItems`, `MenuText`, `Execute`, `CommandKey` |
| Text/language | `Text`, `Vietnamese`, `English`, `Japanese`, `Chinese`, `Korean` |
| Style | `ItemStyle`, `FillSettings`, `LineSettings`, `Thickness`, `BackColor`, `BorderThickness`, `Visible`, `ColorPalette`, `ItemPaletteColors`, `ColorIndex`, `Angle`, `ZIndex`, `ThemeStyle`, `Bounds`, `TargeArrowSymbol` |
| Data/evaluator | `TableCollection`, `ParentTable`, `Evaluators`, `Expr`, `allowRunning`, `Key`, `Value`, `Column`, `Row`, `Enable`/`Enabel` |

## XML-Like Tag Appendix From Extracted PDFs

Phần này là danh sách tên thẻ xuất hiện trực tiếp trong text PDF theo regex `<Tag...>`. Nó giúp AI nhớ các tên thẻ ít gặp có thể không nằm trong mục lục.

### Editor / DLL Editor Frequent Tags

`ClassName`, `DataMember`, `Column`, `Row`, `root`, `Text`, `Vietnamese`, `Expr`, `Tables`, `Name`, `Assembly`, `Eval_X`, `Value`, `Validators`, `English`, `Controls`, `Style`, `Command`, `SourceColumn`, `CommandKey`, `zCtorArgs`, `Parameters`, `ColumnSpan`, `Dock`, `Anchor`, `Execute`, `ParentTable`, `Evaluators`, `zScopeExpr`, `Visible`, `commandFormState`, `bindingMembers`, `DocCode`, `selectedMembers`, `TargetColumn`, `Pattern`, `Select`, `FilterKey`, `zValidateExpr`, `Alias`, `zResultDecimalRound`, `ServerCommand`, `DocDate`, `LookupKey`, `DefaultValues`, `BranchCode`, `FileContent`, `Items`, `RowSpan`, `allowRunning`, `bSuppressChangeEvents`, `zSourceValueMember`, `CommandName`, `zDialogFilter`, `BackColor`, `Groups`, `zMoneyValue`, `zTargetValueMember`, `ReadOnly`, `Enabled`, `panelEditor`, `zFileName`, `EvaluatorGroups`, `ServerLoading`, `ServerLoaded`, `TempColumns`, `ChildKey`, `ParentKey`, `UniqueKey`, `CustomerCode`, `CommandValidators`, `mergingData`, `Width`, `bValidateIfModify`, `panelCommand`, `showCommandButtons`, `Editor`, `nFontScale`, `Evaluator_X`, `RowAdded`, `AfterCommit`, `DocNo`, `DataType`, `DataSource`, `Views`, `Caption`, `scopeType`, `zResultMarginValue`, `zCustomConnectionName`, `ColumnChanging`, `ColumnChanged`, `RowCopied`, `ServerUpdating`, `ServerUpdated`, `CurrencyCode`, `FiscalYear`, `CopyMode`, `RowDeleting`, `RowDeleted`, `AssignmentUpdateList`, `Format`, `AllowAddNew`.

### Datasource Frequent Tags

`TableCollection`, `SourceCollection`, `JoinCollection`, `FilterCollection`, `GroupCollection`, `HavingCollection`, `SortCollection`, `CommandCollection`, `ChildCollection`, `TempTableCollection`, `SelectType`, `Limit`, `Name`, `Alias`, `Columns`, `Source`, `JoinType`, `FilterKey`, `Group`, `Having`, `Sort`, `dataAccessMode`, `SourceColumn`, `ForEach`, `ForEachJoin`, `MaxRecursion`, `Recursive`, `RecursiveJoin`, `RetrieveChangeLog`, `RowSelected`, `ParentKey`, `ChildKey`, `CommandType`, `DefaultFilterKey`, `PageSize`, `bShowChangeLog`, `TreeNodeKeyMember`, `ParametersTable`, `RequeryCondition`, `Evaluators`, `EvaluatorGroups`, `ServerLoaded`, `ColumnChanging`, `ColumnChanged`, `RowAdded`, `RowCopied`, `Expressions`, `TempColumns`, `BeforeTransaction`, `ServerUpdated`, `DefaultValues`, `CopyList`, `CopyListNew`, `CopyMode`, `ReadOnly`, `RefreshColumnList`, `ServerCommand`, `RowDeleting`, `UniqueKey`, `AssignmentUpdateList`, `CommandValidators`, `RowImported`.

### Reporter Frequent Tags

`ReportSetup`, `ExportSettings`, `PrintSettings`, `ExportSetup`, `Content`, `panelReporter`, `panelParameters`, `SumColumns`, `Styles`, `Controls`, `PaperName`, `autoExtendDetail`, `DataMember`, `PaperSize`, `bCenterOnPage`, `bMiddleOnPage`, `bGroupOnNewPage`, `diagonalLineStyle`, `Expr`, `Text`, `Groups`, `CompanyLogo`, `Width`, `Height`, `RawKind`, `zReportNumberSeparator`, `Printer`, `PrintExpr`, `ReportGroupMember`, `SumOnEachPage`, `attachedTextOffset`, `bAutoCompanyTitle`, `zCopyInfoDisplayText`, `copyInfoOffset`, `diagonalMargins`, `bTotalRowAtBottom`, `detailPageBottomLineStyle`, `detailVLineColor`, `detailVLineStyle`, `pageInfoOffset`, `bGroupOnNewSheet`, `bGroupOnNewFile`, `zNumericFormat`, `zDataViewSortExprFormat`, `quickParameters`, `subReportLayout`, `valueQuoteType`, `Chart`, `Items`, `Landscape`, `Margins`, `bAutoExtendPrintWidth`, `zReportCultureLanguage`, `bFitToPaperWidth`, `bPrintCurrentState`, `bPrintSelectionOnly`, `MeasuringUnit`, `ViewerZoom`, `bRenderSubtotalForGroup`, `bIgnoreEmptyGroup`, `bColumnGroupTogether`, `bNoResetPageNumberForGroup`, `bAutoAdjustPageSettings`, `nNumberOfCopies`, `bCopyPageForGroup`, `showCopyInfo`, `bBarcodeAsImage`, `bDetailKeepTogether`, `bDetailPageBottomLine`, `detailHLineColor`, `detailHLineStyle`, `bDrawDiagonalMarginHLine`, `nDiagonalLineWeight`, `bExcludeTreeGlyphIndent`, `bFitCompanyTitle`, `bFitDetailContent`, `bRenderPlainColorOnly`, `bRenderTextOnly`, `nTextLineSpacing`, `nTextCharSpacing`, `bRepeatColumnHeader`, `bRepeatColumnHeaderWithoutDetail`, `bRepeatTitleForGroup`, `bRepeatSummaryForGroup`, `bRepeatTitleOnPage`, `bRepeatSummaryOnPage`, `detailNewPage`, `zPageInfoDisplayText`, `PageInfo`, `printExtraWidth`, `bCopyMergeContent`, `pageNumberOrder`, `extraPageDisplayContent`.

### Dashboard / AttachFile / Diagram Frequent Tags

`BravoTabWidget`, `BravoWidgetPeriod`, `BravoFilterWidget`, `BravoRangeSlider`, `BravoSlider`, `BravoWidgetCheckList`, `BravoWidgetLookup`, `BravoLabelWidget`, `BravoChartWidget`, `BravoGridWidget`, `BravoGaugeWidget`, `BravoTornadoWidget`, `BravoTreeMapWidget`, `BravoWaterfallWidget`, `BravoSliderWidget`, `BravoDiagramWidget`, `BravoReportWidget`, `BravoWidgetPie`, `BravoPieWidget`, `BravoOpenFileBox`, `FileName`, `FileHandle`, `AllowFileType`, `FileSizeLimit`, `DialogFileFilter`, `FileOverwriteOption`, `DisplayFileNameOnly`, `DestinationFolder`, `selectedMembers`, `FileSize`, `FileReadTimeUTC`, `FileNameWithoutExtension`, `FileExtension`, `DownloadExpr`, `UploadExpr`, `VisibleColumns`, `BravoUploadFileBox`, `BravoPictureInputBox`, `panelDiagram`, `FillSettings`, `LineSettings`, `ItemStyle`, `ColorPalette`, `ItemPaletteColors`, `TargeArrowSymbol`.

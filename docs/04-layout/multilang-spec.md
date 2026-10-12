# Multi-Language Support Specification

## Overview

Bravo ERP supports 6 languages for UI text. All user-visible text in layout XML uses multi-language text nodes. BLG must generate all text nodes with translations.

---

## Supported Languages

| Code | Language | Index | Locale |
|---|---|---|---|
| vi | Vietnamese | 0 | vi-VN |
| en | English | 1 | en-US |
| zh | Chinese | 2 | zh-CN |
| ja | Japanese | 3 | ja-JP |
| ko | Korean | 4 | ko-KR |
| fr | French | 5 | fr-FR |

---

## Text Node Format

All text elements use child nodes for each language:

```xml
<Text>
    <Vietnamese>Ten khach hang</Vietnamese>
    <English>Customer Name</English>
    <Chinese>客户名称</Chinese>
    <Japanese>顧客名</Japanese>
    <Korean>고객명</Korean>
    <French>Nom du client</French>
</Text>
```

---

## Default Language

- **Default**: Vietnamese (index 0)
- **Fallback**: If a translation is missing for any language, Vietnamese text is used
- **Minimum requirement**: Vietnamese and English must always be provided

---

## Generation Rules

### Rule 1: Always Provide Vietnamese and English

```xml
<Text>
    <Vietnamese>Ma khach hang</Vietnamese>
    <English>Customer Code</English>
</Text>
```

### Rule 2: Other Languages Use Vietnamese as Fallback

If Chinese, Japanese, Korean, or French translations are not available, the Vietnamese text is used as fallback. The framework handles this automatically.

### Rule 3: Column Headers Get Multi-Language Text

```xml
<Header>
    <Vietnamese>Ma</Vietnamese>
    <English>Code</English>
</Header>
```

### Rule 4: Button Text Gets Multi-Language Text

```xml
<Item Name="btnSave" BravoCommandKey="Save">
    <Text>
        <Vietnamese>Luu</Vietnamese>
        <English>Save</English>
    </Text>
</Item>
```

### Rule 5: Label Text Gets Multi-Language Text

```xml
<Label>
    <Text>
        <Vietnamese>Ten khach hang</Vietnamese>
        <English>Customer Name</English>
    </Text>
</Label>
```

---

## Common Translations Dictionary

### Toolbar Actions

| Vietnamese | English | Chinese | Japanese | Korean | French |
|---|---|---|---|---|---|
| Them moi | Add | 新增 | 追加 | 추가 | Ajouter |
| Sua | Edit | 编辑 | 編集 | 편집 | Modifier |
| Xoa | Delete | 删除 | 削除 | 삭제 | Supprimer |
| Luu | Save | 保存 | 保存 | 저장 | Enregistrer |
| Huy | Cancel | 取消 | キャンセル | 취소 | Annuler |
| Tai lai | Refresh | 刷新 | 更新 | 새로고침 | Actualiser |
| Tim kiem | Search | 搜索 | 検索 | 검색 | Rechercher |
| In | Print | 打印 | 印刷 | 인쇄 | Imprimer |
| Xuat | Export | 导出 | エクスポート | 내보내기 | Exporter |
| Duyet | Approve | 批准 | 承認 | 승인 | Approuver |
| Tu choi | Reject | 拒绝 | 却下 | 거부 | Rejeter |

### Common Labels

| Vietnamese | English | Chinese | Japanese | Korean | French |
|---|---|---|---|---|---|
| Ma | Code | 代码 | コード | 코드 | Code |
| Ten | Name | 名称 | 名前 | 이름 | Nom |
| Ngay | Date | 日期 | 日付 | 날짜 | Date |
| So tien | Amount | 金额 | 金額 | 금액 | Montant |
| So luong | Quantity | 数量 | 数量 | 수량 | Quantite |
| Don gia | Unit Price | 单价 | 単価 | 단가 | Prix unitaire |
| Thanh tien | Total | 合计 | 合計 | 합계 | Total |
| Ghi chu | Note | 备注 | 備考 | 비고 | Remarque |
| Trang thai | Status | 状态 | ステータス | 상태 | Statut |
| Nguoi tao | Created By | 创建者 | 作成者 | 작성자 | Cree par |
| Ngay tao | Created Date | 创建日期 | 作成日 | 작성일 | Date de creation |

### Field Labels

| Vietnamese | English | Field |
|---|---|---|
| Ma khach hang | Customer Code | Customer.Code |
| Ten khach hang | Customer Name | Customer.Name |
| Ma so thue | Tax Code | Customer.TaxCode |
| Dia chi | Address | Customer.Address |
| Dien thoai | Phone | Customer.Phone |
| Email | Email | Customer.Email |
| Ma san pham | Product Code | Product.Code |
| Ten san pham | Product Name | Product.Name |
| Don vi tinh | Unit | Product.Unit |
| Ma kho | Warehouse Code | Warehouse.Code |
| Ten kho | Warehouse Name | Warehouse.Name |
| Ngay chung tu | Document Date | DocDate |
| So chung tu | Document Number | Code |
| Ma nhan vien | Employee Code | Employee.Code |
| Ten nhan vien | Employee Name | Employee.Name |

---

## Tab Page Names

| Vietnamese | English |
|---|---|
| Danh sach | List |
| Chi tiet | Details |
| Bao cao | Report |
| Thong tin chung | General Info |
| Lich su | History |

---

## Validation Messages

| Vietnamese | English |
|---|---|
| Ma khong duoc de trong | Code is required |
| Ten khong duoc de trong | Name is required |
| Ma da ton tai | Code already exists |
| So luong phai lon hon 0 | Quantity must be greater than 0 |
| Don gia phai lon hon 0 | Unit price must be greater than 0 |
| Ngay ket thuc phai sau ngay bat dau | End date must be after start date |
| Khong the xoa ban ghi nay | Cannot delete this record |
| Ban ghi da duoc duyet | Record has been approved |

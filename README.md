# MCP Bravo Knowledge Pack

Repo này là gói kiến thức để AI đọc hiểu Bravo ERP: cấu trúc layout XML, DataSource XML, quy ước bảng/cột, quy trình sinh/sửa màn hình và checklist kiểm tra. Không còn tool/app chạy kèm, không chứa dữ liệu khách hàng, không chứa connection string và không chứa password.

## AI Nên Đọc Theo Thứ Tự

1. `AGENTS.md` - quy tắc an toàn và phạm vi làm việc.
2. `docs/00-ai-operating-guide.md` - cách AI tiếp cận một yêu cầu Bravo.
3. `docs/00-bravo-full-tag-index.md` - danh mục thẻ đầy đủ theo bộ tài liệu Bravo đã cung cấp.
4. `docs/04-layout/bravo-tag-handbook.md` - giải thích chi tiết nhóm thẻ hay dùng.
5. `docs/01-business/` - mô hình nghiệp vụ và luồng dữ liệu.
6. `docs/04-layout/`, `docs/05-datasource/`, `docs/09-layout-gen/` - layout, datasource, generator patterns.
7. `knowledge/README.md` - nơi đặt schema/layout đã trích xuất ở local nếu có.

## Cấu Trúc

```text
mcp/
├── AGENTS.md
├── README.md
├── docs/
│   ├── 00-ai-operating-guide.md
│   ├── 04-layout/bravo-tag-handbook.md
│   └── ...
└── knowledge/
    └── README.md
```

## Nguyên Tắc

- Repo này là tài liệu/knowledge-base, không phải ứng dụng.
- Không commit dữ liệu schema/layout theo khách hàng vào `knowledge/`.
- Khi làm việc với một môi trường thật, đặt dữ liệu đã trích xuất ở local trong `knowledge/` và để AI đọc từ đó.
- Muốn đồng bộ dữ liệu mới từ SQL thì dùng quy trình riêng bên ngoài repo này với tài khoản read-only.

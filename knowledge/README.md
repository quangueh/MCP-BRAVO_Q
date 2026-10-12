# Local Knowledge Folder

Đặt dữ liệu Bravo đã trích xuất vào đây.

Các file trong thư mục này là dữ liệu theo môi trường/khách hàng và bị `.gitignore` chặn để không push lên GitHub.

Ví dụ sau khi sync:

```text
knowledge/
├── _summary.json
├── Bravo_Config/
│   ├── _tables.json
│   ├── _views.json
│   ├── _procedures.json
│   └── dbo_TableName.json
└── Bravo_Data/
    ├── _tables.json
    ├── _indexes.json
    └── dbo_TableName.json
```

# MCP Bravo Knowledge

MCP này dùng để gắn AI vào đọc hiểu cách vận hành Bravo ERP thông qua tài liệu, layout, cấu trúc DB đã trích xuất và quy trình đồng bộ dữ liệu về máy local.

Repo này không chứa dữ liệu khách hàng, không chứa connection string thật và không chứa password. Thư mục `knowledge/` chỉ là nơi đặt dữ liệu đã trích xuất ở máy local.

## Cấu trúc

```text
mcp/
├── src/server.js              # MCP server đọc knowledge local
├── scripts/extract_schema.js  # Script đồng bộ schema read-only
├── knowledge/                 # Dữ liệu trích xuất local, không commit
├── docs/                      # Tài liệu phân tích Bravo/MCP
├── blg/                       # App/tool hỗ trợ layout generator
├── report-app/                # App/tool hỗ trợ report/layout
├── .env.example               # Mẫu cấu hình sync
└── .mcp.example.json          # Mẫu cấu hình MCP client
```

## Cài đặt

```bash
npm install
```

## Chạy MCP server

```bash
npm start
```

MCP server chỉ đọc file trong `knowledge/`. Nó không tự kết nối SQL.

## Đồng bộ schema

Tạo file `.env` từ `.env.example`, điền thông tin SQL read-only, rồi chạy:

```bash
npm run sync:schema
```

Script chỉ đọc metadata và ghi JSON vào `knowledge/`. Không commit nội dung trong `knowledge/` lên GitHub.

## Quy tắc bảo mật

- Không commit `.env`, `.mcp.json`, `knowledge/*.json`, `output/`, `Import/`.
- Không hard-code server, user, password trong source.
- MCP server mặc định chỉ đọc dữ liệu local đã trích xuất.
- Muốn refresh schema từ SQL thì phải chủ động chạy `npm run sync:schema`.

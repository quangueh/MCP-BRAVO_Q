# AGENTS.md

## Quy tắc làm việc

1. MCP server trong repo này chỉ đọc dữ liệu local trong `knowledge/`.
2. Không hard-code IP, user, password, database khách hàng trong source.
3. Không commit `.env`, `.mcp.json`, `knowledge/`, `output/`, `Import/`.
4. Nếu cần đồng bộ schema từ SQL, dùng `npm run sync:schema` với tài khoản read-only và file `.env` local.
5. Mọi phân tích schema/layout nên dựa trên file đã trích xuất trong `knowledge/`, không tự ý ghi hoặc thay đổi database nguồn.

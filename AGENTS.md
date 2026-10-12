# AGENTS.md

## Mục Đích

Repo này trang bị kiến thức Bravo ERP cho AI: đọc hiểu layout XML, DataSource XML, quan hệ bảng/cột, quy ước đặt tên và cách suy luận khi tạo/sửa cấu hình Bravo.

## Quy Tắc Làm Việc

1. Đây là knowledge-base, không phải tool/app chạy trực tiếp.
2. Không hard-code IP, user, password, database khách hàng trong tài liệu.
3. Không commit dữ liệu thật trong `knowledge/`, `output/`, `Import/`, `.env`, `.mcp.json`.
4. Mọi phân tích schema/layout nên dựa trên file đã trích xuất trong `knowledge/` nếu local có dữ liệu.
5. Không tự ý connect SQL hoặc thay đổi database nguồn.
6. Khi sinh/sửa XML Bravo, luôn kiểm tra cặp `DataSource` và `Layout`: `DataMember`, `TableCollection`, `Lookup`, `FilterKey`, `Command`, `Evaluator`, `Validator` phải khớp nhau.

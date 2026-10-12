# AI Operating Guide For Bravo ERP

## Mục Tiêu

Khi nhận yêu cầu Bravo, AI cần làm được ba việc:

1. Đọc yêu cầu nghiệp vụ và nhận ra loại artefact cần xử lý: bảng, view, stored procedure, DataSource XML, Layout XML, command, lookup, báo cáo hoặc màn hình nhập liệu.
2. Tra cứu knowledge local nếu có: schema trong `knowledge/`, layout mẫu, docs trong `docs/`.
3. Đưa ra thay đổi có thể áp dụng được: SQL/XML/hướng dẫn cấu hình, kèm checklist rủi ro.

## Quy Trình Suy Luận

1. Xác định form/màn hình.
   - Explorer: màn hình danh sách/tra cứu.
   - Editor: màn hình nhập/sửa chứng từ hoặc danh mục.
   - Report: màn hình báo cáo, thường nặng về DataSource và tham số.
   - Wizard/Process: màn hình thao tác theo bước hoặc chạy xử lý.

2. Xác định nguồn dữ liệu.
   - B00/B08 thường là cấu hình, phân quyền, layout, lệnh hệ thống.
   - B20 thường là danh mục/master data.
   - B30 thường là chứng từ/giao dịch.
   - View thường phục vụ explorer/report.
   - Stored procedure thường phục vụ xử lý, save, report, chuyển trạng thái.

3. Ghép DataSource với Layout.
   - `DataMember` trong control phải trỏ tới alias trong `TableCollection`.
   - Lookup control phải có source/key/display/code tương ứng.
   - Grid column phải map đúng field có trong DataSource.
   - FilterKey phải dùng field tồn tại và không phá branch/user security.

4. Kiểm tra hành vi lưu/chạy.
   - Editor cần command save/update/delete hoặc procedure save.
   - Report cần tham số ngày, branch, user, language, currency nếu nghiệp vụ yêu cầu.
   - Workflow cần trạng thái chứng từ, user duyệt, bước duyệt và log.

## Checklist Trước Khi Trả Lời

- Có nhắc rõ artefact cần sửa/tạo không?
- Có chỉ ra file/layout/data source liên quan không?
- Có kiểm tra field name và `DataMember` không?
- Có giữ nguyên quy ước Bravo hiện hữu không?
- Có tránh dữ liệu khách hàng, IP, password, connection string không?

## Khi Thiếu Dữ Liệu

Nếu không có schema/layout thật trong `knowledge/`, AI phải nói rõ phần nào là suy luận theo pattern Bravo, phần nào cần xác nhận bằng schema/layout local.

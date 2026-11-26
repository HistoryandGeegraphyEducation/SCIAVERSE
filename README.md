# SCIAVERSE
Một môi trường khoa học số đa lĩnh vực, nhằm kết nối các lĩnh vực khoa học thông qua hệ thống mô phỏng, phòng thí nghiệm ảo, công cụ khám phá và nguồn học liệu nghiên cứu. SCIAVERSE hướng đến việc xây dựng không gian tương tác số, nơi người dùng có thể quan sát, thực nghiệm, tìm hiểu và nghiên cứu các hiện tượng, quy luật và tri thức khoa học.


## Cấu trúc nền tảng

- `data/fields.json`: sáu lĩnh vực khoa học hiện có.
- `data/spaces.json`: bốn không gian chức năng.
- `data/model-registry.json`: danh mục mô hình nguồn và trạng thái thẩm định.
- `docs/SCIAVERSE-ARCHITECTURE.md`: kiến trúc không gian khoa học.
- `docs/SCIENTIFIC-VALIDATION-STANDARD.md`: tiêu chuẩn thẩm định khoa học.
- `docs/audits/`: hồ sơ thẩm định từng mô hình.
- `docs/audits/EDUVERSE-MIGRATION-QUEUE.md`: danh sách 12 pilot và các điểm cần kiểm tra trước nghiệm thu.

Các mô hình chưa có trạng thái `validated` không được xem là nội dung đã nghiệm thu. Hiện có 12 mô hình độc lập được dựng lại ở trạng thái pilot trên nhánh `models/scientific-corrections`; chưa mô hình nào được nghiệm thu hoặc hiển thị trong danh mục chính thức.


## Trang lĩnh vực và không gian

- `field.html?id=<field-id>`: trang dùng chung cho sáu lĩnh vực; chỉ hiển thị mô hình đã thẩm định và kiểm thử.
- `space.html?id=<space-id>`: trang dùng chung cho mô phỏng, phòng thí nghiệm ảo, dữ liệu khoa học và thư viện học liệu.
- Các ID và nội dung nền được quản lý trong hai tệp JSON dưới `data/`.

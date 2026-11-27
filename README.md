# SCIAVERSE
Một môi trường khoa học số đa lĩnh vực, nhằm kết nối các lĩnh vực khoa học thông qua hệ thống mô phỏng, phòng thí nghiệm ảo, công cụ khám phá và nguồn học liệu nghiên cứu. SCIAVERSE hướng đến việc xây dựng không gian tương tác số, nơi người dùng có thể quan sát, thực nghiệm, tìm hiểu và nghiên cứu các hiện tượng, quy luật và tri thức khoa học.


## Cấu trúc nền tảng

- `data/fields.json`: sáu lĩnh vực khoa học hiện có.
- `data/spaces.json`: bốn không gian chức năng.
- `data/model-registry.json`: danh mục mô hình nguồn và trạng thái thẩm định.
- `docs/SCIAVERSE-ARCHITECTURE.md`: kiến trúc không gian khoa học.
- `docs/SCIENTIFIC-VALIDATION-STANDARD.md`: tiêu chuẩn thẩm định khoa học.
- `docs/audits/`: hồ sơ thẩm định từng mô hình.
- `docs/audits/EDUVERSE-MIGRATION-QUEUE.md`: danh sách 24 pilot độc lập, trạng thái thẩm định và các điểm cần kiểm tra trước nghiệm thu.

Các mô hình chưa có trạng thái `validated` không được xem là nội dung đã nghiệm thu. Hiện có 12 mô hình độc lập đã được xác nhận nghiệm thu khoa học ngày 26/11/2026 và được lưu trong `main`. Trạng thái triển khai vẫn là pilot; chưa đánh dấu `verified-in-build` vì còn thiếu kiểm thử runtime trên trình duyệt và thiết bị thật. Vì vậy, các mô hình chưa được đưa vào danh mục công bố chính thức.

Đợt tiếp nhận bản đồ từ EDUVERSE đã dựng thêm 4 pilot độc lập: Chuyển đổi quả Địa Cầu thành bản đồ, La bàn và phương hướng, Thay đổi tỉ lệ bản đồ, Đo khoảng cách thực tế. Bốn mô hình này đang `in-review` và `sciaverse-pilot-in-progress`; chưa được xem là đã nghiệm thu hoặc công bố.


## Trang lĩnh vực và không gian

- `field.html?id=<field-id>`: trang dùng chung cho sáu lĩnh vực; chỉ hiển thị mô hình đã thẩm định và kiểm thử.
- `space.html?id=<space-id>`: trang dùng chung cho mô phỏng, phòng thí nghiệm ảo, dữ liệu khoa học và thư viện học liệu.
- Các ID và nội dung nền được quản lý trong hai tệp JSON dưới `data/`.

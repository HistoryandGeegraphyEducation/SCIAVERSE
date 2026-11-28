# SCIAVERSE
Một môi trường khoa học số đa lĩnh vực, nhằm kết nối các lĩnh vực khoa học thông qua hệ thống mô phỏng, phòng thí nghiệm ảo, công cụ khám phá và nguồn học liệu nghiên cứu. SCIAVERSE hướng đến việc xây dựng không gian tương tác số, nơi người dùng có thể quan sát, thực nghiệm, tìm hiểu và nghiên cứu các hiện tượng, quy luật và tri thức khoa học.


## Cấu trúc nền tảng

- `data/fields.json`: sáu lĩnh vực khoa học hiện có.
- `data/spaces.json`: định nghĩa bốn không gian chức năng. Tệp này là danh mục nền, không xác nhận các không gian đã hoàn thiện.
- `data/model-registry.json`: danh mục mô hình nguồn và trạng thái thẩm định.
- `data/virtual-labs.json`: hồ sơ thí nghiệm ảo.
- `data/scientific-datasets.json`: bộ dữ liệu khoa học và nguồn cung cấp.
- `data/learning-resources.json`: tài nguyên học liệu và thông tin bản quyền.
- `data/model-knowledge-index.json`: liên kết mức kiến thức nâng cao với hồ sơ thẩm định.
- `docs/SCIAVERSE-ARCHITECTURE.md`: kiến trúc không gian khoa học.
- `docs/SCIENTIFIC-VALIDATION-STANDARD.md`: tiêu chuẩn thẩm định khoa học.
- `docs/audits/`: hồ sơ thẩm định từng mô hình.
- `docs/audits/EDUVERSE-MIGRATION-QUEUE.md`: danh sách 24 pilot độc lập, trạng thái thẩm định và các điểm cần kiểm tra trước nghiệm thu.

Các mô hình chưa có trạng thái `validated` không được xem là nội dung đã nghiệm thu. Hiện có 12 mô hình đã được xác nhận nghiệm thu khoa học ngày 26/11/2026. Registry có 25 đường dẫn triển khai: 23 mô hình đạt `verified-in-build`, 2 mô hình còn ở `sciaverse-pilot-in-progress` (tọa độ địa lí và cấu tạo bên trong Trái Đất). Có 13 mô hình `in-review` và 19 mô hình `not-reviewed`; trạng thái kỹ thuật không thay thế nghiệm thu khoa học. CI kiểm tra 25 trang ở bốn kích thước, nội dung Nâng cao, bàn phím, reduced motion và 23 nhóm tương tác mô hình. WebGL, cảm ứng và điều khiển 3D được kiểm tra trong các luồng tương ứng. Chưa kiểm thử thủ công trên thiết bị vật lý.

Đợt A đã kiểm thử 9 mô hình; Đợt B 5 mô hình; Đợt C 6 mô hình; Đợt D 3 mô hình. Các mô hình đang `in-review` chưa được xem là nghiệm thu khoa học, dù trạng thái triển khai đã đạt kiểm thử.


## Trang lĩnh vực và không gian

Không gian mô phỏng chỉ công bố mô hình đồng thời đạt `validated` và `verified-in-build`. Cả 25 trang mô hình hiện có bộ chọn mức kiến thức Cơ bản và Nâng cao; mức Nâng cao lấy nội dung khoa học liên quan từ hồ sơ thẩm định, không thay đổi trạng thái nghiệm thu.

Ba không gian còn lại đã có chức năng thử nghiệm:
- Phòng thí nghiệm ảo: một thí nghiệm con lắc đơn, cho phép thay đổi chiều dài, gia tốc trọng trường, khối lượng và góc lệch; tính chu kì và tần số theo mô hình con lắc đơn lí tưởng.
- Dữ liệu khoa học: một feed GeoJSON động đất của USGS ComCat, có bộ lọc khoảng thời gian và độ lớn, biểu đồ phân bố theo độ lớn và thống kê từ dữ liệu đã lọc.
- Thư viện học liệu: năm tài nguyên gồm tài liệu gốc, tài liệu diễn giải và một tài liệu SCIAVERSE biên soạn; có xuất xứ, giấy phép, lĩnh vực và liên kết tới mô hình hoặc thí nghiệm liên quan.

Đây là các pilot chức năng đầu tiên, chưa phải bộ sưu tập thí nghiệm, dữ liệu hoặc học liệu đầy đủ.

- `field.html?id=<field-id>`: trang dùng chung cho sáu lĩnh vực; chỉ hiển thị mô hình đã thẩm định và kiểm thử.
- `space.html?id=<space-id>`: trang dùng chung cho bốn không gian chức năng.
- `labs/simple-pendulum/`: mô-đun thí nghiệm con lắc đơn.
- `simulations/model-levels.js`: bộ chọn mức kiến thức dùng chung cho 25 trang mô hình.
- `vendor/`: Three.js r128 và OrbitControls được lưu cục bộ theo giấy phép MIT.
- `.github/workflows/sciaverse-validation.yml`: kiểm tra dữ liệu, đường dẫn, trình duyệt và responsive. Kết quả kiểm thử được xác nhận theo từng lần chạy workflow.

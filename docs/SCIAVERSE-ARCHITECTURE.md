# SCIAVERSE — Kiến trúc không gian khoa học số

## 1. Nguyên tắc tổ chức

SCIAVERSE là môi trường khoa học số đa lĩnh vực, độc lập với EDUVERSE. EDUVERSE chỉ là nguồn tham khảo trong giai đoạn nghiên cứu và tiếp nhận học liệu; không được trở thành phụ thuộc runtime, thư viện mã hoặc nguồn dữ liệu bắt buộc của SCIAVERSE.

Cấu trúc có ba lớp:

1. **Lĩnh vực khoa học**: phân loại tri thức và mô hình theo chuyên ngành.
2. **Không gian chức năng**: nơi người dùng thực hiện một loại hoạt động khoa học.
3. **Mô hình/học liệu**: đối tượng nội dung có hồ sơ, nguồn, trạng thái thẩm định và phiên bản riêng.

Một mô hình có một lĩnh vực chính và có thể gắn các lĩnh vực liên quan. Không nhân bản một mô hình chỉ để xuất hiện ở nhiều lĩnh vực.

## 2. Sáu lĩnh vực hiện có

Danh mục lĩnh vực được lưu trong `data/fields.json`. Phiên bản nền giữ nguyên sáu nhóm đã có trên giao diện SCIAVERSE:

- Trái Đất và môi trường
- Vũ trụ và thiên văn
- Vật lí
- Hóa học
- Sinh học
- Toán học và tin học

Không tự ý bổ sung lĩnh vực cấp cao hoặc công bố phân ngành mới là taxonomy chính thức nếu chưa được chủ dự án duyệt. Các phân ngành chi tiết trước mắt có thể được lưu dưới dạng thẻ chủ đề trong hồ sơ mô hình.

## 3. Bốn không gian chức năng

Định nghĩa chính thức của bốn không gian hiện có nằm trong `data/spaces.json`.

### Mô phỏng khoa học

Dành cho mô hình động, mô hình 3D, mô hình định lượng và mô hình khái niệm. Mỗi mô hình phải công bố nguyên lí, tham số, giả định và giới hạn.

### Phòng thí nghiệm ảo

Dành cho hoạt động có thao tác thí nghiệm, biến số, điều kiện ban đầu, quy trình và kết quả. Không gộp một mô hình trình diễn tĩnh vào phòng thí nghiệm nếu không có hoạt động thực nghiệm.

### Dữ liệu khoa học

Dành cho bộ dữ liệu có nguồn, đơn vị, phạm vi không gian, khoảng thời gian và phương pháp thu thập. Mọi dữ liệu mô phỏng hoặc dữ liệu mẫu phải được đánh dấu rõ.

### Thư viện học liệu

Dành cho tài liệu tham khảo, ảnh, bản đồ, video, bộ dữ liệu, thuật ngữ và tài nguyên có bản quyền được xác định.

## 4. Hồ sơ mô hình chuẩn

Mỗi mô hình cần có tối thiểu:

- ID ổn định, tên, mô tả và lĩnh vực chính.
- Mục tiêu học tập hoặc câu hỏi khoa học.
- Nguyên lí, quy luật, phương trình hoặc thuật toán.
- Tham số, đơn vị, miền giá trị và giá trị mặc định.
- Điều kiện ban đầu, giả định và điều kiện biên.
- Nguồn tham khảo cho nội dung và dữ liệu.
- Giới hạn áp dụng và những gì mô hình không mô tả.
- Trạng thái thẩm định, người/ngày thẩm định và phiên bản.
- Tệp triển khai, tài nguyên phụ thuộc và quy trình kiểm thử.

## 5. Vòng đời nội dung

`discovered → source-audited → scientifically-reviewed → implementation → verified → published`

Không được chuyển thẳng từ `discovered` sang `published`. Mô hình có sai số hoặc chưa đủ dữ liệu phải được đánh dấu `needs-revision` hoặc `blocked`, không được gắn nhãn đã xác thực.

## 6. Quy tắc tích hợp

- Mỗi mô hình được triển khai trong một thư mục hoặc mô-đun có ranh giới rõ.
- Không tải mã trực tiếp từ EDUVERSE khi SCIAVERSE chạy.
- Thư viện dùng chung phải có phiên bản và được kiểm thử riêng.
- Tài nguyên ngoài phải có nguồn, điều kiện sử dụng và phương án dự phòng.
- Mô hình phải hoạt động độc lập với trang tổng quan; lỗi một mô hình không được làm hỏng điều hướng hoặc các mô hình khác.
- Hỗ trợ điện thoại trước; WebGL phải có xử lí khi thiết bị không hỗ trợ hoặc thiếu tài nguyên.
- Có trạng thái tải, lỗi, dừng/chạy, đặt lại và giải phóng tài nguyên khi rời mô hình.
- Tôn trọng `prefers-reduced-motion`, bàn phím, độ tương phản và khả năng đọc trên màn hình nhỏ.

### Cấu trúc mô-đun triển khai

Mô hình độc lập được tổ chức dưới `simulations/<domain>/<model-id>/` với các tệp tối thiểu:

- `index.html`: cấu trúc trang và nội dung học tập.
- `main.js`: logic mô hình, công thức, tham số và xử lý tương tác.
- `styles.css`: giao diện thích ứng cho mô hình.

Các mô hình dùng chung bố cục có thể nạp `simulations/model-base.css`; không đưa nội dung khoa học riêng của mô hình vào stylesheet dùng chung. Mô hình dùng WebGL phải có giới hạn tài nguyên, xử lý lỗi khởi tạo, xử lý context loss nếu phù hợp và giải phóng tài nguyên khi rời trang. Nếu không có khả năng dự phòng tương đương, giao diện phải báo rõ thay vì hiển thị hình ảnh giả lập như dữ liệu thực.

Đường dẫn triển khai và trạng thái được khai báo trong `data/model-registry.json`. Một pilot chỉ được đưa vào trang lĩnh vực/không gian chính thức khi đồng thời đạt `scientificStatus: validated` và `implementationStatus: verified-in-build`. Trạng thái `sciaverse-pilot-in-progress` chỉ phục vụ kiểm tra nội bộ, không phải nghiệm thu.

## 7. Tách biệt dữ liệu và giao diện

Dữ liệu lĩnh vực, không gian và danh mục mô hình được lưu riêng với mã dựng giao diện. Nội dung khoa học không được chỉ tồn tại trong chuỗi HTML hoặc nhãn điều khiển. Nhờ đó, cùng một hồ sơ mô hình có thể được hiển thị trong lĩnh vực, không gian mô phỏng và thư viện mà không tạo bản sao.

## 8. Trạng thái hiện tại

Đây là kiến trúc nền được thiết lập cho giai đoạn tái cấu trúc. Những phần chưa có mô hình hoặc chức năng thực thi phải được thể hiện là chưa triển khai; không hiển thị số liệu, hoạt động hay nội dung giả lập như thể đã có thật.

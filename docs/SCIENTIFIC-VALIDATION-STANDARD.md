# SCIAVERSE — Tiêu chuẩn thẩm định khoa học mô hình

## 1. Mục đích

Tiêu chuẩn này áp dụng trước khi tiếp nhận, chỉnh sửa hoặc công bố mô hình khoa học. Việc một mô hình chạy được, có hình ảnh 3D hoặc có giao diện tương tác không đồng nghĩa với việc mô hình đúng khoa học.

## 2. Các lớp thẩm định bắt buộc

### A. Thẩm định kiến thức

- Định nghĩa hiện tượng, thuật ngữ và đơn vị có đúng không?
- Quan hệ nhân quả có được trình bày chính xác không?
- Có nhầm lẫn giữa các khái niệm gần nhau không?
- Nội dung có phù hợp cấp độ người học nhưng không làm sai bản chất khoa học không?

### B. Thẩm định mô hình khái niệm và toán học

- Xác định hệ thống, ranh giới, điều kiện ban đầu và điều kiện biên.
- Kiểm tra phương trình, quy luật, thuật toán và giả định.
- Kiểm tra thứ nguyên, đơn vị, dấu, hệ tọa độ và quy ước chiều.
- Đối chiếu các trường hợp giới hạn hoặc trường hợp chuẩn đã biết.
- Kiểm tra quan hệ giữa đầu vào và đầu ra, không chỉ quan sát hoạt ảnh.

### C. Thẩm định dữ liệu và tham số

- Truy xuất nguồn gốc dữ liệu.
- Ghi rõ đơn vị, thời gian, phạm vi không gian và phương pháp đo.
- Phân biệt dữ liệu đo, dữ liệu tổng hợp, dữ liệu mẫu và tham số điều khiển.
- Không gán độ chính xác thực nghiệm cho thông số minh họa.
- Ghi lại miền áp dụng và độ không chắc chắn khi có căn cứ.

### D. Thẩm định trực quan hóa

- Hình dạng, hướng, tỉ lệ tương đối và chuyển động có phản ánh đúng cơ chế không?
- Những yếu tố không theo tỉ lệ có được ghi rõ không?
- Ánh sáng, màu sắc, chú giải và hiệu ứng có gây hiểu sai không?
- Chuyển động có đúng hướng và quan hệ thời gian không?
- Không dùng hiệu ứng trực quan thay cho giải thích cơ chế.

### E. Thẩm định sư phạm

- Mục tiêu học tập có thể quan sát hoặc đánh giá không?
- Người học có hiểu được biến nào đang thay đổi và hệ quả nào được quan sát không?
- Điều khiển có ý nghĩa khoa học, không chỉ là hiệu ứng trang trí không?
- Có câu hỏi khám phá, giải thích hoặc kiểm tra hiểu biết phù hợp không?

### F. Kiểm thử phần mềm

- Mô hình khởi tạo, tạm dừng, tiếp tục, đặt lại và giải phóng tài nguyên đúng.
- Thay đổi kích thước màn hình không làm sai bố cục hoặc tỉ lệ hình học.
- Không có lỗi console nghiêm trọng hoặc rò rỉ animation loop.
- Có phương án khi WebGL, mạng hoặc tài nguyên ngoài không khả dụng.
- Kiểm thử trên màn hình điện thoại, bàn phím và chế độ giảm chuyển động.

## 3. Hồ sơ nguồn

Ưu tiên nguồn theo thứ tự:

1. Cơ quan khoa học, cơ quan dữ liệu và tổ chức nghiên cứu có thẩm quyền.
2. Bài báo khoa học bình duyệt, sách chuyên khảo và giáo trình đại học.
3. Tài liệu kỹ thuật, tiêu chuẩn và bộ dữ liệu có phương pháp công bố.
4. Tài liệu giáo dục chính thống dùng để xác định mức độ trình bày.

Mỗi nguồn phải thực sự hỗ trợ nhận định được trích dẫn. Ghi tác giả/tổ chức, tên tài liệu, năm, URL hoặc DOI khi có, ngày truy cập và phần nội dung được sử dụng. Không suy diễn từ tiêu đề hoặc đoạn trích ngắn.

## 4. Trạng thái nghiệm thu

- `not-reviewed`: chưa thẩm định.
- `in-review`: đang đối chiếu nguồn và mã.
- `needs-revision`: có lỗi hoặc thiếu căn cứ cần sửa.
- `blocked`: thiếu nguồn hoặc dữ liệu để kết luận.
- `validated`: đã vượt qua các lớp thẩm định áp dụng và có hồ sơ nguồn.
- `verified-in-build`: ngoài trạng thái validated, phiên bản triển khai đã được kiểm thử theo tiêu chí kỹ thuật.

Không dùng một nhãn chung như “chính xác 100%”. Thẩm định phải nêu rõ phạm vi và giới hạn.

## 5. Phiếu thẩm định cho từng mô hình

Mỗi hồ sơ phải trả lời:

1. Mô hình đang giải thích điều gì?
2. Kiến thức chuẩn và nguồn nào làm căn cứ?
3. Cơ chế hoặc phương trình hiện tại trong mã là gì?
4. Điểm nào đúng, sai, thiếu hoặc chưa thể xác minh?
5. Tham số nào cần thay đổi và tại sao?
6. Những giả định/giới hạn nào phải hiển thị cho người học?
7. Kiểm thử nào chứng minh mô hình hoạt động đúng trong phạm vi đã nêu?
8. Phiên bản nào được nghiệm thu và ngày thẩm định?

## 6. Quy tắc tiếp nhận từ EDUVERSE

- Đọc và phân tích mã nguồn gốc; không sao chép giao diện trước khi hiểu cơ chế.
- Không kéo trực tiếp tệp hoặc thư viện runtime từ EDUVERSE.
- Giữ ghi nhận nguồn gốc và lịch sử chuyển đổi.
- Tái triển khai theo kiến trúc SCIAVERSE, dùng dữ liệu khoa học đã thẩm định.
- Nếu mô hình gốc sai về nguyên lí, chỉ giữ lại ý tưởng học tập; viết lại cơ chế.
- Nếu không thể xác minh, không đưa vào danh mục công bố.

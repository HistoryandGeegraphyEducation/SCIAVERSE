# Thẩm định nguồn gốc — Động đất

- Mã nguồn: `EDUVERSE/js/sims/quake.js`
- Trạng thái: `in-review`
- Phạm vi: độ lớn Mw, độ sâu chấn tiêu, độ trượt, mặt đứt gãy và sóng địa chấn.

## Căn cứ khoa học

USGS mô tả động đất là sự trượt đột ngột trên đứt gãy; moment magnitude liên hệ với mômen địa chấn, được xác định từ độ trượt trung bình, diện tích đứt gãy và môđun trượt: https://earthquake.usgs.gov/data/finitefault/ . P, S và sóng mặt có cơ chế, vận tốc và dạng dao động khác nhau: https://www.usgs.gov/programs/earthquake-hazards/seismographs-keeping-track-earthquakes .

## Kết quả đọc mã

- Có các đầu vào độ lớn 3–9.5 Mw, độ sâu 5–60 km và độ trượt 0.2–8 m.
- Chấn tiêu được đặt theo độ sâu; chấn tâm được đặt thẳng đứng phía trên. Đây là quan hệ hình học đúng.
- Độ trượt và độ lớn được dùng để tạo độ dịch chuyển mảng bằng một hàm tỉ lệ tuyến tính giản lược; chưa có diện tích mặt đứt gãy hoặc môđun trượt để tính mômen địa chấn.
- Hai nhóm sóng vỏ được tạo bằng các vỏ cầu lan truyền với tốc độ 3.1 và 5.2 đơn vị mô hình/giây; các tốc độ này không gắn với km/s hoặc môi trường địa chất.
- Sóng mặt được biểu diễn bằng các vòng tròn phẳng, không phân biệt Love và Rayleigh.
- Giao diện đã ghi kích thước, độ trượt và tốc độ hoạt ảnh không theo tỉ lệ thực; đây là giới hạn tốt nhưng chưa đủ để gọi là mô phỏng định lượng.

## Điều chỉnh bắt buộc trước khi tiếp nhận

1. Chọn rõ mục tiêu: mô hình khái niệm đứt gãy hay mô hình động lực học địa chấn. Không trộn hai mức độ.
2. Nếu giữ Mw và độ trượt, bổ sung diện tích đứt gãy và môđun trượt để kiểm tra mômen địa chấn; nếu không, bỏ quan hệ nhân quả định lượng giữa các tham số.
3. Gắn nhãn P, S và sóng mặt; thể hiện phương dao động khác nhau, thứ tự đến và giới hạn truyền qua các lớp.
4. Nêu rõ mô hình chỉ mô tả động đất nông nếu giữ miền độ sâu 5–60 km.
5. Không quy đổi Mw trực tiếp thành cường độ rung lắc tại một địa điểm; cường độ còn phụ thuộc khoảng cách, địa chất nền và điều kiện địa phương.
6. Đơn vị và tỉ lệ phải được hiển thị riêng cho đại lượng thực và đơn vị nội bộ của hoạt ảnh.

Chưa đủ điều kiện nghiệm thu.

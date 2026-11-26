# Thẩm định nguồn gốc — Xác định tọa độ địa lí

- Mã nguồn: `EDUVERSE/js/sims/geo-01-coordinates/main.js`
- Trạng thái: `in-review`
- Phạm vi: định nghĩa vĩ độ/kinh độ, lưới kinh-vĩ tuyến, chuyển đổi tọa độ và điểm khảo sát.

## Căn cứ khoa học

NOAA định nghĩa vĩ độ theo vị trí Bắc/Nam so với xích đạo, từ 0° đến 90°; kinh độ theo vị trí Đông/Tây so với kinh tuyến gốc, từ 0° đến 180°: https://oceanservice.noaa.gov/facts/latitude.html và https://oceanservice.noaa.gov/facts/longitude.html . NOAA cũng lưu ý Trái Đất gần ellipsoid hơn là hình cầu hoàn hảo; tọa độ chính xác cao cần dùng vĩ độ trắc địa: https://oceanservice.noaa.gov/facts/latitude.html .

## Kết quả đọc mã

- Slider vĩ độ từ -90° đến +90°, kinh độ từ -180° đến +180°; cách biểu diễn miền giá trị phù hợp.
- Công thức đặt điểm trên mặt cầu:
  - (x=r\cos\varphi\cos\lambda)
  - (y=r\sin\varphi)
  - (z=r\cos\varphi\sin\lambda)
  tương ứng với hệ tọa độ hình cầu có vĩ độ φ và kinh độ λ.
- Vĩ tuyến, kinh tuyến, xích đạo và kinh tuyến gốc được tạo riêng; vị trí điểm được cập nhật từ cặp tọa độ.
- Nội dung giải thích vĩ độ, kinh độ và thứ tự ghi vĩ độ trước kinh độ phù hợp với hướng dẫn NOAA.
- Mô hình dùng hình cầu, không phải ellipsoid WGS84; đây là giản lược có thể chấp nhận cho bài học nhập môn nếu ghi rõ.
- Ảnh texture được tải từ ví dụ Three.js `earth_atmos_2048.jpg`; không có thông tin nguồn dữ liệu/bản quyền trong hồ sơ mô hình.
- Khi texture không tải được, mã giữ lại lớp màu đất/biển procedural với các mảng lục địa thô; không đủ chính xác để nhận dạng vị trí địa lí.
- Slider chỉ thao tác theo từng độ; không hỗ trợ phút/giây hoặc độ thập phân.

## Điều chỉnh bắt buộc trước khi tiếp nhận

1. Thay texture bằng bản đồ toàn cầu có nguồn và quyền sử dụng rõ ràng; không dùng các mảng lục địa procedural như bản đồ dự phòng.
2. Ghi rõ mô hình dùng hình cầu để minh họa; không dùng cho đo đạc hoặc định vị chính xác.
3. Kiểm thử hướng kinh độ Đông/Tây và điểm ở các kinh tuyến 0°, 90°, 180°, -90°; kiểm tra vĩ độ ±90°.
4. Bổ sung định dạng độ-phút-giây hoặc độ thập phân nếu mục tiêu học tập yêu cầu độ chính xác cao hơn.
5. Nêu rõ kinh tuyến gốc theo quy ước Greenwich/IRM khi chuyển từ bài học bản đồ sang dữ liệu định vị hiện đại.
6. Bảo đảm điểm đánh dấu không trượt khỏi mặt cầu khi người dùng kéo hoặc xoay góc nhìn.

Các định nghĩa cơ bản đúng; vấn đề chính nằm ở nguồn bản đồ, giới hạn hình cầu và độ phân giải điều khiển.

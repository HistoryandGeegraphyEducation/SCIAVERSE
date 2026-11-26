# Thẩm định nguồn gốc — Bão nhiệt đới

- Mã nguồn: `EDUVERSE/simulations/natural-hazards/bao-nhiet-doi/main.js`
- Trạng thái: `in-review`
- Phạm vi: cấu trúc bão, mắt bão, dải mưa, gió và các giai đoạn phát triển.

## Căn cứ khoa học

NOAA mô tả bão nhiệt đới là hệ áp thấp lõi nóng, hình thành trên vùng biển nhiệt đới/cận nhiệt đới khi có các điều kiện thuận lợi; cấu trúc gồm mắt bão, thành mắt và các dải mưa. Hướng xoáy khác nhau giữa hai bán cầu: https://www.noaa.gov/jetstream/tropical/tropical-cyclone-introduction và https://www.noaa.gov/jetstream/tropical/tropical-cyclone-introduction/tropical-cyclone-structure .

## Kết quả đọc mã

- Tham số duy nhất là tốc độ gió 40–220 km/h.
- Giai đoạn mô tả nhiễu động, áp thấp, bão phát triển và suy yếu.
- Hình xoáy được tạo bằng đường xoắn và các cụm mây procedural; slider tốc độ gió chủ yếu thay đổi kích thước xoáy, không giải động lực khí quyển.
- Không có tham số nhiệt độ mặt biển, độ ẩm, độ đứt gió theo chiều thẳng đứng, vị trí vĩ độ hoặc Coriolis.
- Không có chế độ Bắc bán cầu/Nam bán cầu để thể hiện chiều xoáy khác nhau.
- Mắt bão được dựng như một hình học đơn giản; không thể hiện đầy đủ thành mắt và cấu trúc đối lưu.

## Điều chỉnh bắt buộc trước khi tiếp nhận

1. Giữ mô hình ở cấp độ khái niệm; không gọi là mô hình dự báo.
2. Thêm bán cầu và đảo chiều hoàn lưu theo quy tắc khí tượng; ghi rõ quy ước hướng nhìn.
3. Phân biệt gió cực đại duy trì với gió giật; không dùng một con số gió như toàn bộ trạng thái bão.
4. Nêu các điều kiện môi trường chính: biển ấm, ẩm, nhiễu động ban đầu và độ đứt gió thấp; không khẳng định một điều kiện đơn lẻ đủ tạo bão.
5. Mắt bão, thành mắt và dải mưa phải được chú giải đúng; không phải mọi giai đoạn đều có mắt rõ.
6. Các thông số hoạt ảnh phải được ghi là hệ số trực quan nếu chưa có mô hình khí động lực học.

Chưa đủ điều kiện nghiệm thu.

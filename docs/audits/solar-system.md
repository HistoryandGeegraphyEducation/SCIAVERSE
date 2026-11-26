# Thẩm định nguồn gốc — Khám phá các hành tinh

- Mã nguồn: `EDUVERSE/js/sims/solar-system-explorer.js`
- Trạng thái: `in-review`
- Phạm vi: dữ liệu hành tinh, tỉ lệ hình học, chuyển động quỹ đạo/tự quay và texture.

## Căn cứ khoa học

Dữ liệu chuẩn cần đối chiếu với NASA/JPL Planetary Physical Parameters: https://ssd.jpl.nasa.gov/planets/phys_par.html . NASA công bố riêng bán kính, khối lượng, mật độ, chu kỳ tự quay sao và chu kỳ quỹ đạo. Các đại lượng này không thể thay thế lẫn nhau.

## Kết quả đọc mã

- Danh sách có tám hành tinh, phù hợp phân loại hành tinh hiện hành.
- Các thông tin đường kính, khối lượng, khoảng cách và chu kỳ được lưu dưới dạng chuỗi tĩnh; chưa có metadata cho nguồn, epoch, định nghĩa trung bình hoặc quy ước đơn vị.
- Bán kính dựng hình và bán kính quỹ đạo được nén độc lập; không theo cùng một tỉ lệ vật lí. Ví dụ bán kính Jupiter trong dữ liệu là 1.45 đơn vị, trong khi bán kính Trái Đất là 0.62; tỉ lệ này không phản ánh tỉ lệ bán kính thực.
- Tốc độ quỹ đạo và tự quay dùng các hằng số animation riêng; chưa chứng minh tương quan với chu kỳ JPL.
- Hàm `createPlanetTexture` tạo texture bằng Canvas và thuật toán procedural; không phải ảnh quan trắc bề mặt/hệ mây từ NASA.
- Các giá trị nhiệt độ hành tinh khí khổng lồ cần ghi rõ là nhiệt độ tầng mây/đỉnh mây, không gọi chung là nhiệt độ bề mặt.
- Chu kỳ quay của Sao Kim và Sao Thiên Vương có chiều quay nghịch hành; phải phân biệt chu kỳ quay sao với ngày Mặt Trời.

## Điều chỉnh bắt buộc trước khi tiếp nhận

1. Thay dữ liệu tĩnh bằng bảng dữ liệu có nguồn JPL/NASA, đơn vị và ngày cập nhật.
2. Ghi rõ hai chế độ: **kích thước và khoảng cách theo tỉ lệ** (nếu không thể cùng hiển thị, dùng hai tỉ lệ có chú giải) và **minh họa nén**.
3. Tính hoặc cấu hình tốc độ từ chu kỳ quỹ đạo/tự quay; nếu tăng tốc để quan sát, công bố hệ số tua.
4. Thay texture procedural bằng ảnh có nguồn; nếu giữ texture tổng hợp, phải gắn nhãn “minh họa”.
5. Phân biệt chu kỳ quay sao, ngày Mặt Trời và hướng quay thuận/nghịch hành.
6. Bổ sung phương án mô tả và kiểm tra quỹ đạo elip, độ lệch tâm và mặt phẳng quỹ đạo; không dựng tất cả như vòng tròn nếu nội dung yêu cầu kiến thức quỹ đạo chính xác.

Chưa đủ điều kiện công bố phiên bản SCIAVERSE.

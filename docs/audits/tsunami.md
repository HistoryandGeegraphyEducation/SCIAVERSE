# Thẩm định nguồn gốc — Sóng thần 3D

- Mã nguồn: `EDUVERSE/js/sims/tsunami.js`
- Trạng thái: `in-review`
- Phạm vi: tốc độ sóng, độ sâu, dịch chuyển đáy biển, shoaling và ngập ven bờ.

## Căn cứ khoa học

NOAA nêu vận tốc sóng thần ngoài khơi có thể ước tính bằng (c=\sqrt{gh}), phụ thuộc độ sâu nước; khi vào vùng nước nông, sóng chậm lại, bước sóng giảm và chiều cao có thể tăng: https://noaa.gov/jetstream/tsunamis/tsunami-propagation .

## Kết quả đọc mã

- Mã dùng `sqrt(9.81 × depth)` để tính vận tốc lý thuyết. Quan hệ này phù hợp với xấp xỉ sóng nước nông đối với sóng dài.
- Hàm `waveSpeed` đổi sang km/s rồi chuyển lại m/s khi hiển thị; cần kiểm thử đơn vị xuyên suốt.
- Biên độ được tính từ độ sâu, độ dịch chuyển và Mw bằng quan hệ thực nghiệm tự đặt; chưa có căn cứ nguồn cho hệ số và hàm mũ đang dùng.
- Địa hình đáy biển và bờ biển được tạo bằng hàm toán học; không phải bathymetry hoặc DEM đo đạc.
- Mực nước ngập được biểu diễn bằng mặt phẳng phóng đại; mô hình không giải phương trình nước nông phi tuyến, không mô phỏng vỡ sóng, ma sát, run-up hoặc dòng chảy ngập.
- Phần giải thích đã ghi rõ không dùng để dự báo vùng ngập; cần giữ cảnh báo này ở mọi bản dựng.

## Điều chỉnh bắt buộc trước khi tiếp nhận

1. Giữ (c=\sqrt{gh}) như công thức tốc độ lý thuyết, ghi rõ giả định sóng dài/nước nông và đơn vị.
2. Không gắn Mw trực tiếp với biên độ sóng bằng hệ số tùy ý. Cần mô hình nguồn có độ trượt, diện tích và hướng đứt gãy hoặc loại bỏ giá trị biên độ định lượng.
3. Tách ba nội dung: phát sinh do dịch chuyển đáy biển, truyền qua đại dương, biến đổi khi vào vùng nước nông.
4. Ghi địa hình là địa hình tổng hợp, không theo tỉ lệ; nếu dùng bản đồ thực phải có nguồn bathymetry/DEM.
5. Mọi vùng ngập phải mang nhãn “minh họa”, không đưa ra dự báo độ sâu hoặc phạm vi thực tế.
6. Bổ sung kiểm tra hướng dịch chuyển đáy biển và trường hợp nguồn không tạo sóng thần đáng kể.

Công thức vận tốc là phần có thể giữ; phần tạo biên độ và ngập cần viết lại hoặc giới hạn rõ.

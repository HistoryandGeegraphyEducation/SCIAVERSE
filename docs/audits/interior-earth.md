# Thẩm định nguồn gốc — Cấu tạo bên trong Trái Đất

- Mã nguồn: `EDUVERSE/js/sims/interior-earth.js`
- Trạng thái: `in-review`
- Phạm vi: ranh giới các lớp, trạng thái vật chất, thành phần, tỉ lệ và sóng địa chấn.

## Căn cứ khoa học

USGS mô tả vỏ, lớp phủ và nhân; lớp phủ dày khoảng 2.900 km, nhân ngoài lỏng, nhân trong rắn. Vỏ đại dương thường mỏng hơn vỏ lục địa: https://pubs.usgs.gov/gip/dynamic/inside.html . USGS cũng nêu bằng chứng cấu trúc bên trong từ dữ liệu địa chấn: https://www.usgs.gov/publications/interior-earth-elementary-description .

## Kết quả đọc mã

- Các lớp được khai báo theo thứ tự vỏ, lớp phủ, nhân ngoài, nhân trong.
- Bán kính lớp dùng các giá trị 1, 0.9945, 0.545 và 0.192. Ranh giới nhân ngoài/nhân trong xấp xỉ với bán kính địa vật lí phổ biến.
- Mã ghi lớp phủ “chủ yếu rắn, biến dạng chậm”, nhân ngoài “lỏng”, nhân trong “rắn”; các diễn giải này phù hợp ở cấp độ phổ thông.
- Câu hỏi về sóng S không truyền qua nhân ngoài lỏng và sóng P truyền qua rắn/lỏng được nêu đúng về nguyên tắc.
- Vỏ được mô hình hóa như lớp vỏ đồng nhất; giá trị bán kính tạo độ dày tương đương khoảng vài chục km, không biểu diễn khác biệt vỏ đại dương và vỏ lục địa.
- Chế độ “dòng chảy” dùng các đường chuyển động minh họa, không giải mô hình đối lưu nhiệt hoặc động lực học lớp phủ.
- Chế độ “phóng đại vỏ” làm thay đổi hình học; nếu không ghi rõ đây là phóng đại thì dễ gây hiểu sai tỉ lệ.

## Điều chỉnh bắt buộc trước khi tiếp nhận

1. Công bố rõ mặt cắt có tỉ lệ gần đúng và phần vỏ có thể được phóng đại.
2. Phân biệt vỏ đại dương/vỏ lục địa hoặc ghi rõ vỏ đang được giản lược.
3. Ghi chú lớp phủ là chất rắn có khả năng biến dạng dẻo và chảy chậm theo thời gian địa chất; không mô tả như đại dương magma lỏng.
4. Phân biệt sơ đồ sóng P/S với mô phỏng đường đi địa chấn định lượng.
5. Kiểm tra nguồn và quyền sử dụng ảnh nền Blue Marble; bổ sung metadata hình ảnh.
6. Kiểm tra dữ liệu độ sâu và ranh giới lớp với nguồn địa vật lí được trích dẫn.

Nội dung khái niệm có nền tảng tốt hơn một số mô hình thiên tai, nhưng vẫn cần hoàn thiện hồ sơ nguồn và tỉ lệ trước khi công bố.

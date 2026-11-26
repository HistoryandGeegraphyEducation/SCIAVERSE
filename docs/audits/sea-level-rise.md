# Thẩm định nguồn gốc — Nước biển dâng

- Mã nguồn: `EDUVERSE/simulations/natural-hazards/nuoc-bien-dang/main.js`
- Trạng thái: `in-review`
- Phạm vi: mực nước tăng, địa hình bờ, vùng ngập và đường bờ.

## Căn cứ khoa học

NOAA phân biệt mực nước biển toàn cầu với mực nước tương đối tại địa phương; chuyển động thẳng đứng của đất, dòng biển và điều kiện khu vực làm mức thay đổi khác nhau theo vị trí: https://www.noaa.gov/explainers/tracking-sea-level-rise-and-fall . NOAA Digital Coast dùng mực nước tham chiếu địa phương và dữ liệu cao độ, đồng thời cảnh báo giới hạn độ tin cậy của dữ liệu ngập: https://coast.noaa.gov/slr/index.html .

## Kết quả đọc mã

- Đầu vào là mức nước tăng 0–2 m, đơn vị mét.
- Địa hình bờ biển được tạo bằng hàm tổng hợp; không có DEM hoặc mốc cao độ địa phương.
- Mặt nước được nâng theo slider; đường bờ dịch chuyển theo một hệ số hình học tự đặt.
- Nhà cửa đổi màu khi cao độ giả định thấp hơn mực nước; chưa có mô hình thủy lực, kết nối thủy văn hoặc dữ liệu địa hình thực.
- Nội dung đã phân biệt nước biển dâng dài hạn với triều, nước dâng do bão và sóng thần; cần giữ phân biệt này.

## Điều chỉnh bắt buộc trước khi tiếp nhận

1. Định nghĩa mốc tham chiếu mực nước: MSL, MHHW hoặc datum địa phương; không để “mực nước tăng” đứng độc lập.
2. Phân biệt nước biển dâng toàn cầu và mực nước biển tương đối tại địa phương; ghi ảnh hưởng sụt lún/nâng đất.
3. Dùng DEM và thông tin kết nối thủy văn nếu muốn mô phỏng phạm vi ngập thực; dữ liệu cần có nguồn, độ phân giải và sai số.
4. Nếu địa hình vẫn là hình học tổng hợp, gắn nhãn “sa bàn minh họa”, không công bố diện tích ngập hoặc đường bờ thực.
5. Không gộp nước biển dâng dài hạn với nước dâng do bão, triều, sóng hoặc sóng thần.
6. Nêu giới hạn rằng độ cao mặt nước không tự quyết định toàn bộ phạm vi ngập; địa hình, thoát nước, đê điều và kết nối với biển cũng quan trọng.

Chưa đủ điều kiện nghiệm thu.

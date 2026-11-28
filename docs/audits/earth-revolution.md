# Phiếu thẩm định — Trái Đất chuyển động quanh Mặt Trời

## 1. Phạm vi

Mô hình trình bày bốn vị trí mốc trên quỹ đạo: xuân phân, hạ chí, thu phân và đông chí. Trục quay của Trái Đất nghiêng 23,44° so với phương vuông góc mặt phẳng quỹ đạo và giữ hướng gần như cố định trong không gian.

Mô hình tập trung vào quan hệ giữa vị trí trên quỹ đạo, hướng trục nghiêng và mùa ở hai bán cầu. Người dùng có thể chọn bốn mốc phân/chí hoặc điều khiển ngày mô phỏng liên tục trong một năm 365,2422 ngày. Đây là thời gian mô phỏng giản đồ, không phải ephemeris hoặc lịch thiên văn chính xác theo năm.

## 2. Cơ sở khoa học

- Trái Đất hoàn thành một vòng chuyển động quanh Mặt Trời trong khoảng một năm.
- Trục quay nghiêng khoảng 23,4° so với phương vuông góc mặt phẳng quỹ đạo; hướng trục thay đổi rất chậm so với thời gian một năm.
- Vào hạ chí tháng 6, bán cầu Bắc nghiêng về phía Mặt Trời; vào đông chí tháng 12, bán cầu Bắc nghiêng xa Mặt Trời. Mùa ở hai bán cầu trái ngược nhau.
- Vào hai thời điểm phân, điểm Mặt Trời thiên đỉnh ở gần xích đạo và thời lượng ngày, đêm gần bằng nhau. Giá trị thực tế không hoàn toàn bằng nhau ở mọi vĩ độ do kích thước biểu kiến của Mặt Trời và khúc xạ khí quyển.
- Mùa chủ yếu do độ nghiêng trục làm thay đổi góc chiếu và thời lượng chiếu sáng theo mùa, không phải do Trái Đất gần hoặc xa Mặt Trời.

## 3. Biểu diễn và giả định

- Quỹ đạo được biểu diễn bằng đường tròn; độ lệch tâm quỹ đạo thực không được mô phỏng.
- Bốn vị trí là các mốc giản đồ. Ngày lịch ghi trong phần giải thích là khoảng ngày thường gặp, không phải thời điểm thiên văn cố định cho mọi năm và múi giờ.
- Hướng trục được giữ cố định trong hệ tọa độ không gian của mô hình. Không mô phỏng tiến động, chương động hoặc biến thiên độ nghiêng trục.
- Kích thước Mặt Trời, Trái Đất và khoảng cách giữa chúng không theo tỉ lệ.
- Earth Blue Marble là texture bề mặt có nguồn dữ liệu lịch sử; không phải ảnh trực tiếp theo thời gian thực.
- Mô hình không mô phỏng chuyển động tự quay trong ngày, độ dài ngày theo vĩ độ, lượng bức xạ tích phân, khí quyển hoặc đáp ứng nhiệt của bề mặt.

## 4. Kiểm tra logic

Các trường hợp cần xác nhận:
- Hạ chí: thành phần hướng trục Bắc cùng hướng với vector từ Trái Đất về Mặt Trời; bán cầu Bắc nghiêng về phía Mặt Trời.
- Đông chí: thành phần hướng trục Bắc ngược hướng vector từ Trái Đất về Mặt Trời; bán cầu Bắc nghiêng xa Mặt Trời.
- Xuân phân và thu phân: trục gần vuông góc với hướng Trái Đất–Mặt Trời.
- Thay đổi mốc mùa: vị trí Trái Đất thay đổi nhưng hướng trục trong không gian không đổi.
- Mặt Trời luôn ở tâm quỹ đạo; không thay đổi khoảng cách theo một quỹ đạo elip giả lập.
- Bộ điều khiển thời gian thay đổi vị trí theo góc quỹ đạo giản đồ; tốc độ chọn là số ngày mô phỏng mỗi giây, không phải tốc độ vận tốc quỹ đạo vật lí.

Đây là kiểm tra logic hình học. Chưa có kiểm thử runtime WebGL trong trình duyệt ở lượt triển khai này.

## 5. Nguồn tham khảo

1. U.S. Naval Observatory. *The Seasons and the Earth's Orbit*. https://aa.usno.navy.mil/faq/seasons_orbit. Cơ sở về độ nghiêng trục, hướng trục gần cố định, các chí điểm và phân điểm.
2. NASA Science. *Seasons on Earth, Mars, and Beyond*. https://science.nasa.gov/helio-and-you-seasons-on-earth-mars-and-beyond/. Đối chiếu cơ chế mùa, góc chiếu và sự khác nhau giữa hai bán cầu.

## 6. Trạng thái

- Khoa học: `in-review`.
- Triển khai: `sciaverse-pilot-in-progress`.
- Đã tạo mô-đun HTML, JavaScript và CSS độc lập.
- Đã dùng texture NASA Blue Marble cục bộ, có nguồn dự phòng trực tuyến; không tạo bản đồ Trái Đất giả khi tải ảnh lỗi.
- Chưa được xác nhận nghiệm thu khoa học.
- Đã bổ sung thanh thời gian ngày trong năm, chạy/tạm dừng/đặt lại và chọn số ngày mô phỏng mỗi giây.
- Trạng thái khoa học vẫn là `in-review`; trạng thái triển khai vẫn là `sciaverse-pilot-in-progress`.
- Kiểm thử trình duyệt tự động đang chờ kết quả workflow; chưa xác nhận runtime hoặc thiết bị di động.

# Phiếu thẩm định — Chuyển động các mảng kiến tạo

## 1. Phạm vi

Mô hình minh họa ba kiểu ranh giới mảng: tách giãn, hội tụ và trượt ngang. Chế độ hội tụ được giới hạn ở một ví dụ: mảng đại dương hút chìm dưới mảng lục địa.

Đây là mô hình khái niệm ba chiều. Không dùng để xác định chuyển động của một cặp mảng thực, tính tốc độ GPS, mô phỏng dòng đối lưu manti hoặc dự báo động đất, núi lửa.

## 2. Cơ sở khoa học

### Ranh giới tách giãn

Hai mảng chuyển động ra xa nhau. Ở ranh giới tách giãn dưới đại dương, vật chất nóng từ manti đi lên, nguội và kết tinh để tạo vỏ đại dương mới tại sống núi giữa đại dương. Ranh giới tách giãn cũng có thể hình thành thung lũng tách giãn trên lục địa.

### Ranh giới hội tụ

Hai mảng chuyển động về phía nhau. Khi mảng đại dương hội tụ với mảng lục địa, phần thạch quyển đại dương thường có độ đặc lớn hơn và chìm xuống dưới mảng lục địa. Đới hút chìm có thể đi kèm rãnh đại dương, động đất và cung núi lửa. Mô hình không đại diện cho hội tụ lục địa–lục địa hoặc đại dương–đại dương.

### Ranh giới trượt ngang

Hai mảng trượt tương đối theo phương ngang. Chuyển động này không tạo mới hoặc tiêu hủy thạch quyển tại ranh giới; ứng suất tích lũy và giải phóng dọc đứt gãy có thể gây động đất.

### Tốc độ chuyển động

USGS cho biết các mảng chuyển động với tốc độ khác nhau, từ dưới 1 đến trên 15 cm/năm. Tốc độ thực phụ thuộc mảng, vị trí và khoảng thời gian đo. Thanh trượt 0,5–20 cm/năm trong mô hình chỉ là giá trị kịch bản để biểu diễn độ lớn tương đối; không phải dữ liệu của một cặp mảng cụ thể.

## 3. Biểu diễn và giả định

- Không gian được xấp xỉ bằng mặt cắt phẳng cục bộ; bề mặt Trái Đất không được biểu diễn như một hình cầu.
- Kích thước các khối, độ dày mảng, góc hút chìm, chiều rộng khe tách giãn và độ cao sống núi không theo tỉ lệ.
- Các mũi tên biểu diễn hướng và độ lớn tương đối. Mô hình không tích phân vận tốc theo thời gian để tính dịch chuyển địa chất.
- Manti là nền minh họa. Không có mô hình nhiệt, lưu biến, đối lưu, lực kéo mảng chìm hoặc lực đẩy sống núi.
- Chế độ hội tụ chỉ minh họa hút chìm đại dương–lục địa; không khái quát cho mọi ranh giới hội tụ.
- Chế độ trượt ngang chỉ biểu diễn chuyển động tương đối. Không mô phỏng ma sát, khóa đứt gãy, tốc độ trượt tức thời hoặc chu kỳ động đất.
- Không có dữ liệu địa hình, địa chấn hoặc GPS quan trắc.

## 4. Kiểm tra logic

Các trường hợp cần kiểm tra khi chạy mô hình:
- Tách giãn: hai mũi tên hướng ra xa ranh giới; khối vật chất đi lên nằm giữa hai mảng.
- Hội tụ: hai mũi tên hướng vào ranh giới; mảng đại dương nghiêng xuống dưới mảng lục địa.
- Trượt ngang: hai mũi tên song song với ranh giới và ngược chiều nhau.
- Thay đổi tốc độ: độ dài mũi tên thay đổi theo giá trị thanh trượt; hướng chuyển động không đổi.
- Chuyển kiểu ranh giới: hình học, mũi tên, tiêu đề và nội dung giải thích phải chuyển cùng một trạng thái.

Các kiểm tra trên mô tả logic cần xác nhận. Chưa có kiểm thử runtime WebGL trong trình duyệt ở lượt triển khai này.

## 5. Nguồn tham khảo

1. U.S. Geological Survey. *Understanding Plate Motions*. https://pubs.usgs.gov/gip/dynamic/understanding.html. Cơ sở phân loại ranh giới tách giãn, hội tụ và trượt ngang; mô tả quá trình tạo mới và tiêu hủy thạch quyển.
2. NOAA Ocean Exploration. *What are the different types of plate tectonic boundaries?* https://oceanexplorer.noaa.gov/ocean-fact/plate-boundaries/. Đối chiếu hướng chuyển động và các đặc trưng địa chất chính của ba kiểu ranh giới.
3. U.S. Geological Survey. *How fast do tectonic plates move?* https://www.usgs.gov/faqs/how-fast-do-tectonic-plates-move. Cơ sở cho khoảng tốc độ mảng thay đổi và phương pháp đo chuyển động bằng GPS.

## 6. Trạng thái

- Khoa học: `in-review`.
- Triển khai: `sciaverse-pilot-in-progress`.
- Đã tạo mô-đun HTML, JavaScript và CSS độc lập.
- Chưa được xác nhận nghiệm thu khoa học.
- Chưa kiểm thử runtime trên trình duyệt hoặc thiết bị di động.

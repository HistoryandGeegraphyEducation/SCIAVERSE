# Phiếu thẩm định — Sóng địa chấn trong lòng Trái Đất

## 1. Phạm vi

Mô hình so sánh khả năng truyền của sóng P và sóng S qua ba lớp chính: manti, nhân ngoài và nhân trong. Mô hình dùng đường truyền giản đồ để làm rõ vai trò của trạng thái vật chất.

Không tính vận tốc sóng, đường đi tia địa chấn thực, khúc xạ, phản xạ, chuyển đổi pha hoặc vùng bóng địa chấn.

## 2. Cơ sở khoa học

- Sóng P là sóng dọc/nén. Sóng P truyền được qua chất rắn và chất lỏng; vận tốc thay đổi theo tính chất đàn hồi, mật độ và trạng thái vật chất.
- Sóng S là sóng ngang/trượt. Sóng S không truyền qua chất lỏng vì chất lỏng không duy trì ứng suất cắt tĩnh.
- Manti chủ yếu ở trạng thái rắn, dù vật liệu có thể biến dạng và chảy rất chậm trong thang thời gian địa chất.
- Nhân ngoài ở trạng thái lỏng; nhân trong ở trạng thái rắn.
- Sự suy giảm/mất sóng S trực tiếp qua nhân ngoài là một bằng chứng địa chấn quan trọng cho trạng thái lỏng của lớp này. Đường truyền P bị khúc xạ mạnh tại các ranh giới, đặc biệt gần ranh giới manti–nhân.

## 3. Biểu diễn và giả định

- Các lớp được biểu diễn bằng các khối cầu đồng tâm bán trong suốt; bán kính tương đối chỉ nhằm phân biệt lớp, không được dùng để đo độ sâu hoặc độ dày.
- Nguồn sóng được đặt tại bề mặt; đường truyền trong mô hình là đường thẳng giản đồ.
- Chế độ P vẽ đường truyền xuyên qua các lớp rắn và lỏng. Đường này không phải tia địa chấn đã giải bài toán khúc xạ.
- Chế độ S dừng ở ranh giới manti–nhân ngoài lỏng. Mô hình không biểu diễn các pha chuyển đổi như SKS/SKKS hoặc sóng S trong nhân trong sau chuyển đổi pha.
- Không hiển thị vận tốc, biên độ, tần số, thời gian đến, độ suy giảm hoặc dữ liệu máy địa chấn.
- Không dùng mô hình để xác định vị trí động đất hoặc suy ra cấu trúc địa chất từ dữ liệu quan trắc.

## 4. Kiểm tra logic

Các trường hợp cần xác nhận:
- Sóng P: đường minh họa đi qua manti, nhân ngoài và nhân trong.
- Sóng S: đường minh họa kết thúc tại ranh giới nhân ngoài lỏng.
- Chuyển loại sóng: đường truyền, màu, tiêu đề và nội dung giải thích thay đổi cùng trạng thái.
- Chuyển động camera không làm thay đổi vị trí tương đối của các lớp và đường truyền.

Đây là kiểm tra logic giao diện. Đã có kiểm thử runtime bằng Chromium/Playwright; kết quả và phạm vi được ghi tại phần kiểm thử cập nhật. Chưa kiểm thử trên thiết bị vật lý.

## 5. Nguồn tham khảo

1. U.S. Geological Survey. *P-wave and S-wave paths through the Earth*. https://www.usgs.gov/media/images/p-wave-and-s-wave-paths-through-earth. Sơ đồ tham khảo về khả năng truyền và đường đi của sóng P, S trong Trái Đất.
2. U.S. Geological Survey. *Inside the Earth*. https://pubs.usgs.gov/gip/dynamic/inside.html. Cơ sở về cấu tạo và trạng thái vật chất của các lớp bên trong Trái Đất.

## 6. Trạng thái

- Khoa học: `in-review`.
- Triển khai theo Registry: `verified-in-build` (CI Chromium/Playwright đạt).
- Đã tạo mô-đun HTML, JavaScript và CSS độc lập.
- Chưa được xác nhận nghiệm thu khoa học.
- Đã có kiểm thử runtime bằng Chromium/Playwright; kết quả và phạm vi được ghi tại phần kiểm thử cập nhật. Chưa kiểm thử trên thiết bị vật lý.


## Cập nhật mô hình — 28/11/2026

- Điểm dừng của sóng S được sửa về ranh giới phía trên của nhân ngoài lỏng. Đường minh họa hiện dừng tại bán kính 1,34 đơn vị mô hình tính từ tâm; không đi xuyên qua nhân ngoài.
- Sóng P vẫn được biểu diễn bằng đường thẳng giản đồ xuyên qua các lớp. Không mô phỏng khúc xạ hoặc đường tia địa chấn thực.

## Kiểm thử runtime — 28/11/2026

- GitHub Actions workflow `SCIAVERSE validation`, run `46107719993`, kết quả `success`, commit `eff7290536d290e83d47395061eb232d7af95ab0`.
- Chromium/Playwright chuyển đổi P/S và kiểm tra nội dung giải thích; kiểm tra mã xác nhận điểm dừng sóng S tại ranh giới nhân ngoài.
- Responsive smoke test kiểm tra 320, 360, 390 và 430 CSS px. Không xác nhận vận tốc hoặc đường đi tia địa chấn thực.

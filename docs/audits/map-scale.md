# Phiếu thẩm định — Thay đổi tỉ lệ bản đồ

## Cơ chế

Tỉ lệ số 1:n là tỉ số giữa một đơn vị chiều dài trên bản đồ và n đơn vị cùng loại ngoài thực tế.

Với d là chiều dài trên bản đồ (cm), n là mẫu số tỉ lệ:

\[
D_{ground}(cm)=d(cm)\times n
\]

\[
D_{ground}(m)=\frac{d\times n}{100},\qquad
D_{ground}(km)=\frac{d\times n}{100000}
\]

Ví dụ: 4 cm ở tỉ lệ 1:50 000 tương ứng 200 000 cm = 2 000 m = 2 km.

Tỉ lệ lớn có mẫu số nhỏ hơn và thường thể hiện phạm vi hẹp với nhiều chi tiết hơn. Tỉ lệ nhỏ có mẫu số lớn hơn và thường thể hiện phạm vi rộng, khái quát hơn.

## Giả định và giới hạn

- Chiều dài nhập là centimet đo trên bản đồ giấy hoặc bản đồ có tỉ lệ cố định; không lấy kích thước pixel trên màn hình làm centimet.
- Sơ đồ 3D chỉ minh họa hai điểm và đoạn đo; không phải bản đồ địa hình có tọa độ hoặc dữ liệu địa lí thực.
- Phép tính dùng tỉ lệ số không đổi. Với bản đồ số có thể phóng to/thu nhỏ hoặc phép chiếu có biến thiên tỉ lệ, phải dùng tỉ lệ thanh hoặc thông tin tỉ lệ tại đúng mức zoom.
- Không tính độ dài theo địa hình dốc, độ cong mặt đất hoặc tuyến đường uốn khúc.

## Kiểm tra số học

- 1 cm ở 1:10 000 → 100 m.
- 4 cm ở 1:50 000 → 2 km.
- 2,5 cm ở 1:100 000 → 2,5 km.
- 8 cm ở 1:250 000 → 20 km.

## Nguồn

1. U.S. Geological Survey. *Map Scales*. https://pubs.usgs.gov/fs/0038-00/report.pdf. Định nghĩa tỉ lệ bản đồ và representative fraction.
2. National Geographic Society. *Map Scale*. https://education.nationalgeographic.org/resource/map-scale/. Các loại tỉ lệ bản đồ và cách diễn giải tỉ lệ số.

## Trạng thái

- Khoa học: `in-review`.
- Triển khai theo Registry: `verified-in-build` (CI Chromium/Playwright đạt).
- Chưa nghiệm thu khoa học; đã kiểm thử runtime bằng Chromium/Playwright; chưa kiểm thử trên thiết bị vật lý.


## 8. Kiểm thử runtime và responsive

- Quy trình: GitHub Actions, workflow `SCIAVERSE validation`, run `46107069388`, kết quả `success`, commit `0c99e085fe7d89b3cf054d52a614b89e7af296cd`.
- Trình duyệt: Chromium headless với Playwright. Kiểm tra ở các chiều rộng 320, 360, 390 và 430 CSS px; kiểm tra lỗi JavaScript, tràn ngang, bảng kiến thức và chuyển nội dung nâng cao.
- Kiểm thử tương tác riêng: Kiểm tra 4 cm trên bản đồ tỉ lệ 1:100.000 cho kết quả 4 km.
- Kết quả xác nhận luồng giao diện và thao tác trong Chromium; không thay thế kiểm thử thiết bị vật lý, không xác nhận dữ liệu là quan trắc và không thay thế nghiệm thu khoa học.

# Phiếu thẩm định — La bàn và phương hướng

## Cơ chế

La bàn từ đặt nằm ngang định hướng theo thành phần nằm ngang của từ trường Trái Đất tại vị trí quan sát. Hướng này là Bắc từ, không đồng nhất với Bắc địa lí. Góc giữa Bắc địa lí và Bắc từ là độ từ thiên.

Quy ước dùng trong mô hình:
- Độ từ thiên D dương khi Bắc từ lệch về phía Đông so với Bắc địa lí.
- Độ từ thiên D âm khi Bắc từ lệch về phía Tây.
- Góc phương vị được đo theo chiều kim đồng hồ từ hướng Bắc tương ứng.

Công thức đổi phương vị từ sang phương vị thực:

\[
A_{true}=(A_{magnetic}+D)\bmod 360^\circ
\]

Kết quả được chuẩn hóa về khoảng 0° đến dưới 360°.

## Giả định và giới hạn

- Thanh trượt độ từ thiên là tham số giả định dùng để học quy tắc dấu; không phải dữ liệu từ trường tại vị trí người học.
- Kim được mô tả bằng hướng của thành phần nằm ngang; mô hình không tính độ từ khuynh, cường độ từ trường hoặc chuyển động dao động của kim.
- Không mô phỏng nhiễu từ do sắt thép, dòng điện, thiết bị điện tử hoặc địa hình địa chất.
- Không dùng kết quả để dẫn đường ngoài thực địa.
- Chưa kiểm chứng trực quan hướng Đông/Tây của kim ở các giá trị độ từ thiên dương/âm trên thiết bị thật.
- Kết quả hiển thị đến 0,1°; độ chính xác hiển thị không đồng nghĩa với độ chính xác đo đạc của la bàn.

## Kiểm tra số học

- D=0°, A=45° → Atrue=45°.
- D=+10°, A=45° → Atrue=55°.
- D=−10°, A=45° → Atrue=35°.
- D=+20°, A=350° → Atrue=10° sau chuẩn hóa.
- D=+0,5°, A=45° → Atrue=45,5°; phần thập phân phải được giữ khi hiển thị.
- D=−0,5°, A=45° → Atrue=44,5°.

## Nguồn

1. NOAA National Centers for Environmental Information. *Magnetic Declination*. https://www.ncei.noaa.gov/products/magnetic-declination. Định nghĩa độ từ thiên, quy ước Đông dương/Tây âm và biến đổi theo vị trí, thời gian.
2. U.S. Geological Survey. *How Should I Set My GPS and Compass?* https://www.usgs.gov/educational-resources/how-should-i-set-my-gps-and-compass. Ví dụ thực hành hiệu chỉnh phương vị theo độ từ thiên.

## Trạng thái

- Khoa học: `in-review`.
- Triển khai: `sciaverse-pilot-in-progress`.
- Chưa được xác nhận nghiệm thu; chưa kiểm thử runtime trên thiết bị thật.


## 8. Kiểm thử runtime và responsive

- Quy trình: GitHub Actions, workflow `SCIAVERSE validation`, run `46107069388`, kết quả `success`, commit `0c99e085fe7d89b3cf054d52a614b89e7af296cd`.
- Trình duyệt: Chromium headless với Playwright. Kiểm tra ở các chiều rộng 320, 360, 390 và 430 CSS px; kiểm tra lỗi JavaScript, tràn ngang, bảng kiến thức và chuyển nội dung nâng cao.
- Kiểm thử tương tác riêng: Kiểm tra phương vị thực với độ từ thiên +0,5° và −0,5°; giữ phần thập phân.
- Kết quả xác nhận luồng giao diện và thao tác trong Chromium; không thay thế kiểm thử thiết bị vật lý, không xác nhận dữ liệu là quan trắc và không thay thế nghiệm thu khoa học.

# Thẩm định nguồn gốc — Lũ quét

- Mã nguồn: `EDUVERSE/simulations/natural-hazards/lu-quet/main.js`
- Trạng thái: `in-review`
- Phạm vi: lượng mưa, dòng chảy mặt, tập trung dòng, lũ và bùn đá.

## Căn cứ khoa học

USGS xác định hai yếu tố quan trọng của lũ là cường độ và thời lượng mưa; địa hình, điều kiện đất và lớp phủ cũng ảnh hưởng đến dòng chảy. Đô thị hóa làm tăng bề mặt không thấm và dòng chảy mặt: https://www.usgs.gov/water-science-school/science/floods-things-know . NOAA NSSL cũng nhấn mạnh đặc điểm lưu vực, độ thấm, độ bão hòa, địa hình và lượng mưa: https://www.nssl.noaa.gov/education/svrwx101/floods/forecasting/ .

## Kết quả đọc mã

- Đầu vào duy nhất là lượng mưa tích lũy 0–250 mm; không có khoảng thời gian đo, do đó không xác định được cường độ mưa.
- Địa hình lưu vực được tạo bằng hàm toán học; không có diện tích, độ dốc thực, loại đất, độ thấm hoặc lớp phủ được định nghĩa thành biến.
- Mặt nước lũ được nâng và mở rộng theo tham số; đây là hoạt ảnh minh họa, không phải kết quả cân bằng nước hoặc thủy lực.
- Mô hình có thể hiện mưa, dòng suối, nhà cửa và cây, nhưng lượng nước không được tính từ mưa trừ thấm, trữ và thoát.

## Điều chỉnh bắt buộc trước khi tiếp nhận

1. Gắn thời lượng cho lượng mưa; phân biệt mm tích lũy và mm/h.
2. Bổ sung đặc điểm lưu vực: diện tích, độ dốc, độ thấm, độ bão hòa ban đầu, lớp phủ và bề mặt không thấm.
3. Dùng cân bằng nước hoặc mô hình mưa–dòng chảy giản lược có công thức và đơn vị; ghi rõ giả định.
4. Phân biệt lũ nước với dòng bùn đá/debris flow; không mặc định mọi lũ quét đều có cùng thành phần.
5. Dùng địa hình giả định có nhãn; không trình bày vùng ngập như dự báo địa phương.
6. Kiểm tra quan hệ giữa mưa, thời gian tập trung và lưu lượng đỉnh trước khi hiển thị số liệu.

Chưa đủ điều kiện nghiệm thu.

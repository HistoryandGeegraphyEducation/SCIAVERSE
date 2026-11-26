# Thẩm định nguồn gốc — Núi lửa

- Mã nguồn: `EDUVERSE/js/sims/volcano.js`
- Trạng thái: `in-review`
- Phạm vi: buồng magma, ống phun, áp suất, nhiệt độ, kiểu phun trào và dòng dung nham.

## Căn cứ khoa học

USGS cho biết tính nổ của phun trào phụ thuộc thành phần magma, độ nhớt, hàm lượng khí hòa tan và tương tác với nước; magma loãng cho phép khí thoát dễ hơn, magma nhớt giữ khí và có thể gây phun trào nổ: https://www.usgs.gov/faqs/how-do-volcanoes-erupt . USGS cũng phân biệt magma dưới mặt đất với dung nham sau khi phun ra: https://www.usgs.gov/programs/VHP/about-volcanoes .

## Kết quả đọc mã

- Mô hình là mặt cắt 2D của một núi lửa dạng nón, có buồng magma, ống phun chính, miệng phụ, dung nham, tro và khí.
- Các giai đoạn được mô tả theo trình tự magma tích tụ, áp suất tăng, phun trào và nguội đi.
- Nhiệt độ hiển thị được tính bằng `700 + P × 5` °C; áp suất và năng lượng là phần trăm nội bộ. Đây là quan hệ tạo gauge hoạt ảnh, không phải phương trình trạng thái magma.
- Mức phun “nhẹ/trung bình/mạnh” được điều khiển bằng hệ số KL; không dựa trên độ nhớt, thành phần silica, nhiệt độ hoặc hàm lượng khí.
- Hoạt ảnh có tro, sét và dòng dung nham; không phân biệt rõ phun trào effusive và explosive.
- Mô hình giả định một buồng magma tập trung và một hệ thống ống phun đơn giản; không đại diện cho mọi cấu trúc núi lửa.

## Điều chỉnh bắt buộc trước khi tiếp nhận

1. Không hiển thị nhiệt độ và áp suất nội bộ như số đo thực. Hoặc bỏ đơn vị định lượng, hoặc thay bằng tham số có nguồn và mô hình vật lí.
2. Thêm lựa chọn kiểu magma với thành phần, độ nhớt và khí hòa tan; liên hệ rõ các biến với kiểu phun.
3. Tách phun trào tràn (effusive) khỏi phun trào nổ; không mặc định mọi lần phun đều tạo cột tro và sét.
4. Ghi rõ đây là cấu trúc khái niệm của một kiểu núi lửa, không phải mặt cắt chuẩn cho mọi núi lửa.
5. Kiểm tra nội dung “buồng magma” theo hướng hệ thống chứa magma có thể phức tạp, không luôn là một khoang rỗng lớn.
6. Phân biệt tro núi lửa, tephra, khí, dòng dung nham và dòng mật độ pyroclastic.

Chưa đủ điều kiện nghiệm thu.

# Thẩm định nguồn gốc — Xâm nhập mặn

- Mã nguồn: `EDUVERSE/simulations/natural-hazards/xam-nhap-man/main.js`
- Trạng thái: `in-review`
- Phạm vi: dòng nước ngọt, triều, ranh mặn–ngọt và phân tầng nước.

## Căn cứ khoa học

USGS mô tả xâm nhập mặn trong tầng chứa nước ven biển: dòng nước ngọt tự nhiên hướng ra biển giúp hạn chế nước mặn tiến vào; bơm hút nước ngầm có thể làm giảm dòng nước ngọt và kéo ranh mặn vào đất liền. Ranh giới là vùng chuyển tiếp khuếch tán, không phải mặt phân cách sắc nét: https://www.usgs.gov/mission-areas/water-resources/science/saltwater-intrusion . USGS cũng mô tả vùng chuyển tiếp nước ngọt–nước mặn: https://water.usgs.gov/ogw/gwrp/saltwater/salt.html .

## Kết quả đọc mã

- Mô hình biểu diễn mặt cắt cửa sông với nước ngọt, một khối nước mặn dạng nêm và đường halocline.
- Đầu vào là lưu lượng nước ngọt tương đối theo phần trăm; không có đơn vị lưu lượng hoặc lưu lượng triều.
- Hình nêm là khối hộp có thể kéo dài/ngắn theo slider; không tính mật độ, khuếch tán, độ mặn hoặc dòng chảy thủy lực.
- Nội dung mô tả cả xâm nhập mặn cửa sông và nước ngầm, nhưng hình học hiện tại chỉ thể hiện một mặt cắt cửa sông.

## Điều chỉnh bắt buộc trước khi tiếp nhận

1. Phân biệt xâm nhập mặn cửa sông với xâm nhập mặn trong tầng chứa nước ven biển; xây dựng hai chế độ riêng nếu cần.
2. Không dùng phần trăm lưu lượng không có định nghĩa; thay bằng lưu lượng có đơn vị hoặc tham số tương đối được giải thích.
3. Bổ sung thủy triều, lưu lượng sông, hình học lòng dẫn, độ sâu, độ mặn và chênh lệch mật độ nếu mô hình hướng tới phân tầng cửa sông.
4. Thể hiện vùng chuyển tiếp mặn–ngọt, không chỉ một mặt ranh cứng.
5. Nếu mô hình tầng chứa nước, cần mô tả mực nước ngầm, độ thấm, bơm hút và ranh nước ngọt–mặn.
6. Ghi rõ đây là mô hình khái niệm nếu chưa giải bài toán dòng chảy và vận chuyển muối.

Chưa đủ điều kiện nghiệm thu.

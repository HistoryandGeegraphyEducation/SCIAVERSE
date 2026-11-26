# Thẩm định nguồn gốc — Trái Đất tự quay quanh trục

- Mã nguồn tham chiếu: `HistoryandGeegraphyEducation/Eduverse/js/sims/earth.js`
- SHA blob nguồn đã đọc: `56feba1aea96326fd2a2c95c576507b4eee7fe40`
- Trạng thái: `needs-revision`
- Phạm vi: cơ chế quay, trục quay, chiếu sáng ngày–đêm, thông số và giao diện điều khiển. Chưa nghiệm thu phần hiển thị trên trình duyệt.

## 1. Cơ sở khoa học dùng làm chuẩn

1. Trái Đất quay quanh trục của nó. Chu kỳ quay sao (sidereal rotation period) khoảng 23.9345 giờ; độ dài ngày trung bình (mean solar day) là 24 giờ. Đây là hai đại lượng khác nhau. NASA NSSDC Earth Fact Sheet công bố riêng hai giá trị này: https://nssdc.gsfc.nasa.gov/planetary/factsheet/earthfact.html
2. Độ nghiêng trục (obliquity) hiện nay khoảng 23.44°. Cần diễn đạt chính xác là góc giữa trục quay Trái Đất và phương vuông góc với mặt phẳng quỹ đạo; tương đương góc giữa mặt phẳng xích đạo và mặt phẳng quỹ đạo. U.S. Naval Observatory: https://aa.usno.navy.mil/faq/seasons_orbit ; NASA: https://science.nasa.gov/earth/facts/
3. Nửa Trái Đất hướng về Mặt Trời được chiếu sáng, nửa còn lại ở trong bóng tối; ranh giới ngày–đêm phụ thuộc hướng chiếu sáng. NASA giải thích hiện tượng ngày đêm và sự quay của Trái Đất: https://www.nasa.gov/learning-resources/for-kids-and-students/what-is-earth/
4. Trục quay duy trì gần như cùng hướng trong không gian trong chu kỳ quỹ đạo một năm; sự nghiêng trục kết hợp với chuyển động quanh Mặt Trời mới giải thích mùa. Mô hình chỉ mô tả tự quay không được dùng để giải thích đầy đủ bốn mùa. U.S. Naval Observatory: https://aa.usno.navy.mil/faq/seasons_orbit

## 2. Đối chiếu mã nguồn EDUVERSE

### Phần có cơ sở đúng

- Dùng hình cầu 3D cho mô hình Trái Đất ở mức trực quan.
- Đặt trục quay nghiêng bằng một nhóm hình học riêng, có giá trị mặc định 23.5°.
- Dùng nguồn sáng định hướng cố định và để Trái Đất quay tương đối với nguồn sáng; cách này có thể biểu diễn ngày và đêm.
- Tính giờ Mặt Trời địa phương từ kinh độ và kinh độ điểm dưới Mặt Trời là hướng tiếp cận phù hợp cho mô hình minh họa, nhưng cần kiểm thử dấu, kinh tuyến gốc và quy ước giờ.

### Điểm phải sửa hoặc giới hạn lại

1. Bản đồ dự phòng được vẽ bằng một số đa giác thô, không đủ độ chính xác để dùng làm bề mặt địa lí. Phải thay bằng ảnh bản đồ toàn cầu có nguồn, ví dụ NASA Blue Marble: https://svs.gsfc.nasa.gov/2915/
2. Trục nghiêng cho phép kéo từ 0° đến 45°. Nếu mục tiêu là mô tả Trái Đất hiện tại, góc chuẩn phải cố định ở khoảng 23.44°. Thao tác thay đổi góc chỉ nên tồn tại trong chế độ thí nghiệm riêng và phải ghi rõ đó là tình huống giả định.
3. Điều khiển “Góc chiếu sáng của Mặt Trời” cho phép thay đổi xích vĩ Mặt Trời nhưng không có ngày trong năm hoặc mô hình chuyển động quanh Mặt Trời. Nếu giữ điều khiển này, phải trình bày đây là tham số chiếu sáng giả định, không phải mô phỏng mùa hoàn chỉnh.
4. Điều khiển đảo chiều quay tạo ra tình huống ngược thực tế. Không để nó xuất hiện như một lựa chọn chuyển động bình thường; chỉ có thể giữ trong một hoạt động so sánh giả định có nhãn rõ.
5. Tốc độ mặc định “4 giờ/giây” là tốc độ tua mô phỏng, không phải tốc độ vật lí. Giao diện mới phải phân biệt tốc độ mô phỏng với chu kỳ thực và hiển thị chu kỳ tham chiếu.
6. Mã nguồn ghi một vòng quay theo 24 giờ nhưng chưa phân biệt ngày Mặt Trời trung bình với chu kỳ quay sao. Cần ghi rõ mô hình đang dùng quy ước nào. Nếu chỉ giữ Mặt Trời cố định và không mô phỏng chuyển động quỹ đạo, phải nêu giới hạn này.
7. Đám mây được tạo ngẫu nhiên bằng các vệt tròn mờ, không phải dữ liệu mây thực. Không được để người học hiểu đây là ảnh quan trắc khí quyển.
8. Cần kiểm tra việc giải phóng WebGL, vòng lặp animation, tải texture, hiển thị trên thiết bị yếu và trạng thái khi CDN không truy cập được.

## 3. Đặc tả SCIAVERSE cho phiên bản đầu

- Giữ trục nghiêng khoảng 23.44° so với phương vuông góc mặt phẳng quỹ đạo; không tự tạo dao động trục.
- Quay theo hướng Tây sang Đông. Nhìn từ phía Bắc địa lí xuống, chiều quay là ngược chiều kim đồng hồ.
- Nguồn sáng Mặt Trời cố định trong mô hình ngày–đêm; vùng sáng và vùng tối phải xuất phát từ chiếu sáng hình học, không vẽ một lớp tối tùy ý.
- Dùng bản đồ bề mặt toàn cầu có xuất xứ và thông tin ghi công; ưu tiên NASA Blue Marble.
- Không đưa vào chuyển động quỹ đạo, mùa hoặc xích vĩ Mặt Trời biến thiên nếu chưa triển khai đúng quan hệ hình học giữa trục và vị trí Trái Đất trên quỹ đạo.
- Tốc độ điều khiển chỉ là hệ số tua thời gian; chu kỳ tham chiếu được giải thích riêng.
- Không cung cấp đảo chiều quay như trạng thái vật lí thông thường.
- Có thể dừng, tiếp tục và đặt lại mô hình; trạng thái mặc định phải đúng với nội dung học tập.

## 4. Tiêu chí kiểm chứng trước khi công bố

- Trục hình học giữ đúng độ nghiêng và không tự đổi hướng khi quả cầu quay.
- Vị trí kinh tuyến, vĩ tuyến và các điểm địa lí không trượt khỏi bề mặt.
- Hướng quay thể hiện đúng Tây → Đông.
- Ánh sáng và ranh giới ngày–đêm nhất quán khi Trái Đất quay.
- Tốc độ quay được điều khiển ổn định, không phụ thuộc tốc độ khung hình.
- Texture tải được và có phương án lỗi rõ ràng.
- Không có lỗi console, vòng lặp trùng hoặc tài nguyên WebGL không được giải phóng.
- Kiểm tra các kích thước 320, 360, 390 và 430 CSS px; kiểm tra reduced motion.

## 5. Kết luận

Mô hình EDUVERSE có nền tảng hình học ban đầu phù hợp để tham khảo, nhưng chưa đủ điều kiện tiếp nhận nguyên trạng. Các điểm cần xử lý quan trọng là texture bản đồ, cách biểu diễn góc nghiêng, phân biệt chu kỳ quay sao và ngày Mặt Trời, loại bỏ điều khiển gây hiểu nhầm và công bố giới hạn mô hình.

Nguồn hình ảnh bề mặt đề xuất: NASA Blue Marble, NASA Scientific Visualization Studio, https://svs.gsfc.nasa.gov/2915/ . Trang này cung cấp ảnh toàn cầu 2048 × 1024 và thông tin nguồn ảnh.

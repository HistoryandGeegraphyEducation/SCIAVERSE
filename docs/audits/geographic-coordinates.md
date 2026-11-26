# Thẩm định nguồn gốc — Xác định tọa độ địa lí

- Mã nguồn tham chiếu: `EDUVERSE/js/sims/geo-01-coordinates/main.js`
- Trạng thái: `in-review`
- Phạm vi: định nghĩa vĩ độ/kinh độ, lưới kinh-vĩ tuyến, chuyển đổi tọa độ, điểm khảo sát, nguồn bản đồ và tương tác 3D.
- Kết luận hiện tại: công thức định vị trên hình cầu đúng trong phạm vi giả định của mô hình; chưa đủ điều kiện tiếp nhận do còn lỗi tương tác, hiển thị, dữ liệu bản đồ và giới hạn biểu diễn tọa độ.

## Căn cứ khoa học

1. NOAA, *What is latitude?* https://oceanservice.noaa.gov/facts/latitude.html
   - Vĩ độ biểu thị vị trí Bắc/Nam so với xích đạo, miền từ 0° đến 90° ở mỗi bán cầu.
   - Trên mô hình hình cầu, vĩ độ địa tâm có thể mô tả bằng góc giữa bán kính đi qua điểm và mặt phẳng xích đạo.
   - Đối với định vị có độ chính xác cao, vĩ độ trắc địa được xác định theo pháp tuyến của ellipsoid tham chiếu; không đồng nhất hai định nghĩa này.

2. NOAA, *What is longitude?* https://oceanservice.noaa.gov/facts/longitude.html
   - Kinh độ biểu thị vị trí Đông/Tây so với kinh tuyến gốc; các kinh tuyến hội tụ tại hai cực.
   - Kinh tuyến đối diện kinh tuyến gốc là kinh tuyến 180°.
   - NOAA phân biệt kinh tuyến gốc lịch sử tại Greenwich với International Reference Meridian (IRM) dùng trong định vị vệ tinh hiện đại; tại Greenwich, máy thu GPS có thể không hiển thị đúng 0°.

3. National Geospatial-Intelligence Agency (NGA), *World Geodetic System 1984 (WGS 84)* https://earth-info.nga.mil/?action=wgs84&dir=wgs84
   - WGS 84 là hệ quy chiếu trắc địa địa tâm, cố định với Trái Đất, dùng cho định vị và bản đồ.
   - Tọa độ trắc địa WGS 84 được xác định trên ellipsoid tham chiếu; hệ có các tham số hình học và định hướng cụ thể.
   - Vì vậy, mô hình hình cầu không được quảng bá như công cụ định vị hoặc đo đạc WGS 84.

4. NGA, *Coordinate Systems* https://earth-info.nga.mil/index.php?action=coordsys&dir=coordsys
   - Hệ lưới địa lí dùng góc vĩ độ và kinh độ; vĩ độ được tính từ mặt phẳng xích đạo, kinh độ từ kinh tuyến tham chiếu Greenwich.
   - Đây là căn cứ bổ sung cho cách trình bày lưới kinh-vĩ tuyến trong bài học nhập môn.

## Kết quả đọc mã nguồn EDUVERSE

### Phần đúng trong phạm vi mô hình

- Slider vĩ độ từ -90° đến +90° và kinh độ từ -180° đến +180° phù hợp với miền giá trị góc thông dụng.
- Công thức đặt điểm trên hình cầu:
  - (x=r\cos\varphi\cos\lambda)
  - (y=r\sin\varphi)
  - (z=r\cos\varphi\sin\lambda)
  với \(\varphi\) là vĩ độ và \(\lambda\) là kinh độ, nhất quán với hệ tọa độ cầu mà trục Y hướng về Bắc và kinh tuyến 0° nằm trên trục X dương.
- Hàm nghịch đảo khi nhấp lên bề mặt dùng:
  - \(\varphi=\arcsin(y/r)\)
  - \(\lambda=\operatorname{atan2}(z,x)\)
  Hai biểu thức này là nghịch đảo phù hợp của phép ánh xạ trên hình cầu, ngoại trừ kinh độ không xác định tại hai cực.
- Vĩ tuyến, kinh tuyến, xích đạo và kinh tuyến 0° được tạo thành các lớp riêng. Trục mô hình đặt theo trục Y, nhất quán với thành phần Y của công thức.
- Giao diện ghi vĩ độ trước kinh độ. Cách ghi này phù hợp với cách trình bày giáo dục thông dụng; khi trao đổi dữ liệu số cần nêu rõ quy ước thứ tự trục của định dạng hoặc API đang sử dụng.
- Các mô tả cơ bản về vĩ độ, kinh độ và cặp tọa độ phù hợp ở mức nhập môn, nhưng cần làm rõ giả định hình cầu và giới hạn độ chính xác.

### Vấn đề khoa học và dữ liệu

1. **Định nghĩa vĩ độ chưa phân biệt loại vĩ độ.** Mô hình dùng hình cầu và góc từ tâm Trái Đất, tức cách biểu diễn vĩ độ địa tâm trong giả định hình cầu. Nội dung giao diện hiện viết chung là “góc từ mặt phẳng xích đạo”, dễ khiến người học hiểu đây là định nghĩa trắc địa dùng trong WGS 84. Cần ghi rõ đây là mô hình hình cầu giản lược; khi giới thiệu định vị hiện đại phải phân biệt vĩ độ địa tâm và vĩ độ trắc địa.
2. **Không có hệ quy chiếu/datum được công bố.** Mô hình chỉ hiển thị góc, không nói rõ đang minh họa lưới kinh-vĩ tuyến theo quy ước nào. Nếu bổ sung chức năng nhập/xuất hoặc đối chiếu GPS, phải khai báo hệ quy chiếu, chẳng hạn WGS 84, và quy ước thứ tự tọa độ.
3. **Kinh tuyến 0° cần được mô tả đúng ngữ cảnh.** Có thể dùng Greenwich làm mốc giải thích kinh tuyến gốc ở bài học nhập môn. Không nên khẳng định mốc vật lý của kinh tuyến gốc lịch sử trùng tuyệt đối với kinh tuyến tham chiếu của định vị vệ tinh hiện đại.
4. **Kinh độ tại hai cực không xác định.** Ở vĩ độ +90° hoặc -90°, mọi kinh tuyến hội tụ; công thức vị trí làm cho điểm không đổi theo kinh độ. Giao diện hiện vẫn hiển thị giá trị kinh độ như thể đó là một thành phần có ý nghĩa tại cực. Cần ẩn hoặc đánh dấu kinh độ là “không xác định” khi điểm ở đúng hai cực.
5. **Hai đầu mút +180° và -180° là cùng một kinh tuyến đối cực.** Giao diện hiện có thể hiển thị hai nhãn khác nhau cho cùng một vị trí. Cần thống nhất quy tắc chuẩn hóa và giải thích đây là hai cách ghi cùng kinh tuyến.
6. **Độ phân giải chỉ đến một độ.** Hàm `setPoint` làm tròn vĩ độ và kinh độ về số nguyên. Không thể biểu diễn độ thập phân, phút hoặc giây; do đó không phù hợp cho bài tập cần đọc tọa độ chi tiết.
7. **Các điểm Hà Nội và TP. Hồ Chí Minh chỉ là giá trị làm tròn.** Nút preset lần lượt đặt 21°B, 105°Đ và 10°B, 106°Đ. Nếu giữ lại, phải ghi rõ đây là tọa độ minh họa gần đúng, không phải tọa độ chính xác của trung tâm đô thị hay một địa điểm khảo sát xác định.
8. **Texture không có hồ sơ nguồn trong mã.** Ảnh `earth_atmos_2048.jpg` được tải từ ví dụ Three.js, nhưng mô hình không ghi rõ nhà cung cấp dữ liệu địa lí, phiên bản, giấy phép hoặc điều kiện tái sử dụng. Không thể dùng nó làm nguồn bản đồ chính thức chỉ dựa trên việc tệp được lưu trong thư mục ví dụ.
9. **Bản đồ dự phòng là hình tạo sinh bằng các mảng hình học.** Khi tải texture thất bại, mô hình vẫn hiển thị các mảng lục địa tự dựng. Chúng không đủ độ chính xác để nhận dạng địa danh hoặc kiểm tra vị trí; việc giữ chúng mà không cảnh báo có thể gây hiểu sai.

## Lỗi triển khai và tương tác phát hiện trong mã

1. Chuỗi CSS được chèn động có selector `evc-panel` và `evc-knowledge` thiếu dấu chấm. HTML lại dùng class `evc-panel` và `evc-knowledge`; vì vậy các quy tắc nền, viền, padding và bố cục tương ứng không áp dụng vào các phần tử dự kiến. Các selector con như `evc-panel h3` và `evc-knowledge h3` cũng sai theo cùng nguyên nhân.
2. Sự kiện `pointerup` trên canvas luôn thực hiện raycast sau khi OrbitControls kết thúc thao tác. Khi người dùng kéo để xoay quả Địa Cầu rồi thả tay trên bề mặt, thao tác kéo có thể bị hiểu thành chọn điểm mới. Cần phân biệt click và drag bằng ngưỡng dịch chuyển con trỏ hoặc cơ chế pointer phù hợp.
3. Việc chọn điểm bằng canvas không có cơ chế thay thế cho bàn phím. Các slider có thể thao tác bằng bàn phím, nhưng chức năng chọn trực tiếp trên quả Địa Cầu hiện phụ thuộc pointer.
4. Mô hình phụ thuộc vào `window.THREE` và `THREE.OrbitControls` được nạp từ bên ngoài. Nếu thiếu Three.js, mô hình báo lỗi; nếu thiếu OrbitControls, quả Địa Cầu vẫn có thể dựng nhưng không có thao tác xoay/zoom như dự kiến. Cần khai báo và kiểm tra phụ thuộc tại điểm tích hợp.
5. Callback lỗi tải texture để trống. Khi ảnh không tải được, mô hình im lặng giữ lại quả Địa Cầu với các mảng lục địa giả lập. Cần hiển thị trạng thái lỗi rõ ràng hoặc không hiển thị lớp bản đồ sai lệch.
6. Vòng lặp `requestAnimationFrame` tiếp tục dựng hình kể cả khi cảnh không thay đổi. Cần đánh giá khả năng chuyển sang render theo yêu cầu hoặc tạm dừng khi trang không hiển thị, nhất là trên thiết bị di động.
7. Khi WebGL khởi tạo lỗi sau khi renderer đã được tạo, nhánh `catch` chỉ gọi `renderer.dispose()`; cần kiểm tra việc tháo canvas và giải phóng tài nguyên trong đường lỗi.
8. Chưa có kiểm thử trực quan xác nhận hướng Đông/Tây của texture so với kinh tuyến 0°. Công thức điểm và công thức raycast nhất quán với nhau, nhưng sự khớp giữa tọa độ mô hình và hướng địa lí của ảnh texture phải được kiểm chứng bằng các địa danh hoặc đường kinh tuyến đã biết.

## Điều chỉnh bắt buộc trước khi tiếp nhận

1. Giữ mô hình hình cầu nếu mục tiêu chỉ là trực quan hóa nhập môn; bổ sung nhãn rõ “mô hình hình cầu giản lược, không dùng đo đạc/định vị chính xác”.
2. Sửa định nghĩa vĩ độ để phân biệt góc địa tâm trên hình cầu với vĩ độ trắc địa trên ellipsoid.
3. Quy định rõ kinh tuyến 0° trong bài học và tránh đồng nhất mốc Greenwich lịch sử với IRM trong dữ liệu định vị hiện đại.
4. Ẩn kinh độ hoặc hiển thị trạng thái không xác định tại vĩ độ ±90°; chuẩn hóa cách biểu diễn kinh tuyến ±180°.
5. Chọn độ phân giải đầu vào phù hợp mục tiêu dạy học: độ thập phân hoặc độ-phút-giây; không tự nhận mô hình có độ chính xác cao khi vẫn làm tròn đến độ nguyên.
6. Gắn nhãn “tọa độ minh họa gần đúng” cho các preset đô thị hoặc thay bằng tọa độ đã được xác minh từ nguồn địa lí đáng tin cậy, có nêu điểm tham chiếu.
7. Thay texture bằng dữ liệu bản đồ có nguồn, phiên bản và giấy phép sử dụng rõ ràng. Không dùng các mảng lục địa procedural làm bản đồ dự phòng; khi tải thất bại phải báo lỗi hoặc chuyển sang trạng thái không có dữ liệu.
8. Sửa selector CSS bị thiếu dấu chấm.
9. Phân biệt click với drag khi chọn điểm; kiểm thử chọn điểm bằng pointer và điều khiển bằng bàn phím.
10. Kiểm tra đầy đủ phụ thuộc Three.js/OrbitControls, giải phóng tài nguyên và hiệu năng trên thiết bị di động.

## Ma trận kiểm thử bắt buộc

| Ca kiểm thử | Kết quả mong đợi |
|---|---|
| 0° vĩ độ, 0° kinh độ | Điểm nằm trên xích đạo và kinh tuyến 0° |
| 0° vĩ độ, 90°Đ | Điểm nằm trên xích đạo, phía Đông 90° |
| 0° vĩ độ, 90°T | Điểm nằm trên xích đạo, phía Tây 90° |
| 0° vĩ độ, ±180° | Cùng một vị trí trên kinh tuyến đối cực; nhãn được chuẩn hóa nhất quán |
| +90° và -90° vĩ độ | Điểm ở đúng hai cực; kinh độ được hiển thị là không xác định |
| Vĩ độ âm/dương | Nhãn Nam/Bắc khớp dấu |
| Kinh độ âm/dương | Nhãn Tây/Đông khớp dấu |
| Nhấp chọn điểm trên quả Địa Cầu | Tọa độ cập nhật đúng với vị trí bề mặt |
| Kéo xoay quả Địa Cầu rồi thả | Không tự đổi điểm khảo sát ngoài ý muốn |
| Texture tải thành công/thất bại | Có trạng thái rõ ràng; không trình bày bản đồ giả lập như dữ liệu địa lí |
| Thiết bị cảm ứng và bàn phím | Điều khiển được, không mất thao tác hoặc bị khóa bởi canvas |
| Màn hình 320, 360, 390 và 430 CSS px | Không tràn ngang, không che mất điều khiển hoặc nội dung |

## Kết luận thẩm định

Phần toán học cốt lõi đúng đối với một quả cầu bán kính không đổi. Các khái niệm cơ bản về vĩ độ, kinh độ và lưới kinh-vĩ tuyến có thể dùng cho mô hình học tập sau khi chỉnh cách diễn đạt.

Mô hình hiện chưa đạt điều kiện tiếp nhận vào SCIAVERSE. Các điểm chặn chính là: phân biệt vĩ độ địa tâm với vĩ độ trắc địa; nguồn và hướng của texture; xử lý kinh độ ở hai cực; lỗi click/drag; selector CSS; và khả năng tiếp cận trên thiết bị di động. Chỉ chuyển trạng thái sang `validated` sau khi các điểm này được xử lý và ma trận kiểm thử có kết quả thực tế.

## Nguồn tham khảo

- NOAA National Ocean Service. (2024). *What is latitude?* https://oceanservice.noaa.gov/facts/latitude.html
- NOAA National Ocean Service. (2024). *What is longitude?* https://oceanservice.noaa.gov/facts/longitude.html
- National Geospatial-Intelligence Agency. *World Geodetic System 1984 (WGS 84).* https://earth-info.nga.mil/?action=wgs84&dir=wgs84
- National Geospatial-Intelligence Agency. *Coordinate Systems.* https://earth-info.nga.mil/index.php?action=coordsys&dir=coordsys

# Thẩm định nguồn gốc — Trái Đất tự quay quanh trục

- Mã nguồn tham chiếu EDUVERSE: `js/sims/earth.js`
- Mã thử nghiệm SCIAVERSE: `earth-rotation.js`
- SHA blob nguồn EDUVERSE đã đọc: `56feba1aea96326fd2a2c95c576507b4eee7fe40`
- Trạng thái: `needs-revision` đối với mô hình EDUVERSE; pilot SCIAVERSE đang chờ kiểm thử trình duyệt.
- Phạm vi: hướng và chu kỳ quay, trục nghiêng, chiếu sáng ngày–đêm, xích vĩ Mặt Trời, giờ Mặt Trời địa phương, texture, điều khiển và vòng đời WebGL.

## 1. Cơ sở khoa học dùng làm chuẩn

1. NASA, *Chapter 2: Reference Systems*: https://science.nasa.gov/learn/basics-of-space-flight/chapter2-1/
   - Trái Đất hoàn thành một ngày Mặt Trời trung bình trong 24 giờ.
   - Chu kỳ quay sao ngắn hơn ngày Mặt Trời trung bình khoảng 3 phút 56,55 giây.
   - Góc nghiêng trục khoảng 23,45° so với mặt phẳng quỹ đạo, hay 23,45° so với phương vuông góc mặt phẳng quỹ đạo theo cách diễn đạt obliquity.

2. U.S. Naval Observatory, *The Seasons and the Earth's Orbit*: https://aa.usno.navy.mil/faq/seasons_orbit
   - Obliquity hiện nay khoảng 23,4°; đây là góc giữa trục quay và phương vuông góc với mặt phẳng quỹ đạo.
   - Trục quay giữ gần như cùng hướng trong không gian khi Trái Đất chuyển động quanh Mặt Trời.
   - Mùa hình thành do độ nghiêng trục kết hợp với vị trí của Trái Đất trên quỹ đạo; riêng chuyển động tự quay không giải thích được các mùa.

3. NASA NSSDC, *Earth Fact Sheet*: https://nssdc.gsfc.nasa.gov/planetary/factsheet/earthfact.html
   - Phân biệt chu kỳ quay sao và chu kỳ quay theo Mặt Trời.
   - Chu kỳ quay sao khoảng 23,9345 giờ; ngày Mặt Trời trung bình là 24 giờ.

4. NASA SVS, *Blue Marble — A Seamless Image Mosaic of the Earth*: https://svs.gsfc.nasa.gov/2915/
   - Ảnh toàn cầu có phiên bản 2048×1024.
   - Đây là ảnh ghép màu thực từ nhiều quan sát vệ tinh, không phải ảnh trực tiếp theo thời gian thực. Dữ liệu bề mặt đất và vùng ven biển được tổng hợp từ các quan sát nhiều tháng năm 2001; sản phẩm được công bố năm 2004.
   - Ghi công: NASA/Goddard Space Flight Center Scientific Visualization Studio; dữ liệu Blue Marble Next Generation do Reto Stockli và NASA Earth Observatory cung cấp.

## 2. Đối chiếu mã nguồn EDUVERSE

### Phần có cơ sở đúng

- Dùng hình cầu 3D để biểu diễn Trái Đất; trục quay được đặt trong một nhóm hình học riêng.
- Góc nghiêng mặc định 23,5° gần với giá trị hiện nay khoảng 23,44°.
- Dùng nguồn sáng định hướng cố định và cho Trái Đất quay tương đối với nguồn sáng là cách phù hợp để minh họa ngày–đêm.
- Hàm chuyển đổi vĩ độ/kinh độ sang vị trí trên hình cầu và hàm tính kinh độ từ điểm chọn có quy ước dấu nhất quán với nhau.
- Giờ Mặt Trời địa phương được tính từ kinh độ điểm khảo sát và kinh độ dưới Mặt Trời. Cách tính hình học này phù hợp cho mô hình đơn giản, với điều kiện phân biệt giờ Mặt Trời với giờ hành chính.
- Điều khiển đảo chiều có nhãn “ngược với thực tế”; vì vậy người học có thể nhận biết đó là trạng thái giả định, không phải hướng quay thông thường.

### Điểm phải sửa hoặc giới hạn lại

1. **Trục nghiêng thay đổi không có chế độ thí nghiệm riêng.** Slider cho phép thay góc từ 0° đến 45°. Nếu mục tiêu là mô tả Trái Đất hiện tại, giá trị phải cố định khoảng 23,44°. Nếu cho phép thay đổi, phải ghi đây là thí nghiệm giả định về obliquity.
2. **Điều khiển góc chiếu sáng không biểu diễn đúng xích vĩ Mặt Trời.** Mã đặt trục quay theo vector (a=(-\sin\epsilon,\cos\epsilon,0)), với \(\epsilon\) là góc nghiêng trục; đồng thời đặt hướng Mặt Trời (s=(\cos\delta,\sin\delta,0)), với \(\delta\) là giá trị slider `sunDec`. Khi đó:
   - (a\cdot s=\sin(\delta-\epsilon))
   - Xích vĩ Mặt Trời thực tế tương ứng với cấu hình này là \(\delta-\epsilon\), không phải \(\delta\).
   - Với \(\epsilon=23,5°\), slider ở 0° tạo xích vĩ khoảng −23,5°; slider từ −23,5° đến +23,5° tạo xích vĩ khoảng −47° đến 0°, không phải dải ±23,5°.
   - Vì vậy, nếu slider được hiểu là xích vĩ Mặt Trời thì phép đặt hướng chiếu sáng hiện tại sai. Nếu chỉ muốn xoay hướng đèn tùy ý, cần đổi nhãn và không gắn với mùa hoặc xích vĩ.
3. **Không có chuyển động quỹ đạo.** Mã thay đổi hướng Mặt Trời bằng một vector trực tiếp, không mô phỏng Trái Đất chuyển động quanh Mặt Trời và trục giữ hướng gần như cố định trong không gian. Không thể dùng mô hình này để giải thích mùa hoặc bốn mùa.
4. **Chu kỳ 24 giờ và chu kỳ quay sao chưa được phân biệt.** Mã dùng tốc độ góc 15° cho mỗi giờ mô phỏng; đây là một ngày Mặt Trời trung bình nếu Mặt Trời được giữ cố định. Nó không phải chu kỳ quay sao 23 giờ 56 phút 4 giây. Nội dung mô tả cần nêu rõ quy ước.
5. **Texture dự phòng là các đa giác thô.** Khi ảnh địa lí không tải được, mã vẫn hiển thị bản đồ tạo thủ công; không đủ độ chính xác để nhận dạng vị trí hoặc dùng như dữ liệu bản đồ.
6. **Nguồn texture không nhất quán.** Mã ưu tiên `assets/img/earth.jpg`, sau đó tải ảnh từ ví dụ Three.js, rồi mới giữ texture procedural. Nguồn và giấy phép của asset cục bộ chưa được ghi trong module.
7. **Mây được tạo ngẫu nhiên.** Lớp mây dùng các vệt tròn mờ sinh bằng Canvas và có tốc độ quay riêng; không phải dữ liệu mây quan trắc.
8. **Vòng lặp tiếp tục chạy khi tạm dừng.** Hàm `frame()` vẫn gọi `requestAnimationFrame(frame)` ở đầu mỗi khung hình, kể cả khi `playing=false`; chỉ phần góc quay dừng. Điều này làm vòng lặp dựng hình tiếp tục khi không có thay đổi.
9. **Thiếu xử lý tab nền.** Mã không tạm dừng vòng lặp khi trang bị ẩn; có thể tiêu tốn tài nguyên khi người dùng chuyển tab.
10. **Tốc độ một vòng và tốc độ bước chưa đồng bộ.** Nút “1 vòng” và các bước 15°/30°/45° dùng tốc độ 100°/giây, không phụ thuộc slider tốc độ. Đây là animation điều khiển, không phải thời gian quay vật lí.
11. **Địa điểm được làm tròn.** Các tọa độ Hà Nội, Tokyo, London và New York là tọa độ đại diện đã làm tròn; nên ghi “gần đúng” và không coi là tọa độ của một điểm khảo sát cụ thể.
12. **Trạng thái ngày/đêm tại vùng cực chưa đầy đủ.** Phân loại bình minh/hoàng hôn dùng đạo hàm hình học đơn giản; chưa xử lý đầy đủ ngày cực, đêm cực và trường hợp Mặt Trời ở gần đường chân trời trong thời gian dài.

## 3. Đánh giá pilot SCIAVERSE

Pilot được xây dựng độc lập trong `earth-rotation.js`, không sao chép nguyên trạng mô hình EDUVERSE.

### Những điểm đã được xử lý

- Trục nghiêng được cố định ở 23,44° so với trục tham chiếu vuông góc mặt phẳng quỹ đạo.
- Trục tham chiếu được vẽ bằng đường đứt; trục quay được thể hiện riêng.
- Hướng Mặt Trời được cố định theo +Z. Trục quay được nghiêng trong mặt phẳng XY, nên tích vô hướng giữa trục quay và hướng Mặt Trời bằng 0 trong cấu hình mặc định; đây là cấu hình phân điểm (equinox-like) phù hợp cho minh họa ngày–đêm.
- Quả Địa Cầu quay quanh trục local Y trong nhóm đã nghiêng. Theo quy ước tọa độ hình cầu và UV của texture hiện dùng, chiều quay dương quanh Y tương ứng hướng Tây sang Đông. Cần xác nhận trực quan bằng landmark trên texture khi chạy trình duyệt.
- Pilot dùng 24 giờ mô phỏng cho một vòng ngày Mặt Trời trung bình và ghi rõ chu kỳ quay sao ngắn hơn khoảng 3 phút 56 giây. Đây là lựa chọn nhất quán với việc giữ Mặt Trời cố định để minh họa ngày–đêm.
- Không có slider đổi trục nghiêng, đảo chiều quay hoặc xích vĩ Mặt Trời giả định.
- Không mô phỏng mùa hoặc chuyển động quỹ đạo; chú thích ở giao diện đã nêu giới hạn này.
- Dùng ảnh NASA Blue Marble 2048×1024 từ NASA SVS. Không có texture procedural thay thế nếu tải ảnh thất bại; giao diện hiển thị lỗi và khóa điều khiển.
- Tốc độ là hệ số tua thời gian, không phải tốc độ quay thực. Đồng hồ hiển thị giờ mô phỏng.
- Khi bật reduced motion, mô hình mặc định ở trạng thái tạm dừng.
- Vòng lặp dừng khi trang bị ẩn; chỉ tiếp tục khi cần chuyển động hoặc OrbitControls còn damping.
- Có ResizeObserver, giới hạn pixel ratio 1,5, xử lý WebGL cleanup khi pagehide và giải phóng geometry/material/texture.

### Điểm còn phải hoàn thiện

1. **Ghi công NASA trên giao diện hoặc vùng thông tin nguồn.** URL texture là Blue Marble 2048×1024, nhưng trang chủ hiện chưa hiển thị tên bộ ảnh, NASA/GSFC SVS và thông tin đây là ảnh ghép từ quan sát năm 2001, phát hành năm 2004.
2. **Nêu rõ quy ước thời gian ở ngay điều khiển.** Tốc độ 1× hiện tương ứng một giờ mô phỏng mỗi giây thực; nên ghi rõ để tránh hiểu 1× là thời gian thực.
3. **Kiểm tra hướng quay bằng địa danh.** Công thức tọa độ và chiều quay dương phù hợp về mặt toán học, nhưng chưa có kiểm thử trình duyệt xác nhận các địa danh trên texture di chuyển đúng hướng Đông/Tây.
4. **Kiểm tra trạng thái lỗi giữa lúc khởi tạo.** Nếu lỗi xảy ra sau khi renderer hoặc một phần scene đã được tạo, `catch` chỉ hiển thị lỗi; cần bảo đảm các tài nguyên đã khởi tạo được giải phóng.
5. **Kiểm tra CDN và texture trên mạng yếu.** Three.js, OrbitControls và texture đều tải từ bên ngoài; khi không có mạng, mô hình hiện không hoạt động. Trạng thái lỗi đã có, nhưng chưa có kiểm thử offline hoặc trên mạng chập chờn.
6. **Kiểm tra tương tác bàn phím.** Nút chạy/tạm dừng, đặt lại và slider có thể thao tác bằng bàn phím; thao tác xoay/zoom camera hiện chủ yếu dựa vào pointer. Cần có cách xem thay thế hoặc điều khiển camera bằng bàn phím nếu cần thao tác 3D đầy đủ.
7. **Kiểm tra reduced motion khi thay đổi thiết lập trong lúc trang đang mở.** Giá trị `matchMedia` được đọc khi khởi tạo; chưa có listener theo dõi thay đổi tùy chọn trong phiên.
8. **Kiểm tra cleanup khi khởi tạo thất bại giữa chừng.** Cleanup đầy đủ được đăng ký ở `pagehide`; nhưng nếu `init()` ném lỗi trước khi hoàn tất, cần xử lý tài nguyên một phần đã tạo.
9. **Kiểm tra bố cục và hiệu năng thực tế.** Chưa có kiểm thử trực tiếp trên Android WebGL, iOS, trình duyệt desktop hoặc các kích thước 320, 360, 390 và 430 CSS px.

## 4. Đặc tả khoa học giữ cho pilot

- Trục nghiêng cố định 23,44° so với phương vuông góc mặt phẳng quỹ đạo.
- Trục quay không đổi hướng trong không gian trong phạm vi mô hình; Trái Đất quay quanh chính trục đó.
- Hướng quay Tây → Đông.
- Mặt Trời cố định, chiếu sáng hình học tạo vùng ngày và đêm.
- Một vòng quay trong đồng hồ mô phỏng là 24 giờ Mặt Trời trung bình. Ghi chú riêng chu kỳ quay sao khoảng 23 giờ 56 phút 4 giây.
- Cấu hình chiếu sáng mặc định là phân điểm; không suy diễn thành mùa.
- Không có chuyển động quỹ đạo, xích vĩ Mặt Trời thay đổi, mùa, tuế sai hoặc biến thiên độ nghiêng trục.
- Tốc độ điều khiển là hệ số tua thời gian; không gọi là tốc độ thực.
- Ảnh Blue Marble là ảnh ghép vệ tinh có thời điểm dữ liệu lịch sử, không phải ảnh Trái Đất thời gian thực.
- Khi texture hoặc WebGL lỗi, phải hiển thị trạng thái lỗi thay vì thay bằng bản đồ giả lập không được ghi nhãn.

## 5. Tiêu chí kiểm chứng trước khi công bố

- Trục quay luôn giữ góc 23,44° với trục tham chiếu; không tự thay đổi khi quả cầu quay.
- Đường xích đạo vuông góc với trục quay.
- Hướng quay của các điểm trên texture đúng Tây → Đông.
- Hướng chiếu sáng và ranh giới ngày–đêm nhất quán khi Trái Đất quay.
- Cấu hình mặc định là phân điểm: Mặt Trời nằm trong mặt phẳng xích đạo của mô hình.
- Đồng hồ 24 giờ mô phỏng khớp một vòng ngày Mặt Trời trung bình; chú thích phân biệt ngày sao.
- Tốc độ không phụ thuộc tốc độ khung hình.
- Texture tải được, có ghi nguồn; lỗi tải hiển thị rõ.
- Reduced motion mặc định dừng chuyển động; người dùng có thể chủ động bắt đầu.
- Tab nền dừng animation; quay lại trang khôi phục đúng trạng thái.
- Không có lỗi console, vòng lặp trùng hoặc tài nguyên WebGL không được giải phóng.
- Điều khiển cơ bản dùng được bằng bàn phím; không tràn ngang ở 320, 360, 390 và 430 CSS px.
- Kiểm tra thực tế trên điện thoại Android trước khi nghiệm thu.

## 6. Kết luận

Mã EDUVERSE có nền tảng hình học hữu ích để tham khảo, nhưng slider góc chiếu sáng không ánh xạ đúng sang xích vĩ Mặt Trời; texture dự phòng, đám mây ngẫu nhiên và vòng lặp khi tạm dừng cũng chưa đạt yêu cầu tiếp nhận nguyên trạng.

Pilot SCIAVERSE đã khắc phục các vấn đề khoa học chính bằng cách cố định độ nghiêng 23,44°, dùng cấu hình chiếu sáng phân điểm, giữ Mặt Trời cố định, sử dụng ngày Mặt Trời trung bình 24 giờ và không mô phỏng mùa khi chưa có quỹ đạo. Việc tải texture NASA có trạng thái lỗi rõ ràng và reduced motion được xử lý ở trạng thái khởi tạo.

Pilot chưa được nghiệm thu vì chưa kiểm thử trực tiếp trên trình duyệt và thiết bị. Cần bổ sung ghi công NASA trên giao diện, kiểm tra hướng quay bằng landmark, xử lý lỗi khởi tạo một phần và xác nhận tương tác bàn phím/di động trước khi chuyển trạng thái sang `validated`.

## Nguồn tham khảo

- NASA. *Chapter 2: Reference Systems*. https://science.nasa.gov/learn/basics-of-space-flight/chapter2-1/
- U.S. Naval Observatory. *The Seasons and the Earth's Orbit*. https://aa.usno.navy.mil/faq/seasons_orbit
- NASA NSSDC. *Earth Fact Sheet*. https://nssdc.gsfc.nasa.gov/planetary/factsheet/earthfact.html
- NASA Goddard Space Flight Center Scientific Visualization Studio. *Blue Marble — A Seamless Image Mosaic of the Earth*. https://svs.gsfc.nasa.gov/2915/

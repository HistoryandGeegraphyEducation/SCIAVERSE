# Thẩm định nguồn gốc — Trái Đất tự quay quanh trục

- Mã nguồn tham chiếu EDUVERSE: `js/sims/earth.js`
- Mã thử nghiệm SCIAVERSE: `simulations/earth/rotation/main.js`
- SHA blob nguồn EDUVERSE đã đọc: `56feba1aea96326fd2a2c95c576507b4eee7fe40`
- Trạng thái mã EDUVERSE lưu trữ: `needs-revision`.
- Trạng thái khoa học SCIAVERSE theo Registry: `validated`.
- Trạng thái triển khai SCIAVERSE: `verified-in-build` sau kiểm thử CI ngày 28/11/2026.
- Phạm vi: hướng và chu kỳ quay, trục nghiêng, chiếu sáng ngày–đêm, vị trí biểu kiến Mặt Trời và Mặt Trăng, đồng hồ múi giờ, texture và vòng đời WebGL.

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

Pilot được triển khai độc lập trong `simulations/earth/rotation/main.js`. Trang mô hình nằm trong cùng thư mục; không còn dùng JavaScript mô hình ở thư mục gốc.

### Cơ chế hiện tại

- Trục quay trùng pháp tuyến mặt phẳng xích đạo; mặt phẳng hoàng đạo được biểu diễn riêng và nghiêng 23,44° so với mặt phẳng xích đạo.
- Trái Đất quay quanh trục theo chiều Tây sang Đông.
- Đồng hồ mô phỏng dùng thời gian tích lũy theo delta thời gian giữa các khung hình. Một ngày Mặt Trời trung bình trong mô hình tương ứng 60 giây thực. Góc quay Trái Đất được cập nhật bằng chênh lệch GMST, không dùng 360°/ngày sao.
- Vị trí biểu kiến của Mặt Trời được tính bằng công thức thiên văn xấp xỉ theo ngày Julius mô phỏng. Vị trí Mặt Trăng được tính bằng bộ phần tử quỹ đạo gần đúng; cả hai dùng cùng thời gian mô phỏng đã tăng tốc.
- Mô hình không vẽ quỹ đạo Trái Đất quanh Mặt Trời. Sự thay đổi hướng biểu kiến của Mặt Trời theo ngày được tính bằng công thức, không phải dữ liệu ephemeris độ chính xác cao.
- Ảnh bề mặt Trái Đất tải từ tệp NASA Blue Marble cục bộ; nếu không tải được, mô hình thử các nguồn NASA trực tuyến. Không còn tạo bản đồ procedural để thay ảnh thật. Nếu tất cả nguồn đều lỗi, trang hiển thị lỗi và dọn tài nguyên đã khởi tạo.
- Không dựng lớp mây trong mô hình; tránh dùng texture chưa xác minh nguồn và giấy phép.
- Mặt Trăng được thể hiện bằng hình cầu màu đơn, không dùng texture miêu tả địa hình giả. Vị trí, kích thước và khoảng cách của Mặt Trời, Mặt Trăng không theo tỉ lệ không gian thực.
- Đồng hồ quốc gia dùng múi giờ IANA và thời gian hiện tại của thiết bị; đồng hồ này không chạy theo thời gian mô phỏng thiên văn.
- Khi bật reduced motion, chuyển động tự động dừng nhưng khung hình tĩnh vẫn được dựng khi cần tương tác camera. Khi tab bị ẩn, requestAnimationFrame bị hủy; khi quay lại, mô phỏng tiếp tục mà không cộng thời gian tab nền.
- Lỗi trong quá trình khởi tạo gọi cleanup để giải phóng renderer, texture, geometry, material, OrbitControls, observer và event listeners.

### Điểm còn phải hoàn thiện

1. Xác nhận bằng landmark trên texture rằng chiều quay quan sát được đúng Tây sang Đông.
2. Kiểm tra lỗi tải texture Blue Marble cục bộ và các URL NASA dự phòng trên mạng yếu, CORS và chế độ offline.
3. Đối chiếu vị trí Mặt Trời và Mặt Trăng với một bộ ephemeris độc lập tại các ngày kiểm tra; hiện các công thức là xấp xỉ.
4. Kiểm tra thao tác OrbitControls, khả năng truy cập bằng bàn phím và trạng thái focus. Camera hiện chủ yếu được điều khiển bằng pointer.
5. Kiểm thử WebGL, vòng đời tài nguyên và hiệu năng trên Android, iOS và desktop; kiểm tra các chiều rộng 320, 360, 390 và 430 CSS px.
6. Chưa có kiểm thử runtime trình duyệt trong lượt cập nhật này. Việc rà soát mã và cập nhật hồ sơ không thay thế kiểm thử thực tế.

## 4. Đặc tả khoa học hiện hành

- Trục quay nghiêng cố định 23,44° so với phương vuông góc mặt phẳng quỹ đạo.
- Hướng quay Tây → Đông.
- Một ngày Mặt Trời trung bình được nén thành 60 giây thực; tốc độ được tính theo thời gian thực giữa các khung hình, không phụ thuộc số FPS.
- Ngày Julius mô phỏng tăng cùng tốc độ tua; công thức Mặt Trời và Mặt Trăng nhận cùng ngày mô phỏng để tránh cho hai thiên thể chạy theo hai thang thời gian độc lập.
- Mặt Trời dùng công thức tọa độ biểu kiến xấp xỉ. Mặt Trăng dùng phần tử quỹ đạo gần đúng; mô hình không thay thế ephemeris thiên văn.
- Không dựng đường quỹ đạo Trái Đất quanh Mặt Trời. Mô hình không phải mô phỏng hệ Mặt Trời theo tỉ lệ.
- Kích thước và khoảng cách Mặt Trời, Mặt Trăng được nén để hiển thị; không dùng để suy ra tỉ lệ không gian.
- Ảnh Blue Marble là ảnh ghép từ quan sát vệ tinh có thời điểm dữ liệu lịch sử, không phải ảnh Trái Đất trực tiếp.
- Không mô phỏng mây; không có lớp mây dữ liệu trong mô hình.
- Khi không tải được texture Blue Marble hoặc WebGL không khởi tạo được, mô hình phải báo lỗi; không thay bằng bản đồ địa lí tự tạo.

## 5. Tiêu chí kiểm chứng trước khi công bố kỹ thuật

- Trục quay giữ góc 23,44° với trục tham chiếu; đường xích đạo vuông góc với trục.
- Hướng quay của các landmark trên texture đúng Tây sang Đông.
- Vị trí Mặt Trời và Mặt Trăng khớp với bộ kiểm tra ephemeris độc lập trong sai số của công thức xấp xỉ đã chọn.
- Một vòng quay mô phỏng hoàn tất trong 60 giây thực ở chế độ chuyển động bình thường.
- Thời gian mô phỏng không tăng khi tab ở nền hoặc khi reduced motion được bật.
- Texture NASA tải được từ nguồn cục bộ; lỗi tất cả nguồn phải hiển thị rõ và không để lại WebGL resource.
- Đồng hồ quốc gia khớp múi giờ IANA và thời gian hệ thống.
- Không có lỗi console, vòng lặp trùng hoặc tài nguyên WebGL không được giải phóng.
- Giao diện không tràn ngang tại 320, 360, 390 và 430 CSS px; các thao tác camera có phương án truy cập phù hợp.
- Kiểm tra thực tế trên điện thoại Android trước khi nghiệm thu kỹ thuật.

## 6. Kết luận

Các điểm khoa học chính đã được giữ trong pilot: trục nghiêng cố định 23,44°, chiều quay Tây sang Đông và chu kỳ ngày Mặt Trời trung bình được nén thời gian. Vị trí biểu kiến của Mặt Trời và Mặt Trăng được tính theo cùng ngày Julius mô phỏng bằng các công thức xấp xỉ. Các khoảng cách và kích thước thiên thể được nén, không dùng như mô hình không gian theo tỉ lệ.

Đã sửa đường dẫn texture theo vị trí trang, bỏ texture Trái Đất procedural và lớp mây chưa xác minh nguồn, chuyển mã mô hình vào thư mục riêng, đồng bộ thời gian thiên văn với thời gian mô phỏng, dừng animation khi tab nền hoặc reduced motion, và bổ sung cleanup khi khởi tạo lỗi. Trang đã có tiêu đề mô hình, ghi nguồn ảnh Blue Marble và công bố giới hạn tỉ lệ hình học.

Trạng thái khoa học trong registry là `validated` theo xác nhận của chủ dự án ngày 26/11/2026. Trạng thái triển khai theo Registry hiện là `verified-in-build` sau kiểm thử CI Chromium/Playwright; kiểm thử thiết bị vật lý vẫn còn mở.

## Nguồn tham khảo

- NASA. *Chapter 2: Reference Systems*. https://science.nasa.gov/learn/basics-of-space-flight/chapter2-1/
- U.S. Naval Observatory. *The Seasons and the Earth's Orbit*. https://aa.usno.navy.mil/faq/seasons_orbit
- NASA NSSDC. *Earth Fact Sheet*. https://nssdc.gsfc.nasa.gov/planetary/factsheet/earthfact.html
- NASA Goddard Space Flight Center Scientific Visualization Studio. *Blue Marble — A Seamless Image Mosaic of the Earth*. https://svs.gsfc.nasa.gov/2915/


## Cập nhật triển khai — 26/11/2026

Đã cập nhật trên nhánh `foundation/science-spaces-and-model-registry`:

- `index.html`: thêm ghi công NASA SVS và liên kết nguồn; thêm chú thích quy ước tốc độ mô phỏng; liên kết slider với chú thích bằng `aria-describedby`.
- `app.js`: bổ sung bản dịch Việt/Anh cho chú thích tốc độ và ghi công ảnh.
- `styles.css`: bổ sung kiểu chữ cho chú thích tốc độ và dòng nguồn, giữ nguyên hệ màu và bố cục hiện có.

Kiểm tra tĩnh:
- Cú pháp JavaScript đã được kiểm tra tĩnh ở phiên trước; thay đổi đường dẫn mô-đun hiện chưa được kiểm tra cú pháp bằng Node.
- Thẻ HTML p/label/span: số thẻ mở và đóng cân bằng.
- `aria-describedby` trỏ đến phần tử tồn tại.
- Cả ba khóa dịch mới có bản Việt và Anh.
- Liên kết NASA SVS và `rel="noopener noreferrer"` tồn tại.
- Dấu ngoặc CSS cân bằng; selector mới tồn tại.

Chưa kiểm tra trực tiếp giao diện trong trình duyệt, WebGL, Android hoặc iOS. Không dùng kết quả kiểm tra tĩnh thay cho nghiệm thu hiển thị.


## Cập nhật vòng đời tài nguyên — 26/11/2026

Trong pilot SCIAVERSE, đã bổ sung một đường cleanup idempotent dùng chung cho lỗi khởi tạo và sự kiện rời trang:

- Hủy animation frame đang chờ.
- Ngắt ResizeObserver.
- Gỡ các listener được đăng ký bởi mô hình.
- Gỡ listener change và dispose OrbitControls.
- Dispose hình học, vật liệu, texture, renderer và WebGL context.
- Nếu quá trình tải thư viện hoặc texture lỗi, giải phóng tài nguyên đã khởi tạo một phần trước khi hiển thị trạng thái lỗi.
- Nếu người dùng rời trang trước khi texture tải xong, texture đến muộn được dispose thay vì gắn vào scene đã hủy.

Đây là sửa lỗi vòng đời theo mã nguồn; chưa chứng minh được hành vi trên mọi trình duyệt. Vẫn cần thử WebGL và chuyển trang trên Android/iOS, kiểm tra landmark để xác nhận hướng quay trực quan.

## Cập nhật mô hình — 28/11/2026

- Bổ sung vòng xích đạo và trục quay Trái Đất; vòng hoàng đạo được đặt nghiêng 23,439291° so với mặt phẳng xích đạo. Trục quay cố định trong hệ quy chiếu không gian của mô hình.
- Góc quay dùng chênh lệch Greenwich Mean Sidereal Time (GMST) giữa thời điểm mô phỏng và thời điểm bắt đầu. Một ngày Mặt Trời trung bình 60 giây tương ứng khoảng 360,985647° quay so với hệ sao; chuyển động biểu kiến của Mặt Trời bù phần xấp xỉ 0,985647° mỗi ngày.
- GMST được tính theo công thức gần đúng từ Julian Date. Thời gian JavaScript UTC được dùng thay UT1; mô hình không hiệu chỉnh chuyển động cực hoặc toàn bộ thành phần nutation. Không dùng kết quả cho định vị thiên văn chính xác.
- Nguồn bổ sung: U.S. Naval Observatory, *Computing Approximate Sidereal Time*, https://aa.usno.navy.mil/faq/GAST; NOAA/NESDIS/STAR, *MAG Convert Data to Alternate Geophysical Coordinate Systems*, ATBD v1.3, mục 3.4.2.3, https://www.ngdc.noaa.gov/stp/space-weather/online-publications/stp_sii/spades/algorithm-theoretic-basis-documents/atbds_mag/atbd_mag07_coordinate-systems_v1-3.pdf.

## Kiểm thử runtime — 28/11/2026

- GitHub Actions workflow `SCIAVERSE validation`, run `46107719993`, kết quả `success`, commit `eff7290536d290e83d47395061eb232d7af95ab0`.
- Chromium/Playwright xác nhận tải texture và khởi tạo canvas; danh sách múi giờ có 15 lựa chọn; chọn UTC trả về `UTC +0`. Kiểm tra nguồn mã xác nhận dùng chênh lệch GMST và vòng hoàng đạo.
- Responsive smoke test kiểm tra 320, 360, 390 và 430 CSS px. Không thay thế kiểm thử trên thiết bị vật lý hoặc đối chiếu ephemeris độc lập.

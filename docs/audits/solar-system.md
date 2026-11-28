# Thẩm định nguồn gốc — Khám phá các hành tinh

- Mã nguồn tham chiếu: `EDUVERSE/js/sims/solar-system-explorer.js`
- Trạng thái cập nhật: `in-review`
- Phạm vi: dữ liệu tám hành tinh và Mặt Trời, kích thước, khoảng cách, chu kỳ tự quay/quỹ đạo, độ nghiêng trục, mô hình quỹ đạo, texture và tương tác.
- Kết luận cập nhật 2026-11-28: bộ dữ liệu tám hành tinh được đối chiếu với NASA/JPL; chuyển động tự quay, độ nghiêng trục và chiều quay được thể hiện trong mô hình bằng trục quay nghiêng, mốc kinh tuyến và tốc độ tính từ chu kỳ tự quay sao. Quỹ đạo vẫn là đường tròn đồng phẳng, pha ban đầu không phải ephemeris, và kích thước/khoảng cách được nén riêng. Mô hình phù hợp để quan sát định tính, chưa dùng để xác định vị trí thiên văn theo thời điểm.

## Căn cứ khoa học

1. NASA Jet Propulsion Laboratory (JPL), *Planetary Physical Parameters*: https://ssd.jpl.nasa.gov/planets/phys_par.html
   - Bảng cung cấp bán kính xích đạo, bán kính trung bình, khối lượng, chu kỳ tự quay sao và chu kỳ quỹ đạo sao của các hành tinh.
   - JPL phân biệt rõ bán kính xích đạo và bán kính trung bình; chu kỳ tự quay sao được tính tương đối với các sao cố định.
   - Dữ liệu JPL hiện ghi chu kỳ tự quay âm đối với Sao Kim và Sao Thiên Vương, biểu thị chuyển động nghịch hành.

2. NASA/NSSDC, *Planetary Fact Sheets*: https://nssdc.gsfc.nasa.gov/planetary/factsheet/
   - Dùng để đối chiếu các đại lượng vật lí, tham số quỹ đạo, chu kỳ ngày và độ nghiêng trục.
   - Các fact sheet của từng hành tinh phân biệt chu kỳ quay sao, độ dài ngày, bán trục lớn, độ lệch tâm và độ nghiêng quỹ đạo.

3. NASA, *How Tilted Are The Planets?*, tài liệu giáo dục NASA Heliophysics Education Activation Team: https://assets.science.nasa.gov/content/dam/science/hpd/heat/teacher-lessons/Why%20Do%20We%20Have%20Seasons_%20by%20Tanya%20Anderson_0.pdf
   - Bảng độ nghiêng trục làm tròn cho tám hành tinh: Sao Thủy gần 0°, Sao Kim khoảng 177°, Trái Đất 23°, Sao Hỏa 25°, Sao Mộc 3°, Sao Thổ 27°, Sao Thiên Vương 98°, Sao Hải Vương 28°.

4. NASA, *Uranus Facts*: https://science.nasa.gov/uranus/facts/
   - Trục quay Sao Thiên Vương nghiêng khoảng 97,77°; chu kỳ quay khoảng 17 giờ và chu kỳ quỹ đạo khoảng 84 năm.

5. NASA, *Neptune Facts*: https://science.nasa.gov/neptune/neptune-facts/
   - Trục quay Sao Hải Vương nghiêng khoảng 28° so với mặt phẳng quỹ đạo; một vòng quay mất khoảng 16 giờ và một vòng quỹ đạo khoảng 165 năm.
   - Sao Hải Vương không có bề mặt rắn; nhiệt độ phải gắn với độ cao/áp suất hoặc tầng khí quyển cụ thể.

## Rà soát triển khai SCIAVERSE ngày 2026-11-28

- Tám hành tinh được dùng cùng bộ tham số đường kính trung bình, khối lượng, bán trục lớn, chu kỳ quỹ đạo sao, chu kỳ tự quay sao và độ nghiêng trục. Nguồn dữ liệu chính là NASA/JPL Planetary Physical Parameters; NASA/NSSDC được dùng để đối chiếu định nghĩa.
- Vị trí quỹ đạo được cập nhật theo thời gian mô phỏng. Tốc độ góc quỹ đạo dùng chu kỳ quỹ đạo riêng của từng hành tinh; mốc 1× tương ứng một năm Trái Đất trong 120 giây thực.
- Mỗi hành tinh có trục quay nghiêng theo giá trị độ nghiêng trục. Mốc kinh tuyến trên bề mặt quay theo chu kỳ tự quay sao; độ nghiêng lớn hơn 90° biểu diễn trục hướng ngược so với pháp tuyến quỹ đạo, phù hợp với các trường hợp nghịch hành trong bộ dữ liệu.
- Tỉ lệ kích thước và bán kính quỹ đạo được nén độc lập. Quỹ đạo tròn, đồng phẳng và pha ban đầu là giả định trực quan; không mô phỏng độ lệch tâm, định luật Kepler đầy đủ hoặc vị trí hành tinh tại epoch cụ thể.
- Texture hình cầu đơn sắc và mốc kinh tuyến chỉ hỗ trợ quan sát hướng quay; chúng không phải ảnh bề mặt hành tinh hoặc dữ liệu quan trắc.
- Kết quả rà soát mã nguồn không thay cho kiểm thử WebGL runtime trên thiết bị thật. Trạng thái khoa học tiếp tục là `in-review` cho đến khi các phép kiểm tra hiển thị và dữ liệu được nghiệm thu.

## Kết quả đọc mã nguồn EDUVERSE (hồ sơ lịch sử)

Các nhận xét trong phần này mô tả phiên bản EDUVERSE được dùng làm đầu vào nghiên cứu, không mô tả mã SCIAVERSE hiện tại.

### Dữ liệu hành tinh

- Mô hình có đủ tám hành tinh theo thứ tự từ Sao Thủy đến Sao Hải Vương; Mặt Trời được lưu riêng như một ngôi sao.
- Các giá trị đường kính và khối lượng phần lớn tương ứng với số liệu JPL khi làm tròn:
  - Sao Thủy: đường kính 4.879 km và khối lượng (3,30\times10^{23}\) kg, gần với đường kính suy ra từ bán kính trung bình 2.439,4 km và khối lượng (0,330103\times10^{24}\) kg.
  - Trái Đất: đường kính 12.742 km và khối lượng (5,97\times10^{24}\) kg, gần với bán kính trung bình 6.371,0084 km và khối lượng (5,97217\times10^{24}\) kg.
  - Sao Mộc: đường kính 139.820 km, gần với đường kính trung bình suy ra từ bán kính trung bình JPL 69.911 km.
- Dữ liệu đường kính đang tương ứng chủ yếu với **đường kính trung bình**, không phải đường kính xích đạo. Chẳng hạn, JPL tách bán kính xích đạo và bán kính trung bình của Sao Mộc, Sao Thổ, Sao Thiên Vương và Sao Hải Vương. Giao diện hiện chỉ ghi “Đường kính”, chưa nêu quy ước.
- Các khối lượng được làm tròn khá sát với số liệu JPL. Các khoảng cách và chu kỳ quỹ đạo cũng có vẻ là giá trị xấp xỉ thông dụng, nhưng chưa có nguồn, thời điểm tham chiếu hoặc định nghĩa đại lượng đi kèm từng bản ghi.
- Chu kỳ tự quay được hiển thị dưới dạng thời lượng dương. Mã animation dùng tốc độ âm cho Sao Kim và Sao Thiên Vương, nhưng phần thông tin không ghi rõ hai hành tinh này quay nghịch hành.
- Mặt Trời có đường kính 1.392.700 km, khối lượng (1,989\times10^{30}\) kg và nhiệt độ khoảng 5.500°C ở bề mặt; đây là các giá trị làm tròn thường dùng. Nên ghi rõ nhiệt độ là nhiệt độ quang quyển.

### Chu kỳ quay và quỹ đạo

- Các giá trị “Chu kỳ tự quay” như Sao Thủy 58,6 ngày, Sao Kim 243 ngày, Trái Đất 23 giờ 56 phút và Sao Hỏa 24 giờ 37 phút chủ yếu là chu kỳ tự quay sao. Chúng không đồng nghĩa với ngày Mặt Trời tại hành tinh.
- Chu kỳ Sao Thổ trong giao diện là 10 giờ 33 phút. Bảng JPL ghi 0,44401 ngày, tương đương khoảng 10 giờ 39 phút; NASA/NSSDC cũng ghi khoảng 10,656 giờ. Giá trị đang dùng cần được đối chiếu lại và thống nhất nguồn trước khi sửa.
- Tốc độ góc quỹ đạo trong mã lần lượt là các hằng số animation riêng: 0,047; 0,035; 0,029; 0,024; 0,013; 0,0095; 0,0068; 0,0054. Chúng không được suy ra từ chu kỳ quỹ đạo đã hiển thị.
- Tốc độ tự quay cũng là các hằng số animation riêng. Ví dụ, Sao Thủy dùng 0,004 rad/s trong khi Trái Đất dùng 0,018 rad/s; tỷ lệ này không phản ánh tỷ lệ chu kỳ tự quay thực tế.
- Biến `timeScale` chỉ nhân các tốc độ animation. Mốc 1× không được gắn với một đơn vị thời gian mô phỏng như “một ngày Trái Đất” hoặc “một năm Trái Đất”. Biến `elapsed` được tăng nhưng không dùng để hiển thị thời gian mô phỏng.
- Các hành tinh đi trên quỹ đạo tròn đồng phẳng. Pha ban đầu được gán theo chỉ số hành tinh nhân 0,72; không phải vị trí thiên văn tại một epoch xác định.
- Vì vậy, mô hình hiện không thể hiện định luật Kepler, độ lệch tâm quỹ đạo, thay đổi vận tốc theo vị trí trên quỹ đạo, độ nghiêng quỹ đạo hoặc vị trí biểu kiến theo ngày. Chú thích ở chân mô hình đã nói khoảng cách và quỹ đạo được điều chỉnh, nhưng chưa mô tả đầy đủ giới hạn này.
- Kích thước hành tinh và bán kính quỹ đạo đều được nén độc lập. Đây là lựa chọn hiển thị có thể chấp nhận nếu công bố rõ không theo cùng một tỉ lệ không gian.

### Độ nghiêng trục và hướng quay

- Phần lớn hành tinh quay quanh trục local Y, trùng với pháp tuyến của mặt phẳng quỹ đạo mô phỏng. Do đó mô hình đang ngầm đặt độ nghiêng trục của phần lớn hành tinh bằng 0°.
- Sao Thiên Vương được đặt `body.rotation.z = 1.7` rad, tương đương khoảng 97,4°. Giá trị này gần với độ nghiêng trục khoảng 97,77° của NASA, nhưng cần biểu diễn và ghi nhãn rõ là độ nghiêng so với pháp tuyến mặt phẳng quỹ đạo.
- Sao Hải Vương được đặt `body.rotation.z = 0.2` rad, tương đương khoảng 11,5°. Giá trị này không khớp độ nghiêng trục khoảng 28°–28,32° trong tài liệu NASA/NSSDC.
- Sao Kim có tốc độ tự quay âm, Sao Thiên Vương cũng có tốc độ âm; điều này thể hiện chiều quay nghịch hành trong quy ước animation hiện tại. Tuy nhiên, giao diện không giải thích ý nghĩa dấu âm hoặc chiều quay nghịch hành.
- Độ nghiêng trục của Trái Đất, Sao Hỏa, Sao Mộc và Sao Thổ chưa được thiết lập tương ứng với các giá trị thiên văn thông dụng.
- Vành đai Sao Thổ được dựng trong mặt phẳng riêng bằng một góc quay cố định. Góc này chưa được ràng buộc với trục quay hành tinh; cần kiểm tra lại quan hệ giữa mặt phẳng vành đai, mặt phẳng xích đạo và mặt phẳng quỹ đạo.

### Texture và hình ảnh

- Texture của cả tám hành tinh được tạo bằng Canvas, các dải màu, hình đa giác và nhiễu ngẫu nhiên. Chúng không phải ảnh quan trắc hay dữ liệu bản đồ bề mặt có nguồn.
- Bề mặt Trái Đất dùng các đa giác lục địa giản lược; không đủ chính xác để nhận dạng vị trí địa lí.
- Dải khí quyển Sao Mộc/Sao Thổ, mây Sao Kim/Sao Thiên Vương/Sao Hải Vương, đốm đỏ Sao Mộc và mây Trái Đất đều được tạo bằng thuật toán ngẫu nhiên. Đây là texture minh họa, không mô tả trạng thái khí quyển tại thời điểm cụ thể.
- Vết Đỏ Lớn được đặt tại một vị trí ngẫu nhiên cố định trong texture, không có dữ liệu thời điểm hoặc hệ tọa độ hành tinh.
- Hệ thống vành đai Sao Thổ dùng vật liệu màu đồng nhất, không mô tả cấu trúc các vòng, độ đục hoặc phân bố hạt.
- Cần gắn nhãn “texture minh họa” nếu tiếp tục dùng procedural; nếu muốn dùng ảnh khoa học, cần ghi nguồn, sứ mệnh/thiết bị, ngày dữ liệu và quyền sử dụng.

### Nhiệt độ và mô tả

- Nhiệt độ Sao Mộc, Sao Thổ, Sao Thiên Vương và Sao Hải Vương được chú thích là ở tầng mây hoặc đỉnh mây, đây là cách phân biệt cần giữ vì các hành tinh khí/băng khổng lồ không có bề mặt rắn xác định như hành tinh đất đá.
- Nhiệt độ Trái Đất và Sao Hỏa được ghi là trung bình; cần nêu rõ là giá trị trung bình bề mặt/khí hậu xấp xỉ và nguồn tham khảo.
- Nhiệt độ Sao Thủy, Sao Kim cần gắn với đại lượng cụ thể (trung bình bề mặt hoặc nhiệt độ bề mặt) để không nhầm với chênh lệch ngày/đêm hoặc tầng khí quyển.
- Các mô tả thành phần khí quyển, loại hành tinh và vệ tinh tự nhiên nhìn chung phù hợp ở mức khái quát; cần gắn nguồn và tránh trình bày số lượng vệ tinh như giá trị cố định nếu chưa có thời điểm cập nhật.

## Vấn đề kỹ thuật của phiên bản EDUVERSE trước khi tái cấu trúc

Các vấn đề trong phần này được ghi lại để truy nguyên lịch sử và không được hiểu là trạng thái mã hiện tại nếu đã được xử lý trong phần rà soát cập nhật ở trên.

1. Hàm `updatePlanets` dùng tốc độ góc cố định, không chuyển chu kỳ thực thành tốc độ mô phỏng. Tăng/giảm tốc độ chỉ làm nhanh/chậm các hằng số không hiệu chuẩn.
2. Quỹ đạo tròn, đồng phẳng và pha ban đầu tùy chọn không thể dùng để minh họa vị trí thực của các hành tinh vào một ngày cụ thể.
3. Các tỷ lệ hình học của Mặt Trời, hành tinh và quỹ đạo không nhất quán; mô hình phải tiếp tục được ghi là minh họa không theo tỷ lệ.
4. Độ nghiêng trục Sao Hải Vương sai rõ rệt; các hành tinh còn lại thiếu hoặc chưa thiết lập độ nghiêng phù hợp.
5. Texture procedural thay đổi theo lần tải vì có nhiễu và vị trí mây/đốm ngẫu nhiên. Không được trình bày chúng như ảnh thật hoặc dữ liệu quan trắc.
6. `elapsed` không được dùng; giao diện không cho biết thời gian mô phỏng đã trôi qua hay thời gian thiên văn tương ứng.
7. Vòng lặp dựng hình vẫn chạy khi `paused` bật; chỉ cập nhật hành tinh bị dừng, không dừng render. Cần đánh giá hiệu năng trên điện thoại và khi tab ở nền.
8. Sự kiện chọn hành tinh trên canvas dùng `dblclick`, trong khi điều khiển OrbitControls cũng xử lý pointer; cần kiểm thử để tránh xung đột thao tác khi chạm/kéo trên thiết bị di động.
9. Chưa có trạng thái hiển thị rõ khi texture procedural hoặc WebGL không hoạt động; lỗi tải Three.js/OrbitControls được xử lý ở bước khởi tạo nhưng cần kiểm tra hành vi thực tế trên mạng yếu và thiết bị không hỗ trợ WebGL.

## Điều chỉnh bắt buộc trước khi tiếp nhận

1. Tạo một bảng dữ liệu chuẩn có trường nguồn, ngày truy xuất/cập nhật, đơn vị và định nghĩa cho từng đại lượng. Ưu tiên JPL/NASA; không chỉ lưu số liệu dạng chuỗi giao diện.
2. Chuẩn hóa đường kính thành “đường kính trung bình” hoặc ghi rõ “đường kính xích đạo” theo đúng cột dữ liệu nguồn.
3. Chuẩn hóa khoảng cách thành bán trục lớn (AU/km) nếu dùng giá trị quỹ đạo trung bình quy ước; không gọi đó là khoảng cách tức thời.
4. Ghi rõ chu kỳ tự quay sao và chu kỳ quỹ đạo sao. Tách riêng ngày Mặt Trời nếu muốn dạy khái niệm “một ngày” tại mỗi hành tinh.
5. Đối chiếu lại chu kỳ tự quay Sao Thổ; cập nhật dấu/hướng nghịch hành cho Sao Kim và Sao Thiên Vương.
6. Thiết lập độ nghiêng trục phù hợp cho tám hành tinh; sửa Sao Hải Vương từ 0,2 rad lên giá trị gần 28° nếu mô hình thể hiện đúng độ nghiêng so với mặt phẳng quỹ đạo. Không dùng phép quay hình học tùy ý mà không ghi rõ quy ước trục.
7. Nếu mục tiêu là mô phỏng chuyển động có ý nghĩa vật lí, tính tốc độ góc từ chu kỳ thực và quy ước rõ hệ số thời gian. Nếu giữ tốc độ minh họa, phải gắn nhãn “chuyển động minh họa, không theo thời gian thực”.
8. Nếu cần mô phỏng quỹ đạo chính xác hơn, dùng phần tử quỹ đạo/ephemeris có epoch, độ lệch tâm và độ nghiêng; không tự tạo pha ban đầu rồi mô tả như vị trí thật.
9. Duy trì hai lớp hiển thị có chú giải: kích thước/quỹ đạo nén để quan sát và dữ liệu số thực để so sánh. Không trộn lẫn tỉ lệ hiển thị với dữ liệu khoa học.
10. Thay texture procedural bằng ảnh khoa học có nguồn và giấy phép rõ ràng, hoặc giữ texture tổng hợp nhưng ghi nhãn minh họa ở từng hành tinh.
11. Chuẩn hóa nhiệt độ theo bề mặt, tầng mây hoặc mức áp suất; ghi nguồn và thời điểm dữ liệu.
12. Kiểm thử trên điện thoại: chọn hành tinh, xoay/zoom, tạm dừng, đổi tốc độ, đặt lại góc nhìn, hiển thị thông tin, tải texture, xử lý WebGL và giải phóng tài nguyên.

## Ma trận kiểm thử bắt buộc

| Ca kiểm thử | Kết quả mong đợi |
|---|---|
| Tám hành tinh trong danh sách | Đúng thứ tự từ Sao Thủy đến Sao Hải Vương |
| Đường kính/khối lượng | Khớp bảng nguồn trong sai số làm tròn đã công bố |
| Chu kỳ tự quay | Phân biệt chu kỳ sao và ngày Mặt Trời; ghi chiều nghịch hành |
| Chu kỳ quỹ đạo | Không nhầm chu kỳ sao với chu kỳ nhiệt đới |
| Sao Thiên Vương | Trục nghiêng gần 98° so với pháp tuyến mặt phẳng quỹ đạo |
| Sao Hải Vương | Trục nghiêng gần 28° so với pháp tuyến mặt phẳng quỹ đạo |
| Trái Đất, Sao Hỏa, Sao Mộc, Sao Thổ | Trục nghiêng không bị mặc định bằng 0° nếu mô hình tuyên bố thể hiện trục quay |
| Tạm dừng/tiếp tục | Chuyển động dừng và tiếp tục đúng; trạng thái điều khiển đồng bộ |
| Thay đổi tốc độ | Hệ số thời gian có ý nghĩa và được công bố rõ |
| Chọn hành tinh bằng cảm ứng | Không xung đột với thao tác xoay/zoom |
| Mạng yếu/WebGL không khả dụng | Báo trạng thái lỗi, không để giao diện treo hoặc báo thành công giả |
| Điện thoại 320–430 CSS px | Điều khiển, danh sách thiên thể và thông tin không tràn ngang hoặc bị che |

## Kết luận thẩm định

Dữ liệu kích thước và khối lượng phần lớn được làm tròn phù hợp với bảng JPL. Tuy nhiên, mô hình hiện chưa phải mô phỏng thiên văn theo thời gian thực: kích thước và quỹ đạo được nén độc lập; vận tốc góc không suy ra từ chu kỳ; quỹ đạo tròn đồng phẳng và pha ban đầu không gắn với epoch.

Các lỗi/thiếu sót khoa học đáng chú ý gồm chu kỳ tự quay Sao Thổ chưa khớp bảng JPL/NASA được đối chiếu, độ nghiêng trục Sao Hải Vương sai, các hành tinh khác thiếu độ nghiêng trục, và chưa giải thích chuyển động nghịch hành. Texture chỉ là hình tổng hợp.

Có thể tiếp nhận ý tưởng tương tác và cấu trúc thông tin, nhưng không sao chép nguyên trạng cơ chế chuyển động hoặc texture. Chỉ chuyển trạng thái sang `validated` sau khi chuẩn hóa dữ liệu, sửa các tham số trục, công bố rõ chế độ thời gian/tỉ lệ và kiểm thử thực tế.

## Nguồn tham khảo

- NASA Jet Propulsion Laboratory. *Planetary Physical Parameters*. https://ssd.jpl.nasa.gov/planets/phys_par.html
- NASA/NSSDC. *Planetary Fact Sheets*. https://nssdc.gsfc.nasa.gov/planetary/factsheet/
- NASA. *How Tilted Are The Planets?* NASA Heliophysics Education Activation Team. https://assets.science.nasa.gov/content/dam/science/hpd/heat/teacher-lessons/Why%20Do%20We%20Have%20Seasons_%20by%20Tanya%20Anderson_0.pdf
- NASA. *Uranus Facts*. https://science.nasa.gov/uranus/facts/
- NASA. *Neptune Facts*. https://science.nasa.gov/neptune/neptune-facts/


## Pilot SCIAVERSE — 26/11/2026

Đã dựng mô-đun độc lập tại `simulations/astronomy/solar-system/`.

- Dữ liệu kích thước dùng đường kính suy ra từ bán kính trung bình JPL; khối lượng, chu kỳ tự quay sao và chu kỳ quỹ đạo sao dùng bảng JPL. Bán trục lớn và độ nghiêng trục dùng NASA/NSSDC Fact Sheet. Dấu âm của chu kỳ tự quay được giữ để biểu diễn nghịch hành (Sao Kim, Sao Thiên Vương).
- Độ nghiêng trục được đối chiếu với NASA/NSSDC Fact Sheet. Sao Hải Vương dùng khoảng 28,32°; Sao Thiên Vương khoảng 97,77°; Sao Kim khoảng 177,36°.
- Tốc độ quỹ đạo được tính từ chu kỳ quỹ đạo sao: góc trung bình = 2π × thời gian mô phỏng / chu kỳ. Tốc độ thời gian mô phỏng được công bố rõ trong giao diện.
- Quỹ đạo tròn hóa, vị trí ban đầu được phân bố có chủ đích, khoảng cách và kích thước hiển thị không theo tỉ lệ. Mô hình không tuyên bố vị trí hành tinh hiện tại hoặc ephemeris.
- Chu kỳ tự quay được trình bày như dữ liệu, không ghép hoạt ảnh tự quay vào cùng thang thời gian đã nén quỹ đạo.
- Thay texture procedural có hình dạng lục địa/đám mây giả bằng hình cầu màu trung tính; không gán bề mặt giả như ảnh quan sát.

Kiểm tra tĩnh: cú pháp JavaScript đạt; ID HTML không trùng; CSS cân bằng dấu ngoặc, có breakpoint điện thoại và reduced-motion. Chưa kiểm tra WebGL trên trình duyệt hoặc thiết bị thật. Trạng thái vẫn `needs-revision` và `sciaverse-pilot-in-progress` cho đến khi kiểm thử runtime, kiểm tra dữ liệu hiển thị và xác nhận khả năng truy cập hoàn tất.

### Chuẩn hóa chu kỳ quỹ đạo theo JPL

Các chu kỳ trong pilot được lấy từ cột Sidereal Orbital Period của bảng NASA/JPL và đổi từ năm Julian sang ngày bằng 365,25 ngày/năm. Sau khi đối chiếu, đã hiệu chỉnh Jupiter thành khoảng 4.332,820 ngày và Saturn thành khoảng 10.755,699 ngày; các giá trị khác cũng giữ theo cùng một nguồn/quy ước. Không trộn chu kỳ quỹ đạo sao với năm chí tuyến.

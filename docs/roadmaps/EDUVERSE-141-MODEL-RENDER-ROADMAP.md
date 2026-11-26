# Lộ trình tiếp nhận và render 141 học liệu Địa lí THCS từ EDUVERSE

## Phạm vi và nguyên tắc

SCIAVERSE là môi trường khoa học số đa lĩnh vực, không giới hạn đối tượng hoặc nội dung ở cấp THCS. Danh mục EDUVERSE 141 mục là một phạm vi tiếp nhận học liệu cụ thể, không phải toàn bộ phạm vi khoa học của SCIAVERSE.

Danh mục gốc có 141 mục, theo khối: lớp 6 (63), lớp 7 (30), lớp 8 (26), lớp 9 (22). Cơ cấu loại hình: 57 mô phỏng, 48 trưng bày, 7 bảo tàng, 23 bản đồ, 1 dòng thời gian và 5 khám phá địa phương.

SCIAVERSE hiện có 44 hồ sơ trong `data/model-registry.json`: 12 mô hình đã được chủ dự án xác nhận nghiệm thu khoa học ngày 26/11/2026; 9 mô hình đang `in-review` gồm 5 mô hình bản đồ, chuyển động mảng kiến tạo, phong hóa, xâm thực và bồi tụ, sóng địa chấn, địa hình 3D và đường đồng mức; 23 mục còn lại chưa được thẩm định. Có 21 mô hình đang ở mức pilot độc lập (`sciaverse-pilot-in-progress`), gồm 12 mô hình đã nghiệm thu khoa học và 9 mô hình đang thẩm định. Mã đăng ký EDUVERSE hiện có 70 mục trong `SIMS.lsdl`; đây chưa phải bản chép đầy đủ danh mục 141 mục. Không suy diễn 71 mục còn thiếu từ dữ liệu không có trong repo. Giữ nguyên danh mục gốc 141 làm phạm vi quản lý; bổ sung mã định danh và hồ sơ khi đối chiếu được đúng danh sách gốc.

EDUVERSE chỉ là nguồn nghiên cứu. Không tải mã EDUVERSE lúc SCIAVERSE chạy. Mỗi mục được phân tích cơ chế trước, sau đó tái triển khai độc lập trong SCIAVERSE. Không mang nguyên xi giao diện hoặc cơ chế sai từ bản cũ.

## Cấu trúc bắt buộc cho từng mô hình

Mỗi mô hình có thư mục riêng dưới `simulations/<domain>/<model-id>/`, tối thiểu:

- `index.html`: cấu trúc, mục tiêu, điều khiển và nội dung khoa học riêng.
- `main.js`: cơ chế, dữ liệu, thuật toán và trạng thái riêng.
- `styles.css`: giao diện và responsive riêng.

Không gom nhiều mô hình vào một JS/CSS/HTML theo kiểu `geo-catalog.js` hoặc `geo-processes.js`. Không dùng chung file nội dung khoa học, state hoặc UI điều khiển. Thư viện nền như Three.js loader chỉ được dùng chung khi đó là hạ tầng thuần túy, không chứa logic mô hình. Tài nguyên khoa học có thể dùng chung nếu nguồn, giấy phép và hướng dẫn sử dụng được ghi nhận.

## Kế hoạch theo loại hình

### 1. Mô phỏng khoa học — 57 mục

Mỗi mô hình phải có câu hỏi khoa học, hệ thống và ranh giới mô hình, biến đầu vào, biến đầu ra, đơn vị, miền giá trị, điều kiện ban đầu/biên, cơ chế hoặc phương trình, cách cập nhật theo thời gian và trường hợp kiểm tra chuẩn.

- Mô phỏng địa hình, địa chất và kiến tạo: biểu diễn cấu trúc không gian, mặt cắt và chuyển động theo cơ chế; phân biệt hình dạng minh họa với dữ liệu đo.
- Mô phỏng khí quyển, khí hậu và thủy văn: thể hiện cân bằng/trao đổi vật chất và năng lượng; không biến mô hình khái niệm thành dự báo thời tiết, lũ hoặc khí hậu.
- Mô phỏng biển và bờ biển: tách sóng, thủy triều, dòng biển, mực nước trung bình và biến động đường bờ; ghi rõ điều kiện biên và thang thời gian.
- Mô phỏng sinh thái, dân cư và hoạt động con người: xác định đơn vị phân tích, tương tác và giới hạn dữ liệu; không dựng số liệu giả như quan trắc.
- Mô hình thiên văn: dùng dữ liệu thiên thể có nguồn; phân biệt thời gian mô phỏng, tỉ lệ hình học và vị trí thiên văn thực.

### 2. Trưng bày — 48 mục

Tập trung vào cấu trúc, thành phần, phân lớp, hình thái, mẫu vật hoặc quy trình. Người học có thể xoay, phóng to, bật/tắt lớp, chọn mặt cắt và đọc chú giải. Trưng bày không tự gắn hoạt ảnh định lượng nếu không có cơ sở vật lí hoặc dữ liệu tương ứng. Mỗi mẫu phải có tên chuẩn, đặc điểm nhận dạng, nguồn ảnh/dữ liệu và chú thích tỉ lệ khi hình ảnh không theo tỉ lệ.

### 3. Bảo tàng — 7 mục

Tổ chức bộ sưu tập theo tiêu chí khoa học rõ ràng: nhóm phân loại, nguồn gốc, địa điểm/phạm vi phân bố, niên đại nếu có căn cứ, đặc điểm nhận dạng và tài liệu tham khảo. Mỗi hiện vật có hồ sơ riêng; không tự tạo mẫu vật, địa danh, niên đại hoặc nguồn gốc.

### 4. Bản đồ — 23 mục

Mỗi bản đồ phải khai báo hệ quy chiếu/hệ tọa độ khi có dữ liệu không gian, phép chiếu, tỉ lệ hoặc mức zoom, chú giải, đơn vị, thời điểm dữ liệu, nguồn và phạm vi bao phủ. Tách bản đồ nền khỏi lớp dữ liệu chuyên đề. Không dùng hình minh họa thay cho dữ liệu địa lí có nguồn. Với bản đồ tương tác, kiểm tra vị trí, phép đo, truy vấn và cách hiển thị ở nhiều tỉ lệ.

### 5. Dòng thời gian — 1 mục

Xác định chủ đề, mốc mở đầu/kết thúc, quy ước lịch, nguồn cho từng sự kiện và quan hệ trước–sau. Phân biệt ngày chính xác, khoảng thời gian và niên đại ước tính. Không đặt sự kiện lên trục thời gian chỉ dựa vào suy đoán.

### 6. Khám phá địa phương — 5 mục

Thiết kế theo quy trình khảo sát: câu hỏi, khu vực, lớp thông tin, phương pháp quan sát/đo, biểu mẫu ghi nhận, nguồn dữ liệu và cách đối chiếu. Cho phép thay địa bàn bằng dữ liệu địa phương có nguồn; không mặc định một bộ dữ liệu mẫu là dữ liệu của người học. Có quy tắc bảo vệ dữ liệu cá nhân và vị trí nhạy cảm.

## Thứ tự triển khai

### Đợt A — Nền tảng bản đồ và phương hướng
1. Chuyển đổi quả Địa Cầu thành bản đồ.
2. La bàn và phương hướng.
3. Thay đổi tỉ lệ bản đồ.
4. Đo khoảng cách thực tế.
5. Tìm đường đi trên bản đồ.

Mục tiêu: hoàn thiện phép chiếu, phương vị, tỉ lệ, đo đạc và đọc bản đồ trước khi mở rộng sang bản đồ chuyên đề. Mỗi mô hình là một thư mục độc lập.

### Đợt B — Trái Đất, địa hình và địa chất
Chuyển động mảng kiến tạo; phong hóa, xâm thực và bồi tụ; sóng địa chấn; địa hình 3D và đường đồng mức; lát cắt địa hình; địa hình đáy đại dương; cấu trúc đất và khoáng sản.

### Đợt C — Khí quyển, khí hậu và nước
Khí áp và gió; hình thành mây mưa; ngưng tụ; hiệu ứng nhà kính; biểu đồ khí hậu; vòng tuần hoàn nước; băng hà; sông, nước ngầm, biển và thủy triều.

### Đợt D — Sinh vật và hệ sinh thái
Chuỗi/lưới thức ăn; hệ sinh thái rừng; đới thiên nhiên; cảnh quan theo vĩ độ; phân bố sinh vật và quan hệ sinh vật–môi trường.

### Đợt E — Dân cư, kinh tế và tác động con người
Phân bố dân cư; biến đổi cảnh quan; khai thác tài nguyên; đô thị và môi trường; tương tác con người–thiên nhiên. Chỉ dùng dữ liệu có nguồn, phạm vi và thời điểm.

### Đợt F — Hoàn thiện các loại học liệu còn lại
Trưng bày, bảo tàng, bản đồ, dòng thời gian và khám phá địa phương theo đúng số lượng và danh mục gốc; không chuyển một trưng bày thành mô phỏng chỉ để tạo tương tác.

## Cổng kiểm tra cho từng mô hình

1. Đối chiếu mã và nội dung EDUVERSE gốc; lập hồ sơ vấn đề trước khi viết lại.
2. Đối chiếu nguồn khoa học có thẩm quyền; ghi nguồn ngay trong hồ sơ và trang mô hình.
3. Kiểm tra công thức, đơn vị, thứ nguyên, quy ước chiều, điều kiện đầu/biên và trường hợp giới hạn.
4. Kiểm tra trực quan hóa: hướng, tỉ lệ, hình dạng, chuyển động và màu không gây hiểu sai.
5. Kiểm tra thao tác, đặt lại, tạm dừng, lỗi thư viện, giải phóng tài nguyên và mất WebGL context.
6. Kiểm tra điện thoại trước tại 320, 360, 390 và 430 CSS px; sau đó tablet và desktop; kiểm tra bàn phím, focus, reduced motion và tràn ngang.
7. Chỉ đặt `scientificStatus: validated` sau khi hoàn tất thẩm định khoa học; chỉ đặt `implementationStatus: verified-in-build` sau kiểm thử runtime trên bản SCIAVERSE. Hai trạng thái không thay thế nhau.

## Trạng thái triển khai

SCIAVERSE được định hướng là không gian khoa học thực tế được tái hiện bằng mô hình, dữ liệu và thuật toán có cơ sở. Mọi dữ liệu mẫu, giả định, phép xấp xỉ và giới hạn phải được ghi rõ; không trình bày dữ liệu minh họa như quan trắc thực.

Đợt A đã có năm mô-đun SCIAVERSE độc lập ở mức pilot:

1. **Chuyển đổi quả Địa Cầu thành bản đồ** — Plate Carrée, Mercator, Lambert hình trụ đồng diện tích và phương vị cách đều tâm Bắc Cực.
2. **La bàn và phương hướng** — Bắc địa lí, Bắc từ, độ từ thiên và chuyển đổi phương vị từ sang phương vị thực.
3. **Thay đổi tỉ lệ bản đồ** — tỉ lệ số, đổi cm–m–km và so sánh tỉ lệ lớn/nhỏ.
4. **Đo khoảng cách thực tế** — đo tuyến nhiều đoạn, tổng chiều dài và khoảng cách thẳng đầu–cuối.

Cả năm mô-đun có `index.html`, `main.js`, `styles.css` riêng; hồ sơ khoa học đang ở `in-review`, triển khai ở `sciaverse-pilot-in-progress`. Chưa đưa vào danh mục công bố vì chưa hoàn tất kiểm thử runtime và nghiệm thu khoa học.

Mục thứ năm **Tìm đường đi trên bản đồ** đã có pilot độc lập. Đợt A hoàn tất phần dựng ban đầu ở mức 5/5 mô-đun; cả năm vẫn cần hoàn thành kiểm thử runtime và thẩm định khoa học trước khi công bố. SCIAVERSE là môi trường khoa học đa lĩnh vực, không giới hạn ở THCS; danh mục EDUVERSE chỉ là một nguồn nghiên cứu/đối chiếu trong giai đoạn tiếp nhận.

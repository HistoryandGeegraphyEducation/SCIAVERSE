# Thẩm định nguồn gốc — Sạt lở đất

- Mã nguồn tham chiếu: `EDUVERSE/simulations/natural-hazards/sat-lo-dat/main.js`
- Trạng thái: `needs-revision`
- Phạm vi: độ bão hòa đất, thấm nước, áp lực nước lỗ rỗng, sức kháng cắt, mặt trượt, chuyển động khối đất và phân loại sạt lở.
- Kết luận hiện tại: mô tả định tính về vai trò của nước, trọng lực và sức chống trượt là phù hợp. Tuy nhiên, độ bão hòa là biến duy nhất; không có tham số cơ học đất hoặc hệ số an toàn. Khối đất được dịch chuyển trực tiếp theo slider và nút giai đoạn, không phải kết quả tính ổn định sườn dốc. Một số tổ hợp giai đoạn–độ bão hòa mâu thuẫn. Chưa đủ điều kiện tiếp nhận.

## Căn cứ khoa học

1. U.S. Geological Survey (USGS), *What is a landslide and what causes one?*: https://www.usgs.gov/faqs/what-a-landslide-and-what-causes-one?page=1
   - Sạt lở là sự dịch chuyển của khối đá, đất hoặc vật liệu vụn xuống dốc dưới tác động trọng lực.
   - Chuyển động xảy ra khi lực gây dịch chuyển xuống dốc vượt sức kháng của vật liệu.
   - Nguyên nhân thường kết hợp nhiều yếu tố: mưa, tuyết tan, thay đổi mực nước, xói chân dốc, thay đổi nước ngầm, động đất và hoạt động con người.

2. USGS, *Overview of Rainfall-Induced Landslides*: https://www.usgs.gov/programs/landslide-hazards/science/overview-rainfall-induced-landslides
   - Mưa thấm có thể làm tăng áp lực nước lỗ rỗng và thay đổi ứng suất hữu hiệu, qua đó làm giảm sức kháng cắt của đất.
   - Phản ứng phụ thuộc cường độ/thời lượng mưa, tính thấm, cấu trúc địa chất, độ dốc và điều kiện nước ban đầu.

3. USGS, *Landslide Types and Processes*: https://pubs.usgs.gov/fs/2004/3072/fs-2004-3072.html
   - Sạt lở gồm nhiều kiểu chuyển động: rơi, đổ/lật, trượt, trải ngang và chảy.
   - Trượt quay có mặt phá hoại cong và khối trượt quay; trượt tịnh tiến di chuyển dọc mặt trượt gần phẳng với ít xoay.
   - Dòng chảy đất/đá có cơ chế khác với khối trượt trên mặt trượt xác định.

4. USACE, *EM 1110-2-1902 — Slope Stability*: https://www.publications.usace.army.mil/Portals/76/Publications/EngineerManuals/EM_1110-2-1902.pdf
   - Hệ số an toàn là tỷ số giữa sức kháng cắt sẵn có và ứng suất cắt gây trượt.
   - Theo Mohr–Coulomb trong ứng suất hữu hiệu, sức kháng cắt phụ thuộc lực dính kết hiệu dụng (c'), ứng suất pháp tổng \(\sigma\), áp lực nước lỗ rỗng \(u\) và góc ma sát trong hiệu dụng \(\phi'\):
     [
     \tau_f=c'+(\sigma-u)\tan\phi'
     ]
   - Nước lỗ rỗng làm giảm ứng suất pháp hữu hiệu \(\sigma'=\sigma-u\), từ đó có thể làm giảm sức kháng.

5. California Geological Survey, *Types of Landslides*: https://conservation.ca.gov/cgs/landslides/types
   - Phân loại sạt lở cần xét cả loại vật liệu và kiểu chuyển động.
   - Trượt tịnh tiến, trượt quay, rơi, đổ/lật, trải ngang và dòng chảy không thể thay thế cho nhau.

## Kết quả đọc mã nguồn EDUVERSE

### Tham số và trạng thái đất

- Đầu vào duy nhất là “Độ bão hòa đất”, miền 10–100%, bước 5%, mặc định 65%.
- Mã không định nghĩa đây là độ bão hòa thể tích (S_r), độ ẩm khối lượng hay độ ẩm thể tích. Các đại lượng này không đồng nghĩa và không thể dùng thay thế mà không có quy ước.
- Không có lượng mưa, thời lượng mưa, tốc độ thấm, hệ số thấm, mực nước ngầm hoặc áp lực nước lỗ rỗng.
- Không có loại đất/đá, dung trọng, lực dính kết, góc ma sát trong, cấu trúc phân lớp hoặc độ sâu mặt trượt.
- Lời giải thích nói nước thấm có thể làm tăng áp lực nước lỗ rỗng và trọng lượng đất; đây là mô tả định tính hợp lý, nhưng không có biến nào trong mã tính các đại lượng này.

### Địa hình và mặt trượt

- Địa hình được tạo từ hàm (h(x,z)=0,35+\max(0,0,34x)+0,18\sin(0,7z)).
- Đây là sườn dốc tổng hợp với độ dốc cố định; không có slider góc dốc hoặc thang độ cao.
- Bốn đường địa tầng là các đường cong trang trí, không có vật liệu, ranh giới địa chất hoặc thông số cơ học.
- Đường “mặt trượt” được dựng bằng một đường cong cố định dưới bề mặt. Mã không tính vị trí hoặc hình dạng mặt phá hoại từ điều kiện ứng suất.
- Mô hình không thể hiện nước thấm qua các lớp, vùng bão hòa, mặt nước ngầm hoặc áp lực nước lỗ rỗng dọc mặt trượt.

### Chuyển động khối đất

- Khối đất được dựng bằng một hộp/slab và một số cây gắn vào nhóm `objects.mass`.
- Khi slider thay đổi, vị trí X của khối được đặt theo `-0.5 - n × 3`; góc quay Z theo `-0.12 - n × 0.22`.
- Ở giai đoạn 4, vị trí Y được hạ thêm theo `-0.4 - n × 0.8`; animation tiếp tục làm khối dao động nhẹ theo thời gian.
- Đây là ánh xạ trực tiếp độ bão hòa sang chuyển động hình học. Không có phép tính lực gây trượt, sức kháng cắt, cân bằng mômen hoặc hệ số an toàn.
- Khối đất không trượt dọc theo mặt trượt đã dựng; không có biến dạng, phân rã, tích tụ vật liệu ở chân dốc hoặc thay đổi địa hình sau sạt lở.
- Các vết nứt được bật theo ngưỡng số học của n và giai đoạn, không phải kết quả ứng suất kéo hoặc biến dạng.
- Cảnh thể hiện một khối tương đối liền mạch trượt xuống dốc. Nó không đại diện cho rơi đá, đổ/lật, trải ngang, dòng đất, dòng bùn đá hoặc mọi loại sạt lở.

### Mâu thuẫn giữa slider và giai đoạn

- Slider điều khiển vị trí và góc nghiêng khối đất ở mọi giai đoạn, kể cả “Sườn dốc ổn định”.
- Với mức bão hòa 100%, người dùng vẫn có thể chọn “Sườn dốc ổn định”; khối đất đã dịch chuyển mạnh và các vết nứt có thể xuất hiện ở các giai đoạn sau.
- Với mức bão hòa 10%, người dùng vẫn có thể chọn “Khối đất trượt xuống”; giai đoạn 4 vẫn hạ khối đất dù không có ngưỡng mất ổn định.
- Vì giai đoạn và slider được điều khiển độc lập, mô hình cho phép các tổ hợp trạng thái không có tính nhất quán cơ học.
- Các giai đoạn chủ yếu là thẻ giải thích; không phải một chuỗi thấm–tăng áp lực lỗ rỗng–giảm sức kháng–đạt điều kiện phá hoại được tính toán.

## Lỗi kỹ thuật và khả năng tiếp cận

1. Vòng lặp `animate()` vẫn gọi `requestAnimationFrame` và render khi `playing=false`; nút tạm dừng không dừng vòng lặp dựng hình.
2. Không có xử lý `prefers-reduced-motion`; mô hình tự chạy ngay sau khi khởi tạo.
3. Không tạm dừng khi tab ở nền; có thể tiêu tốn tài nguyên khi người dùng chuyển tab.
4. Khi hủy mô hình, hàm `destroy()` dừng RAF, tháo ResizeObserver/listener resize và dispose tài nguyên WebGL, nhưng các handler trên nút, slider và stage buttons không được gỡ riêng; root cũng không được làm rỗng.
5. Sau khi `destroy()`, các phần tử điều khiển còn trong DOM có thể tiếp tục gọi `updateModel()` và thay đổi object đã được dispose nếu root vẫn được giữ lại.
6. Nếu lỗi khởi tạo xảy ra sau khi scene/geometry/material được tạo, nhánh lỗi chỉ dispose renderer; cần bảo đảm giải phóng tài nguyên khởi tạo dở dang.
7. Biến `quality` được khai báo nhưng không được sử dụng.
8. Các nhãn 3D và bảng điều khiển cần được kiểm tra ở màn hình nhỏ; chưa có kiểm thử thực tế trên điện thoại.

## Điều chỉnh bắt buộc trước khi tiếp nhận

1. Định nghĩa rõ biến 10–100% là độ bão hòa thể tích (S_r) hay một chỉ số minh họa. Không dùng nhãn “độ bão hòa” nếu giá trị chỉ là mức điều khiển hoạt ảnh.
2. Nếu muốn mô hình định lượng, bổ sung góc dốc, dung trọng, lực dính kết, góc ma sát trong, độ thấm, điều kiện nước ban đầu và áp lực nước lỗ rỗng.
3. Dùng một mô hình ổn định sườn dốc phù hợp với loại mặt trượt được chọn; tính sức kháng cắt và hệ số an toàn từ các tham số có đơn vị. Không đặt ngưỡng trượt tùy ý theo phần trăm bão hòa.
4. Nếu chỉ làm mô hình khái niệm, thể hiện rõ chuỗi “mưa/thấm → thay đổi độ ẩm và áp lực nước lỗ rỗng → thay đổi ứng suất hữu hiệu/sức kháng → mất ổn định” mà không hiển thị hệ số an toàn giả.
5. Khai báo góc dốc và tỉ lệ địa hình; không dùng hình học tổng hợp như một sườn dốc có thông số thực.
6. Chọn và ghi rõ một kiểu sạt lở để minh họa. Nếu giữ khối slab, có thể xây dựng thành sơ đồ trượt khối/tịnh tiến hoặc trượt quay có mặt trượt tương ứng; không dùng một khối hộp cho mọi kiểu.
7. Đồng bộ giai đoạn với trạng thái vật lí. “Ổn định” không được cho phép khối trượt mạnh; “trượt xuống” phải có điều kiện mất ổn định rõ ràng hoặc được ghi là kịch bản giả định.
8. Nếu giữ chuyển động trực tiếp theo slider, đổi nhãn thành “mức biến dạng minh họa”, không gọi đó là kết quả từ độ bão hòa.
9. Bổ sung vùng tích tụ ở chân dốc hoặc thay đổi địa hình nếu mô hình muốn thể hiện khối vật liệu rời khỏi vị trí ban đầu.
10. Hỗ trợ reduced motion, dừng render khi tạm dừng/tab nền, gỡ listener và dọn DOM khi hủy module.
11. Kiểm thử ở 320, 360, 390 và 430 CSS px; kiểm tra tương tác camera, stage, slider và reset.

## Ma trận kiểm thử bắt buộc

| Ca kiểm thử | Kết quả mong đợi |
|---|---|
| Độ bão hòa 10% | Không tự động trượt nếu chưa đạt điều kiện mất ổn định |
| Độ bão hòa 100% | Không tự khẳng định trượt nếu thiếu thông số cơ học |
| Thay đổi góc dốc | Lực gây trượt và hệ số an toàn thay đổi theo mô hình nếu có tham số này |
| Thay đổi áp lực nước lỗ rỗng | Ứng suất hữu hiệu và sức kháng cắt thay đổi đúng chiều |
| Thay đổi lực dính kết/góc ma sát | Sức kháng trượt thay đổi theo quan hệ công bố |
| Giai đoạn ổn định | Khối không dịch chuyển ngoài mức biến dạng được giải thích |
| Giai đoạn trượt | Khối di chuyển phù hợp mặt trượt và kiểu chuyển động đã chọn |
| Mặt trượt | Hình dạng và hướng trượt nhất quán |
| Reset | Khối, vết nứt và trạng thái trở về đúng trạng thái ban đầu |
| Reduced motion/tạm dừng | Không còn chuyển động hoặc render không cần thiết |
| Hủy và mở lại module | Không còn handler, RAF hoặc tài nguyên từ phiên trước |
| Điện thoại 320–430 CSS px | Không tràn ngang; slider, nhãn và điều khiển thao tác được |

## Kết luận thẩm định

Phần kiến thức định tính về nước, áp lực nước lỗ rỗng, trọng lượng đất và sức chống trượt phù hợp. Mô hình hiện chưa tính các cơ chế đó; độ bão hòa chỉ điều khiển trực tiếp vị trí, góc nghiêng và vết nứt của một khối đất dạng slab.

Có thể giữ ý tưởng mặt cắt sườn dốc và khối đất chuyển động để dạy trực quan. Nếu muốn giải thích cơ chế mất ổn định, cần bổ sung tham số cơ học đất và quan hệ hệ số an toàn; nếu không, phải ghi rõ đây là hoạt ảnh kịch bản, không phải kết quả tính toán.

Chỉ chuyển trạng thái sang `validated` sau khi xử lý các điểm chặn và kiểm thử thực tế.

## Nguồn tham khảo

- U.S. Geological Survey. *What is a landslide and what causes one?* https://www.usgs.gov/faqs/what-a-landslide-and-what-causes-one?page=1
- U.S. Geological Survey. *Overview of Rainfall-Induced Landslides*. https://www.usgs.gov/programs/landslide-hazards/science/overview-rainfall-induced-landslides
- U.S. Geological Survey. *Landslide Types and Processes*. https://pubs.usgs.gov/fs/2004/3072/fs-2004-3072.html
- U.S. Army Corps of Engineers. *EM 1110-2-1902 — Slope Stability*. https://www.publications.usace.army.mil/Portals/76/Publications/EngineerManuals/EM_1110-2-1902.pdf
- California Geological Survey. *Types of Landslides*. https://conservation.ca.gov/cgs/landslides/types


## Pilot SCIAVERSE — 26/11/2026

Đã dựng mô-đun độc lập tại `simulations/geotechnical/landslide/`.

- Thay slider độ bão hòa đơn lẻ bằng mô hình mái dốc vô hạn có lực dính hữu hiệu (c'), góc ma sát (phi'), trọng lượng thể tích (gamma), chiều dày lớp đất (z), góc dốc (eta) và áp lực nước lỗ rỗng (u).
- Tính hệ số an toàn theo (FS=[c'+(\gamma z\cos^2\beta-u)\tan\phi']/[\gamma z\sin\beta\cos\beta]). (z) đo vuông góc mặt dốc; đơn vị ứng suất trong tử số được đưa về kPa.
- Phân loại FS<1 là mất ổn định trong giả định; FS>1 là ổn định theo mô hình. Không diễn giải FS thành xác suất sạt lở.
- Chặn trường hợp ứng suất pháp hữu hiệu không dương; ghi rõ mô hình không đại diện trượt quay, đá rơi hoặc dòng bùn đá.

Kiểm tra cú pháp và công thức tĩnh đã đạt bước đầu. Cần đối chiếu thêm công thức với trường hợp bão hòa/không bão hòa và thử giá trị biên trong runtime trước nghiệm thu.

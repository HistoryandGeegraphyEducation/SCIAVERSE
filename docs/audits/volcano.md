# Thẩm định nguồn gốc — Núi lửa

- Mã nguồn tham chiếu: `EDUVERSE/js/sims/volcano.js`
- Trạng thái: `needs-revision`
- Phạm vi: cấu trúc núi lửa, kho chứa magma, ống phun, áp suất, nhiệt độ, kiểu phun trào, dung nham, tro/tephra, khí và giai đoạn nguội.
- Kết luận hiện tại: mô hình thể hiện được một số bộ phận và thuật ngữ cơ bản của núi lửa dạng nón; phân biệt magma và dung nham đúng. Cơ chế phun trào, nhiệt độ, áp suất, năng lượng và tốc độ dung nham hiện là các biến hoạt ảnh nội bộ, không phải mô hình vật lí. Mô hình chỉ là mặt cắt 2D Canvas, không phải mô hình 3D. Chưa đủ điều kiện tiếp nhận.

## Căn cứ khoa học

1. U.S. Geological Survey (USGS), *How Do Volcanoes Erupt?*: https://www.usgs.gov/faqs/how-do-volcanoes-erupt
   - Magma là đá nóng chảy dưới bề mặt; khi thoát ra bề mặt được gọi là lava (dung nham).
   - Độ nổ phụ thuộc vào đặc tính magma. Magma loãng cho phép khí thoát dễ hơn và thường tạo dòng dung nham; magma nhớt giữ khí, làm áp suất tăng và có thể phun nổ.
   - Tephra là vật liệu magma bị phân mảnh và phóng ra; kích thước trải từ tro mịn đến các khối lớn.

2. USGS, *About Volcanoes*: https://www.usgs.gov/programs/vhp/about-volcanoes
   - Magma có thể gồm đá nóng chảy, tinh thể và khí hòa tan.
   - Magma có thể đi lên do lực nổi và áp suất khí; các kiểu phun trào bao gồm dòng dung nham tràn ra, phun vật liệu vụn và khí.
   - Tro là các hạt tephra rất nhỏ; các hạt lớn hơn có thể rơi gần miệng phun hoặc di chuyển xuống sườn.

3. USGS, *Volcanoes! — Lesson 1*: https://pubs.usgs.gov/gip/70043848/lesson-1.pdf
   - Núi lửa khiên thường gắn với dung nham bazan loãng và phun trào tràn.
   - Núi lửa tầng (stratovolcano) hình thành từ các lớp vật liệu phun nổ và dòng dung nham, thường có sườn dốc và dạng nón.
   - Núi lửa nón tro có cơ chế và vật liệu khác với núi lửa tầng.

4. USGS Yellowstone Volcano Observatory, *Yellowstone's Mushy Past*: https://www.usgs.gov/observatories/yvo/news/yellowstones-mushy-past
   - Không nên mặc định mọi hệ thống magma đều có một khoang rỗng lớn chứa đầy magma lỏng.
   - Ở nhiều hệ thống, vùng lưu trữ magma có thể là mạng lưới các túi nóng chảy liên kết hoặc tách rời trong một khối tinh thể/mush.

5. USGS, *Eruption Styles*: https://volcano.wr.usgs.gov/volcanic_ash/eruption_styles.html
   - Kiểu phun trào phụ thuộc thành phần hóa học, hàm lượng tinh thể, nhiệt độ, lượng và thành phần khí hòa tan, tương tác với nước, thể tích và tốc độ magma thoát ra.
   - Phun trào tràn có thể tạo dòng dung nham với ít tro; phun trào nổ có thể phát tán lượng lớn tro và vật liệu pyroclastic.

## Kết quả đọc mã nguồn EDUVERSE

### Cấu trúc và phạm vi hình học

- Mã dựng mặt cắt 2D bằng Canvas kích thước logic 360×300; không sử dụng WebGL/Three.js. Vì vậy, cần gọi đúng là mô hình mặt cắt 2D, không phải mô hình núi lửa 3D.
- Hình thái nón, các lớp vật liệu, miệng núi lửa, buồng magma và ống phun trung tâm gần với sơ đồ khái niệm của một núi lửa dạng nón/stratovolcano.
- Mô hình có thêm miệng phun phụ và ống dẫn nhánh. Đây là cấu trúc có thể gặp, nhưng không phải đặc điểm bắt buộc của mọi núi lửa.
- Các lớp địa chất được dựng bằng các đường cong và dải màu tổng hợp; không có tên địa tầng, thành phần, độ sâu hoặc tỉ lệ địa chất.
- Buồng magma được vẽ như một khoang lớn đơn lẻ. Đây là cách giản lược dễ hiểu, nhưng không nên diễn đạt như cấu trúc chung của mọi hệ thống magma. Nhiều hệ thống có vùng mush và các túi nóng chảy phân bố phức tạp.
- Các đường ống phun được dựng bằng các đường bao cố định; chúng không thay đổi theo ứng suất, độ nhớt, kết tinh hoặc quá trình mở rộng/nứt vỡ của đá.

### Giai đoạn hoạt động

- Bốn giai đoạn được mô tả là bình thường, bắt đầu hoạt động, phun trào và sau phun trào. Đây là trình tự bài học khái quát, không phải chu kỳ bắt buộc cho mọi vụ phun trào.
- Giai đoạn 0 mô tả magma tích tụ; giai đoạn 1 làm tăng biến `P`; khi `P` đạt ngưỡng `ERUPT_P=85`, mô hình chuyển sang phun trào.
- Nút “Tăng áp suất” tăng `P` theo bước 12; nút “Bắt đầu” kích hoạt chế độ tự tăng áp; nút “Phun trào” đặt trực tiếp `P=100` và bắt đầu giai đoạn phun.
- Ngưỡng 85%, tốc độ tăng P, thời gian phun và các ngưỡng chuyển giai đoạn đều là logic hoạt ảnh tự đặt. Không có đơn vị áp suất hoặc mô hình động lực học magma.
- Giai đoạn sau phun trào nói núi lửa “đã hết năng lượng”. Cách diễn đạt này dễ gây hiểu sai như núi lửa là một bình chứa năng lượng cạn kiệt. Sự kết thúc phun trào liên quan đến nguồn cung magma, khí, áp suất, trạng thái conduit và các điều kiện vật lí khác; không thể quy về một đồng hồ năng lượng đơn giản.

### Nhiệt độ, áp suất và năng lượng

- Nhiệt độ hiển thị được tính bằng `700 + P × 5` °C. Với P từ 8 đến 100%, giá trị hiển thị khoảng 740–1.200°C.
- Khoảng số này có thể nằm trong miền nhiệt độ của một số loại magma, nhưng quan hệ tuyến tính giữa phần trăm P và nhiệt độ không có căn cứ vật lí. Nhiệt độ magma phụ thuộc thành phần, áp suất, hàm lượng tinh thể và điều kiện địa hóa; không thể suy ra từ gauge áp suất nội bộ.
- Áp suất P chỉ là phần trăm 0–100, không phải Pa, MPa hoặc một áp suất dư đã hiệu chuẩn.
- Năng lượng E cũng là biến nội bộ từ 0 đến 1. E được đặt bằng 1 khi bắt đầu phun và giảm theo thời gian `eruptDur`; không phải năng lượng nhiệt, cơ học hoặc mômen phun trào đo được.
- Mức “Nhẹ/Trung bình/Mạnh” thay đổi hệ số KL 0,45/0,75/1, ảnh hưởng đến số lượng hạt, tốc độ và thời lượng hiệu ứng. Đây không phải phân loại cường độ phun trào theo VEI hoặc một đại lượng địa chất.

### Kiểu phun trào và vật liệu

- Trong cùng một kịch bản, mô hình có dòng dung nham, tro, khí, hơi nước, mảnh vụn và sét núi lửa.
- USGS phân biệt phun trào tràn (effusive) và phun trào nổ (explosive). Phun trào tràn có thể tạo dòng dung nham với ít tro; phun trào nổ có thể tạo cột tephra, tro và dòng mật độ pyroclastic.
- Mô hình hiện không có lựa chọn kiểu magma hoặc kiểu phun. Nó kết hợp dòng dung nham với tro và hiệu ứng sét trong mọi lần phun, vì vậy không thể hiện được sự khác biệt giữa các kiểu phun trào.
- Sét núi lửa có thể xuất hiện trong cột tro do quá trình tích điện và va chạm hạt, nhưng không phải mọi đợt phun đều tạo sét. Mã tạo sét ngẫu nhiên khi số hạt tro vượt ngưỡng; đây là hiệu ứng minh họa.
- Mô hình có hạt tro và khí bay lên, nhưng không mô phỏng gió, phân loại kích thước tephra, lắng đọng, cột phun theo độ cao, dòng mật độ pyroclastic hoặc lahar.
- Hơi nước được phát ra trong giai đoạn chuẩn bị và khí được phát ra khi phun; mã không có mô hình thành phần khí hoặc tương tác magma–nước. Không được dùng để minh họa phun trào thủy magma (phreatomagmatic) hoặc lahar.

### Dung nham và nguội đi

- Các dòng dung nham được tạo bằng các nhánh đường đi ngẫu nhiên dọc theo đường bao bề mặt núi lửa.
- Tốc độ dòng được điều khiển bằng KL, thời gian, giai đoạn và hệ số giảm tốc; không phụ thuộc độ nhớt, độ dốc thực, nhiệt độ, hàm lượng tinh thể, lưu lượng hoặc chiều dày dòng.
- Đường đi của dung nham không được tính từ trường trọng lực và địa hình 3D. Dòng chảy có thể tỏa sang hai phía theo tham số ngẫu nhiên, không phải kết quả mô phỏng địa hình.
- Màu dung nham chuyển từ đỏ sẫm sang xám/đen theo biến `cool`; đây là hiệu ứng màu. Mã không giải bài toán truyền nhiệt, kết tinh, độ nhớt tăng theo nhiệt độ hoặc chiều dày vỏ nguội.
- Nội dung “dung nham nguội và đông cứng thành đá mới” là đúng về nguyên tắc. Tuy nhiên, thời gian và tốc độ nguội trong mô hình không có tỉ lệ thực.

### Thuật ngữ

- Phân biệt magma dưới bề mặt với dung nham sau khi phun ra là đúng.
- “Tro bụi” là một cách gọi phổ thông, nhưng thuật ngữ khoa học rộng hơn là tephra cho vật liệu phun dạng hạt; tro núi lửa là phần hạt mịn dưới 2 mm. Nếu mô hình có các mảnh vụn lớn, cần phân biệt tro, lapilli và bom/khối núi lửa.
- “Buồng magma” có thể dùng ở cấp phổ thông nếu ghi rõ đây là vùng chứa/lưu trữ magma được giản lược, không phải một khoang rỗng lớn luôn đầy magma lỏng.
- “Năng lượng cạn dần” nên đổi thành “mức phun trong kịch bản minh họa giảm dần” hoặc giải thích đây là biến hoạt ảnh, không phải năng lượng vật lí của núi lửa.

## Lỗi kỹ thuật và khả năng tiếp cận

1. Mô hình phụ thuộc hàm toàn cục `simLabel` từ `js/sims/common.js`. Nếu chuyển mô hình sang SCIAVERSE như một module độc lập, cần khai báo/đóng gói phụ thuộc này hoặc thay bằng helper nội bộ có namespace; không được giả định helper tự tồn tại.
2. Vòng lặp animation tiếp tục chạy ngay cả ở trạng thái bình thường, dù người dùng chưa kích hoạt tăng áp hoặc phun trào. Nó vẫn cập nhật buồng magma, bọt khí và vẽ lại Canvas.
3. Không có xử lý `prefers-reduced-motion`; hiệu ứng rung màn hình, sét, hạt và dung nham chuyển động vẫn hoạt động. Cần có chế độ xem tĩnh/giảm chuyển động.
4. Mô hình gọi `navigator.vibrate` khi phun trào; đây là phản hồi tùy chọn, không được coi là điều kiện để chức năng hoạt động.
5. Hàm `destroy()` dừng RAF và tháo ResizeObserver/listener resize, nhưng không gỡ riêng listener pointerup trên canvas và các handler nút. Cần bảo đảm root được tháo hoàn toàn hoặc dọn các listener khi module đóng.
6. Quiz dùng `setTimeout`; callback có kiểm tra `dead`, nhưng cần kiểm tra vòng đời khi người dùng đóng mô hình ngay sau khi chọn đáp án.
7. Kích thước canvas logic cố định 360×300 rồi phóng theo chiều rộng. Cần kiểm tra chữ, nhãn, gauge và quiz ở chiều rộng 320 CSS px và khi phóng to hệ thống.
8. Nội dung các gauge và mô tả không có nguồn/đơn vị khoa học cho P, E và nhiệt độ. Không nên để chúng mang hình thức số đo nếu vẫn là biến hoạt ảnh.

## Điều chỉnh bắt buộc trước khi tiếp nhận

1. Ghi rõ đây là mô hình mặt cắt 2D của một núi lửa dạng nón/stratovolcano giản lược; không gọi là mô hình 3D và không khái quát cấu trúc này cho mọi kiểu núi lửa.
2. Giữ các bộ phận chính nhưng đổi “buồng magma” thành vùng chứa/lưu trữ magma minh họa; có chú thích rằng hệ thống lưu trữ thực có thể gồm nhiều vùng nóng chảy và tinh thể liên kết.
3. Bỏ đơn vị °C khỏi gauge nếu vẫn dùng (700+P×5); hoặc thay bằng mô hình nhiệt độ có thành phần magma, áp suất và nguồn dữ liệu rõ ràng. Không gắn nhiệt độ với phần trăm áp suất theo đường thẳng.
4. Ghi rõ P và E là chỉ số hoạt ảnh, không phải áp suất hoặc năng lượng vật lí. Ngưỡng 85% và thời lượng phun không được mô tả như ngưỡng địa chất.
5. Thay lựa chọn “Nhẹ/Trung bình/Mạnh” bằng các kiểu phun có cơ sở (tràn/nổ) nếu muốn dạy cơ chế; cần có thành phần magma, độ nhớt, khí hòa tan, tinh thể, nhiệt độ và tương tác nước phù hợp.
6. Không tạo tro, cột phun và sét cho mọi kiểu phun. Phân biệt dòng dung nham, tephra/tro, khí, dòng mật độ pyroclastic và lahar; chỉ thể hiện những vật liệu phù hợp với kiểu phun đã chọn.
7. Nếu giữ dòng dung nham, ghi rõ đường đi và tốc độ là minh họa; muốn định lượng cần mô hình độ nhớt, độ dốc, địa hình, lưu lượng và quá trình nguội.
8. Đổi mô tả “hết năng lượng” thành trạng thái phun trào suy giảm/kết thúc trong kịch bản, không mô tả núi lửa như pin cạn.
9. Gắn nhãn cho mọi chỉ số minh họa và không đưa ra dự báo độ cao cột tro, vận tốc dòng, nhiệt độ hoặc mức nguy hiểm thực.
10. Đóng gói hoặc thay thế helper `simLabel`; không phụ thuộc vào script dùng chung của EDUVERSE khi tích hợp vào SCIAVERSE.
11. Hỗ trợ reduced motion, dọn listener/timer và kiểm thử mở/đóng module nhiều lần.
12. Kiểm thử ở 320, 360, 390 và 430 CSS px; xác nhận nhãn, gauge, điều khiển và quiz không bị cắt.

## Ma trận kiểm thử bắt buộc

| Ca kiểm thử | Kết quả mong đợi |
|---|---|
| Giai đoạn bình thường | Không hiển thị phun trào khi chưa kích hoạt |
| Tăng áp suất thủ công | Chỉ thay đổi chỉ số hoạt ảnh; không gọi là áp suất vật lí |
| Bắt đầu tự động | Chuyển giai đoạn nhất quán và có thể tạm dừng |
| Phun trào tràn | Dòng dung nham là thành phần chính; không mặc định có cột tro/sét lớn |
| Phun trào nổ | Có tephra/tro và khí phù hợp; chú thích giới hạn |
| Nhiệt độ/áp suất/năng lượng | Có nhãn minh họa hoặc được tính từ mô hình có nguồn; không giả dạng số đo |
| Dòng dung nham | Không tuyên bố tốc độ hoặc đường đi là dự báo thực |
| Sau phun trào | Dòng chậm lại và nguội theo kịch bản; không dùng diễn giải “hết năng lượng” |
| Chọn bộ phận | Tooltip/thông tin bộ phận đúng, thao tác không bị nhầm khi chạm |
| Quiz | Chọn đáp án, phản hồi, làm lại và đóng mô hình an toàn |
| Reduced motion | Có chế độ tĩnh hoặc giảm chuyển động |
| Điện thoại 320–430 CSS px | Không tràn ngang, chữ và điều khiển đọc được |
| Mở/đóng nhiều lần | Không còn RAF, observer hoặc listener chạy sau khi hủy |

## Kết luận thẩm định

Mô hình có thể dùng làm sơ đồ nhận biết các bộ phận cơ bản của một núi lửa dạng nón. Các thuật ngữ magma, dung nham, buồng chứa, ống phun, miệng phụ và tro/khí có thể giữ sau khi chỉnh định nghĩa và phạm vi.

Không thể xem các gauge nhiệt độ/áp suất/năng lượng hoặc mức phun hiện tại là đại lượng vật lí. Mô hình chưa phân biệt phun trào tràn với phun trào nổ, chưa liên hệ kiểu phun với thành phần magma, độ nhớt và khí hòa tan; dòng dung nham và quá trình nguội cũng chỉ là hoạt ảnh.

Có thể tiếp nhận cấu trúc bài học và một phần đồ họa 2D, nhưng nên xây dựng lại cơ chế phun theo kiểu phun được chọn. Chỉ chuyển trạng thái sang `validated` sau khi xử lý các điểm chặn, bổ sung nguồn và kiểm thử.

## Nguồn tham khảo

- U.S. Geological Survey. *How Do Volcanoes Erupt?* https://www.usgs.gov/faqs/how-do-volcanoes-erupt
- U.S. Geological Survey. *About Volcanoes*. https://www.usgs.gov/programs/vhp/about-volcanoes
- U.S. Geological Survey. *Volcanoes! — Lesson 1*. https://pubs.usgs.gov/gip/70043848/lesson-1.pdf
- U.S. Geological Survey, Yellowstone Volcano Observatory. *Yellowstone's Mushy Past*. https://www.usgs.gov/observatories/yvo/news/yellowstones-mushy-past
- U.S. Geological Survey. *Eruption Styles*. https://volcano.wr.usgs.gov/volcanic_ash/eruption_styles.html


## Pilot SCIAVERSE — 26/11/2026

Đã dựng mô-đun độc lập tại `simulations/geophysics/volcano/`.

- Bỏ các gauge áp suất, nhiệt độ và năng lượng được tạo từ công thức hoạt ảnh không có cơ sở.
- Thay bằng lựa chọn định tính ba nhóm magma: bazan (45–53% SiO₂), andesit (53–63%) và rhyolit (khoảng 69% trở lên); ghi rõ độ nhớt tương đối.
- Bổ sung mức khí hòa tan thấp/trung bình/cao dưới dạng lựa chọn định tính, không giả vờ đây là số đo.
- Chỉ diễn giải xu hướng khi tổ hợp biến có căn cứ; các trường hợp còn lại ghi rõ chưa thể phân loại chỉ từ hai biến.
- Bổ sung cảnh báo tương tác magma–nước có thể gây phun nổ; thành phần magma không quyết định duy nhất kiểu phun.

Mô hình là mặt cắt SVG khái niệm, không phải mô phỏng 3D hoặc mô hình động lực học phun trào. Chưa kiểm thử runtime trên thiết bị.

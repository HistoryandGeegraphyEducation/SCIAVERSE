# Thẩm định nguồn gốc — Cấu tạo bên trong Trái Đất

- Mã nguồn tham chiếu: `EDUVERSE/js/sims/interior-earth.js`
- Trạng thái: `in-review`
- Phạm vi: ranh giới và độ dày các lớp, trạng thái vật chất, thành phần, tỉ lệ hình học, đối lưu, sóng địa chấn, dữ liệu bề mặt và tương tác.
- Kết luận hiện tại: mô hình lớp cấu tạo và các mô tả kiến thức cơ bản phù hợp ở mức phổ thông; các bán kính được chọn gần với độ sâu địa vật lí thường dùng. Các hoạt ảnh đối lưu/sóng chỉ là sơ đồ khái niệm, có một chuyển động toàn khối dễ gây hiểu sai; trạng thái dự phòng bản đồ và quản lý tài nguyên còn lỗi. Chưa đủ điều kiện tiếp nhận.

## Căn cứ khoa học

1. U.S. Geological Survey (USGS), *Inside the Earth — This Dynamic Earth*: https://pubs.usgs.gov/gip/dynamic/inside.html
   - Lớp phủ dày xấp xỉ 2.900 km; phần lớn vật chất lớp phủ là đá nóng, rắn và có thể biến dạng/chảy chậm trong thời gian địa chất.
   - Nhân ngoài là kim loại lỏng, nhân trong là rắn; các số liệu độ dày thường được làm tròn để phục vụ mô tả phổ thông.
   - Vỏ Trái Đất và lớp phủ trên cùng có thể được phân biệt sâu hơn thành thạch quyển và quyển mềm; mô hình bốn lớp hiện tại là giản lược.

2. USGS, *Are the tectonic plates floating on magma?*: https://www.usgs.gov/faqs/are-the-tectonic-plates-floating-magma
   - Lớp phủ biểu hiện như chất rắn trong thang thời gian ngắn, nhưng có thể biến dạng và chảy rất chậm trong thang thời gian địa chất.
   - Không được mô tả toàn bộ lớp phủ như đại dương magma; vùng nóng chảy chỉ tồn tại ở những khu vực nhất định.
   - Nhân ngoài là lớp hoàn toàn lỏng bên trong Trái Đất.

3. USGS, *P-wave and S-wave paths through the earth*: https://www.usgs.gov/media/images/p-wave-and-s-wave-paths-through-earth
   - Sóng P truyền qua chất rắn và chất lỏng; sóng S không truyền qua chất lỏng.
   - Đây là căn cứ để suy ra trạng thái lỏng của nhân ngoài từ dữ liệu địa chấn.

4. USGS, *The Interior of the Earth*: https://pubs.usgs.gov/gip/interior/
   - Đường truyền địa chấn bị khúc xạ khi vận tốc sóng thay đổi theo vật liệu và độ sâu.
   - Sóng P có thể đi qua nhân ngoài; sóng S không truyền qua nhân ngoài lỏng. Các đường truyền thực tế không phải các đường thẳng đơn giản xuyên qua tâm.

5. NASA Earth Observatory, *Blue Marble: Next Generation — Base Map with Topography and Bathymetry*: https://science.nasa.gov/earth/earth-observatory/blue-marble-next-generation/base-topography-bathymetry/
   - Bộ ảnh gồm các ảnh ghép theo tháng của năm 2004; phiên bản có địa hình và địa hình đáy biển được tô bóng.
   - Ảnh toàn cầu tháng 1 có bản 5400×2700 và bản 21600×10800; ảnh gốc của mô hình được hạ kích thước trước khi đưa vào texture.

## Kiểm tra định lượng các lớp

Mô hình lấy bán kính trung bình Trái Đất khoảng 6.371 km làm mốc và quy đổi bán kính tương đối của từng lớp:

| Thành phần | Bán kính mô hình | Độ sâu/độ dày suy ra gần đúng | Nhận xét |
|---|---:|---:|---|
| Bề mặt/vỏ ngoài | 1,0000 | Bán kính 6.371 km | Mốc ngoài của mô hình |
| Đáy vỏ / đỉnh lớp phủ | 0,9945 | Vỏ dày khoảng 35 km | Giá trị đại diện nằm trong khoảng vỏ dày 5–70 km |
| Ranh giới lớp phủ/nhân ngoài | 0,545 | Độ sâu khoảng 2.899 km | Phù hợp giá trị làm tròn khoảng 2.900 km |
| Ranh giới nhân ngoài/nhân trong | 0,192 | Độ sâu khoảng 5.149 km | Phù hợp giá trị tham chiếu khoảng 5.150 km |
| Tâm nhân trong | 0 | Bán kính nhân trong khoảng 1.223 km | Gần với giá trị khoảng 1.220–1.250 km |

- Độ dày lớp phủ suy ra từ 0,9945 đến 0,545 bán kính khoảng 2.863 km; phù hợp với cách ghi “khoảng 2.850–2.900 km”.
- Độ dày nhân ngoài suy ra khoảng 2.249 km; mã ghi khoảng 2.260 km, chênh lệch nhỏ do làm tròn các bán kính.
- Bán kính nhân trong suy ra khoảng 1.223 km; mã ghi khoảng 1.220 km.
- Các giá trị trên nhất quán với nhau trong giới hạn mô hình cầu giản lược. Chúng không phải một bộ số liệu đo độc lập, vì các ranh giới được suy ra từ bán kính tương đối đã khai báo.

## Kết quả đọc mã nguồn EDUVERSE

### Phần kiến thức đúng

- Thứ tự lớp từ ngoài vào trong là vỏ, lớp phủ, nhân ngoài và nhân trong.
- Lớp phủ được mô tả là chủ yếu rắn nhưng có thể biến dạng chậm; không bị mô tả như toàn bộ là magma lỏng.
- Nhân ngoài được ghi là lỏng; nhân trong được ghi là rắn.
- Mô tả nhân ngoài là lớp kim loại lỏng bao quanh nhân trong, và chuyển động vật chất dẫn điện trong đó góp phần tạo từ trường Trái Đất, phù hợp với kiến thức địa vật lí cơ bản.
- Câu hỏi trắc nghiệm xác định nhân ngoài là lớp lỏng; sóng S không truyền qua nhân ngoài; lớp phủ chủ yếu rắn nhưng có thể biến dạng chậm. Cả ba đáp án dự kiến đều đúng.
- Phân biệt vỏ lục địa và vỏ đại dương trong phần mô tả là đúng về nguyên tắc; vỏ đại dương thường mỏng hơn vỏ lục địa.

### Giới hạn của mô hình lớp

1. Vỏ được biểu diễn bằng một lớp đồng nhất dày khoảng 35 km. Đây là độ dày đại diện nằm trong khoảng 5–70 km, nhưng không mô tả biến thiên giữa vỏ đại dương và vỏ lục địa.
2. Mô hình chỉ có bốn lớp chính. Nó không tách thạch quyển, quyển mềm, lớp phủ trên, vùng chuyển tiếp và lớp phủ dưới. Điều này có thể chấp nhận cho bài học nhập môn nếu ghi rõ đây là sơ đồ phân lớp khái quát.
3. Các ranh giới được thể hiện như những mặt cầu đồng tâm. Cấu trúc thực tế phức tạp hơn, không đồng nhất hoàn toàn theo phương ngang và có các biến thiên địa vật lí.
4. Thành phần nhân được ghi chủ yếu là sắt và nickel. Đây là mô tả giản lược; không nên hiểu đó là hợp kim nhị nguyên thuần khiết hoặc thành phần đã được lấy mẫu trực tiếp.

### Chế độ phóng đại vỏ và bóc tách

- Chế độ phóng đại thay bán kính mặt ngoài của lớp phủ từ 0,9945 xuống 0,94 trong khi giữ bán kính bề mặt ở 1. Điều này làm lớp vỏ hiển thị dày khoảng 0,06 bán kính, tương đương gần 382 km nếu quy đổi tuyến tính, thay vì khoảng 35 km.
- Giao diện có nhãn “Vỏ Trái Đất đang được phóng đại” và ghi rõ không theo tỉ lệ thực; đây là cách xử lý đúng về mặt thông tin. Tuy nhiên, cần giữ cảnh báo này hiển thị cả trong trạng thái bóc tách và mặt cắt.
- Thanh “Độ tách các lớp” chỉ điều khiển độ dịch chuyển đồ họa, không biểu thị khoảng cách địa chất hoặc độ sâu thực. Cần duy trì cách gọi là mức tách/bóc tách, không gắn đơn vị km.
- Hình học mặt cắt loại bỏ một phần góc của quả cầu để lộ các lớp bên trong. Đây là mặt cắt minh họa, không phải ảnh chụp cấu trúc bên trong.

### Chế độ đối lưu

- Tám đường cong được tạo thủ công trong vùng bán kính khoảng 0,68, nằm trong miền lớp phủ của mô hình.
- Mã có chú thích rằng các đường này là sơ đồ khái niệm, không biểu diễn dòng chảy theo tỉ lệ. Đây là giới hạn cần giữ nguyên khi tiếp nhận.
- Các đường cong quay quanh trục Y theo thời gian; chúng không được tính từ trường nhiệt, độ nhớt, mật độ, lực nổi hoặc phương trình động lực học lớp phủ.
- Phần mô tả nhắc đến chuyển động kim loại lỏng ở nhân ngoài và vai trò với từ trường, nhưng hình hoạt ảnh không mô phỏng dòng chảy trong nhân ngoài. Cần tránh để người học hiểu hoạt ảnh hiện tại là mô hình địa động lực học đầy đủ.
- Trong chế độ `flow`, toàn bộ `earthGroup` còn quay quanh trục Y. Chuyển động này không cần thiết để giải thích đối lưu và có thể tạo ấn tượng rằng toàn bộ các lớp Trái Đất quay như một khối.

### Chế độ sóng địa chấn

- Một đường P được vẽ thành đoạn thẳng xuyên qua tâm Trái Đất.
- Hai cung S được vẽ ở bán kính khoảng 0,72, lớn hơn bán kính nhân ngoài 0,545, do đó chúng nằm ngoài nhân ngoài lỏng. Cách bố trí này thể hiện đúng ý chính rằng sóng S không truyền qua nhân ngoài.
- Đường P thẳng xuyên qua tâm và các cung S có bán kính cố định không phải đường truyền địa chấn thực. Đường truyền thực tế bị khúc xạ tại các ranh giới do vận tốc thay đổi theo vật liệu và độ sâu.
- Các đường chỉ co giãn theo chu kỳ sin; chúng không thể hiện một xung sóng lan truyền dọc theo đường đi. Chế độ này phải được ghi là sơ đồ khái niệm.
- Mô hình chưa thể hiện vùng bóng sóng P, vùng bóng sóng S, phản xạ, khúc xạ, chuyển đổi pha hoặc đường truyền bề mặt. Không được dùng hình này để giải bài tập thời gian truyền sóng hoặc xác định vị trí động đất.
- Trong chế độ `seismic`, toàn bộ `earthGroup` cũng quay quanh trục Y. Chuyển động này không có ý nghĩa đối với sự lan truyền sóng địa chấn và cần được loại bỏ hoặc giải thích là thao tác góc nhìn, không phải chuyển động vật lí.

### Bản đồ nền và nguồn dữ liệu

- Mô hình dùng ảnh NASA Blue Marble: Next Generation, tháng 1/2004, có lớp tô bóng địa hình và địa hình đáy biển. Đây là ảnh ghép vệ tinh và dữ liệu địa hình/độ sâu, không phải ảnh chụp tức thời toàn bộ Trái Đất.
- Ảnh được tải từ đường dẫn NASA, sau đó vẽ lại vào canvas 2048×1024 trước khi tạo texture WebGL. Việc giảm kích thước có lợi cho hiệu năng nhưng làm giảm độ phân giải so với ảnh nguồn 5400×2700.
- Khi ảnh NASA tải lỗi, mã giữ lại texture dự phòng tự dựng bằng các đa giác lục địa. Tuy nhiên, HUD vẫn hiển thị “Bản đồ nền: NASA Blue Marble”. Đây là thông tin nguồn sai trong trạng thái dự phòng.
- Bản đồ dự phòng không đủ chính xác để nhận dạng địa danh; không được để nó xuất hiện mà không có nhãn “bản đồ minh họa dự phòng”.
- Ảnh NASA có nguồn công khai rõ ràng, nhưng cần lưu thông tin tên bộ ảnh, tháng/năm, đường dẫn nguồn và thông tin ghi công trong metadata của SCIAVERSE.

## Lỗi kỹ thuật và khả năng tiếp cận

1. Khi chuyển sang chế độ `flow` hoặc `seismic`, mã tăng `earthGroup.rotation.y`. Đây là chuyển động toàn bộ mô hình, không phải đối lưu hay truyền sóng; cần loại bỏ khỏi hai chế độ này hoặc tách thành điều khiển góc nhìn độc lập.
2. Các texture CanvasTexture được tạo cho quả Địa Cầu nhưng không được lưu trong danh sách tài nguyên để giải phóng. `destroy()` duyệt geometry và material, nhưng không dispose `material.map`; texture có thể còn giữ tài nguyên GPU sau khi tháo mô hình.
3. Nếu `ResizeObserver` không có, mã gắn listener `window.resize` nhưng không lưu hàm callback để gỡ khi `destroy()`. Đây là nguy cơ rò rỉ listener khi mô hình được mở/đóng nhiều lần.
4. Sự kiện `controls.addEventListener('change',()=>{})` không thực hiện công việc nào; có thể bỏ nếu không có mục đích kỹ thuật.
5. Canvas không có nhãn truy cập rõ ràng. Các lớp vẫn có nút chọn bằng HTML, nhưng thao tác xoay/zoom và chọn điểm trên quả cầu phụ thuộc pointer; cần kiểm tra bàn phím và trình đọc màn hình.
6. Khi texture NASA lỗi, giao diện không đổi nhãn nguồn và không báo trạng thái dự phòng. Cần hiển thị trạng thái nguồn đúng với texture đang dùng.
7. Các dòng chú thích, nội dung HUD và mô tả phải giữ được trên màn hình điện thoại; phần điều khiển và các thẻ kiến thức hiện có kích thước chữ nhỏ, cần kiểm thử tương phản và khả năng đọc trước khi tích hợp.
8. Chưa có kết quả kiểm thử trực tiếp trên trình duyệt Android, WebGL hoặc thiết bị cấu hình thấp.

## Điều chỉnh bắt buộc trước khi tiếp nhận

1. Giữ cấu trúc bốn lớp cho bài học phổ thông nhưng ghi rõ đây là mô hình phân lớp khái quát; không hàm ý Trái Đất chỉ có bốn miền địa vật lí.
2. Giữ số liệu bán kính và độ sâu kèm quy ước bán kính trung bình 6.371 km; ghi chú vỏ dày đại diện khoảng 35 km và có thể thay đổi theo loại vỏ.
3. Phân biệt rõ vỏ đại dương và vỏ lục địa trong nội dung; không khẳng định mô hình hình học hiện tại thể hiện riêng hai loại vỏ.
4. Duy trì mô tả lớp phủ là đá rắn có khả năng biến dạng/chảy chậm theo thời gian địa chất; không dùng hình ảnh hoặc lời dẫn gợi ý một đại dương magma liên tục.
5. Giữ cảnh báo phóng đại vỏ và mức tách lớp trong mọi chế độ; không gắn phần trăm bóc tách với đơn vị địa chất.
6. Trong chế độ đối lưu, chỉ cho các đường khái niệm chuyển động. Loại bỏ chuyển động quay toàn khối hoặc tách riêng thành điều khiển camera.
7. Trong chế độ địa chấn, giữ chú thích “sơ đồ minh họa”; nếu muốn dạy đường truyền thực cần bổ sung đường cong khúc xạ, nguồn phát, các pha sóng và vùng bóng sóng. Không dùng mô hình hiện tại để suy ra thời gian truyền.
8. Sửa nhãn nguồn bản đồ theo trạng thái texture: NASA Blue Marble khi tải thành công; bản đồ dự phòng minh họa khi tải lỗi.
9. Lưu metadata NASA Blue Marble tháng 1/2004 và nguồn dữ liệu; không mô tả ảnh là ảnh thời gian thực.
10. Dispose texture WebGL khi hủy mô hình và gỡ listener resize trong nhánh không có ResizeObserver.
11. Kiểm thử các chế độ mặt cắt, bóc tách, đối lưu, sóng địa chấn, phóng đại vỏ và chọn lớp ở các kích thước điện thoại; kiểm tra WebGL, texture, bộ nhớ và tương tác bàn phím.

## Ma trận kiểm thử bắt buộc

| Ca kiểm thử | Kết quả mong đợi |
|---|---|
| Vỏ Trái Đất | Độ dày đại diện khoảng 35 km khi chưa phóng đại |
| Ranh giới lớp phủ/nhân ngoài | Độ sâu xấp xỉ 2.900 km |
| Ranh giới nhân ngoài/nhân trong | Độ sâu xấp xỉ 5.150 km |
| Nhân trong | Bán kính xấp xỉ 1.220 km |
| Phóng đại vỏ | Cảnh báo phóng đại luôn hiển thị, không trình bày như tỉ lệ thực |
| Chế độ đối lưu | Chỉ các đường khái niệm chuyển động; không quay toàn khối Trái Đất |
| Chế độ địa chấn | Sóng S không đi qua nhân ngoài; P xuyên qua nhân ngoài; nhãn sơ đồ khái niệm hiển thị |
| Đường sóng P/S | Không dùng làm đường truyền định lượng hoặc tính thời gian |
| Texture NASA tải thành công | Nhãn nguồn ghi đúng Blue Marble tháng 1/2004 |
| Texture NASA tải lỗi | Nhãn chuyển sang bản đồ dự phòng minh họa |
| Đóng/mở mô hình nhiều lần | Không tích lũy texture GPU hoặc listener resize |
| Điện thoại 320–430 CSS px | Điều khiển, lớp kiến thức và quiz không tràn ngang hoặc che nhau |
| Điều khiển bàn phím | Các nút, slider và lựa chọn lớp có thể thao tác mà không cần pointer |

## Kết luận thẩm định

Phần cấu trúc lớp và các kiến thức chính có thể dùng cho mô hình học tập sau khi làm rõ phạm vi giản lược. Các bán kính và độ sâu khai báo nhất quán ở mức làm tròn; mô tả lớp phủ rắn biến dạng chậm, nhân ngoài lỏng, nhân trong rắn và quy tắc truyền sóng P/S phù hợp với căn cứ USGS.

Các điểm chưa đạt nằm ở cách biểu diễn chuyển động và kỹ thuật: chế độ đối lưu/sóng làm quay toàn bộ mô hình; hoạt ảnh không phải mô hình vật lí; nhãn Blue Marble không đổi khi dùng texture dự phòng; texture và listener resize chưa được giải phóng đầy đủ.

Có thể tiếp nhận cấu trúc lớp, nội dung kiến thức và ý tưởng tương tác. Không nên sao chép nguyên trạng các hoạt ảnh đối lưu/sóng hoặc cơ chế fallback. Chỉ chuyển trạng thái sang `validated` sau khi xử lý các điểm chặn và kiểm thử trên thiết bị thực tế.

## Nguồn tham khảo

- U.S. Geological Survey. *Inside the Earth — This Dynamic Earth*. https://pubs.usgs.gov/gip/dynamic/inside.html
- U.S. Geological Survey. *Are the tectonic plates floating on magma?* https://www.usgs.gov/faqs/are-tectonic-plates-floating-magma
- U.S. Geological Survey. *P-wave and S-wave paths through the earth*. https://www.usgs.gov/media/images/p-wave-and-s-wave-paths-through-earth
- U.S. Geological Survey. *The Interior of the Earth*. https://pubs.usgs.gov/gip/interior/
- NASA Earth Observatory. *Blue Marble: Next Generation — Base Map with Topography and Bathymetry*. https://science.nasa.gov/earth/earth-observatory/blue-marble-next-generation/base-topography-bathymetry/

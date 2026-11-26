# Phiếu thẩm định — Chuyển đổi quả Địa Cầu thành bản đồ

## 1. Phạm vi mô hình

Mô hình minh họa phép chuyển tọa độ kinh độ, vĩ độ trên mặt cầu sang mặt phẳng. Người học chọn bốn phép chiếu và quan sát cùng một bề mặt/lưới tọa độ sau biến đổi.

Mô hình hiện tại là trực quan hóa khái niệm. Không dùng để đo đạc, dẫn đường, xác định tọa độ trắc địa hoặc thay thế bản đồ có hệ quy chiếu được công bố.

## 2. Công thức đang triển khai

Ký hiệu:
- \(\lambda\): kinh độ, đơn vị radian.
- \(\varphi\): vĩ độ, đơn vị radian.
- \(R\): bán kính hình cầu quy ước. Trong hình học hiển thị, \(R=1\) cho mặt phẳng và \(R=1.55\) cho quả cầu.

### Plate Carrée (Equidistant Cylindrical, vĩ tuyến chuẩn xích đạo)

\[
x=R\lambda,\qquad y=R\varphi
\]

Đây là phép chiếu hình trụ đơn giản; không bảo toàn diện tích. Tỉ lệ theo phương Đông–Tây thay đổi theo vĩ độ, vì độ dài cung kinh tuyến và vĩ tuyến trên mặt cầu không có cùng tỉ lệ.

### Mercator cầu

\[
x=R\lambda,\qquad
y=R\ln\left(\tan\left(\frac{\pi}{4}+\frac{\varphi}{2}\right)\right)
\]

Công thức tiến tới vô hạn khi \(|\varphi|\to90^\circ\). Mô hình cắt vĩ độ ở \(\pm85.05112878^\circ\) để khung bản đồ có giới hạn vuông, không phải vì Mercator có giới hạn toán học tại vĩ độ này. Phép chiếu Mercator bảo toàn góc cục bộ nhưng diện tích và khoảng cách tăng về phía cực.

### Lambert hình trụ đồng diện tích, vĩ tuyến chuẩn xích đạo

\[
x=R\lambda,\qquad y=R\sin\varphi
\]

Phép chiếu giữ diện tích tương đối trên hình cầu. Hình dạng bị biến dạng, đặc biệt theo phương Đông–Tây ở vĩ độ cao.

### Phương vị cách đều, tâm Bắc Cực

\[
c=\frac{\pi}{2}-\varphi,\qquad
x=Rc\sin\lambda,\qquad y=Rc\cos\lambda
\]

Khoảng cách từ tâm chiếu đến điểm được giữ bằng cung góc trên mặt cầu. Mô hình biểu diễn toàn bộ bề mặt trong một đĩa, với tâm ở Bắc Cực; vùng gần rìa bản đồ có biến dạng hình dạng lớn.

## 3. Giả định và giới hạn

- Trái Đất được xấp xỉ bằng hình cầu; không dùng ellipsoid WGS 84 và không tính datum/geodetic CRS.
- Kinh độ, vĩ độ đầu vào là tọa độ góc, không phải tọa độ phẳng mét.
- Hình ảnh bề mặt là texture trực quan. Chưa dùng để xác nhận sai số tọa độ, diện tích hoặc độ dài địa lí.
- Bán kính, vị trí hai vật thể và kích thước trên màn hình được chọn để quan sát; không cùng tỉ lệ vật lí.
- Không có phép đo diện tích hoặc khoảng cách thực tế trong mô hình này.
- Phần cắt vĩ độ Mercator là giới hạn hiển thị; hai cực là điểm kỳ dị của công thức.
- Chưa kiểm chứng bằng ảnh chụp runtime rằng hướng texture và lưới kinh-vĩ tuyến trùng đúng với landmark địa lí.

## 4. Kiểm tra công thức đã chạy

Các kiểm tra số học trong mã:
- Plate Carrée tại \((0^\circ,0^\circ)\) trả về gốc tọa độ.
- Mercator tại xích đạo trả về \(y=0\).
- Mercator tại vĩ độ cắt cho giá trị hữu hạn.
- Lambert hình trụ đồng diện tích tại cực cho \(y/R=\pm1\).
- Phương vị cách đều: Bắc Cực là tâm; điểm xích đạo cách tâm \(\pi R/2\).

Các kiểm tra trên là kiểm tra công thức và trường hợp chuẩn, không thay cho kiểm thử hiển thị.

## 5. Nguồn khoa học

1. Snyder, J. P. (1987). *Map Projections: A Working Manual*. U.S. Geological Survey Professional Paper 1395. DOI: https://doi.org/10.3133/pp1395. Nguồn tham chiếu về công thức, đặc tính và cách phân loại phép chiếu.
2. U.S. Geological Survey. *How are different map projections used?* https://www.usgs.gov/faqs/how-are-different-map-projections-used. Nguồn đối chiếu về việc không phép chiếu phẳng nào đồng thời giữ đúng hướng, khoảng cách, diện tích và hình dạng trên toàn bản đồ.

## 6. Trạng thái

- Khoa học: `in-review`.
- Triển khai: `sciaverse-pilot-in-progress`.
- Chưa được xác nhận nghiệm thu khoa học.
- Chưa kiểm thử runtime WebGL trên trình duyệt/điện thoại.
- Chưa đủ điều kiện xuất hiện trong danh mục mô hình công bố.

# Tìm đường đi trên bản đồ — hồ sơ khoa học

## 1. Câu hỏi và phạm vi

Tìm tuyến có tổng chiều dài nhỏ nhất giữa hai nút trong một mạng lưới liên kết. Mô hình trình diễn cách bài toán đường đi ngắn nhất được giải trên đồ thị có trọng số; không phải ứng dụng dẫn đường và không mô phỏng mạng đường giao thông thực.

## 2. Dữ liệu và biểu diễn

- Đồ thị vô hướng mẫu gồm 8 nút và 12 cạnh.
- Mỗi nút có cặp tọa độ vĩ độ, kinh độ minh họa trong vùng 10,68–10,92°B và 106,60–106,90°Đ.
- Các cạnh biểu thị kết nối giả định giữa các nút, không phải đường phố đã khảo sát.
- Tọa độ được dùng để tính chiều dài trắc địa của từng cạnh. Bản vẽ dùng phép chiếu equirectangular cục bộ để định vị trực quan; vị trí trên màn hình không được dùng để đo chiều dài.

## 3. Cơ sở tính toán

### 3.1. Chiều dài cạnh

Với mỗi cặp nút, tính bài toán trắc địa ngược trên ellipsoid WGS 84 bằng công thức Vincenty. Tham số ellipsoid:

- Bán trục lớn: a = 6 378 137 m.
- Độ dẹt: f = 1 / 298,257223563.
- Bán trục nhỏ: b = a(1 − f).

Kết quả chiều dài cạnh tính bằng mét, sau đó đổi sang kilômét để hiển thị. Thuật toán Vincenty là phép lặp; mô hình chỉ dùng các cặp điểm ở phạm vi khu vực, không dùng cho hai điểm gần đối cực. Nếu phép lặp không hội tụ, cạnh bị đánh dấu không tính được thay vì âm thầm thay bằng một giá trị khác.

### 3.2. Đường đi ngắn nhất

Mạng lưới được biểu diễn thành đồ thị vô hướng có trọng số không âm. Trọng số mỗi cạnh là chiều dài trắc địa WGS 84. Dijkstra được dùng để tìm tổng trọng số nhỏ nhất từ nút xuất phát đến nút đích. Khi khóa một cạnh, cạnh đó bị loại khỏi đồ thị truy vấn; thuật toán tính lại tuyến. Nếu không còn đường nối, mô hình báo không có tuyến khả dụng.

## 4. Giả định và giới hạn

- Mạng lưới và các kết nối được tạo để minh họa thuật toán; không đại diện đường đi, đường bộ, đường thủy hay lối đi thực tế.
- Đồ thị vô hướng: mọi cạnh đi được hai chiều. Không có đường một chiều, rẽ cấm, giới hạn tải trọng, địa hình, tắc nghẽn hoặc thời gian di chuyển.
- Tiêu chí tối ưu duy nhất là tổng chiều dài cạnh. Tuyến ngắn nhất trên đồ thị không nhất thiết là tuyến nhanh nhất hoặc an toàn nhất ngoài thực địa.
- Tọa độ và kết nối mẫu không phải dữ liệu đo đạc. Muốn dùng như bản đồ dẫn đường cần dữ liệu mạng đường có nguồn, ngày cập nhật, quy tắc kết nối và thuộc tính giao thông được kiểm định.
- Phép chiếu equirectangular chỉ phục vụ bố trí điểm trên vùng địa lí nhỏ; chiều dài không được đo từ độ dài đường vẽ.

## 5. Trường hợp kiểm tra

Đồ thị kiểm tra thuật toán độc lập:
- A–B = 4; A–C = 1; C–B = 2; B–D = 1; C–D = 5.
- Tuyến ngắn nhất A → D phải là A → C → B → D, tổng trọng số 4.
- Khi khóa cạnh C–B, tuyến ngắn nhất phải là A → B → D, tổng trọng số 5.
- Khi khóa A–B, A–C và C–D vẫn nối được A đến D với tổng trọng số 6.
- Khi loại mọi cạnh nối đến D, thuật toán phải trả về trạng thái không có đường đi.

Các ca này kiểm tra logic Dijkstra; không phải số liệu thực địa.

## 6. Nguồn tham khảo

1. GeographicLib / geosphere documentation — bài toán trắc địa thuận và ngược trên ellipsoid, mặc định WGS 84: https://search.r-project.org/CRAN/refmans/geosphere/html/geodesic.html
2. NetworkX — Dijkstra trên đồ thị có trọng số không âm: https://networkx.org/documentation/stable/reference/algorithms/shortest_paths.html
3. Esri ArcGIS Pro — thuật toán Dijkstra trong phân tích mạng và các ràng buộc định tuyến thực tế: https://doc.esri.com/en/arcgis-pro/latest/help/analysis/networks/algorithms-used-by-network-analyst.html

## 7. Trạng thái

- Khoa học: in-review.
- Triển khai: sciaverse-pilot-in-progress.
- Đã kiểm tra: cú pháp JavaScript, phép tính WGS 84 ở các cạnh mẫu, Dijkstra và các trường hợp đường thay thế/không có đường.
- Chưa kiểm tra: runtime trình duyệt, thao tác cảm ứng trên thiết bị thật, khả năng truy cập bàn phím và hiệu năng ở các thiết bị cấu hình thấp.

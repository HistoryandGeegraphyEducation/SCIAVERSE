# Phiếu thẩm định — Đo khoảng cách thực tế

## Cơ chế

Người học đặt các điểm liên tiếp trên sơ đồ. Mỗi đoạn giữa hai điểm được tính bằng khoảng cách Euclid trên mặt phẳng:

\[
d_i=\sqrt{(x_i-x_{i-1})^2+(y_i-y_{i-1})^2}
\]

Tổng chiều dài tuyến trên bản đồ:

\[
L_{map}=\sum_{i=1}^{n}d_i
\]

Với tỉ lệ 1:n và quy ước đơn vị trên sơ đồ là cm bản đồ:

\[
L_{ground}(m)=\frac{L_{map}(cm)\times n}{100}
\]

Mô hình cũng tính khoảng cách thẳng giữa điểm đầu và điểm cuối để người học so sánh với chiều dài tuyến nhiều đoạn.

## Giả định và giới hạn

- Một đơn vị hình học trên sơ đồ được quy ước là 1 cm trên bản đồ; đây là quy ước của sơ đồ mô phỏng, không phải centimet vật lí trên màn hình.
- Tổng các đoạn thẳng chỉ xấp xỉ tuyến cong. Độ chính xác tăng khi người học đặt thêm điểm theo đường đi.
- Khoảng cách trên mặt phẳng không tính độ dốc, địa hình, độ cong Trái Đất hoặc chiều dài đường thực tế.
- Sơ đồ không sử dụng mạng lưới đường giao thông hay tọa độ địa lí thật.
- Kết quả là phép đo minh họa theo tỉ lệ đã chọn, không phải chỉ dẫn định tuyến.

## Kiểm tra số học

- Hai đoạn vuông góc 3 cm và 4 cm có tổng tuyến 7 cm, khoảng cách thẳng 5 cm.
- Với tỉ lệ 1:50 000, tuyến 7 cm tương ứng 3,5 km; khoảng cách thẳng 5 cm tương ứng 2,5 km.
- Một điểm chưa tạo thành đoạn; kết quả khoảng cách thực tế được để trống.

## Nguồn

1. National Geographic Society. *Measuring Distances on a Map*. https://education.nationalgeographic.org/resource/measuring-distances-on-a-map/. Hướng dẫn đo khoảng cách trên bản đồ, mở rộng thước tỉ lệ và phân biệt chiều dài đo trên bản đồ.
2. U.S. Geological Survey. *Map Scales*. https://pubs.usgs.gov/fs/0038-00/report.pdf. Quan hệ giữa khoảng cách bản đồ và khoảng cách thực tế.

## Trạng thái

- Khoa học: `in-review`.
- Triển khai: `sciaverse-pilot-in-progress`.
- Chưa được xác nhận nghiệm thu; chưa kiểm thử runtime trên thiết bị thật.

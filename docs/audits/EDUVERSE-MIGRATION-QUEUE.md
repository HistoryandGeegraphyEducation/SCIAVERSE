# EDUVERSE → SCIAVERSE — Hàng đợi tiếp nhận mô hình có mô-đun độc lập

Danh sách được lập từ `js/registry.js` và đường dẫn triển khai tương ứng trong EDUVERSE. "Độc lập" ở đây có nghĩa là có tệp hoặc thư mục triển khai riêng; không có nghĩa mô hình đã độc lập hoàn toàn về thư viện hoặc dữ liệu.

| Mô hình | Mã nguồn EDUVERSE | Trạng thái |
|---|---|---|
| Khám phá các hành tinh | `js/sims/solar-system-explorer.js` | Chưa thẩm định |
| Cấu tạo bên trong Trái Đất 3D | `js/sims/interior-earth.js` | Chưa thẩm định |
| Động đất | `js/sims/quake.js` | Chưa thẩm định |
| Sóng thần 3D | `js/sims/tsunami.js` | Chưa thẩm định |
| Trái Đất tự quay | `js/sims/earth.js` | Đã rà soát nguồn; cần hiệu chỉnh và kiểm thử bản SCIAVERSE |
| Núi lửa | `js/sims/volcano.js` | Chưa thẩm định |
| Bão nhiệt đới | `simulations/natural-hazards/bao-nhiet-doi/main.js` | Chưa thẩm định |
| Lũ quét | `simulations/natural-hazards/lu-quet/main.js` | Chưa thẩm định |
| Sạt lở đất | `simulations/natural-hazards/sat-lo-dat/main.js` | Chưa thẩm định |
| Xâm nhập mặn | `simulations/natural-hazards/xam-nhap-man/main.js` | Chưa thẩm định |
| Nước biển dâng | `simulations/natural-hazards/nuoc-bien-dang/main.js` | Chưa thẩm định |

## Quy tắc hoàn tất một mô hình

Mỗi mô hình chỉ được đánh dấu `validated` sau khi có phiếu thẩm định riêng, nguồn khoa học truy xuất được, kiểm tra công thức/tham số, xác định giả định và giới hạn, cùng kiểm thử chức năng trên bản SCIAVERSE. Nếu mô hình cần dữ liệu thực mà chưa có nguồn phù hợp, giữ trạng thái `blocked`; không thay bằng dữ liệu giả nhưng trình bày như quan trắc.

## Thứ tự ưu tiên

1. Trái Đất tự quay — mô hình đầu tiên để kiểm tra quy trình tiếp nhận và tiêu chuẩn hiển thị.
2. Cấu tạo bên trong Trái Đất, động đất, sóng thần và núi lửa — nhóm khoa học Trái Đất có quan hệ kiến thức.
3. Khám phá các hành tinh — kiểm tra dữ liệu thiên văn và tỉ lệ hiển thị.
4. Bão nhiệt đới, lũ quét, sạt lở đất, xâm nhập mặn và nước biển dâng — kiểm tra mô hình môi trường có nhiều biến số và giới hạn dự báo.

Thứ tự này là kế hoạch triển khai, không phải đánh giá mức độ quan trọng khoa học.

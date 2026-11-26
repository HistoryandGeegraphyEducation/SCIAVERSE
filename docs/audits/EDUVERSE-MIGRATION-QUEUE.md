# EDUVERSE → SCIAVERSE — Hàng đợi hiệu chỉnh và tiếp nhận mô hình độc lập

Danh sách được lập từ `js/registry.js` và đường dẫn triển khai tương ứng trong EDUVERSE. “Độc lập” ở đây có nghĩa là có tệp hoặc thư mục triển khai riêng; không có nghĩa mô hình độc lập hoàn toàn về thư viện hoặc dữ liệu.

## Trạng thái vòng thẩm định

- Hồ sơ thẩm định chuyên sâu đã hoàn tất: **12/12 mô hình**.
- Đạt trạng thái khoa học `validated`: **0/12**.
- Trạng thái khoa học hiện tại: **12 `needs-revision`**.
- Đã tiếp nhận vào bản SCIAVERSE: **0 mô hình hoàn tất**.
- Pilot đang triển khai: **Trái Đất tự quay**; chưa nghiệm thu trình duyệt/thiết bị.
- Các mô hình còn lại: `not-migrated`.

`needs-revision` nghĩa là hồ sơ đã xác định điểm phải sửa hoặc giới hạn phải công bố; không có nghĩa mọi nội dung trong mô hình đều sai.

## Danh sách theo dõi

| Mô hình | Mã nguồn EDUVERSE | Phiếu thẩm định | Khoa học | Triển khai SCIAVERSE |
|---|---|---|---|---|
| Xác định tọa độ địa lí | `js/sims/geo-01-coordinates/main.js` | [Phiếu](geographic-coordinates.md) | `needs-revision` | `not-migrated` |
| Khám phá các hành tinh | `js/sims/solar-system-explorer.js` | [Phiếu](solar-system.md) | `needs-revision` | `not-migrated` |
| Cấu tạo bên trong Trái Đất 3D | `js/sims/interior-earth.js` | [Phiếu](interior-earth.md) | `needs-revision` | `not-migrated` |
| Động đất | `js/sims/quake.js` | [Phiếu](earthquake.md) | `needs-revision` | `not-migrated` |
| Sóng thần 3D | `js/sims/tsunami.js` | [Phiếu](tsunami.md) | `needs-revision` | `not-migrated` |
| Trái Đất tự quay | `js/sims/earth.js` | [Phiếu](earth-rotation.md) | `needs-revision` | `sciaverse-pilot-in-progress` |
| Núi lửa | `js/sims/volcano.js` | [Phiếu](volcano.md) | `needs-revision` | `not-migrated` |
| Bão nhiệt đới | `simulations/natural-hazards/bao-nhiet-doi/main.js` | [Phiếu](tropical-cyclone.md) | `needs-revision` | `not-migrated` |
| Lũ quét | `simulations/natural-hazards/lu-quet/main.js` | [Phiếu](flash-flood.md) | `needs-revision` | `not-migrated` |
| Sạt lở đất | `simulations/natural-hazards/sat-lo-dat/main.js` | [Phiếu](landslide.md) | `needs-revision` | `not-migrated` |
| Xâm nhập mặn | `simulations/natural-hazards/xam-nhap-man/main.js` | [Phiếu](saltwater-intrusion.md) | `needs-revision` | `not-migrated` |
| Nước biển dâng | `simulations/natural-hazards/nuoc-bien-dang/main.js` | [Phiếu](sea-level-rise.md) | `needs-revision` | `not-migrated` |

## Quy tắc hoàn tất một mô hình

Một mô hình chỉ được đánh dấu `validated` sau khi:

1. Kiến thức, thuật ngữ và đơn vị được đối chiếu với nguồn có thẩm quyền.
2. Công thức, tham số, điều kiện đầu và điều kiện biên được kiểm tra.
3. Các giả định và giới hạn được thể hiện rõ trong giao diện.
4. Các điểm chặn trong phiếu thẩm định được xử lý.
5. Có kiểm thử chức năng trên bản SCIAVERSE.
6. Có kiểm tra trên điện thoại, bàn phím, reduced motion và vòng đời tài nguyên.

Chỉ chuyển `implementationStatus` sang `verified-in-build` sau khi phiên bản thực tế đã vượt qua kiểm thử. Nếu thiếu dữ liệu cần thiết để kết luận, giữ `blocked`; không thay bằng dữ liệu giả nhưng trình bày như quan trắc.

## Thứ tự hiệu chỉnh và tiếp nhận

1. **Hoàn tất pilot Trái Đất tự quay:** ghi công NASA, kiểm tra hướng quay bằng landmark, xử lý lỗi khởi tạo WebGL và thử nghiệm trên điện thoại.
2. **Xác định tọa độ địa lí:** sửa các điểm toán học/UX và nguồn texture; đây là mô hình tiếp theo để kiểm tra quy trình tiếp nhận.
3. **Cấu tạo bên trong Trái Đất:** giữ kiến thức phân lớp, sửa hoạt ảnh đối lưu/sóng và quản lý texture.
4. **Động đất và sóng thần:** làm rõ nguồn phát, tham số vật lí, quan hệ độ lớn–độ trượt và giới hạn truyền sóng/ngập.
5. **Núi lửa:** phân biệt kiểu phun trào và tách biến hoạt ảnh khỏi thông số vật lí.
6. **Khám phá các hành tinh:** chuẩn hóa dữ liệu thiên văn, trục nghiêng, chu kỳ và quy ước tỉ lệ.
7. **Nhóm môi trường:** bão nhiệt đới, lũ quét, sạt lở đất, xâm nhập mặn và nước biển dâng; mỗi mô hình phải có bộ biến và giới hạn dự báo riêng.

Thứ tự này là kế hoạch triển khai, không phải đánh giá mức độ quan trọng khoa học. Không mô hình nào được đưa vào nội dung công bố chỉ vì đã có hồ sơ thẩm định hoặc giao diện.


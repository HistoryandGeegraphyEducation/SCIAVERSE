# EDUVERSE → SCIAVERSE — Hàng đợi hiệu chỉnh và tiếp nhận mô hình độc lập

Danh sách được lập từ `js/registry.js` và đường dẫn triển khai tương ứng trong EDUVERSE. “Độc lập” ở đây có nghĩa là có tệp hoặc thư mục triển khai riêng; không có nghĩa mô hình độc lập hoàn toàn về thư viện hoặc dữ liệu.

## Trạng thái vòng thẩm định

- Hồ sơ thẩm định chuyên sâu đã hoàn tất: **12/12 mô hình**.
- Đạt trạng thái khoa học `validated`: **0/12**.
- Trạng thái khoa học hiện tại: **12 `needs-revision`**.
- Đã tiếp nhận vào bản SCIAVERSE: **0 mô hình hoàn tất**.
- Đã dựng pilot SCIAVERSE độc lập: **12/12 mô hình**.
- Đã nghiệm thu khoa học và kỹ thuật: **0/12**.
- Cả 12 mô hình vẫn ở trạng thái `needs-revision` và `sciaverse-pilot-in-progress`; chưa kiểm thử runtime đầy đủ trên thiết bị thật.

`needs-revision` nghĩa là hồ sơ đã xác định điểm phải sửa hoặc giới hạn phải công bố; không có nghĩa mọi nội dung trong mô hình đều sai.

## Danh sách theo dõi

| Mô hình | Mã nguồn EDUVERSE | Phiếu thẩm định | Khoa học | Triển khai SCIAVERSE |
|---|---|---|---|---|
| Xác định tọa độ địa lí | `js/sims/geo-01-coordinates/main.js` | [Phiếu](geographic-coordinates.md) · [Pilot](../../simulations/geography/coordinates/index.html) | `needs-revision` | `sciaverse-pilot-in-progress` |
| Khám phá các hành tinh | `js/sims/solar-system-explorer.js` | [Phiếu](solar-system.md) · [Pilot](../../simulations/astronomy/solar-system/index.html) | `needs-revision` | `sciaverse-pilot-in-progress` |
| Cấu tạo bên trong Trái Đất 3D | `js/sims/interior-earth.js` | [Phiếu](interior-earth.md) · [Pilot](../../simulations/earth/interior/index.html) | `needs-revision` | `sciaverse-pilot-in-progress` |
| Động đất | `js/sims/quake.js` | [Phiếu](earthquake.md) · [Pilot](../../simulations/geophysics/earthquake/index.html) | `needs-revision` | `sciaverse-pilot-in-progress` |
| Sóng thần 3D | `js/sims/tsunami.js` | [Phiếu](tsunami.md) · [Pilot](../../simulations/oceanography/tsunami/index.html) | `needs-revision` | `sciaverse-pilot-in-progress` |
| Trái Đất tự quay | `js/sims/earth.js` | [Phiếu](earth-rotation.md) · [Pilot](../../simulations/earth/rotation/index.html) | `needs-revision` | `sciaverse-pilot-in-progress` |
| Núi lửa | `js/sims/volcano.js` | [Phiếu](volcano.md) · [Pilot](../../simulations/geophysics/volcano/index.html) | `needs-revision` | `sciaverse-pilot-in-progress` |
| Bão nhiệt đới | `simulations/natural-hazards/bao-nhiet-doi/main.js` | [Phiếu](tropical-cyclone.md) · [Pilot](../../simulations/meteorology/tropical-cyclone/index.html) | `needs-revision` | `sciaverse-pilot-in-progress` |
| Lũ quét | `simulations/natural-hazards/lu-quet/main.js` | [Phiếu](flash-flood.md) · [Pilot](../../simulations/hydrology/flash-flood/index.html) | `needs-revision` | `sciaverse-pilot-in-progress` |
| Sạt lở đất | `simulations/natural-hazards/sat-lo-dat/main.js` | [Phiếu](landslide.md) · [Pilot](../../simulations/geotechnical/landslide/index.html) | `needs-revision` | `sciaverse-pilot-in-progress` |
| Xâm nhập mặn | `simulations/natural-hazards/xam-nhap-man/main.js` | [Phiếu](saltwater-intrusion.md) · [Pilot](../../simulations/hydrology/saltwater-intrusion/index.html) | `needs-revision` | `sciaverse-pilot-in-progress` |
| Nước biển dâng | `simulations/natural-hazards/nuoc-bien-dang/main.js` | [Phiếu](sea-level-rise.md) · [Pilot](../../simulations/coastal/sea-level-rise/index.html) | `needs-revision` | `sciaverse-pilot-in-progress` |

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

1. **Trái Đất tự quay và tọa độ địa lí:** kiểm tra hướng texture bằng landmark, WebGL, cảm ứng và quy ước trắc địa.
2. **Cấu tạo bên trong Trái Đất:** xác nhận các ranh giới lớp, trạng thái vật chất và nội dung sóng địa chấn.
3. **Khám phá các hành tinh:** đối chiếu bộ dữ liệu JPL/NSSDC, chu kỳ, dấu nghịch hành và cách nén tỉ lệ.
4. **Động đất và sóng thần:** kiểm tra công thức M0/Mw, giả định môđun trượt, tốc độ sóng dài và điều kiện độ sâu không đổi.
5. **Núi lửa:** xác nhận các mô tả thành phần magma, khí hòa tan và giới hạn phân loại kiểu phun.
6. **Bão nhiệt đới:** xác nhận quy ước chiều xoáy theo bán cầu và các yếu tố môi trường; không xây dựng dự báo.
7. **Lũ quét, sạt lở, xâm nhập mặn và nước biển dâng:** kiểm tra đơn vị, giả định mô hình, điều kiện áp dụng và ranh giới giữa minh họa với dự báo.

Thứ tự này là kế hoạch triển khai, không phải đánh giá mức độ quan trọng khoa học. Không mô hình nào được đưa vào nội dung công bố chỉ vì đã có hồ sơ thẩm định hoặc giao diện.


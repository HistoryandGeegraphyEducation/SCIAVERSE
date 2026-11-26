# EDUVERSE → SCIAVERSE — Hàng đợi hiệu chỉnh và tiếp nhận mô hình độc lập

Danh sách được lập từ `js/registry.js` và đường dẫn triển khai tương ứng trong EDUVERSE. “Độc lập” ở đây có nghĩa là có tệp hoặc thư mục triển khai riêng; không có nghĩa mô hình độc lập hoàn toàn về thư viện hoặc dữ liệu.

## Trạng thái vòng thẩm định

- Hồ sơ thẩm định đã lập cho các pilot độc lập: **21/21 mô hình**.
- Nghiệm thu khoa học: **12 mô hình** đã được chủ dự án xác nhận ngày 26/11/2026 (`validated`); **6 mô hình** gồm 5 mô hình bản đồ và mô hình chuyển động mảng kiến tạo vẫn ở trạng thái `in-review`.
- Đã dựng và lưu pilot SCIAVERSE độc lập trên `main`: **17/17 mô hình**.
- Kiểm thử runtime trên trình duyệt/thiết bị thật: **chưa hoàn tất 0/21**.
- Trạng thái triển khai: **21 `sciaverse-pilot-in-progress`**; chưa mô hình nào được đánh dấu `verified-in-build`.
- Nghiệm thu khoa học không thay thế nghiệm thu kỹ thuật. Chỉ chuyển sang `verified-in-build` sau khi hoàn tất kiểm thử chức năng, WebGL, thiết bị di động, bàn phím, reduced motion và vòng đời tài nguyên.

`needs-revision` nghĩa là hồ sơ đã xác định điểm phải sửa hoặc giới hạn phải công bố; không có nghĩa mọi nội dung trong mô hình đều sai.

## Ghi nhận nghiệm thu

Theo xác nhận của chủ dự án ngày 26/11/2026, 12 mô hình có trạng thái `validated` trong danh sách dưới đây đã hoàn tất nghiệm thu khoa học. Chín mô hình còn lại đang ở trạng thái `in-review`: năm mô hình bản đồ, chuyển động mảng kiến tạo, phong hóa, xâm thực và bồi tụ, sóng địa chấn, địa hình 3D và đường đồng mức. Các phiếu thẩm định ghi nhận nguồn, giả định và giới hạn; trạng thái hiện hành được quản lý trong `data/model-registry.json`. Không tự ý thay đổi nội dung khoa học đã duyệt. Nghiệm thu kỹ thuật của cả 21 pilot vẫn đang chờ kiểm thử runtime trên trình duyệt và thiết bị thật.

## Danh sách theo dõi

| Mô hình | Mã nguồn EDUVERSE | Phiếu thẩm định | Khoa học | Triển khai SCIAVERSE |
|---|---|---|---|---|
| Xác định tọa độ địa lí | `js/sims/geo-01-coordinates/main.js` | [Phiếu](geographic-coordinates.md) · [Pilot](../../simulations/geography/coordinates/index.html) | `validated` (26/11/2026) | `sciaverse-pilot-in-progress` |
| Khám phá các hành tinh | `js/sims/solar-system-explorer.js` | [Phiếu](solar-system.md) · [Pilot](../../simulations/astronomy/solar-system/index.html) | `validated` (26/11/2026) | `sciaverse-pilot-in-progress` |
| Cấu tạo bên trong Trái Đất | `js/sims/interior-earth.js` | [Phiếu](interior-earth.md) · [Pilot](../../simulations/earth/interior/index.html) | `validated` (26/11/2026) | `sciaverse-pilot-in-progress` |
| Động đất | `js/sims/quake.js` | [Phiếu](earthquake.md) · [Pilot](../../simulations/geophysics/earthquake/index.html) | `validated` (26/11/2026) | `sciaverse-pilot-in-progress` |
| Sóng thần và tốc độ truyền | `js/sims/tsunami.js` | [Phiếu](tsunami.md) · [Pilot](../../simulations/oceanography/tsunami/index.html) | `validated` (26/11/2026) | `sciaverse-pilot-in-progress` |
| Trái Đất tự quay | `js/sims/earth.js` | [Phiếu](earth-rotation.md) · [Pilot](../../simulations/earth/rotation/index.html) | `validated` (26/11/2026) | `sciaverse-pilot-in-progress` |
| Núi lửa | `js/sims/volcano.js` | [Phiếu](volcano.md) · [Pilot](../../simulations/geophysics/volcano/index.html) | `validated` (26/11/2026) | `sciaverse-pilot-in-progress` |
| Bão nhiệt đới | `simulations/natural-hazards/bao-nhiet-doi/main.js` | [Phiếu](tropical-cyclone.md) · [Pilot](../../simulations/meteorology/tropical-cyclone/index.html) | `validated` (26/11/2026) | `sciaverse-pilot-in-progress` |
| Lũ quét | `simulations/natural-hazards/lu-quet/main.js` | [Phiếu](flash-flood.md) · [Pilot](../../simulations/hydrology/flash-flood/index.html) | `validated` (26/11/2026) | `sciaverse-pilot-in-progress` |
| Sạt lở đất | `simulations/natural-hazards/sat-lo-dat/main.js` | [Phiếu](landslide.md) · [Pilot](../../simulations/geotechnical/landslide/index.html) | `validated` (26/11/2026) | `sciaverse-pilot-in-progress` |
| Xâm nhập mặn | `simulations/natural-hazards/xam-nhap-man/main.js` | [Phiếu](saltwater-intrusion.md) · [Pilot](../../simulations/hydrology/saltwater-intrusion/index.html) | `validated` (26/11/2026) | `sciaverse-pilot-in-progress` |
| Nước biển dâng | `simulations/natural-hazards/nuoc-bien-dang/main.js` | [Phiếu](sea-level-rise.md) · [Pilot](../../simulations/coastal/sea-level-rise/index.html) | `validated` (26/11/2026) | `sciaverse-pilot-in-progress` |
| Chuyển đổi quả Địa Cầu thành bản đồ | `js/sims/geo-mini-projects-02-05/main.js` | [Phiếu](map-projection.md) · [Pilot](../../simulations/cartography/globe-projection/index.html) | `in-review` | `sciaverse-pilot-in-progress` |
| La bàn và phương hướng | `js/sims/geo-mini-projects-02-05/main.js` | [Phiếu](compass-bearing.md) · [Pilot](../../simulations/cartography/compass/index.html) | `in-review` | `sciaverse-pilot-in-progress` |
| Thay đổi tỉ lệ bản đồ | `js/sims/geo-mini-projects-02-05/main.js` | [Phiếu](map-scale.md) · [Pilot](../../simulations/cartography/map-scale/index.html) | `in-review` | `sciaverse-pilot-in-progress` |
| Đo khoảng cách thực tế | `js/sims/geo-mini-projects-02-05/main.js` | [Phiếu](map-distance.md) · [Pilot](../../simulations/cartography/map-distance/index.html) | `in-review` | `sciaverse-pilot-in-progress` |
| Tìm đường đi trên bản đồ | `js/sims/geo-catalog.js` | [Phiếu](route-finding.md) · [Pilot](../../simulations/cartography/route-finding/index.html) | `in-review` | `sciaverse-pilot-in-progress` |
| Chuyển động các mảng kiến tạo | `js/sims/geo-processes.js` | [Phiếu](plate-tectonics.md) · [Pilot](../../simulations/tectonics/plate-motion/index.html) | `in-review` | `sciaverse-pilot-in-progress` |
| Phong hóa, xâm thực và bồi tụ | `js/sims/geo-processes.js` | [Phiếu](weathering-erosion-deposition.md) · [Pilot](../../simulations/geomorphology/weathering-erosion-deposition/index.html) | `in-review` | `sciaverse-pilot-in-progress` |
| Sóng địa chấn | `js/sims/geo-catalog.js` | [Phiếu](seismic-waves.md) · [Pilot](../../simulations/geophysics/seismic-waves/index.html) | `in-review` | `sciaverse-pilot-in-progress` |
| Địa hình 3D và đường đồng mức | `js/sims/geo-catalog.js` | [Phiếu](contour-terrain.md) · [Pilot](../../simulations/cartography/contour-terrain/index.html) | `in-review` | `sciaverse-pilot-in-progress` |

## Quy tắc hoàn tất một mô hình

`validated` ghi nhận nghiệm thu khoa học, sau khi:

1. Kiến thức, thuật ngữ và đơn vị được đối chiếu với nguồn có thẩm quyền.
2. Công thức, tham số, điều kiện đầu và điều kiện biên được kiểm tra.
3. Các giả định và giới hạn được thể hiện rõ trong mô hình.
4. Các điểm khoa học cần xử lý đã được giải quyết và phiên bản được xác nhận nghiệm thu.

`verified-in-build` là trạng thái kỹ thuật riêng. Chỉ chuyển `implementationStatus` sang trạng thái này sau khi có kiểm thử chức năng trên bản SCIAVERSE, WebGL, điện thoại, bàn phím, reduced motion và vòng đời tài nguyên. Nghiệm thu khoa học không tự động chứng minh các kiểm thử kỹ thuật đã đạt. Nếu thiếu dữ liệu cần thiết để kết luận, giữ `blocked`; không thay bằng dữ liệu giả nhưng trình bày như quan trắc.

## Thứ tự hiệu chỉnh và tiếp nhận

1. **Trái Đất tự quay và tọa độ địa lí:** kiểm tra hướng texture bằng landmark, WebGL, cảm ứng và quy ước trắc địa.
2. **Cấu tạo bên trong Trái Đất:** xác nhận các ranh giới lớp, trạng thái vật chất và nội dung sóng địa chấn.
3. **Khám phá các hành tinh:** đối chiếu bộ dữ liệu JPL/NSSDC, chu kỳ, dấu nghịch hành và cách nén tỉ lệ.
4. **Động đất và sóng thần:** kiểm tra công thức M0/Mw, giả định môđun trượt, tốc độ sóng dài và điều kiện độ sâu không đổi.
5. **Núi lửa:** xác nhận các mô tả thành phần magma, khí hòa tan và giới hạn phân loại kiểu phun.
6. **Bão nhiệt đới:** xác nhận quy ước chiều xoáy theo bán cầu và các yếu tố môi trường; không xây dựng dự báo.
7. **Lũ quét, sạt lở, xâm nhập mặn và nước biển dâng:** kiểm tra đơn vị, giả định mô hình, điều kiện áp dụng và ranh giới giữa minh họa với dự báo.

Thứ tự này là kế hoạch triển khai, không phải đánh giá mức độ quan trọng khoa học. Không mô hình nào được đưa vào nội dung công bố chỉ vì đã có hồ sơ thẩm định hoặc giao diện.


# SCIAVERSE — Giai đoạn 0, bước 4: Kiểm tra và phân loại chất lượng mô hình

Ngày rà soát: 27/11/2026  
Nhánh: main  
Commit cơ sở: b647dea5ad625bfe5d7a13e9ef1d4bbb7fb055eb  
Phạm vi: mã nguồn hiện có trong SCIAVERSE; không đọc hoặc chỉnh sửa repository EDUVERSE.

## 1. Kết quả tổng hợp

Đối chiếu trực tiếp data/model-registry.json và cây repository:

| Hạng mục | Kết quả |
|---|---:|
| Bản ghi Registry | 44 |
| Bản ghi có implementationPath | 25 |
| scientificStatus = validated | 12 |
| scientificStatus = in-review | 12 |
| scientificStatus = not-reviewed | 20 |
| implementationStatus = sciaverse-pilot-in-progress | 25 |
| implementationStatus = verified-in-build | 0 |
| Trang mô hình có trong simulations/ | 25 |
| Trang có đường dẫn nhưng chưa có bản ghi Registry | 0 |
| Kiểm thử runtime trên trình duyệt được xác nhận | 0/25 |

Mười hai mô hình đã nghiệm thu khoa học ngày 26/11/2026 được giữ nguyên trạng thái validated. Không có căn cứ để chuyển bất kỳ mô hình nào sang verified-in-build. Việc rà soát mã nguồn không thay thế quyết định nghiệm thu khoa học.

## 2. Đánh giá theo 10 nhóm tiêu chí

### 2.1. Tính đúng đắn khoa học

- 12 mô hình validated được bảo toàn trạng thái khoa học đã xác nhận.
- 12 mô hình in-review tiếp tục ở trạng thái chờ thẩm định; không tự chuyển sang validated.
- Các mô hình dùng dữ liệu tổng hợp hoặc hình học giả định phải được hiểu là mô hình khái niệm, không phải dữ liệu quan trắc hay dự báo thực tế.
- Mã nguồn hiện tại cho thấy một số mô hình đã có công thức và đơn vị rõ ràng, nhưng chưa thể xác nhận kết quả trên trình duyệt khi chưa chạy các trường hợp kiểm tra chuẩn.

### 2.2. Cơ chế vận hành

Các mô hình đang dùng nhiều cơ chế khác nhau: tính toán tham số, thay đổi trạng thái, chọn quá trình, dựng đồ thị, điều khiển cảnh 3D và diễn tiến theo thời gian. Không nên buộc mọi mô hình phải có cùng một vòng lặp hoạt ảnh.

Hai mô hình có diễn tiến thời gian rõ trong mã hiện tại là Khám phá các hành tinh và Trái Đất tự quay. Phần lớn mô hình còn lại cập nhật theo thao tác hoặc chọn trạng thái. Cách làm này phù hợp với mô hình cấu trúc, bản đồ và mô hình dữ liệu tĩnh, nhưng chưa đáp ứng các yêu cầu diễn tiến đã nêu đối với một số quá trình động.

### 2.3. Tự động diễn tiến

- Khám phá các hành tinh có vòng cập nhật hoạt ảnh, điều khiển chạy, tạm dừng và tốc độ.
- Trái Đất tự quay có vòng hoạt ảnh và cập nhật đồng hồ theo múi giờ.
- Vòng tuần hoàn nước chỉ cho chọn một trong năm quá trình; không có bộ thời gian, chạy, tạm dừng hoặc tốc độ. Chức năng hiện tại chưa tương ứng với từ tự động trong tên mô hình.
- Trái Đất chuyển động quanh Mặt Trời cho chọn bốn mốc mùa; chưa có điều khiển thời gian liên tục hoặc tốc độ quỹ đạo.
- Chuyển động mảng kiến tạo và Phong hóa, xâm thực và bồi tụ hiện chủ yếu đổi trạng thái minh họa theo lựa chọn; chưa có diễn tiến liên tục.

### 2.4. Điều chỉnh tham số

Các trang đã có nhiều điều khiển thực chất: vĩ độ và kinh độ, phép chiếu, độ từ thiên, phương vị, tỉ lệ bản đồ, điểm đo, vận tốc mảng, khoảng cao đều, độ sâu nước, kích thước đứt gãy, lượng mưa, hệ số dòng chảy, thông số mái dốc và mực nước biển.

Cần phân biệt điều khiển tham số có tác động vào phép tính với điều khiển chỉ đổi hình minh họa. Các mô hình Xâm nhập mặn, Bão nhiệt đới và Nước biển dâng hiện có một số lựa chọn định tính hoặc sơ đồ khái niệm; không được diễn giải thành kết quả định lượng hay dự báo.

### 2.5. Trực quan hóa

- Có mô hình 3D dùng Three.js, mô hình SVG, đồ thị tuyến và biểu đồ kết quả.
- Một số bề mặt địa hình được tạo bằng hàm tổng hợp, không lấy từ DEM thực.
- Mạng đường đi là đồ thị mẫu gồm 8 nút và 12 cạnh; không phải mạng đường phố đã khảo sát.
- Mô hình Nước biển dâng dùng mặt cắt giả định, không có DEM, datum cao độ hoặc kết nối thủy văn thực.
- Mô hình Xâm nhập mặn thể hiện xu hướng tương đối; không tính khoảng cách xâm nhập thực tế.

### 2.6. Mức kiến thức

Không tìm thấy cơ chế chuyển đổi rõ ràng giữa hai mức kiến thức cơ bản và nâng cao trong các trang mô hình đã rà soát. Registry cũng chưa có trường quản lý mức kiến thức. Đây là phần chưa triển khai, không phải lỗi khoa học của từng mô hình.

### 2.7. Giao diện và khả năng tiếp cận

- Các trang mô hình đều có quy tắc CSS responsive ở ít nhất một breakpoint.
- Trong 24 mô hình thuộc hàng đợi tiếp nhận, 10/24 có khai báo focus-visible rõ ràng; 14/24 chưa tìm thấy khai báo này trong stylesheet riêng hoặc stylesheet dùng chung được nạp. Trang daylight-duration chưa được tính vào nhóm kiểm tra này.
- Trong 24 mô hình thuộc hàng đợi tiếp nhận, có 8/24 khai báo prefers-reduced-motion trong stylesheet đang áp dụng; 16/24 chưa tìm thấy khai báo tương ứng. Trang daylight-duration chưa được tính vào nhóm kiểm tra này.
- Đây là kết quả kiểm tra mã CSS tĩnh. Chưa kết luận rằng mọi điều khiển của các trang còn lại đều không thể dùng bằng bàn phím hoặc có hoạt ảnh gây vấn đề; cần kiểm tra trực tiếp trên trình duyệt.

### 2.8. Responsive

Trong 24 mô hình thuộc hàng đợi tiếp nhận, có breakpoint max-width trong stylesheet riêng của 23/24 mô hình. Stylesheet riêng của mô hình Động đất chỉ có quy tắc reduced-motion, không có breakpoint theo chiều rộng; trang vẫn nạp stylesheet dùng chung của hệ thống. Trang daylight-duration có breakpoint riêng nhưng chưa được kiểm thử thực tế. Chưa có bằng chứng kiểm tra thực tế ở các chiều rộng 320, 360, 390 và 430 CSS px. Không đánh dấu đạt responsive chỉ dựa trên việc có media query.

### 2.9. Lỗi kỹ thuật và phụ thuộc

- index.html tham chiếu earth-rotation.js nhưng tệp này không có trong cây repository. Đây là tham chiếu tài nguyên nội bộ không hợp lệ.
- Có 25 trang trong simulations/ nhưng Registry chỉ có 24 đường dẫn triển khai. Trang simulations/astronomy/daylight-duration/index.html chưa có bản ghi Registry.
- three-loader.js tải Three.js và OrbitControls từ CDN bên ngoài, có nhiều nguồn dự phòng nhưng không có bản thư viện nội bộ. Khi các CDN đều không truy cập được, mô hình 3D phụ thuộc loader có thể không khởi tạo.
- Chưa chạy kiểm thử runtime nên chưa xác nhận lỗi console, lỗi tương tác, rò rỉ tài nguyên hoặc lỗi WebGL.

### 2.10. Tình trạng kiểm thử

Trong cây repository hiện tại không tìm thấy bộ kiểm thử trình duyệt Playwright/Puppeteer, cấu hình Jest/Vitest hoặc workflow kiểm thử tương ứng. Không tìm thấy package.json ở thư mục gốc. Hồ sơ hàng đợi ghi nhận 0/24 mô hình migration đã hoàn tất kiểm thử runtime; trang daylight-duration cũng chưa được kiểm thử. Tổng số trang pilot có đường dẫn trong Registry là 25, chưa có trang nào được xác nhận runtime.

Kết luận: 24 mô hình vẫn là pilot về mặt triển khai. Không có mô hình nào được xác nhận verified-in-build.

## 3. Đánh giá theo từng mô hình

| Model ID | Mô hình | Hiện trạng mã nguồn | Điểm cần theo dõi |
|---|---|---|---|
| toa-do-dia-li | Xác định tọa độ địa lí | Mô hình quả địa cầu 3D, điều chỉnh vĩ độ và kinh độ, cập nhật điểm và lưới tọa độ | Kiểm tra hướng texture bằng địa danh chuẩn; phân biệt mô hình cầu với tọa độ trắc địa ellipsoid; chưa runtime |
| qua-dia-cau-ban-do | Chuyển đổi quả Địa Cầu thành bản đồ | Chọn phép chiếu và cập nhật quả địa cầu/bản đồ | Kiểm tra công thức, giới hạn vĩ độ và biến dạng; đang in-review |
| la-ban-phuong-huong | La bàn và phương hướng | Điều chỉnh độ từ thiên và phương vị; hiển thị hướng Bắc từ và Bắc địa lí | Kiểm tra quy ước dấu độ từ thiên, phép đổi phương vị và trường hợp qua 0/360 độ; đang in-review |
| ti-le-ban-do | Thay đổi tỉ lệ bản đồ | Chọn mẫu số tỉ lệ, chiều dài bản đồ và kết quả khoảng cách thực tế | Kiểm tra đồng nhất đơn vị và làm tròn; đang in-review |
| do-khoang-cach | Đo khoảng cách thực tế | Đặt điểm đo trên sơ đồ, tính tổng đoạn và khoảng cách theo tỉ lệ | Kiểm tra thao tác cảm ứng, xóa điểm, đổi tỉ lệ sau khi đo; đang in-review |
| tim-duong-ban-do | Tìm đường đi trên bản đồ | Đồ thị mẫu 8 nút, 12 cạnh; tính tuyến ngắn nhất với trọng số chiều dài trắc địa | Dữ liệu là mạng giả định, không phải đường giao thông thực; đang in-review |
| kham-pha-cac-hanh-tinh | Khám phá các hành tinh | Tám hành tinh, chọn thiên thể, chạy/tạm dừng và điều chỉnh tốc độ | Kiểm tra quy ước đường kính, chu kỳ sao, chiều quay nghịch hành và tỉ lệ quỹ đạo; giữ validated |
| traidat-quanh-mattroi | Trái Đất chuyển động quanh Mặt Trời | Chọn xuân phân, hạ chí, thu phân, đông chí; dựng vị trí và trục nghiêng tương ứng | Chưa có điều khiển thời gian và tốc độ quỹ đạo; đang in-review |
| cau-tao-ben-trong-trai-dat | Cấu tạo bên trong Trái Đất | Chọn bốn lớp cấu tạo và nội dung sóng P/S; trực quan hóa dạng sơ đồ | Bảo toàn các ranh giới lớp, trạng thái vật chất và giới hạn giản lược; giữ validated |
| chuyen-dong-mang-kien-tao | Chuyển động các mảng kiến tạo | Chọn tách giãn, hội tụ, trượt ngang; có điều khiển vận tốc | Kiểm tra đơn vị và tác động thực của slider; chưa có diễn tiến liên tục; đang in-review |
| phong-hoa-xam-thuc-boi-tu | Phong hóa, xâm thực và bồi tụ | Chọn ba quá trình và cập nhật cảnh 3D | Đây là mô hình khái niệm; không suy diễn thành mô hình vận chuyển trầm tích định lượng; đang in-review |
| song-dia-chan | Sóng địa chấn | Chọn sóng P hoặc S; hiển thị đường truyền giản đồ | Không tính vận tốc, khúc xạ, phản xạ hoặc vùng bóng địa chấn; đang in-review |
| dia-hinh-duong-dong-muc | Địa hình 3D và đường đồng mức | Tạo địa hình tổng hợp và điều chỉnh khoảng cao đều | Không dùng DEM thực hoặc hệ cao độ địa lí; đang in-review |
| luoc-do-lat-cat-dia-hinh | Chuyển lược đồ thành lát cắt địa hình | Chọn tuyến cắt và dựng biểu đồ cao độ từ bề mặt tổng hợp | Không dùng DEM thực; kiểm tra nội suy, trục khoảng cách và đơn vị cao độ; đang in-review |
| vong-tuan-hoan-nuoc | Vòng tuần hoàn nước tự động | Chọn bốc hơi, ngưng tụ, mưa, dòng chảy mặt hoặc nước ngầm | Chưa có tự động diễn tiến hoặc cân bằng nước; đang in-review |
| dongdat | Động đất | Tính M0 và Mw từ chiều dài, chiều rộng, độ trượt và môđun trượt; có độ sâu chấn tiêu | Kiểm tra miền tham số, đơn vị, trường hợp chuẩn và phân biệt hoạt ảnh với mô phỏng sóng; giữ validated |
| song-than | Sóng thần và tốc độ truyền | Tính c = √(g × h), tốc độ và quãng đường theo thời gian | Công thức dùng giả định độ sâu không đổi; không đại diện đường truyền qua địa hình đáy biển biến đổi; giữ validated |
| traidat | Trái Đất tự quay | Mô hình 3D quay theo thời gian, có đồng hồ ở nhiều múi giờ | Kiểm tra hướng texture, tốc độ mô phỏng, vòng đời tài nguyên; giữ validated |
| nuilua | Núi lửa | Chọn nhóm magma và mức khí để đưa ra xu hướng phun định tính | Không xem kết quả là dự báo; cần giữ giới hạn về nhiệt độ, tinh thể, nước và điều kiện giảm áp; giữ validated |
| bao-nhiet-doi | Bão nhiệt đới | Điều chỉnh bán cầu, nhiệt độ mặt biển, độ ẩm, đứt gió và vĩ độ | Sơ đồ giải thích điều kiện môi trường, không phải mô hình dự báo bão; giữ validated |
| lu-quet | Lũ quét | Tính lượng mưa, dòng chảy, thể tích và lưu lượng đỉnh theo phương pháp Rational | Kiểm tra miền áp dụng, đơn vị diện tích ha, điều kiện thời lượng mưa so với Tc và giả định hệ số dòng chảy; giữ validated |
| sat-lo-dat | Sạt lở đất | Tính hệ số an toàn theo mô hình mái dốc vô hạn từ thông số cơ học và áp lực nước lỗ rỗng | Kiểm tra miền áp dụng, đơn vị ứng suất, giả định mặt trượt và trường hợp ứng suất pháp hữu hiệu không dương; giữ validated |
| xam-nhap-man | Xâm nhập mặn | Chọn cửa sông hoặc tầng chứa nước và các mức điều kiện định tính | Sơ đồ thể hiện xu hướng, không tính ranh mặn thực; không diễn giải lựa chọn low/medium/high thành số đo; giữ validated |
| nuoc-bien-dang | Nước biển dâng | Điều chỉnh mực nước trong mặt cắt địa hình giả định | Không có DEM, datum, thời điểm kịch bản hoặc mô hình kết nối thủy văn; giữ validated |
| ngay-dem-dai-ngan-theo-mua | Hiện tượng ngày đêm dài ngắn theo mùa | Trang tính thời lượng chiếu sáng theo vĩ độ và xích vĩ Mặt Trời; giới hạn ở đường chân trời hình học | Chưa thẩm định khoa học, chưa kiểm thử runtime; không công bố |

## 4. Trang triển khai được liên kết vào Registry nhưng chưa thẩm định khoa học

Trang simulations/astronomy/daylight-duration/index.html có tệp main.js và stylesheet riêng. Trang tính thời lượng ngày/đêm từ vĩ độ và xích vĩ Mặt Trời; mã có khai báo giới hạn mô hình theo đường chân trời hình học, chưa hiệu chỉnh khúc xạ khí quyển và bán kính biểu kiến Mặt Trời.

Trang đã được liên kết với Model ID `ngay-dem-dai-ngan-theo-mua`. Trạng thái khoa học vẫn là `not-reviewed`; trạng thái triển khai là `sciaverse-pilot-in-progress`. Không đưa trang vào danh mục công bố và không tự chuyển sang `validated` hoặc `verified-in-build`.

## 5. Bảng phân loại lỗi P0–P4

| Mức | Phát hiện | Phạm vi | Xử lý / trạng thái |
|---|---|---|---|
| P0 | Chưa xác nhận có sự cố khiến toàn hệ thống không truy cập được | Chưa có lỗi P0 được chứng minh | Không gán P0 khi chưa có kiểm thử runtime |
| P1 | Bộ lọc cũ ở space.js và field.js chỉ kiểm tra validated và implementationPath, chưa kiểm tra verified-in-build | Danh mục mô hình trong không gian và trang lĩnh vực | Đã sửa: bắt buộc đồng thời validated và verified-in-build |
| P2 | index.html từng tham chiếu earth-rotation.js đã bị xóa sau khi chuyển mô hình sang trang riêng | Dashboard | Đã sửa: bỏ script và canvas cũ; khôi phục sơ đồ quỹ đạo SVG tĩnh bằng các lớp CSS sẵn có |
| P2 | Trang simulations/astronomy/daylight-duration/index.html từng chưa có liên kết trong Registry | Registry và simulations/astronomy/daylight-duration/ | Đã sửa: liên kết với bản ghi ngay-dem-dai-ngan-theo-mua; giữ not-reviewed và sciaverse-pilot-in-progress |
| P2 | Ba không gian virtual-laboratories, scientific-data và learning-library đang bị làm rỗng nội dung trong space.js | Các trang không gian chức năng | Ghi nhận trạng thái chưa triển khai; không trình bày như chức năng đã hoàn thiện |
| P2 | Tài liệu EDUVERSE-MIGRATION-QUEUE.md từng ghi 6 mô hình in-review và 17 pilot, không khớp Registry | Hồ sơ kiểm kê | Đã sửa: 12 mô hình in-review và 24 pilot độc lập |
| P2 | 14/24 stylesheet chưa tìm thấy khai báo focus-visible rõ ràng; 16/24 chưa tìm thấy prefers-reduced-motion trong stylesheet đang áp dụng | Các trang mô hình | Kiểm tra bàn phím và reduced motion trên trình duyệt; bổ sung quy tắc nếu xác nhận thiếu |
| P2 | Phụ thuộc Three.js và OrbitControls qua CDN ngoài | Các mô hình 3D dùng three-loader.js | Kiểm tra hành vi khi CDN lỗi hoặc bị chặn; xác định phương án cung cấp thư viện phù hợp |
| P3 | Vòng tuần hoàn nước chưa có tự động diễn tiến dù tên mô hình ghi tự động | water-cycle | Bổ sung bộ thời gian và điều khiển chỉ sau khi đặc tả cơ chế khoa học |
| P3 | Trái Đất chuyển động quanh Mặt Trời mới có bốn mốc mùa, chưa có thời gian quỹ đạo liên tục | earth-revolution | Bổ sung điều khiển thời gian nếu phạm vi mô hình yêu cầu |
| P3 | Chưa có cơ chế hai mức kiến thức cơ bản và nâng cao được xác nhận | 25 trang pilot và Registry | Đặc tả cấu trúc hai mức dùng chung lõi mô phỏng |
| P4 | Chưa phân loại được các chi tiết thẩm mỹ cần sửa do chưa có ảnh chụp và kiểm tra trực tiếp ở các kích thước mục tiêu | 25 trang pilot | Chỉ đánh giá sau vòng kiểm thử giao diện thực tế |

## 6. Danh sách theo hướng xử lý

### Bảo toàn

Giữ nguyên trạng thái khoa học validated của 12 mô hình đã được xác nhận. Không sửa công thức, nội dung khoa học hoặc thay đổi trạng thái nghiệm thu trong bước kiểm kê này. Mọi thay đổi có ảnh hưởng đến kết quả phải qua kiểm tra khoa học lại.

### Cần sửa hoặc xác minh trước khi công bố

- Điều kiện hiển thị mô hình phải kiểm tra cả trạng thái khoa học và trạng thái kỹ thuật.
- Tham chiếu earth-rotation.js phải được xử lý.
- Mô hình daylight-duration đã được liên kết với bản ghi Registry hiện có; vẫn chờ rà soát khoa học và kiểm thử kỹ thuật.
- Hồ sơ migration queue cần thống nhất số liệu.
- Cần kiểm thử bàn phím, reduced motion, WebGL, tài nguyên ngoài và responsive.

### Cần phát triển theo lộ trình

- Tự động diễn tiến cho các mô hình quá trình có yêu cầu.
- Điều khiển thời gian cho mô hình quỹ đạo nếu được duyệt trong đặc tả.
- Hai mức kiến thức cơ bản và nâng cao.
- Phân biệt rõ mô hình định lượng với mô hình khái niệm trong giao diện và hồ sơ.

## 7. Giới hạn của đợt kiểm tra

Đợt này là kiểm tra mã nguồn và cấu trúc repository. Không chạy mô hình trong trình duyệt, không đo hiệu năng, không kiểm tra trực tiếp WebGL, không mô phỏng thao tác cảm ứng và không xác nhận bố cục tại 320, 360, 390 hoặc 430 CSS px.

Do đó:
- Không kết luận mô hình đạt kiểm thử kỹ thuật.
- Không gán verified-in-build.
- Không tự đổi validated, in-review hoặc not-reviewed.
- Không xem các cảnh 3D, sơ đồ hoặc thông số minh họa là dữ liệu quan trắc.
- Không sửa nội dung khoa học đã nghiệm thu.

## 8. Kết luận bước 4

Đã hoàn thành rà soát mã nguồn 24 mô hình có đường dẫn trong Registry, kiểm tra CSS responsive và khả năng tiếp cận ở mức tĩnh, đối chiếu thêm trang triển khai chưa đăng ký, và phân loại các vấn đề P0–P4.

Chưa đủ điều kiện đóng Giai đoạn 0. Cần hoàn tất bước 5: lập bản đồ file và thành phần phụ thuộc, xác định phạm vi sửa cho từng nhóm nhiệm vụ. Các vấn đề P1/P2 cần được đưa vào kế hoạch xử lý trước khi bắt đầu triển khai diện rộng.

## 9. Theo dõi chỉnh sửa sau bước 4

Ngày cập nhật: 27/11/2026

Các vấn đề sau đã được xử lý trên nhánh main:

| Phát hiện ở bước 4 | Điều chỉnh | Trạng thái |
|---|---|---|
| Bộ lọc field.js và space.js chỉ kiểm tra nghiệm thu khoa học | Bắt buộc đồng thời scientificStatus = validated và implementationStatus = verified-in-build | Đã sửa |
| index.html gọi earth-rotation.js đã bị xóa sau khi chuyển mô hình sang trang riêng | Bỏ script legacy và vùng canvas không còn mã vận hành; dùng lại sơ đồ quỹ đạo SVG tĩnh đã có hệ CSS | Đã sửa ở mức mã nguồn |
| README mô tả hàng đợi là 12 pilot | Đồng bộ thành 24 pilot độc lập | Đã sửa |
| Hàng đợi ghi 6 mô hình in-review và 17 pilot | Đồng bộ thành 12 in-review và 24 pilot | Đã sửa |
| Trang daylight-duration chưa được liên kết vào Registry | Gắn đường dẫn với bản ghi `ngay-dem-dai-ngan-theo-mua`, giữ trạng thái khoa học `not-reviewed` và triển khai `sciaverse-pilot-in-progress` | Đã sửa |

Các nội dung chưa được giải quyết trong đợt này:

- Trang daylight-duration đã được liên kết vào Registry với trạng thái not-reviewed và sciaverse-pilot-in-progress; không được công bố trước khi hoàn tất thẩm định và kiểm thử.
- Ba không gian phòng thí nghiệm ảo, dữ liệu khoa học và thư viện học liệu chưa có chức năng nội dung. README đã được làm rõ đây là các khu vực mới có định nghĩa nền và tuyến trang. Trang không gian không còn hiển thị tiêu đề danh sách mô hình sai ngữ cảnh cho ba khu vực này; chưa coi chúng là hoàn thiện.
- Chưa có kiểm thử runtime, kiểm tra WebGL trên trình duyệt hoặc xác minh responsive trên thiết bị.
- Chưa bổ sung cơ chế diễn tiến tự động cho các mô hình quá trình, chưa triển khai hai mức kiến thức cơ bản và nâng cao.
- Chưa chuyển mô hình nào sang verified-in-build. Điều kiện hiển thị mới sẽ khiến danh mục mô phỏng và trang lĩnh vực không công bố các pilot chưa qua kiểm thử kỹ thuật.

Các thay đổi trên có cập nhật Registry để liên kết trang daylight-duration với bản ghi đã tồn tại. Không thay đổi trạng thái nghiệm thu khoa học; không thay đổi mã nguồn của 24 mô hình thuộc hàng đợi migration.

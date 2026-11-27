# BÁO CÁO KẾ HOẠCH

# TÁI CẤU TRÚC VÀ NÂNG CẤP HỆ SINH THÁI SCIAVERSE

**Định hướng:** Xây dựng hệ sinh thái mô phỏng khoa học có tính tự động,
tương tác chuyên sâu, chính xác về khoa học và có bản sắc thiết kế
riêng.

**Phạm vi:** Dashboard, không gian ngành khoa học, mô hình mô phỏng,
phòng thí nghiệm ảo, dữ liệu khoa học và thư viện học tập.

**Môi trường triển khai:** GitHub repository
`HistoryandGeegraphyEducation/SCIAVERSE`, nhánh `main`.

------------------------------------------------------------------------

# I. BỐI CẢNH VÀ SỰ CẦN THIẾT

SCIAVERSE được định hướng là hệ sinh thái mô phỏng và khám phá khoa học
đa lĩnh vực. Hệ thống cần hỗ trợ quan sát, thử nghiệm, thay đổi điều
kiện, phân tích và tìm hiểu các hiện tượng khoa học.

Qua quá trình phát triển và rà soát, các vấn đề cần giải quyết gồm:

1.  Một số mô hình thiên về hiển thị tĩnh, chưa có cơ chế tự động diễn
    tiến hoặc chưa thể hiện đầy đủ quá trình khoa học.
2.  Một số mô hình mới ở mức trực quan cơ bản, thiếu biến số, tham số,
    khả năng thử nghiệm và nội dung nâng cao.
3.  Giao diện các mô hình tương đồng, chưa thể hiện rõ đặc trưng của
    từng đối tượng nghiên cứu.
4.  Vẫn còn hướng dẫn nhỏ, chú thích thao tác và nội dung phụ không cần
    thiết.
5.  Dashboard, không gian ngành và các khu vực chức năng chưa có bản sắc
    thiết kế rõ ràng.
6.  Một số khu vực cần được kiểm tra về mức độ hoàn thiện, dữ liệu và
    điều hướng.
7.  Trạng thái triển khai, kiểm thử kỹ thuật và nghiệm thu khoa học cần
    được quản lý tách biệt.

Các vấn đề này liên quan đồng thời đến kiến trúc phần mềm, chất lượng mô
phỏng, thiết kế trải nghiệm và quản lý nội dung khoa học. Vì vậy, cần
một kế hoạch nâng cấp thống nhất thay vì sửa riêng lẻ từng giao diện.

# II. MỤC TIÊU DỰ ÁN

## 1. Mục tiêu tổng quát

Tái cấu trúc SCIAVERSE thành hệ sinh thái mô phỏng khoa học có kiến trúc
kỹ thuật ổn định, mô hình vận hành và tương tác phù hợp với bản chất
khoa học, giao diện chuyên biệt theo lĩnh vực và hệ thống quản lý chất
lượng rõ ràng.

## 2. Mục tiêu cụ thể

### Kỹ thuật

-   Kiểm tra và ổn định cấu trúc repository.
-   Chuẩn hóa danh mục mô hình và cơ chế định tuyến.
-   Tự động phát hiện liên kết hỏng, thiếu tệp và sai trạng thái.
-   Chuẩn hóa khởi tạo, cập nhật, tạm dừng và giải phóng mô hình.
-   Kiểm soát hiệu năng, tài nguyên và khả năng tương thích trình duyệt.
-   Thiết lập quy trình kiểm tra trước khi cập nhật nhánh chính.

### Mô phỏng khoa học

-   Bổ sung diễn tiến tự động cho mô hình có bản chất động.
-   Tăng khả năng tương tác và điều chỉnh điều kiện mô phỏng.
-   Xây dựng hai mức kiến thức cơ bản và nâng cao.
-   Thể hiện biến số, tham số, đơn vị, điều kiện biên và kết quả.
-   Phân biệt dữ liệu quan trắc, dữ liệu mẫu, dữ liệu giả lập, kết quả
    tính toán và hình ảnh minh họa.
-   Công khai giả định và giới hạn mô hình khi cần thiết.

### Thiết kế

-   Xây dựng hệ thống nhận diện giao diện thống nhất.
-   Phân hóa dashboard, không gian ngành, phòng mô phỏng và khu vực chức
    năng.
-   Thiết kế mô hình theo đặc trưng khoa học.
-   Ưu tiên điện thoại, sau đó đồng bộ với máy tính bảng và desktop.
-   Loại bỏ hướng dẫn nhỏ, gợi ý thao tác và chú thích trang trí không
    cần thiết.

### Quản lý chất lượng

-   Xây dựng tiêu chuẩn nghiệm thu kỹ thuật và kiểm tra khoa học.
-   Tách biệt trạng thái triển khai, kiểm thử và nghiệm thu.
-   Lưu hồ sơ thay đổi, kết quả kiểm tra và lịch sử phiên bản.
-   Chỉ xác nhận hoàn thành khi có bằng chứng kiểm tra tương ứng.

# III. NGUYÊN TẮC TRIỂN KHAI

1.  **Bảo toàn nội dung đã nghiệm thu:** 12 mô hình đã được xác nhận
    nghiệm thu khoa học ngày 26/11/2026 cần được bảo vệ. Nếu thay đổi
    thuật toán hoặc kết quả mô phỏng, phải kiểm tra khoa học lại.
2.  **Thiết kế theo bản chất khoa học:** Không áp dụng một kiểu giao
    diện hoặc cơ chế hoạt ảnh cho toàn bộ mô hình.
3.  **Ưu tiên chất lượng mô phỏng:** Chuyển động phải xuất phát từ cơ
    chế có ý nghĩa khoa học, không phải hoạt ảnh trang trí.
4.  **Kiểm soát phạm vi:** Đọc `CLAUDE.md` trước mỗi nhiệm vụ; đọc
    Taste, Hallmark và Unslop theo đúng thứ tự đã quy định. Kiểm tra
    file trước khi sửa và chỉ thay đổi file liên quan.
5.  **Quản lý thay đổi:** Mỗi đợt thay đổi phải có commit, phạm vi và
    kết quả kiểm tra rõ ràng.
6.  **Quy định nội dung giao diện:** Chỉ giữ tên mô hình, thành phần,
    nhãn điều khiển cần thiết, thông số, kết quả và nội dung khoa học.
    Không thêm hướng dẫn nhỏ, gợi ý thao tác, chú thích trang trí hoặc
    nội dung quảng bá. Không sử dụng dấu chấm giữa trong nội dung dự án.

# IV. PHẠM VI TRIỂN KHAI

  Thành phần              Phạm vi
  ----------------------- -----------------------------------------
  Dashboard               Tái thiết kế bố cục và điều hướng
  Science Spaces          Phân hóa giao diện theo ngành
  Virtual Laboratories    Hoàn thiện chức năng thí nghiệm ảo
  Scientific Data         Dữ liệu, biểu đồ và công cụ phân tích
  Learning Library        Tài liệu và nguồn tham khảo
  Model Registry          Chuẩn hóa dữ liệu và trạng thái mô hình
  Simulation Engine       Chuẩn hóa cơ chế vận hành
  Simulation Interfaces   Thiết kế theo đặc trưng khoa học
  Responsive System       Điện thoại, máy tính bảng, desktop
  Testing System          Kiểm tra tự động và kiểm thử thực tế

Theo đợt rà soát gần nhất, danh mục có 44 bản ghi: 12 mô hình đã nghiệm
thu khoa học, 12 mô hình đang xem xét và 20 mô hình chưa được rà soát.
Đây là đường cơ sở tham khảo, cần đối chiếu lại với registry hiện hành
trước khi phân công. Không mặc định mỗi bản ghi tương ứng với một mô
hình hoàn chỉnh.

Không thuộc phạm vi mặc định: tự ý thay đổi nội dung đã nghiệm thu; bổ
sung mô hình chỉ để làm đầy danh mục; tạo dữ liệu giả như dữ liệu thực;
xây dựng chức năng chưa xác định mục đích; sửa các khu vực không liên
quan.

# V. KẾ HOẠCH TRIỂN KHAI THEO GIAI ĐOẠN

## GIAI ĐOẠN 0. KIỂM KÊ VÀ THIẾT LẬP ĐƯỜNG CƠ SỞ

**Mục tiêu:** Xác định chính xác trạng thái SCIAVERSE trước khi thay đổi
mã nguồn.

**Vai trò:** Vibe coder và kỹ sư kỹ thuật.

### 0.1. Rà soát repository

Kiểm tra `CLAUDE.md`, `index.html`, `space.html`, `field.html`, thư mục
`simulations/`, `data/model-registry.json`, CSS và JavaScript dùng
chung, `assets/`, `docs/`, điều hướng và cơ chế tải mô hình. Đọc các
hướng dẫn kỹ thuật và skill bắt buộc trước khi triển khai.

### 0.2. Kiểm kê mô hình

Lập danh mục theo các trường: Model ID, tên mô hình, ngành khoa học,
đường dẫn triển khai, trạng thái khoa học, trạng thái kỹ thuật, khả năng
tự động, tương tác, mức kiến thức, responsive và bằng chứng kiểm thử.

### 0.3. Kiểm tra mô hình

Đánh giá 10 nhóm: tính đúng đắn khoa học; cơ chế vận hành; tự động diễn
tiến; điều chỉnh tham số; trực quan hóa; mức kiến thức; giao diện;
responsive; lỗi kỹ thuật; tình trạng kiểm thử.

### 0.4. Phân loại lỗi

  Mức   Định nghĩa                                         Cách xử lý
  ----- -------------------------------------------------- ------------------
  P0    Không thể truy cập hoặc hệ thống ngừng hoạt động   Xử lý trước
  P1    Lỗi chức năng chính hoặc sai kết quả khoa học      Xử lý ngay
  P2    Lỗi giao diện, tương tác hoặc responsive           Xử lý theo đợt
  P3    Thiếu tính năng nâng cao                           Đưa vào kế hoạch
  P4    Chi tiết thẩm mỹ và tối ưu nhỏ                     Xử lý sau

### 0.5. Sản phẩm bàn giao

-   Báo cáo kiểm kê repository.
-   Danh mục mô hình đã đối chiếu.
-   Bảng phân loại lỗi.
-   Danh sách mô hình cần bảo toàn, sửa chữa hoặc phát triển.
-   Danh sách khu vực cần thiết kế lại.
-   Bản đồ file và thành phần phụ thuộc.

**Cổng hoàn thành:** Đã xác định tình trạng các thành phần quan trọng và
phạm vi thay đổi của từng nhóm nhiệm vụ.

## GIAI ĐOẠN 1. ỔN ĐỊNH KIẾN TRÚC KỸ THUẬT

**Mục tiêu:** Khắc phục vấn đề nền tảng ảnh hưởng đến toàn hệ thống.

**Vai trò:** Vibe coder và kỹ sư phần mềm.

### 1.1. Chuẩn hóa Model Registry

`data/model-registry.json` là nguồn dữ liệu thống nhất. Rà soát ID, tên,
ngành khoa học, đường dẫn, trạng thái khoa học, trạng thái kỹ thuật,
nhóm mô phỏng, khả năng hiển thị và tài liệu kiểm tra. Mỗi mô hình phải
có ID duy nhất và đường dẫn hợp lệ.

### 1.2. Xây dựng Registry Validator

Tự động phát hiện ID trùng, thiếu trường bắt buộc, đường dẫn không tồn
tại, bản ghi thiếu tệp triển khai, tệp triển khai chưa đăng ký, trạng
thái không hợp lệ và mô hình chưa nghiệm thu nhưng xuất hiện trong danh
mục đã nghiệm thu. Công cụ phải chạy được trước khi cập nhật mã nguồn.

### 1.3. Chuẩn hóa cơ chế tải mô hình

Chuẩn hóa khởi tạo, tải tài nguyên, cập nhật trạng thái, tạm dừng, tiếp
tục, đặt lại, giải phóng tài nguyên và xử lý lỗi. Kiểm soát vòng lặp
hoạt ảnh, sự kiện và tài nguyên 3D để tránh rò rỉ bộ nhớ.

### 1.4. Sửa điều hướng và tích hợp

Kiểm tra đường dẫn dashboard đến ngành, ngành đến mô hình, quay lại
trang trước, tải trực tiếp trang mô hình, tải lại trang và liên kết giữa
registry với trang triển khai.

### 1.5. Xử lý khu vực chưa hoàn thiện

Phân loại khu vực đã có nội dung, có khung nhưng chưa triển khai, chưa
thiết kế hoặc ngoài phạm vi. Không thể hiện trang trống như chức năng
hoàn chỉnh.

### 1.6. Sản phẩm bàn giao

Registry đã kiểm tra; Registry Validator; cơ chế tải và quản lý mô hình
ổn định; lỗi P0/P1 đã xử lý; báo cáo vấn đề còn tồn tại.

**Cổng hoàn thành:** Không còn lỗi nền tảng nghiêm trọng đã xác định; mô
hình có đường dẫn và trạng thái hợp lệ.

## GIAI ĐOẠN 2. THIẾT KẾ HỆ THỐNG GIAO DIỆN SCIAVERSE

**Mục tiêu:** Xây dựng ngôn ngữ thiết kế riêng cho từng không gian và
nhóm mô hình.

**Vai trò:** Web designer phối hợp với vibe coder.

### 2.1. Dashboard

Định hướng Scientific Command Center. Thành phần gồm nhận diện
SCIAVERSE, điều hướng ngành khoa học, truy cập mô hình, phòng thí
nghiệm, dữ liệu, thư viện và thông tin hệ thống nếu có dữ liệu thực. Cần
phân cấp thị giác, tránh biến mọi nội dung thành thẻ giống nhau.

### 2.2. Science Spaces

Mỗi ngành có cách trình bày riêng:

  Ngành           Đặc trưng thị giác
  --------------- ---------------------------------------
  Thiên văn học   Không gian, thiên thể, quỹ đạo
  Địa khoa học    Địa hình, bản đồ, cấu trúc Trái Đất
  Vật lý          Lực, trường, chuyển động và đại lượng
  Hóa học         Nguyên tố, cấu trúc phân tử, phản ứng
  Sinh học        Cơ thể sống, tế bào, hệ sinh thái
  Khí tượng học   Khí quyển và trường khí tượng
  Hải dương học   Đại dương, dòng biển và sóng

Không dùng chung ảnh nền, cấu trúc thẻ hoặc cách trình bày cho mọi
ngành.

### 2.3. Simulation Interface

Bố cục có thể gồm vùng trực quan hóa, điều khiển, tham số, kết quả và
phân tích. Không bắt buộc mô hình nào cũng có đủ các vùng; chỉ giữ thành
phần cần thiết.

### 2.4. Design System

Chuẩn hóa typography, màu sắc, lưới, khoảng cách, nút điều khiển, trạng
thái tương tác, bảng thông số, biểu đồ, điều hướng và hiển thị trên màn
hình nhỏ. Design System không ép mọi mô hình dùng chung bố cục.

### 2.5. Responsive

Ưu tiên điện thoại, sau đó máy tính bảng, laptop và desktop. Trên điện
thoại, bảng điều khiển có thể chuyển thành ngăn kéo hoặc vùng thao tác
phía dưới. Mô hình 3D phải hỗ trợ cảm ứng nếu có thao tác xoay, phóng to
và thu nhỏ.

### 2.6. Sản phẩm bàn giao

Design System SCIAVERSE; thiết kế dashboard, Science Spaces và phòng mô
phỏng; trạng thái giao diện; bản responsive cho các nhóm thiết bị.

**Cổng hoàn thành:** Các khu vực có nhận diện thống nhất nhưng không còn
cảm giác dùng chung một khuôn giao diện.

## GIAI ĐOẠN 3. XÂY DỰNG CHUẨN MÔ PHỎNG KHOA HỌC

**Mục tiêu:** Xây dựng kiến trúc và tiêu chuẩn chung để nâng cấp mô
hình.

**Vai trò:** Kỹ sư mô phỏng khoa học và kỹ sư phần mềm.

### 3.1. Phân nhóm kiến trúc

  -----------------------------------------------------------------------
  Nhóm                    Đặc trưng               Ví dụ
  ----------------------- ----------------------- -----------------------
  Cấu trúc không gian     Quan sát, xoay, bóc lớp Cấu tạo Trái Đất

  Quá trình động          Diễn tiến theo thời     Vòng tuần hoàn nước
                          gian                    

  Động lực học            Lực, vận tốc, chuyển    Chuyển động kiến tạo
                          động                    

  Địa hình và bản đồ      Quan hệ không gian      Đường đồng mức

  Khí tượng và thủy văn   Trường dữ liệu, dòng    Bão nhiệt đới
                          chuyển động             

  Thiên thể               Quỹ đạo và tương tác    Hệ Mặt Trời

  Dữ liệu khoa học        Tham số và phân tích    Thời lượng chiếu sáng
  -----------------------------------------------------------------------

Một mô hình có thể kết hợp nhiều nhóm.

### 3.2. Cấu trúc mô phỏng

Mỗi mô hình phải xác định:

-   **Đối tượng:** đối tượng nghiên cứu, thành phần, phạm vi và cấu
    trúc.
-   **Động cơ:** quy luật, biến số, tham số, thuật toán, điều kiện đầu
    và điều kiện biên.
-   **Vận hành:** tự động diễn tiến, điều khiển, thay đổi tham số, tạm
    dừng, tiếp tục và đặt lại.
-   **Trực quan hóa:** 3D, 2D khoa học, bản đồ, đồ thị, cấu trúc hoặc dữ
    liệu chuyên ngành.
-   **Kết quả:** thông số, đại lượng, đồ thị, trạng thái và so sánh kịch
    bản.
-   **Tài liệu:** nguồn, giả định, giới hạn, sai số hoặc độ bất định khi
    có cơ sở.

### 3.3. Chuẩn mô hình tự động

Mô hình có tính diễn tiến cần có trạng thái ban đầu, bộ cập nhật theo
thời gian, tốc độ mô phỏng, điều khiển chạy/tạm dừng, đặt lại, điều
chỉnh điều kiện và đồng bộ trạng thái hình ảnh với dữ liệu. Mô hình
không có bản chất chuyển động liên tục phải có tương tác phù hợp, không
tạo hoạt ảnh vô nghĩa.

### 3.4. Hai mức kiến thức

**Cơ bản:** thành phần chính, hiện tượng, quy luật nền tảng, quan sát
trực quan và điều khiển cơ bản.

**Nâng cao:** biến số, tham số, quan hệ định lượng, điều kiện biên, phân
tích kết quả, so sánh kịch bản và công cụ chuyên sâu.

Hai mức dùng chung lõi mô phỏng. Chuyển mức không được làm sai lệch
trạng thái hoặc tạo dữ liệu độc lập thiếu nhất quán.

### 3.5. Phân loại dữ liệu

Phân biệt dữ liệu quan trắc, đo đạc, dữ liệu mẫu, dữ liệu giả lập, kết
quả tính toán, giá trị xấp xỉ và hình ảnh minh họa khái niệm. Không
trình bày dữ liệu giả lập như dữ liệu thực.

### 3.6. Sản phẩm bàn giao

Tài liệu kiến trúc mô phỏng; quy chuẩn vận hành và điều khiển; quy chuẩn
hai mức kiến thức; quy chuẩn dữ liệu; bộ tiêu chí đánh giá mô hình.

**Cổng hoàn thành:** Có thể dùng tiêu chuẩn để phát triển và kiểm tra mô
hình thí điểm.

## GIAI ĐOẠN 4. TRIỂN KHAI BỐN MÔ HÌNH THÍ ĐIỂM

**Mục tiêu:** Kiểm chứng kiến trúc mới trước khi áp dụng rộng rãi.

### 4.1. Cấu tạo bên trong Trái Đất

**Nhóm:** Cấu trúc không gian.

-   Mô hình 3D các lớp bên trong Trái Đất.
-   Quan sát vỏ, lớp phủ, nhân ngoài và nhân trong.
-   Xoay và thay đổi góc nhìn.
-   Bóc tách từng lớp.
-   Hiển thị độ sâu và tỷ lệ phù hợp.
-   Mức nâng cao bổ sung thông số và so sánh đặc điểm các lớp.

**Kỹ thuật:** hình học 3D, điều khiển camera, ẩn/hiện và tách lớp, đồng
bộ thông tin với đối tượng đang quan sát.

### 4.2. Vòng tuần hoàn nước

**Nhóm:** Quá trình động.

-   Bay hơi.
-   Ngưng tụ và hình thành mây.
-   Giáng thủy.
-   Dòng chảy bề mặt.
-   Thấm và dòng nước ngầm.
-   Trao đổi nước giữa các thành phần.

**Kỹ thuật:** diễn tiến theo thời gian, điều khiển tốc độ, quan sát dòng
chuyển động, điều chỉnh điều kiện đầu vào. Mức nâng cao có thể bổ sung
cân bằng nước nếu có phương trình và dữ liệu phù hợp.

### 4.3. Bão nhiệt đới

**Nhóm:** Khí tượng và thủy văn.

-   Cấu trúc bão, mắt bão và thành mắt bão.
-   Dải mây và vùng mưa.
-   Trường gió.
-   Sự biến đổi cường độ.

**Kỹ thuật:** trực quan hóa cấu trúc khí tượng, điều khiển trạng thái,
quan sát biến đổi trường dữ liệu, tham số và biểu đồ ở mức nâng cao.
Phải xác định rõ mô hình khái niệm hay định lượng; không thể hiện như dự
báo thực tế nếu không có dữ liệu và mô hình dự báo tương ứng.

### 4.4. Trái Đất chuyển động quanh Mặt Trời

**Nhóm:** Thiên thể và động lực học.

-   Quỹ đạo và vị trí theo thời gian.
-   Chuyển động quanh Mặt Trời.
-   Trục nghiêng.
-   Quan hệ giữa vị trí quỹ đạo và mùa.
-   Mức nâng cao điều chỉnh tham số quỹ đạo và phân tích hình học chiếu
    sáng.

**Kỹ thuật:** đồng bộ thời gian, điều chỉnh tốc độ, điều khiển góc nhìn
và quan sát vị trí tại các thời điểm khác nhau.

### 4.5. Quy trình phát triển từng mô hình

1.  Đọc mã nguồn và tài liệu.
2.  Xác định nội dung khoa học cần bảo toàn.
3.  Đặc tả khoa học.
4.  Đặc tả kỹ thuật.
5.  Thiết kế giao diện riêng.
6.  Triển khai động cơ mô phỏng.
7.  Tích hợp hai mức kiến thức.
8.  Kiểm thử chức năng và responsive.
9.  Kiểm tra khoa học.
10. Lập báo cáo và cập nhật trạng thái.

### 4.6. Điều kiện thông qua

Mô phỏng có ý nghĩa khoa học; điều khiển tác động đúng; hai mức kiến
thức khác biệt thực chất; giao diện có bản sắc; không có lỗi chức năng
nghiêm trọng; đã kiểm tra trên trình duyệt; có hồ sơ khoa học và kỹ
thuật.

Nếu chưa đạt, điều chỉnh kiến trúc hoặc quy chuẩn trước khi nhân rộng.

**Sản phẩm bàn giao:** Bốn mô hình thí điểm và báo cáo đánh giá kiến
trúc mới.

## GIAI ĐOẠN 5. NÂNG CẤP TOÀN BỘ DANH MỤC MÔ HÌNH

**Mục tiêu:** Chuyển đổi mô hình còn lại theo chuẩn đã kiểm chứng.

### Đợt A. Cấu trúc và không gian

Dự kiến rà soát: Cấu tạo bên trong Trái Đất, Hệ Mặt Trời, tọa độ địa lí,
phép chiếu bản đồ, bản đồ và tỷ lệ, đo khoảng cách bản đồ, địa hình và
mặt cắt địa hình.

Nội dung nâng cấp: quan sát nhiều góc, thay đổi lớp thông tin, tương tác
thành phần, hiển thị tỷ lệ và thông số, liên kết hình ảnh với dữ liệu.

### Đợt B. Quá trình và chuyển động

Dự kiến rà soát: Trái Đất tự quay, Trái Đất chuyển động quanh Mặt Trời,
chuyển động mảng kiến tạo, sóng địa chấn, phong hóa, xói mòn và bồi tụ
cùng các mô hình liên quan trong registry.

Nội dung nâng cấp: diễn tiến thời gian, điều chỉnh tốc độ, thay đổi điều
kiện, quan sát biến đổi và phân tích đại lượng.

### Đợt C. Khí tượng, thủy văn và đại dương

Dự kiến rà soát: vòng tuần hoàn nước, bão nhiệt đới, lũ quét, sóng thần,
xâm nhập mặn và nước biển dâng.

Nội dung nâng cấp: trường dữ liệu, dòng chuyển động, biến đổi theo thời
gian, quan hệ giữa yếu tố và so sánh kịch bản.

### Đợt D. Địa chất và tai biến tự nhiên

Dự kiến rà soát: động đất, núi lửa, sạt lở đất, các quá trình địa mạo và
mô hình địa chất khác trong danh mục.

Nội dung nâng cấp: cơ chế phát sinh, cấu trúc, quá trình biến đổi, quan
hệ nguyên nhân-kết quả, tham số ảnh hưởng và giới hạn dự báo.

Danh sách từng đợt phải được đối chiếu registry. Không tạo bản ghi trùng
hoặc mặc định một chủ đề đã có trang triển khai hoàn chỉnh.

### 5.1. Cơ chế chuyển đổi

Mỗi đợt chỉ triển khai các mô hình có liên quan về kiến trúc. Sau mỗi
đợt phải kiểm tra mã nguồn, chức năng, giao diện, nội dung khoa học; cập
nhật registry; ghi commit; rà soát theo Unslop. Chỉ tiếp tục khi không
còn lỗi nghiêm trọng chưa xử lý.

**Sản phẩm bàn giao:** Danh mục mô hình nâng cấp theo trạng thái thực
tế, có hồ sơ kiểm tra.

## GIAI ĐOẠN 6. HOÀN THIỆN CÁC KHÔNG GIAN KHOA HỌC

**Mục tiêu:** Hoàn thiện trải nghiệm toàn hệ sinh thái và bảo đảm mỗi
khu vực có chức năng thực tế.

### 6.1. Dashboard

Thiết kế lại cấu trúc trang chủ, phân cấp chức năng, tối ưu điều hướng,
kết nối registry, hiển thị nội dung thực và kiểm tra responsive.

### 6.2. Science Spaces

Thiết kế riêng từng ngành, phân loại mô hình theo chủ đề, liên kết các
không gian liên quan, tổ chức trang chi tiết ngành và kiểm tra đường
dẫn.

### 6.3. Virtual Laboratories

Xác định chức năng từng phòng; xây dựng cơ chế thử nghiệm; tích hợp mô
hình phù hợp; cho phép thay đổi điều kiện; hiển thị kết quả; quản lý
trạng thái thử nghiệm. Không đưa mô hình vào phòng thí nghiệm nếu chưa
có khả năng thử nghiệm tương ứng.

### 6.4. Scientific Data

Xây dựng cấu trúc dữ liệu, phân loại nguồn, tổ chức biểu đồ, hỗ trợ so
sánh, hiển thị đơn vị và phân biệt dữ liệu thực với dữ liệu giả lập.

### 6.5. Learning Library

Tổ chức tài liệu khoa học, phân loại theo ngành, liên kết tài liệu với
mô hình, quản lý nguồn và kiểm tra liên kết.

### 6.6. Sản phẩm bàn giao

Dashboard hoàn thiện; không gian ngành có giao diện riêng; phòng thí
nghiệm có chức năng; khu vực dữ liệu có nội dung thực; thư viện được tổ
chức; điều hướng đồng bộ.

## GIAI ĐOẠN 7. KIỂM THỬ, NGHIỆM THU VÀ PHÁT HÀNH

**Mục tiêu:** Xác nhận chất lượng toàn hệ thống sau nâng cấp.

### 7.1. Kiểm thử kỹ thuật

  Hạng mục      Tiêu chí
  ------------- ------------------------------------------
  JavaScript    Không có lỗi cú pháp
  Runtime       Không có lỗi nghiêm trọng khi vận hành
  Registry      Không có ID trùng và đường dẫn sai
  Điều hướng    Các đường dẫn chính hoạt động
  Tài nguyên    Không thiếu tài nguyên cần thiết
  Hoạt ảnh      Chạy, tạm dừng, tiếp tục và đặt lại đúng
  Tương tác     Điều khiển có tác dụng thực tế
  Hiệu năng     Không có tải hoặc xử lý bất thường
  Responsive    Không vỡ bố cục trên thiết bị mục tiêu
  Tương thích   Hoạt động trên trình duyệt mục tiêu

### 7.2. Kiểm thử khoa học

Kiểm tra thành phần, quy luật, quan hệ giữa biến, đơn vị, tính hợp lý
của kết quả trong phạm vi giả định, nguồn dữ liệu, giới hạn mô hình và
sự phân biệt giữa dữ liệu thực với dữ liệu giả lập.

### 7.3. Kiểm thử giao diện

Kiểm tra điện thoại, máy tính bảng, laptop và desktop. Loại bỏ tràn nội
dung, điều khiển quá nhỏ, bảng điều khiển che vùng mô phỏng, chữ khó
đọc, lỗi cảm ứng, điều hướng bị mất, biểu đồ không đầy đủ và khu vực
trống.

### 7.4. Kiểm tra nội dung

Không có hướng dẫn nhỏ, câu gợi ý thao tác, chú thích trang trí, nội
dung quảng bá, dấu chấm giữa hoặc dữ liệu giả lập trình bày như dữ liệu
thật.

### 7.5. Quy trình nghiệm thu

Mỗi mô hình có ba trạng thái độc lập:

**Triển khai:** Chưa triển khai / Đang triển khai / Đã triển khai.

**Kỹ thuật:** Chưa kiểm thử / Đang kiểm thử / Đạt kiểm thử / Không đạt
kiểm thử.

**Khoa học:** Chưa rà soát / Đang rà soát / Đã nghiệm thu / Cần kiểm tra
lại.

Không tự động chuyển trạng thái nghiệm thu khoa học khi chỉ hoàn thành
giao diện hoặc mã nguồn.

### 7.6. Phát hành

Mỗi đợt lưu danh sách file thay đổi, commit, nội dung sửa đổi, kết quả
kiểm tra, lỗi còn tồn tại và trạng thái kỹ thuật, khoa học.

**Sản phẩm bàn giao:** Báo cáo kiểm thử và nghiệm thu tổng thể, danh mục
mô hình có trạng thái chính xác và phiên bản phát hành đã kiểm tra.

# VI. TIẾN ĐỘ THỰC HIỆN DỰ KIẾN

Thời lượng dưới đây là khung lập kế hoạch sơ bộ. Tiến độ thực tế phụ
thuộc lỗi phát hiện, độ phức tạp mô hình và khả năng kiểm thử trình
duyệt.

  Giai đoạn                     Thời lượng dự kiến Kết quả
  --------------------------- -------------------- ------------------------------
  0\. Kiểm kê                            3--5 ngày Báo cáo hiện trạng
  1\. Ổn định kỹ thuật                   5--8 ngày Nền tảng ổn định
  2\. Design System                      5--8 ngày Bộ thiết kế và giao diện mẫu
  3\. Chuẩn mô phỏng                     5--7 ngày Đặc tả kỹ thuật và khoa học
  4\. Mô hình thí điểm                 10--15 ngày Bốn mô hình thí điểm
  5\. Nâng cấp danh mục                15--30 ngày Các đợt mô hình chuyển đổi
  6\. Hoàn thiện không gian             7--12 ngày Các khu vực chức năng
  7\. Kiểm thử và phát hành             5--10 ngày Báo cáo nghiệm thu

Các giai đoạn có thể chồng lấn khi công việc độc lập, nhưng không được
bỏ qua cổng kiểm tra. Tổng thời gian phải xác định lại sau Giai đoạn 0;
không cộng cơ học các khoảng thời gian thành cam kết cố định.

# VII. PHÂN CÔNG VAI TRÒ VÀ TRÁCH NHIỆM

## 1. Vibe coder

Đọc và phân tích mã nguồn; phát hiện lỗi; thiết kế phương án kỹ thuật;
triển khai tính năng; kết nối thành phần; kiểm tra cú pháp và runtime;
quản lý thay đổi; sửa lỗi; ghi commit và báo cáo.

## 2. Web designer

Xây dựng Design System; phân hóa giao diện; thiết kế bố cục và tương
tác; tối ưu responsive; rà soát tính nhất quán; loại bỏ chi tiết thừa;
kiểm tra khả năng sử dụng.

## 3. Kỹ sư mô phỏng và khoa học

Xác định bản chất hiện tượng; xây dựng đặc tả; xác định biến số và tham
số; kiểm tra thuật toán; đánh giá kết quả; xác định giả định và giới
hạn; phân biệt dữ liệu thực với dữ liệu giả lập; kiểm tra nội dung khoa
học.

## 4. Người quyết định và nghiệm thu

Xác định phạm vi ưu tiên; bảo vệ nội dung đã nghiệm thu; đánh giá thay
đổi ảnh hưởng khoa học; xác nhận nghiệm thu; quyết định phát hành khi đủ
điều kiện.

# VIII. TIÊU CHÍ ĐÁNH GIÁ CHẤT LƯỢNG

Đề xuất thang điểm 100 cho từng mô hình:

  Nhóm tiêu chí                      Trọng số
  -------------------------------- ----------
  Tính đúng đắn khoa học                   25
  Động cơ và cơ chế mô phỏng               20
  Khả năng tương tác                       10
  Nội dung cơ bản và nâng cao              10
  Thiết kế và trực quan hóa                15
  Responsive và khả năng sử dụng           10
  Ổn định kỹ thuật                         10
  **Tổng**                            **100**

Thang điểm đánh giá chất lượng triển khai, không thay thế quyết định
nghiệm thu khoa học.

Điều kiện bắt buộc: - Không có lỗi khoa học nghiêm trọng. - Không có lỗi
chức năng P0/P1 chưa xử lý. - Thông số và dữ liệu có căn cứ. - Mô hình
động có cơ chế diễn tiến phù hợp. - Mô hình cấu trúc hoặc dữ liệu có
tương tác phù hợp. - Có kiểm tra thực tế trên trình duyệt.

Mô hình đạt điểm cao nhưng sai khoa học vẫn không được nghiệm thu.

# IX. QUẢN LÝ RỦI RO

  -----------------------------------------------------------------------
  Rủi ro                  Tác động                Biện pháp
  ----------------------- ----------------------- -----------------------
  Sửa nhiều file cùng lúc Khó tìm nguyên nhân lỗi Chia phạm vi theo nhiệm
                                                  vụ

  Dùng chung mẫu mô phỏng Mất đặc trưng khoa học  Phân nhóm kiến trúc

  Hoạt ảnh không có cơ sở Sai bản chất mô hình    Kiểm tra thuật toán

  Dữ liệu giả bị hiểu là  Sai lệch nhận thức      Ghi rõ nguồn gốc
  dữ liệu thực                                    

  Thay đổi mô hình đã     Mất tính nhất quán      Bảo toàn và kiểm tra
  nghiệm thu                                      lại

  Giao diện quá nặng      Giảm hiệu năng          Kiểm soát tài nguyên

  Không kiểm tra mobile   Lỗi trải nghiệm         Ưu tiên điện thoại

  Sửa trực tiếp main      Khó phục hồi            Commit theo từng đợt
  thiếu kiểm soát                                 

  Chỉ có giao diện, không Sản phẩm chưa hoàn      Nghiệm thu chức năng
  có chức năng            chỉnh                   

  Chỉ kiểm tra cú pháp    Bỏ sót runtime          Kiểm thử trình duyệt
  -----------------------------------------------------------------------

# X. QUY TRÌNH KIỂM SOÁT THAY ĐỔI TRÊN GITHUB

## Trước khi sửa

-   Đọc `CLAUDE.md`.
-   Đọc skill theo đúng thứ tự.
-   Lấy phiên bản file hiện tại.
-   Kiểm tra nội dung và phụ thuộc.
-   Xác định phạm vi và trạng thái ban đầu.

## Trong khi sửa

-   Chỉ sửa file thuộc phạm vi.
-   Không viết lại file không liên quan.
-   Không xóa chức năng cũ khi chưa xác định tác động.
-   Không tự động thay đổi trạng thái nghiệm thu khoa học.
-   Kiểm tra sau từng nhóm thay đổi.

## Sau khi sửa

-   Kiểm tra cú pháp, liên kết và chức năng.
-   Kiểm tra responsive.
-   Rà soát theo Unslop.
-   Ghi commit.
-   Đối chiếu lại danh sách file thay đổi.

## Báo cáo kết quả

Phải phân biệt rõ: đã sửa, đã triển khai, đã kiểm tra, chưa kiểm tra,
chưa đạt và đã nghiệm thu. Không báo cáo hoàn thành chỉ dựa trên việc mã
nguồn đã được cập nhật.

# XI. SẢN PHẨM BÀN GIAO CUỐI DỰ ÁN

    STT Sản phẩm                  Kết quả cần có
  ----- ------------------------- ----------------------------
      1 Báo cáo hiện trạng        Đánh giá cấu trúc và lỗi
      2 Model Registry            Danh mục thống nhất
      3 Registry Validator        Bộ kiểm tra tự động
      4 Design System             Quy chuẩn thiết kế
      5 Dashboard                 Giao diện chính hoàn thiện
      6 Science Spaces            Các không gian ngành
      7 Simulation Architecture   Chuẩn mô phỏng
      8 Simulation Models         Các mô hình nâng cấp
      9 Knowledge Levels          Hai mức kiến thức phù hợp
     10 Virtual Laboratories      Không gian thí nghiệm
     11 Scientific Data           Khu vực dữ liệu
     12 Learning Library          Thư viện khoa học
     13 Test Reports              Báo cáo kiểm thử
     14 Scientific Review         Hồ sơ kiểm tra khoa học
     15 Release Report            Báo cáo phát hành

# XII. ĐIỀU KIỆN HOÀN THÀNH DỰ ÁN

## Nền tảng

-   Danh mục mô hình được đối chiếu.
-   Đường dẫn và định tuyến hoạt động.
-   Các khu vực chính có chức năng thực tế.
-   Không còn lỗi nền tảng nghiêm trọng đã xác định.

## Mô hình

-   Được phân loại theo đặc trưng khoa học.
-   Có cơ chế vận hành phù hợp.
-   Mô hình phù hợp có khả năng tự động diễn tiến.
-   Có hai mức kiến thức khi nội dung chuyên môn cho phép.
-   Có tương tác và kết quả có ý nghĩa.
-   Có hồ sơ khoa học và kỹ thuật.

## Giao diện

-   Dashboard có bản sắc riêng.
-   Ngành khoa học có giao diện phù hợp.
-   Mỗi mô hình có cách trực quan hóa riêng.
-   Các khu vực chức năng được phân hóa.
-   Responsive hoạt động trên thiết bị mục tiêu.
-   Không còn hướng dẫn nhỏ và nội dung phụ không cần thiết.

## Kiểm thử

-   Có kết quả kiểm thử kỹ thuật.
-   Có kiểm tra trình duyệt thực tế.
-   Có kiểm tra khoa học và responsive.
-   Có báo cáo lỗi còn tồn tại.
-   Trạng thái nghiệm thu chính xác.

# XIII. THỨ TỰ ƯU TIÊN VÀ QUYẾT ĐỊNH TRIỂN KHAI

    Ưu tiên Công việc                     Lý do
  --------- ----------------------------- ---------------------------------
          1 Kiểm kê toàn bộ SCIAVERSE     Tránh thay đổi sai phạm vi
          2 Ổn định kiến trúc kỹ thuật    Bảo đảm khả năng triển khai
          3 Xây dựng chuẩn mô phỏng       Tránh nâng cấp thiếu thống nhất
          4 Thiết kế hệ thống giao diện   Xác định bản sắc sản phẩm
          5 Triển khai mô hình thí điểm   Kiểm chứng phương án
          6 Nâng cấp danh mục             Nhân rộng có kiểm soát
          7 Hoàn thiện các không gian     Hoàn thiện hệ sinh thái
          8 Kiểm thử và nghiệm thu        Xác nhận chất lượng

Thiết kế giao diện và chuẩn mô phỏng có thể chuẩn bị song song sau khi
hoàn thành kiểm kê. Tuy nhiên, nâng cấp hàng loạt chỉ được thực hiện sau
khi nền tảng và mô hình thí điểm đạt yêu cầu.

## Quyết định đề xuất

Chọn phương án **tái cấu trúc theo từng giai đoạn, triển khai trên nền
tảng hiện tại, kiểm chứng bằng mô hình thí điểm và nhân rộng theo nhóm
khoa học**.

Không viết lại toàn bộ SCIAVERSE từ đầu. Không thay đổi đồng loạt tất cả
mô hình. Không đánh đổi tính chính xác khoa học để lấy hiệu ứng trực
quan.

**Nhiệm vụ khởi đầu:** Triển khai Giai đoạn 0, kiểm kê và đối chiếu toàn
bộ repository, registry, mô hình và trạng thái nghiệm thu. Kết quả là
căn cứ xác định phạm vi sửa chữa, thứ tự triển khai và tiến độ chi tiết
cho toàn dự án.

------------------------------------------------------------------------

**KẾT THÚC BÁO CÁO KẾ HOẠCH**
# Thẩm định nguồn gốc — Lũ quét

- Mã nguồn tham chiếu: `EDUVERSE/simulations/natural-hazards/lu-quet/main.js`
- Trạng thái: `needs-revision`
- Phạm vi: mưa, lưu vực, dòng chảy mặt, tập trung dòng, lũ dâng nhanh, ngập ven suối và phân biệt lũ nước với dòng bùn đá.
- Kết luận hiện tại: lời giải thích về mưa, dòng chảy mặt và tập trung dòng phù hợp ở mức khái quát. Tuy nhiên, lượng mưa không có thời lượng nên không thể suy ra cường độ; địa hình và mặt nước là hình học giả lập; không có cân bằng nước hoặc thủy lực. Giao diện còn hai trạng thái không nhất quán: giai đoạn đầu ẩn mưa, còn mặt nước lũ vẫn xuất hiện ở lượng mưa 0 mm. Chưa đủ điều kiện tiếp nhận.

## Căn cứ khoa học

1. U.S. Geological Survey (USGS), *Floods: Things to Know*: https://www.usgs.gov/water-science-school/science/floods-things-know
   - Hai yếu tố quan trọng của mưa gây ngập là cường độ và thời lượng.
   - Địa hình, điều kiện đất và lớp phủ cũng ảnh hưởng đến dòng chảy.
   - Bề mặt không thấm do đô thị hóa làm tăng lượng nước chảy tràn.

2. NOAA National Severe Storms Laboratory (NSSL), *Flood Forecasting*: https://www.nssl.noaa.gov/education/svrwx101/floods/forecasting/
   - Lũ quét phụ thuộc đồng thời vào điều kiện khí tượng và thủy văn của lưu vực.
   - Các yếu tố gồm tốc độ di chuyển của bão, cường độ mưa, mưa lặp lại trên cùng khu vực, tỷ lệ mưa trở thành dòng chảy mặt, độ rỗng và độ ẩm đất, thảm thực vật và bề mặt lát kín.

3. USGS, *A framework for understanding the effects of subsurface agricultural drainage on downstream flows*: https://pubs.usgs.gov/publication/sir20255023/full
   - Cường độ và thời lượng mưa, đặc tính đất, độ ẩm ban đầu, lớp phủ và độ dốc ảnh hưởng đến thấm và dòng chảy.
   - Khả năng thấm thay đổi trong suốt trận mưa; khi cường độ mưa vượt khả năng thấm, nước có thể tích tụ và tạo dòng chảy mặt.

4. USGS, Thomas C. Pierson, *Distinguishing between debris flows and floods from field evidence in small watersheds*: https://pubs.usgs.gov/fs/2004/3142/
   - Lũ nước và dòng bùn đá là các dạng dòng chảy khác nhau.
   - Dòng bùn đá là hỗn hợp nước và trầm tích có tính chất cơ học riêng; không thể dùng các phương pháp ước lượng lưu lượng của lũ nước để thay thế trực tiếp.

5. USGS, *What is a debris flow?*: https://www.usgs.gov/faqs/what-a-debris-flow
   - Dòng bùn đá là một dạng sạt lở nhanh, gồm nước, đất và đá vụn; thường phát sinh trong mưa lớn hoặc tuyết tan nhanh, có thể cuốn theo đá tảng, cây và công trình.

## Kết quả đọc mã nguồn EDUVERSE

### Đầu vào lượng mưa

- Tham số duy nhất là lượng mưa tích lũy 0–250 mm, bước 5 mm, mặc định 120 mm.
- Không có thời lượng mưa, nên không thể chuyển lượng mưa tích lũy thành cường độ mm/h.
- Cùng 120 mm có thể rơi trong 1 giờ hoặc 24 giờ; hai tình huống có thể tạo phản ứng lưu vực rất khác nhau.
- Slider chuẩn hóa lượng mưa thành (n=(P-P_{min})/(P_{max}-P_{min})), sau đó dùng n để điều khiển số hạt mưa, độ cao mặt nước và kích thước mặt ngập.
- Không có cân bằng nước: lượng mưa không được phân bổ thành thấm, trữ trong đất, dòng chảy mặt, dòng chảy ngầm hoặc thoát ra khỏi lưu vực.

### Lưu vực và địa hình

- Địa hình được tạo bằng hàm toán học trên một mặt phẳng 3D, có sườn dốc, vùng thấp và một khe suối.
- Không có diện tích lưu vực, ranh giới phân thủy, chiều dài dòng chính, độ dốc lòng dẫn hoặc thời gian tập trung.
- Độ cao không có đơn vị mét; địa hình không dựa trên DEM của một khu vực cụ thể.
- Không có loại đất, độ rỗng, độ thấm, độ bão hòa ban đầu, lớp phủ thực vật hoặc tỷ lệ bề mặt không thấm.
- Vì vậy, địa hình hiện tại chỉ là cảnh trực quan, không phải mô hình lưu vực có thông số thủy văn.

### Mưa, dòng chảy và mặt nước

- Có 90 hạt mưa hình trụ, rơi theo phương thẳng đứng với vận tốc cố định theo chỉ số hạt.
- Lượng mưa chỉ làm tăng số hạt được hiển thị; không làm thay đổi tốc độ hạt, cường độ mưa hoặc thể tích nước đi vào lưu vực.
- Dòng suối được dựng bằng một mặt phẳng nước cố định. Không có vận tốc, lưu lượng, mực nước theo thời gian hoặc dòng chảy tập trung từ sườn dốc.
- Mặt lũ là một hình chữ nhật phẳng, được nâng lên và phóng to theo n. Nó không được tính từ địa hình, lưu lượng, cao trình bờ hoặc quan hệ thủy lực.
- Mặt lũ không tuân theo địa hình; có thể nổi trên sườn hoặc phủ qua công trình mà không xét cao độ nền.
- Màu nước suối chuyển sang nâu khi n vượt ngưỡng 0,55. Đây là đổi màu theo slider, không phải kết quả tính nồng độ bùn/cát hoặc tải lượng trầm tích.

### Giai đoạn và trạng thái giao diện

- Bốn giai đoạn mô tả mưa trên lưu vực, dòng chảy tập trung, lũ dâng nhanh và nước/bùn đá tràn qua.
- Hạt mưa chỉ được bật khi `mode > 0`; do đó ở giai đoạn đầu “Mưa trên lưu vực”, mưa không xuất hiện dù phần giải thích nói đang có mưa.
- Mặt nước lũ `objects.flood` không bị ẩn ở bất kỳ giai đoạn hoặc mức lượng mưa nào. Khi slider bằng 0 mm, mặt lũ vẫn hiện ở vị trí và kích thước mặc định.
- Các giai đoạn chủ yếu thay đổi nhãn và phần giải thích; không tạo ra chuỗi quá trình thủy văn được tính toán.
- Khi chọn giai đoạn “Nước và bùn đá tràn qua”, mô hình không thêm hạt trầm tích, đá, cây hoặc vật liệu rời. Nước chỉ được thể hiện bằng mặt phẳng màu xanh.
- Nút reset đưa `mode` về 0 và lượng mưa về giá trị mặc định 120 mm; do mặt lũ vẫn hiện và mưa bị ẩn ở mode 0, trạng thái sau reset chưa nhất quán với mô tả giai đoạn.

### Lũ nước và dòng bùn đá

- Lũ quét có thể là dòng nước dâng nhanh trong khe suối hoặc lòng dẫn nhỏ; trong một số điều kiện, dòng có thể mang lượng trầm tích lớn.
- Dòng bùn đá (debris flow) là hỗn hợp nước–trầm tích có nồng độ hạt rắn đủ cao để thay đổi cơ chế dòng chảy; đây cũng là một dạng sạt lở nhanh.
- Mô hình dùng cụm “nước và bùn đá” như giai đoạn cuối nhưng không mô phỏng sự khác nhau về thành phần, mật độ, độ nhớt, tải lượng trầm tích hoặc cơ chế chuyển động.
- Không nên mặc định mọi lũ quét đều là dòng bùn đá hoặc dùng đổi màu nước để thay cho mô hình debris flow.

## Lỗi kỹ thuật và khả năng tiếp cận

1. Mặt lũ vẫn hiển thị khi lượng mưa bằng 0 mm; cần đặt trạng thái khởi tạo/hiển thị theo điều kiện mô phỏng.
2. Giai đoạn đầu mô tả mưa nhưng ẩn toàn bộ hạt mưa; cần đồng bộ trạng thái trực quan với giai đoạn.
3. Vòng lặp animation tiếp tục render khi `playing=false`; nút tạm dừng không dừng vòng lặp dựng hình.
4. Không có xử lý `prefers-reduced-motion`; mô hình tự chạy khi khởi tạo.
5. Không tạm dừng khi trang ở nền; có thể tiêu tốn tài nguyên khi người dùng chuyển tab.
6. Mặt nước lũ và dòng suối dùng đơn vị cảnh không quy đổi sang mét; không được hiển thị độ cao/ngập như số đo thực.
7. Các giai đoạn và lượng mưa có thể kết hợp tùy ý, kể cả “nước và bùn đá tràn qua” với 0 mm mưa; cần ràng buộc trạng thái hoặc ghi rõ các lựa chọn là kịch bản giả định.
8. Phần xử lý WebGL, ResizeObserver, OrbitControls và cleanup cần được kiểm thử trên thiết bị thật; nhánh lỗi khởi tạo hiện chỉ dispose renderer, chưa chắc đã giải phóng toàn bộ tài nguyên đã tạo một phần.

## Điều chỉnh bắt buộc trước khi tiếp nhận

1. Gắn thời lượng cho lượng mưa; phân biệt mm tích lũy và mm/h. Nếu chỉ giữ lượng mưa tích lũy, không dùng nó để suy ra cường độ.
2. Bổ sung hoặc công bố rõ các đặc điểm lưu vực: diện tích, độ dốc, chiều dài dòng, loại đất, độ thấm, độ bão hòa ban đầu, lớp phủ và bề mặt không thấm.
3. Dùng cân bằng nước hoặc mô hình mưa–dòng chảy giản lược có công thức và đơn vị. Tối thiểu cần phân biệt lượng mưa, tổn thất do thấm/trữ và lượng nước trở thành dòng chảy.
4. Nếu không tính thủy lực, ghi rõ mực nước và vùng ngập là hình minh họa, không phải kết quả dự báo.
5. Đồng bộ giai đoạn đầu với hạt mưa; không hiển thị mặt lũ khi chưa có điều kiện tạo lũ hoặc khi lượng mưa bằng 0, trừ khi đó là dòng nền được giải thích riêng.
6. Nếu giữ dòng suối, thể hiện hướng dòng chảy và phân biệt dòng nền với dòng lũ; không chỉ đổi màu theo ngưỡng lượng mưa.
7. Phân biệt lũ nước, dòng chảy nhiều bùn/cát và debris flow. Nếu muốn mô phỏng debris flow, cần tham số nồng độ trầm tích, kích thước hạt, mật độ và cơ chế dòng vật liệu; nếu không, bỏ cụm “bùn đá” khỏi tên giai đoạn.
8. Dùng địa hình giả định có nhãn; không trình bày mặt lũ như vùng ngập của địa phương. Nếu dùng DEM thật, phải ghi nguồn, độ phân giải, hệ cao độ và phạm vi.
9. Chuẩn hóa quan hệ giữa các giai đoạn, lượng mưa, thời gian và trạng thái animation; reset phải đưa mô hình về trạng thái không có lũ hoặc một trạng thái ban đầu được mô tả rõ.
10. Hỗ trợ reduced motion, dừng render khi tạm dừng hoặc tab nền; kiểm tra cleanup WebGL trong cả nhánh lỗi.
11. Giữ chú thích không dùng để dự báo ngưỡng lũ tại địa phương.

## Ma trận kiểm thử bắt buộc

| Ca kiểm thử | Kết quả mong đợi |
|---|---|
| Lượng mưa 0 mm | Không hiển thị lũ nếu không có dòng nền được khai báo |
| Giai đoạn mưa trên lưu vực | Có hạt mưa và trạng thái đúng với mô tả |
| Lượng mưa tích lũy | Có thời lượng hoặc được ghi rõ là không suy ra cường độ |
| Cường độ mưa | Đơn vị mm/h và thời gian đo rõ ràng |
| Độ ẩm đất thấp/cao | Phản ứng thấm và dòng chảy khác nhau nếu mô hình có các biến này |
| Thay đổi độ dốc/lưu vực | Dòng chảy tập trung và thời gian phản ứng thay đổi theo công thức công bố |
| Mặt lũ | Tuân theo địa hình/cao trình nếu được gọi là vùng ngập; nếu không phải ghi minh họa |
| Giai đoạn bùn đá | Có phân biệt vật liệu và cơ chế với lũ nước, hoặc không dùng nhãn debris flow |
| Reset | Trở về trạng thái ban đầu nhất quán |
| Tạm dừng/reduced motion | Không tiếp tục render animation không cần thiết |
| Điện thoại 320–430 CSS px | Canvas, nhãn và điều khiển không tràn hoặc che nhau |

## Kết luận thẩm định

Mô hình có thể dùng làm sơ đồ nhập môn về mưa trên lưu vực dốc và dòng chảy tập trung. Nhưng lượng mưa tích lũy không có thời lượng, địa hình không có tỉ lệ, không có đặc điểm thấm/trữ của lưu vực và mặt nước không được tính từ cân bằng nước hoặc thủy lực.

Hai lỗi giao diện cần sửa ngay là hạt mưa bị ẩn ở giai đoạn mưa và mặt lũ vẫn xuất hiện khi lượng mưa bằng 0. Cụm “bùn đá” cần được tách khỏi lũ nước nếu không có mô hình vật liệu trầm tích.

Có thể giữ cấu trúc bài học và cảnh 3D; phần lượng mưa–dòng chảy–ngập cần được xây dựng lại hoặc giới hạn rõ là hoạt ảnh minh họa. Chỉ chuyển trạng thái sang `validated` sau khi xử lý các điểm chặn và kiểm thử thực tế.

## Nguồn tham khảo

- U.S. Geological Survey. *Floods: Things to Know*. https://www.usgs.gov/water-science-school/science/floods-things-know
- NOAA National Severe Storms Laboratory. *Flood Forecasting*. https://www.nssl.noaa.gov/education/svrwx101/floods/forecasting/
- U.S. Geological Survey. *A framework for understanding the effects of subsurface agricultural drainage on downstream flows*. https://pubs.usgs.gov/publication/sir20255023/full
- U.S. Geological Survey. Thomas C. Pierson. *Distinguishing between debris flows and floods from field evidence in small watersheds*. https://pubs.usgs.gov/fs/2004/3142/
- U.S. Geological Survey. *What is a debris flow?* https://www.usgs.gov/faqs/what-a-debris-flow


## Pilot SCIAVERSE — 26/11/2026

Đã dựng mô-đun độc lập tại `simulations/hydrology/flash-flood/`.

- Bổ sung cường độ mưa (i) (mm/h) và thời lượng (t) (h), tính tổng lượng mưa (P=it) (mm).
- Dùng hệ số dòng chảy (C) do người học nhập để ước tính lớp nước chảy tràn (R=CP).
- Tính thể tích (V=RA\times10) (m³), với (R) tính bằng mm và diện tích lưu vực (A) tính bằng ha.
- Bổ sung lưu lượng đỉnh theo phương pháp Rational: (Q_p=0.00278CiA) (m³/s), với (i) là mm/h và (A) là ha. Chỉ tính khi thời lượng mưa không ngắn hơn thời gian tập trung (T_c).
- Diện tích được giới hạn dưới 80 ha theo phạm vi áp dụng nhỏ-lưu-vực trong hướng dẫn FHWA. Cường độ mưa giả định đồng đều trên lưu vực và trong khoảng thời gian tương ứng với (T_c).
- C và (T_c) do người học nhập; mô hình không tự suy ra chúng từ loại phủ bề mặt, độ dốc hoặc chiều dài dòng chảy.
- Không tính lưu trữ, thủy lực lòng dẫn, thủy đồ, ngập lụt hoặc dự báo lũ quét.

Kiểm tra đổi đơn vị và công thức đã đạt bước tĩnh. Chưa kiểm thử runtime trên thiết bị. Cần kiểm tra điều kiện thời lượng mưa/Tc, các giá trị biên và cách diễn giải Qp trước khi nghiệm thu.

Nguồn bổ sung: Federal Highway Administration. *HEC-22 Urban Drainage Design Manual*, 4th edition (2024), mục 4.2.2 Rational Method. https://www.fhwa.dot.gov/engineering/hydraulics/pubs/hif24006.pdf


## Cập nhật triển khai SCIAVERSE — 28/11/2026

- Đường dẫn: `simulations/hydrology/flash-flood/index.html`.
- Khoa học: `validated` (giữ nguyên). Triển khai: `verified-in-build`.
- Đầu vào phân biệt cường độ mưa (i(T_c)), thời lượng mưa, diện tích lưu vực (A), hệ số dòng chảy (C) và thời gian tập trung (T_c). Lưu lượng đỉnh chỉ tính khi (A<80\ ha) và thời lượng mưa không ngắn hơn (T_c):
  [
  Q_p=0,00278\,C\,i(T_c)\,A
  ]
  với (i) tính bằng mm/h, (A) bằng ha và (Q_p) bằng m³/s. Miền diện tích điều khiển giới hạn 1–79 ha.
- Thể tích chảy tràn dùng (V=C\,P\,A\times10), với (P) là lượng mưa tích lũy mm. Đây là ước tính giản lược, giả định (C) không đổi trong sự kiện; không phải thủy đồ hay mô hình thủy lực.
- (i(T_c)) do người học nhập; không truy xuất đường cong IDF, chu kỳ lặp hoặc số liệu mưa trạm. Không dùng kết quả để cảnh báo lũ.
- Playwright kiểm tra thời lượng ngắn hơn (T_c), trường hợp bằng (T_c), giới hạn diện tích và công thức.
- Nguồn: FHWA, *Hydraulic Design Series 4 — Introduction to Highway Hydraulics*, mục 2.5 Rational Method, https://www.fhwa.dot.gov/engineering/hydraulics/pubs/08090/hds4_608.pdf; USGS, *Floods: Things to Know*, https://www.usgs.gov/water-science-school/science/floods-things-know; NOAA/NSSL, *Flood Forecasting*, https://www.nssl.noaa.gov/education/svrwx101/floods/forecasting/.
- CI run `46118669438`, kết quả `success`. Chưa kiểm thử trên thiết bị vật lý.

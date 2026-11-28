# Thẩm định nguồn gốc — Nước biển dâng

- Mã nguồn tham chiếu: `EDUVERSE/simulations/natural-hazards/nuoc-bien-dang/main.js`
- Trạng thái: `needs-revision`
- Phạm vi: mực nước biển trung bình, mực nước biển tương đối, cao độ địa hình, đường bờ, ngập ven biển, kết nối thủy văn và các yếu tố địa phương.
- Kết luận hiện tại: mô hình minh họa được ý tưởng mực nước biển tăng và vùng đất thấp có nguy cơ bị ngập. Tuy nhiên, địa hình là hàm giả lập; mực nước và đường bờ được điều khiển bằng tọa độ cảnh, không theo DEM hoặc datum; công trình chỉ đổi màu, không có vùng ngập tính toán. Slider 0–2 m không gắn với thời gian hoặc kịch bản. Chưa đủ điều kiện tiếp nhận như mô hình ngập ven biển định lượng.

## Căn cứ khoa học

1. NOAA, *Sea Level Rise and Coastal Flooding Impacts*: https://coast.noaa.gov/slr/
   - Công cụ NOAA sử dụng mực nước tham chiếu theo datum thủy triều địa phương, chẳng hạn Mean Higher High Water (MHHW).
   - Các vùng được thể hiện là ngập phải xét kết nối thủy văn với biển; vùng thấp nhưng không kết nối được phân biệt riêng.
   - Công cụ có giới hạn về dữ liệu cao độ, thủy triều và đặc điểm thủy lực cục bộ; các bản đồ là công cụ sàng lọc, không thay thế khảo sát chi tiết.
   - NOAA nêu rõ các bản đồ sơ bộ không tính xói lở, sụt lún và công trình xây dựng trong tương lai.

2. NOAA, *Sea Level Trends and Extremes*: https://www.tidesandcurrents.noaa.gov/trends-and-extremes/main-product.html
   - Mực nước biển tương đối là thay đổi mực nước so với đất liền tại vị trí quan trắc.
   - Xu thế địa phương chịu ảnh hưởng của biến đổi mực nước biển và chuyển động thẳng đứng của đất, bao gồm sụt lún hoặc nâng đất.
   - Số liệu trạm triều cần được xem xét cùng khoảng thời gian quan trắc và datum sử dụng.

3. NOAA, *2022 Sea Level Rise Technical Report — Application Guide*: https://cdn.oceanservice.noaa.gov/oceanserviceprod/hazards/sealevelrise/noaa-nos-techrpt02-global-regional-SLR-scenarios-US-application-guide.pdf
   - Khi áp dụng kịch bản mực nước biển vào cao độ đất, mốc cơ sở và thời điểm giữa kỳ datum thủy triều phải được căn chỉnh.
   - Cao độ địa hình thường dùng hệ datum trắc địa/orthometric; mực nước thường tham chiếu datum thủy triều địa phương. Cần chuyển đổi trước khi so sánh.
   - Mực nước biển trung bình và các datum thủy triều được xác định từ chuỗi quan trắc theo những quy ước thời gian cụ thể.

4. NOAA, *Limitations of Sea Level Rise Maps*: https://repository.library.noaa.gov/view/noaa/39930/noaa_39930_DS1.pdf
   - Các phương pháp dạng “bathtub” có thể bỏ qua xói lở bờ biển, nước dâng do sóng, nước dâng do bão và các đợt triều cực trị.
   - Bản đồ chỉ thể hiện phần mực nước tăng theo giả định; không tự động mô phỏng đầy đủ các quá trình động lực bờ biển.

5. NOAA National Geodetic Survey, *Vertical Datums Transformation FAQs*: https://www.geodesy.noaa.gov/docs/faqs.html
   - Datum thủy triều thay đổi theo vị trí và điều kiện địa phương như bathymetry, bãi triều, cửa sông, đảo chắn và công trình ven biển.
   - Không thể tùy ý so sánh cao độ đất và mực nước nếu chưa đưa chúng về một hệ cao độ tương thích.

6. NOAA, *Sea Level Calculator*: https://coast.noaa.gov/sealevelcalculator/
   - Kịch bản mực nước biển cần có phạm vi không gian, thời điểm nền và khoảng thời gian dự báo.
   - Số liệu trạm triều có thể không phản ánh đầy đủ các nguồn ngập khác như mưa địa phương, nước ngầm hoặc nước dâng do bão.

## Kết quả đọc mã nguồn EDUVERSE

### Đầu vào mực nước

- Slider “Mực nước biển dâng” có miền 0–2 m, bước 0,1 m, mặc định 0,8 m.
- Giá trị đầu vào được chuyển thành tọa độ cảnh bằng `rise = value × 0.85`. Không có định nghĩa rằng một đơn vị cảnh tương ứng bao nhiêu mét; hệ số 0,85 là hệ số hình ảnh.
- Không có thời điểm nền, năm đích hoặc tốc độ tăng theo thời gian. Giá trị 2 m vì vậy chỉ là một kịch bản “what-if” của giao diện, không phải dự báo cho một mốc năm cụ thể.
- Mô hình không phân biệt mực nước biển trung bình toàn cầu với mực nước biển tương đối tại địa phương.

### Địa hình và đường bờ

- Địa hình được dựng bằng hàm toán học (h(x,z)=0,1+\max(0,x+7)\times0,17+0,22\sin(0,6z)).
- Không có DEM, LiDAR, bathymetry, cao độ địa hình có đơn vị hoặc hệ datum.
- Vị trí đường bờ được đặt trực tiếp bằng `shore.position.x = -1 + value × 3.8`. Đây là phép dịch chuyển tuyến tính theo slider, không phải giao tuyến giữa mặt nước và địa hình.
- Mặt nước là một mặt phẳng hình chữ nhật có kích thước cố định; khi mực nước tăng, mặt phẳng được nâng lên nhưng không tính kết nối qua cửa sông, kênh, cống, đê hoặc địa hình chắn.
- Địa hình không có xói lở, bồi tụ, di chuyển bãi cát, xói chân bờ hoặc thay đổi hình thái ven biển.

### Công trình và vùng ngập

- Các công trình được đặt trên địa hình giả lập; mỗi nhà lưu giá trị `groundY`.
- Khi `groundY < rise`, vật liệu thân nhà đổi màu. Công trình không bị ngập theo chiều sâu, không có nước tràn qua cửa, không có độ sâu ngập hoặc thời gian ngập.
- Cây cối và các vật thể khác không có trạng thái ngập tương ứng.
- Không có polygon vùng ngập được tính từ cao độ; không có phân biệt vùng thấp nhưng bị địa hình/công trình ngăn cách với biển.
- Mặt nước không được tính theo độ sâu hoặc vận tốc dòng; đây là hiệu ứng nâng mực nước.

### Giai đoạn và hiện tượng liên quan

- Các giai đoạn mô tả mực nước nền, mực nước tăng, vùng trũng bị ngập và đường bờ dịch chuyển.
- Nút giai đoạn chỉ thay đổi nội dung giải thích; không thay đổi mực nước hoặc hình học. Mọi biến đổi thực tế đều do slider.
- Mô hình có dao động nhỏ của mặt nước theo thời gian để tạo chuyển động; đây không phải mô hình thủy triều hoặc sóng.
- Chú thích đã phân biệt nước biển dâng dài hạn với triều, nước dâng do bão và sóng thần. Đây là giới hạn đúng cần giữ.
- Không có tham số sụt lún/nâng đất. Vì vậy, mô hình chưa thể mô tả mực nước biển tương đối, vốn có thể tăng nhanh hơn hoặc chậm hơn mực nước biển toàn cầu do chuyển động đất địa phương.
- Không có kịch bản nhiệt giãn nở đại dương, tan băng, biến đổi lưu trữ nước trên đất liền hoặc các nguồn đóng góp vào mực nước biển; mô hình chỉ hiển thị kết quả giả định của một mức tăng đầu vào.

## Lỗi kỹ thuật và khả năng tiếp cận

1. Đường bờ dịch chuyển theo công thức tuyến tính độc lập với địa hình; không có phép tìm giao điểm mặt nước–đất.
2. Nhà chỉ đổi màu khi cao độ giả lập thấp hơn `rise`; không có vùng ngập hoặc độ sâu ngập thực.
3. Các nút giai đoạn không thay đổi mô hình; nội dung và trạng thái hình ảnh phụ thuộc không nhất quán vào nút giai đoạn và slider.
4. Vòng lặp animation tiếp tục render khi `playing=false`; tạm dừng không dừng vòng lặp dựng hình.
5. Không có xử lý `prefers-reduced-motion`; mô hình tự chạy khi khởi tạo.
6. Không tạm dừng khi tab ở nền.
7. Không có hệ cao độ hoặc datum để so sánh mực nước và địa hình.
8. Hàm `destroy()` cần được kiểm tra về listener trên nút/slider và DOM còn tồn tại sau khi module bị hủy; nhánh lỗi khởi tạo cần giải phóng tài nguyên được tạo dở dang.
9. Địa hình và nhà cửa được tạo bằng hình học tổng hợp, không có nguồn dữ liệu địa lí hoặc ghi chú độ chính xác.

## Điều chỉnh bắt buộc trước khi tiếp nhận

1. Giữ slider 0–2 m như kịch bản giả định, không gắn với dự báo hoặc năm cụ thể nếu chưa có kịch bản nguồn và thời gian nền.
2. Phân biệt rõ mực nước biển trung bình toàn cầu và mực nước biển tương đối tại địa phương; nếu muốn mô phỏng ven biển cụ thể, cần tính đến chuyển động thẳng đứng của đất.
3. Khai báo datum mực nước và hệ cao độ địa hình tương thích; không cộng trực tiếp mét vào tọa độ cảnh không có tỉ lệ.
4. Thay địa hình tổng hợp bằng DEM có nguồn, độ phân giải, ngày dữ liệu và datum; nếu chưa có dữ liệu thật, ghi rõ “địa hình minh họa”.
5. Tính đường bờ từ giao tuyến giữa địa hình và mực nước thay vì dịch chuyển marker theo công thức tuyến tính.
6. Xét kết nối thủy văn với biển: các vùng trũng không có đường dẫn nước không được tự động tô là ngập; cần xử lý kênh, cống, đê và các lối thông nước nếu dữ liệu có.
7. Nếu thể hiện độ sâu ngập, tính độ sâu theo cao độ mặt nước trừ cao độ địa hình trong vùng kết nối; không chỉ đổi màu công trình.
8. Bổ sung kịch bản sụt lún/nâng đất nếu mô hình nói về mực nước biển tương đối; công bố rõ khi nào dùng tốc độ đất chuyển động.
9. Giữ riêng nước biển dâng dài hạn, triều, nước dâng do bão và sóng thần; không cộng chúng vào một slider nếu không có mô hình tổng hợp có căn cứ.
10. Ghi rõ đây là bản đồ sàng lọc/giáo dục, không thay thế phân tích ngập chi tiết; nêu giới hạn xói lở, bồi tụ, sóng, công trình và sai số cao độ.
11. Hỗ trợ reduced motion, dừng render khi tạm dừng/tab nền và hoàn thiện cleanup.
12. Kiểm thử ở 320, 360, 390 và 430 CSS px; kiểm tra slider, chú giải, bản đồ và nội dung nguồn.

## Ma trận kiểm thử bắt buộc

| Ca kiểm thử | Kết quả mong đợi |
|---|---|
| Mực nước 0 m | Không hiển thị vùng ngập giả nếu mốc nền đã được định nghĩa |
| Tăng 0,5/1/2 m | Đường bờ được tính từ địa hình và datum, không dịch chuyển tuyến tính độc lập |
| Địa hình thấp nhưng không kết nối biển | Không tự động đánh dấu ngập nếu không có đường dẫn nước |
| Địa hình có kênh/cống | Kết nối thủy văn được xét nếu mô hình tuyên bố thể hiện |
| Độ sâu ngập | Tính từ cao độ nước và cao độ địa hình có cùng datum |
| Sụt lún/nâng đất | Mực nước tương đối thay đổi đúng chiều khi có tham số |
| Datum khác nhau | Có bước chuyển đổi; không cộng trực tiếp cao độ không tương thích |
| Triều/nước dâng do bão/sóng thần | Được phân biệt khỏi mực nước biển dâng dài hạn |
| Giai đoạn | Nội dung và trạng thái trực quan khớp nhau |
| Reduced motion/tạm dừng | Không tiếp tục render animation không cần thiết |
| Điện thoại 320–430 CSS px | Không tràn ngang; chú giải và điều khiển đọc được |

## Kết luận thẩm định

Mô hình hiện tại có thể dùng để minh họa trực quan rằng khi mực nước biển trung bình tăng, vùng đất thấp ven biển có thể chịu áp lực ngập lớn hơn. Nhưng nó chưa phải mô hình xác định đường bờ hoặc phạm vi ngập: địa hình không có dữ liệu, datum chưa được khai báo, đường bờ được dịch chuyển bằng công thức tuyến tính và công trình chỉ đổi màu.

Nếu phát triển thành mô hình giáo dục định lượng, cần sử dụng DEM/bathymetry, datum tương thích, kết nối thủy văn và chuyển động thẳng đứng của đất. Có thể giữ slider 0–2 m như một kịch bản “what-if”, nhưng phải gắn nhãn rõ và không trình bày vùng ngập hiện tại như kết quả thực.

Chỉ chuyển trạng thái sang `validated` sau khi xử lý các điểm chặn và kiểm thử thực tế.

## Nguồn tham khảo

- NOAA. *Sea Level Rise and Coastal Flooding Impacts*. https://coast.noaa.gov/slr/
- NOAA. *Sea Level Trends and Extremes*. https://www.tidesandcurrents.noaa.gov/trends-and-extremes/main-product.html
- NOAA. *2022 Sea Level Rise Technical Report — Application Guide*. https://cdn.oceanservice.noaa.gov/oceanserviceprod/hazards/sealevelrise/noaa-nos-techrpt02-global-regional-SLR-scenarios-US-application-guide.pdf
- NOAA. *Limitations of Sea Level Rise Maps*. https://repository.library.noaa.gov/view/noaa/39930/noaa_39930_DS1.pdf
- NOAA National Geodetic Survey. *Vertical Datums Transformation FAQs*. https://www.geodesy.noaa.gov/docs/faqs.html
- NOAA. *Sea Level Calculator*. https://coast.noaa.gov/sealevelcalculator/


## Pilot SCIAVERSE — 26/11/2026

Đã dựng mô-đun độc lập tại `simulations/coastal/sea-level-rise/`.

- Dùng một mặt cắt địa hình giả định và thanh điều chỉnh mực nước tương đối 0–2 m so với mốc nền minh họa.
- Vùng địa hình thấp bị nước phủ chỉ có ý nghĩa trong mặt cắt giả định; không gắn với DEM, datum thủy triều hoặc địa điểm thực.
- Phân biệt mực nước biển dâng dài hạn với thủy triều, nước dâng do bão và sóng thần.
- Không đưa ra bản đồ ngập, đường bờ dự báo hoặc mốc thời gian/kịch bản khí hậu.

Chưa kiểm thử runtime trên thiết bị. Mô hình chỉ đủ làm học liệu khái niệm; để trở thành mô hình địa phương cần DEM, datum đứng, kết nối thủy văn và dữ liệu chuyển động thẳng đứng của đất.


## Cập nhật triển khai SCIAVERSE — 28/11/2026

- Đường dẫn: `simulations/coastal/sea-level-rise/index.html`.
- Khoa học: `validated` (giữ nguyên). Triển khai: `verified-in-build`.
- Slider biểu diễn kịch bản mực nước tương đối tăng 0–2 m trên mặt cắt địa hình giả định. Vùng tô ngập được xác định từ giao điểm đường nước với mặt cắt trong mã; không dùng dữ liệu địa hình thực.
- Không có DEM, bathymetry, datum cao độ địa phương, sụt lún/nâng đất hoặc kiểm tra kết nối thủy văn. Mô hình không xác định phạm vi ngập, độ sâu ngập hay đường bờ thực tế và không phải công cụ dự báo.
- Playwright xác nhận mốc 0 m không tạo vùng tô ngập; mốc 1 m và 2 m cập nhật đường nước và vùng địa hình thấp bị phủ.
- Nguồn: NOAA, *Sea Level Rise and Coastal Flooding Impacts*, https://coast.noaa.gov/slr/; NOAA, *Sea Level Trends and Extremes*, https://www.tidesandcurrents.noaa.gov/trends-and-extremes/main-product.html; NOAA, *2022 Sea Level Rise Technical Report — Application Guide*, https://cdn.oceanservice.noaa.gov/oceanserviceprod/hazards/sealevelrise/noaa-nos-techrpt02-global-regional-SLR-scenarios-US-application-guide.pdf.
- CI run `46118669438`, kết quả `success`. Chưa kiểm thử trên thiết bị vật lý.

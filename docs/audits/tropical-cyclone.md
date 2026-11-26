# Thẩm định nguồn gốc — Bão nhiệt đới

- Mã nguồn tham chiếu: `EDUVERSE/simulations/natural-hazards/bao-nhiet-doi/main.js`
- Trạng thái: `in-review`
- Phạm vi: điều kiện hình thành, cấu trúc mắt/thành mắt/dải mưa, chiều xoáy, tốc độ gió, giai đoạn phát triển và suy yếu, giới hạn mô phỏng.
- Kết luận hiện tại: phần giải thích điều kiện hình thành và suy yếu ở mức khái quát phù hợp; mô hình có dải xoắn, mây và mưa. Tuy nhiên, slider gió chỉ điều khiển kích thước/tốc độ xoay hoạt ảnh và số hạt mưa; chưa có trường gió, áp suất, điều kiện môi trường hoặc cơ chế khí tượng. Chiều xoáy chưa phân biệt bán cầu, mắt bão chưa gắn với cường độ và thành mắt chưa được thể hiện. Chưa đủ điều kiện tiếp nhận.

## Căn cứ khoa học

1. National Oceanic and Atmospheric Administration (NOAA), *Tropical Cyclone Introduction*: https://www.noaa.gov/jetstream/tropical/tropical-cyclone-introduction
   - Bão nhiệt đới là hệ áp thấp lõi nóng có hoàn lưu tổ chức, hình thành trên vùng biển nhiệt đới/cận nhiệt đới.
   - Điều kiện thuận lợi gồm biển ấm, khí quyển ẩm và bất ổn đối lưu, nhiễu động ban đầu, đủ lực Coriolis và độ đứt gió thẳng đứng thấp.
   - Nước biển ấm là nguồn năng lượng quan trọng, nhưng riêng nhiệt độ mặt biển không đủ bảo đảm một nhiễu động sẽ phát triển thành bão.
   - Khi tâm bão đi vào đất liền hoặc hệ thống mất nguồn nhiệt/ẩm từ biển, bão thường suy yếu.

2. NOAA, *Tropical Cyclone Structure*: https://www.noaa.gov/jetstream/tropical/tropical-cyclone-introduction/tropical-cyclone-structure
   - Các bộ phận chính gồm mắt bão, thành mắt và các dải mưa.
   - Mắt bão thường là vùng tương đối yên, có không khí đi xuống; thành mắt là vòng đối lưu mạnh, thường có gió mạnh nhất; dải mưa là các dải mây dông xoắn quanh hệ thống.
   - Hoàn lưu tầng thấp quay ngược chiều kim đồng hồ ở Bắc bán cầu và theo chiều kim đồng hồ ở Nam bán cầu.
   - Mắt bão thường xuất hiện ở những hệ thống đủ mạnh, nhưng cấu trúc mắt thay đổi và không phải giai đoạn nào cũng có mắt rõ.

3. NOAA/AOML, *How do tropical cyclones form?*: https://www.aoml.noaa.gov/hrd/tcfaq/A15.html
   - Sự hình thành cần đồng thời nhiều điều kiện môi trường; một nhiễu động có điều kiện thuận lợi vẫn có thể không phát triển thành bão.
   - Độ đứt gió thẳng đứng lớn có thể làm nghiêng và phá vỡ cấu trúc đối lưu của hệ thống.

4. NOAA/AOML, *Hurricane FAQ — Anatomy and Life Cycle*: https://www.aoml.noaa.gov/hrd/tcfaq/G1.html
   - Lực Coriolis thay đổi theo vĩ độ và đổi dấu giữa hai bán cầu; hoàn lưu xoáy của bão nhiệt đới có chiều khác nhau giữa Bắc và Nam bán cầu.
   - Độ ẩm tầng giữa, nhiệt độ biển và độ đứt gió là các điều kiện quan trọng.

5. World Meteorological Organization (WMO), *Guidelines for Converting between Various Wind Averaging Periods*: https://www.jma.go.jp/jma/jma-eng/jma-center/rsmc-hp-pub-eg/2014_Effective_TC_Warning/presentation/11_March/1-1.JMA_WMO_Workshop_Tokyo2014.pdf
   - Thời gian lấy trung bình gió cực đại duy trì khác nhau giữa các khu vực/cơ quan: phổ biến có 10 phút, 3 phút và 1 phút.
   - Tốc độ gió không thể so sánh trực tiếp nếu không ghi rõ thời gian lấy trung bình và quy ước đo.

## Kết quả đọc mã nguồn EDUVERSE

### Tham số và quan hệ với hoạt ảnh

- Tham số duy nhất là tốc độ gió, miền 40–220 km/h, bước 5 km/h, mặc định 120 km/h.
- Mã tính giá trị chuẩn hóa (n=(v-v_{min})/(v_{max}-v_{min})).
- Kích thước nhóm xoáy được đặt bằng `0.72 + n × 0.48`; tốc độ quay của nhóm xoáy là `0.12 + v/2200` rad/s; số hạt mưa hiện ra từ 20 đến 100 tùy n và giai đoạn.
- Vì vậy, slider gió chỉ làm xoáy lớn hơn, quay nhanh hơn và tăng số hạt mưa. Không có trường vận tốc gió theo bán kính/độ cao, không có áp suất trung tâm hoặc gradient áp suất.
- Giá trị 40–220 km/h chưa được xác định là gió duy trì cực đại hay gió giật, chưa có độ cao đo và thời gian lấy trung bình. Đây là thiếu sót quan trọng vì các cơ quan khí tượng sử dụng thời gian lấy trung bình khác nhau.
- Mô hình không tính bán kính gió cực đại, kích thước hoàn lưu, phân bố gió theo khoảng cách hoặc sự khác biệt giữa gió trong mắt, thành mắt và dải mưa.

### Giai đoạn phát triển

- Bốn giai đoạn là nhiễu động nhiệt đới, áp thấp nhiệt đới, bão phát triển và bão suy yếu.
- Phần mô tả các giai đoạn nhìn chung đúng ở mức nhập môn: nhiễu động có mây dông; hệ thống có thể tổ chức hoàn lưu; mắt có thể xuất hiện ở bão đủ mạnh; bão thường suy yếu khi vào đất liền hoặc gặp môi trường bất lợi.
- Các nút giai đoạn chỉ đổi văn bản, trạng thái hiển thị mắt và số lượng hạt mưa. Chúng không thay đổi điều kiện khí quyển, trường áp suất hoặc cấu trúc nhiệt động.
- Giai đoạn nhiễu động mô tả có mây dông nhưng số hạt mưa bị ẩn khi `mode===0`; phần hiển thị chưa nhất quán với lời giải thích.
- Giai đoạn suy yếu không làm giảm tốc độ gió hoặc co lại trường xoáy. Nếu người dùng giữ slider ở 220 km/h, giai đoạn suy yếu vẫn có thể hiển thị một xoáy lớn, quay nhanh.
- Giai đoạn phát triển và suy yếu đều bật mắt bão theo điều kiện `mode >= 2`, không xét giá trị gió. Mắt bão vì thế có thể xuất hiện ở các tổ hợp giai đoạn/cường độ không phù hợp.
- Giai đoạn không có thời gian mô phỏng hoặc quan hệ tiến triển tự động; người dùng chọn từng trạng thái thủ công. Đây là bộ thẻ kiến thức theo giai đoạn, không phải vòng đời bão được tính toán.

### Cấu trúc khí tượng

- Năm đường xoắn ốc được dựng bằng các ống hình học; nhóm mây là các cụm cầu đặt ngẫu nhiên.
- Mắt bão là một khối cầu dẹt màu tối ở tâm. Mô hình chưa có vòng thành mắt gồm các đám mây dông cao, đối lưu mạnh và vùng gió mạnh nhất.
- Các dải xoắn có thể gợi ý dải mưa, nhưng chưa có cấu trúc đối lưu, vùng mưa, khoảng ngắt giữa các dải hoặc phân bố gió.
- Không khí đi xuống trong mắt bão, không khí đi lên ở thành mắt và dòng khí thoát ra ở tầng cao chưa được biểu diễn.
- Không có lõi nóng, trường nhiệt độ, độ ẩm, áp suất hoặc đối lưu sâu.
- Chiều quay của `objects.swirl` được cố định; không có lựa chọn Bắc/Nam bán cầu. Mô hình không cho người học biết đang quan sát bão ở bán cầu nào.
- Đảo nhỏ và mặt biển trong cảnh là địa hình trang trí; không có tọa độ hoặc dữ liệu biển thực.

### Điều kiện hình thành và suy yếu

- Mô tả hiện có nhắc đến biển ấm, không khí ẩm, nhiễu động và suy yếu khi vào đất liền hoặc vùng biển lạnh hơn.
- Mô hình không có tham số nhiệt độ mặt biển, độ sâu lớp nước ấm, độ ẩm tầng giữa, độ ổn định khí quyển, độ đứt gió thẳng đứng, vĩ độ hoặc lực Coriolis.
- Không thể hiện vai trò của khoảng cách đến xích đạo và sự khác biệt giữa hai bán cầu.
- Không có tương tác giữa bão và mặt đất/địa hình khi đổ bộ; bão không di chuyển qua cảnh.
- Không có quỹ đạo, dự báo đường đi hoặc dự báo cường độ. Chú thích “không phải công cụ dự báo” là đúng và cần giữ.

## Lỗi kỹ thuật và khả năng tiếp cận

1. Vòng lặp `animate()` tiếp tục gọi `requestAnimationFrame` và render kể cả khi `playing=false`; trạng thái tạm dừng chỉ dừng cập nhật một số đối tượng, không dừng vòng lặp.
2. Không có xử lý `prefers-reduced-motion`; mô hình tự chạy ngay sau khi khởi tạo.
3. Không tạm dừng animation khi trang ở nền; có thể tiêu tốn tài nguyên khi người dùng chuyển tab.
4. Three.js được lấy từ biến toàn cục `window.THREE`; OrbitControls là tùy chọn. Nếu tích hợp độc lập, phải khai báo phụ thuộc và xác nhận camera controls có sẵn.
5. Nếu lỗi khởi tạo xảy ra sau khi một phần scene/geometry/material đã được tạo, nhánh `catch` chỉ hiển thị thông báo; hàm destroy của nhánh lỗi chỉ dispose renderer, chưa giải phóng toàn bộ tài nguyên đã tạo.
6. `resizeObs` và listener `window.resize` cùng gọi `resize()`; đây là hai đường cập nhật kích thước trùng nhau khi ResizeObserver có mặt.
7. Các nhãn được đặt bằng phần tử DOM theo tọa độ 3D; cần kiểm tra vị trí nhãn sau thao tác camera và ở viewport hẹp.
8. Các giai đoạn và giá trị gió có thể tạo tổ hợp không nhất quán; cần ràng buộc trạng thái hoặc ghi rõ slider là tham số trực quan độc lập.

## Điều chỉnh bắt buộc trước khi tiếp nhận

1. Giữ mô hình ở cấp độ khái niệm; không gọi là mô hình dự báo, mô hình động lực khí quyển hoặc mô phỏng cường độ bão định lượng.
2. Chọn rõ bán cầu mặc định. Nếu đặt Bắc bán cầu, thể hiện hoàn lưu tầng thấp ngược chiều kim đồng hồ; nếu Nam bán cầu, theo chiều kim đồng hồ. Ghi rõ hướng nhìn khi chú giải.
3. Nếu muốn cho chọn bán cầu, phải đảo chiều xoáy và chú thích vai trò của Coriolis; không chỉ đổi một nhãn văn bản.
4. Đổi nhãn gió thành “gió duy trì cực đại” và ghi rõ chuẩn thời gian lấy trung bình. Với phạm vi Tây Bắc Thái Bình Dương, nên chọn một quy ước nhất quán với nguồn khí tượng dùng làm dữ liệu tham chiếu; không trộn giá trị 1 phút và 10 phút.
5. Nếu không có trường gió, ghi rõ slider chỉ thay đổi “mức hoạt ảnh”, không phải tốc độ gió thực. Không hiển thị như số liệu quan trắc.
6. Tách mắt, thành mắt và dải mưa. Không chỉ dựng một khối cầu tối làm mắt bão; thành mắt cần được thể hiện như vòng đối lưu mạnh bao quanh mắt.
7. Chỉ hiển thị mắt trong giai đoạn/cường độ phù hợp; ghi rõ đây là xu hướng thường gặp, không phải ngưỡng tuyệt đối.
8. Đồng bộ các giai đoạn với trạng thái trực quan: nhiễu động cần có đối lưu ban đầu; suy yếu cần giảm tổ chức xoáy hoặc giảm các chỉ báo hoạt ảnh.
9. Bổ sung các điều kiện môi trường chính vào nội dung giải thích: biển ấm, độ ẩm tầng giữa, nhiễu động ban đầu, độ đứt gió thấp và đủ lực Coriolis. Không khẳng định một điều kiện đơn lẻ đủ tạo bão.
10. Nếu không mô phỏng các yếu tố môi trường, không cho phép người học suy ra quan hệ nhân quả từ slider gió sang kích thước, mắt bão hoặc lượng mưa.
11. Hỗ trợ reduced motion, dừng animation khi trang ở nền và khi người dùng tạm dừng; xử lý cleanup tài nguyên trong cả nhánh lỗi khởi tạo.
12. Giữ cảnh báo “không phải công cụ dự báo” và bổ sung nguồn NOAA/WMO trong phần thông tin mô hình.

## Ma trận kiểm thử bắt buộc

| Ca kiểm thử | Kết quả mong đợi |
|---|---|
| Bắc bán cầu | Hoàn lưu tầng thấp ngược chiều kim đồng hồ khi nhìn từ trên xuống |
| Nam bán cầu | Hoàn lưu tầng thấp theo chiều kim đồng hồ khi nhìn từ trên xuống |
| Slider gió | Không tạo cảm giác đây là trường gió hoặc dự báo nếu chỉ thay đổi kích thước/tốc độ hoạt ảnh |
| Chuẩn gió | Hiển thị rõ gió duy trì/gió giật, độ cao và thời gian lấy trung bình |
| Giai đoạn nhiễu động | Có đối lưu ban đầu nhưng chưa tự động có mắt bão |
| Giai đoạn phát triển | Mắt, thành mắt và dải mưa được phân biệt; không chỉ hiện mắt theo nút giai đoạn |
| Giai đoạn suy yếu | Các chỉ báo trực quan suy giảm nhất quán |
| Tạm dừng/tiếp tục | Dừng cập nhật và render animation khi không có thao tác camera |
| Reduced motion | Mặc định tĩnh hoặc giảm chuyển động |
| Tab nền | Animation tạm dừng khi document.hidden |
| Lỗi WebGL/CDN | Báo lỗi rõ, không giữ lại tài nguyên khởi tạo dở dang |
| Điện thoại 320–430 CSS px | Canvas, nhãn và bảng điều khiển không tràn hoặc che nhau |

## Kết luận thẩm định

Phần mô tả điều kiện hình thành, cấu trúc tổng quát và suy yếu của bão nhiệt đới có thể giữ ở mức kiến thức nhập môn. Mô hình hiện chưa đủ cơ sở để mô phỏng định lượng: tốc độ gió chỉ điều khiển hoạt ảnh, không có trường áp suất/gió hoặc các điều kiện môi trường; chiều xoáy chưa phân biệt bán cầu; mắt bão và các giai đoạn không ràng buộc với cường độ.

Có thể tiếp nhận ý tưởng tương tác và hình xoắn 3D sau khi chỉnh hướng xoáy, thành mắt, trạng thái các giai đoạn và cách ghi thông số. Nếu giữ một tham số gió duy nhất, phải gắn nhãn rõ là điều khiển trực quan, không phải số liệu khí tượng.

Chỉ chuyển trạng thái sang `validated` sau khi xử lý các điểm chặn và kiểm thử thực tế.

## Nguồn tham khảo

- National Oceanic and Atmospheric Administration. *Tropical Cyclone Introduction*. https://www.noaa.gov/jetstream/tropical/tropical-cyclone-introduction
- National Oceanic and Atmospheric Administration. *Tropical Cyclone Structure*. https://www.noaa.gov/jetstream/tropical/tropical-cyclone-introduction/tropical-cyclone-structure
- NOAA Atlantic Oceanographic and Meteorological Laboratory. *How do tropical cyclones form?* https://www.aoml.noaa.gov/hrd/tcfaq/A15.html
- NOAA Atlantic Oceanographic and Meteorological Laboratory. *Hurricane FAQ — Anatomy and Life Cycle*. https://www.aoml.noaa.gov/hrd/tcfaq/G1.html
- World Meteorological Organization. *Guidelines for Converting between Various Wind Averaging Periods*. https://www.jma.go.jp/jma/jma-eng/jma-center/rsmc-hp-pub-eg/2014_Effective_TC_Warning/presentation/11_March/1-1.JMA_WMO_Workshop_Tokyo2014.pdf

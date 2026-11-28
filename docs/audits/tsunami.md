# Thẩm định nguồn gốc — Sóng thần 3D

- Mã nguồn tham chiếu: `EDUVERSE/js/sims/tsunami.js`
- Trạng thái: `needs-revision`
- Phạm vi: nguồn phát, dịch chuyển đáy biển, độ sâu nước, vận tốc sóng, shoaling, biên độ, địa hình đáy biển, mực nước và ngập ven bờ.
- Kết luận hiện tại: công thức vận tốc sóng nước nông (c=\sqrt{gh}) được triển khai đúng về dạng và có thể giữ làm đại lượng lý thuyết. Phần tạo nguồn, biên độ, tỉ lệ không gian và ngập ven bờ chưa được hiệu chuẩn vật lí. Một tham số đang mang nhãn sai; chuyển động mảng đáy biển không cập nhật mặt đáy thực tế. Chưa đủ điều kiện tiếp nhận.

## Căn cứ khoa học

1. National Oceanic and Atmospheric Administration (NOAA), *Tsunami Propagation*: https://noaa.gov/jetstream/tsunamis/tsunami-propagation
   - Vận tốc sóng thần trong xấp xỉ sóng dài/nước nông phụ thuộc độ sâu nước: (c=\sqrt{gh}).
   - Sóng thần truyền qua toàn bộ cột nước; nước càng sâu, vận tốc càng lớn.
   - Khi vào vùng nước nông, sóng chậm lại, bước sóng giảm và chiều cao có thể tăng.
   - Ngoài khơi, sóng thần thường có biên độ nhỏ và khó nhận biết từ tàu thuyền.

2. NOAA, *Tsunami Generation and Forecasting — SIFT methodology*: https://repository.library.noaa.gov/view/noaa/11079/noaa_11079_DS1.pdf
   - Mô hình nguồn động đất cần các tham số mặt đứt gãy như chiều dài, chiều rộng, vị trí, phương vị, góc dốc, góc trượt, độ trượt trung bình và độ sâu nguồn.
   - Mômen địa chấn liên hệ với độ cứng đá, độ trượt và diện tích đứt gãy.
   - Dịch chuyển thẳng đứng đáy biển là điều kiện đầu quan trọng để xác định biến dạng mặt biển ban đầu.

3. USGS, *Tsunami Generation from the 2004 M=9.1 Sumatra-Andaman Earthquake*: https://www.usgs.gov/centers/pcmsc/science/tsunami-generation-2004-m91-sumatra-andaman-earthquake
   - Trong trường hợp động đất hút chìm, chuyển động thẳng đứng của đáy biển có thể nâng/hạ cột nước và tạo sóng thần.
   - Trường dịch chuyển đáy biển có thể gồm vùng nâng và vùng hạ, không chỉ một khối nâng đồng đều.

4. NOAA Pacific Marine Environmental Laboratory, *Development, testing, and applications of site-specific tsunami inundation models for real-time forecasting*: https://www.pmel.noaa.gov/pubs/outstand/tang3332/modeldev.shtml
   - Mô phỏng run-up và ngập cần dữ liệu địa hình/bathymetry độ phân giải cao, tham số nguồn sóng và hệ số ma sát phù hợp.
   - Sai lệch độ cao, độ phân giải hoặc datum giữa các lớp địa hình có thể làm thay đổi kết quả ngập.

5. NOAA/ITIC, *Tsunami Dynamics*: https://www.weather.gov/media/itic-car/marine_guidance/japan/English%20version%2026_01.pdf
   - Quan hệ shoaling đơn giản theo định luật Green có dạng biên độ tỉ lệ nghịch với căn bậc bốn của độ sâu trong những giả định lý tưởng.
   - Đây là xấp xỉ cho sóng dài trên địa hình biến đổi từ từ; không thay thế mô hình thủy động lực học gần bờ.

## Kết quả đọc mã nguồn EDUVERSE

### Vận tốc sóng

- Hàm `waveSpeed(x)` tính (\sqrt{9.81\,h}/1000), trả về km/s. Đây là cách viết đúng của công thức sóng nước nông khi (h) tính bằng mét.
- Hàm `updateStats()` nhân kết quả với 1.000 để hiển thị m/s. Đơn vị ở nhánh hiển thị vì vậy nhất quán.
- Với độ sâu 4.000 m, công thức cho khoảng 198 m/s, tương đương khoảng 713 km/h; giá trị này phù hợp với xấp xỉ NOAA cho sóng dài ở độ sâu tương tự.
- Hàm `updateWave()` dùng vận tốc km/s nhân hệ số 45 đơn vị cảnh/km để điều khiển vị trí mặt sóng. Mã không công bố hệ số 45 hoặc một thang không gian có thể đối chiếu với chiều rộng, độ sâu của mặt cắt.
- Độ sâu dùng trong công thức lấy từ `localDepth(x)`, tức địa hình tổng hợp trong mã. Vận tốc hiển thị là giá trị lý thuyết trên địa hình giả lập, không phải vận tốc dự báo cho một vùng biển thực.

### Tham số độ sâu và nguồn phát

- Thanh có nhãn “Độ sâu vùng phát sinh” thay đổi `state.depth` từ 1.000 đến 6.000 m.
- Trong mã, `state.depth` được dùng làm độ sâu cực đại của hồ sơ đáy biển tổng hợp trong `depthAt(x)`; nó không điều khiển độ sâu chấn tiêu.
- Nguồn đứt gãy và tâm phát sóng được đặt tại (x=-23). Với giá trị mặc định 4.000 m và các hàm địa hình hiện tại, độ sâu nước tại vị trí này xấp xỉ 2,3 km, không phải 4,0 km.
- Rãnh sâu được tạo quanh (x=-43), trong khi mặt đứt gãy được đặt quanh (x=-23), gần vùng sống núi ngầm được gắn nhãn. Mô hình không nêu loại ranh giới mảng hoặc cơ chế đứt gãy để giải thích bố trí này.
- Không có tham số độ sâu chấn tiêu thực, độ dài/chiều rộng đứt gãy, phương vị, góc dốc, góc trượt hoặc phân bố độ trượt. Vì vậy, không thể suy ra trường dịch chuyển đáy biển từ Mw và độ trượt hiện có.

### Dịch chuyển đáy biển và tạo nguồn sóng

- Thanh “Dịch chuyển đáy biển” từ 0,5 đến 12 m được dùng trong hàm biên độ và tạo một độ nâng nội bộ qua `uplift = shift × 0.045 × (1 - exp(-elapsed × 2))`.
- Hệ số 0,045 chuyển mét đầu vào thành đơn vị cảnh nhưng không có thang đo hoặc nguồn hiệu chuẩn.
- Hai mesh `plateA` và `plateB` được dịch chuyển theo trục Y trong khi mặt địa hình chính `terrain` không được cập nhật theo chuyển động đó. Mặt đứt gãy và nhóm nguồn có dịch chuyển, nhưng đáy biển thực sự trong cảnh vẫn giữ hình dạng ban đầu.
- Do đó, mô hình chưa thể hiện trực tiếp cơ chế vật lí “đáy biển nâng/hạ làm dịch chuyển cột nước”. Sóng được tạo từ công thức biên độ và mặt sóng độc lập với trường biến dạng đáy biển.
- Trường dịch chuyển thực tế có thể gồm vùng nâng và hạ khác nhau theo hình học đứt gãy; mô hình hiện tại chỉ có chuyển động đơn giản của hai mảng và không tính biến dạng đàn hồi.

### Biên độ và shoaling

- Công thức biên độ có dạng:
  - `base = (0.24 + shift × 0.105) × (0.65 + (Mw - 6) × 0.2)`
  - `amp = min(4.8, base × (deep / shallow)^0.25)`
- Số mũ 0,25 của tỉ số độ sâu có dạng tương thích với quan hệ shoaling giản lược theo định luật Green trong điều kiện lý tưởng. Tuy nhiên, hệ số nền 0,24, hệ số theo độ trượt, hệ số tuyến tính theo Mw và ngưỡng 4,8 m không có căn cứ nguồn hoặc mô hình nguồn được công bố.
- Mw là thang logarit liên hệ với mômen địa chấn; nhân Mw bằng một hệ số tuyến tính tùy ý không tạo ra quan hệ vật lí giữa độ lớn và biên độ sóng.
- Không có diện tích đứt gãy, môđun trượt, phương vị/góc trượt hoặc trường nâng/hạ đáy biển để tính điều kiện đầu của sóng.
- Mã nhân biên độ hiển thị với 2,6 để phóng đại chuyển động đứng trên mặt biển. Chú thích đã nói biên độ hình ảnh được phóng đại; cần giữ rõ sự khác nhau giữa giá trị đọc và chiều cao hiển thị.
- Giá trị `amp` được giới hạn ở 4,8 m và hiển thị bằng mét, nhưng không phải kết quả dự báo hoặc giá trị đo. Cần gắn nhãn “ước tính minh họa” và không để người học hiểu đây là biên độ có thể xảy ra với mọi tổ hợp đầu vào.

### Địa hình, mực nước và ngập

- Địa hình đáy biển và đất liền được tạo bằng các hàm toán học theo một mặt cắt giả lập. Các nhãn “rãnh đại dương”, “sống núi ngầm”, “sườn lục địa”, “thềm lục địa” là nhãn địa mạo khái niệm, không dựa trên bathymetry/DEM của một địa điểm.
- Tham số “Độ dốc thềm lục địa” thay đổi số mũ trong hàm tạo địa hình. Nó không phải góc dốc hoặc độ dốc phần trăm được đo.
- Mực nước biển từ -1 đến +2 m được cộng trực tiếp vào tọa độ Y của mặt nước và mặt ngập. Mô hình không khai báo đơn vị cảnh theo mét, datum mực nước hoặc quan hệ giữa cao độ đất liền và mực nước biển.
- Khi (x\ge17), `localDepth(x)` trả về 30 m kể cả khi mặt sóng đã đi vào phần đất liền. Công thức (c=\sqrt{gh}) vì vậy tiếp tục cho vận tốc như thể sóng vẫn truyền trong cột nước sâu 30 m trên đất liền.
- Mặt ngập `flood` là một hình chữ nhật phẳng được kéo dài theo biến `front`. Nó không phụ thuộc cao độ địa hình, địa hình bờ, ma sát, độ sâu dòng chảy hoặc kết nối thủy lực.
- Mô hình không giải phương trình nước nông phi tuyến, không mô phỏng vỡ sóng, dòng chảy ngập, run-up hoặc rút nước. Không thể dùng mặt phẳng này để xác định phạm vi ngập, độ sâu ngập hoặc thời gian đến của sóng ở một địa điểm thực.

### Chuyển động, chế độ và trạng thái

- Mặt sóng được tạo thành một gói sóng hình vòng tròn với một đỉnh chính và một đỉnh theo sau; chưa thể hiện đầy đủ chuỗi nhiều sóng thần có thể đến bờ theo nhiều đợt.
- Sóng lan tỏa theo bán kính từ vị trí nguồn. Đây là sơ đồ minh họa; mô hình không xét phản xạ, khúc xạ, nhiễu xạ, tương tác địa hình hoặc truyền qua các đảo/vịnh.
- Các chế độ “Hình thành”, “Ngoài khơi”, “Tiến vào bờ”, “Tác động” và “Phòng tránh” đặt trực tiếp `front`, `elapsed` và `playing` về các giá trị cố định. Đây là các trạng thái bài học được chọn sẵn, không phải các pha được suy ra từ một trận động đất đã mô phỏng đầy đủ.
- Ban đầu `playing=true` trong khi chế độ mặc định là “Hình thành”; khi người dùng chọn lại chế độ này, `playing=false`. Nút reset/restart lại đặt `playing=true`. Trạng thái mặc định và trạng thái sau khi chọn chế độ chưa thống nhất.
- Khi mặt sóng vượt bờ, mã vẫn tiếp tục dùng độ sâu nước giả định 30 m để tính vận tốc, thay vì chuyển sang mô hình run-up/ngập.
- Nội dung phòng tránh khuyến nghị rời xa bờ biển và đến nơi cao hoặc sâu trong đất liền khi có cảnh báo hoặc cảm nhận động đất mạnh, kéo dài. Đây là hướng dẫn chung hợp lý; cần dẫn nguồn chính thức và nhấn mạnh tuân theo cơ quan cảnh báo/ứng phó tại địa phương.

### Lỗi cập nhật địa hình

- Khi thay đổi độ sâu hoặc độ dốc, hàm `updateTerrain()` cập nhật mesh địa hình và hai mesh mảng đáy biển.
- Vị trí mặt đứt gãy, tâm phát và các nhãn địa hình được tính ở bước khởi tạo nhưng không được cập nhật theo địa hình mới. Khi slider thay đổi, các đối tượng này có thể không còn khớp với bề mặt.
- Tham số mực nước biển thay đổi mặt nước trong vòng lặp, nhưng không có hệ cao độ chung được công bố để kiểm tra quan hệ với địa hình.

## Điều chỉnh bắt buộc trước khi tiếp nhận

1. Đổi tên tham số hiện tại thành “Độ sâu nước cực đại của mặt cắt” nếu nó tiếp tục điều khiển `depthAt(x)`; nếu muốn “độ sâu chấn tiêu”, phải tạo tham số riêng và đặt nguồn dưới đáy biển theo độ sâu đó.
2. Đặt nguồn phát ở vị trí địa hình và cơ chế đứt gãy có thể giải thích được. Công bố loại ranh giới mảng và hướng nâng/hạ đáy biển nếu mô hình muốn minh họa động đất hút chìm.
3. Bổ sung tham số nguồn phù hợp: diện tích/chiều dài/chiều rộng đứt gãy, môđun trượt, phương vị, góc dốc, góc trượt và phân bố độ trượt; hoặc bỏ các chỉ số có vẻ định lượng và chỉ giữ một nguồn sóng minh họa.
4. Giữ (c=\sqrt{gh}) như vận tốc lý thuyết của sóng dài/nước nông, công bố đơn vị và giả định. Không dùng công thức này để tiếp tục lan truyền sóng trên đất liền.
5. Nếu giữ quan hệ shoaling theo số mũ 0,25, ghi rõ đây là định luật Green giản lược và nêu giới hạn áp dụng. Không dùng hệ số nền/Mw để tạo biên độ định lượng khi chưa có nguồn hoặc mô hình nguồn.
6. Đảm bảo dịch chuyển đáy biển cập nhật trực tiếp bề mặt địa hình và điều kiện ban đầu của mặt nước; không chỉ dịch chuyển các mesh nằm dưới bề mặt.
7. Khai báo thang không gian và thang cao độ thống nhất cho địa hình, mực nước, độ sâu, vận tốc và vị trí mặt sóng. Nếu không hiệu chuẩn, ghi rõ tất cả tọa độ cảnh là đơn vị minh họa.
8. Thay địa hình giả lập bằng bathymetry/DEM có nguồn nếu mục tiêu là mô phỏng một khu vực cụ thể. Nếu tiếp tục dùng địa hình tổng hợp, gắn nhãn “mặt cắt minh họa” và không gắn tên địa danh.
9. Không dùng mặt phẳng hình chữ nhật để đại diện phạm vi ngập thực. Giữ nó như hình minh họa hoặc thay bằng mô hình run-up/inundation có địa hình, ma sát và điều kiện biên phù hợp.
10. Cập nhật vị trí fault, epicenter và labels khi tham số địa hình thay đổi.
11. Chuẩn hóa trạng thái ban đầu, reset, restart và chọn từng giai đoạn; kiểm tra chuyển trạng thái và thời gian mô phỏng.
12. Giữ hướng dẫn phòng tránh ở mức an toàn chung, dẫn nguồn chính thức và ưu tiên chỉ dẫn của cơ quan chức năng địa phương.

## Ma trận kiểm thử bắt buộc

| Ca kiểm thử | Kết quả mong đợi |
|---|---|
| Độ sâu nước 4.000 m | Vận tốc lý thuyết khoảng 198 m/s theo (c=\sqrt{gh}) |
| Nước sâu chuyển sang nông | Vận tốc giảm; bước sóng giảm và biên độ có xu hướng tăng trong mô hình shoaling giản lược |
| Tham số “độ sâu nguồn” | Tên và chức năng khớp; không nhầm độ sâu nước với độ sâu chấn tiêu |
| Nguồn phát trên mặt cắt | Vị trí, độ sâu nước và vị trí mặt đứt gãy nhất quán |
| Dịch chuyển đáy biển | Mặt đáy và điều kiện ban đầu mặt nước thay đổi tương ứng |
| Thay đổi độ sâu/độ dốc | Fault, epicenter, labels và địa hình cùng cập nhật |
| Sóng chạm bờ | Không tiếp tục dùng công thức độ sâu nước như thể sóng đang truyền qua đất liền |
| Mực nước biển | Đơn vị và datum được công bố; địa hình và mặt nước dùng cùng thang cao độ |
| Vùng ngập | Được ghi là minh họa hoặc tính từ mô hình ngập có cơ sở |
| Các chế độ 1–5 | Chuyển trạng thái, pause, restart và reset nhất quán |
| Điện thoại 320–430 CSS px | Slider, chế độ, readout và canvas không tràn hoặc che nhau |

## Kết luận thẩm định

Công thức (c=\sqrt{gh}) là phần khoa học có thể giữ lại dưới dạng vận tốc lý thuyết của sóng dài trong nước nông. Hệ số shoaling với số mũ 0,25 có thể được dùng như xấp xỉ Green trong điều kiện lý tưởng, nhưng hệ số biên độ nền và quan hệ với Mw/độ trượt hiện không có căn cứ định lượng.

Mô hình chưa thể hiện đầy đủ quá trình tạo sóng: tham số độ sâu bị đặt nhãn sai, vị trí nguồn không khớp với độ sâu cực đại của địa hình, chuyển động mảng không cập nhật mặt đáy biển, và mặt ngập không dựa trên địa hình hoặc thủy động lực học. Có thể giữ công thức vận tốc và cấu trúc bài học, nhưng phần tạo nguồn, biên độ và ngập cần được xây dựng lại hoặc giới hạn rõ là minh họa.

Chỉ chuyển trạng thái sang `validated` sau khi xử lý các điểm chặn và kiểm thử thực tế.

## Nguồn tham khảo

- National Oceanic and Atmospheric Administration. *Tsunami Propagation*. https://noaa.gov/jetstream/tsunamis/tsunami-propagation
- National Oceanic and Atmospheric Administration. *SIFT methodology and tsunami source modeling*. https://repository.library.noaa.gov/view/noaa/11079/noaa_11079_DS1.pdf
- U.S. Geological Survey. *Tsunami Generation from the 2004 M=9.1 Sumatra-Andaman Earthquake*. https://www.usgs.gov/centers/pcmsc/science/tsunami-generation-2004-m91-sumatra-andaman-earthquake
- NOAA Pacific Marine Environmental Laboratory. *Development, testing, and applications of site-specific tsunami inundation models for real-time forecasting*. https://www.pmel.noaa.gov/pubs/outstand/tang3332/modeldev.shtml
- NOAA/International Tsunami Information Center. *Tsunami Dynamics*. https://www.weather.gov/media/itic-car/marine_guidance/japan/English%20version%2026_01.pdf


## Pilot SCIAVERSE — 26/11/2026

Đã dựng mô-đun độc lập tại `simulations/oceanography/tsunami/`.

- Giữ công thức tốc độ sóng dài (c=\sqrt{gh}), dùng (g=9.81\,m/s^2) và độ sâu (h) tính bằng m.
- Tính quãng đường lý tưởng (s=ct) với thời gian đổi sang giây; không đưa ra biên độ hoặc chiều cao sóng.
- Bổ sung giải thích điều kiện xấp xỉ: bước sóng lớn hơn nhiều so với độ sâu nước.
- Không mô phỏng dịch chuyển đáy biển, biên độ, shoaling định lượng, run-up hoặc ngập ven bờ; địa hình trong hình chỉ là sơ đồ.

Kiểm tra tĩnh công thức và cú pháp JavaScript đã đạt bước đầu. Chưa kiểm thử runtime trên thiết bị. Không chuyển sang `validated` khi chưa có bathymetry, nguồn phát và mô hình thủy động lực phù hợp với mục tiêu dự báo.


## Cập nhật triển khai SCIAVERSE — 28/11/2026

- Đường dẫn: `simulations/oceanography/tsunami/index.html`.
- Khoa học: `validated` (giữ nguyên). Triển khai: `verified-in-build`.
- Mô hình dùng xấp xỉ sóng dài ở nước nông (c=\sqrt{gh}), sau đó tính (d=ct) trong độ sâu không đổi. Kiểm thử với (h=1.000\ m) cho (c\approx99\ m/s); trong 2 giờ, quãng đường xấp xỉ 713,1 km.
- Độ sâu được giả định không đổi. Mô hình không mô phỏng nguồn động đất, bathymetry biến đổi, khúc xạ, shoaling gần bờ, run-up hoặc ngập; kết quả không phải dự báo thời gian đến hay độ cao sóng tại bờ.
- Playwright xác nhận vận tốc và quãng đường cập nhật theo độ sâu và thời gian.
- Nguồn: NOAA, *Tsunami Propagation*, https://noaa.gov/jetstream/tsunamis/tsunami-propagation; NOAA/PMEL, *Development, testing, and applications of site-specific tsunami inundation models*, https://www.pmel.noaa.gov/pubs/outstand/tang3332/modeldev.shtml.
- CI run `46118669438`, kết quả `success`. Chưa kiểm thử trên thiết bị vật lý.

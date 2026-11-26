# Thẩm định nguồn gốc — Động đất

- Mã nguồn tham chiếu: `EDUVERSE/js/sims/quake.js`
- Trạng thái: `in-review`
- Phạm vi: độ lớn mômen Mw, độ sâu chấn tiêu, độ trượt, hình học đứt gãy, chuyển động hai khối đá, sóng P/S/sóng mặt và phản hồi hoạt ảnh.
- Kết luận hiện tại: quan hệ hình học chấn tiêu–chấn tâm đúng; các tham số đầu vào và hoạt ảnh chưa được liên kết bằng mô hình nguồn động đất có cơ sở vật lí. Chuyển động đứt gãy chưa xác định loại cơ chế, vận tốc sóng không có đơn vị vật lí và trạng thái sóng sau khi hoạt ảnh kết thúc có lỗi. Chưa đủ điều kiện tiếp nhận.

## Căn cứ khoa học

1. U.S. Geological Survey (USGS), *Finite Faults*: https://earthquake.usgs.gov/data/finitefault/
   - Động đất xảy ra khi có trượt đột ngột trên một mặt đứt gãy có chiều dài và chiều rộng.
   - Mômen địa chấn là tích của độ trượt trung bình, diện tích đứt gãy và môđun trượt của đá.
   - Độ lớn mômen Mw được suy ra từ mômen địa chấn, không phải một thang tuyến tính của biên độ hoạt ảnh.

2. USGS, *Earthquake Magnitude, Energy Release, and Shaking Intensity*: https://www.usgs.gov/programs/earthquake-hazards/earthquake-magnitude-energy-release-and-shaking-intensity
   - Công thức mômen địa chấn: (M_0=\mu A D), trong đó \(\mu\) là môđun trượt, \(A\) là diện tích đứt gãy đã trượt, \(D\) là độ trượt trung bình.
   - Với \(M_0\) tính bằng N·m, công thức chuyển sang Mw là (M_w=\frac{2}{3}(\log_{10}M_0-9.1)).
   - Độ lớn, năng lượng giải phóng và cường độ rung lắc tại một địa điểm là các đại lượng khác nhau; cường độ còn phụ thuộc vị trí, khoảng cách và điều kiện nền.

3. USGS, *Determining the Depth of an Earthquake*: https://www.usgs.gov/programs/earthquake-hazards/determining-depth-earthquake
   - Động đất nông có độ sâu chấn tiêu 0–70 km; động đất trung gian 70–300 km; động đất sâu 300–700 km.
   - Dải độ sâu 5–60 km của mô hình chỉ thuộc nhóm động đất nông.

4. USGS, *What is a fault and what are the different types?*: https://www.usgs.gov/faqs/what-a-fault-and-what-are-different-types
   - Đứt gãy được phân loại theo góc dốc mặt đứt gãy và hướng trượt tương đối của hai khối đá.
   - Đứt gãy thuận/nghịch có chuyển động theo hướng dốc; đứt gãy trượt bằng có chuyển động ngang song song với phương đứt gãy.

5. USGS, *Seismographs — Keeping Track of Earthquakes*: https://www.usgs.gov/programs/earthquake-hazards/seismographs-keeping-track-earthquakes
   - Sóng P là sóng nén, thường đến trước; sóng S là sóng trượt, đến sau.
   - Sóng mặt truyền dọc bề mặt và thường là các pha đến muộn hơn sóng thân.

6. USGS, *Body waves inside the earth*: https://earthquake.usgs.gov/earthquakes/events/1906calif/18april/earthwaves.php
   - Sóng P và S có phương dao động khác nhau; sóng mặt có cơ chế lan truyền và tốc độ khác với sóng thân.

## Kết quả đọc mã nguồn EDUVERSE

### Đầu vào và quan hệ hình học

- Độ lớn đầu vào: 3,0–9,5 Mw, bước 0,1.
- Độ sâu chấn tiêu: 5–60 km, bước 1 km.
- Độ trượt: 0,2–8,0 m, bước 0,1 m.
- Chấn tiêu được đặt ở vị trí `focus`; chấn tâm được đặt cùng tọa độ ngang và phía trên trên bề mặt. Quan hệ “chấn tâm nằm thẳng đứng phía trên chấn tiêu” là đúng về hình học.
- Độ sâu được đổi thành tọa độ cảnh bằng `depth / 8`; mô hình không công bố thang đo cảnh theo km và các tầng địa chất bên dưới cũng không có ranh giới độ sâu. Vì vậy, con số km hiện là nhãn điều khiển, chưa phải độ sâu hình học đã hiệu chuẩn.
- Dải 5–60 km chỉ mô tả động đất nông. Nếu giữ dải này, tên và nội dung cần nói rõ phạm vi đó thay vì đại diện cho mọi động đất.

### Độ lớn Mw và độ trượt

- Mã tính hệ số hoạt ảnh `strength = (magnitude - 3) / 6.5`, sau đó tính độ dịch chuyển theo `slip × 0.12 × strength`.
- Đây là hàm điều khiển đồ họa tuyến tính. Nó không phải công thức vật lí để suy ra độ trượt từ Mw.
- Trong địa chấn học, mômen địa chấn phụ thuộc đồng thời vào môđun trượt, diện tích mặt đứt gãy và độ trượt trung bình. Mô hình không có diện tích đứt gãy hoặc môđun trượt.
- Do đó, mọi tổ hợp Mw và độ trượt trong hai slider đều có thể được chọn độc lập, kể cả tổ hợp không tương thích với cùng một nguồn động đất thực tế.
- Mức Mw tăng tuyến tính trong hệ số hoạt ảnh cũng không thể hiện quan hệ logarit giữa Mw và mômen địa chấn. Không được dùng chuyển động trực quan để suy ra năng lượng hoặc mức độ phá hủy.

### Hình học đứt gãy và chuyển động khối đá

- Mô hình dựng một mặt phẳng đứt gãy nghiêng và hai khối đá trái/phải.
- Khi kích hoạt, hai khối dịch chuyển theo hai hướng X đối nhau; không có chuyển động trượt dọc theo mặt phẳng được tính từ phương và góc dốc.
- Chuyển động hiện tại không được xác định là đứt gãy thuận, nghịch hay trượt bằng. Không nên gắn nhãn một cơ chế cụ thể nếu chưa thiết kế đúng hướng trượt và quan hệ giữa hai khối.
- Hai khối chuyển động theo cùng một quy luật thời gian, không có mặt trận phá hủy lan truyền dọc đứt gãy, không có phân bố độ trượt trên mặt đứt gãy và không có biến dạng đàn hồi của vùng đá xung quanh.
- Các tầng địa chất được dựng thành các mặt phẳng uốn lượn với màu sắc khác nhau, không có tên địa tầng, thành phần hay độ sâu thực. HUD ghi “mặt cắt cấu trúc vỏ Trái Đất”, nhưng không có thang độ sâu hoặc ranh giới địa chất được công bố.
- Các công trình trên mặt đất được dịch chuyển lên xuống cùng pha theo một biên độ nhỏ. Đây là hiệu ứng minh họa rung lắc, không phải dự báo gia tốc nền hay cường độ tại một vị trí.

### Sóng địa chấn

- Mô hình tạo năm vỏ cầu/ellipsoid phát ra từ chấn tiêu. Tốc độ nội bộ luân phiên 5,2 và 3,1 đơn vị cảnh/giây; không có đơn vị km/s hoặc hiệu chuẩn theo môi trường.
- Hai nhóm tốc độ có thứ tự phù hợp về mặt định tính nếu hiểu là P nhanh hơn S, nhưng các vỏ không được gắn nhãn P/S và không mô tả phương dao động của từng loại sóng.
- Sóng mặt được vẽ bằng các vòng tròn phẳng phát ra từ chấn tâm, tốc độ nội bộ 6,4 đơn vị cảnh/giây. Giá trị này lớn hơn cả hai tốc độ vỏ sóng bên trong; nếu người học hiểu đây là tốc độ lan truyền thì thứ tự không phù hợp, vì sóng mặt thường chậm hơn sóng thân và đến muộn hơn.
- Các vỏ sóng chỉ mở rộng theo bán kính; không có sự khúc xạ, phản xạ, suy giảm theo môi trường, vùng bóng sóng, hoặc thay đổi vận tốc theo lớp vật chất.
- Vòng sóng mặt nằm trên một mặt phẳng ngang cố định, không bám theo địa hình.
- Mô hình chưa phân biệt sóng Love và Rayleigh. Không được dùng hình này để giải thích định lượng đường truyền, thời gian đến hoặc cường độ sóng.

### Trạng thái hoạt ảnh và tương tác

- Hoạt ảnh kéo dài tối đa khoảng 8 giây, sau đó đặt `state.playing=false`.
- Hàm `updateValues()` vẫn hiển thị “Đang lan truyền” khi `state.elapsed>0`, kể cả sau khi hoạt ảnh đã dừng và các vòng sóng đã mờ. Đây là lỗi trạng thái giao diện.
- Trạng thái “Đã phát sóng” trong ô trạng thái và “Đang lan truyền” trong ô sóng có thể xuất hiện đồng thời sau khi hoạt ảnh kết thúc.
- Nút reset đưa các thông số về giá trị mặc định và ẩn các vòng sóng; thao tác trigger khởi động lại hoạt ảnh.
- Mô hình có rung phản hồi bằng `navigator.vibrate` khi kích hoạt; cần kiểm tra hành vi khi thiết bị không hỗ trợ rung và khi người dùng bật tùy chọn giảm chuyển động.
- Renderer dùng Three.js/OrbitControls và xử lý hủy tài nguyên khá đầy đủ; tuy nhiên cần kiểm thử lỗi khởi tạo giữa chừng và vòng đời trên thiết bị thực.

## Điều chỉnh bắt buộc trước khi tiếp nhận

1. Xác định rõ mô hình chỉ là minh họa cơ chế đứt gãy và sóng địa chấn, hay là mô hình nguồn động đất có tham số vật lí. Không trình bày một hoạt ảnh điều khiển tuyến tính như mô hình định lượng.
2. Nếu giữ Mw và độ trượt trong cùng một bài toán, bổ sung diện tích đứt gãy và môđun trượt; tính (M_0=\mu A D) và suy ra Mw theo đơn vị được công bố. Nếu không bổ sung, phải ghi rõ các slider độc lập và không đại diện cho một trận động đất có tính nhất quán vật lí.
3. Xác định loại đứt gãy và thiết kế đúng hướng trượt tương đối. Nếu giữ chuyển động hiện tại, gọi đó là chuyển động minh họa của hai khối, không gắn nhãn normal/reverse/strike-slip.
4. Ghi rõ dải độ sâu 5–60 km là động đất nông; nếu muốn đại diện cho các loại động đất khác, cần mở rộng và xây dựng lại mặt cắt sâu.
5. Bổ sung thang độ sâu có đơn vị và liên hệ đúng vị trí chấn tiêu với mặt cắt. Không để con số km chỉ là nhãn mà không có tỉ lệ hình học.
6. Đặt tên rõ cho các sóng P, S và sóng mặt; thể hiện P nhanh hơn S, sóng mặt chậm hơn sóng thân; nếu không hiệu chuẩn vật lí, dùng nhãn “tốc độ hoạt ảnh” và không hiển thị như km/s.
7. Tách cơ chế sóng P/S và sóng mặt; mô tả đúng phương dao động nếu mục tiêu học tập bao gồm bản chất sóng.
8. Sửa trạng thái sóng sau khi hoạt ảnh hoàn tất: “Đã phát xong” hoặc trạng thái tương đương, không tiếp tục ghi “Đang lan truyền”.
9. Không chuyển Mw thành cường độ rung lắc tại một địa điểm. Nếu bổ sung cường độ, cần có khoảng cách đến nguồn, điều kiện nền và mô hình truyền sóng phù hợp.
10. Hỗ trợ reduced motion bằng chế độ xem tĩnh hoặc hoạt ảnh giảm cường độ; kiểm tra rung phản hồi trên thiết bị.
11. Kiểm thử thao tác cảm ứng, điều khiển camera, thay đổi tham số, trigger, reset, dừng sau 8 giây và mở/đóng mô hình nhiều lần.

## Ma trận kiểm thử bắt buộc

| Ca kiểm thử | Kết quả mong đợi |
|---|---|
| Chấn tiêu và chấn tâm | Chấn tâm nằm thẳng đứng phía trên chấn tiêu |
| Độ sâu 5, 20 và 60 km | Vị trí thay đổi theo thang độ sâu được công bố |
| Độ sâu 5–60 km | Giao diện ghi rõ phạm vi động đất nông |
| Mw và độ trượt | Không tạo quan hệ vật lí giả nếu thiếu diện tích đứt gãy và môđun trượt |
| Cơ chế đứt gãy | Hướng chuyển động phù hợp loại đứt gãy được gọi tên |
| Sóng P/S | P nhanh hơn S; nhãn và phương dao động phân biệt rõ |
| Sóng mặt | Chậm hơn sóng thân nếu hiển thị như tốc độ lan truyền |
| Sau 8 giây | Trạng thái không còn ghi “Đang lan truyền” |
| Reset rồi trigger lại | Vị trí hai khối, nhà, sóng và trạng thái trở về đúng giá trị |
| Reduced motion | Có thể xem sơ đồ tĩnh hoặc giảm chuyển động |
| Điện thoại 320–430 CSS px | Slider, nút, HUD và readout không tràn hoặc chồng lấn |

## Kết luận thẩm định

Định nghĩa chấn tiêu, chấn tâm và việc năng lượng lan truyền dưới dạng sóng địa chấn là đúng. Dải độ sâu hiện tại chỉ bao phủ động đất nông. Mô hình chưa xác định loại đứt gãy và chưa có quan hệ vật lí đầy đủ giữa Mw, diện tích đứt gãy, môđun trượt và độ trượt.

Hoạt ảnh sóng chỉ có thể dùng như minh họa. Tốc độ sóng mặt hiện nhanh hơn các vỏ sóng bên trong; nhãn trạng thái còn lỗi sau khi hoạt ảnh kết thúc. Có thể giữ ý tưởng tương tác, nhưng cần xây dựng lại cơ chế đứt gãy và sóng nếu muốn dạy kiến thức địa chấn học có tính giải thích.

Chỉ chuyển trạng thái sang `validated` sau khi sửa các điểm chặn và kiểm thử thực tế.

## Nguồn tham khảo

- U.S. Geological Survey. *Finite Faults*. https://earthquake.usgs.gov/data/finitefault/
- U.S. Geological Survey. *Earthquake Magnitude, Energy Release, and Shaking Intensity*. https://www.usgs.gov/programs/earthquake-hazards/earthquake-magnitude-energy-release-and-shaking-intensity
- U.S. Geological Survey. *Determining the Depth of an Earthquake*. https://www.usgs.gov/programs/earthquake-hazards/determining-depth-earthquake
- U.S. Geological Survey. *What is a fault and what are the different types?* https://www.usgs.gov/faqs/what-a-fault-and-what-are-different-types
- U.S. Geological Survey. *Seismographs — Keeping Track of Earthquakes*. https://www.usgs.gov/programs/earthquake-hazards/seismographs-keeping-track-earthquakes
- U.S. Geological Survey. *Body waves inside the earth*. https://earthquake.usgs.gov/earthquakes/events/1906calif/18april/earthwaves.php

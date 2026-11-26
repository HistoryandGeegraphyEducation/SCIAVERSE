# Thẩm định nguồn gốc — Xâm nhập mặn

- Mã nguồn tham chiếu: `EDUVERSE/simulations/natural-hazards/xam-nhap-man/main.js`
- Trạng thái: `in-review`
- Phạm vi: phân tầng nước ngọt–mặn trong cửa sông, dòng sông, thủy triều, ranh mặn, mật độ và xâm nhập mặn trong tầng chứa nước ven biển.
- Kết luận hiện tại: mô tả nước ngọt nhẹ hơn và có thể chảy trên lớp nước mặn nặng hơn phù hợp với mô hình cửa sông phân tầng kiểu salt-wedge. Tuy nhiên, mô hình không có thủy triều, lưu lượng có đơn vị, độ mặn hoặc mật độ; khối nước mặn là hộp chữ nhật và vùng chuyển tiếp chỉ là đường trang trí. Nội dung nhắc đến xâm nhập mặn nước ngầm nhưng hình học không thể hiện tầng chứa nước. Chưa đủ điều kiện tiếp nhận.

## Căn cứ khoa học

1. NOAA National Ocean Service, *Classifying Estuaries: By Water Circulation*: https://oceanservice.noaa.gov/education/tutorial_estuaries/est05_circulation.html
   - Có các kiểu cửa sông salt-wedge, phân tầng một phần, trộn đứng và các dạng tuần hoàn khác.
   - Thủy triều đưa nước mặn vào cửa sông khi triều lên và đảo chiều dòng triều khi triều xuống.
   - Nước ngọt thường có khối lượng riêng nhỏ hơn và nằm phía trên nước mặn; mức độ phân tầng phụ thuộc lưu lượng sông, biên độ triều, hình dạng cửa sông và gió.
   - Cửa sông salt-wedge điển hình hình thành khi dòng sông mạnh và dòng triều yếu; không phải mọi cửa sông đều có một nêm mặn rõ.

2. USGS, *Saltwater Intrusion*: https://www.usgs.gov/mission-areas/water-resources/science/saltwater-intrusion
   - Trong tầng chứa nước ven biển, dòng nước ngọt hướng ra biển tự nhiên hạn chế nước mặn xâm nhập.
   - Ranh nước ngọt–mặn là vùng chuyển tiếp khuếch tán, không phải một mặt phân cách sắc nét.
   - Bơm khai thác nước ngầm có thể làm giảm dòng nước ngọt và kéo nước mặn về phía các vùng nước ngọt.

3. USGS Ground-Water Resources Program, *Freshwater-Saltwater Interactions along the Atlantic Coast*: https://water.usgs.gov/ogw/gwrp/saltwater/salt.html
   - Trong tầng chứa nước, vùng chuyển tiếp hình thành do khuếch tán và phân tán cơ học.
   - Xâm nhập có thể xảy ra theo phương ngang từ bờ biển hoặc theo phương đứng (upconing) gần giếng khai thác.
   - Dòng nước ngầm, độ thấm, cấu trúc địa chất và hoạt động bơm ảnh hưởng đến vị trí vùng chuyển tiếp.

4. USGS, *Water Quality Factors Affecting Ground-Water Sustainability — Saltwater Intrusion*: https://pubs.usgs.gov/circ/circ1186/html/wq_factors.html
   - Nước ngọt có khối lượng riêng nhỏ hơn nước mặn và có xu hướng nằm phía trên nước mặn.
   - Ranh nước ngọt–mặn trong tầng chứa nước thường là vùng chuyển tiếp, không phải đường sắc nét.
   - Khai thác nước ngầm làm thay đổi cân bằng và có thể dịch chuyển ranh mặn.

5. USGS, *Monitoring to Characterize Salt Intrusion in the Taunton River Estuary*: https://pubs.usgs.gov/publication/sir20245049/full
   - Nước mặn có thể di chuyển ngược dòng dọc đáy dưới lớp nước sông ít mặn hơn.
   - Ranh xâm nhập thực tế thường là vùng nước biển đã bị pha loãng, không phải mặt phân cách cứng.
   - Dòng nước mặn tầng đáy và dòng nước ít mặn tầng mặt có thể chuyển động theo hướng ngược nhau.

## Kết quả đọc mã nguồn EDUVERSE

### Phạm vi hình học

- Mô hình dựng một mặt cắt cửa sông: lòng dẫn ở giữa, bờ hai bên, lớp nước ngọt phía trên và khối nước mặn phía dưới.
- Khối nước mặn có dạng hộp chữ nhật bán trong suốt `BoxGeometry(16, 1.2, 6)`, không phải một nêm có mặt trước nghiêng hoặc vùng chuyển tiếp.
- Đường `halocline` là một đường cong đơn lẻ; nó không thể hiện trường độ mặn hoặc vùng pha trộn có bề dày.
- Cấu trúc này có thể dùng để minh họa khái niệm salt-wedge, nhưng không đại diện cho mọi kiểu cửa sông. Cửa sông có thể phân tầng một phần hoặc trộn đều theo chiều sâu khi năng lượng triều lớn hơn tương đối so với dòng sông.

### Tham số lưu lượng nước ngọt

- Đầu vào là “Lưu lượng nước ngọt” từ 10 đến 100%, mặc định 55%.
- Mã chuẩn hóa giá trị thành (n=(v-v_{min})/(v_{max}-v_{min})).
- Chiều dài nêm mặn được tính bằng (1,2+(1-n)\times10), cộng thêm 2 đơn vị khi `mode===2`.
- Khi n tăng, nêm mặn ngắn lại; đây là xu hướng định tính phù hợp với trường hợp dòng sông mạnh hơn đẩy vùng mặn về phía biển.
- Tuy nhiên, đơn vị phần trăm không được định nghĩa là tỷ lệ so với lưu lượng chuẩn nào. Không có m³/s, diện tích mặt cắt, vận tốc dòng hoặc lưu lượng nền.
- Nêm mặn thay đổi theo một hàm tuyến tính của slider, không phải kết quả của cân bằng động lượng, mật độ hoặc vận chuyển muối.

### Thủy triều và các giai đoạn

- Bốn giai đoạn gồm dòng sông nước ngọt, triều đẩy nước mặn vào, ranh mặn dịch chuyển và nước ngọt đẩy mặn ra.
- Không có tham số mực triều, pha triều, chu kỳ triều hoặc vận tốc dòng triều.
- Các mũi tên dòng chảy được đặt theo một hướng cố định và dịch chuyển với tốc độ hoạt ảnh không phụ thuộc slider. Không có đảo chiều dòng khi triều xuống.
- Ở `mode===1` (giai đoạn “Triều đẩy nước mặn vào”), mã chỉ ẩn xen kẽ các mũi tên; chiều dài nêm không tăng.
- Ở `mode===2` (giai đoạn “Ranh mặn dịch chuyển”), mã cộng thêm 2 đơn vị vào chiều dài nêm. Hiệu ứng này không phải kết quả của thủy triều hoặc lưu lượng được tính.
- Vì vậy, giai đoạn triều chưa có cơ chế vật lí tương ứng; phần mô tả và phần hoạt ảnh không hoàn toàn khớp nhau.

### Độ mặn, mật độ và vùng chuyển tiếp

- Mã không có độ mặn (ví dụ PSU), nhiệt độ hoặc khối lượng riêng của hai khối nước.
- Không có quá trình khuếch tán, phân tán cơ học, trộn do nhiễu động hoặc trao đổi giữa lớp mặt và lớp đáy.
- Đường halocline chỉ được kéo dài theo trục X bằng `scale.x`; không được tính từ trường độ mặn và không biểu thị độ dày vùng chuyển tiếp.
- Trong thực tế, vùng chuyển tiếp cửa sông có thể rõ hoặc khuếch tán tùy dòng sông, triều, hình học lòng dẫn và mức độ trộn. Một đường ranh cứng chỉ phù hợp như ký hiệu sơ đồ, không phải ranh mặn đo được.
- Khối nước mặn dạng hộp có cạnh thẳng, không thể hiện đầu nêm loãng dần hoặc trường độ mặn thay đổi theo chiều sâu.

### Xâm nhập mặn trong tầng chứa nước

- Phần giải thích giai đoạn cuối nói xâm nhập mặn cũng có thể xảy ra trong tầng nước ngầm.
- Cảnh 3D hiện tại chỉ có lòng sông và nêm mặn cửa sông; không có lớp đất/đá thấm nước, tầng chứa nước, mực nước ngầm, giếng khai thác hoặc vùng chuyển tiếp dưới đất.
- Không có dòng bổ cập, gradient thủy lực, độ thấm, độ rỗng hoặc bơm hút.
- Do đó, phần nội dung nước ngầm hiện không được hỗ trợ bởi mô hình hình học. Cần bỏ khỏi lời giải thích của chế độ cửa sông hoặc xây dựng chế độ riêng cho tầng chứa nước ven biển.

## Lỗi kỹ thuật và khả năng tiếp cận

1. Mũi tên dòng chảy di chuyển theo một hướng cố định; không thể hiện dòng triều đảo chiều hoặc dòng tầng đáy ngược hướng dòng mặt.
2. Giai đoạn “Triều đẩy nước mặn vào” không thay đổi nêm mặn; chỉ ẩn một số mũi tên. Đây là lỗi nhất quán giữa giai đoạn và hoạt ảnh.
3. Nêm mặn và halocline được điều khiển bằng các hệ số hình học độc lập; hai phần có thể không trùng khớp.
4. Vòng lặp `animate()` vẫn render khi `playing=false`; tạm dừng không dừng vòng lặp dựng hình.
5. Không có xử lý `prefers-reduced-motion`; mô hình tự chạy khi khởi tạo.
6. Không tạm dừng khi tab ở nền.
7. Hàm `destroy()` dừng RAF, tháo ResizeObserver/listener resize và dispose tài nguyên WebGL, nhưng các listener trên stage buttons, slider và nút điều khiển không được gỡ riêng; root không được làm rỗng.
8. Nhánh lỗi khởi tạo chỉ dispose renderer; cần kiểm tra giải phóng scene/geometry/material nếu lỗi xảy ra sau khi đã tạo một phần tài nguyên.
9. Biến `quality` được khai báo nhưng không dùng.

## Điều chỉnh bắt buộc trước khi tiếp nhận

1. Giữ phạm vi hiện tại là “phân tầng nước mặn trong cửa sông” nếu chỉ sử dụng mặt cắt sông–biển.
2. Phân biệt rõ cửa sông salt-wedge, cửa sông phân tầng một phần và cửa sông trộn đều. Không khẳng định mọi cửa sông đều có nêm mặn đáy.
3. Định nghĩa lưu lượng nước ngọt. Nếu giữ phần trăm, ghi rõ đó là chỉ số tương đối so với một giá trị tham chiếu; nếu muốn định lượng, dùng m³/s và công bố mặt cắt/điều kiện biên.
4. Bổ sung tham số thủy triều (biên độ, chu kỳ hoặc pha) và đảo chiều dòng theo chu kỳ nếu mô phỏng vai trò triều.
5. Bổ sung độ mặn, nhiệt độ hoặc mật độ và cơ chế trộn nếu muốn giải thích phân tầng; không để nêm mặn thay đổi chỉ bằng một tỷ lệ slider.
6. Thay hộp chữ nhật bằng hình nêm có đầu chuyển tiếp phù hợp; nếu muốn thể hiện vùng chuyển tiếp, dùng dải có độ dày và chú thích đó là vùng pha trộn, không phải ranh cứng.
7. Đồng bộ giai đoạn “Triều đẩy nước mặn vào” với thay đổi pha triều và vị trí nêm; đồng bộ giai đoạn “Nước ngọt đẩy mặn ra” với tăng lưu lượng sông.
8. Tách xâm nhập mặn tầng chứa nước thành một chế độ/mô hình riêng: có tầng chứa nước, mực nước ngầm, gradient thủy lực, dòng bổ cập, độ thấm và giếng khai thác.
9. Nếu chưa có mô hình vận chuyển muối, ghi rõ mọi vị trí ranh mặn và độ dài nêm là minh họa, không phải dự báo ranh mặn.
10. Hỗ trợ reduced motion, dừng render khi tạm dừng/tab nền và dọn listener/DOM khi hủy module.
11. Kiểm thử ở 320, 360, 390 và 430 CSS px; xác nhận nhãn, slider và mặt cắt không tràn hoặc che nhau.

## Ma trận kiểm thử bắt buộc

| Ca kiểm thử | Kết quả mong đợi |
|---|---|
| Dòng sông mạnh hơn | Nêm mặn có xu hướng rút về phía cửa biển trong mô hình salt-wedge |
| Dòng sông yếu hơn | Nêm mặn có xu hướng tiến sâu hơn nếu các điều kiện khác giữ nguyên |
| Triều lên | Có dòng mặn hướng ngược dòng và nêm tiến vào |
| Triều xuống | Dòng triều đảo chiều; trạng thái nêm phản ứng nhất quán |
| Lưu lượng và triều thay đổi | Không được suy ra ranh mặn chỉ từ một biến khi mô hình tuyên bố định lượng |
| Vùng chuyển tiếp | Không hiển thị như mặt phân cách sắc nét nếu mô hình mô tả vùng pha trộn |
| Cửa sông trộn đều | Không giữ một nêm mặn cố định nếu chế độ là well-mixed |
| Chế độ nước ngầm | Có tầng chứa nước, mực nước, giếng và vùng chuyển tiếp dưới đất |
| Stage buttons | Nội dung, mũi tên và vị trí nêm thay đổi cùng một trạng thái |
| Tạm dừng/reduced motion | Không tiếp tục animation không cần thiết |
| Điện thoại 320–430 CSS px | Mặt cắt, nhãn và điều khiển không tràn hoặc chồng lấn |

## Kết luận thẩm định

Mô hình hiện tại phù hợp nhất với một sơ đồ khái niệm cửa sông phân tầng kiểu salt-wedge. Ý tưởng nước mặn nặng hơn nằm dưới lớp nước ngọt và dòng sông mạnh hơn có xu hướng đẩy nêm mặn ra biển là đúng về định tính.

Mô hình chưa có thủy triều, lưu lượng có đơn vị, độ mặn, mật độ hoặc quá trình trộn. Phần xâm nhập mặn tầng chứa nước chưa được thể hiện. Có thể giữ cấu trúc mặt cắt cửa sông, nhưng cần xây dựng lại các biến và trạng thái nếu muốn giải thích định lượng. Không nên gộp cơ chế cửa sông và tầng chứa nước trong cùng một hình học.

Chỉ chuyển trạng thái sang `validated` sau khi xử lý các điểm chặn và kiểm thử thực tế.

## Nguồn tham khảo

- NOAA National Ocean Service. *Classifying Estuaries: By Water Circulation*. https://oceanservice.noaa.gov/education/tutorial_estuaries/est05_circulation.html
- U.S. Geological Survey. *Saltwater Intrusion*. https://www.usgs.gov/mission-areas/water-resources/science/saltwater-intrusion
- U.S. Geological Survey Ground-Water Resources Program. *Freshwater-Saltwater Interactions along the Atlantic Coast*. https://water.usgs.gov/ogw/gwrp/saltwater/salt.html
- U.S. Geological Survey. *Water Quality Factors Affecting Ground-Water Sustainability — Saltwater Intrusion*. https://pubs.usgs.gov/circ/circ1186/html/wq_factors.html
- U.S. Geological Survey. *Monitoring to Characterize Salt Intrusion in the Taunton River Estuary*. https://pubs.usgs.gov/publication/sir20245049/full

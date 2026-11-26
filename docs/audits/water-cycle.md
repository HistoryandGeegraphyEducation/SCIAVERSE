# Phiếu thẩm định — Vòng tuần hoàn nước

## 1. Phạm vi

Mô hình minh họa năm quá trình: bốc hơi, ngưng tụ, mưa, dòng chảy mặt và nước ngầm. Không đưa thoát hơi nước từ thực vật vào mô hình theo phạm vi đã xác định.

Mô hình không phải mô hình thủy văn định lượng và không tính cân bằng nước.

## 2. Cơ sở khoa học

- Bốc hơi: nước lỏng nhận năng lượng và chuyển thành hơi nước đi vào khí quyển.
- Ngưng tụ: không khí ẩm lạnh đi đến trạng thái bão hòa; hơi nước ngưng tụ thành giọt nước nhỏ hoặc tinh thể băng, góp phần hình thành mây.
- Giáng thủy: nước trong khí quyển trở lại bề mặt dưới dạng mưa, tuyết hoặc các dạng khác. Mô hình chỉ minh họa mưa.
- Dòng chảy mặt: phần nước không thấm hoặc không được giữ lại trên bề mặt có thể chảy theo địa hình vào suối, sông, hồ và đại dương.
- Nước ngầm: một phần nước thấm qua đất và đá, đi xuống vùng bão hòa, lưu trữ và di chuyển trong tầng chứa nước. Nước ngầm có thể bổ cập sông, suối hoặc thoát ra đại dương.

Chu trình nước được duy trì bởi năng lượng Mặt Trời và trọng lực. Nước có thể lưu chuyển qua nhiều kho chứa với thời gian lưu rất khác nhau.

## 3. Biểu diễn và giả định

- Đại dương, lục địa, sông, mây và tầng chứa nước là hình học giản đồ; không biểu diễn địa hình, địa chất hoặc lưu vực thực.
- Mũi tên chỉ hướng quá trình, không phải vector vận tốc hoặc lưu lượng đo được.
- Bốc hơi được minh họa từ mặt nước đại dương; không mô phỏng bốc hơi từ đất, hồ hoặc thực vật.
- Ngưng tụ được minh họa bằng mây và mũi tên hơi ẩm; hơi nước thực tế không nhìn thấy bằng mắt thường.
- Mưa chỉ là dạng giáng thủy được dựng trong mô hình; không có tuyết, mưa đá hoặc băng.
- Dòng chảy mặt đi theo địa hình tổng hợp; không tính thấm, trữ nước bề mặt, lưu lượng hoặc thủy đồ.
- Nước ngầm được biểu diễn bằng một lớp chứa nước giả định; không mô phỏng độ rỗng, độ thấm, mực nước ngầm, gradient thủy lực hoặc tương tác định lượng với sông.
- Không có thoát hơi nước từ thực vật, thăng hoa, đóng băng, tan băng hoặc cân bằng nước theo mùa.

## 4. Kiểm tra logic

Các trường hợp cần xác nhận:
- Bốc hơi: mũi tên đi lên từ mặt nước.
- Ngưng tụ: hơi ẩm hướng về vùng mây; không biểu diễn mây như hơi nước nhìn thấy.
- Mưa: giọt nước đi từ mây xuống bề mặt.
- Dòng chảy mặt: mũi tên theo sườn dốc về lòng dẫn và đại dương.
- Nước ngầm: nước thấm xuống tầng chứa nước, di chuyển trong tầng và có thể thoát ra gần bờ.
- Chuyển quá trình: chỉ nhóm mũi tên và hạt tương ứng hiển thị; các thành phần nền giữ nguyên.

Đây là kiểm tra logic mô hình. Chưa có kiểm thử runtime WebGL trong trình duyệt ở lượt triển khai này.

## 5. Nguồn tham khảo

1. U.S. Geological Survey. *The Water Cycle*. https://www.usgs.gov/special-topics/water-science-school/water-cycle. Cơ sở về các kho chứa và quá trình bốc hơi, ngưng tụ, giáng thủy, dòng chảy, thấm và nước ngầm.
2. National Oceanic and Atmospheric Administration. *The Water Cycle*. https://www.noaa.gov/education/resource-collections/freshwater/water-cycle. Đối chiếu các quá trình chuyển nước giữa bề mặt, đại dương và khí quyển.

## 6. Trạng thái

- Khoa học: `in-review`.
- Triển khai: `sciaverse-pilot-in-progress`.
- Đã tạo mô-đun HTML, JavaScript và CSS độc lập.
- Phạm vi loại trừ thoát hơi nước từ thực vật được ghi rõ trong giao diện và phiếu thẩm định.
- Chưa được xác nhận nghiệm thu khoa học.
- Chưa kiểm thử runtime trên trình duyệt hoặc thiết bị di động.

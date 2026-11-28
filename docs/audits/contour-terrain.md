# Phiếu thẩm định — Địa hình 3D và đường đồng mức

## 1. Phạm vi

Mô hình tạo một bề mặt địa hình tổng hợp bằng hàm độ cao giả định, sau đó dựng các đường đồng mức từ chính bề mặt đó. Người dùng thay đổi khoảng cao đều giữa các đường ở các mức 50 m, 100 m và 200 m.

Không sử dụng DEM quan trắc, tọa độ địa lí, hệ quy chiếu độ cao hoặc bản đồ địa hình thực.

## 2. Cơ sở khoa học

- Đường đồng mức nối các điểm có cùng độ cao so với một mặt chuẩn.
- Khoảng cao đều là chênh lệch độ cao giữa hai đường đồng mức kề nhau; trong một bản đồ, khoảng cao đều được giữ không đổi.
- Khi khoảng cao đều không đổi, các đường nằm gần nhau biểu thị sườn dốc hơn; các đường cách xa nhau biểu thị sườn thoải hơn.
- Đường đồng mức thông thường không cắt nhau vì một điểm trên bề mặt không thể có hai độ cao khác nhau. Trường hợp vách đá thẳng đứng hoặc địa hình nhô quá mức có thể làm các đường trùng hoặc chồng sát trên bản đồ.
- Các đường khép kín có thể biểu diễn đỉnh đồi hoặc vùng trũng; cần thêm ký hiệu phù hợp để phân biệt vùng trũng. Mô hình hiện tại không biểu diễn ký hiệu hachure.

## 3. Phương pháp dựng

- Bề mặt độ cao được tính trên lưới đều 84 × 56 ô bằng một hàm tổng hợp có hai đỉnh và một vùng trũng.
- Mặt địa hình được dựng bằng lưới tam giác. Cao độ tại mỗi đỉnh lưới được tính từ cùng hàm độ cao.
- Đường đồng mức được tính bằng nội suy tuyến tính trên các cạnh tam giác của chính lưới bề mặt. Cách này giữ đường đồng mức nằm trên bề mặt tam giác được hiển thị.
- Khoảng cao đều được chọn từ 50 m, 100 m hoặc 200 m. Đường chỉ số được làm đậm theo chu kỳ năm khoảng cao đều.
- Cao độ hiển thị là giá trị giả định để minh họa, không phải độ cao trên mực nước biển.

## 4. Giới hạn

- Bề mặt là địa hình tổng hợp, không phải dữ liệu đo đạc hoặc DEM.
- Hệ tọa độ, tỷ lệ bản đồ, datum độ cao và mực nước biển trung bình không được mô phỏng.
- Nội suy đường đồng mức là nội suy tuyến tính trên lưới tam giác; độ chi tiết phụ thuộc độ phân giải lưới.
- Trục ngang quy ước 1 đơn vị mô hình = 1 km. Cao độ được đổi sang tọa độ cảnh bằng hệ số 0,003; tương ứng phóng đại chiều đứng 3 lần so với tỉ lệ ngang.
- Không có nhãn số trên từng đường đồng mức, điểm độ cao, đường đồng mức phụ, ký hiệu vùng trũng hoặc quy tắc chữ V của thung lũng sông.
- Không dùng mô hình để đo độ cao, tính độ dốc thực hoặc định hướng ngoài thực địa.

## 5. Kiểm tra logic

Các trường hợp cần xác nhận:
- Thay đổi khoảng cao đều chỉ thay đổi các mức cao độ được vẽ, không thay đổi bề mặt địa hình.
- Mỗi đoạn đường đồng mức nằm trên tam giác địa hình tương ứng với đúng mức cao độ.
- Các đường đồng mức không tự cắt nhau trên bề mặt liên tục thông thường.
- Khoảng cách đường trên sườn dốc lớn hơn về độ dày hình học so với sườn thoải khi khoảng cao đều giữ nguyên.
- Chế độ xem 3D và camera không làm thay đổi giá trị cao độ.

Đây là kiểm tra logic mô hình. Đã có kiểm thử runtime bằng Chromium/Playwright; kết quả và phạm vi được ghi tại mục 8. Chưa kiểm thử trên thiết bị vật lý.

## 6. Nguồn tham khảo

1. U.S. Geological Survey. *Topographic Map Symbols*. https://pubs.usgs.gov/gip/TopographicMapSymbols/topomapsymbols.pdf. Định nghĩa đường đồng mức, khoảng cao đều, đường chỉ số và quan hệ giữa khoảng cách đường với độ dốc.
2. U.S. Geological Survey. *Lesson 4 — How to Read a Topographic Map*. https://pubs.usgs.gov/gip/70039472/lesson-4.pdf. Đối chiếu nguyên tắc đọc đường đồng mức và cách suy luận độ dốc.

## 7. Trạng thái

- Khoa học: `in-review`.
- Triển khai theo Registry: `verified-in-build` (CI Chromium/Playwright đạt).
- Đã tạo mô-đun HTML, JavaScript và CSS độc lập.
- Chưa được xác nhận nghiệm thu khoa học.
- Đã có kiểm thử runtime bằng Chromium/Playwright; kết quả và phạm vi được ghi tại mục 8. Chưa kiểm thử trên thiết bị vật lý.


## 8. Kiểm thử runtime và responsive

- Quy trình: GitHub Actions, workflow `SCIAVERSE validation`, run `46107069388`, kết quả `success`, commit `0c99e085fe7d89b3cf054d52a614b89e7af296cd`.
- Trình duyệt: Chromium headless với Playwright. Kiểm tra ở các chiều rộng 320, 360, 390 và 430 CSS px; kiểm tra lỗi JavaScript, tràn ngang, bảng kiến thức và chuyển nội dung nâng cao.
- Kiểm thử tương tác riêng: Kiểm tra thay đổi khoảng cao đều 50 m và khả năng dựng bề mặt/đường đồng mức.
- Kết quả xác nhận luồng giao diện và thao tác trong Chromium; không thay thế kiểm thử thiết bị vật lý, không xác nhận dữ liệu là quan trắc và không thay thế nghiệm thu khoa học.

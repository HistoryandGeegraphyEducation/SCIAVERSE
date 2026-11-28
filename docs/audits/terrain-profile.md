# Phiếu thẩm định — Chuyển lược đồ thành lát cắt địa hình

## 1. Phạm vi

Mô hình hiển thị một bề mặt độ cao tổng hợp, đường đồng mức và hai tuyến cắt vuông góc A–B, C–D. Khi chọn tuyến, mô hình dựng biểu đồ cao độ theo khoảng cách tương ứng.

Đây là mô hình phương pháp. Không dùng dữ liệu DEM, bản đồ địa hình hoặc tọa độ của địa điểm thực.

## 2. Cơ sở khoa học

Lát cắt địa hình là biểu diễn mặt cắt đứng của bề mặt theo một tuyến xác định. Để dựng lát cắt từ bản đồ địa hình, cần xác định vị trí giao của tuyến với các đường đồng mức, ghi nhận cao độ tương ứng, nội suy giữa các điểm và đặt chúng theo khoảng cách ngang.

Trục ngang biểu diễn khoảng cách dọc tuyến; trục đứng biểu diễn cao độ. Hình dạng lát cắt phụ thuộc tuyến được chọn và dữ liệu cao độ đầu vào.

## 3. Phương pháp trong mô hình

- Bề mặt độ cao được tạo từ cùng hàm địa hình tổng hợp với mô hình đường đồng mức.
- Tuyến A–B chạy theo trục đông–tây của bề mặt; tuyến C–D chạy theo trục bắc–nam.
- Mỗi tuyến được lấy mẫu tại 97 vị trí đều nhau. Cao độ tại mỗi vị trí được tính trực tiếp từ hàm độ cao giả định.
- Đường cắt được đặt trên bề mặt 3D; biểu đồ SVG biểu diễn cao độ theo khoảng cách.
- Khoảng cách ngang quy ước 1 đơn vị mô hình bằng 1 km. Hình 3D phóng đại đứng 3 lần; biểu đồ ghi rõ đơn vị km và m.
- Đường đồng mức 100 m được dựng từ cùng lưới tam giác để đối chiếu bề mặt và lát cắt.

## 4. Giới hạn

- Mô hình không đọc hoặc nội suy từ một bản đồ đường đồng mức có sẵn. Lát cắt được lấy mẫu từ hàm độ cao tổng hợp, còn đường đồng mức được tạo từ cùng bề mặt.
- Cao độ không quy chiếu mực nước biển hoặc datum độ cao cụ thể.
- Không có sai số đo, sai số nội suy, độ phân giải DEM hoặc dữ liệu địa hình quan trắc.
- Hai tuyến A–B và C–D là tuyến giả định, không đại diện cho đường cắt địa hình thực.
- Độ phóng đại đứng 3 lần chỉ áp dụng cho hình 3D; không được dùng để đo độ dốc thực.
- Biểu đồ chỉ thể hiện cao độ theo khoảng cách, không tính độ dốc, độ dài bề mặt hoặc thể tích địa hình.

## 5. Kiểm tra logic

Các trường hợp cần xác nhận:
- Chọn A–B: đường trên bề mặt và biểu đồ dùng cùng tuyến theo trục đông–tây.
- Chọn C–D: đường trên bề mặt và biểu đồ dùng cùng tuyến theo trục bắc–nam.
- Cao độ tại hai đầu tuyến trên biểu đồ khớp với cao độ của hai điểm đánh dấu trên bề mặt.
- Khoảng cách ngang hiển thị đúng 6,4 km cho A–B và 4,4 km cho C–D theo quy ước mô hình.
- Thay đổi tuyến không làm thay đổi bề mặt địa hình hoặc đường đồng mức.

Đây là kiểm tra logic mô hình. Đã có kiểm thử runtime bằng Chromium/Playwright; kết quả và phạm vi được ghi tại mục 8. Chưa kiểm thử trên thiết bị vật lý.

## 6. Nguồn tham khảo

1. U.S. Geological Survey. *Lesson 4 — How to Read a Topographic Map*. https://pubs.usgs.gov/gip/70039472/lesson-4.pdf. Cơ sở về biểu diễn bề mặt 3D trên bản đồ địa hình và đọc cao độ.
2. *Physical Geology — Drawing Contour Lines and Topographic Profiles*. https://pressbooks.bccampus.ca/geolmanualed2/chapter/overview-of-topographic-maps/. Cơ sở về dựng lát cắt địa hình từ đường đồng mức và tuyến cắt.

## 7. Trạng thái

- Khoa học: `in-review`.
- Triển khai theo Registry: `verified-in-build` (CI Chromium/Playwright đạt).
- Đã tạo mô-đun HTML, JavaScript và CSS độc lập.
- Chưa được xác nhận nghiệm thu khoa học.
- Đã có kiểm thử runtime bằng Chromium/Playwright; kết quả và phạm vi được ghi tại mục 8. Chưa kiểm thử trên thiết bị vật lý.


## 8. Kiểm thử runtime và responsive

- Quy trình: GitHub Actions, workflow `SCIAVERSE validation`, run `46107069388`, kết quả `success`, commit `0c99e085fe7d89b3cf054d52a614b89e7af296cd`.
- Trình duyệt: Chromium headless với Playwright. Kiểm tra ở các chiều rộng 320, 360, 390 và 430 CSS px; kiểm tra lỗi JavaScript, tràn ngang, bảng kiến thức và chuyển nội dung nâng cao.
- Kiểm thử tương tác riêng: Kiểm tra đổi tuyến sang C–D và cập nhật phần tóm tắt lát cắt.
- Kết quả xác nhận luồng giao diện và thao tác trong Chromium; không thay thế kiểm thử thiết bị vật lý, không xác nhận dữ liệu là quan trắc và không thay thế nghiệm thu khoa học.

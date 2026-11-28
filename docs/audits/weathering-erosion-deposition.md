# Phiếu thẩm định — Phong hóa, xâm thực và bồi tụ

## 1. Phạm vi

Mô hình trình bày ba quá trình ở bề mặt Trái Đất theo một mặt cắt địa hình giản đồ:
- Phong hóa cơ học: đá nứt vỡ tại chỗ.
- Xâm thực do dòng chảy: vật liệu bị tách và vận chuyển theo sườn dốc, lòng dẫn.
- Bồi tụ: vật liệu tích tụ khi khả năng vận chuyển của dòng giảm, minh họa tại cửa sông.

Không mô phỏng phong hóa hóa học, xâm thực do gió/băng, trượt lở do trọng lực hoặc cân bằng trầm tích định lượng.

## 2. Cơ sở khoa học

Phong hóa là quá trình phá vỡ vật lí hoặc biến đổi hóa học của đá tại hoặc gần vị trí ban đầu. Vật liệu bị phong hóa chưa nhất thiết đã di chuyển.

Xâm thực là quá trình tách, cuốn và vận chuyển vật liệu bởi nước, gió, băng hoặc trọng lực. Trong mô hình này, tác nhân được giới hạn ở dòng chảy mặt và dòng sông.

Bồi tụ xảy ra khi vật liệu được vận chuyển lắng xuống và tích tụ ở vị trí mới. Trong dòng sông, khi vận tốc hoặc năng lượng dòng giảm, khả năng mang tải có thể giảm và trầm tích được lắng đọng. Ở cửa sông, trầm tích tích tụ có thể góp phần hình thành châu thổ; hình thái thực tế phụ thuộc sóng, thủy triều, dòng sông và nguồn cung trầm tích.

## 3. Biểu diễn và giả định

- Địa hình được tạo bằng hàm bề mặt tổng hợp để minh họa một sườn núi nối với vùng thấp; không phải địa hình đo đạc.
- Phong hóa chỉ thể hiện nứt vỡ cơ học. Các mảnh vụn được đặt gần đá mẹ, không mô phỏng tốc độ phá vỡ hoặc phản ứng hóa học.
- Xâm thực chỉ thể hiện vật liệu được dòng nước vận chuyển theo hướng xuống thấp. Mũi tên và hạt trầm tích là ký hiệu, không phải quỹ đạo hạt tính toán.
- Bồi tụ được biểu diễn bằng một khối trầm tích giản đồ tại vùng thấp/cửa sông. Không tính độ hạt, tốc độ lắng, tải lượng phù sa hoặc hình thái châu thổ thực.
- Không có số liệu về lưu lượng, vận tốc, độ dốc thực, kích thước hạt, mật độ, độ kết dính hoặc sức kháng xói.
- Hình học và kích thước các thành phần không theo tỉ lệ không gian hoặc thời gian địa chất.
- Ba chế độ được tách riêng để làm rõ khái niệm. Trong tự nhiên, phong hóa, xâm thực, vận chuyển và bồi tụ có thể diễn ra đồng thời ở các vị trí khác nhau.

## 4. Kiểm tra logic

Các trường hợp cần xác nhận:
- Phong hóa: khối đá nứt vỡ và mảnh vụn nằm gần nguồn; không biểu diễn vận chuyển ra xa.
- Xâm thực: hạt trầm tích và mũi tên nằm dọc sườn dốc/lòng dẫn theo hướng xuống thấp.
- Bồi tụ: vật liệu tích tụ ở vùng thấp; không mô tả đây là quá trình tạo ra vật liệu mới.
- Chuyển chế độ: chỉ nhóm hình học tương ứng hiển thị; tiêu đề và giải thích đổi cùng trạng thái.

Đây là kiểm tra logic giao diện. Đã có kiểm thử runtime bằng Chromium/Playwright; kết quả và phạm vi được ghi tại phần kiểm thử cập nhật. Chưa kiểm thử trên thiết bị vật lý.

## 5. Nguồn tham khảo

1. U.S. National Park Service. *Weathering, Erosion, and Deposition*. https://www.nps.gov/subjects/erosion/about.htm. Định nghĩa phong hóa tại chỗ, xâm thực là vận chuyển vật liệu và bồi tụ khi vật liệu rời khỏi dòng vận chuyển.
2. U.S. Geological Survey. *Sedimentary Rocks and Processes*, Bulletin 2195. https://pubs.usgs.gov/bul/2195/b2195.pdf. Cơ sở về phong hóa vật lí/hóa học, tác nhân vận chuyển và phân loại vật liệu trầm tích.
3. *Physical Geology — Stream Erosion and Deposition*. https://opentextbc.ca/physicalgeology2ed/chapter/13-3-stream-erosion-and-deposition/. Cơ sở về vận chuyển trầm tích trong dòng chảy, vai trò của vận tốc, lưu lượng và sự lắng đọng khi dòng chậm lại.

## 6. Trạng thái

- Khoa học: `in-review`.
- Triển khai theo Registry: `verified-in-build` (CI Chromium/Playwright đạt).
- Đã tạo mô-đun HTML, JavaScript và CSS độc lập.
- Chưa được xác nhận nghiệm thu khoa học.
- Đã có kiểm thử runtime bằng Chromium/Playwright; kết quả và phạm vi được ghi tại phần kiểm thử cập nhật. Chưa kiểm thử trên thiết bị vật lý.


## Cập nhật mô hình — 28/11/2026

- Khối bồi tụ được dựng theo phương thẳng đứng như một nón cụt thấp đặt trên bề mặt địa hình; các hạt trầm tích được đặt theo bề mặt khối nón. Các mũi tên xâm thực được đặt theo cao độ địa hình tại các điểm đầu, giữa và cuối.
- Địa hình, dòng chảy và trầm tích vẫn là hình học tổng hợp. Không có dữ liệu địa hình, lưu lượng hoặc tải lượng trầm tích quan trắc.

## Kiểm thử runtime — 28/11/2026

- GitHub Actions workflow `SCIAVERSE validation`, run `46107719993`, kết quả `success`, commit `eff7290536d290e83d47395061eb232d7af95ab0`.
- Chromium/Playwright chuyển đổi ba quá trình phong hóa, xâm thực và bồi tụ; kiểm tra mã xác nhận khối bồi tụ không còn bị xoay nằm ngang.
- Responsive smoke test kiểm tra 320, 360, 390 và 430 CSS px. Không thay thế kiểm chứng bằng địa hình hoặc dữ liệu trầm tích thực.

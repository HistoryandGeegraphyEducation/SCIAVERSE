# Thẩm định nguồn gốc — Sạt lở đất

- Mã nguồn: `EDUVERSE/simulations/natural-hazards/sat-lo-dat/main.js`
- Trạng thái: `in-review`
- Phạm vi: độ bão hòa, ổn định sườn dốc, mặt trượt và chuyển động khối đất.

## Căn cứ khoa học

USGS định nghĩa sạt lở là sự dịch chuyển khối đá, đất hoặc vật liệu vụn xuống dốc dưới tác động trọng lực; nguyên nhân thường kết hợp nhiều yếu tố làm tăng lực gây trượt hoặc giảm sức kháng: https://www.usgs.gov/faqs/what-a-landslide-and-what-causes-one?page=1 . Mưa có thể làm tăng độ ẩm và áp lực nước trong lỗ rỗng, ảnh hưởng đến ổn định sườn dốc: https://www.usgs.gov/programs/landslide-hazards/science/overview-rainfall-induced-landslides .

## Kết quả đọc mã

- Đầu vào là độ bão hòa đất 10–100%.
- Địa hình sườn dốc và mặt trượt được tạo bằng hàm hình học; không có dữ liệu địa chất công trình.
- Khối đất chuyển động theo slider và giai đoạn; chưa tính lực gây trượt, sức kháng cắt, áp lực nước lỗ rỗng hoặc hệ số an toàn.
- Lời giải thích đã nêu vai trò của độ dốc, vật liệu, nước và tác động bên ngoài; tuy nhiên các biến này không được điều khiển hoặc tính toán trong mô hình.

## Điều chỉnh bắt buộc trước khi tiếp nhận

1. Không xem độ bão hòa là biến duy nhất quyết định sạt lở.
2. Nếu muốn mô hình định lượng, cần lựa chọn mô hình ổn định sườn dốc phù hợp và khai báo góc dốc, trọng lượng thể tích, lực dính kết, góc ma sát trong và áp lực nước lỗ rỗng.
3. Nếu dùng mô hình khái niệm, thể hiện rõ quan hệ “mưa → thấm/áp lực nước lỗ rỗng → giảm ứng suất hữu hiệu/sức kháng → mất ổn định” mà không gán ngưỡng phần trăm giả.
4. Phân biệt trượt, đổ, lật, trải ngang và dòng chảy; một khối trượt dạng slab không đại diện cho mọi loại sạt lở.
5. Nêu rõ địa hình và địa tầng là sơ đồ giả định; không dùng để đánh giá nguy cơ một vị trí thực.

Chưa đủ điều kiện nghiệm thu.

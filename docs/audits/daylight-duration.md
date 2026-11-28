# Phiếu rà soát kỹ thuật — Hiện tượng ngày đêm dài ngắn theo mùa

## 1. Phạm vi

Trang tính thời lượng ban ngày theo vĩ độ địa lí và xích vĩ Mặt Trời tại ba trường hợp: phân điểm, hạ chí và đông chí. Đây là phép tính hình học cho đường chân trời, không phải dữ liệu quan trắc hoặc dự báo thời tiết.

## 2. Cơ sở khoa học

Với vĩ độ địa lí \(\varphi\) và xích vĩ Mặt Trời \(\delta\), góc giờ lúc Mặt Trời mọc hoặc lặn thỏa mãn:

\[
\cos H_0=-\tan\varphi\tan\delta
\]

Khi biểu thức nằm trong khoảng \([-1,1]\), thời lượng ban ngày hình học được tính:

\[
D=\frac{24H_0}{\pi}
\]

Trong đó \(H_0\) tính bằng radian và \(D\) tính bằng giờ. Khi biểu thức ngoài khoảng, mô hình xử lí trường hợp ngày cực hoặc đêm cực. Tại vĩ độ 90° và xích vĩ 0°, mô hình đặt thời lượng bằng 12 giờ để tránh bất định số học tại điểm cực.

## 3. Giả định và giới hạn

- Trái Đất được coi là hình cầu.
- Đường chân trời hình học được dùng làm chuẩn.
- Không hiệu chỉnh khúc xạ khí quyển hoặc bán kính biểu kiến của Mặt Trời.
- Ba giá trị xích vĩ là các trường hợp đại diện, không phải dữ liệu thiên văn theo ngày của một năm cụ thể.
- Kết quả là thời lượng chiếu sáng hình học, không phải thời điểm mặt trời mọc/lặn thực tế tại một địa điểm.
- Trang có mô hình 3D minh họa hướng chiếu sáng; kết quả số được tính từ công thức hình học ở trên.

## 4. Kiểm tra logic

- Khi \(\delta=0°\), thời lượng ngày bằng 12 giờ ở các vĩ độ, theo quy ước hình học của mô hình.
- Ở bán cầu Bắc, hạ chí cho ngày dài hơn hoặc bằng 12 giờ; đông chí cho ngày ngắn hơn hoặc bằng 12 giờ.
- Ở bán cầu Nam, quan hệ mùa đảo ngược.
- Khi điều kiện hình học vượt ngưỡng, kết quả chuyển sang 24 giờ hoặc 0 giờ.

## 5. Nguồn tham khảo

1. U.S. Naval Observatory. *The Seasons and the Earth's Orbit*. https://aa.usno.navy.mil/faq/seasons_orbit.
2. U.S. Naval Observatory. *Rise, Set, and Twilight Definitions*. https://aa.usno.navy.mil/faq/RST_defs.

## 6. Trạng thái

- Khoa học: not-reviewed.
- Triển khai: sciaverse-pilot-in-progress.
- Tài liệu này ghi nhận công thức và giả định được tìm thấy trong mã nguồn; không phải quyết định nghiệm thu khoa học.
- Trang đã được mở trong kiểm thử Chromium ở bốn kích thước 320, 360, 390 và 430 CSS px; không phát sinh lỗi JavaScript hoặc tràn chiều ngang trong lượt kiểm thử.
- Chưa kiểm tra riêng khả năng khởi tạo WebGL và các phép tính trên thiết bị vật lí.
- Trạng thái khoa học vẫn là `not-reviewed`.

Hãy kiểm tra lại toàn bộ thư mục `templates` sau khi đã đồng bộ spacing.

Yêu cầu:

- Không chỉnh đại trà nữa
- Chỉ tìm các chỗ layout còn lệch hoặc spacing chưa đồng nhất
- So sánh giữa header, main content, card grid và footer
- Tìm các class Tailwind còn gây lệch như px khác nhau, gap khác nhau, margin quá lớn/quá nhỏ
- Chỉ sửa các outlier còn sót lại
- Không đổi logic
- Không đổi màu
- Không đổi nội dung chữ
- Trả về danh sách file đã sửa và đoạn code/class đã thay đổi

Ưu tiên kiểm tra:

- px-\*
- md:px-\*
- py-\*
- gap-\*
- mb-\*
- mt-\*
- p-\*
- grid-cols
- max-w
- w-full
- container
- flex alignment

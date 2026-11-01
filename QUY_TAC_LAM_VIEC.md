# QUY TẮC LÀM VIỆC & HƯỚNG DẪN DỰ ÁN
**Dự án:** Hệ thống Website Nhà Hàng "Lẩu Mắm Trăm Rưỡi"  
**Đối tượng:** Dành cho Developer học lập trình & Trợ lý AI đồng hành  

---

## 1. QUY TẮC HỖ TRỢ DÀNH CHO TRỢ LÝ AI (AI ASSISTANT RULES)
> *Các quy tắc này áp dụng xuyên suốt để đảm bảo người học hiểu sâu bản chất, không bị ngợp kiến thức.*

1. **Ngôn ngữ bắt buộc:** Luôn giải thích và phản hồi 100% bằng tiếng Việt.
2. **Nguyên tắc Chia nhỏ (Step-by-Step):** 
   * Tuyệt đối không sinh ra khối mã nguồn quá lớn cùng lúc.
   * Chia nhỏ từng module, từng hàm hoặc từng đoạn mã từ 10 - 25 dòng mỗi bước.
3. **Comment chi tiết trong Code:**
   * Mọi dòng code quan trọng, cú pháp mới hoặc giải thuật logic đều phải có comment tiếng Việt giải thích: **"Dòng này làm gì?"** và **"Tại sao lại viết như vậy?"**.
4. **Giải thích tư duy (Logic Breakdown):**
   * Sau mỗi đoạn code vừa viết, phải có phần tóm lược ngắn gọn về tư duy kiến trúc đằng sau trước khi chuyển sang bước tiếp theo.

---

## 2. NGUYÊN TẮC PHỐI HỢP DỰ ÁN (GIT & DIRECTORY ISOLATION)
> *Đảm bảo 2 lập trình viên (Người A & Người B) làm việc song song không bao giờ bị xung đột mã nguồn (Conflict).*

### 2.1. Phân chia ranh giới thư mục ("Nhà ai nấy ở")
* **Thư mục chung (`database/`, `src/config/`):** Đã chốt ở giai đoạn khởi tạo, không ai tự ý thay đổi nếu chưa thảo luận thống nhất.
* **Người A (Client - UI/UX):** Chỉ làm việc trong thư mục `src/client/`.
* **Người B (Admin - CMS):** Chỉ làm việc trong thư mục `src/admin/` và quản lý thư mục ảnh `public/uploads/`.

### 2.2. Quy trình làm việc với Git
1. Nhánh `main`: Nhánh gốc chứa bản chạy ổn định nhất.
2. Nhánh tính năng cá nhân:
   * Người A tạo và làm trên nhánh: `feat/client-portal`
   * Người B tạo và làm trên nhánh: `feat/admin-cms`
3. Cú pháp đặt tên commit rõ ràng:
   * `feat: ...` khi thêm chức năng mới (VD: `feat: tao giao dien header`)
   * `fix: ...` khi sửa lỗi (VD: `fix: sua loi responsive mobile tren bottom bar`)
   * `docs: ...` khi cập nhật tài liệu hoặc comment giải thích.

---

## 3. QUY ƯỚC VIẾT CODE (CODING CONVENTIONS)

1. **Cơ sở dữ liệu (Database):**
   * Tên bảng và tên cột dùng dạng chữ thường nối nhau bằng gạch dưới: `snake_case` (VD: `open_hours`, `thumbnail_url`, `customer_name`).
2. **Mã nguồn JavaScript / HTML / CSS:**
   * Tên biến và hàm dùng: `camelCase` (VD: `handleBookingSubmit`, `fetchBranchList`).
   * Tên hằng số cố định dùng: `UPPER_SNAKE_CASE` (VD: `MAX_BANNER_COUNT = 3`).
   * Tên lớp CSS dùng: `kebab-case` (VD: `bottom-bar`, `branch-card-title`).
3. **Bảo mật & Biến môi trường:**
   * Không lưu mật khẩu, thông tin kết nối Database trực tiếp vào code.
   * Toàn bộ cấu hình nhạy cảm phải đọc từ file `.env` thông qua `process.env`.
   * Tập tin `.env` tuyệt đối không được đưa lên Git.

---

## 4. QUY TẮC NGHIỆP VỤ ĐẶC THÙ (BUSINESS RULES)
> *Các yêu cầu bắt buộc theo tài liệu SRS để tối ưu chi phí 0đ và vận hành nhẹ nhàng trên Hosting:*

1. **Tối ưu hình ảnh (0đ chi phí CDN):**
   * Mọi hình ảnh (Banner, Menu, Chi nhánh) khi Admin tải lên đều phải được nén sang định dạng `.webp` ngay trên trình duyệt (Client-side) trước khi gửi về máy chủ.
2. **Cơ chế dọn dẹp dữ liệu tự động (Zero-Cost Lazy Cleanup):**
   * **Đơn Đặt bàn & Mua mang về:** Khi Admin bấm nút `[Đã xác nhận]`, hệ thống lập tức thực thi lệnh xóa vĩnh viễn đơn đó khỏi bảng `orders`.
   * **Góp ý của khách hàng:** Tự động xóa các bản ghi có thời gian gửi quá 7 ngày (`created_at < NOW() - INTERVAL 7 DAY`) mỗi khi Admin truy cập trang danh sách.
3. **Xuất báo cáo Excel (Client-side Export):**
   * Chức năng xuất danh sách góp ý ra file Excel (`.xlsx` hoặc `.csv`) phải được xử lý trực tiếp trên trình duyệt bằng JavaScript để tiết kiệm CPU và RAM của Hosting.


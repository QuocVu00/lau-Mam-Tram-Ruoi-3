# KẾ HOẠCH PHÂN CHIA NHIỆM VỤ (LÀM VIỆC SONG SONG - KHÔNG CONFLICT)
**Dự án:** Website Giới thiệu Hệ thống Cửa hàng, Đặt bàn & Mua mang về  
**Quy mô nhân sự:** 02 Developers (Người A & Người B)  
**Nguyên tắc cốt lõi:** Tách biệt hoàn toàn thư mục (*Directory Isolation*) & Chốt cấu trúc dữ liệu trước khi code (*Contract-First*).

---

## 1. QUY TẮC VÀNG CHỐNG CONFLICT (LÀM CHUNG TRONG 30 PHÚT ĐẦU)

Trước khi tách nhánh (branch) để code độc lập, cả 2 người cần ngồi lại thống nhất và đẩy lên nhánh `main` 3 thành phần nền tảng sau:

### 1.1. Chốt Database Schema (1 người tạo file SQL/Migration dùng chung)
* **`settings`**: Lưu tối đa 3 ảnh Hero Banner và 2 ảnh Menu trang chủ.
* **`branches`**: `id`, `name`, `slug`, `thumbnail_url` (ảnh đại diện ngoài trang chủ), `open_hours`, `address`, `intro_content`, `gallery_images`, `promo_banner_url` (banner khuyến mãi riêng).
* **`seeding_reviews` (Đánh giá ảo do Admin tạo)**: `id`, `branch_id` (`NULL` nếu hiển thị ở trang chủ, có giá trị nếu thuộc chi nhánh), `author_name`, `rating`, `content` (Giới hạn tối đa 3 bản ghi mỗi vị trí).
* **`orders` (Đơn Đặt bàn & Mua mang về)**: `id`, `branch_id`, `type` (`BOOKING` | `TAKEAWAY`), `customer_name`, `phone`, `guest_count`, `delivery_address`, `created_at`.
* **`customer_feedbacks` (Góp ý thực tế của khách)**: `id`, `branch_id`, `content`, `created_at` (dùng để kiểm tra xóa tự động sau 7 ngày).

### 1.2. Tạo sẵn Dữ liệu mẫu (`seed.sql`)
* Tạo sẵn 2 chi nhánh mẫu, 3 banner mẫu, 2 ảnh menu mẫu và vài đánh giá ảo trong Database.
* **Mục đích:** Giúp **Người A (Client)** có sẵn dữ liệu để dựng giao diện ngay lập tức mà không cần chờ **Người B (Admin)** code xong tính năng thêm/sửa/xóa.

### 1.3. Khởi tạo Khung Thư mục Tách biệt
* Chia rõ thư mục làm việc của từng người ngay từ commit đầu tiên. Không ai tự ý sửa file nằm trong thư mục của người kia.

---

## 2. CẤU TRÚC THƯ MỤC TÁCH BIỆT (AI LÀM NHÀ NẤY)

```text
project-root/
├── database/                  # [CHUNG] Chốt ở 30p đầu, không ai tự ý sửa sau đó
│   ├── schema.sql             
│   └── seed.sql               
├── public/uploads/            # [NGƯỜI B] Thư mục lưu ảnh `.webp` do Admin tải lên
├── src/
│   ├── config/                # [CHUNG] Kết nối Database, biến môi trường (.env)
│   ├── client/                # 👉 [NGƯỜI A] Toàn quyền xử lý trong thư mục này
│   │   ├── pages/             # Trang chủ (Intro), Trang chi tiết chi nhánh
│   │   ├── components/        # Header, Footer, Sticky Bottom Bar, 3 Social Icons, Modals
│   │   ├── animations/        # Scroll Reveal, Hover Zoom, Lightbox Menu
│   │   └── api/               # API đọc dữ liệu (GET) & gửi đơn/góp ý (POST)
│   └── admin/                 # 👉 [NGƯỜI B] Toàn quyền xử lý trong thư mục này
│       ├── pages/             # Đăng nhập, Quản lý Đơn, Chi nhánh, Banner/Menu, Góp ý
│       ├── components/        # Bảng dữ liệu, Bộ lọc, Form upload nén ảnh WebP
│       ├── utils/             # Xuất file Excel/CSV, Nén ảnh, Cron/Lazy-delete 7 ngày
│       └── api/               # API thêm/sửa/xóa của Admin & Xóa ngầm đơn xác nhận
```

---

## 3. BẢNG PHÂN CÔNG NHIỆM VỤ CHI TIẾT

| Hạng mục | 👤 Người A: Phân hệ Khách hàng (Client Portal & UI/UX) | 👤 Người B: Phân hệ Quản trị (Admin CMS & Xử lý Ngầm) |
| :--- | :--- | :--- |
| **Phạm vi File** | Chỉ làm việc trong `src/client/*` | Chỉ làm việc trong `src/admin/*` |
| **Giao diện Cố định** | - **Responsive 3 khung hình** (Mobile < 768px, Tablet 768–1024px, Laptop > 1024px).<br>- **Header, Footer** và **3 nút nổi góc phải** (TikTok, Zalo, Facebook).<br>- **Sticky Bottom Bar** ghim đáy màn hình chứa nút `[Đặt bàn]`, `[Mua mang về]`, `[Khách đánh giá]`. | - Giao diện **Đăng nhập Admin** (`/admin/login`).<br>- **Admin Layout** (Thanh điều hướng giữa 4 mục: Đơn hàng, Chi nhánh & Nội dung, Đánh giá ảo, Góp ý khách hàng). |
| **Trang chính & Hiệu ứng** | - **Trang chủ (Intro):** Slider 3 ảnh banner, bài giới thiệu hiệu ứng *Scroll Reveal* mượt mà, khu vực 2 ảnh Menu có *Lightbox phóng to*, danh sách Chi nhánh (*Hover Zoom*), 3 đánh giá nổi bật.<br>- **Trang Chi tiết Chi nhánh:** Hiển thị thông tin chi nhánh, bộ ảnh, Banner khuyến mãi riêng và 3 đánh giá ảo của chi nhánh đó. | - **CMS Quản lý Banner & Menu:** Giao diện tải lên/thay thế tối đa 3 ảnh Hero Banner và 2 ảnh Menu.<br>- **CMS Quản lý Chi nhánh:** Thêm, sửa, xóa chi nhánh (tên, giờ mở cửa, địa chỉ, ảnh đại diện, nội dung chi tiết, banner khuyến mãi).<br>- **CMS Đánh giá ảo:** Tạo/sửa/xóa đánh giá mẫu (chặn giới hạn tối đa 3 đánh giá cho trang chủ và 3 đánh giá/chi nhánh). |
| **Tương tác & Biểu mẫu** | - **3 Pop-up Modal:** Đặt bàn, Mua mang về, Góp ý.<br>- **Logic chọn chi nhánh:** Cho phép chọn từ dropdown khi ở Trang chủ; **tự động gán cứng** chi nhánh đang xem khi ở Trang chi tiết.<br>- Hiển thị đúng câu thông báo Pop-up cảm ơn theo đặc tả sau khi khách ấn "Đồng ý". | - **Quản lý Đơn Đặt bàn / Mang về:** Hiển thị danh sách đơn theo thời gian thực (kèm tên cửa hàng). Nút **[Đã xác nhận]** gọi lệnh xóa vĩnh viễn đơn khỏi DB.<br>- **Quản lý Góp ý (7 ngày):** Xem và lọc danh sách góp ý theo từng chi nhánh. |
| **Kỹ thuật & API** | - Viết API `GET` lấy thông tin trang chủ & chi tiết chi nhánh.<br>- Viết API `POST` lưu đơn Đặt bàn, Mua mang về và Góp ý của khách vào DB. | - **Tự động nén ảnh `.webp`** trên trình duyệt trước khi upload lên Hosting.<br>- **Xuất file Excel/CSV** danh sách góp ý của khách.<br>- **Lazy Cleanup:** Tự động chạy lệnh `DELETE` xóa các góp ý có `created_at < NOW() - 7 ngày` mỗi khi Admin truy cập. |

---

## 4. LỘ TRÌNH PHỐI HỢP & QUY TRÌNH GIT (WORKFLOW 3 GIAI ĐOẠN)

### Giai đoạn 1: Khởi tạo (Ngày 1 - Làm chung 30 phút)
1. Tạo Git Repository chung.
2. Đẩy cấu trúc thư mục, file kết nối DB, `schema.sql` và `seed.sql` lên nhánh `main`.
3. **Tách nhánh làm việc riêng:**
   * Người A chạy lệnh: `git checkout -b feat/client-portal`
   * Người B chạy lệnh: `git checkout -b feat/admin-cms`

### Giai đoạn 2: Code Độc lập (Song song 100%)
* **Người A** sử dụng dữ liệu từ `seed.sql` để dựng toàn bộ giao diện Trang chủ, Trang chi nhánh, hiệu ứng chuyển động và làm chức năng gửi form Đặt bàn / Mua mang về / Đánh giá chảy thẳng vào bảng `orders` và `customer_feedbacks`.
* **Người B** làm trang Admin đọc dữ liệu từ bảng `orders`, `customer_feedbacks` để xử lý xác nhận xóa đơn, xuất Excel, xóa tự động sau 7 ngày, và làm chức năng upload ảnh `.webp` cập nhật ngược lại vào bảng `branches`, `settings`, `seeding_reviews`.
* *Lưu ý quan trọng:* Nếu phát sinh việc phải cài thêm thư viện ngoài (làm thay đổi file `package.json` hoặc `composer.json`), người cài cần nhắn ngay vào nhóm chat để người kia `git pull` file cấu hình đó về tránh lệch phiên bản.

### Giai đoạn 3: Ghép nối & Kiểm thử (Merge & End-to-End Test)
1. Cả 2 cùng tạo Pull Request và merge nhánh của mình vào `main` (vì khác thư mục hoàn toàn nên Git sẽ **Auto-merge 100%** không bị xung đột code).
2. **Kiểm thử liên thông 3 luồng chính (Checklist nghiệm thu):**
   * [ ] **Luồng 1 (Quản trị Nội dung):** Người B vào Admin đổi ảnh Banner, Menu, thêm 1 chi nhánh mới $\rightarrow$ Người A tải lại Trang chủ kiểm tra ảnh `.webp` và chi nhánh mới đã hiển thị đúng bố cục 3 khung hình (Mobile, Tablet, Laptop).
   * [ ] **Luồng 2 (Đặt bàn & Mua mang về):** Người A vào Trang chủ và Trang chi tiết chi nhánh bấm Đặt bàn & Mua mang về $\rightarrow$ Kiểm tra Pop-up cảm ơn $\rightarrow$ Người B vào Admin kiểm tra đơn nổi lên đúng tên chi nhánh và bấm **[Đã xác nhận]** xem đơn có tự động xóa ngầm khỏi Database không.
   * [ ] **Luồng 3 (Góp ý & Tự xóa 7 ngày):** Người A gửi đánh giá theo chi nhánh $\rightarrow$ Người B lọc theo chi nhánh, bấm xuất thử file Excel, và chỉnh thử `created_at` trong DB lùi về 8 ngày trước xem hệ thống có tự động dọn sạch không.
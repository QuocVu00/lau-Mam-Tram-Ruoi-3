# TÀI LIỆU ĐẶC TẢ YÊU CẦU HỆ THỐNG (SRS)
**Dự án:** Website Giới thiệu Hệ thống Cửa hàng, Đặt bàn & Mua mang về  
**Mục tiêu hạ tầng:** Tối ưu hoàn toàn trên Domain & Hosting sẵn có (Chi phí phát sinh = 0đ)

---

## 1. ĐỊNH HƯỚNG GIAO DIỆN & TRẢI NGHIỆM (UI/UX)

### 1.1. Thiết kế Đáp ứng (Responsive 3 Khung hình)
* **Điện thoại (Mobile < 768px):** Giao diện hiển thị 1 cột dọc, tối ưu thao tác vuốt chạm. Thanh công cụ dưới cùng (Bottom Action Bar) vừa tầm ngón tay cái.
* **Máy tính bảng (Tablet 768px – 1024px):** Giao diện lưới 2 cột cân đối cho danh sách chi nhánh và thực đơn.
* **Laptop / PC (> 1024px):** Giao diện rộng, tận dụng không gian hiển thị hình ảnh lớn sắc nét, lưới 3 cột cho danh sách chi nhánh.

### 1.2. Phong cách & Hiệu ứng Chuyển động (Học hỏi từ Landing Page F&B hiện đại)
* **Scroll Reveal (Hiệu ứng cuộn trang):** Khi khách hàng cuộn chuột tới đâu, các khối nội dung giới thiệu và hình ảnh sẽ trượt nhẹ từ dưới lên (Fade-in Up) tạo cảm giác mượt mà, cao cấp.
* **Hover Zoom:** Khi di chuột vào ảnh chi nhánh hoặc ảnh thực đơn, bức ảnh phóng to nhẹ (`scale 1.05x`) mượt mà.
* **Lightbox Thực đơn:** Khi khách nhấn vào 2 ảnh Menu, hỗ trợ phóng to toàn màn hình (Zoom-in) để xem rõ tên món và giá tiền trên điện thoại.

---

## 2. PHÂN HỆ KHÁCH HÀNG (CLIENT ROLE)

### 2.1. Các Thành phần Cố định (Hiển thị xuyên suốt)
1. **Header (Đầu trang):** Logo thương hiệu, thanh điều hướng cuộn nhanh tới các mục (Giới thiệu, Thực đơn, Chi nhánh, Đánh giá/Góp ý).
2. **Floating Social Icons (Góc phải màn hình):** 3 icon nổi cố định gồm **TikTok, Zalo, Facebook** kèm hiệu ứng chuyển động nhẹ thu hút sự chú ý. Nhấn vào sẽ chuyển hướng sang trang mạng xã hội tương ứng.
3. **Sticky Bottom Bar (Thanh công cụ cố định ở chân màn hình):** 
   * Thiết kế tương tự Header nhưng ghim cố định ở mép dưới màn hình.
   * Bao gồm các nút chức năng chính: **[Đặt bàn]**, **[Mua mang về]** và **[Khách đánh giá]**.
4. **Footer (Cuối trang):** Thông tin thương hiệu, địa chỉ trụ sở, hotline tổng đài, giờ mở cửa chung, bản quyền website.

---

### 2.2. Trang Chủ (Intro / Home Page)
1. **Hero Banner (Đầu trang):** Trình chiếu (Slider) tối đa **3 ảnh banner** do Admin tải lên.
2. **Giới thiệu chi tiết cửa hàng (Intro Section):** Bài viết giới thiệu câu chuyện thương hiệu, không gian quán kết hợp bố cục hình ảnh so le và hiệu ứng chuyển động mượt mà.
3. **Khu vực Thực đơn (Menu Section):** Hiển thị **2 ảnh thực đơn** do Admin tùy chỉnh và tải lên.
4. **Danh sách Cửa hàng / Chi nhánh (Branch List):**
   * Sắp xếp theo bố cục lưới hợp lý, rõ ràng.
   * Mỗi thẻ chi nhánh hiển thị: **01 Ảnh đại diện** (do Admin chỉ định) + **Tên chi nhánh** + **Thời gian mở cửa** + **Địa chỉ**.
   * **Tương tác:** Khi nhấp vào một cửa hàng bất kỳ $\rightarrow$ Chuyển sang **Trang Chi tiết Cửa hàng** đó.
5. **Đánh giá nổi bật (Trang tổng):** Hiển thị tối đa **3 đánh giá tiêu biểu** do Admin tạo để tăng độ uy tín cho thương hiệu.

---

### 2.3. Trang Chi tiết Cửa hàng (Branch Detail Page)
1. **Giới thiệu chi tiết chi nhánh:** Hình ảnh không gian quán, bài viết giới thiệu riêng của chi nhánh với hiệu ứng làm đẹp giao diện.
2. **Chương trình Khuyến mãi:** Hiển thị **Banner khuyến mãi** riêng đang áp dụng tại chi nhánh đó.
3. **Đánh giá tại chi nhánh:** Hiển thị tối đa **3 đánh giá ảo** do Admin tạo riêng cho chi nhánh này.
4. **Thanh chức năng cố định ở chân trang (Sticky Bottom Bar):**
   * Có 2 chức năng **[Đặt bàn]** và **[Mua mang về]** giống trang chủ.
   * **Điểm khác biệt:** Trường thông tin "Chi nhánh" trong biểu mẫu sẽ **tự động chọn (gán cứng) vào chi nhánh mà khách đang xem**.

---

### 2.4. Chi tiết Luồng Biểu mẫu & Thông báo (Pop-up)

| Chức năng | Trường thông tin khách điền | Quy tắc chọn Chi nhánh | Thông báo Pop-up sau khi ấn "Đồng ý" |
| :--- | :--- | :--- | :--- |
| **1. Đặt bàn** | - Họ và tên<br>- Số điện thoại<br>- Số người | - **Tại Trang chủ:** Khách chọn từ danh sách chi nhánh.<br>- **Tại Trang chi tiết:** Tự động chọn chi nhánh đang xem. | *"Anh/chị vui lòng đợi nhân viên cửa hàng liên hệ lại cho anh/chị. Cửa hàng xin cảm ơn anh/chị"* |
| **2. Mua mang về** | - Họ và tên<br>- Số điện thoại<br>- Địa chỉ nhận hàng | Tự động ghi nhận theo chi nhánh đang xem (hoặc cho phép chọn chi nhánh gần nhất nếu đặt ở Trang chủ). | *"Anh/chị vui lòng đợi nhân viên cửa hàng liên hệ lại cho anh/chị. Cửa hàng xin cảm ơn anh/chị"* |
| **3. Nút Đánh giá (Góp ý)** | - Chọn chi nhánh đánh giá<br>- Nội dung đánh giá (Text) | Khách chọn chi nhánh muốn góp ý từ danh sách. | *"Cảm ơn anh/chị đã góp ý"*<br>*(Dữ liệu gửi thẳng về Admin theo chi nhánh, không hiện công khai)* |

---

## 3. PHÂN HỆ QUẢN TRỊ VIÊN (ADMIN ROLE)

### 3.1. Quản lý Đơn Đặt bàn & Mua mang về
* **Tiếp nhận thông tin tập trung:** Nhận toàn bộ đơn Đặt bàn và Mua mang về từ tất cả các chi nhánh theo thời gian thực.
* **Thông tin chi tiết hiển thị:** Loại yêu cầu (Đặt bàn / Mang về), **Tên cửa hàng (chi nhánh)**, Tên khách hàng, Số điện thoại, Số người (hoặc Địa chỉ nhận hàng), Thời gian gửi.
* **Xử lý & Tự động xóa ngầm:** 
  * Khi nhân viên liên hệ xác nhận xong với khách và ấn nút **[Đã xác nhận]**, hệ thống sẽ **chạy ngầm xóa vĩnh viễn yêu cầu đó khỏi cơ sở dữ liệu** để làm sạch danh sách và giải phóng bộ nhớ.

### 3.2. Quản lý Nội dung, Banner, Menu & Chi nhánh
* **Thay đổi Banner:** Tải lên / Thay thế / Xóa ảnh banner trang chủ (tối đa 3 ảnh) và banner khuyến mãi riêng của từng chi nhánh.
* **Thay đổi Menu:** Tải lên / Thay thế 2 ảnh thực đơn trên trang chủ.
* **Quản lý Chi nhánh (Thêm / Sửa / Xóa):**
  * Thêm chi nhánh mới hoặc xóa chi nhánh không còn hoạt động.
  * Chỉnh sửa thông tin: Tên chi nhánh, thời gian mở cửa, địa chỉ, ảnh đại diện chỉ định ngoài trang chủ, bộ ảnh và nội dung giới thiệu chi tiết bên trong.

### 3.3. Quản lý Đánh giá Ảo (Seeding Reviews)
* Cho phép Admin tạo, chỉnh sửa hoặc xóa các đánh giá hiển thị công khai trên web.
* **Giới hạn hiển thị:**
  * Trang giới thiệu tổng (Trang chủ): Tối đa **3 đánh giá**.
  * Trang giới thiệu từng cửa hàng (Chi nhánh): Tối đa **3 đánh giá / chi nhánh**.

### 3.4. Quản lý Đánh giá / Góp ý từ Khách hàng
* **Xem theo chi nhánh:** Nhận và lọc danh sách đánh giá (dạng text) do khách hàng gửi về theo từng chi nhánh.
* **Xuất danh sách (Export File):** Cho phép Admin xuất danh sách đánh giá ra file **Excel (`.xlsx` / `.csv`)** để lưu trữ hoặc báo cáo.
* **Tự động xóa sau 7 ngày (Auto-cleanup):** Dữ liệu đánh giá của khách hàng sẽ được hệ thống **tự động xóa vĩnh viễn sau 7 ngày** kể từ thời điểm gửi.

---

## 4. GIẢI PHÁP KỸ THUẬT TỐI ƯU CHI PHÍ (0 ĐỒNG PHÁT SINH)

Để đảm bảo hệ thống chạy mượt mà chỉ với **Domain + Hosting** sẵn có mà không tốn phí thuê dịch vụ bên thứ 3:

1. **Nén ảnh tự động trên trình duyệt (Client-side WebP Compression):**
   * Khi Admin tải ảnh Banner, Menu hay Chi nhánh lên, hệ thống tự động chuyển đổi và nén ảnh sang chuẩn `.webp` trước khi lưu vào Hosting. Giúp dung lượng ảnh giảm 70-80%, web tải cực nhanh mà không lo đầy dung lượng Hosting.
2. **Cơ chế Tự động xóa dữ liệu (Zero-cost Background Job):**
   * **Với đơn Đặt bàn/Mang về:** Xóa trực tiếp bằng lệnh `DELETE` ngay khi Admin bấm nút **[Đã xác nhận]**.
   * **Với Đánh giá khách hàng quá 7 ngày:** Sử dụng cơ chế *Lazy Cleanup* (mỗi khi Admin mở trang quản lý hoặc có truy cập mới, hệ thống tự động quét và xóa các bản ghi có `created_at < NOW() - 7 ngày`) kết hợp với *Cronjob miễn phí* có sẵn trên Hosting.
3. **Xuất file Excel trực tiếp (Client-side Export):**
   * Sử dụng thư viện Javascript miễn phí xuất thẳng dữ liệu trên trình duyệt của Admin ra file Excel/CSV mà không làm tiêu tốn tài nguyên CPU/RAM của Hosting.
-- ====================================================================
-- TẬP TIN THIẾT KẾ CƠ SỞ DỮ LIỆU (DATABASE SCHEMA)
-- Dự án: Hệ thống Website Nhà Hàng "Lẩu Mắm Trăm Rưỡi"
-- Mục đích: Dùng chung cho cả 2 Developers (Người A - Client, Người B - Admin)
-- Chuẩn tương thích: MySQL / MariaDB (phổ biến trên Hosting)
-- ====================================================================

-- 1. BẢNG CẤU HÌNH HỆ THỐNG (SETTINGS)
-- Lưu trữ các ảnh Banner (tối đa 3 ảnh) và Menu (2 ảnh) hiển thị ở Trang Chủ
CREATE TABLE IF NOT EXISTS `settings` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    -- 'key_name': Định danh cài đặt, ví dụ: 'hero_banners' hoặc 'menu_images'
    `key_name` VARCHAR(50) NOT NULL UNIQUE,
    -- 'key_value': Dữ liệu lưu dưới dạng JSON (mảng đường dẫn ảnh) để linh hoạt mở rộng
    `key_value` TEXT NOT NULL,
    -- Thời điểm cập nhật cuối cùng để quản lý phiên bản nội dung
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. BẢNG CHI NHÁNH / CỬA HÀNG (BRANCHES)
-- Quản lý danh sách các cửa hàng trong chuỗi hệ thống
CREATE TABLE IF NOT EXISTS `branches` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    -- Tên chi nhánh, ví dụ: "Chi nhánh Quận 1"
    `name` VARCHAR(150) NOT NULL,
    -- Đường dẫn định danh thân thiện SEO (URL slug), ví dụ: "chi-nhanh-quan-1"
    `slug` VARCHAR(150) NOT NULL UNIQUE,
    -- Đường dẫn ảnh đại diện hiển thị ngoài lưới Trang Chủ
    `thumbnail_url` VARCHAR(255) NOT NULL,
    -- Thời gian mở cửa phục vụ, ví dụ: "10:00 - 22:00"
    `open_hours` VARCHAR(100) NOT NULL,
    -- Địa chỉ chi tiết của quán
    `address` VARCHAR(255) NOT NULL,
    -- Nội dung bài viết giới thiệu riêng về không gian, đặc trưng của chi nhánh
    `intro_content` TEXT NULL,
    -- Mảng danh sách đường dẫn bộ ảnh không gian chi nhánh (lưu dạng JSON)
    `gallery_images` TEXT NULL,
    -- Ảnh banner chương trình khuyến mãi riêng áp dụng tại chi nhánh này
    `promo_banner_url` VARCHAR(255) NULL,
    -- Thời gian tạo và cập nhật chi nhánh
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. BẢNG ĐÁNH GIÁ ẢO DO ADMIN TẠO (SEEDING_REVIEWS)
-- Dùng để tăng uy tín thương hiệu:
-- + branch_id = NULL: hiển thị ở Trang Chủ (tối đa 3 bài)
-- + branch_id = số cụ thể: hiển thị ở Trang Chi Tiết chi nhánh đó (tối đa 3 bài)
CREATE TABLE IF NOT EXISTS `seeding_reviews` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    -- Khóa ngoại liên kết tới chi nhánh, cho phép NULL nếu là đánh giá chung cho Trang Chủ
    `branch_id` INT NULL,
    -- Tên người đánh giá (ví dụ: "Anh Tuấn - Thực khách quen")
    `author_name` VARCHAR(100) NOT NULL,
    -- Điểm số đánh giá (thang điểm 1 - 5 sao)
    `rating` TINYINT NOT NULL DEFAULT 5,
    -- Nội dung lời nhận xét, khen ngợi
    `content` TEXT NOT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    -- Ràng buộc khóa ngoại: khi xóa chi nhánh thì tự động xóa đánh giá ảo thuộc chi nhánh đó
    CONSTRAINT `fk_seeding_branch` FOREIGN KEY (`branch_id`) 
        REFERENCES `branches`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. BẢNG ĐƠN ĐẶT BÀN VÀ MUA MANG VỀ (ORDERS)
-- Tiếp nhận yêu cầu từ khách hàng. Khi Admin ấn [Đã xác nhận], dòng này sẽ bị XÓA vĩnh viễn khỏi DB
CREATE TABLE IF NOT EXISTS `orders` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    -- Đơn hàng thuộc về chi nhánh nào để nhân viên chi nhánh đó tiếp nhận
    `branch_id` INT NOT NULL,
    -- Loại đơn: 'BOOKING' (Đặt bàn trước) hoặc 'TAKEAWAY' (Mua mang về)
    `type` ENUM('BOOKING', 'TAKEAWAY') NOT NULL,
    -- Họ tên khách hàng
    `customer_name` VARCHAR(100) NOT NULL,
    -- Số điện thoại để nhân viên gọi lại xác nhận
    `phone` VARCHAR(20) NOT NULL,
    -- Số lượng người đi ăn (Dành riêng cho loại 'BOOKING', có thể NULL với 'TAKEAWAY')
    `guest_count` INT NULL,
    -- Địa chỉ giao hàng (Dành riêng cho loại 'TAKEAWAY', có thể NULL với 'BOOKING')
    `delivery_address` VARCHAR(255) NULL,
    -- Thời điểm khách gửi yêu cầu (dùng để sắp xếp đơn mới nhất lên đầu)
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    -- Ràng buộc khóa ngoại: liên kết với bảng chi nhánh
    CONSTRAINT `fk_orders_branch` FOREIGN KEY (`branch_id`) 
        REFERENCES `branches`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. BẢNG GÓP Ý THỰC TẾ TỪ KHÁCH HÀNG (CUSTOMER_FEEDBACKS)
-- Góp ý bảo mật gửi riêng cho Admin, hệ thống tự động xóa sau 7 ngày (Lazy Cleanup / Cronjob)
CREATE TABLE IF NOT EXISTS `customer_feedbacks` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    -- Khách gửi góp ý về chi nhánh nào
    `branch_id` INT NOT NULL,
    -- Nội dung góp ý, phản hồi chất lượng phục vụ/món ăn
    `content` TEXT NOT NULL,
    -- Mốc thời gian gửi: cực kỳ quan trọng để hệ thống chạy query xóa: created_at < NOW() - INTERVAL 7 DAY
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT `fk_feedbacks_branch` FOREIGN KEY (`branch_id`) 
        REFERENCES `branches`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


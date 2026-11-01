-- ====================================================================
-- TẬP TIN DỮ LIỆU MẪU (DATABASE SEED DATA)
-- Dự án: Hệ thống Website Nhà Hàng "Lẩu Mắm Trăm Rưỡi"
-- Mục đích: Cung cấp sẵn dữ liệu để Người A dựng UI/UX ngay lập tức
--          và Người B kiểm thử các màn hình Admin CMS
-- ====================================================================

-- 1. DỮ LIỆU CẤU HÌNH BANNER VÀ MENU TRANG CHỦ
-- Banner tối đa 3 ảnh, Menu tối đa 2 ảnh (dưới dạng mảng JSON các đường dẫn ảnh)
INSERT INTO `settings` (`key_name`, `key_value`) VALUES
(
    'hero_banners',
    '["/uploads/banner-hero-1.webp", "/uploads/banner-hero-2.webp", "/uploads/banner-hero-3.webp"]'
),
(
    'menu_images',
    '["/uploads/menu-lau-mam-1.webp", "/uploads/menu-dac-san-2.webp"]'
)
ON DUPLICATE KEY UPDATE `key_value` = VALUES(`key_value`);

-- 2. DỮ LIỆU MẪU 2 CHI NHÁNH ĐIỂN HÌNH
INSERT INTO `branches` (
    `id`, `name`, `slug`, `thumbnail_url`, `open_hours`, `address`, `intro_content`, `gallery_images`, `promo_banner_url`
) VALUES
(
    1,
    'Lẩu Mắm Trăm Rưỡi - Chi Nhánh Quận 1',
    'chi-nhanh-quan-1',
    '/uploads/branch-q1-thumb.webp',
    '10:00 - 22:30 hàng ngày',
    'Số 123 Nguyễn Du, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh',
    'Tọa lạc tại trung tâm Sài Gòn, chi nhánh Quận 1 mang phong cách mộc mạc Nam Bộ ấm cúng, sức chứa hơn 150 thực khách, phù hợp cho tiệc gia đình và họp mặt bạn bè.',
    '["/uploads/branch-q1-space-1.webp", "/uploads/branch-q1-space-2.webp", "/uploads/branch-q1-space-3.webp"]',
    '/uploads/promo-q1-khai-truong.webp'
),
(
    2,
    'Lẩu Mắm Trăm Rưỡi - Chi Nhánh Tân Bình',
    'chi-nhanh-tan-binh',
    '/uploads/branch-tan-binh-thumb.webp',
    '09:30 - 22:00 hàng ngày',
    'Số 456 Hoàng Văn Thụ, Phường 4, Quận Tân Bình, TP. Hồ Chí Minh',
    'Không gian sân vườn thoáng mát rợp bóng cây xanh, bãi giữ xe ô tô rộng rãi, hương vị lẩu mắm đậm đà chuẩn vị miền Tây sông nước.',
    '["/uploads/branch-tb-space-1.webp", "/uploads/branch-tb-space-2.webp"]',
    '/uploads/promo-tan-binh-giam-10.webp'
)
ON DUPLICATE KEY UPDATE `name` = VALUES(`name`);

-- 3. DỮ LIỆU ĐÁNH GIÁ ẢO (SEEDING REVIEWS)
-- a) 3 đánh giá hiển thị ở Trang Chủ (branch_id = NULL)
INSERT INTO `seeding_reviews` (`branch_id`, `author_name`, `rating`, `content`) VALUES
(NULL, 'Chị Mai Lan (Food Reviewer)', 5, 'Nước lẩu mắm thơm nức mũi, rau đồng tươi rói ăn kèm bông điên điển cực kỳ chuẩn vị miền Tây!'),
(NULL, 'Anh Hoàng Nam (Bến Nghé)', 5, 'Giá cả rất bình dân đúng tinh thần trăm rưỡi mà topping thịt ba chỉ, tôm, mực đầy ắp.'),
(NULL, 'Cô Thu Trang (Quận 3)', 5, 'Không gian sạch sẽ, nhân viên phục vụ niềm nở, gia đình mình ghé ăn cuối tuần rất hài lòng.');

-- b) Đánh giá ảo riêng cho Chi Nhánh Quận 1 (branch_id = 1)
INSERT INTO `seeding_reviews` (`branch_id`, `author_name`, `rating`, `content`) VALUES
(1, 'Anh Đức Trí', 5, 'Quán ở Quận 1 nhưng giá cực kỳ hợp lý, máy lạnh mát rượi, lên món nhanh.'),
(1, 'Bạn Ngọc Ánh', 5, 'Điểm hẹn lý tưởng sau giờ làm, lẩu mắm kèm bún tươi ăn no căng bụng.'),
(1, 'Bác Thanh Bình', 5, 'Hương vị làm tôi nhớ quê hương Châu Đốc da diết, nước mắm cá linh nấu rất khéo.');

-- c) Đánh giá ảo riêng cho Chi Nhánh Tân Bình (branch_id = 2)
INSERT INTO `seeding_reviews` (`branch_id`, `author_name`, `rating`, `content`) VALUES
(2, 'Anh Minh Quân', 5, 'Bãi đậu xe rộng, không gian sân vườn thoáng mát không bị ám mùi lẩu.'),
(2, 'Chị Bích Thảo', 5, 'Set lẩu 150k quá chất lượng, rau rửa sạch sẽ, tươi giòn.');

-- 4. DỮ LIỆU ĐƠN HÀNG MẪU (TESTING TRANG QUẢN TRỊ ADMIN)
INSERT INTO `orders` (`branch_id`, `type`, `customer_name`, `phone`, `guest_count`, `delivery_address`) VALUES
(1, 'BOOKING', 'Nguyễn Văn An', '0901234567', 4, NULL),
(2, 'TAKEAWAY', 'Trần Thị Bích', '0987654321', NULL, 'Tòa nhà Landmark 81, P.22, Bình Thạnh');

-- 5. DỮ LIỆU GÓP Ý KHÁCH HÀNG MẪU (TESTING LỌC VÀ XUẤT EXCEL)
INSERT INTO `customer_feedbacks` (`branch_id`, `content`) VALUES
(1, 'Mong quán bổ sung thêm nước uống trà sen thanh mát.'),
(2, 'Đồ ăn rất ngon, giữ xe rất chu đáo và nhiệt tình.');


/**
 * ====================================================================
 * LOGIC TRANG CHI TIẾT CHI NHÁNH (BRANCH DETAIL SCRIPT)
 * Nhiệm vụ Thành viên A: Đọc URL, nạp dữ liệu & tự động gán cứng chi nhánh
 * ====================================================================
 */

// 1. DỮ LIỆU MẪU CHI NHÁNH (KHỚP 100% VỚI DATABASE SEED.SQL)
// Giúp Người A hoàn thiện giao diện độc lập mà không cần chờ API từ Người B
const BRANCHES_MOCK_DATA = {
    'chi-nhanh-quan-1': {
        id: 1,
        name: 'Lẩu Mắm Trăm Rưỡi - Chi Nhánh Quận 1',
        hours: '⏰ 10:00 - 22:30 hàng ngày',
        address: '📍 Số 123 Nguyễn Du, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh',
        intro: 'Tọa lạc ngay trung tâm Sài Gòn phồn hoa, chi nhánh Quận 1 mang phong cách mộc mạc Nam Bộ ấm cúng với sức chứa hơn 150 thực khách. Không gian máy lạnh thoáng đãng kết hợp tiếng đàn kìm êm dịu, là điểm hẹn lý tưởng cho những bữa tiệc gia đình, họp mặt bạn bè hay tiếp đãi đối tác yêu thích phong vị quê hương.',
        gallery: [
            'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&auto=format&fit=crop&q=80',
            'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&auto=format&fit=crop&q=80',
            'https://images.unsplash.com/photo-1544025162-d76694265947?w=800&auto=format&fit=crop&q=80'
        ],
        promoBanner: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1200&auto=format&fit=crop&q=80',
        reviews: [
            { author: 'Anh Đức Trí', tag: 'Thực khách quen', text: 'Quán ở trung tâm Quận 1 nhưng giá đúng 150k cực kỳ hợp lý, máy lạnh mát rượi, lên món siêu nhanh!' },
            { author: 'Bạn Ngọc Ánh', tag: 'Dân văn phòng', text: 'Điểm hẹn lý tưởng sau giờ tan ca, lẩu mắm thơm đậm đà kèm bún tươi ăn no căng bụng.' },
            { author: 'Bác Thanh Bình', tag: 'Khách hàng 60 tuổi', text: 'Hương vị làm tôi nhớ quê hương Châu Đốc da diết, nước mắm cá linh nấu rất khéo và vừa miệng.' }
        ]
    },
    'chi-nhanh-tan-binh': {
        id: 2,
        name: 'Lẩu Mắm Trăm Rưỡi - Chi Nhánh Tân Bình',
        hours: '⏰ 09:30 - 22:00 hàng ngày',
        address: '📍 Số 456 Hoàng Văn Thụ, Phường 4, Quận Tân Bình, TP. Hồ Chí Minh',
        intro: 'Sở hữu không gian sân vườn rợp bóng cây xanh hiếm có giữa lòng Tân Bình, chi nhánh mang đến bầu không khí thoáng đãng, dễ chịu không bị ám mùi khói lẩu. Bãi giữ xe ô tô và xe máy rộng rãi, đội ngũ nhân viên chu đáo, tận tình.',
        gallery: [
            'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&auto=format&fit=crop&q=80',
            'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&auto=format&fit=crop&q=80'
        ],
        promoBanner: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1200&auto=format&fit=crop&q=80',
        reviews: [
            { author: 'Anh Minh Quân', tag: 'Tài xế ô tô', text: 'Bãi đậu xe rộng thênh thang, không gian sân vườn thoáng mát ăn lẩu cực đã!' },
            { author: 'Chị Bích Thảo', tag: 'Cư dân Tân Bình', text: 'Set lẩu 150k quá chất lượng, rau đồng rửa sạch bong, tươi giòn từng cọng.' }
        ]
    },
    'chi-nhanh-binh-thanh': {
        id: 3,
        name: 'Lẩu Mắm Trăm Rưỡi - Chi Nhánh Bình Thạnh',
        hours: '⏰ 10:00 - 22:00 hàng ngày',
        address: '📍 Số 789 Điện Biên Phủ, Phường 25, Bình Thạnh, TP. Hồ Chí Minh',
        intro: 'Nằm gần ngã tư Hàng Xanh sầm uất, chi nhánh Bình Thạnh được thiết kế hiện đại 2 tầng lầu với góc nhìn ngắm phố phường lung linh về đêm. Quán có khu vực phòng riêng (VIP) phục vụ liên hoan, sinh nhật từ 10 đến 30 người.',
        gallery: [
            'https://images.unsplash.com/photo-1544025162-d76694265947?w=800&auto=format&fit=crop&q=80',
            'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&auto=format&fit=crop&q=80'
        ],
        promoBanner: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=1200&auto=format&fit=crop&q=80',
        reviews: [
            { author: 'Anh Tuấn Kiệt', tag: 'Tổ chức sinh nhật', text: 'Phòng VIP trên lầu riêng tư, máy lạnh mát rượi, nhân viên hỗ trợ decor bàn tiệc rất nhiệt tình.' },
            { author: 'Bạn Thu Hà', tag: 'Sinh viên Hutech', text: 'Tụi mình nhóm 5 đứa gọi 2 nồi lẩu ăn no nê mà chia ra mỗi người chưa tới 80k!' }
        ]
    }
};

document.addEventListener('DOMContentLoaded', () => {
    // 2. ĐỌC THAM SỐ SLUG TỪ THANH ĐỊA CHỈ TRÌNH DUYỆT (URL QUERY PARAMS)
    // Ví dụ URL: branch.html?slug=chi-nhanh-quan-1 -> Lấy được 'chi-nhanh-quan-1'
    const urlParams = new URLSearchParams(window.location.search);
    const branchSlug = urlParams.get('slug') || 'chi-nhanh-quan-1';

    // Tìm dữ liệu tương ứng với slug, nếu không thấy thì lấy chi nhánh Quận 1 làm mặc định
    const currentBranch = BRANCHES_MOCK_DATA[branchSlug] || BRANCHES_MOCK_DATA['chi-nhanh-quan-1'];

    // 3. NẠP DỮ LIỆU ĐỘNG VÀO GIAO DIỆN
    document.title = `${currentBranch.name} - Lẩu Mắm Trăm Rưỡi`;
    document.getElementById('branch-name').textContent = currentBranch.name;
    document.getElementById('branch-hours').textContent = currentBranch.hours;
    document.getElementById('branch-address').textContent = currentBranch.address;
    document.getElementById('branch-intro-text').textContent = currentBranch.intro;

    // Nạp bộ ảnh không gian (Gallery)
    const galleryContainer = document.getElementById('branch-gallery');
    if (galleryContainer) {
        galleryContainer.innerHTML = currentBranch.gallery.map(imgUrl => `
            <div class="gallery-item reveal-element">
                <img src="${imgUrl}" alt="Không gian chi nhánh" class="gallery-img">
            </div>
        `).join('');
    }

    // Nạp banner khuyến mãi riêng
    const promoBannerImg = document.getElementById('branch-promo-banner');
    if (promoBannerImg) {
        promoBannerImg.src = currentBranch.promoBanner;
    }

    // Nạp danh sách 3 đánh giá riêng của chi nhánh
    const reviewsGrid = document.getElementById('branch-reviews-grid');
    if (reviewsGrid) {
        reviewsGrid.innerHTML = currentBranch.reviews.map(rev => `
            <div class="review-card reveal-element">
                <div class="review-stars">⭐⭐⭐⭐⭐</div>
                <p class="review-text">"${rev.text}"</p>
                <div class="review-author">
                    <div class="author-avatar">${rev.author.charAt(0)}</div>
                    <div class="author-info">
                        <h4 class="author-name">${rev.author}</h4>
                        <span class="author-tag">${rev.tag}</span>
                    </div>
                </div>
            </div>
        `).join('');
    }

    // 4. 👉 QUY TẮC VÀNG SRS (2.3.4): TỰ ĐỘNG GÁN CỨNG CHI NHÁNH ĐANG XEM 👈
    // Gán tên chi nhánh vào nhãn hiển thị trong Modal
    document.getElementById('booking-branch-name').textContent = currentBranch.name;
    document.getElementById('booking-branch-id').value = currentBranch.id;

    document.getElementById('takeaway-branch-name').textContent = currentBranch.name;
    document.getElementById('takeaway-branch-id').value = currentBranch.id;

    // 5. ĐIỀU KHIỂN MODAL & THÔNG BÁO CẢM ƠN
    const modalBooking = document.getElementById('modal-booking');
    const modalTakeaway = document.getElementById('modal-takeaway');
    const modalThankyou = document.getElementById('modal-thankyou');
    const thankyouMsg = document.getElementById('thankyou-msg');

    const MSG_ORDER_SUCCESS = 'Anh/chị vui lòng đợi nhân viên cửa hàng liên hệ lại cho anh/chị. Cửa hàng xin cảm ơn anh/chị';

    function openModal(modalEl) {
        if (!modalEl) return;
        modalEl.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeModal(modalEl) {
        if (!modalEl) return;
        modalEl.classList.remove('active');
        document.body.style.overflow = '';
    }

    // Mở modal khi bấm nút dưới thanh đáy
    document.getElementById('btn-open-booking').addEventListener('click', () => openModal(modalBooking));
    document.getElementById('btn-open-takeaway').addEventListener('click', () => openModal(modalTakeaway));

    // Đóng modal khi bấm dấu X hoặc nút [Đã Hiểu]
    document.querySelectorAll('[data-close-modal]').forEach(btn => {
        btn.addEventListener('click', () => closeModal(btn.closest('.app-modal-backdrop')));
    });

    document.getElementById('btn-close-thankyou').addEventListener('click', () => closeModal(modalThankyou));

    // Xử lý gửi Form Đặt bàn
    document.getElementById('form-booking').addEventListener('submit', (e) => {
        e.preventDefault();
        closeModal(modalBooking);
        document.getElementById('form-booking').reset();
        // Giữ lại tên chi nhánh sau khi reset
        document.getElementById('booking-branch-name').textContent = currentBranch.name;
        thankyouMsg.textContent = MSG_ORDER_SUCCESS;
        openModal(modalThankyou);
    });

    // Xử lý gửi Form Mua mang về
    document.getElementById('form-takeaway').addEventListener('submit', (e) => {
        e.preventDefault();
        closeModal(modalTakeaway);
        document.getElementById('form-takeaway').reset();
        document.getElementById('takeaway-branch-name').textContent = currentBranch.name;
        thankyouMsg.textContent = MSG_ORDER_SUCCESS;
        openModal(modalThankyou);
    });
});


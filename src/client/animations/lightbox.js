/**
 * ====================================================================
 * LOGIC PHÓNG TO THỰC ĐƠN TOÀN MÀN HÌNH (LIGHTBOX SCRIPT)
 * Kỹ thuật: Vanilla JavaScript thuần túy, tối ưu trải nghiệm chạm trên điện thoại
 * ====================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Lấy các phần tử liên quan trong DOM
    const lightboxModal = document.getElementById('menu-lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const closeBtn = document.getElementById('lightbox-close-btn');
    const triggerCards = document.querySelectorAll('[data-lightbox]');

    // Nếu không có phần tử lightbox trên trang thì dừng lại
    if (!lightboxModal || !lightboxImg) return;

    /**
     * Mở Lightbox và nạp ảnh tương ứng
     * @param {string} imageSrc - Đường dẫn ảnh độ phân giải cao cần phóng to
     */
    function openLightbox(imageSrc) {
        lightboxImg.src = imageSrc;
        lightboxModal.classList.add('active');
        lightboxModal.setAttribute('aria-hidden', 'false');
        // Khóa cuộn trang của body để người dùng không vô tình cuộn trang phía sau
        document.body.style.overflow = 'hidden';
    }

    /**
     * Đóng Lightbox và trả lại trạng thái cuộn bình thường
     */
    function closeLightbox() {
        lightboxModal.classList.remove('active');
        lightboxModal.setAttribute('aria-hidden', 'true');
        // Trả lại thanh cuộn cho trang web
        document.body.style.overflow = '';
        // Xóa đường dẫn ảnh sau khi đóng
        setTimeout(() => {
            lightboxImg.src = '';
        }, 300);
    }

    // 2. Gán sự kiện click vào từng ảnh thực đơn
    triggerCards.forEach(card => {
        card.addEventListener('click', () => {
            const highResImage = card.getAttribute('data-lightbox');
            if (highResImage) {
                openLightbox(highResImage);
            }
        });
    });

    // 3. Đóng khi bấm nút dấu X
    if (closeBtn) {
        closeBtn.addEventListener('click', closeLightbox);
    }

    // 4. Đóng khi bấm vào khoảng không màu đen phía ngoài bức ảnh
    lightboxModal.addEventListener('click', (event) => {
        // Chỉ đóng nếu người dùng bấm trúng khung nền ngoài, không đóng nếu bấm vào bản thân bức ảnh
        if (event.target === lightboxModal) {
            closeLightbox();
        }
    });

    // 5. Đóng khi người dùng bấm phím Escape (ESC) trên bàn phím máy tính
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && lightboxModal.classList.contains('active')) {
            closeLightbox();
        }
    });
});


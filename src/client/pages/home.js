/**
 * ====================================================================
 * LOGIC TƯƠNG TÁC TRANG CHỦ (HOME PAGE SCRIPT)
 * Nhiệm vụ Thành viên A: Điều khiển trình chiếu Hero Banner Slider
 * ====================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Lấy tất cả các phần tử DOM cần thiết của Slider
    const slides = document.querySelectorAll('.slider-slide');
    const dots = document.querySelectorAll('.slider-dots .dot');
    const prevBtn = document.getElementById('slider-btn-prev');
    const nextBtn = document.getElementById('slider-btn-next');
    const sliderContainer = document.getElementById('hero-slider');
    const progressBar = document.getElementById('slider-progress');

    // Nếu trang không có slider thì dừng lại để tránh báo lỗi
    if (!slides.length) return;

    let currentIndex = 0; // Vị trí slide hiện tại (bắt đầu từ slide đầu tiên = 0)
    let autoSlideTimer = null; // Biến giữ đồng hồ hẹn giờ tự chuyển slide

    /**
     * Hàm hiển thị slide theo chỉ số index được truyền vào
     * @param {number} targetIndex - Vị trí slide muốn chuyển tới
     */
    function showSlide(targetIndex) {
        // Gỡ bỏ trạng thái .active khỏi slide và dot hiện tại
        slides[currentIndex].classList.remove('active');
        dots[currentIndex].classList.remove('active');

        // Cập nhật vị trí mới
        currentIndex = targetIndex;

        // Kích hoạt trạng thái .active cho slide và dot mới
        slides[currentIndex].classList.add('active');
        dots[currentIndex].classList.add('active');

        // Khởi động lại vạch tiến trình chạy từ 0%
        if (progressBar) {
            progressBar.style.animation = 'none';
            // Mẹo ép trình duyệt vẽ lại (Reflow/Repaint) trước khi gán lại animation
            void progressBar.offsetWidth;
            progressBar.style.animation = 'progressFill 3.5s linear infinite';
        }
    }

    /**
     * Hàm chuyển sang Slide tiếp theo (quay vòng về 0 khi hết danh sách)
     */
    function nextSlide() {
        const nextIndex = (currentIndex + 1) % slides.length;
        showSlide(nextIndex);
    }

    /**
     * Hàm lùi về Slide phía trước (quay về cuối khi đang ở slide 0)
     */
    function prevSlide() {
        const prevIndex = (currentIndex - 1 + slides.length) % slides.length;
        showSlide(prevIndex);
    }

    /**
     * Khởi động bộ đếm thời gian tự động trượt (3.5 giây đổi ảnh 1 lần cho sống động)
     */
    function startAutoSlide() {
        // Xóa đồng hồ cũ trước khi tạo đồng hồ mới để tránh bị chạy nhanh gấp đôi
        stopAutoSlide();
        // Giảm xuống 3500ms (3.5 giây) để chuyển động rõ nét, không phải chờ lâu
        autoSlideTimer = setInterval(nextSlide, 3500);
    }

    /**
     * Tạm dừng tự trượt
     */
    function stopAutoSlide() {
        if (autoSlideTimer) {
            clearInterval(autoSlideTimer);
            autoSlideTimer = null;
        }
    }

    // 2. Lắng nghe sự kiện click nút bấm mũi tên Trước / Sau
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            nextSlide();
            startAutoSlide(); // Đặt lại đồng hồ sau khi bấm tay
        });
    }

    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            prevSlide();
            startAutoSlide();
        });
    }

    // 3. Lắng nghe sự kiện click vào các dấu chấm tròn (Dots)
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            showSlide(index);
            startAutoSlide();
        });
    });

    // 4. HIỆU ỨNG VUỐT TAY / LƯỚT CHUỘT (TOUCH SWIPE & DRAG) TRÊN BANNER
    let touchStartX = 0;
    let touchEndX = 0;

    if (sliderContainer) {
        // A. Cảm ứng vuốt trên Điện thoại (Touch events)
        sliderContainer.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });

        sliderContainer.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        }, { passive: true });

        // B. Kéo chuột trên Máy tính (Mouse drag)
        sliderContainer.addEventListener('mousedown', (e) => {
            touchStartX = e.clientX;
        });

        sliderContainer.addEventListener('mouseup', (e) => {
            touchEndX = e.clientX;
            handleSwipe();
        });

        // Hàm phân tích hướng lướt ngón tay
        function handleSwipe() {
            const distance = touchEndX - touchStartX;
            // Nếu vuốt sang trái hơn 45px -> chuyển sang ảnh kế tiếp
            if (distance < -45) {
                nextSlide();
                startAutoSlide();
            }
            // Nếu vuốt sang phải hơn 45px -> lùi về ảnh trước
            else if (distance > 45) {
                prevSlide();
                startAutoSlide();
            }
        }
    }

    // Khởi động chạy tự động ngay lập tức khi tải trang
    startAutoSlide();
});


/**
 * ====================================================================
 * XỬ LÝ HIỆU ỨNG CUỘN TRANG (SCROLL REVEAL SCRIPT)
 * Kỹ thuật: Sử dụng Intersection Observer API nguyên bản (Native JS)
 * Ưu điểm: Hiệu năng cực cao 60fps, không tốn 1 đồng mua thư viện ngoài
 * ====================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Tìm tất cả các phần tử có gắn class hiệu ứng lướt trên trang
    const elementsToReveal = document.querySelectorAll('.reveal-element, .reveal-left, .reveal-right, .reveal-scale');

    // 2. Cấu hình tầm nhìn để kích hoạt hiệu ứng mượt mà
    const observerOptions = {
        root: null, // Lấy toàn bộ màn hình người dùng làm mốc
        rootMargin: '0px 0px -40px 0px', // Kích hoạt sớm khi phần tử chuẩn bị chạm đáy màn hình
        threshold: 0.1 // Chỉ cần 10% phần tử xuất hiện là lướt ngay
    };

    // 3. Khởi tạo bộ giám sát Intersection Observer
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            // Khi người dùng lướt tới phần tử
            if (entry.isIntersecting) {
                // Thêm class 'revealed' để chạy hoạt ảnh tương ứng
                entry.target.classList.add('revealed');
                // Dừng giám sát để tối ưu hiệu năng
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // 4. Bắt đầu theo dõi từng phần tử
    elementsToReveal.forEach(el => revealObserver.observe(el));

    // 5. HIỆU ỨNG THU GỌN HEADER KHI LƯỚT XUỐNG
    const siteHeader = document.getElementById('site-header');
    if (siteHeader) {
        window.addEventListener('scroll', () => {
            // Nếu lướt xuống hơn 50px thì thêm hiệu ứng thu gọn và đổ bóng sâu hơn
            if (window.scrollY > 50) {
                siteHeader.classList.add('header-scrolled');
            } else {
                siteHeader.classList.remove('header-scrolled');
            }
        }, { passive: true }); // passive: true giúp cuộn trang siêu mượt 60fps
    }
});


/**
 * ====================================================================
 * LOGIC ĐIỀU KHIỂN BỘ 3 MODAL POP-UP & THÔNG BÁO CẢM ƠN (MODALS SCRIPT)
 * Nhiệm vụ Thành viên A: Xử lý đóng/mở Modal và hiển thị Pop-up chuẩn SRS
 * ====================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. LẤY CÁC NÚT MỞ MODAL TỪ THANH CÔNG CỤ ĐÁY (STICKY BOTTOM BAR)
    const btnOpenBooking = document.getElementById('btn-open-booking');
    const btnOpenTakeaway = document.getElementById('btn-open-takeaway');
    const btnOpenFeedback = document.getElementById('btn-open-feedback');

    // 2. LẤY CÁC KHUNG MODAL POP-UP
    const modalBooking = document.getElementById('modal-booking');
    const modalTakeaway = document.getElementById('modal-takeaway');
    const modalFeedback = document.getElementById('modal-feedback');
    const modalThankyou = document.getElementById('modal-thankyou');

    // Các phần tử nội dung trong Modal Cảm ơn
    const thankyouMsg = document.getElementById('thankyou-msg');
    const btnCloseThankyou = document.getElementById('btn-close-thankyou');

    // 3. CÁC CÂU THÔNG BÁO TIÊU CHUẨN ĐÚNG THEO BẢNG ĐẶC TẢ SRS (MỤC 2.4)
    const MSG_ORDER_SUCCESS = 'Anh/chị vui lòng đợi nhân viên cửa hàng liên hệ lại cho anh/chị. Cửa hàng xin cảm ơn anh/chị';
    const MSG_FEEDBACK_SUCCESS = 'Cảm ơn anh/chị đã góp ý';

    /**
     * Mở một Modal cụ thể
     * @param {HTMLElement} modalEl - Thẻ modal cần mở
     */
    function openModal(modalEl) {
        if (!modalEl) return;
        modalEl.classList.add('active');
        modalEl.setAttribute('aria-hidden', 'false');
        // Khóa cuộn trang web phía sau
        document.body.style.overflow = 'hidden';
    }

    /**
     * Đóng một Modal cụ thể
     * @param {HTMLElement} modalEl - Thẻ modal cần đóng
     */
    function closeModal(modalEl) {
        if (!modalEl) return;
        modalEl.classList.remove('active');
        modalEl.setAttribute('aria-hidden', 'true');
        // Trả lại thanh cuộn cho trang web
        document.body.style.overflow = '';
    }

    /**
     * Đóng tất cả các modal đang mở
     */
    function closeAllModals() {
        document.querySelectorAll('.app-modal-backdrop.active').forEach(modal => {
            closeModal(modal);
        });
    }

    /**
     * Hiển thị Pop-up thông báo cảm ơn
     * @param {string} message - Lời nhắn cảm ơn theo đặc tả SRS
     */
    function showThankYouPopup(message) {
        if (thankyouMsg && modalThankyou) {
            thankyouMsg.textContent = message;
            openModal(modalThankyou);
        }
    }

    // 4. LẮNG NGHE SỰ KIỆN CLICK MỞ TỪ THANH CÔNG CỤ DƯỚI CÙNG
    if (btnOpenBooking) {
        btnOpenBooking.addEventListener('click', () => openModal(modalBooking));
    }

    if (btnOpenTakeaway) {
        btnOpenTakeaway.addEventListener('click', () => openModal(modalTakeaway));
    }

    if (btnOpenFeedback) {
        btnOpenFeedback.addEventListener('click', () => openModal(modalFeedback));
    }

    // 5. ĐÓNG MODAL KHI BẤM NÚT DẤU [X] HOẶC NÚT [ĐÃ HIỂU]
    document.querySelectorAll('[data-close-modal]').forEach(btn => {
        btn.addEventListener('click', () => {
            const parentModal = btn.closest('.app-modal-backdrop');
            closeModal(parentModal);
        });
    });

    if (btnCloseThankyou) {
        btnCloseThankyou.addEventListener('click', () => closeModal(modalThankyou));
    }

    // 6. ĐÓNG MODAL KHI CLICK RA NGOÀI KHUNG TRẮNG HOẶC ẤN PHÍM ESC
    document.querySelectorAll('.app-modal-backdrop').forEach(backdrop => {
        backdrop.addEventListener('click', (e) => {
            // Chỉ đóng khi click trúng chính lớp nền backdrop tối màu
            if (e.target === backdrop) {
                closeModal(backdrop);
            }
        });
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeAllModals();
        }
    });

    // 7. XỬ LÝ GỬI FORM BIỂU MẪU (SUBMIT)

    // A. Form Đặt Bàn
    const formBooking = document.getElementById('form-booking');
    if (formBooking) {
        formBooking.addEventListener('submit', (e) => {
            e.preventDefault(); // Ngăn trình duyệt reload lại trang

            // Đóng modal đặt bàn
            closeModal(modalBooking);

            // Xóa trắng form để sẵn sàng cho lần điền sau
            formBooking.reset();

            // Hiển thị Pop-up cảm ơn đúng câu từ SRS
            showThankYouPopup(MSG_ORDER_SUCCESS);
        });
    }

    // B. Form Mua Mang Về
    const formTakeaway = document.getElementById('form-takeaway');
    if (formTakeaway) {
        formTakeaway.addEventListener('submit', (e) => {
            e.preventDefault();

            closeModal(modalTakeaway);
            formTakeaway.reset();
            showThankYouPopup(MSG_ORDER_SUCCESS);
        });
    }

    // C. Form Góp Ý
    const formFeedback = document.getElementById('form-feedback');
    if (formFeedback) {
        formFeedback.addEventListener('submit', (e) => {
            e.preventDefault();

            closeModal(modalFeedback);
            formFeedback.reset();
            showThankYouPopup(MSG_FEEDBACK_SUCCESS);
        });
    }
});


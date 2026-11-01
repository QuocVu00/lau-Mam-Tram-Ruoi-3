// Module xử lý giao diện tiếp nhận & xóa ngầm đơn hàng
const ordersTableBody = document.getElementById('ordersTableBody');
const refreshOrdersBtn = document.getElementById('refreshOrdersBtn');

// Hàm gửi request API kèm mã token xác thực từ localStorage
async function fetchWithAuth(url, options = {}) {
    const token = localStorage.getItem('admin_token');
    const headers = { ...options.headers, 'Authorization': `Bearer ${token}` };
    const response = await fetch(url, { ...options, headers });

    // Nếu mã lỗi 401 thì phiên làm việc đã hết hạn, chuyển ngay về trang đăng nhập
    if (response.status === 401) {
        localStorage.removeItem('admin_token');
        window.location.href = 'login.html';
        return null;
    }
    return response.json();
}

// 1. Hàm tải danh sách đơn hàng từ máy chủ
async function loadOrders() {
    ordersTableBody.innerHTML = '<tr><td colspan="7" style="text-align:center;">Đang tải...</td></tr>';
    
    const result = await fetchWithAuth('/api/admin/orders');
    if (!result || !result.success) return;

    const orders = result.data;
    if (orders.length === 0) {
        ordersTableBody.innerHTML = '<tr><td colspan="7" style="text-align:center; color:#888;">Hiện không có đơn mới nào cần xử lý.</td></tr>';
        return;
    }

    // Đổ dữ liệu từng đơn vào bảng HTML
    ordersTableBody.innerHTML = orders.map(order => {
        const timeFormatted = new Date(order.created_at).toLocaleString('vi-VN');
        const isBooking = order.type === 'BOOKING';
        const typeBadge = isBooking 
            ? '<span class="badge badge-booking">🍲 Đặt Bàn</span>' 
            : '<span class="badge badge-takeaway">🛵 Mang Về</span>';
        const detailInfo = isBooking 
            ? `👥 Số khách: <strong>${order.guest_count || 1}</strong> người` 
            : `📍 Địa chỉ: <strong>${order.delivery_address || 'Tự đến lấy'}</strong>`;

        return `
            <tr>
                <td style="font-size:12px; color:#666;">${timeFormatted}</td>
                <td>${typeBadge}</td>
                <td><strong style="color:var(--primary-color);">${order.branch_name}</strong></td>
                <td><strong>${order.customer_name}</strong></td>
                <td><a href="tel:${order.phone}" style="color:#0066cc; font-weight:600; text-decoration:none;">📞 ${order.phone}</a></td>
                <td>${detailInfo}</td>
                <td>
                    <button class="btn-sm btn-success" onclick="handleConfirmOrder(${order.id})">
                        ✓ Đã xác nhận
                    </button>
                </td>
            </tr>
        `;
    }).join('');
}

// 2. Hàm xử lý khi nhân viên bấm [Đã xác nhận] -> Chạy ngầm xóa vĩnh viễn khỏi Database
window.handleConfirmOrder = async function(orderId) {
    const isConfirmed = confirm('Bạn đã liên hệ xác nhận với khách xong chưa?\n\nThao tác này sẽ xóa vĩnh viễn đơn khỏi hệ thống để giải phóng bộ nhớ!');
    if (!isConfirmed) return;

    const result = await fetchWithAuth(`/api/admin/orders/${orderId}`, { method: 'DELETE' });
    if (result && result.success) {
        alert(result.message);
        loadOrders(); // Tải lại danh sách sau khi đã xóa thành công
    }
};

// Gắn sự kiện nút tải lại thủ công
if (refreshOrdersBtn) {
    refreshOrdersBtn.addEventListener('click', loadOrders);
}

// Khởi chạy tải đơn hàng ngay khi mở trang
loadOrders();


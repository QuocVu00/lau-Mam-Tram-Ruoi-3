/**
 * Tiện ích xuất dữ liệu ra file CSV/Excel trực tiếp trên trình duyệt (Client-side)
 * Tối ưu 0đ chi phí: Không tốn CPU/RAM của server hosting, xuất tức thì.
 */
function exportFeedbacksToExcel(feedbacks, fileName = 'danh-sach-gop-y.csv') {
    if (!feedbacks || feedbacks.length === 0) {
        alert('Không có dữ liệu góp ý nào để xuất!');
        return;
    }

    // 1. Tiêu đề các cột dữ liệu
    const headers = ['Thời Gian Gửi', 'Chi Nhánh', 'Nội Dung Góp Ý'];

    // 2. Chuyển đổi mảng đối tượng thành các dòng dữ liệu dạng CSV
    const rows = feedbacks.map(item => {
        const time = new Date(item.created_at).toLocaleString('vi-VN');
        const branch = (item.branch_name || '').replace(/"/g, '""');
        const content = (item.content || '').replace(/"/g, '""');
        // Đặt nội dung trong dấu ngoặc kép để tránh bị ngắt dòng do dấu phẩy
        return `"${time}","${branch}","${content}"`;
    });

    // 3. Ghép toàn bộ nội dung thành một chuỗi văn bản CSV
    // Thêm ký tự BOM (\uFEFF) ở đầu để Excel hiển thị đúng tiếng Việt có dấu mà không bị lỗi font
    const csvContent = '\uFEFF' + [headers.join(','), ...rows].join('\r\n');

    // 4. Tạo đối tượng Blob và kích hoạt trình duyệt tải file về máy
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}


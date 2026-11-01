// Module quản lý Góp ý của khách hàng & Xuất báo cáo
const feedbacksTableBody = document.getElementById('feedbacksTableBody');
const feedbackBranchFilter = document.getElementById('feedbackBranchFilter');
const exportExcelBtn = document.getElementById('exportExcelBtn');

let currentFeedbacksList = []; // Lưu trữ danh sách góp ý hiện tại để xuất file

// 1. Tải danh sách chi nhánh để hiển thị vào bộ lọc dropdown
async function initBranchFilter() {
    if (!feedbackBranchFilter) return;
    const result = await fetchWithAuth('/api/admin/branches');
    if (result && result.success) {
        result.data.forEach(branch => {
            const option = document.createElement('option');
            option.value = branch.id;
            option.textContent = branch.name;
            feedbackBranchFilter.appendChild(option);
        });
    }
}

// 2. Tải danh sách góp ý từ máy chủ (có thể lọc theo chi nhánh)
async function loadFeedbacks(branchId = '') {
    if (!feedbacksTableBody) return;
    feedbacksTableBody.innerHTML = '<tr><td colspan="3" style="text-align:center;">Đang tải dữ liệu...</td></tr>';

    const url = branchId ? `/api/admin/feedbacks?branchId=${branchId}` : '/api/admin/feedbacks';
    const result = await fetchWithAuth(url);

    if (!result || !result.success) return;

    currentFeedbacksList = result.data;

    if (currentFeedbacksList.length === 0) {
        feedbacksTableBody.innerHTML = '<tr><td colspan="3" style="text-align:center; color:#888;">Không có góp ý nào trong 7 ngày gần nhất.</td></tr>';
        return;
    }

    feedbacksTableBody.innerHTML = currentFeedbacksList.map(item => {
        const timeFormatted = new Date(item.created_at).toLocaleString('vi-VN');
        return `
            <tr>
                <td style="font-size:12px; color:#666; width:160px;">${timeFormatted}</td>
                <td style="width:200px;"><strong style="color:var(--primary-color);">${item.branch_name}</strong></td>
                <td>${item.content}</td>
            </tr>
        `;
    }).join('');
}

// 3. Lắng nghe sự kiện thay đổi chi nhánh trong bộ lọc
if (feedbackBranchFilter) {
    feedbackBranchFilter.addEventListener('change', (e) => {
        loadFeedbacks(e.target.value);
    });
}

// 4. Lắng nghe sự kiện bấm nút Xuất file Excel / CSV
if (exportExcelBtn) {
    exportExcelBtn.addEventListener('click', () => {
        exportFeedbacksToExcel(currentFeedbacksList, `gop-y-lau-mam-${Date.now()}.csv`);
    });
}

// Khởi chạy khi tải trang
initBranchFilter();
loadFeedbacks();


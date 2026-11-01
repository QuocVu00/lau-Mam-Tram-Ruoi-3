// Module Quản lý Chi Nhánh & Đánh Giá Ảo (Branches & Seeding CMS)
const branchesListContainer = document.getElementById('branchesListContainer');
let branchesData = [];

// 1. Tải danh sách chi nhánh
async function loadBranchesCMS() {
    if (!branchesListContainer) return;
    const res = await fetchWithAuth('/api/admin/branches');
    if (!res || !res.success) return;

    branchesData = res.data;
    renderBranchesList();
    loadSeedingReviews();
}

// 2. Hiển thị danh sách thẻ chi nhánh
function renderBranchesList() {
    if (branchesData.length === 0) {
        branchesListContainer.innerHTML = '<p style="color:#888;">Chưa có chi nhánh nào. Hãy thêm chi nhánh mới!</p>';
        return;
    }

    let html = '<div style="display:grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap:20px; margin-bottom:30px;">';
    branchesData.forEach(branch => {
        html += `
            <div style="border:1px solid #e2e8f0; border-radius:8px; overflow:hidden; background:#fff; box-shadow:0 1px 3px rgba(0,0,0,0.05);">
                <img src="${branch.thumbnail_url}" style="width:100%; height:160px; object-fit:cover;" onerror="this.src='https://placehold.co/300x160?text=Chưa+Có+Ảnh'">
                <div style="padding:15px;">
                    <h4 style="font-size:16px; color:var(--primary-color); margin-bottom:6px;">${branch.name}</h4>
                    <p style="font-size:13px; color:#555; margin-bottom:4px;">⏰ <strong>Giờ mở cửa:</strong> ${branch.open_hours}</p>
                    <p style="font-size:13px; color:#555; margin-bottom:12px;">📍 <strong>Địa chỉ:</strong> ${branch.address}</p>
                    <div style="display:flex; gap:8px;">
                        <button class="btn-sm btn-danger" onclick="deleteBranch(${branch.id})">🗑️ Xóa</button>
                    </div>
                </div>
            </div>
        `;
    });
    html += '</div>';

    // Khu vực Quản lý Đánh Giá Ảo gắn liền bên dưới
    html += `
        <div class="data-card" style="margin-top:20px;">
            <div class="card-header">
                <h3 style="font-size: 15px;">⭐ Quản Lý Đánh Giá Ảo (Tối Đa 3 Đánh Giá / Vị Trí)</h3>
                <select id="reviewLocationFilter" class="form-input" style="width:auto; padding:4px 10px;" onchange="loadSeedingReviews(this.value)">
                    <option value="home">Đánh giá ở Trang Chủ (Chung)</option>
                    ${branchesData.map(b => `<option value="${b.id}">${b.name}</option>`).join('')}
                </select>
            </div>
            <div id="reviewsTableContainer">Đang tải đánh giá...</div>
            <div style="margin-top:20px; padding:15px; background:#f8fafc; border-radius:8px; border:1px solid #e2e8f0;">
                <h4 style="font-size:14px; margin-bottom:10px;">+ Thêm Đánh Giá Mẫu Mới</h4>
                <div style="display:grid; grid-template-columns: 2fr 1fr; gap:10px; margin-bottom:10px;">
                    <input type="text" id="reviewAuthor" class="form-input" placeholder="Tên khách hàng mẫu (VD: Anh Minh - Thực khách)">
                    <select id="reviewRating" class="form-input">
                        <option value="5">⭐⭐⭐⭐⭐ (5 Sao)</option>
                        <option value="4">⭐⭐⭐⭐ (4 Sao)</option>
                    </select>
                </div>
                <textarea id="reviewContent" class="form-input" rows="2" placeholder="Nội dung khen món ăn, dịch vụ..." style="margin-bottom:10px;"></textarea>
                <button class="btn-sm btn-success" onclick="handleAddReview()">+ Lưu Đánh Giá Ảo</button>
            </div>
        </div>
    `;

    branchesListContainer.innerHTML = html;
}

// 3. Tải & hiển thị danh sách đánh giá ảo
window.loadSeedingReviews = async function(location = 'home') {
    const container = document.getElementById('reviewsTableContainer');
    if (!container) return;

    const res = await fetchWithAuth(`/api/admin/reviews?branchId=${location}`);
    if (!res || !res.success) return;

    const reviews = res.data;
    if (reviews.length === 0) {
        container.innerHTML = '<p style="color:#888; font-size:13px;">Chưa có đánh giá nào cho vị trí này (Tối đa được thêm 3 bài).</p>';
        return;
    }

    let tableHtml = `
        <table class="data-table">
            <thead>
                <tr>
                    <th>Người Đánh Giá</th>
                    <th>Số Sao</th>
                    <th>Lời Nhận Xét</th>
                    <th>Thao Tác</th>
                </tr>
            </thead>
            <tbody>
    `;
    reviews.forEach(r => {
        tableHtml += `
            <tr>
                <td><strong>${r.author_name}</strong></td>
                <td><span style="color:#e59819;">${'★'.repeat(r.rating)}</span></td>
                <td>${r.content}</td>
                <td><button class="btn-sm btn-danger" onclick="deleteReview(${r.id})">Xóa</button></td>
            </tr>
        `;
    });
    tableHtml += '</tbody></table>';
    container.innerHTML = tableHtml;
};

// 4. Thêm Đánh giá ảo (Kiểm tra giới hạn 3 bài)
window.handleAddReview = async function() {
    const locationVal = document.getElementById('reviewLocationFilter').value;
    const author_name = document.getElementById('reviewAuthor').value.trim();
    const rating = document.getElementById('reviewRating').value;
    const content = document.getElementById('reviewContent').value.trim();

    if (!author_name || !content) {
        alert('Vui lòng điền đủ tên người đánh giá và nội dung!');
        return;
    }

    const payload = {
        branch_id: locationVal === 'home' ? null : locationVal,
        author_name,
        rating,
        content
    };

    const res = await fetchWithAuth('/api/admin/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    });

    if (res && res.success) {
        alert(res.message);
        document.getElementById('reviewAuthor').value = '';
        document.getElementById('reviewContent').value = '';
        loadSeedingReviews(locationVal);
    } else if (res) {
        alert(res.message);
    }
};

// 5. Xóa đánh giá ảo
window.deleteReview = async function(id) {
    if (!confirm('Bạn có chắc muốn xóa đánh giá này?')) return;
    const res = await fetchWithAuth(`/api/admin/reviews/${id}`, { method: 'DELETE' });
    if (res && res.success) {
        const locationVal = document.getElementById('reviewLocationFilter').value;
        loadSeedingReviews(locationVal);
    }
};

// 6. Xóa chi nhánh
window.deleteBranch = async function(id) {
    if (!confirm('CẢNH BÁO: Xóa chi nhánh này sẽ xóa luôn toàn bộ đánh giá ảo và dữ liệu liên quan! Bạn có chắc chắn?')) return;
    const res = await fetchWithAuth(`/api/admin/branches/${id}`, { method: 'DELETE' });
    if (res && res.success) {
        loadBranchesCMS();
    }
};

// 7. Mở form thêm chi nhánh mới
const addBranchBtn = document.getElementById('addBranchBtn');
if (addBranchBtn) {
    addBranchBtn.addEventListener('click', () => {
        const name = prompt('Nhập tên chi nhánh mới (VD: Lẩu Mắm Trăm Rưỡi - Chi Nhánh Quận 3):');
        if (!name) return;
        const address = prompt('Nhập địa chỉ chi nhánh:');
        if (!address) return;
        const open_hours = prompt('Nhập giờ mở cửa:', '10:00 - 22:30');

        fetchWithAuth('/api/admin/branches', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name,
                address,
                open_hours,
                thumbnail_url: '/uploads/branch-q1-thumb.webp' // Ảnh mặc định có sẵn từ seed.sql
            })
        }).then(res => {
            if (res && res.success) {
                alert('Tạo chi nhánh mới thành công!');
                loadBranchesCMS();
            }
        });
    });
}

// Khởi chạy khi tải trang
loadBranchesCMS();

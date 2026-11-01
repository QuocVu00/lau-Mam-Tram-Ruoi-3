// Module quản lý Hero Banner và Ảnh Thực Đơn (Settings CMS)
const heroBannersContainer = document.getElementById('heroBannersContainer');
const menuImagesContainer = document.getElementById('menuImagesContainer');

let currentSettings = {
    hero_banners: [],
    menu_images: []
};

// 1. Tải danh sách Banner và Menu từ CSDL
async function loadSettings() {
    if (!heroBannersContainer || !menuImagesContainer) return;
    const result = await fetchWithAuth('/api/admin/settings');
    if (!result || !result.success) return;

    currentSettings.hero_banners = Array.isArray(result.data.hero_banners) ? result.data.hero_banners : [];
    currentSettings.menu_images = Array.isArray(result.data.menu_images) ? result.data.menu_images : [];

    renderHeroBanners();
    renderMenuImages();
}

// 2. Hiển thị khu vực quản lý tối đa 3 ảnh Hero Banner
function renderHeroBanners() {
    const banners = currentSettings.hero_banners;
    let html = '<div style="display:flex; gap:15px; flex-wrap:wrap; margin-bottom:15px;">';

    banners.forEach((url, idx) => {
        html += `
            <div style="border:1px solid #ddd; border-radius:8px; padding:10px; width:220px; background:#fafafa; text-align:center;">
                <img src="${url}" style="width:100%; height:120px; object-fit:cover; border-radius:4px; margin-bottom:8px;" onerror="this.src='https://placehold.co/220x120?text=Lỗi+Ảnh'">
                <p style="font-size:12px; margin-bottom:8px; font-weight:600;">Banner số ${idx + 1}</p>
                <button class="btn-sm btn-danger" onclick="removeBanner(${idx})">🗑️ Xóa Banner</button>
            </div>
        `;
    });

    if (banners.length < 3) {
        html += `
            <div style="border:2px dashed #bbb; border-radius:8px; padding:20px; width:220px; display:flex; flex-direction:column; align-items:center; justify-content:center; text-align:center;">
                <p style="font-size:13px; color:#666; margin-bottom:10px;">Thêm ảnh banner (${banners.length}/3)</p>
                <input type="file" id="heroBannerInput" accept="image/*" style="display:none;" onchange="handleUploadBanner(this)">
                <button class="btn-sm btn-success" onclick="document.getElementById('heroBannerInput').click()">+ Tải Ảnh Lên</button>
            </div>
        `;
    }
    html += '</div>';
    heroBannersContainer.innerHTML = html;
}

// 3. Hiển thị khu vực quản lý tối đa 2 ảnh Menu
function renderMenuImages() {
    const menus = currentSettings.menu_images;
    let html = '<div style="display:flex; gap:15px; flex-wrap:wrap;">';

    menus.forEach((url, idx) => {
        html += `
            <div style="border:1px solid #ddd; border-radius:8px; padding:10px; width:220px; background:#fafafa; text-align:center;">
                <img src="${url}" style="width:100%; height:140px; object-fit:cover; border-radius:4px; margin-bottom:8px;" onerror="this.src='https://placehold.co/220x140?text=Lỗi+Menu'">
                <p style="font-size:12px; margin-bottom:8px; font-weight:600;">Menu số ${idx + 1}</p>
                <button class="btn-sm btn-danger" onclick="removeMenu(${idx})">🗑️ Xóa Menu</button>
            </div>
        `;
    });

    if (menus.length < 2) {
        html += `
            <div style="border:2px dashed #bbb; border-radius:8px; padding:20px; width:220px; display:flex; flex-direction:column; align-items:center; justify-content:center; text-align:center;">
                <p style="font-size:13px; color:#666; margin-bottom:10px;">Thêm thực đơn (${menus.length}/2)</p>
                <input type="file" id="menuImageInput" accept="image/*" style="display:none;" onchange="handleUploadMenu(this)">
                <button class="btn-sm btn-success" onclick="document.getElementById('menuImageInput').click()">+ Tải Thực Đơn</button>
            </div>
        `;
    }
    html += '</div>';
    menuImagesContainer.innerHTML = html;
}

// 4. Xử lý tải ảnh nén lên máy chủ
async function uploadCompressedFile(file) {
    // Kích hoạt tiện ích nén ảnh canvas sang WebP ngay trên trình duyệt
    const compressedWebP = await compressImageToWebP(file, 1600, 0.8);
    const formData = new FormData();
    formData.append('image', compressedWebP);

    const token = localStorage.getItem('admin_token');
    const response = await fetch('/api/admin/settings/upload', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
    });
    return response.json();
}

// 5. Thao tác thêm/xóa Banner & Menu
window.handleUploadBanner = async function(input) {
    if (!input.files || !input.files[0]) return;
    try {
        const uploadRes = await uploadCompressedFile(input.files[0]);
        if (uploadRes.success) {
            currentSettings.hero_banners.push(uploadRes.url);
            await saveSettingsKey('hero_banners', currentSettings.hero_banners);
            renderHeroBanners();
        }
    } catch (err) {
        alert('Lỗi nén hoặc tải ảnh: ' + err.message);
    }
};

window.removeBanner = async function(index) {
    if (!confirm('Bạn có chắc muốn xóa ảnh banner này?')) return;
    currentSettings.hero_banners.splice(index, 1);
    await saveSettingsKey('hero_banners', currentSettings.hero_banners);
    renderHeroBanners();
};

window.handleUploadMenu = async function(input) {
    if (!input.files || !input.files[0]) return;
    try {
        const uploadRes = await uploadCompressedFile(input.files[0]);
        if (uploadRes.success) {
            currentSettings.menu_images.push(uploadRes.url);
            await saveSettingsKey('menu_images', currentSettings.menu_images);
            renderMenuImages();
        }
    } catch (err) {
        alert('Lỗi nén hoặc tải thực đơn: ' + err.message);
    }
};

window.removeMenu = async function(index) {
    if (!confirm('Bạn có chắc muốn xóa ảnh menu này?')) return;
    currentSettings.menu_images.splice(index, 1);
    await saveSettingsKey('menu_images', currentSettings.menu_images);
    renderMenuImages();
};

async function saveSettingsKey(keyName, keyValue) {
    const res = await fetchWithAuth('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key_name: keyName, key_value: keyValue })
    });
    if (res && res.success) {
        console.log(`Đã lưu ${keyName} thành công!`);
    }
}

// Khởi chạy khi tải trang
loadSettings();


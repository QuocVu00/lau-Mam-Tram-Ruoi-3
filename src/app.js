/**
 * ====================================================================
 * MÁY CHỦ THỬ NGHIỆM NỘI BỘ (LOCAL DEVELOPMENT SERVER)
 * Dự án: Website Nhà Hàng "Lẩu Mắm Trăm Rưỡi"
 * Kỹ thuật: Node.js Native HTTP Module (Không cần cài đặt thêm thư viện)
 * ====================================================================
 */

import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROJECT_ROOT = path.resolve(__dirname, '..');

const PORT = process.env.PORT || 3000;

// Bảng định dạng MIME Types để trình duyệt hiển thị đúng kiểu tệp tin
const MIME_TYPES = {
    '.html': 'text/html; charset=UTF-8',
    '.css': 'text/css; charset=UTF-8',
    '.js': 'text/javascript; charset=UTF-8',
    '.json': 'application/json; charset=UTF-8',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.webp': 'image/webp',
    '.svg': 'image/svg+xml'
};

const server = http.createServer((req, res) => {
    const parsedUrl = new URL(req.url, `http://localhost:${PORT}`);
    let pathname = decodeURIComponent(parsedUrl.pathname);

    // 1. ÁNH XẠ ĐƯỜNG DẪN THÔNG MINH CHO TỪNG LOẠI FILE TĨNH
    // Trang chủ
    if (pathname === '/' || pathname === '/index.html') {
        pathname = '/src/client/pages/index.html';
    } 
    // Trang chi nhánh
    else if (pathname === '/branch.html') {
        pathname = '/src/client/pages/branch.html';
    }
    // File JS trang chủ và chi nhánh
    else if (pathname === '/home.js') {
        pathname = '/src/client/pages/home.js';
    }
    else if (pathname === '/branch.js') {
        pathname = '/src/client/pages/branch.js';
    }
    // Các thư mục components và animations của Người A
    else if (pathname.startsWith('/components/')) {
        pathname = '/src/client' + pathname;
    }
    else if (pathname.startsWith('/animations/')) {
        pathname = '/src/client' + pathname;
    }
    // Thư mục upload ảnh của Người B
    else if (pathname.startsWith('/uploads/')) {
        pathname = '/public' + pathname;
    }

    // Ghép đường dẫn an toàn vào thư mục gốc của dự án
    let filePath = path.join(PROJECT_ROOT, pathname);

    // 2. KIỂM TRA TỒN TẠI VÀ TRẢ VỀ FILE CHO TRÌNH DUYỆT
    fs.stat(filePath, (err, stats) => {
        if (err || !stats.isFile()) {
            res.writeHead(404, { 'Content-Type': 'text/plain; charset=UTF-8' });
            res.end(`404: Không tìm thấy tệp tin ${pathname}`);
            return;
        }

        const ext = path.extname(filePath).toLowerCase();
        const contentType = MIME_TYPES[ext] || 'application/octet-stream';

        fs.readFile(filePath, (readErr, content) => {
            if (readErr) {
                res.writeHead(500, { 'Content-Type': 'text/plain; charset=UTF-8' });
                res.end('500: Lỗi máy chủ đọc file');
                return;
            }

            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content);
        });
    });
});

server.listen(PORT, () => {
    console.log(`=======================================================`);
    console.log(`🚀 MÁY CHỦ THỬ NGHIỆM ĐANG CHẠY TẠI CỔNG ${PORT}!`);
    console.log(`👉 Xem Trang Chủ:              http://localhost:${PORT}`);
    console.log(`👉 Xem Chi Nhánh Quận 1:       http://localhost:${PORT}/branch.html?slug=chi-nhanh-quan-1`);
    console.log(`👉 Xem Chi Nhánh Tân Bình:     http://localhost:${PORT}/branch.html?slug=chi-nhanh-tan-binh`);
    console.log(`👉 Xem Chi Nhánh Bình Thạnh:   http://localhost:${PORT}/branch.html?slug=chi-nhanh-binh-thanh`);
    console.log(`=======================================================`);
});

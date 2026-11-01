import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import adminRouter from './admin/api/index.js';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

// Lấy đường dẫn thư mục gốc dự án theo chuẩn ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.join(__dirname, '..');

// Middleware phân tích dữ liệu JSON và form gửi lên từ trình duyệt
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Cung cấp các file tĩnh (ảnh đã nén .webp, css, js) từ thư mục public
app.use(express.static(path.join(rootDir, 'public')));

// Đăng ký toàn bộ API của phân hệ Quản trị (Admin CMS)
app.use('/api/admin', adminRouter);

// Phục vụ giao diện trang Admin từ thư mục src/admin/pages
app.use('/admin', express.static(path.join(rootDir, 'src', 'admin', 'pages')));

// Khởi chạy máy chủ HTTP lắng nghe tại cổng đã cấu hình
app.listen(PORT, () => {
    console.log(`🚀 Máy chủ đang chạy tại http://localhost:${PORT}`);
    console.log(`👉 Trang quản trị Admin: http://localhost:${PORT}/admin/login.html`);
});

export default app;

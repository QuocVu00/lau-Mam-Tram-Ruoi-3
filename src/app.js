/**
 * ====================================================================
 * MÁY CHỦ TRUNG TÂM TOÀN DỰ ÁN (CENTRAL APPLICATION SERVER)
 * Dự án: Website Nhà Hàng "Lẩu Mắm Trăm Rưỡi"
 * Mục đích: 
 *   - Hợp nhất Phân hệ Khách hàng (Thành viên A - Client Portal)
 *   - Và Phân hệ Quản trị (Thành viên B - Admin CMS & API)
 * Công nghệ: Node.js + Express Framework
 * ====================================================================
 */

import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Nạp các cổng API của Phân hệ Quản trị Admin (Người B)
import adminRouter from './admin/api/index.js';

// Đọc cấu hình biến môi trường từ tập tin .env
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Lấy đường dẫn thư mục gốc dự án theo chuẩn ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.join(__dirname, '..');

// 1. CÁC TIỆN ÍCH TRUNG GIAN (MIDDLEWARES)
// Phân tích dữ liệu JSON và biểu mẫu gửi lên từ client/admin
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Cung cấp các tệp tĩnh chung (thư mục ảnh upload WebP)
app.use(express.static(path.join(rootDir, 'public')));
app.use('/uploads', express.static(path.join(rootDir, 'public', 'uploads')));

// --------------------------------------------------------------------
// 2. PHÂN HỆ QUẢN TRỊ ADMIN (THÀNH VIÊN B)
// --------------------------------------------------------------------
// Toàn bộ API quản lý (Đơn hàng, Chi nhánh, Đánh giá, Góp ý, Banner)
app.use('/api/admin', adminRouter);

// Giao diện đăng nhập và bảng điều khiển CMS
app.use('/admin', express.static(path.join(rootDir, 'src', 'admin', 'pages')));
// Phục vụ file CSS và JS trong thư mục admin
app.use('/src/admin', express.static(path.join(rootDir, 'src', 'admin')));

// --------------------------------------------------------------------
// 3. PHÂN HỆ KHÁCH HÀNG CLIENT (THÀNH VIÊN A)
// --------------------------------------------------------------------
// Phục vụ các thành phần giao diện, hiệu ứng chuyển động và định kiểu
app.use('/components', express.static(path.join(rootDir, 'src', 'client', 'components')));
app.use('/animations', express.static(path.join(rootDir, 'src', 'client', 'animations')));
app.use('/src/client', express.static(path.join(rootDir, 'src', 'client')));

// Định tuyến các trang chính của Khách hàng
app.get('/', (req, res) => {
    res.sendFile(path.join(rootDir, 'src', 'client', 'pages', 'index.html'));
});

app.get('/index.html', (req, res) => {
    res.sendFile(path.join(rootDir, 'src', 'client', 'pages', 'index.html'));
});

app.get('/branch.html', (req, res) => {
    res.sendFile(path.join(rootDir, 'src', 'client', 'pages', 'branch.html'));
});

// Phục vụ file script riêng của từng trang
app.get('/home.js', (req, res) => {
    res.sendFile(path.join(rootDir, 'src', 'client', 'pages', 'home.js'));
});

app.get('/branch.js', (req, res) => {
    res.sendFile(path.join(rootDir, 'src', 'client', 'pages', 'branch.js'));
});

// --------------------------------------------------------------------
// 4. KHỞI CHẠY MÁY CHỦ TOÀN DỰ ÁN
// --------------------------------------------------------------------
app.listen(PORT, () => {
    console.log(`=======================================================`);
    console.log(`🎉 DỰ ÁN LẨU MẮM TRĂM RƯỠI ĐÃ GỘP THÀNH CÔNG VÀ ĐANG CHẠY!`);
    console.log(`🍲 [Khách Hàng] Trang Chủ:          http://localhost:${PORT}`);
    console.log(`📍 [Khách Hàng] Chi Nhánh Q1:       http://localhost:${PORT}/branch.html?slug=chi-nhanh-quan-1`);
    console.log(`🔐 [Quản Trị] Bảng Đăng Nhập CMS:  http://localhost:${PORT}/admin/login.html`);
    console.log(`=======================================================`);
});

export default app;

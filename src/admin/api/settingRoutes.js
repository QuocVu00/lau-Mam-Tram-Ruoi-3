import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import db from '../../config/db.js';
import { requireAdminAuth } from '../utils/auth.js';

const router = Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadsDir = path.join(__dirname, '../../../public/uploads');

// 1. Cấu hình Multer để lưu file ảnh nén vào thư mục public/uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadsDir),
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E4);
        cb(null, `${uniqueSuffix}-${file.originalname}`);
    }
});
const upload = multer({ storage });

// 2. API tải file ảnh WebP lên Hosting
router.post('/upload', requireAdminAuth, upload.single('image'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ success: false, message: 'Không có file ảnh nào được gửi lên!' });
    }
    const fileUrl = `/uploads/${req.file.filename}`;
    res.json({ success: true, url: fileUrl, message: 'Tải ảnh lên thành công!' });
});

// 3. API lấy cài đặt Banner và Menu
router.get('/', requireAdminAuth, async (req, res) => {
    try {
        const [rows] = await db.query('SELECT key_name, key_value FROM settings');
        const settings = {};
        rows.forEach(r => {
            try { settings[r.key_name] = JSON.parse(r.key_value); } catch { settings[r.key_name] = r.key_value; }
        });
        res.json({ success: true, data: settings });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Lỗi đọc cài đặt: ' + error.message });
    }
});

// 4. API lưu cài đặt Banner (tối đa 3 ảnh) và Menu (tối đa 2 ảnh)
router.put('/', requireAdminAuth, async (req, res) => {
    try {
        const { key_name, key_value } = req.body;
        // Kiểm tra ràng buộc đặc tả SRS
        if (key_name === 'hero_banners' && Array.isArray(key_value) && key_value.length > 3) {
            return res.status(400).json({ success: false, message: 'Hero Banner chỉ được phép tối đa 3 ảnh!' });
        }
        if (key_name === 'menu_images' && Array.isArray(key_value) && key_value.length > 2) {
            return res.status(400).json({ success: false, message: 'Thực đơn chỉ được phép tối đa 2 ảnh!' });
        }

        const jsonValue = JSON.stringify(key_value);
        await db.query(
            'INSERT INTO settings (key_name, key_value) VALUES (?, ?) ON DUPLICATE KEY UPDATE key_value = VALUES(key_value)',
            [key_name, jsonValue]
        );
        res.json({ success: true, message: 'Cập nhật cài đặt thành công!' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Lỗi lưu cài đặt: ' + error.message });
    }
});

export default router;


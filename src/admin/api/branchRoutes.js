import { Router } from 'express';
import db from '../../config/db.js';
import { requireAdminAuth } from '../utils/auth.js';

const router = Router();

// Hàm tạo URL thân thiện SEO (slug) từ tên tiếng Việt
function createSlug(str) {
    return str.toLowerCase()
        .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
        .replace(/đ/g, 'd')
        .replace(/[^a-z0-9\s-]/g, '')
        .trim().replace(/\s+/g, '-');
}

// 1. API lấy toàn bộ danh sách chi nhánh
router.get('/', requireAdminAuth, async (req, res) => {
    try {
        const [branches] = await db.query('SELECT * FROM branches ORDER BY id ASC');
        res.json({ success: true, data: branches });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Lỗi lấy chi nhánh: ' + error.message });
    }
});

// 2. API tạo mới một chi nhánh
router.post('/', requireAdminAuth, async (req, res) => {
    try {
        const { name, open_hours, address, thumbnail_url, intro_content, promo_banner_url } = req.body;
        if (!name || !address || !thumbnail_url) {
            return res.status(400).json({ success: false, message: 'Tên, địa chỉ và ảnh đại diện là bắt buộc!' });
        }

        const slug = createSlug(name) + '-' + Date.now().toString().slice(-4);
        const [result] = await db.query(
            `INSERT INTO branches (name, slug, thumbnail_url, open_hours, address, intro_content, promo_banner_url)
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [name, slug, thumbnail_url, open_hours || '10:00 - 22:00', address, intro_content || '', promo_banner_url || null]
        );

        res.json({ success: true, message: 'Tạo chi nhánh mới thành công!', id: result.insertId });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Lỗi tạo chi nhánh: ' + error.message });
    }
});

// 3. API cập nhật thông tin chi nhánh
router.put('/:id', requireAdminAuth, async (req, res) => {
    try {
        const { id } = req.params;
        const { name, open_hours, address, thumbnail_url, intro_content, promo_banner_url } = req.body;

        await db.query(
            `UPDATE branches 
             SET name = ?, thumbnail_url = ?, open_hours = ?, address = ?, intro_content = ?, promo_banner_url = ?
             WHERE id = ?`,
            [name, thumbnail_url, open_hours, address, intro_content, promo_banner_url, id]
        );

        res.json({ success: true, message: 'Cập nhật chi nhánh thành công!' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Lỗi cập nhật: ' + error.message });
    }
});

// 4. API xóa chi nhánh
router.delete('/:id', requireAdminAuth, async (req, res) => {
    try {
        const { id } = req.params;
        await db.query('DELETE FROM branches WHERE id = ?', [id]);
        res.json({ success: true, message: 'Xóa chi nhánh thành công!' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Lỗi xóa chi nhánh: ' + error.message });
    }
});

export default router;

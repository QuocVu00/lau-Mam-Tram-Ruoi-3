import { Router } from 'express';
import db from '../../config/db.js';
import { requireAdminAuth } from '../utils/auth.js';

const router = Router();

// 1. API lấy danh sách đánh giá ảo (có thể lọc theo branch_id hoặc 'home')
router.get('/', requireAdminAuth, async (req, res) => {
    try {
        const { branchId } = req.query;
        let sql = `
            SELECT r.*, COALESCE(b.name, 'Trang Chủ (Chung)') AS branch_name
            FROM seeding_reviews r
            LEFT JOIN branches b ON r.branch_id = b.id
        `;
        const params = [];

        if (branchId === 'home') {
            sql += ' WHERE r.branch_id IS NULL';
        } else if (branchId) {
            sql += ' WHERE r.branch_id = ?';
            params.push(branchId);
        }

        sql += ' ORDER BY r.created_at DESC';
        const [reviews] = await db.query(sql, params);
        res.json({ success: true, data: reviews });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Lỗi lấy đánh giá ảo: ' + error.message });
    }
});

// 2. API tạo mới đánh giá ảo (Kiểm tra chặn giới hạn tối đa 3 bài theo SRS)
router.post('/', requireAdminAuth, async (req, res) => {
    try {
        const { branch_id, author_name, rating, content } = req.body;
        if (!author_name || !content) {
            return res.status(400).json({ success: false, message: 'Họ tên và nội dung đánh giá là bắt buộc!' });
        }

        const targetBranchId = branch_id ? Number(branch_id) : null;

        // Dùng toán tử NULL-safe <=> trong MySQL để đếm số bài hiện tại ở vị trí này
        const [countRows] = await db.query(
            'SELECT COUNT(*) as count FROM seeding_reviews WHERE branch_id <=> ?',
            [targetBranchId]
        );

        if (countRows[0].count >= 3) {
            return res.status(400).json({ 
                success: false, 
                message: 'Vị trí này đã đủ 3 đánh giá tiêu chuẩn theo quy định hệ thống!' 
            });
        }

        await db.query(
            'INSERT INTO seeding_reviews (branch_id, author_name, rating, content) VALUES (?, ?, ?, ?)',
            [targetBranchId, author_name, rating || 5, content]
        );

        res.json({ success: true, message: 'Thêm đánh giá ảo thành công!' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Lỗi thêm đánh giá: ' + error.message });
    }
});

// 3. API xóa đánh giá ảo
router.delete('/:id', requireAdminAuth, async (req, res) => {
    try {
        const { id } = req.params;
        await db.query('DELETE FROM seeding_reviews WHERE id = ?', [id]);
        res.json({ success: true, message: 'Xóa đánh giá thành công!' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Lỗi xóa đánh giá: ' + error.message });
    }
});

export default router;


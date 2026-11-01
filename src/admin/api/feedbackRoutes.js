import { Router } from 'express';
import db from '../../config/db.js';
import { requireAdminAuth } from '../utils/auth.js';

const router = Router();

// 1. API lấy danh sách góp ý của khách (kèm tính năng Lazy Cleanup 7 ngày)
router.get('/', requireAdminAuth, async (req, res) => {
    try {
        // Cơ chế Lazy Cleanup: Tự động xóa vĩnh viễn các góp ý cũ hơn 7 ngày để tiết kiệm dung lượng hosting
        await db.query('DELETE FROM customer_feedbacks WHERE created_at < NOW() - INTERVAL 7 DAY');

        const { branchId } = req.query; // Nhận tham số lọc theo chi nhánh từ query string
        let querySql = `
            SELECT f.id, f.branch_id, f.content, f.created_at,
                   COALESCE(b.name, 'Chi nhánh không xác định') AS branch_name
            FROM customer_feedbacks f
            LEFT JOIN branches b ON f.branch_id = b.id
        `;
        const queryParams = [];

        // Nếu admin chọn lọc theo chi nhánh cụ thể
        if (branchId) {
            querySql += ' WHERE f.branch_id = ?';
            queryParams.push(branchId);
        }

        querySql += ' ORDER BY f.created_at DESC';

        const [feedbacks] = await db.query(querySql, queryParams);
        res.json({ success: true, data: feedbacks });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Lỗi truy vấn góp ý: ' + error.message });
    }
});

export default router;


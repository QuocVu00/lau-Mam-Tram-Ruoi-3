import { Router } from 'express';
import db from '../../config/db.js';
import { requireAdminAuth } from '../utils/auth.js';

const router = Router();

// 1. API lấy toàn bộ danh sách đơn hàng Đặt bàn & Mua mang về
router.get('/', requireAdminAuth, async (req, res) => {
    try {
        // Dùng LEFT JOIN để lấy kèm tên chi nhánh thay vì chỉ hiển thị branch_id
        const [orders] = await db.query(`
            SELECT o.id, o.branch_id, o.type, o.customer_name, o.phone, 
                   o.guest_count, o.delivery_address, o.created_at,
                   COALESCE(b.name, 'Chi nhánh không xác định') AS branch_name
            FROM orders o
            LEFT JOIN branches b ON o.branch_id = b.id
            ORDER BY o.created_at DESC
        `);
        res.json({ success: true, data: orders });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Lỗi truy vấn đơn hàng: ' + error.message });
    }
});

// 2. API Xóa ngầm đơn hàng khi nhân viên ấn nút [Đã xác nhận]
router.delete('/:id', requireAdminAuth, async (req, res) => {
    try {
        const orderId = req.params.id;
        // Thực thi xóa vĩnh viễn dòng dữ liệu khỏi bảng orders theo yêu cầu đặc tả SRS
        const [result] = await db.query('DELETE FROM orders WHERE id = ?', [orderId]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: 'Đơn hàng không tồn tại hoặc đã được xử lý trước đó!' });
        }

        res.json({ success: true, message: 'Đã xác nhận và xóa sạch đơn thành công!' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Lỗi khi xóa đơn: ' + error.message });
    }
});

export default router;


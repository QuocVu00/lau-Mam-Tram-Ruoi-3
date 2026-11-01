import { Router } from 'express';
import { verifyCredentials, getSessionToken } from '../utils/auth.js';

const router = Router();

// Định nghĩa API tiếp nhận thông tin đăng nhập từ form
router.post('/login', (req, res) => {
    const { username, password } = req.body;

    // Kiểm tra tính hợp lệ của tài khoản dựa trên biến môi trường .env
    if (!verifyCredentials(username, password)) {
        return res.status(401).json({ 
            success: false, 
            message: 'Tài khoản hoặc mật khẩu không chính xác!' 
        });
    }

    // Nếu thông tin đúng, trả về token phiên làm việc để trình duyệt lưu lại
    return res.json({
        success: true,
        message: 'Đăng nhập thành công!',
        token: getSessionToken()
    });
});

export default router;


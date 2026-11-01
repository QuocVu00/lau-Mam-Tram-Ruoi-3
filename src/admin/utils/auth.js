import crypto from 'crypto';

// Tạo mã token ngẫu nhiên khi server khởi động để làm khóa phiên quản trị viên
const ADMIN_SESSION_TOKEN = crypto.randomBytes(32).toString('hex');

// Hàm kiểm tra tài khoản và mật khẩu từ file .env
export function verifyCredentials(username, password) {
    // So sánh chuỗi đăng nhập với biến môi trường bảo mật
    return username === process.env.ADMIN_USERNAME && password === process.env.ADMIN_PASSWORD;
}

// Hàm lấy token phiên hợp lệ sau khi đăng nhập thành công
export function getSessionToken() {
    return ADMIN_SESSION_TOKEN;
}

// Middleware bảo vệ các API quản trị: chặn các yêu cầu không có token hợp lệ
export function requireAdminAuth(req, res, next) {
    // Lấy token từ header Authorization (dạng 'Bearer <token>')
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token || token !== ADMIN_SESSION_TOKEN) {
        // Trả về mã lỗi 401 Unauthorized nếu token không khớp hoặc bị thiếu
        return res.status(401).json({ success: false, message: 'Yêu cầu đăng nhập quản trị viên!' });
    }
    next(); // Cho phép đi tiếp vào controller nếu xác thực thành công
}


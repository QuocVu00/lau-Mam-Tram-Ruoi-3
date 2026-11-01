import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

// Tải các biến môi trường từ file .env vào biến toàn cục process.env
dotenv.config();

// Khởi tạo connection pool (hồ chứa kết nối) để tái sử dụng kết nối MySQL thay vì mở/đóng liên tục
const db = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'lau_mam_tram_ruoi',
    waitForConnections: true, // Khi hết kết nối rảnh, yêu cầu mới sẽ xếp hàng chờ thay vì báo lỗi
    connectionLimit: 10,       // Giới hạn tối đa 10 kết nối đồng thời để không làm quá tải MySQL
    queueLimit: 0             // Không giới hạn số lượng truy vấn xếp hàng chờ
});

export default db;


import { Router } from 'express';
import authRoutes from './authRoutes.js';
import orderRoutes from './orderRoutes.js';
import feedbackRoutes from './feedbackRoutes.js';
import branchRoutes from './branchRoutes.js';
import settingRoutes from './settingRoutes.js';
import reviewRoutes from './reviewRoutes.js';

const adminRouter = Router();

// Gắn nhánh router xác thực tài khoản vào tiền tố /auth
adminRouter.use('/auth', authRoutes);

// Gắn nhánh router quản lý đơn hàng vào tiền tố /orders
adminRouter.use('/orders', orderRoutes);

// Gắn nhánh router quản lý góp ý khách hàng vào tiền tố /feedbacks
adminRouter.use('/feedbacks', feedbackRoutes);

// Gắn nhánh router quản lý chi nhánh vào tiền tố /branches
adminRouter.use('/branches', branchRoutes);

// Gắn nhánh router quản lý cài đặt Banner và Menu vào tiền tố /settings
adminRouter.use('/settings', settingRoutes);

// Gắn nhánh router quản lý đánh giá ảo vào tiền tố /reviews
adminRouter.use('/reviews', reviewRoutes);

export default adminRouter;


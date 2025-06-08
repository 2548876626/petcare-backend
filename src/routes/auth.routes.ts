import express from 'express';
import { register, login, logout, refreshToken, getProfile, updateProfile } from '../controllers/auth.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = express.Router();

// 注册新用户
router.post('/register', register);

// 用户登录
router.post('/login', login);

// 用户登出
router.post('/logout', authenticate, logout);

// 刷新令牌
router.post('/refresh-token', refreshToken);

// 获取个人资料
router.get('/profile', authenticate, getProfile);

// 更新个人资料
router.put('/profile', authenticate, updateProfile);

export default router; 
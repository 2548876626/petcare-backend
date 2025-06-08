import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// 验证用户是否已登录
export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // 从请求头获取token
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: '未授权，请先登录' });
    }

    const token = authHeader.split(' ')[1];

    // 验证token
    try {
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || 'your_jwt_secret_key'
      ) as any;

      // 检查用户是否存在
      const user = await prisma.user.findUnique({
        where: { id: decoded.id },
      });

      if (!user) {
        return res.status(401).json({ message: '用户不存在，请重新登录' });
      }

      // 将用户信息添加到请求对象
      (req as any).user = {
        id: user.id,
        email: user.email,
        role: user.role,
      };

      next();
    } catch (err) {
      return res.status(401).json({ message: '令牌无效或已过期，请重新登录' });
    }
  } catch (error) {
    console.error('身份验证错误:', error);
    res.status(500).json({ message: '服务器错误，请稍后再试' });
  }
};

// 验证用户角色
export const authorize = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user;

    if (!user) {
      return res.status(401).json({ message: '未授权，请先登录' });
    }

    if (!roles.includes(user.role)) {
      return res.status(403).json({ message: '权限不足，无法访问该资源' });
    }

    next();
  };
}; 
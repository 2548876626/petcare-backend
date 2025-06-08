import { Request, Response } from 'express';
import { z } from 'zod';
import * as authService from '../services/auth.service';

// 输入验证schema
const registerSchema = z.object({
  email: z.string().email({ message: '请提供有效的电子邮件地址' }),
  password: z.string().min(6, { message: '密码至少需要6个字符' }),
  name: z.string().min(2, { message: '名称至少需要2个字符' }),
  phone: z.string().optional(),
  role: z.enum(['PET_OWNER', 'SERVICE_PROVIDER']),
});

const loginSchema = z.object({
  email: z.string().email({ message: '请提供有效的电子邮件地址' }),
  password: z.string(),
});

// 注册新用户
export const register = async (req: Request, res: Response) => {
  try {
    // 验证输入
    const validInput = registerSchema.safeParse(req.body);
    if (!validInput.success) {
      return res.status(400).json({ 
        message: '输入验证失败',
        errors: validInput.error.format() 
      });
    }

    const userData = validInput.data;

    try {
      // 调用服务层创建用户
      const { user, token } = await authService.createUser(userData);

      // 返回用户信息和token
      res.status(201).json({
        message: '注册成功',
        user,
        token,
      });
    } catch (error: any) {
      // 处理特定错误
      if (error.message === '该邮箱已被注册') {
        return res.status(400).json({ message: error.message });
      }
      throw error; // 其他错误抛出到外层catch
    }
  } catch (error) {
    console.error('注册错误:', error);
    res.status(500).json({ message: '服务器错误，请稍后再试' });
  }
};

// 用户登录
export const login = async (req: Request, res: Response) => {
  try {
    // 验证输入
    const validInput = loginSchema.safeParse(req.body);
    if (!validInput.success) {
      return res.status(400).json({ 
        message: '输入验证失败',
        errors: validInput.error.format() 
      });
    }

    const loginData = validInput.data;

    try {
      // 调用服务层登录用户
      const { user, token } = await authService.loginUser(loginData);

      // 返回用户信息和token
      res.status(200).json({
        message: '登录成功',
        user,
        token,
      });
    } catch (error: any) {
      // 处理特定错误
      if (error.message === '用户不存在' || error.message === '密码错误') {
        return res.status(400).json({ message: error.message });
      }
      throw error; // 其他错误抛出到外层catch
    }
  } catch (error) {
    console.error('登录错误:', error);
    res.status(500).json({ message: '服务器错误，请稍后再试' });
  }
};

// 用户登出
export const logout = (req: Request, res: Response) => {
  // 前端处理token删除，这里仅返回成功消息
  res.status(200).json({ message: '登出成功' });
};

// 刷新令牌
export const refreshToken = async (req: Request, res: Response) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({ message: '令牌不能为空' });
    }

    // TODO: 将刷新令牌逻辑移至服务层

    res.status(200).json({
      message: '令牌刷新成功',
      token: 'new_token_here',
    });
  } catch (error) {
    console.error('刷新令牌错误:', error);
    res.status(500).json({ message: '服务器错误，请稍后再试' });
  }
};

// 获取个人资料
export const getProfile = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;

    const user = await authService.getUserById(userId);

    if (!user) {
      return res.status(404).json({ message: '用户不存在' });
    }

    res.status(200).json({
      message: '获取个人资料成功',
      user,
    });
  } catch (error) {
    console.error('获取个人资料错误:', error);
    res.status(500).json({ message: '服务器错误，请稍后再试' });
  }
};

// 更新个人资料
export const updateProfile = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const { name, phone, avatar } = req.body;

    // 调用服务层更新用户资料
    const updatedUser = await authService.updateUser(userId, {
      name,
      phone,
      avatar
    });

    res.status(200).json({
      message: '个人资料更新成功',
      user: updatedUser,
    });
  } catch (error) {
    console.error('更新个人资料错误:', error);
    res.status(500).json({ message: '服务器错误，请稍后再试' });
  }
}; 
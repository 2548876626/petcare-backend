import { PrismaClient, User, Role } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

interface RegisterUserData {
  email: string;
  password: string;
  name: string;
  phone?: string;
  role: Role;
}

interface LoginUserData {
  email: string;
  password: string;
}

interface UserResponse {
  id: string;
  email: string;
  name: string;
  phone?: string | null;
  avatar?: string | null;
  role: Role;
  createdAt: Date;
}

/**
 * 创建新用户
 */
export const createUser = async (data: RegisterUserData): Promise<{ user: UserResponse; token: string }> => {
  // 检查用户是否已存在
  const existingUser = await prisma.user.findUnique({
    where: { email: data.email },
  });

  if (existingUser) {
    throw new Error('该邮箱已被注册');
  }

  // 哈希密码
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(data.password, salt);

  // 创建新用户
  const newUser = await prisma.user.create({
    data: {
      email: data.email,
      password: hashedPassword,
      name: data.name,
      phone: data.phone,
      role: data.role,
    },
  });

  // 生成token
  const token = jwt.sign(
    { id: newUser.id, role: newUser.role },
    process.env.JWT_SECRET || 'your_jwt_secret_key',
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );

  // 返回用户信息（不包含密码）
  const { password, ...userWithoutPassword } = newUser;

  return {
    user: userWithoutPassword as UserResponse,
    token,
  };
};

/**
 * 用户登录
 */
export const loginUser = async (data: LoginUserData): Promise<{ user: UserResponse; token: string }> => {
  // 查找用户
  const user = await prisma.user.findUnique({
    where: { email: data.email },
  });

  if (!user) {
    throw new Error('用户不存在');
  }

  // 验证密码
  const isValidPassword = await bcrypt.compare(data.password, user.password);
  if (!isValidPassword) {
    throw new Error('密码错误');
  }

  // 生成token
  const token = jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_SECRET || 'your_jwt_secret_key',
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );

  // 返回用户信息（不包含密码）
  const { password, ...userWithoutPassword } = user;

  return {
    user: userWithoutPassword as UserResponse,
    token,
  };
};

/**
 * 获取用户信息
 */
export const getUserById = async (userId: string): Promise<UserResponse | null> => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    return null;
  }

  // 返回用户信息（不包含密码）
  const { password, ...userWithoutPassword } = user;
  return userWithoutPassword as UserResponse;
};

/**
 * 更新用户信息
 */
export const updateUser = async (userId: string, data: Partial<User>): Promise<UserResponse> => {
  // 确保不能更新email和密码
  const { email, password, ...updateData } = data;

  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: updateData,
  });

  // 返回用户信息（不包含密码）
  const { password: pwd, ...userWithoutPassword } = updatedUser;
  return userWithoutPassword as UserResponse;
}; 
# 宠爱社区后端 (PetCare API)

宠爱社区（PetCare Community）后端服务，提供API接口支持前端应用。

## 技术栈

- Node.js
- Express.js
- TypeScript
- PostgreSQL
- Prisma ORM
- JWT Authentication

## 本地开发

### 前提条件

- Node.js (v14+)
- PostgreSQL 数据库

### 安装依赖

```bash
npm install
```

### 配置环境变量

1. 复制环境变量示例文件
```bash
cp .env.example .env
```

2. 编辑 `.env` 文件，填入你的数据库连接信息和其他必要配置

### 数据库迁移

```bash
npm run prisma:migrate
```

### 生成Prisma客户端

```bash
npm run prisma:generate
```

### 启动开发服务器

```bash
npm run dev
```

## 生产部署 (Render.com)

### 部署步骤

1. 在 [Render](https://render.com) 上创建一个账户（如果你还没有）
2. 创建一个新的 Web Service
3. 连接你的GitHub仓库
4. 配置以下设置:
   - **Name**: petcare-api (或任何你喜欢的名称)
   - **Environment**: Node
   - **Build Command**: `npm install && npm run prisma:generate && npm run build`
   - **Start Command**: `npm start`

### 环境变量配置

在Render的Web Service控制面板中，添加以下环境变量:

- `DATABASE_URL`: 使用Render提供的**Internal Database URL**，格式为`postgresql://user:password@hostname/database`
- `JWT_SECRET`: 一个安全的随机字符串，用于JWT令牌签名
- `JWT_EXPIRES_IN`: JWT过期时间，例如`7d`（7天）
- `NODE_ENV`: 设置为`production`
- `BACKEND_URL`: 你的Render应用URL，例如`https://petcare-api.onrender.com`

### 数据库设置

1. 在Render上创建一个PostgreSQL数据库
2. 将提供的**Internal Database URL**复制到你的Web Service环境变量中

### 自动部署

配置好后，每当你推送新代码到GitHub仓库的主分支时，Render将自动部署你的应用。

### 注意事项

- 首次部署可能需要几分钟
- 免费层的应用在不活动一段时间后会休眠，首次访问可能较慢
- 确保在部署前已经完成所有必要的环境变量配置

## API文档

### 认证接口

- `POST /api/auth/register`: 用户注册
- `POST /api/auth/login`: 用户登录
- `GET /api/auth/profile`: 获取当前用户信息
- `PUT /api/auth/profile`: 更新用户资料

### 宠物接口

- `GET /api/pets`: 获取宠物列表
- `POST /api/pets`: 创建新宠物
- `GET /api/pets/:id`: 获取特定宠物信息
- `PUT /api/pets/:id`: 更新宠物信息
- `DELETE /api/pets/:id`: 删除宠物

### 服务接口

- `GET /api/services`: 获取服务列表
- `POST /api/services`: 创建新服务
- `GET /api/services/:id`: 获取特定服务信息
- `PUT /api/services/:id`: 更新服务信息
- `DELETE /api/services/:id`: 删除服务

### 预约接口

- `GET /api/bookings`: 获取预约列表
- `POST /api/bookings`: 创建新预约
- `GET /api/bookings/:id`: 获取特定预约信息
- `PUT /api/bookings/:id`: 更新预约信息
- `DELETE /api/bookings/:id`: 取消预约 
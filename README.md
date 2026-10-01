# TechBlog API（Blog_2-backend）

<p align="center">
  <img alt="Next.js" src="https://img.shields.io/badge/next.js-14.x-black">
  <img alt="TypeScript" src="https://img.shields.io/badge/typescript-5.x-blue">
  <img alt="Drizzle ORM" src="https://img.shields.io/badge/drizzle--orm-0.29-c5f74f">
  <img alt="Neon" src="https://img.shields.io/badge/neon-serverless%20postgres-00e599">
  <img alt="Zod" src="https://img.shields.io/badge/zod-3.x-3e67b1">
</p>

TechBlog API 是 dongzhongcen 博客（Blog_2）的后端服务，基于 Next.js 14 App Router 的 Route Handlers 实现，使用 Drizzle ORM 连接 Neon PostgreSQL。项目目前实现了文章的列表、详情、创建、更新和删除，评论的获取、发表和删除，文章/评论点赞，以及健康检查接口，所有接口均返回 CORS 响应头，供独立部署的前端调用。

## 功能特性

- **健康检查**：`GET /api/health`，执行 `SELECT 1` 检测数据库连接。
- **文章列表**：`GET /api/posts`，支持 `tag` 过滤、`sort`（默认 `newest`）排序和 `limit` / `offset` 分页。
- **文章详情**：`GET /api/posts/[slug]`，按 slug 获取文章并累加浏览量。
- **文章管理**：`POST /api/posts` 创建文章，`PUT` / `PATCH` / `DELETE /api/posts/[slug]` 更新和删除文章，请求体使用 Zod 校验。
- **评论**：`GET /api/comments?postId=` 获取评论，`POST /api/comments` 发表评论，`DELETE /api/comments/[id]` 删除评论。
- **点赞**：`POST /api/likes` 切换文章或评论的点赞状态，`GET /api/likes/check?type=&id=` 查询当前 IP 是否已点赞；按 IP 地址防止重复点赞。
- **CORS**：各接口处理 `OPTIONS` 预检并返回 `Access-Control-Allow-Origin: *`。

## 项目结构

```text
.
├── app/
│   ├── api/
│   │   ├── health/          # 健康检查
│   │   ├── posts/           # 文章列表、创建；[slug]/ 详情、更新、删除
│   │   ├── comments/        # 评论列表、发表；[id]/ 删除
│   │   └── likes/           # 点赞切换与状态查询
│   ├── layout.tsx
│   └── page.tsx             # 接口说明首页
├── lib/
│   ├── db.ts                # Neon + Drizzle 连接
│   └── schema.ts            # posts、comments、post_likes、comment_likes 表定义
├── drizzle/
│   ├── 0000_initial.sql     # 初始建表脚本和示例文章
│   └── migrate.ts           # Drizzle 迁移脚本
├── drizzle.config.ts
├── TROUBLESHOOTING.md       # 点赞和评论功能故障排查
└── package.json
```

## 快速开始

### 环境要求

- Node.js 与 npm
- Neon PostgreSQL 数据库（或其他 PostgreSQL）

### 配置环境变量

复制 `.env.example`（或 `.env.local.example`）为 `.env.local`，填写数据库连接串：

```text
DATABASE_URL=postgresql://username:password@ep-xxx.us-east-1.aws.neon.tech/database?sslmode=require
```

### 初始化数据库

在数据库中执行 `drizzle/0000_initial.sql`，创建表并插入示例文章，例如：

```bash
psql "$DATABASE_URL" -f drizzle/0000_initial.sql
```

### 本地开发

```bash
npm install
npm run dev
```

### 构建与运行

```bash
npm run build
npm run start
```

点赞和评论的工作原理、常见问题及 curl 验证命令见 [TROUBLESHOOTING.md](TROUBLESHOOTING.md)。

## 当前状态

主要的文章、评论和点赞接口已经完成。后续可继续完善：

- 为创建、更新、删除文章和删除评论接口增加管理员鉴权（代码中标记为 TODO，`.env.example` 中预留了 `ADMIN_TOKEN`）
- 让 `drizzle/migrate.ts` 与实际迁移文件位置一致，并在 `package.json` 中添加迁移脚本
- 增加 `package-lock.json` 和 `.gitignore`（排除 `node_modules/`、`.next/`、`.env.local`）
- 按环境限制 CORS 允许的来源

# 点赞和评论功能故障排查

## 点赞功能工作原理

### 后端逻辑
- 使用 **IP 地址** 识别用户，防止重复点赞
- 同一 IP 只能点一次赞（取消后可重新点）
- 总点赞数保存在 `posts.likes` 字段
- 点赞记录保存在 `post_likes` 表

### 前端逻辑
- 页面加载时调用 `GET /api/likes/check?type=post&id=xxx` 检查当前 IP 是否已点赞
- 点击点赞按钮调用 `POST /api/likes` 切换点赞状态
- 同时更新 localStorage 作为本地缓存

### 为什么同一文章在不同浏览器显示不同点赞状态？
这是**正常行为**，因为：
1. 后端基于 **IP 地址** 判断，不是基于用户账号
2. 同一 WiFi 下的所有设备共享同一个公网 IP
3. 如果 A 设备点了赞，B 设备（同 WiFi）会显示已点赞

### 如何验证点赞功能正常工作？

1. **检查总点赞数**：
   ```bash
   # 查看文章点赞数
   curl https://your-backend.vercel.app/api/posts
   ```

2. **检查点赞状态**：
   ```bash
   # 替换 {postId} 为实际文章 ID
   curl "https://your-backend.vercel.app/api/likes/check?type=post&id={postId}"
   ```

3. **测试点赞**：
   ```bash
   curl -X POST https://your-backend.vercel.app/api/likes \
     -H "Content-Type: application/json" \
     -d '{"type": "post", "id": 1}'
   ```

## 评论功能工作原理

### 后端逻辑
- 评论保存在 `comments` 表
- 通过 `postId` 关联到文章
- 支持创建 (POST) 和删除 (DELETE)

### 前端逻辑
- 加载文章时获取评论列表 `GET /api/comments?postId=xxx`
- 发表评论调用 `POST /api/comments`

### 常见问题和排查

#### 1. 评论发表后消失
**原因**：可能是前端状态未正确更新
**检查**：
- 打开浏览器开发者工具 (F12)
- 查看 Network 标签
- 检查 POST /api/comments 请求是否成功

#### 2. 评论无法发表
**排查步骤**：
1. 检查 API URL 配置是否正确：
   ```bash
   # 前端 .env.production
   VITE_API_URL=https://your-backend.vercel.app/api
   ```

2. 检查 CORS 配置：
   ```bash
   curl -X OPTIONS https://your-backend.vercel.app/api/comments \
     -H "Origin: https://your-frontend.vercel.app" \
     -v
   ```

3. 查看后端日志：
   - 登录 Vercel Dashboard
   - 查看 Functions 日志

#### 3. 评论显示为乱码或格式错误
**原因**：可能是字符编码问题
**解决**：确保数据库和 API 都使用 UTF-8 编码

## 数据库验证

### 查看文章和点赞数
```sql
-- 查看所有文章及其点赞数
SELECT id, title, likes, views FROM posts ORDER BY likes DESC;

-- 查看点赞记录
SELECT * FROM post_likes WHERE post_id = 1;
```

### 查看评论
```sql
-- 查看某篇文章的评论
SELECT * FROM comments WHERE post_id = 1 ORDER BY created_at DESC;

-- 查看所有评论
SELECT c.*, p.title as post_title 
FROM comments c 
JOIN posts p ON c.post_id = p.id 
ORDER BY c.created_at DESC;
```

## 部署检查清单

1. [ ] 后端 API 已部署且可访问
2. [ ] 前端 `.env.production` 中的 `VITE_API_URL` 指向正确的后端地址
3. [ ] 数据库连接字符串 (`DATABASE_URL`) 已配置
4. [ ] 数据库表已创建（运行 migration）
5. [ ] CORS 配置允许前端域名访问

## 快速测试命令

```bash
# 1. 测试后端健康检查
curl https://your-backend.vercel.app/api/health

# 2. 获取文章列表
curl https://your-backend.vercel.app/api/posts

# 3. 获取单篇文章
curl https://your-backend.vercel.app/api/posts/react-hooks-deep-dive

# 4. 获取评论
curl "https://your-backend.vercel.app/api/comments?postId=1"

# 5. 测试点赞（会返回当前 IP 的点赞状态）
curl -X POST https://your-backend.vercel.app/api/likes \
  -H "Content-Type: application/json" \
  -d '{"type": "post", "id": 1}'
```

## 联系方式

如果问题仍然存在，请检查：
1. Vercel Functions 日志中的错误信息
2. 浏览器开发者工具中的 Network 请求
3. 数据库连接是否正常

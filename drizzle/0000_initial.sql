-- Initial schema for TechBlog

-- Posts table
CREATE TABLE IF NOT EXISTS posts (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL UNIQUE,
  excerpt TEXT NOT NULL,
  content TEXT NOT NULL,
  cover_image VARCHAR(500),
  tags VARCHAR(500) NOT NULL DEFAULT '[]',
  published_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP,
  read_time INTEGER NOT NULL DEFAULT 5,
  likes INTEGER NOT NULL DEFAULT 0,
  views INTEGER NOT NULL DEFAULT 0
);

-- Comments table
CREATE TABLE IF NOT EXISTS comments (
  id SERIAL PRIMARY KEY,
  post_id INTEGER NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  author VARCHAR(100) NOT NULL,
  avatar VARCHAR(500),
  content TEXT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  likes INTEGER NOT NULL DEFAULT 0
);

-- Post likes tracking (prevent duplicate likes)
CREATE TABLE IF NOT EXISTS post_likes (
  id SERIAL PRIMARY KEY,
  post_id INTEGER NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  ip_address VARCHAR(45) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  UNIQUE(post_id, ip_address)
);

-- Comment likes tracking
CREATE TABLE IF NOT EXISTS comment_likes (
  id SERIAL PRIMARY KEY,
  comment_id INTEGER NOT NULL REFERENCES comments(id) ON DELETE CASCADE,
  ip_address VARCHAR(45) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  UNIQUE(comment_id, ip_address)
);

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_posts_slug ON posts(slug);
CREATE INDEX IF NOT EXISTS idx_posts_published_at ON posts(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_comments_post_id ON comments(post_id);
CREATE INDEX IF NOT EXISTS idx_comments_created_at ON comments(created_at DESC);

-- Insert sample data
INSERT INTO posts (title, slug, excerpt, content, cover_image, tags, read_time, likes, views) VALUES
('深入理解 React Hooks 原理', 'react-hooks-deep-dive', 
 '探索 React Hooks 的内部工作原理，了解 useState 和 useEffect 是如何实现的。',
 '# 深入理解 React Hooks 原理

React Hooks 是 React 16.8 引入的革命性特性...',
 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800',
 '["React", "JavaScript", "Frontend"]',
 8, 42, 1280),

('TypeScript 高级类型技巧', 'typescript-advanced-types',
 '掌握 TypeScript 的高级类型系统，包括条件类型、映射类型等。',
 '# TypeScript 高级类型技巧

TypeScript 的类型系统非常强大...',
 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=800',
 '["TypeScript", "JavaScript"]',
 12, 38, 956),

('Next.js 14 新特性详解', 'nextjs-14-features',
 '深入了解 Next.js 14 带来的 Server Actions、Partial Prerendering 等新特性。',
 '# Next.js 14 新特性详解

Next.js 14 带来了许多令人兴奋的新特性...',
 'https://images.unsplash.com/photo-1618477388954-7852f32655ec?w=800',
 '["Next.js", "React", "Fullstack"]',
 10, 56, 1543);

-- Insert sample comments
INSERT INTO comments (post_id, author, content, likes) VALUES
(1, '张三', '写得太好了，终于理解了 Hooks 的原理！', 12),
(1, '李四', '期待更多 React 相关的文章', 8),
(2, '王五', 'TypeScript 的类型系统真的很强大', 5);

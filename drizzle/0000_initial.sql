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

React Hooks 是 React 16.8 引入的革命性特性，它让我们可以在函数组件中使用状态和其他 React 特性。

## 为什么需要 Hooks

在 Hooks 出现之前，我们只能使用类组件来管理状态。Hooks 解决了以下问题：
- 组件间状态逻辑复用困难
- 复杂组件难以理解
- this 指向问题

## useState 原理

useState 是 React 提供的最基础的 Hook...',
 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800',
 '["React", "JavaScript", "Frontend"]',
 8, 42, 1280),

('TypeScript 高级类型技巧', 'typescript-advanced-types',
 '掌握 TypeScript 的高级类型系统，包括条件类型、映射类型等。',
 '# TypeScript 高级类型技巧

TypeScript 的类型系统非常强大，可以帮助我们捕获更多错误，提高代码质量。

## 条件类型

条件类型允许我们根据条件选择类型...

## 映射类型

映射类型可以基于旧类型创建新类型...',
 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=800',
 '["TypeScript", "JavaScript"]',
 12, 38, 956),

('Next.js 14 新特性详解', 'nextjs-14-features',
 '深入了解 Next.js 14 带来的 Server Actions、Partial Prerendering 等新特性。',
 '# Next.js 14 新特性详解

Next.js 14 带来了许多令人兴奋的新特性，让全栈开发更加简单高效。

## Server Actions

Server Actions 让我们可以直接在组件中调用服务器端函数...

## Partial Prerendering

部分预渲染结合了静态和动态渲染的优势...',
 'https://images.unsplash.com/photo-1618477388954-7852f32655ec?w=800',
 '["Next.js", "React", "Fullstack"]',
 10, 56, 1543),

('Node.js 性能优化实践', 'nodejs-performance-optimization',
 '分享 Node.js 应用性能优化的实战经验和最佳实践。',
 '# Node.js 性能优化实践

性能优化是后端开发的重要课题，本文将分享一些实用的优化技巧。

## 内存优化

Node.js 的内存管理对性能影响很大...

## 异步优化

合理使用异步操作可以显著提升性能...',
 'https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=800',
 '["Node.js", "Backend", "Performance"]',
 15, 67, 2103),

('Docker 容器化部署指南', 'docker-deployment-guide',
 '从零开始学习 Docker，掌握容器化部署的核心概念和实践。',
 '# Docker 容器化部署指南

Docker 已经成为现代应用部署的标准工具，本文将帮助你快速上手。

## 核心概念

- 镜像（Image）
- 容器（Container）
- 仓库（Repository）

## Dockerfile 编写

编写高效的 Dockerfile 是容器化的关键...',
 'https://images.unsplash.com/photo-1605745341112-85968b19335b?w=800',
 '["Docker", "DevOps", "Deployment"]',
 10, 45, 1687),

('PostgreSQL 数据库优化技巧', 'postgresql-optimization',
 '深入 PostgreSQL 数据库的查询优化、索引设计和性能调优。',
 '# PostgreSQL 数据库优化技巧

PostgreSQL 是世界上最强大的开源关系型数据库之一。

## 查询优化

使用 EXPLAIN ANALYZE 分析查询计划...

## 索引策略

合理的索引设计是性能的关键...',
 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=800',
 '["PostgreSQL", "Database", "Backend"]',
 12, 53, 1432),

('Tailwind CSS 实战技巧', 'tailwind-css-tips',
 '提高 Tailwind CSS 开发效率的实用技巧和最佳实践。',
 '# Tailwind CSS 实战技巧

Tailwind CSS 是一个实用优先的 CSS 框架，可以大大提高开发效率。

## 自定义配置

通过 tailwind.config.js 扩展框架...

## 组件提取

使用 @apply 提取可复用组件...',
 'https://images.unsplash.com/photo-1587620962725-abab7fe55159?w=800',
 '["CSS", "Tailwind", "Frontend"]',
 8, 34, 987),

('Git 工作流最佳实践', 'git-workflow-best-practices',
 '团队协作中 Git 分支管理、提交规范和代码审查的最佳实践。',
 '# Git 工作流最佳实践

良好的 Git 工作流是团队协作的基础。

## 分支策略

- main: 主分支
- develop: 开发分支
- feature/*: 功能分支

## 提交规范

使用语义化提交信息...',
 'https://images.unsplash.com/photo-1556075798-4825dfaaf498?w=800',
 '["Git", "DevOps", "Collaboration"]',
 6, 89, 2345),

('微服务架构设计原则', 'microservices-design-principles',
 '探讨微服务架构的核心原则、拆分策略和常见陷阱。',
 '# 微服务架构设计原则

微服务架构是一种将应用拆分为小型、独立服务的架构风格。

## 设计原则

- 单一职责
- 独立部署
- 去中心化

## 服务拆分

领域驱动设计（DDD）是拆分的有效方法...',
 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800',
 '["Microservices", "Architecture", "Backend"]',
 18, 76, 1876),

('React Native 跨平台开发入门', 'react-native-getting-started',
 '使用 React Native 构建 iOS 和 Android 应用的入门指南。',
 '# React Native 跨平台开发入门

React Native 让你可以使用 React 的语法开发原生移动应用。

## 环境搭建

安装必要的开发工具...

## 核心组件

View、Text、Image 等基础组件的使用...',
 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800',
 '["React Native", "Mobile", "React"]',
 14, 41, 1123),

('Web 安全基础：XSS 和 CSRF 防护', 'web-security-basics',
 '了解常见的 Web 安全漏洞和防护措施，保护你的应用安全。',
 '# Web 安全基础：XSS 和 CSRF 防护

Web 安全是每个开发者都应该了解的重要话题。

## XSS 攻击

跨站脚本攻击的原理和防护...

## CSRF 攻击

跨站请求伪造的防御策略...',
 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=800',
 '["Security", "Web", "Backend"]',
 11, 92, 2678),

('Redis 缓存策略实战', 'redis-caching-strategies',
 '掌握 Redis 缓存的各种策略：缓存穿透、缓存击穿和缓存雪崩的解决方案。',
 '# Redis 缓存策略实战

Redis 是高性能的键值存储，广泛用于缓存场景。

## 缓存策略

- Cache Aside
- Read Through
- Write Through

## 常见问题

缓存穿透、击穿、雪崩的解决方案...',
 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800',
 '["Redis", "Cache", "Backend"]',
 13, 58, 1567),

('GraphQL vs REST API 选择指南', 'graphql-vs-rest',
 '对比 GraphQL 和 REST API 的优缺点，帮助你做出正确的选择。',
 '# GraphQL vs REST API 选择指南

API 设计是系统架构中的重要决策。

## REST 的优势

- 简单直观
- 缓存友好
- 成熟生态

## GraphQL 的优势

- 灵活查询
- 强类型
- 减少请求次数...',
 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800',
 '["GraphQL", "REST", "API"]',
 9, 47, 1345);

-- Insert sample comments
INSERT INTO comments (post_id, author, content, likes) VALUES
(1, '张三', '写得太好了，终于理解了 Hooks 的原理！', 12),
(1, '李四', '期待更多 React 相关的文章', 8),
(2, '王五', 'TypeScript 的类型系统真的很强大', 5),
(2, '赵六', '学到了很多高级类型的用法，谢谢分享', 3),
(3, '陈七', 'Next.js 14 的 Server Actions 确实很方便', 7),
(4, '刘八', 'Node.js 性能优化部分非常实用', 9),
(5, '周九', 'Docker 入门教程写得很清晰', 4),
(6, '吴十', 'PostgreSQL 索引优化技巧帮了大忙', 6),
(7, '郑十一', 'Tailwind 的效率提升技巧很有用', 2),
(8, '孙十二', 'Git 工作流对我们团队很有帮助', 15),
(9, '钱十三', '微服务拆分的建议很中肯', 8),
(10, '李十四', 'React Native 入门教程很详细', 5),
(11, '周十五', 'Web 安全是每个开发者都应该重视的', 11),
(12, '吴十六', 'Redis 缓存策略讲得很透彻', 6),
(13, '郑十七', 'GraphQL 和 REST 的对比很客观', 4);

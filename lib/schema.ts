import { pgTable, serial, varchar, text, integer, timestamp, boolean } from 'drizzle-orm/pg-core';

// Blog posts table
export const posts = pgTable('posts', {
  id: serial('id').primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  slug: varchar('slug', { length: 255 }).notNull().unique(),
  excerpt: text('excerpt').notNull(),
  content: text('content').notNull(),
  coverImage: varchar('cover_image', { length: 500 }),
  tags: varchar('tags', { length: 500 }).notNull(), // JSON array as string
  publishedAt: timestamp('published_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at'),
  readTime: integer('read_time').notNull().default(5),
  likes: integer('likes').notNull().default(0),
  views: integer('views').notNull().default(0),
});

// Comments table
export const comments = pgTable('comments', {
  id: serial('id').primaryKey(),
  postId: integer('post_id').notNull().references(() => posts.id, { onDelete: 'cascade' }),
  author: varchar('author', { length: 100 }).notNull(),
  avatar: varchar('avatar', { length: 500 }),
  content: text('content').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  likes: integer('likes').notNull().default(0),
});

// Likes tracking table (to prevent duplicate likes)
export const postLikes = pgTable('post_likes', {
  id: serial('id').primaryKey(),
  postId: integer('post_id').notNull().references(() => posts.id, { onDelete: 'cascade' }),
  ipAddress: varchar('ip_address', { length: 45 }).notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

export const commentLikes = pgTable('comment_likes', {
  id: serial('id').primaryKey(),
  commentId: integer('comment_id').notNull().references(() => comments.id, { onDelete: 'cascade' }),
  ipAddress: varchar('ip_address', { length: 45 }).notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

// Types
export type Post = typeof posts.$inferSelect;
export type NewPost = typeof posts.$inferInsert;
export type Comment = typeof comments.$inferSelect;
export type NewComment = typeof comments.$inferInsert;
export type PostLike = typeof postLikes.$inferSelect;
export type CommentLike = typeof commentLikes.$inferSelect;

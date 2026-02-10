import { NextRequest, NextResponse } from 'next/server';
import { db, posts } from '@/lib/db';
import { eq, desc, sql } from 'drizzle-orm';
import { z } from 'zod';

// GET /api/posts - Get all posts
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const tag = searchParams.get('tag');
    const sort = searchParams.get('sort') || 'newest';
    const limit = parseInt(searchParams.get('limit') || '100');
    const offset = parseInt(searchParams.get('offset') || '0');

    let query = db.select().from(posts);

    // Filter by tag if provided
    if (tag) {
      query = query.where(sql`${posts.tags}::text ILIKE ${`%${tag}%`}`);
    }

    // Sort
    if (sort === 'popular') {
      query = query.orderBy(desc(posts.views));
    } else {
      query = query.orderBy(desc(posts.publishedAt));
    }

    // Pagination
    query = query.limit(limit).offset(offset);

    const allPosts = await query;

    // Parse tags from JSON string
    const parsedPosts = allPosts.map(post => ({
      ...post,
      tags: JSON.parse(post.tags || '[]'),
    }));

    return NextResponse.json({ posts: parsedPosts });
  } catch (error) {
    console.error('Error fetching posts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch posts' },
      { status: 500 }
    );
  }
}

// POST /api/posts - Create a new post (admin only)
const createPostSchema = z.object({
  title: z.string().min(1).max(255),
  slug: z.string().min(1).max(255),
  excerpt: z.string().min(1),
  content: z.string().min(1),
  coverImage: z.string().optional(),
  tags: z.array(z.string()),
  readTime: z.number().default(5),
});

export async function POST(request: NextRequest) {
  try {
    // TODO: Add authentication check
    const body = await request.json();
    const validated = createPostSchema.parse(body);

    const newPost = await db.insert(posts).values({
      ...validated,
      tags: JSON.stringify(validated.tags),
    }).returning();

    return NextResponse.json({ post: newPost[0] }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.errors },
        { status: 400 }
      );
    }
    console.error('Error creating post:', error);
    return NextResponse.json(
      { error: 'Failed to create post' },
      { status: 500 }
    );
  }
}

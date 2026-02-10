import { NextRequest, NextResponse } from 'next/server';
import { db, posts } from '@/lib/db';
import { desc, sql } from 'drizzle-orm';
import { z } from 'zod';

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

// Handle OPTIONS request for CORS
export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

// GET /api/posts - Get all posts
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const tag = searchParams.get('tag');
    const sort = searchParams.get('sort') || 'newest';
    const limit = parseInt(searchParams.get('limit') || '100');
    const offset = parseInt(searchParams.get('offset') || '0');

    // Build query based on conditions
    let allPosts;
    
    if (tag) {
      // With tag filter
      if (sort === 'popular') {
        allPosts = await db
          .select()
          .from(posts)
          .where(sql`${posts.tags}::text ILIKE ${`%${tag}%`}`)
          .orderBy(desc(posts.views))
          .limit(limit)
          .offset(offset);
      } else {
        allPosts = await db
          .select()
          .from(posts)
          .where(sql`${posts.tags}::text ILIKE ${`%${tag}%`}`)
          .orderBy(desc(posts.publishedAt))
          .limit(limit)
          .offset(offset);
      }
    } else {
      // Without tag filter
      if (sort === 'popular') {
        allPosts = await db
          .select()
          .from(posts)
          .orderBy(desc(posts.views))
          .limit(limit)
          .offset(offset);
      } else {
        allPosts = await db
          .select()
          .from(posts)
          .orderBy(desc(posts.publishedAt))
          .limit(limit)
          .offset(offset);
      }
    }

    // Parse tags from JSON string and convert types
    const parsedPosts = allPosts.map(post => ({
      ...post,
      id: String(post.id),
      tags: JSON.parse(post.tags || '[]'),
      publishedAt: post.publishedAt?.toISOString() || new Date().toISOString(),
      updatedAt: post.updatedAt?.toISOString(),
    }));

    return NextResponse.json(
      { posts: parsedPosts },
      { headers: corsHeaders }
    );
  } catch (error) {
    console.error('Error fetching posts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch posts' },
      { status: 500, headers: corsHeaders }
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

    return NextResponse.json(
      { post: newPost[0] },
      { status: 201, headers: corsHeaders }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.errors },
        { status: 400, headers: corsHeaders }
      );
    }
    console.error('Error creating post:', error);
    return NextResponse.json(
      { error: 'Failed to create post' },
      { status: 500, headers: corsHeaders }
    );
  }
}

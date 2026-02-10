import { NextRequest, NextResponse } from 'next/server';
import { db, posts } from '@/lib/db';
import { eq, sql } from 'drizzle-orm';

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

// GET /api/posts/[slug] - Get a single post
export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;

    const post = await db.select().from(posts).where(eq(posts.slug, slug)).limit(1);

    if (post.length === 0) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404, headers: corsHeaders }
      );
    }

    // Increment view count
    await db.update(posts)
      .set({ views: sql`${posts.views} + 1` })
      .where(eq(posts.id, post[0].id));

    // Parse tags
    const parsedPost = {
      ...post[0],
      tags: JSON.parse(post[0].tags || '[]'),
      views: post[0].views + 1, // Return updated view count
    };

    return NextResponse.json({ post: parsedPost }, { headers: corsHeaders });
  } catch (error) {
    console.error('Error fetching post:', error);
    return NextResponse.json(
      { error: 'Failed to fetch post' },
      { status: 500 }
    );
  }
}

// PUT /api/posts/[slug] - Update a post (admin only)
export async function PUT(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    // TODO: Add authentication check
    const { slug } = params;
    const body = await request.json();

    const updateData: Partial<typeof posts.$inferInsert> = {};
    if (body.title) updateData.title = body.title;
    if (body.excerpt) updateData.excerpt = body.excerpt;
    if (body.content) updateData.content = body.content;
    if (body.coverImage) updateData.coverImage = body.coverImage;
    if (body.tags) updateData.tags = JSON.stringify(body.tags);
    if (body.readTime) updateData.readTime = body.readTime;
    updateData.updatedAt = new Date();

    const updated = await db.update(posts)
      .set(updateData)
      .where(eq(posts.slug, slug))
      .returning();

    if (updated.length === 0) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404, headers: corsHeaders }
      );
    }

    // Parse tags for response
    const responsePost = {
      ...updated[0],
      tags: JSON.parse(updated[0].tags || '[]'),
    };

    return NextResponse.json({ post: responsePost }, { headers: corsHeaders });
  } catch (error) {
    console.error('Error updating post:', error);
    return NextResponse.json(
      { error: 'Failed to update post' },
      { status: 500 }
    );
  }
}

// PATCH /api/posts/[slug] - Update a post (admin only) - alias for PUT
export async function PATCH(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  return PUT(request, { params });
}

// DELETE /api/posts/[slug] - Delete a post (admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    // TODO: Add authentication check
    const { slug } = params;

    const deleted = await db.delete(posts)
      .where(eq(posts.slug, slug))
      .returning();

    if (deleted.length === 0) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404, headers: corsHeaders }
      );
    }

    return NextResponse.json({ message: 'Post deleted successfully' }, { headers: corsHeaders });
  } catch (error) {
    console.error('Error deleting post:', error);
    return NextResponse.json(
      { error: 'Failed to delete post' },
      { status: 500 }
    );
  }
}

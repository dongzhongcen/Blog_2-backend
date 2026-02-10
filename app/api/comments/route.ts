import { NextRequest, NextResponse } from 'next/server';
import { db, comments, posts } from '@/lib/db';
import { eq, desc } from 'drizzle-orm';
import { z } from 'zod';

// GET /api/comments?postId=xxx - Get comments for a post
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const postId = searchParams.get('postId');

    if (!postId) {
      return NextResponse.json(
        { error: 'postId is required' },
        { status: 400 }
      );
    }

    const postIdNum = parseInt(postId);
    if (isNaN(postIdNum)) {
      return NextResponse.json(
        { error: 'Invalid postId' },
        { status: 400 }
      );
    }

    const allComments = await db
      .select()
      .from(comments)
      .where(eq(comments.postId, postIdNum))
      .orderBy(desc(comments.createdAt));

    return NextResponse.json({ comments: allComments });
  } catch (error) {
    console.error('Error fetching comments:', error);
    return NextResponse.json(
      { error: 'Failed to fetch comments' },
      { status: 500 }
    );
  }
}

// POST /api/comments - Create a new comment
const createCommentSchema = z.object({
  postId: z.number(),
  author: z.string().min(1).max(100),
  content: z.string().min(1).max(1000),
  avatar: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = createCommentSchema.parse(body);

    // Check if post exists
    const post = await db
      .select()
      .from(posts)
      .where(eq(posts.id, validated.postId))
      .limit(1);

    if (post.length === 0) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      );
    }

    const newComment = await db
      .insert(comments)
      .values(validated)
      .returning();

    return NextResponse.json(
      { comment: newComment[0] },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.errors },
        { status: 400 }
      );
    }
    console.error('Error creating comment:', error);
    return NextResponse.json(
      { error: 'Failed to create comment' },
      { status: 500 }
    );
  }
}

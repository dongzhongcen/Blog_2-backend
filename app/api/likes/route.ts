import { NextRequest, NextResponse } from 'next/server';
import { db, posts, comments, postLikes, commentLikes } from '@/lib/db';
import { eq, and, sql } from 'drizzle-orm';
import { z } from 'zod';

// Helper to get IP address
function getIpAddress(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const realIp = request.headers.get('x-real-ip');
  return forwarded?.split(',')[0] || realIp || 'unknown';
}

// POST /api/likes - Like/unlike a post or comment
const likeSchema = z.object({
  type: z.enum(['post', 'comment']),
  id: z.number(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = likeSchema.parse(body);
    const ipAddress = getIpAddress(request);

    if (validated.type === 'post') {
      // Check if already liked
      const existingLike = await db
        .select()
        .from(postLikes)
        .where(
          and(
            eq(postLikes.postId, validated.id),
            eq(postLikes.ipAddress, ipAddress)
          )
        )
        .limit(1);

      if (existingLike.length > 0) {
        // Unlike: remove the like record and decrement count
        await db
          .delete(postLikes)
          .where(eq(postLikes.id, existingLike[0].id));
        
        await db
          .update(posts)
          .set({ likes: sql`GREATEST(${posts.likes} - 1, 0)` })
          .where(eq(posts.id, validated.id));

        return NextResponse.json({ liked: false });
      } else {
        // Like: add like record and increment count
        await db.insert(postLikes).values({
          postId: validated.id,
          ipAddress,
        });

        await db
          .update(posts)
          .set({ likes: sql`${posts.likes} + 1` })
          .where(eq(posts.id, validated.id));

        return NextResponse.json({ liked: true });
      }
    } else {
      // Comment like
      const existingLike = await db
        .select()
        .from(commentLikes)
        .where(
          and(
            eq(commentLikes.commentId, validated.id),
            eq(commentLikes.ipAddress, ipAddress)
          )
        )
        .limit(1);

      if (existingLike.length > 0) {
        // Unlike
        await db
          .delete(commentLikes)
          .where(eq(commentLikes.id, existingLike[0].id));
        
        await db
          .update(comments)
          .set({ likes: sql`GREATEST(${comments.likes} - 1, 0)` })
          .where(eq(comments.id, validated.id));

        return NextResponse.json({ liked: false });
      } else {
        // Like
        await db.insert(commentLikes).values({
          commentId: validated.id,
          ipAddress,
        });

        await db
          .update(comments)
          .set({ likes: sql`${comments.likes} + 1` })
          .where(eq(comments.id, validated.id));

        return NextResponse.json({ liked: true });
      }
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.errors },
        { status: 400 }
      );
    }
    console.error('Error handling like:', error);
    return NextResponse.json(
      { error: 'Failed to process like' },
      { status: 500 }
    );
  }
}

// GET /api/likes/check - Check if user has liked something
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') as 'post' | 'comment';
    const id = parseInt(searchParams.get('id') || '');
    const ipAddress = getIpAddress(request);

    if (!type || isNaN(id)) {
      return NextResponse.json(
        { error: 'Invalid parameters' },
        { status: 400 }
      );
    }

    if (type === 'post') {
      const existingLike = await db
        .select()
        .from(postLikes)
        .where(
          and(
            eq(postLikes.postId, id),
            eq(postLikes.ipAddress, ipAddress)
          )
        )
        .limit(1);

      return NextResponse.json({ liked: existingLike.length > 0 });
    } else {
      const existingLike = await db
        .select()
        .from(commentLikes)
        .where(
          and(
            eq(commentLikes.commentId, id),
            eq(commentLikes.ipAddress, ipAddress)
          )
        )
        .limit(1);

      return NextResponse.json({ liked: existingLike.length > 0 });
    }
  } catch (error) {
    console.error('Error checking like status:', error);
    return NextResponse.json(
      { error: 'Failed to check like status' },
      { status: 500 }
    );
  }
}

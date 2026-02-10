import { NextRequest, NextResponse } from 'next/server';
import { db, comments } from '@/lib/db';
import { eq } from 'drizzle-orm';

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

// Handle OPTIONS request for CORS
export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

// DELETE /api/comments/[id] - Delete a comment (admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // TODO: Add authentication check
    const { id } = params;
    const commentId = parseInt(id);

    if (isNaN(commentId)) {
      return NextResponse.json(
        { error: 'Invalid comment ID' },
        { status: 400, headers: corsHeaders }
      );
    }

    const deleted = await db.delete(comments)
      .where(eq(comments.id, commentId))
      .returning();

    if (deleted.length === 0) {
      return NextResponse.json(
        { error: 'Comment not found' },
        { status: 404, headers: corsHeaders }
      );
    }

    return NextResponse.json(
      { message: 'Comment deleted successfully' },
      { headers: corsHeaders }
    );
  } catch (error) {
    console.error('Error deleting comment:', error);
    return NextResponse.json(
      { error: 'Failed to delete comment' },
      { status: 500, headers: corsHeaders }
    );
  }
}

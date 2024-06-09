import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

import prisma from "@/lib/prisma";

export async function GET(
  req: Request,
  { params }: { params: { commentId: string } }
) {
  try {
    const { userId } = auth();
    if (!userId) return new NextResponse("Unauthenticated", { status: 401 });

    const url = new URL(req.url);
    const postId = url.searchParams.get("postId");

    if (!postId)
      return new NextResponse("Post ID is required", { status: 404 });

    const post = await prisma.post.findFirst({ where: { id: +postId } });
    if (!post) return new NextResponse("Post does not exist", { status: 404 });

    const comment = await prisma.comment.findFirst({
      where: { id: +params.commentId },
    });
    if (!comment)
      return new NextResponse("Comment does not exist", { status: 404 });

    const replies = await prisma.commentReply.findMany({
      include: {
        user: true,
        file: true,
        reactions: {
          where: { user_id: userId, reply_id: { not: null } },
          take: 1,
        },
        _count: {
          select: { reactions: { where: { reply_id: { not: null } } } },
        },
      },
      where: { post_id: +postId, comment_id: +params.commentId },
      orderBy: { created_at: "asc" },
    });

    return NextResponse.json(replies);
  } catch (err) {
    console.log("[COMMENT_REPLIES_GET]", err);
    return new NextResponse("Internal error", { status: 500 });
  }
}

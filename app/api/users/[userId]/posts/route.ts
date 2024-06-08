import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

import prisma from "@/lib/prisma";

export async function GET(
  req: Request,
  { params }: { params: { userId: string } }
) {
  try {
    const { userId: currentUserId } = auth();

    if (!currentUserId) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    const posts = await prisma.post.findMany({
      include: {
        user: true,
        group: true,
        file: true,
        reactions: {
          where: { user_id: currentUserId, comment_id: null, reply_id: null },
          take: 1,
        },
        _count: {
          select: {
            comments: true,
            reactions: { where: { comment_id: null, reply_id: null } },
          },
        },
      },
      where: { user_id: params.userId, group_id: null },
      orderBy: { created_at: "desc" },
    });

    return NextResponse.json(posts);
  } catch (err) {
    console.log("[USER_POSTS_GET]", err);
    return new NextResponse("Internal error", { status: 500 });
  }
}

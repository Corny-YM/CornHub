import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

import prisma from "@/lib/prisma";

export async function GET(
  req: Request,
  { params }: { params: { postId: string } }
) {
  try {
    const { userId } = auth();
    if (!userId) return new NextResponse("Unauthenticated", { status: 401 });

    const post = await prisma.post.findFirst({
      include: {
        user: true,
        group: true,
        file: true,
        reactions: {
          where: { user_id: userId, comment_id: null, reply_id: null },
          take: 1,
        },
        _count: {
          select: {
            comments: true,
            reactions: { where: { comment_id: null, reply_id: null } },
          },
        },
      },
      where: { id: +params.postId },
    });

    return NextResponse.json(post);
  } catch (err) {
    console.log("[POST_ID_GET]", err);
    return new NextResponse("Internal error", { status: 500 });
  }
}

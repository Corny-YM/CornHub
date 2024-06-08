import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

import prisma from "@/lib/prisma";

export async function GET(
  req: Request,
  { params }: { params: { groupId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 400 });
    }

    const group = await prisma.group.findFirst({
      where: { id: +params.groupId },
    });

    if (!group)
      return new NextResponse("Group does not exist", { status: 404 });

    const clause = group.approve_posts ? { approve: true } : {};

    const posts = await prisma.post.findMany({
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
      where: { group_id: +params.groupId, ...clause },
      orderBy: { created_at: "desc" },
    });

    return NextResponse.json(posts);
  } catch (err) {
    console.log("[GROUP_POSTS_GET]", err);
    return new NextResponse("Internal error", { status: 500 });
  }
}

import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

import prisma from "@/lib/prisma";

export async function GET(
  req: Request,
  { params }: { params: { postId: number; userId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId || userId !== params.userId) {
      return new NextResponse("Authenticated", { status: 400 });
    }

    const post = await prisma.post.findUnique({
      where: { id: +params.postId },
    });

    if (!post) return new NextResponse("Post doesn't exist", { status: 400 });

    const reaction = await prisma.reaction.findFirst({
      where: { post_id: +params.postId, user_id: params.userId },
    });

    return NextResponse.json(reaction);
  } catch (err) {
    console.log("[POST_COUNT_COMMENTS_GET]", err);
    return new NextResponse("Internal error", { status: 500 });
  }
}

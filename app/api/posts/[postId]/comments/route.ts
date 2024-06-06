import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

import prisma from "@/lib/prisma";

export async function GET(
  req: Request,
  { params }: { params: { postId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) return new NextResponse("Unauthenticated", { status: 400 });

    const post = await prisma.post.findUnique({
      where: { id: +params.postId },
    });

    if (!post) return new NextResponse("Post doesn't exist", { status: 400 });

    const comments = await prisma.comment.findMany({
      include: { user: true, file: true },
      where: { post_id: +params.postId },
    });

    return NextResponse.json(comments);
  } catch (err) {
    console.log("[POST_COMMENTS_GET]", err);
    return new NextResponse("Internal error", { status: 500 });
  }
}

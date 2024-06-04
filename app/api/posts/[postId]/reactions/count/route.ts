import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

import prisma from "@/lib/prisma";

export async function GET(
  req: Request,
  { params }: { params: { postId: number } }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 400 });
    }

    const post = await prisma.post.findUnique({
      where: { id: +params.postId },
    });

    if (!post) return new NextResponse("Post doesn't exist", { status: 400 });

    const count = await prisma.reaction.count({
      where: { post_id: +params.postId },
    });

    return NextResponse.json(count);
  } catch (err) {
    console.log("[POST_COUNT_REACTIONS_GET]", err);
    return new NextResponse("Internal error", { status: 500 });
  }
}
